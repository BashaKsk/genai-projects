"""
PROMPT ENGINEERING — examples of every technique (LangChain 1.x)
Run:  uv run python promptengineering.py

All examples use ONE relatable task (great for a Support Engineer role):
    "Analyze and respond to a CUSTOMER SUPPORT TICKET."

You know RAG already — these are the rest. Each function = one technique.
"""

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field

load_dotenv()

# Low temperature = factual & consistent. (Swap to "google_genai:gemini-2.5-flash-lite"
# if your OpenAI key is out of quota.)
model = init_chat_model("openai:gpt-4o-mini", temperature=0)

# A sample support ticket we'll reuse:
TICKET = "I was charged twice for my subscription this month and I'm really frustrated. Fix it ASAP."


# ============================================================
# 1) ZERO-SHOT — just ask, no examples
# ============================================================
def zero_shot():
    prompt = f"Is this support ticket urgent? Answer Yes or No.\n\nTicket: '{TICKET}'"
    print("1) ZERO-SHOT:", model.invoke(prompt).content)


# ============================================================
# 2) FEW-SHOT — give a few examples so the model copies the pattern
# ============================================================
def few_shot():
    prompt = f"""Classify each ticket's category: Billing, Technical, or Account.

Ticket: "My password reset link doesn't work." -> Technical
Ticket: "I want to change my email address." -> Account
Ticket: "Why was I charged twice?" -> Billing
Ticket: "{TICKET}" -> ?"""
    print("2) FEW-SHOT:", model.invoke(prompt).content)


# ============================================================
# 3) CHAIN-OF-THOUGHT — ask it to reason step by step
# ============================================================
def chain_of_thought():
    prompt = f"""Decide this ticket's priority. Think step by step:
1) what is the customer's problem, 2) how badly does it affect them,
3) then give a final priority (Low / Medium / High).

Ticket: "{TICKET}"
"""
    print("3) CHAIN-OF-THOUGHT:\n", model.invoke(prompt).content)


# ============================================================
# 4) SYSTEM / ROLE PROMPTING — set persona + rules up front
# ============================================================
def system_prompt():
    messages = [
        SystemMessage(
            "You are a polite customer-support assistant. Be empathetic and concise. "
            "Never promise a refund you can't authorize — instead say it will be reviewed."
        ),
        HumanMessage(f"Draft a reply to this ticket: '{TICKET}'"),
    ]
    print("4) SYSTEM PROMPT:\n", model.invoke(messages).content)


# ============================================================
# 5) STRUCTURED OUTPUT — force a schema so your code can PARSE it
#    (critical for routing tickets automatically in a pipeline)
# ============================================================
class TicketAnalysis(BaseModel):
    category: str = Field(description="Billing, Technical, Account, or General")
    priority: str = Field(description="Low, Medium, or High")
    needs_human: bool = Field(description="True if a human agent should handle it")
    summary: str = Field(description="One-line summary of the issue")

def structured_output():
    structured_model = model.with_structured_output(TicketAnalysis)
    result = structured_model.invoke(f"Analyze this support ticket: '{TICKET}'")
    print("5) STRUCTURED OUTPUT:", result)   # a typed TicketAnalysis object


# ============================================================
# 6) PROMPT CHAINING — split a big task into linked smaller prompts
#    (output of step 1 becomes input to step 2)
# ============================================================
def prompt_chaining():
    long_ticket = ("Hi, two issues: the app crashes when I open Reports, "
                   "and I was also double-charged this month. Please help.")

    # Step 1: extract the distinct problems
    extract = ChatPromptTemplate.from_template(
        "List each separate problem in this ticket as a numbered list:\n{ticket}"
    )
    problems = (extract | model).invoke({"ticket": long_ticket}).content

    # Step 2: feed step-1 output into step-2 (suggest next action per problem)
    resolve = ChatPromptTemplate.from_template(
        "For each problem, suggest the team to route it to and the next step:\n{problems}"
    )
    plan = (resolve | model).invoke({"problems": problems}).content
    print("6) PROMPT CHAINING:\n", plan)


# ============================================================
# 7) SELF-CONSISTENCY — ask several times, take the majority answer
# ============================================================
def self_consistency():
    prompt = f"Priority of this ticket in ONE word (Low/Medium/High): '{TICKET}'"
    answers = [model.invoke(prompt).content.strip() for _ in range(3)]
    verdict = max(set(answers), key=answers.count)   # majority vote
    print("7) SELF-CONSISTENCY: votes =", answers, "-> majority:", verdict)


# ============================================================
# 8) GUARDRAILS — explicit rules to PREVENT hallucination
# ============================================================
def guardrails():
    messages = [
        SystemMessage(
            "Rules: (1) Only use facts in the ticket. "
            "(2) If key info is missing, ask the customer for it. "
            "(3) Do NOT invent order numbers, dates, or amounts."
        ),
        HumanMessage("Ticket: 'My order is late.' Write a reply."),
    ]
    print("8) GUARDRAILS:\n", model.invoke(messages).content)


if __name__ == "__main__":
    # Comment out any you don't want to run (each is one API call).
    zero_shot()
    few_shot()
    chain_of_thought()
    system_prompt()
    structured_output()
    prompt_chaining()
    self_consistency()
    guardrails()

# ============================================================
# 🧠 RAG (you already know this) would slot in BEFORE the prompt:
#    1. embed the customer's question
#    2. retrieve relevant help-center articles from a vector store
#    3. inject them into the prompt as context
#    -> the reply is grounded in real docs (less hallucination)
#
# FINE-TUNING = retrain the model on labeled past tickets. Last
#    resort — only when prompting + RAG aren't enough.
# ============================================================
