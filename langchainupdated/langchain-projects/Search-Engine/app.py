import streamlit as st 
from langchain_community.tools import ArxivQueryRun, WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper, ArxivAPIWrapper, DuckDuckGoSearchAPIWrapper
from langchain.agents import create_agent
from langchain_community.callbacks import StreamlitCallbackHandler
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import wikipedia
from datetime import timedelta

# Wikipedia now requires a proper User-Agent, else it returns HTTP 403 (which the
# old wikipedia package can't parse -> JSONDecodeError). Also rate-limit to be polite
# and avoid intermittent blocks when the agent makes repeated calls.
wikipedia.set_user_agent("genai-learning-app/1.0 (kskbasha777@gmail.com)")
wikipedia.set_rate_limiting(True, min_wait=timedelta(milliseconds=200))

api_wrapper_wiki = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=250)

wiki = WikipediaQueryRun(api_wrapper=api_wrapper_wiki)

arxiv_wrapper = ArxivAPIWrapper(top_k_results=1, doc_content_chars_max=250)

arxiv = ArxivQueryRun(api_wrapper=arxiv_wrapper)

search = DuckDuckGoSearchRun(name="Search")


st.title("🔎 Langchain - Chat with Search ")

"""
In this example, we're using `StreamlitCallbackHandler` to display the thoughts and
actions of an agent in an interactive Streamlit app.

This chatbot is an AI agent that can search the web (DuckDuckGo), Wikipedia, and Arxiv
to answer your questions in real time. Just enter your Groq API key in the sidebar and
start chatting!

Try more LangChain 🤝 Streamlit Agent examples at
[github.com/langchain-ai/streamlit-agent](https://github.com/langchain-ai/streamlit-agent).
"""

st.sidebar.title("Setting")
api_key = st.sidebar.text_input("Enter your groq api key", type="password")


# Initialize the chat history in the session the first time the app runs.
# st.session_state persists across reruns, so past messages aren't lost.
if "messages" not in st.session_state:
    st.session_state["messages"] = [
        {"role": "assistant", "content": "Hi, I'm a chatbot who can search the web. How can I help you?"}
    ]

# Replay all stored messages so the whole conversation shows on every rerun.
for msg in st.session_state.messages:
    st.chat_message(msg["role"]).write(msg["content"])


# := (walrus) grabs the typed text into `prompt` AND checks it's not empty in one line.
if prompt := st.chat_input(placeholder="What is machine learning?"):
    # Need the API key before we can build the model. Stop early if it's missing.
    if not api_key:
        st.info("Please add your Groq API key in the sidebar to continue.")
        st.stop()

    # 1. Save the user's message and show it
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)

    # 2. Build the model (with the sidebar key) and the agent with all the tools.
    #    openai/gpt-oss models format tool calls correctly (unlike llama on Groq).
    # max_tokens caps the answer length to stay under Groq's free-tier TPM limit.
    llm = ChatGroq(model='openai/gpt-oss-20b', temperature=0,
                   api_key=api_key, max_tokens=800)
    tools = [search, arxiv, wiki]
    # Strong system prompt: clear routing rules + token discipline (free tier is
    # 8k tokens/min), while still showing one live tool-calling step.
    system_prompt = (
        "You are a research search assistant with three tools. Choose the SINGLE "
        "best tool for each question using these rules:\n"
        "- arxiv: for research papers, scientific studies, preprints, or academic "
        "topics (e.g. 'the Attention Is All You Need paper', deep learning research).\n"
        "- wikipedia: for general knowledge, definitions, people, places, history, "
        "or 'what is X' questions.\n"
        "- web search: for current events, news, recent info, or anything not "
        "covered above.\n\n"
        "Rules:\n"
        "1. Call exactly ONE tool per question — never make repeated or redundant calls.\n"
        "2. Base your answer strictly on the tool result; do not invent facts.\n"
        "3. Answer concisely and clearly. If the tool returns nothing useful, say so."
    )
    # No AgentType needed in v1 — create_agent uses native tool-calling automatically.
    agent = create_agent(model=llm, tools=tools, system_prompt=system_prompt)

    # 3. Run the agent inside an assistant bubble.
    #    agent.stream() lets us render each step live (like the old callback did),
    #    but in the MAIN thread, so it works with LangGraph (no NoSessionContext error).
    with st.chat_message("assistant"):
        answer = ""
        # map each tool call's id -> its st.status box, so we can fill in the
        # result when the tool comes back (gives the "spinner -> checkmark" feel).
        tool_boxes = {}

        for chunk in agent.stream(
            {"messages": st.session_state.messages}, stream_mode="updates"
        ):
            # each chunk looks like {node_name: {"messages": [...]}}
            for node_output in chunk.values():
                for msg in node_output.get("messages", []):
                    cls = msg.__class__.__name__

                    # (a) the model decided to call a tool -> open a status box
                    for tc in getattr(msg, "tool_calls", []):
                        query = tc["args"].get("query", tc["args"])
                        box = st.status(f"🔧 **{tc['name']}**: searching `{query}`",
                                        expanded=False)
                        # remember both the box and the query so we can keep them on finish
                        tool_boxes[tc["id"]] = (box, query)

                    # (b) the tool returned -> fill its box and mark it complete
                    if cls == "ToolMessage":
                        entry = tool_boxes.get(msg.tool_call_id)
                        if entry is not None:
                            box, query = entry
                            box.write(msg.content)
                            # keep tool name + query in the label, no check emoji
                            box.update(label=f"**{msg.name}**: `{query}`",
                                       state="complete")

                    # (c) the final answer (AIMessage with text and no tool calls)
                    if cls == "AIMessage" and msg.content \
                            and not getattr(msg, "tool_calls", []):
                        answer = msg.content

        # 4. Save the assistant's reply and show it
        st.session_state.messages.append({"role": "assistant", "content": answer})
        st.write(answer)

