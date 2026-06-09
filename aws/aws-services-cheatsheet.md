# AWS Services Cheat-Sheet — Support Engineer (Intelligent Document Processing)

> For the Amazon phone screen. Know **what each does**, a **plain analogy**, and
> **how you'd troubleshoot it** (this is a Support Engineer role — debugging is the job).

---

## 🪣 S3 (Simple Storage Service) — *object storage*

- **What:** Stores files ("objects") — images, PDFs, documents, backups — in
  "buckets". Virtually unlimited, highly durable (11 nines), accessed via a URL/key.
- **Analogy:** An infinite cloud Google Drive for your app, accessed by code.
- **In your role:** Compliance **documents/PDFs get uploaded to S3**, then processed.
- **Key facts:** Object storage (NOT a file system, NOT a database). Buckets have
  globally-unique names. Common trigger source (an upload can fire a Lambda).
- **Troubleshoot:** "File not found" → wrong key/bucket or **IAM permissions**;
  "Access Denied" → bucket policy / IAM role; slow → wrong region.

---

## ⚡ Lambda — *serverless functions*

- **What:** Runs your code **without managing servers**. You upload a function; it
  runs **on an event** (file uploaded, API called) and you pay only per execution.
- **Analogy:** A vending machine for code — insert an event, it runs once, stops.
- **In your role:** A PDF lands in S3 → **Lambda triggers** → calls the LLM/ML model
  to validate the document → writes the result to DynamoDB.
- **Key facts:** Event-driven, auto-scales, stateless, has a **timeout** (max 15 min)
  and memory limit. "Serverless" = no server *you* manage (AWS runs it).
- **Troubleshoot:** **Timeout** (function too slow / waiting on something);
  **cold start** (first call slow); errors/permissions → check **CloudWatch Logs**.

---

## 🗄️ DynamoDB — *NoSQL database*

- **What:** A fully-managed **NoSQL** key-value / document database. Super fast,
  scales massively, single-digit-millisecond reads.
- **Analogy:** A giant, instant dictionary (key → value) that never slows down.
- **In your role:** Store **validation results / document metadata / statuses**.
- **Key facts:** NoSQL (no SQL joins/tables-with-schemas like a relational DB).
  Data accessed by **primary key**. Great for high-scale, simple lookups.
- **Troubleshoot:** **Throttling** (exceeded read/write capacity); slow query →
  likely a **scan instead of a key lookup**; "item not found" → wrong key.

---

## 🚪 API Gateway — *the managed front door for APIs*

- **What:** A fully-managed service to **create, publish, and secure APIs**. It
  receives HTTP requests from clients and routes them to Lambda / backend services.
- **Analogy:** A receptionist — takes incoming requests, checks them, routes them
  to the right room (Lambda/service), sends the response back.
- **In your role:** Internal teams/clients call the **compliance-validation API**
  → API Gateway → Lambda. Handles auth, rate-limiting, request validation.
- **Key facts:** Sits in front of Lambda/EC2. Does throttling, auth (API keys,
  Cognito), request/response mapping.
- **Troubleshoot:** **403** (auth / API key); **429** (throttled / rate limit);
  **502/504** (bad/slow Lambda response behind it); CORS errors for front-end calls.

---

## 📊 CloudWatch — *monitoring & logging (your #1 debugging tool)*

- **What:** Collects **logs, metrics, and alarms** for all your AWS services.
  When something breaks, **this is where you look first.**
- **Analogy:** The dashboard + black-box recorder of your whole system.
- **In your role:** As a Support Engineer, you'll **live in CloudWatch Logs** to
  trace why a document validation failed — read Lambda logs, set alarms.
- **Key facts:** **Logs** (text output), **Metrics** (numbers like CPU, invocations,
  errors), **Alarms** (notify when a metric crosses a threshold).
- **Troubleshoot:** It IS the troubleshooting tool — "check CloudWatch Logs" is the
  single most useful answer to "how would you debug a Lambda failure?"

---

## 🖥️ EC2 (Elastic Compute Cloud) — *virtual servers*

- **What:** Rentable **virtual machines** in the cloud. You pick the OS, CPU, RAM,
  and YOU manage it (patching, scaling). The "traditional server" option.
- **Analogy:** Renting a computer in Amazon's data center that you fully control.
- **Lambda vs EC2:** Lambda = serverless, runs on events, no management. EC2 = a
  full server you run and manage 24/7. Use EC2 for long-running / always-on apps.
- **Key facts:** You manage the OS/scaling. Instance types (compute/memory optimized).
- **Troubleshoot:** Can't connect → **security group** (firewall) / SSH key;
  high CPU → check CloudWatch metrics; out of memory → wrong instance size.

---

## 🔀 Step Functions — *workflow orchestration*

- **What:** Coordinates **multiple steps** (often multiple Lambdas) into a visual
  **state machine** — handles order, branching, retries, and error handling.
- **Analogy:** A flowchart that runs itself: do step 1 → if OK do step 2 → else retry.
- **In your role:** A document-validation **pipeline**: extract text → run LLM
  analysis → check compliance rules → store result → notify. Step Functions
  **orchestrates** those Lambdas with built-in retries.
- **Key facts:** Manages multi-step workflows so you don't hand-code the glue/retries.
  Each step is a "state". Great for long or complex processes.
- **Troubleshoot:** A step "failed" → open the **execution graph** (it shows exactly
  which state failed + input/output); stuck → a state waiting/timing out.

---

## 🧩 HOW THEY FIT TOGETHER — your role's likely pipeline

```
   Client/team
       │  HTTP request
       ▼
  API Gateway  ──►  Lambda  ──►  reads document from  S3
       │                              │
       │                              ▼
       │                     Step Functions orchestrates:
       │                       extract → LLM validate → rules check
       │                              │
       │                              ▼
       │                        DynamoDB (store results)
       │
       └──────────  everything logs to  CloudWatch  ◄── you debug here
   (EC2 = used when something needs an always-on server instead of Lambda)
```

> **One-liner story for the interview:**
> *"A compliance document is uploaded to **S3**, which triggers a **Lambda**.
> **Step Functions** orchestrates the validation pipeline — extract, run the
> **LLM** check, apply compliance rules — and results go into **DynamoDB**.
> Internal teams query it through **API Gateway**, and I'd use **CloudWatch
> Logs** to troubleshoot any failure in that chain."*

---

## 🎯 Interview-ready summaries (memorize these)

| Service | One line |
|---------|----------|
| **S3** | Object storage for files (buckets + keys) |
| **Lambda** | Serverless functions that run on events, no servers to manage |
| **DynamoDB** | Fast, scalable NoSQL key-value database |
| **API Gateway** | Managed front door that routes/secures API requests to backends |
| **CloudWatch** | Logs, metrics & alarms — where you go to debug |
| **EC2** | Virtual servers you rent and manage (always-on compute) |
| **Step Functions** | Orchestrates multi-step workflows (state machine) with retries |

**The two comparisons they love:**
- **Lambda vs EC2:** serverless/event-driven/no-management vs full server you manage
- **DynamoDB (NoSQL) vs RDS (SQL):** key-value, massive scale vs relational tables + joins
