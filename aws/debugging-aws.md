# Debugging in AWS — Support Engineer Cheat-Sheet

> "How would you debug a problem in AWS?" is a near-certain question for this role.
> The answer hinges on knowing **CloudWatch** vs **CloudTrail** and a clear method.

---

## 🔑 CloudWatch vs CloudTrail (the #1 thing to get right)

| | **CloudWatch** 📊 | **CloudTrail** 🛡️ |
|---|------------------|--------------------|
| Answers | **"What is happening / how is it performing?"** | **"WHO did WHAT, and WHEN?"** |
| Tracks | **Logs, metrics, alarms** (performance & errors) | **API calls / actions** in your account (audit log) |
| Use for | Debugging app errors, latency, resource usage | Auditing, security, "what changed?" |
| Example | "Lambda threw an error" → CloudWatch Logs | "Who deleted that S3 bucket / changed that IAM role?" → CloudTrail |
| Analogy | The **dashboard + black-box recorder** | The **security camera / activity log** |

> **One-liner:** *"CloudWatch tells me how my system is **behaving** (logs, metrics, alarms); CloudTrail tells me **who did what** (an audit trail of every API call). I use CloudWatch to debug failures and CloudTrail to find what changed or who changed it."*

---

## 📊 CloudWatch — three things it gives you
1. **Logs** — text output from your apps/Lambdas (the first place to look for errors)
2. **Metrics** — numbers over time: CPU, memory, invocations, error count, latency, throttles
3. **Alarms** — notify/act when a metric crosses a threshold (e.g. error rate > 5%)

## 🛡️ CloudTrail — the audit trail
- Records **every API call** in the account: who (which user/role), what action, when, from where.
- Critical for: **"the system worked yesterday, what changed?"**, security investigations,
  compliance (ties to GDPR/HIPAA/SOX in the JD).
- Example: an app suddenly gets "Access Denied" → check CloudTrail to see if someone
  changed an IAM policy.

---

## 🪜 The standard AWS debugging method (say this step-by-step)

When something breaks in AWS, work it methodically:

1. **Understand the symptom** — what exactly is failing? error message, status code, which service?
2. **Check CloudWatch Logs** — the #1 first stop. Read the actual error/stack trace from
   the Lambda / app logs.
3. **Check CloudWatch Metrics & Alarms** — is it a spike in errors, latency, throttling,
   CPU/memory? Look at the timeline — *when* did it start?
4. **Check CloudTrail** — did a **config / permission / deployment change** happen right
   before it broke? Who changed what?
5. **Check IAM permissions** — "Access Denied" / 403 → a role or policy is missing a permission.
6. **Service-specific checks:**
   - **Lambda** → timeout? out of memory? cold start? check its CloudWatch log group.
   - **Step Functions** → open the **execution graph** — it shows which state failed + its input/output.
   - **API Gateway** → status code: **403** (auth), **429** (throttled), **502/504** (bad/slow backend).
   - **DynamoDB** → **throttling** (capacity exceeded)? a full **scan** instead of a key lookup?
   - **S3** → wrong key/bucket? permissions? region mismatch?
   - **EC2** → can't connect → **security group** (firewall) / SSH key; high CPU → metrics.
7. **Reproduce + isolate** — narrow down to the failing component, then fix and verify.
8. **(Bonus) AWS X-Ray** — distributed **tracing** across services; shows where a request
   slows down or fails in a multi-service flow.

---

## 🎤 Model answer: "How would you debug a failed request in our system?"
> *"First I'd look at **CloudWatch Logs** for the actual error and stack trace. I'd check
> **CloudWatch metrics** to see when it started and whether it's errors, latency, or
> throttling. If it worked before and suddenly broke, I'd check **CloudTrail** to see if a
> config or permission changed, and verify **IAM permissions** for access issues. Then I'd
> drill into the specific service — for a Lambda, check timeout/memory and its logs; for a
> Step Functions workflow, open the execution graph to see exactly which step failed. Once
> I've isolated it, I fix it and verify in production."*

> That answer = methodical + names the right tools = exactly what a Support Engineer interview wants.
