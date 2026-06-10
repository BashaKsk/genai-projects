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

## 4. MY STORY BANK (ordered to follow the 16 LPs above)

### 🗺️ ONE story per principle + the exact angle to emphasize
*(Stories repeat — that's fine. The key is the ANGLE you stress for each LP.)*

| # | Leadership Principle | Story | The angle to emphasize for THIS principle |
|---|----------------------|-------|-------------------------------------------|
| 1 | Customer Obsession | **Story 1** (OEE) | "I built split/merge **because that's how operators actually work** — I started from the user." |
| 2 | Ownership | **Story 2** (C-Trace) | "My CEO pulled me into **another team's** problem and I **took full ownership** of fixing it." |
| 3 | Invent and Simplify | **Story 6** (Pattern Intelligence) | "I **invented the segments-based Machine Timeline** — color-coded uptime/downtime/idle so users see machine state **at a glance**, instead of reading **forms** like before. Plus per-machine **load graphs**." |
| 4 | Are Right, A Lot | **Story 9** (schema) | "My **array-vs-flat** data-model judgment was right — it got adopted and held up." |
| 5 | Learn and Be Curious | **Story 3** (GenAI graph) | "**Never used Neo4j** — learned it from scratch (docs + course + demo), then shipped." |
| 6 | Hire and Develop the Best | **Story 4** (interns) | "Taught **design-first + patterns**; a couple got placed at **top MNCs**." |
| 7 | Insist on Highest Standards | **Story 5** (email bug) | "After the failure I built a **verify-every-feature-in-prod checklist** — raised the bar." |
| 8 | Think Big | **Story 6** (Pattern Intelligence) | "Turned a small **MVP into a full analytics product** with load graphs + insights." |
| 9 | Bias for Action | **Story 7** (same-day) | "**Same-day deadline** — I took it on and shipped it that day." |
| 10 | Frugality | **Story 7** (same-day) | "**Used AI tools** to deliver fast with limited time — more with less." |
| 11 | Earn Trust | **Story 5** (email bug) | "Owned the failure **transparently** — sent customers a **fallback email**." |
| 12 | Dive Deep | **Story 8** (PDF bug) | "**Root-caused** why charts were blank in Puppeteer PDFs (scripts not injected)." |
| 13 | Have Backbone; Disagree & Commit | **Story 9** (schema) | "Pushed back on a **senior dev with data**, respectfully — and would commit if overruled." |
| 14 | Deliver Results | **Story 6** (Pattern Intelligence) | "**Shipped** the full product; client got real-time machine visibility." |
| 15 | Strive to be Earth's Best Employer | **Story 4** (interns) | "**Invested in juniors' growth** — they advanced their careers." |
| 16 | Success & Scale → Broad Responsibility | **Story 6** (Pattern Intelligence) | "Built reports clients **rely on daily** — delivered responsibly at client scale." |

> 🔑 Same story, different **lens**. E.g. Story 5 = *Insist on Highest Standards* (the
> checklist) OR *Earn Trust* (the honest fallback email) — just emphasize the matching part.

---

### Story 1 — "OEE factory forms" → Customer Obsession (+ Invent & Simplify, Ownership, Dive Deep)
- **S:** I worked on an **OEE (Overall Equipment Efficiency)** system — a factory tool
  that tracks machine performance: availability, production counts, and downtime.
- **T:** I owned the **data-entry forms** factory operators use — a **downtime form**
  and a **production form**.
- **A:** I built features around how operators *actually* work:
  - **Downtime form:** a single downtime often spanned a long duration, but operators
    needed to **split it into segments and assign a distinct reason to each** part. I
    built a duration-splitting feature for exactly that.
  - **Production form:** with so many records, operators couldn't enter production
    counts efficiently — so I built a **"merge all"** feature to handle them in bulk.
- **R:** Shipped as an **MVP, tested with our first client — it was a success**, which
  became the foundation we built **Pattern Intelligence** on top of.
  ⚠️ [optional: add operator-level impact — faster/more accurate logging, if you have it]

### Story 2 — "Unblocked the C-Trace team" → Ownership (+ Bias for Action, Invent & Simplify, Dive Deep, Earn Trust)
- **S:** Another team was building **C-Trace** — lots of UI forms + APIs. The target was
  **one form per day**, but they were **badly lagging**. My **CEO pulled me in** to help.
- **T:** Get the team unblocked and back on pace.
- **A:** I dug into their frontend and backend and found the root causes: they weren't
  using key libraries like **React Hook Form**, the backend had **no design patterns**
  (e.g. strategy pattern), and they were building UI + backend **with no defined API
  response structures**. So I introduced a **process**: after the PRD, the team first
  writes a **TRD (Technical Requirement Document)** defining the **DB schema, the APIs,
  and mock API responses**. With the mock response agreed up front, **frontend and
  backend could build in parallel** against it, then just plug in the real API.
- **R:** This **unblocked the bottleneck** — frontend and backend no longer waited on
  each other, and the team's velocity recovered back toward the one-form-per-day target.
  ⚠️ [even stronger: "they delivered C-Trace on time" or "went from stalled to shipping
  in X days" — add if true]

### Story 3 — "GenAI seafood traceability graph" → Learn & Be Curious (+ Deliver Results, Ownership, Invent & Simplify)
*(KEYSTONE STORY — strongest for this AI role. LEAD WITH IT.)*
- **S:** In **C-Trace** (a **seafood/shrimp processing traceability** system), shrimp
  moves through stages — **beheading → grading → peeling → soaking** — and gets sorted
  into multiple grades. I was asked to build a **knowledge graph** in **Neo4j** that
  connects all those stages, plus a **GenAI chatbot** to answer questions about it. I'd
  **never used a graph database** before.
- **T:** Learn graph DBs well enough to design and ship the whole feature.
- **A:** Broke it into my two unknowns — **Neo4j** and **Cypher**. Learned via the
  **official docs** + a **Udemy course**, **built a small demo first** to de-risk,
  then built the real thing: **React** UI, **Python** backend, Cypher queries modeling
  the processing stages as connected nodes, and integrated a **GenAI chatbot** scoped to
  a specific **batch and PO (purchase order)**.
- **R:** Shipped & deployed end-to-end. Users can now **trace a shrimp batch across the
  entire processing pipeline just by looking at the connected nodes**, and **ask the
  chatbot questions about that batch/PO in plain English** — instead of manually tracking
  it through stages. The **CEO was impressed**.
- **Likely follow-up:** "Hardest part of learning the graph DB?" →
  "Shifting from SQL tables to nodes-and-relationships, and thinking in Cypher's
  pattern-matching syntax."

### Story 4 — "Mentoring interns" → Hire & Develop the Best (+ Insist on Highest Standards, Ownership, Earth's Best Employer)
- **S:** At my current company I **hired a couple of interns** and was responsible for
  training them to contribute to our work.
- **T:** Get them productive quickly and raise their engineering quality.
- **A:** I taught them to **design first, code second** — think through the design before
  jumping into code, which makes the coding cleaner later. I did regular **code reviews**
  with them, and grounded them in **design patterns** — strategy pattern, factory method, etc.
- **R:** The interns grew significantly — they **valued the mentorship**, and **a couple
  of them went on to get placed at top MNCs** after their time with us. The coding
  standards I taught (which I'd picked up working with **Canada clients**) raised their
  bar early in their careers.

### Story 5 — "Email reports broke (names→IDs migration)" → Insist on Highest Standards / FAILURE (+ Ownership, Learn & Be Curious, Earn Trust)
*(Use this for the "tell me about a failure" question — almost always asked.)*
- **S:** Our codebase filtered everything on machine **names**; I migrated it to
  **MongoDB IDs** for proper uniqueness. This touched our two report automations —
  **WhatsApp and email**.
- **T:** I owned the migration and verifying the reports still worked afterward.
- **A (the mistake):** I tested the **WhatsApp** report path after the change and it
  worked. I then **assumed email would behave identically** — so not only did I skip
  testing the email path, I **told the testers it didn't need re-testing.** *(Own it
  fully: my assumption, my call — don't blame the testers.)*
- **R (consequence + lesson):** The **email reports broke in production** — a
  customer-facing failure caused by my assumption. I owned it and fixed it
  **within ~30–60 minutes** (the working WhatsApp path made the fix fast to locate), and I
  **proactively sent customers a fallback email** owning that it was a technical issue on
  our end. **The lesson:** I never assume parity between similar-looking paths. Since then
  I keep a **spreadsheet/checklist and verify every feature in production after each
  deploy** — even the ones I'm sure about.

### Story 6 — "Pattern Intelligence" → Think Big (+ Customer Obsession, Deliver Results, Invent & Simplify, Success & Scale)
- **S:** After OEE succeeded as an MVP with our first client, we built **Pattern
  Intelligence** — a more advanced machine-analytics product built on top of OEE.
- **T:** I specifically built and owned the **segments module**, the **load graphs**,
  and the **automated email + WhatsApp report delivery** to customers.
- **A:** *(use "I" throughout)* The standout: I **invented a color-coded Machine
  Timeline** — **green = uptime, red = downtime, yellow = idle** — so users can see, at a
  glance, exactly **when each machine was up or down across the day**. **Before this, in
  OEE, users had to read through forms / raw data** to work that out. I also built the
  per-machine **load graphs** (electrical **IR & current values** across 24 hours and
  shifts), the **segment-based daily performance reports**, and **automated report
  delivery via both email AND WhatsApp** — meeting customers wherever they already were.
- 💡 *Invent & Simplify angle: I turned "read the forms/raw data" (OEE) into "glance at a
  color-coded timeline" (Pattern Intelligence). That before→after is the whole story.*
- **R:** It gave the client **at-a-glance machine visibility** — color-coded segment
  views (**red = downtime, green = uptime, yellow = idle**) and **load graphs** of
  **current & IR values across 24 hours and shifts** — plus **automated daily/weekly
  headline & consumption reports** (by email + WhatsApp) and an in-platform **feedback
  form**. This let the client **monitor machine health in real time and catch
  performance issues faster**, instead of digging through raw data.
  ⚠️ [even stronger if you can add a number: # of clients/machines, or downtime reduced]

### Story 7 — "Same-day shift-level deviation" → Bias for Action (+ Deliver Results, Ownership, Frugality)
- **S:** After customers logged downtime segments, we calculated a **deviation** metric.
  It was computed at the **day level**, but factory teams work in **shifts** — so they
  needed deviation at the **shift level** too, in batch.
- **T:** It had to be delivered **that same day** — a hard deadline. I **took it on
  myself** to build it.
- **A:** I built the **shift-level deviation calculation**. The tricky part: **shift
  timings vary**, so the batch logic had to handle changing shift windows, not a fixed
  day boundary. To move fast under the deadline, I **leveraged AI tools** to accelerate
  development without cutting corners.
- **R:** We **delivered it the same day** and it worked at shift level.
  ⚠️ [optional: confirm correctness / that the customer got exactly what they needed]
- 💡 *Using AI tools to hit a same-day deadline = Bias for Action + resourcefulness;
  great detail for an AI-focused role.*

### Story 8 — "PDF chart bug" → Dive Deep (or Failure, if it reached users)
- **S:** Built reports that rendered as HTML and could be downloaded as PDF.
- **A:** Charts rendered in HTML but were **blank in the PDF**. I dug in with
  **Puppeteer**, found the **chart scripts weren't injected into the window**
  during PDF generation, and fixed it by injecting them.
- **R:** [FILL: PDFs rendered correctly; used by ___]
- **Failure version (if the bug reached users):** the mistake = shipped without
  testing the PDF path → lesson = "now I test every output format/environment
  before shipping; added PDF export to the test checklist."

### Story 9 — "DB schema debate with senior dev" → Have Backbone; Disagree & Commit (+ Are Right A Lot, Dive Deep, Earn Trust)
- **S:** We were designing the **DB schema** for the downtime/segment feature. A **senior
  backend developer** (more experienced than me) wanted to keep **everything flat at the
  root** of the schema.
- **T:** As the full-stack dev who knew the feature's real requirements, I felt that
  structure wouldn't hold up — I needed to make the case for a better data model.
- **A:** Instead of just asserting my opinion, I **brought the data**: the downtime form
  has a **splitting feature** where one downtime can have **multiple reasons/regions**. A
  flat root schema couldn't represent that cleanly. So I argued **reasons should be an
  array** and **machine details a nested object**. We debated it **respectfully**, and I
  walked him through *why* the data model required it.
- **R:** We agreed on my structure — **reasons as an array, machine details as an
  object** — which fit the real requirements and made the data **cleaner and easier for
  the whole team** to work with.
- 💡 *Have Backbone = I spoke up (even to someone senior) with data, not opinion. If
  asked the "disagree & COMMIT" version, mention I'd fully support the team's final call
  even when it's not mine.*

---

## 5. "Tell me about yourself" (CCBP pattern)

*(Exact CCBP pattern: education → how I got into coding + tech → goal → why the
company + make lives better → initiative example + contribution + hobby.)*
- I am **Basha**. I completed my **bachelor's in Mechanical Engineering in 2022**.
- I developed a strong **interest in coding and AI**, and I learned technologies like
  **Python, JavaScript, React, Node.js**, and recently **GenAI with LangChain**. Today,
  I'm a **Senior Full Stack Developer**.
- My goal is to grow as a **software engineer who builds AI-powered, problem-solving
  products**.
- I was really attracted to **Amazon's work building customer-centric, AI-powered
  products** — and I've always wanted to **make people's lives easier with technology**.
- For example, I took the initiative to build a **seafood traceability system** using a
  **Neo4j knowledge graph and a GenAI chatbot** — I'd never used a graph database before,
  so I learned it from scratch and shipped it to production. So I feel I can **contribute
  to this team using my AI and full-stack skills** while growing as a professional. Apart
  from this, I **play cricket**.

> Flow (CCBP): education → coding interest + tech → goal → why Amazon + make lives
> better → initiative + contribution + hobby. Keep it ~60–90 sec, say it naturally.

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
