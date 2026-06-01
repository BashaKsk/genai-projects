# HTTP Status Codes — Support Engineer Reference

Status codes are grouped by their **first digit**. Memorize the *families* first; the
specific codes follow naturally.

| Family | Meaning | Whose "fault"? |
|--------|---------|----------------|
| **1xx** | Informational — request received, still processing | — |
| **2xx** | Success — it worked | — |
| **3xx** | Redirection — go look somewhere else | — |
| **4xx** | Client error — **the caller** sent something wrong | Client |
| **5xx** | Server error — **the server** failed to fulfill a valid request | Server |

> The single most useful instinct: **4xx = blame the request, 5xx = blame the server.**
> When debugging "intermittent 500s," you're firmly in server-side territory.

---

## 1xx — Informational (rare in day-to-day support)

| Code | Name | Notes |
|------|------|-------|
| 100 | Continue | Client can proceed sending the request body |
| 101 | Switching Protocols | e.g. upgrading HTTP → WebSocket |

---

## 2xx — Success

| Code | Name | When you see it |
|------|------|-----------------|
| **200** | OK | Standard success (GET/PUT) |
| **201** | Created | Resource created (POST) — should return the new resource/location |
| 202 | Accepted | Request queued, processing async — not done yet |
| 204 | No Content | Success, but nothing to return (common for DELETE) |
| 206 | Partial Content | Range requests (video streaming, resumable downloads) |

---

## 3xx — Redirection

| Code | Name | When you see it |
|------|------|-----------------|
| **301** | Moved Permanently | URL changed for good — caches/SEO update |
| **302** | Found (temporary redirect) | Temporary — don't cache the new location |
| 304 | Not Modified | Cached copy is still valid (conditional GET) — saves bandwidth |
| 307 | Temporary Redirect | Like 302 but keeps the HTTP method |
| 308 | Permanent Redirect | Like 301 but keeps the HTTP method |

---

## 4xx — Client Errors (the request is wrong)

| Code | Name | Typical cause / what to check |
|------|------|-------------------------------|
| **400** | Bad Request | Malformed syntax, bad JSON, missing/invalid params |
| **401** | Unauthorized | **Not authenticated** — missing/invalid/expired credentials or token |
| **403** | Forbidden | **Authenticated but not allowed** — lacks permission (IAM, scopes) |
| **404** | Not Found | Resource/route doesn't exist — check the URL/ID |
| 405 | Method Not Allowed | Wrong verb (POST to a GET-only endpoint) |
| 408 | Request Timeout | Client took too long to send the request |
| **409** | Conflict | State clash — duplicate create, version/edit conflict |
| 410 | Gone | Resource intentionally removed (permanent 404) |
| 413 | Payload Too Large | Body exceeds the server limit |
| 415 | Unsupported Media Type | Wrong `Content-Type` (e.g. sent XML, server wants JSON) |
| 422 | Unprocessable Entity | Syntax OK but **semantically** invalid (validation failed) |
| **429** | Too Many Requests | **Rate limited / throttled** — back off & retry (check `Retry-After`) |

> **401 vs 403** — classic interview question: 401 = "I don't know who you are."
> 403 = "I know who you are, and you can't do this."

---

## 5xx — Server Errors (the server failed) ← debugging hot zone

| Code | Name | Typical cause / what to check |
|------|------|-------------------------------|
| **500** | Internal Server Error | Generic catch-all — unhandled exception. **Go read the logs/stack trace.** |
| 501 | Not Implemented | Server doesn't support the functionality |
| **502** | Bad Gateway | A proxy/load balancer got a **bad response from upstream** (app crashed/returned garbage) |
| **503** | Service Unavailable | Server overloaded or down for maintenance — often transient |
| **504** | Gateway Timeout | Proxy/LB **waited too long** for the upstream (slow DB, deadlock, downstream hang) |
| 507 | Insufficient Storage | Server out of disk/space |

> **502 vs 503 vs 504** — all involve infrastructure:
> - **502 Bad Gateway** → upstream replied with something invalid (app process died/threw).
> - **503 Service Unavailable** → nothing healthy to route to (overload, scaling, deploy).
> - **504 Gateway Timeout** → upstream is alive but *too slow* (timeouts, slow queries, locks).

---

## Applying it: "Intermittent 500s, walk me through debugging"

A structured answer interviewers love — **scope → evidence → hypothesis → verify**:

1. **Quantify & scope.** What % of requests? Which endpoints? Started when?
   Correlate with a deploy, traffic spike, or config change.
2. **Read the logs.** A 500 means an unhandled exception — find the **stack trace** and
   the **request ID**. Group errors: is it one error or many?
3. **Check the dependencies.** Is it really 500 (app bug) or **502/503/504** (upstream/DB)?
   "Intermittent" + timeouts often points to a slow/exhausted dependency — DB connection
   pool, downstream API, a noisy-neighbor instance.
4. **Look at metrics & patterns.** Latency, CPU/memory, error rate over time, per-host.
   Intermittent + tied to specific hosts → bad instance. Tied to load → capacity/throttling.
5. **Form a hypothesis and test it.** e.g. "Connection pool exhausts under load → 500s."
   Reproduce, check pool metrics, confirm.
6. **Mitigate then fix.** Roll back the deploy / scale out / add a timeout+retry to stop the
   bleeding (Bias for Action), *then* root-cause and add a regression test (Dive Deep).

**The phrase that scores points:** *"First I'd determine whether it's a 5xx from our app
(read the stack trace) or from the gateway talking to an unhealthy upstream (502/503/504),
because that splits the investigation in two completely different directions."*

---

## Quick self-test (cover the right column)

| Scenario | Likely code |
|----------|-------------|
| Token expired | 401 |
| Logged in, but no permission for this resource | 403 |
| Sent too many requests, got throttled | 429 |
| App threw an unhandled exception | 500 |
| Load balancer couldn't get a valid response from the app | 502 |
| Backend DB query took 30s and the gateway gave up | 504 |
| POSTed invalid JSON | 400 |
| Created a duplicate that already exists | 409 |
| Server is overloaded / mid-deploy with no healthy hosts | 503 |
