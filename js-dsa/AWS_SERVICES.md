# AWS Services — Amazon Support Engineer Interview Prep

> Amazon interviewers expect you to know the ecosystem. They want **practical understanding**: when to use each service, what fails, how to debug, and trade-offs. Memorizing every limit isn't necessary — knowing the *shape* of each service is.
>
> For each service: **what it is → when to use → key concepts → pitfalls / what an SE would watch.**

---

# Part 1 — Compute

## Lambda

**What:** Run code without provisioning servers. Triggered by events (HTTP via API Gateway, S3 upload, SQS message, schedule, etc.).

**Key concepts:**
- **Execution model** — each invocation runs in an isolated environment. Same environment can be reused across invocations (warm start).
- **Cold start** — first invocation (or scale-up) provisions a new environment. ~100ms–1s+ depending on runtime + package size + VPC config. Languages: Node/Python = fast, Java/.NET = slower.
- **Concurrency** — default account limit ~1000 concurrent executions, configurable. Can set **reserved concurrency** (guaranteed slots) or **provisioned concurrency** (pre-warmed, no cold start, paid by the second).
- **Timeout** — max 15 min per invocation.
- **Memory** — 128 MB to 10 GB. CPU scales linearly with memory.
- **Package size** — 50 MB zipped / 250 MB unzipped, 10 GB for container images.
- **/tmp** — 512 MB to 10 GB ephemeral disk. Persists across warm invocations on same instance.

**When to use:**
- Event-driven workflows (S3 trigger → process file)
- API backends with bursty traffic
- Scheduled jobs (cron via EventBridge)
- Glue code between services

**When NOT to use:**
- Long-running jobs (>15 min) — use ECS/Step Functions/Batch.
- Constant heavy load — ECS/EC2 may be cheaper.
- Apps needing persistent connections (WebSockets, long-lived DB connections).

**SE pitfalls / what to watch:**
- **Cold starts in VPC** — historically painful, much better now (Hyperplane ENIs). Still avoid VPC unless you need it.
- **Connection leaks to RDS** — every invocation opens a connection → connection storm at scale. Use **RDS Proxy** or DynamoDB.
- **Concurrent execution limit reached** → throttling (429). Watch `Throttles` metric.
- **Idle global initialization** — code outside the handler runs once per environment. Use for DB connection setup, SDK clients.

**Say out loud:** "For a backend that scales from 0 to 10K rps unpredictably, Lambda's elasticity is the win. For steady 200 rps, ECS is usually cheaper."

---

## Step Functions ⭐

**What:** A serverless **workflow orchestrator**. You define a state machine (in JSON / Amazon States Language) that coordinates Lambda functions, other AWS services, and waits/branches/parallel execution.

**Why it exists:** chaining 10 Lambdas with retry logic in code is fragile and hard to observe. Step Functions makes the workflow explicit, durable, and visualized.

**Two flavors:**
- **Standard** — long-running (up to 1 year), exactly-once execution, audit history. Priced per state transition.
- **Express** — high-volume, short-lived (5 min max), at-least-once. Cheaper per execution, billed by duration.

**State types:**
- **Task** — invoke a Lambda, ECS task, etc.
- **Choice** — branching logic.
- **Parallel** — run branches concurrently.
- **Map** — iterate over a list, process each item (optionally in parallel).
- **Wait** — pause for time or until timestamp.
- **Pass / Succeed / Fail** — control flow.

**Key features:**
- **Built-in retries with backoff** per state.
- **Catchers** — route errors to recovery states.
- **Visual execution history** — see exactly which state failed, with input/output.
- **Direct AWS service integration** (200+) — call DynamoDB, SNS, etc. **without** a Lambda in between (saves cost + latency).

**When to use:**
- Multi-step business processes (order placement → payment → fulfillment → notify).
- Long-running workflows (hours to days).
- Anything that needs **observability** and **retry semantics** beyond a single Lambda.
- ETL pipelines with branching logic.

**When NOT to use:**
- A single Lambda call — overkill.
- Very high-volume, simple event fan-out — use SQS/SNS/EventBridge instead (cheaper).

**SE pitfalls:**
- **State transitions cost money** in Standard — designs with thousands of tiny states get expensive.
- **Input/output size limit** (256 KB per state). For larger payloads, store in S3 and pass references.
- **Express workflows are at-least-once** — your tasks must be idempotent.
- **Execution history retention** — Standard keeps 90 days by default.

**Say out loud:** "I'd reach for Step Functions when the workflow has 3+ steps with conditional logic and I want the durability + visibility. For a simple Lambda chain, EventBridge or direct invocation is lighter."

---

## EC2

**What:** Virtual machines.

**Key concepts:**
- **Instance types** — General (t/m), Compute (c), Memory (r/x), Storage (i/d), GPU (g/p).
- **Pricing models** — On-demand, Reserved (1/3 yr commitment, ~30–70% discount), Savings Plans, **Spot** (up to 90% off, can be terminated with 2-min warning).
- **AMI (Amazon Machine Image)** — template for the OS + pre-installed software.
- **EBS (root volume)** vs **Instance Store** (ephemeral, tied to host).
- **Auto Scaling Groups (ASG)** — desired/min/max + scaling policies.
- **User Data** — bootstrap script on first boot.

**When to use:**
- Full OS control needed.
- Legacy apps that can't be containerized.
- Specialized hardware (GPU, large memory, bare metal).

**SE pitfalls:**
- **Instance dies, EBS persists** — generally good. **Instance dies, instance-store data is gone** — common surprise.
- **Spot interruption** — design stateless, checkpoint work.
- **Wrong instance family** — paying for cores when you need memory (or vice versa).

---

## ECS vs Fargate vs EKS

- **ECS (Elastic Container Service)** — AWS's container orchestrator. You define tasks + services + clusters.
- **Fargate** — serverless launch type for ECS or EKS. You don't manage the underlying EC2; AWS does. Pay per task vCPU/memory/sec.
- **EKS (Elastic Kubernetes Service)** — managed Kubernetes. Use if you want K8s portability or already have K8s expertise.

**Trade-offs:**
| | ECS on EC2 | Fargate | EKS |
|---|---|---|---|
| You manage | Cluster nodes | Just containers | Cluster + nodes (or Fargate) |
| Pricing | EC2 + minor ECS | Per-task | Cluster fee + nodes |
| Complexity | Medium | Low | High |

**When to use what:**
- **Fargate** — small/medium teams, want minimal ops, fine with AWS lock-in.
- **ECS on EC2** — cost-sensitive, predictable load, want bin-packing efficiency.
- **EKS** — already using K8s, multi-cloud strategy, complex orchestration needs.

---

# Part 2 — Storage

## S3 (Simple Storage Service)

**What:** Object storage. Buckets → keys → objects. Effectively infinite, 11 9's durability.

**Key concepts:**
- **Storage classes** —
    - `STANDARD` — frequent access.
    - `INTELLIGENT_TIERING` — auto-moves between tiers based on access.
    - `STANDARD_IA` (Infrequent Access), `ONEZONE_IA` (one AZ, cheaper, lower durability).
    - `GLACIER_INSTANT_RETRIEVAL`, `GLACIER_FLEXIBLE_RETRIEVAL` (minutes-hours), `GLACIER_DEEP_ARCHIVE` (12 hours).
- **Lifecycle policies** — auto-transition objects between classes; auto-expire.
- **Versioning** — keep historical versions; useful for accidental delete protection (paired with MFA delete).
- **Encryption** — `SSE-S3` (S3-managed), `SSE-KMS` (KMS-managed, auditable), `SSE-C` (customer-provided keys). All new buckets encrypt by default (SSE-S3).
- **Pre-signed URLs** — temporary URL granting limited access without exposing IAM creds.
- **Event notifications** — trigger Lambda/SQS/SNS on object create/delete.
- **Strong read-after-write consistency** — since 2020. Older content saying "eventually consistent" is outdated.

**SE pitfalls:**
- **Public buckets** — most common AWS breach cause. Use Block Public Access at account level.
- **Cross-region transfer costs** — moving data between regions is billed; same-region transfer between AWS services is mostly free.
- **List operations are slow / paginated** — design key structure so you rarely need to LIST.
- **Hot key prefix** — historically S3 sharded by prefix; modern S3 handles this, but extremely skewed write patterns can still hit limits (3,500 PUT/s, 5,500 GET/s per prefix).

---

## EBS vs EFS vs S3

| | EBS | EFS | S3 |
|---|---|---|---|
| Type | Block | File (NFS) | Object |
| Mount | Single EC2 (mostly) | Many EC2s concurrently | API only (HTTP) |
| Latency | Lowest | Medium | Highest |
| Use case | DB volumes, root disk | Shared FS for fleet | Static files, backups, data lakes |
| Cost | $$ | $$$ | $ |

---

# Part 3 — Database

## RDS

**What:** Managed relational DBs — MySQL, PostgreSQL, MariaDB, Oracle, SQL Server.

**Key concepts:**
- **Multi-AZ** — synchronous standby in another AZ for HA. Automatic failover (~60–120s). **Not for read scaling.**
- **Read Replicas** — async replicas, can be in other AZs/regions. For read scaling, not HA.
- **Backups** — automated daily + transaction logs. Restore to point-in-time.
- **Storage auto-scaling** — grow without downtime.
- **Maintenance windows** — patching happens here; can cause brief unavailability (Multi-AZ flips the standby to mask this).

**SE pitfalls:**
- **Don't confuse Multi-AZ with Read Replicas.** Multi-AZ = HA, single endpoint. Read Replicas = scale reads, separate endpoint.
- **Failover changes the underlying instance** but the DNS endpoint stays — DNS TTL means apps may take a minute to reconnect.
- **Connection storms after failover** — apps reconnecting at once can overload the new primary.
- **`max_connections` is set by instance class** — small instances have small caps.

---

## Aurora

**What:** AWS-built MySQL/Postgres-compatible engine. Storage decoupled from compute (shared distributed storage layer).

**Key advantages over RDS:**
- Storage auto-grows up to 128 TB.
- Up to 15 read replicas with sub-10ms lag (shared storage).
- Failover ~30s (no replication catch-up).
- **Aurora Serverless v2** — DB compute scales elastically.

**When to use:** when you'd reach for RDS but want better scale + faster failover.

---

## DynamoDB

**What:** Managed NoSQL key-value / document store. Massive scale, single-digit ms latency.

**Key concepts:**
- **Partition key** (required) + optional **sort key** = primary key.
- **Capacity modes** — Provisioned (RCU/WCU you reserve) or **On-Demand** (pay per request, elastic).
- **Global Secondary Indexes (GSI)** — query by non-primary-key attributes.
- **Streams** — capture row changes, trigger Lambda.
- **Global Tables** — multi-region active-active replication.
- **TTL** — auto-delete expired items.

**When to use:**
- Predictable access patterns (you know how you'll query).
- Massive scale, low latency.
- Serverless apps (no connection pool issues, unlike RDS).

**When NOT to use:**
- Complex relational queries (joins, aggregations).
- Ad-hoc analytics — use Redshift or RDS.

**SE pitfalls:**
- **Hot partition** — one partition key getting most traffic → throttling even with capacity elsewhere. Design keys to distribute load.
- **`Scan` is expensive** — reads every item, paginated. Use `Query` whenever possible.
- **No JOIN** — denormalize at write time.
- **Item size limit 400 KB**.

---

## ElastiCache (Redis / Memcached)

**What:** Managed in-memory cache.

- **Redis** — richer (sorted sets, pub/sub, persistence, replication, cluster mode).
- **Memcached** — simpler, multi-threaded, no replication.

**When to use:** caching DB query results, session storage, leaderboards (Redis sorted sets), rate limiting counters.

**Pitfalls:**
- **No persistence by default** (Memcached) → restart loses data.
- **Eviction policy** matters — `allkeys-lru` vs `volatile-lru`. Wrong choice = lost data or constant cache misses.
- **Sharding** — cluster mode requires client-side awareness.

---

# Part 4 — Networking

## VPC

**What:** Your private virtual network in AWS.

**Key concepts:**
- **Subnets** — public (has route to internet gateway) or private (no direct internet).
- **Internet Gateway (IGW)** — public internet access.
- **NAT Gateway** — lets private subnet instances reach the internet (outbound only).
- **Security Groups (SG)** — instance-level **stateful** firewall. Default deny inbound, allow outbound. Returns traffic automatic.
- **NACLs (Network ACLs)** — subnet-level **stateless** firewall. Must explicitly allow return traffic.
- **VPC Peering** — connect two VPCs.
- **Transit Gateway** — hub-and-spoke connection of many VPCs / on-prem.
- **VPC Endpoints** — private route to AWS services without going over the internet.

**SE pitfall:** "I can't reach my private RDS." → check both the SG inbound rules AND the route table AND that the app is in the right VPC/subnet.

---

## ELB (Elastic Load Balancers)

- **ALB (Application LB)** — Layer 7 (HTTP/HTTPS). Path-based routing, host-based routing, WebSocket, HTTP/2. **Use for HTTP apps.**
- **NLB (Network LB)** — Layer 4 (TCP/UDP). Ultra-low latency, static IPs, millions of requests/sec. **Use for non-HTTP, ultra-high perf, or static IP requirement.**
- **GLB (Gateway LB)** — for inline appliances (firewalls, deep packet inspection).
- **CLB (Classic LB)** — legacy.

**Health checks** — the LB pings each target; unhealthy targets removed from rotation.

**SE pitfall:** target is "unhealthy" — check the target's SG allows traffic *from the LB's SG*, and that the health check path returns 200.

---

## CloudFront

**What:** AWS CDN. Caches static + dynamic content at 400+ edge locations globally.

**Key concepts:**
- **Origin** — S3 bucket, ALB, or arbitrary HTTP server.
- **Behaviors** — path patterns mapped to origins with different cache policies.
- **Invalidation** — purge cache for a path (costs $ if frequent — use versioned URLs instead).
- **Signed URLs / cookies** — restrict access.
- **OAC (Origin Access Control)** — let CloudFront read from a private S3 bucket without making it public.

---

## Route 53

**What:** DNS + domain registration + health checks.

**Routing policies:**
- **Simple** — one record, one value.
- **Weighted** — split traffic by percentage (A/B testing, gradual rollout).
- **Latency** — route to lowest-latency region.
- **Failover** — primary + secondary based on health checks.
- **Geolocation** — route by user's country.
- **Geoproximity** — route by geographic distance with bias.
- **Multi-value** — return multiple healthy IPs.

---

## API Gateway

**What:** Managed API frontend. Handles auth, rate limiting, transformation, caching.

**Types:**
- **REST API** — feature-rich, more $$.
- **HTTP API** — cheaper, faster, fewer features. Use for Lambda backends.
- **WebSocket API** — bidirectional connections.

**Pairs with:** Lambda (most common), HTTP backends, AWS services directly.

**SE pitfall:** 29-second hard timeout per request — long-running requests need async patterns (queue + poll, or WebSocket).

---

# Part 5 — Messaging & Integration

## SQS

**What:** Managed queue. Producers send messages, consumers poll and process.

**Types:**
- **Standard** — at-least-once delivery, best-effort ordering, unlimited throughput.
- **FIFO** — exactly-once, strict ordering, ~3000 msg/s with batching.

**Key concepts:**
- **Visibility timeout** — when a consumer receives a message, it's hidden for N seconds. If not deleted in that time, it reappears. **Choose ≥ max processing time.**
- **Dead Letter Queue (DLQ)** — after N failed attempts, send to a DLQ for inspection.
- **Long polling** — `ReceiveMessage` waits up to 20s for a message → fewer empty responses, cheaper.
- **Retention** — up to 14 days.

**Pitfalls:**
- **Visibility timeout too short** → message gets re-delivered while you're still processing → duplicate work.
- **Consumers must be idempotent** (at-least-once delivery).
- **Standard queue ordering** — best-effort, not guaranteed.

---

## SNS

**What:** Pub/sub. Publishers send to a topic; topic fans out to all subscribers.

**Subscribers can be:** Lambda, SQS, HTTP/HTTPS endpoint, email, SMS, mobile push.

**SQS + SNS pattern:** publish once to SNS, fan out to multiple SQS queues — each service processes the event independently.

**Not for ordering or replay** — that's Kinesis/Kafka territory.

---

## EventBridge

**What:** Event bus with rich routing rules. Newer/more powerful than SNS for service-to-service events.

**Why over SNS:**
- **Content-based filtering** — match events by JSON path (no Lambda filter needed).
- **Schema registry** — typed events.
- **Built-in integrations** with 100+ SaaS sources (Datadog, Auth0, etc.).
- **Archive + replay** events.

**Use for:** event-driven architecture between microservices, SaaS integrations.

---

## SQS vs SNS vs EventBridge vs Kinesis

| | SQS | SNS | EventBridge | Kinesis |
|---|---|---|---|---|
| Pattern | Queue (point-to-point) | Pub/sub fan-out | Event router | Streaming |
| Consumers | One processes each msg | Many | Many | Many (with checkpoints) |
| Ordering | FIFO available | No | No | Yes (per shard) |
| Replay | No (until deleted) | No | Limited (archive) | Yes (24h–365 days) |
| Use case | Decouple producer/consumer | Broadcast notifications | Microservice events | Streaming analytics, real-time |

---

## Kinesis Data Streams

**What:** Real-time streaming. Like Kafka, managed.

**Key concepts:**
- **Shards** — capacity units. Each shard: 1 MB/s in, 2 MB/s out, 1000 records/s in.
- **Partition key** determines shard.
- **Consumers** read with checkpoints (resume from last position).
- **Retention** — 24h default, up to 365 days.

**Use for:** real-time analytics, log aggregation, clickstream, IoT.

---

# Part 6 — Monitoring & Ops

## CloudWatch

- **Metrics** — numeric data points. Built-in metrics for every service. Custom metrics via API.
- **Logs** — log groups → log streams. Filter, search, export. **CloudWatch Logs Insights** for SQL-like queries.
- **Alarms** — trigger on metric thresholds. Actions: SNS notification, Auto Scaling, EC2 reboot.
- **Dashboards** — pin metrics + logs + queries.
- **Synthetics** — canaries that ping endpoints.

**SE answer template:** "First thing I'd do is open the CloudWatch dashboard for that service and check the relevant metrics — for Lambda, that's Errors, Throttles, Duration, ConcurrentExecutions. Then drill into logs."

---

## X-Ray

**What:** Distributed tracing. See the request flow across services with latency at each hop.

**Use:** find which service in a chain is slow.

---

## CloudTrail

**What:** Audit log of every API call made in your account.

**Use:** "Who deleted the bucket?" "When was this IAM role created?" "Was the credential leaked?" — answer with CloudTrail. Always-on management events; data events (S3 object-level, Lambda invocations) optional.

---

## Systems Manager (SSM)

- **Session Manager** — shell into EC2 without SSH/bastion. Logs all sessions.
- **Parameter Store** — config + secrets (free tier).
- **Patch Manager** — automated patching.
- **Run Command** — execute scripts on fleets of EC2.

---

# Part 7 — Security

## IAM (Identity and Access Management)

**Core concepts:**
- **User** — human or app with long-lived credentials.
- **Role** — temporary credentials, assumed by services or users. **Prefer roles over users for apps.**
- **Group** — collection of users with shared permissions.
- **Policy** — JSON document defining permissions. **Identity policies** attach to users/roles/groups. **Resource policies** attach to resources (e.g., S3 bucket policy).
- **Principal** — who's making the request.
- **Permissions boundary** — max permissions a role can have.

**Policy evaluation:** explicit deny > explicit allow > implicit deny (default).

**Best practices:**
- Least privilege.
- Use roles for EC2/Lambda/ECS (instance profiles / execution roles).
- Don't put long-lived access keys in code — use IAM roles + STS.
- Enable MFA on root and privileged users.
- Use AWS Organizations + SCPs for multi-account guardrails.

---

## KMS (Key Management Service)

**What:** Managed encryption keys.

- **Customer-managed keys (CMK)** — you control rotation, policy.
- **AWS-managed keys** — AWS controls; used by default for many services.
- **Envelope encryption** — KMS encrypts a data key, the data key encrypts your data. Why? KMS API has size/throughput limits.

---

## Secrets Manager vs Parameter Store

| | Secrets Manager | Parameter Store (SSM) |
|---|---|---|
| Cost | $0.40/secret/month + API | Free (Standard) / $$ (Advanced) |
| Rotation | Built-in (with Lambda) | DIY |
| Use case | DB passwords, API keys w/ rotation | Config, feature flags, simple secrets |

---

# Part 8 — DevOps

## CloudFormation / CDK

- **CloudFormation** — declarative IaC in JSON/YAML. Manages "stacks."
- **CDK** — write infra in TypeScript/Python/etc., compiles to CloudFormation.
- **SAM** — CloudFormation extension for serverless apps.
- **Terraform** — third-party, multi-cloud alternative.

**Drift** — when reality diverges from the template (someone clicked in the console). CloudFormation can detect drift.

---

## CodePipeline / CodeBuild / CodeDeploy

- **CodePipeline** — orchestrate the deployment pipeline.
- **CodeBuild** — build + test runner (like Jenkins/GitHub Actions).
- **CodeDeploy** — deployment strategies (blue/green, canary, rolling) to EC2/ECS/Lambda.

Most teams use GitHub Actions / GitLab CI instead, but know these exist.

---

# Part 9 — Service comparison cheat sheet

## Which compute?

| Workload | Use |
|---|---|
| Event-driven, bursty | Lambda |
| Long-running container | ECS/Fargate |
| Steady high traffic | ECS on EC2 (cheaper) |
| Need full OS / legacy | EC2 |
| Batch jobs | AWS Batch or Step Functions + Lambda |
| Multi-step workflow | Step Functions |

## Which database?

| Need | Use |
|---|---|
| SQL, traditional schema | RDS / Aurora |
| Massive scale key-value | DynamoDB |
| Cache | ElastiCache |
| Analytics / OLAP | Redshift |
| Time-series | Timestream |
| Graph | Neptune |
| Full-text search | OpenSearch |

## Which messaging?

| Need | Use |
|---|---|
| Decouple producer + single consumer | SQS |
| Broadcast to many consumers | SNS |
| Route events with filtering rules | EventBridge |
| Real-time stream / replay | Kinesis |
| Multi-step workflow w/ branches | Step Functions |

---

# Part 10 — Common SE debugging scenarios

## "Lambda function is slow / timing out."

1. Check `Duration` metric — trending up?
2. Cold starts? Check `Init Duration` in Insights logs.
3. Is it waiting on a downstream service? (RDS, external API)
4. VPC config — first cold start in VPC is slow.
5. Memory under-provisioned? Increasing memory increases CPU.

## "API Gateway returning 502."

- Lambda crashed or timed out.
- Lambda response malformed (must match required schema for proxy integration).
- VPC link / backend unreachable.

## "S3 upload from app failing with 403."

- IAM role missing `s3:PutObject` on the bucket / prefix.
- Bucket policy explicit deny.
- KMS key policy (if SSE-KMS) — role needs `kms:GenerateDataKey`.
- Object ACL conflict if bucket has ACLs disabled.

## "RDS CPU pegged at 100%."

- `pg_stat_activity` / `SHOW PROCESSLIST` for active queries.
- Performance Insights — top SQL.
- Sudden traffic spike or a runaway query.
- Connection storm — too many connections doing cheap work.
- Missing index after schema change.

## "DynamoDB throttling."

- Hot partition — keys not distributing.
- Provisioned mode capacity below need → switch to On-Demand or raise capacity / enable auto-scaling.
- GSI throttling can independently throttle reads/writes.

## "Replica lag in RDS."

- Heavy write rate on primary.
- Long transaction on primary.
- Replica IO bottleneck (upgrade storage type to io2 or larger).
- Replica running heavy reads — competing with replication apply.

---

# How to answer AWS questions in the interview

**Structure:**
1. **What it is — one sentence.**
2. **When to use it — concrete scenario.**
3. **A trade-off or pitfall.**
4. **If possible, real experience** ("we used X for Y because of Z").

**Phrases that score:**
- "Trade-off here is..."
- "For our scale, I'd reach for..."
- "First thing I'd check in CloudWatch is..."
- "The blast radius if this fails..."
- "Idempotency is important here because..."

**Don't:**
- Memorize raw service limits — interviewers know they change.
- Claim experience you don't have. Better: "I've read about X and understand the use case, though haven't run it in prod."
- Lead with hype. Lead with the use case, then the service.

**Compare-and-contrast questions are common:**
- "Lambda vs ECS?" → workload shape (bursty vs steady), runtime (15min limit), ops overhead, cost profile.
- "SQS vs SNS?" → queue (1 consumer per message) vs pub/sub (broadcast).
- "DynamoDB vs RDS?" → access pattern (key-value vs relational), scale shape, cost model.
- "Step Functions vs chained Lambdas?" → observability, retries, durability, complexity threshold.
