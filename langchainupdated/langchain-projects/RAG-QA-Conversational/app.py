import streamlit as st
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables import RunnableWithMessageHistory


from dotenv import load_dotenv

load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


st.title("Conversation Rag with PDF upload and chat history")
st.write("Upload pdf and chat with the content")

api_key = st.text_input("Enter your groq api key", type="password")

if api_key:
    llm = ChatGroq(groq_api_key=api_key, model='llama-3.3-70b-versatile')
    session_id = st.text_input("Session ID", value="default_session")

    # statefully manage chat history (initialise the store only once)
    if 'store' not in st.session_state:
        st.session_state.store = {}

    uploaded_files = st.file_uploader("Choose PDf Files", type="pdf", accept_multiple_files=True)

    ## Process uploaded files
    if uploaded_files:
        documents = []

        for uploaded_file in uploaded_files:
            temppdf = "./temp.pdf"
            with open(temppdf, 'wb') as file:
                file.write(uploaded_file.getvalue())
                file_name = uploaded_file.name

            loader = PyPDFLoader(temppdf)
            docs = loader.load()
            documents.extend(docs)

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(documents)
        vectors = FAISS.from_documents(documents=splits, embedding=embeddings)
        retriver = vectors.as_retriever()

        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )

        contextualize_q_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )

        history_aware_retreiver = create_history_aware_retriever(llm, retriver, contextualize_q_prompt)

        # Answer question
        system_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer "
            "the question. If you don't know the answer, say that you "
            "don't know. Use three sentences maximum and keep the "
            "answer concise."
            "\n\n"
            "{context}"
        )

        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )

        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retreiver, question_answer_chain)

        def get_session_history(session_id: str) -> BaseChatMessageHistory:
            if session_id not in st.session_state.store:
                st.session_state.store[session_id] = ChatMessageHistory()
            return st.session_state.store[session_id]

        conversational_rag_chain = RunnableWithMessageHistory(
            rag_chain,
            get_session_history,
            input_messages_key="input",
            history_messages_key="chat_history",
            output_messages_key="answer",
        )

        user_input = st.text_input("Your question:")

        if user_input:
            session_history = get_session_history(session_id)
            response = conversational_rag_chain.invoke(
                {"input": user_input},
                config={"configurable": {"session_id": session_id}},
            )
            st.write("Assistant:", response['answer'])
            with st.expander("Chat History"):
                st.write(session_history.messages)
else:
    st.warning("Please enter your Groq API key to continue.")
