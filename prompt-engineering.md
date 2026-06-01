# Prompt Engineering Techniques — Reference

For the Amazon SE / Intelligent Document Processing role: this is the toolkit for getting
reliable, structured output from LLMs in a compliance-validation pipeline.

> **Mental model:** an LLM does what the prompt *implies*. Prompt engineering = removing
> ambiguity so the implied task matches the intended task.

---

## Core techniques

### 1. Zero-shot
Ask directly, no examples. Relies on pretrained knowledge.
> `Classify this review as Positive or Negative: "{text}"`

- ✅ Fast, cheap, simple
- ❌ Less reliable for nuanced tasks or strict formatting

### 2. Few-shot
Provide a few input→output examples; the model copies the *pattern*.
> ```
> Review: "Loved it"        -> Positive
> Review: "Waste of money"  -> Negative
> Review: "It was fine"     -> ?
> ```
- Biggest single lever for **consistency** and **format** adherence.
- 2–5 well-chosen, diverse examples usually beats more.

### 3. Chain-of-Thought (CoT)
Instruct the model to reason step by step before answering.
> `Think step by step, then give the final answer.`
- Big accuracy gains on math, logic, multi-step extraction.
- Variant: **zero-shot CoT** = literally appending "Let's think step by step."

### 4. Role / persona
> `You are a senior GDPR compliance auditor. Review the document below for violations.`
- Sets tone, vocabulary, and focus.

### 5. Structured output
Demand a machine-parseable schema.
> `Respond ONLY with JSON: {"compliant": bool, "violations": [{"rule": str, "evidence": str}]}`
- Essential when downstream code parses the output.
- Pair with validation + a retry if the JSON is malformed.

### 6. Delimiters & clear instructions
Separate *instructions* from *data* using ```triple backticks```, XML tags, or `###`.
> ```
> Summarize the document between the tags.
> <doc>{content}</doc>
> ```
- Prevents the model from treating document text as instructions.
- A defense against **prompt injection** (malicious instructions hidden in input).

### 7. Retrieval-Augmented Generation (RAG)
Fetch relevant source docs and inject them as context instead of trusting model memory.
- Reduces **hallucination**; keeps answers grounded in *your* data.
- The key pattern for "validate compliance documents against regulations."
- Flow: embed docs → vector search for relevant chunks → stuff into prompt → answer with citations.

### 8. Prompt chaining / decomposition
Split a complex job into a sequence of focused prompts.
> extract fields → validate each field → summarize risks
- Each step is simpler, more testable, and less error-prone than one mega-prompt.

### 9. Self-consistency
Sample the model N times, take the **majority** answer.
- Trades cost for accuracy on hard reasoning. Good when correctness > latency/cost.

### 10. Constraints & guardrails
State what NOT to do, and how to handle uncertainty.
> `If a required field is missing, return null — do not guess.`
- Reduces confident-but-wrong answers (a compliance risk).

---

## Other useful levers

| Technique | What it does |
|-----------|--------------|
| **Temperature** | Lower (0–0.3) = deterministic/factual; higher = creative. Use low for extraction. |
| **System prompt** | Persistent role/rules separate from the user turn. |
| **Output priming** | Start the assistant's reply (e.g. with `{`) to force a format. |
| **Reference text** | "Answer using ONLY the text below; if not present, say 'not found'." Cuts hallucination. |
| **ReAct** | Reason + Act loop — interleave thinking with tool/function calls (agents). |
| **Step-back prompting** | Ask the model to first state general principles, then apply them. |

---

## Anti-hallucination checklist (matters for compliance)

1. Ground answers in retrieved/reference text (RAG).
2. Allow "I don't know" / `null` explicitly.
3. Ask for **evidence/citations** alongside each claim.
4. Use low temperature for factual extraction.
5. Validate structured output and retry on schema violations.

---

## How to answer "what is prompt engineering?" in an interview

> "It's designing the input to an LLM to reliably get the output you want. The core
> techniques are zero-shot and few-shot prompting, chain-of-thought for reasoning,
> structured output for machine-parseable results, and RAG to ground answers in real
> data and reduce hallucination. For a compliance use case I'd lean on RAG plus strict
> JSON output and explicit guardrails so the model returns evidence rather than guessing."
