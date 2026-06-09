# Amazon Leadership Principles & Behavioral Prep — Basha

> For the phone screen (June 11). ~⅓ of the interview is behavioral / LP.
> Friend's tip: they ask a lot about Leadership Principles.

---

## 1. The STAR framework (use for EVERY behavioral answer)

| Letter | What | How long |
|--------|------|----------|
| **S** — Situation | Set the context briefly | 1–2 sentences |
| **T** — Task | What **you** needed to do | 1 sentence |
| **A** — Action | What **YOU** specifically did | **the bulk — ~60%** |
| **R** — Result | The outcome, **quantified** | 1–2 sentences |

### ⚠️ The 4 most common STAR mistakes
1. Saying **"we"** instead of **"I"** — they want YOUR contribution.
2. Spending too long on Situation — get to your **Actions** fast.
3. **No Result / no numbers** — always close with the outcome (quantify if possible).
4. Picking a weak story — choose ones with real challenge and a clear role for you.

> Golden rules: **Answer the exact question asked. Never say "idk" — reason aloud.
> Use "I". Always land a concrete Result.**

---

## 2. The Story Bank strategy 🏦

Prepare **5–6 strong stories** and **flex each to multiple LPs**. You don't need
16 stories — one good project can cover 3–4 principles.

---

## 3. The 16 Leadership Principles (what each tests + a sample question)

| # | Principle | What it tests | Sample question |
|---|-----------|---------------|-----------------|
| 1 | **Customer Obsession** | Start from the customer, work backward | "Time you went above & beyond for a user" |
| 2 | **Ownership** | Take responsibility beyond your role | "Time you took on something outside your job" |
| 3 | **Invent and Simplify** | Find simpler/innovative solutions | "Time you simplified a complex process" |
| 4 | **Are Right, A Lot** | Good judgment & instincts | "A tough decision you made with limited data" |
| 5 | **Learn and Be Curious** | Keep learning & growing | "Time you learned something new to solve a problem" |
| 6 | **Hire and Develop the Best** | Raise others up | "Time you mentored/helped a teammate" |
| 7 | **Insist on Highest Standards** | Refuse to lower the bar | "Time you weren't satisfied with 'good enough'" |
| 8 | **Think Big** | Bold, long-term vision | "A big idea you proposed" |
| 9 | **Bias for Action** | Move fast, decide with incomplete info | "Time you had to act quickly" |
| 10 | **Frugality** | Do more with less | "Time you achieved a lot with limited resources" |
| 11 | **Earn Trust** | Build trust, listen, be honest | "Time you earned a team's trust / gave hard feedback" |
| 12 | **Dive Deep** | Dig into details, find root cause | "Time you solved a problem by getting into the details" |
| 13 | **Have Backbone; Disagree & Commit** | Challenge respectfully, then commit | "Time you disagreed with your manager/team" |
| 14 | **Deliver Results** | Get it done despite obstacles | "Time you met a tough deadline" |
| 15 | **Strive to be Earth's Best Employer** | Care for team/growth | "Time you improved a team's experience" |
| 16 | **Success and Scale Bring Broad Responsibility** | Act thoughtfully on impact | "Time you considered the wider impact of your work" |

**Most likely in a phone screen:** Customer Obsession, Ownership, Dive Deep,
Bias for Action, Learn and Be Curious, Deliver Results.

---

## 4. MY STORY BANK (draft — fill the [brackets])

### Story A — "Unblocked another team" → Ownership, Bias for Action, Earn Trust
- **S:** Another team was building [what feature] and was behind / about to miss a
  deadline that mattered because [why].
- **T:** I was brought in to get them unblocked and back on track.
- **A:** I found the real issue wasn't coding — they were **stuck on decisions**.
  So I drove the design: defined **mock API responses** and the **DB structure**
  from the PRD, recommended **react-hook-form** and clear **design patterns in
  Nest.js**, designed the APIs, and handed them a clear blueprint to execute.
- **R:** ⚠️ [FILL: did they deliver? on time? how many days saved? what shipped?]

### Story B — "GenAI traceability graph" → Learn & Be Curious, Deliver Results, Ownership
*(KEYSTONE STORY — strongest for this AI role)*
- **S:** Asked to build a **requirements traceability graph** using **Neo4j** with a
  **GenAI chatbot** to answer questions about the trace. I'd **never used a graph
  database** before.
- **T:** Learn graph DBs well enough to design and ship the whole feature.
- **A:** Broke it into my two unknowns — **Neo4j** and **Cypher**. Learned via the
  **official docs** + a **Udemy course**, **built a small demo first** to de-risk,
  then built the real thing: **React** UI, **Python** backend, Cypher queries, and
  integrated the **GenAI** chatbot.
- **R:** Shipped & deployed end-to-end. The **CEO was impressed**.
  ⚠️ [ADD impact: what did it let users DO? e.g. "trace X across systems in seconds"]
- **Likely follow-up:** "Hardest part of learning the graph DB?" →
  "Shifting from SQL tables to nodes-and-relationships, and thinking in Cypher's
  pattern-matching syntax."

### Story C — "PDF chart bug" → Dive Deep (or Failure, if it reached users)
- **S:** Built reports that rendered as HTML and could be downloaded as PDF.
- **A:** Charts rendered in HTML but were **blank in the PDF**. I dug in with
  **Puppeteer**, found the **chart scripts weren't injected into the window**
  during PDF generation, and fixed it by injecting them.
- **R:** [FILL: PDFs rendered correctly; used by ___]
- **Failure version (if the bug reached users):** the mistake = shipped without
  testing the PDF path → lesson = "now I test every output format/environment
  before shipping; added PDF export to the test checklist."

### Story D — [Deadline / Deliver Results] → [FILL a real one]
### Story E — [Disagreement / Earn Trust / Backbone] → [FILL a real one]
### Story F — [Failure with a clear lesson] → [FILL — almost always asked]

---

## 5. "Tell me about yourself" (CCBP pattern)

- I am **Basha**, completed my **bachelor's in [degree] in [year] from [college]**.
- I developed a strong interest in **software development and AI**, building
  real-world apps with **Python, React JS, Node.js, SQL**, and recently **GenAI/LLMs**.
- My goal is to grow as a **software/AI engineer** building **intelligent,
  problem-solving systems**.
- I was attracted to Amazon's work building **AI-powered, customer-centric
  products** — especially **using LLMs to solve real problems at scale**, like this
  Intelligent Document Processing team.
- For example, I took the initiative to build a **traceability system** with
  **Neo4j + a GenAI chatbot** — learned Neo4j/Cypher from scratch, built it
  end-to-end, shipped to production, and the **CEO was impressed**.
- Apart from this, I'm a **[hobby]**.

> Keep it ~60–90 sec. End on "why this role." Practice out loud, don't memorize.

---

## 6. Questions to ASK the interviewer (always have 2–3)
- "What does a typical day look like for this team?"
- "What are the biggest technical challenges the team is solving right now?"
- "How is success measured in this role in the first 6 months?"
- "How does the team use LLMs today, and where is it heading?"

---

## 7. Pre-interview checklist (June 11, 11 AM IST)
- [ ] Test Zoom + screen share at amazon.zoom.us/test
- [ ] Use a headset; quiet room; stable internet
- [ ] Join AT the start time (room times out after 10 min)
- [ ] Have intro + 5-6 STAR stories ready (with RESULTS filled in)
- [ ] Have 2-3 questions ready to ask
- [ ] Backup: interviewer can call mobile if tech fails
