# Prompt Engineering Cheat-Sheet — for the LLM Support Engineer role

> You know RAG. Here are the rest, with **what / why / when**, tied to your role
> (validating compliance documents with LLMs).

---

## The big picture: 3 ways to make an LLM do what you want

| Approach | What it is | Cost | When |
|----------|-----------|------|------|
| **Prompt engineering** | Craft the input text cleverly | Cheapest, instant | Default — try this first |
| **RAG** (you know this) | Retrieve relevant docs, inject into the prompt | Medium | When the model needs *your* data/knowledge |
| **Fine-tuning** | Retrain the model on your examples | Expensive, slow | When prompting+RAG aren't enough; need a specialized behavior |

> 🔑 The JD mentions **fine-tuning** — know the difference: *prompting changes the
> input, RAG adds knowledge at query time, fine-tuning changes the model itself.*

---

## Core prompt-engineering techniques

### 1. Zero-shot prompting
- **What:** Just ask directly, no examples. *"Is this document GDPR-compliant? Yes/No."*
- **When:** Simple tasks the model already understands.

### 2. Few-shot prompting (in-context learning)
- **What:** Give a **few examples** in the prompt so the model copies the pattern.
- **Example:**
  ```
  Doc: "We store data forever." → Non-compliant (no retention limit)
  Doc: "Data deleted after 30 days." → Compliant
  Doc: "<new document>" → ?
  ```
- **When:** The model needs to see the expected format/judgment. Hugely effective.

### 3. Chain-of-Thought (CoT)
- **What:** Tell it to **"think step by step"** / reason before answering.
- **Why:** Big accuracy boost on reasoning tasks (rules, math, multi-step logic).
- **Your role:** *"Check each compliance rule one by one, explain your reasoning, then give the verdict."* → fewer wrong judgments.

### 4. RAG (Retrieval-Augmented Generation) — *you know this*
- **What:** Retrieve relevant chunks (e.g. the actual GDPR regulation text) from a
  vector DB and inject them into the prompt, so the model answers from real data.
- **Why:** Reduces hallucination, grounds answers in source documents, no retraining.

### 5. System / role prompting
- **What:** Set the model's **persona and rules** up front (the "system prompt").
- **Example:** *"You are a compliance auditor. Only cite rules from the provided text. If unsure, say 'needs human review'."*
- **Why:** Controls tone, scope, and guardrails for every response.

### 6. Structured output
- **What:** Force the answer into a **fixed format** (JSON, a schema).
- **Example:** *"Respond ONLY as JSON: {compliant: bool, violations: [], confidence: number}"*
- **Why:** So your code can **parse** it reliably (critical for an automated pipeline).

### 7. Prompt chaining
- **What:** Break a big task into **multiple smaller prompts**, feeding each output
  into the next. (Extract clauses → check each → summarize.)
- **Why:** More reliable than one giant prompt; easier to debug each step.

### 8. ReAct (Reason + Act) — agentic
- **What:** The model **reasons**, then **takes an action** (calls a tool / API),
  sees the result, reasons again. Basis of "AI agents."
- **Why:** Lets the LLM use tools (look up a regulation, query a DB) mid-task.

### 9. Self-consistency
- **What:** Ask the same question **multiple times**, take the **majority answer**.
- **Why:** Reduces random errors on hard judgments. (More cost, higher reliability.)

### 10. Guardrails / constraints
- **What:** Explicit rules to prevent bad output: *"Don't guess. If the document
  doesn't contain the info, say 'not found'. Never invent a rule."*
- **Why:** Critical in **compliance** — a hallucinated "compliant" verdict is dangerous.

---

## Key parameters (not prompting, but asked alongside)

| Parameter | Effect |
|-----------|--------|
| **Temperature** | Randomness. **Low (0–0.2)** = factual/consistent (use for compliance!). High = creative. |
| **Max tokens** | Caps response length |
| **Top-p** | Alternative randomness control (nucleus sampling) |

> For **compliance validation** you want **low temperature** → deterministic, repeatable answers. Mention this — it shows judgment.

---

## How this maps to YOUR role (say this in the interview)

> *"For validating compliance documents I'd combine techniques: **RAG** to pull the
> actual regulation text so answers are grounded, **few-shot** examples of
> compliant vs non-compliant clauses, **chain-of-thought** so it reasons through
> each rule, **structured JSON output** so the pipeline can parse the verdict, and
> **guardrails** plus **low temperature** so it doesn't hallucinate a compliance
> judgment. If prompting + RAG still fell short on a specialized pattern, I'd
> consider **fine-tuning**."*

---

## 🎤 Quick-fire definitions (memorize)

- **Zero-shot** = ask, no examples
- **Few-shot** = ask with a few examples
- **Chain-of-Thought** = "think step by step"
- **RAG** = retrieve real docs → inject into prompt → grounded answer
- **System prompt** = set persona + rules
- **Structured output** = force JSON/schema
- **Prompt chaining** = split into multiple linked prompts
- **ReAct** = reason + use tools (agents)
- **Self-consistency** = sample many, take majority
- **Guardrails** = rules to prevent hallucination
- **Fine-tuning** = retrain the model itself (last resort, expensive)
- **Temperature** = randomness dial (low = factual)
