# Database Bottlenecks & Replication — Interview Prep

> Built from the topic of your assessment ("Database Bottlenecks and Replication"). Geared for an Amazon Support Engineer interview — practical diagnosis + scaling fundamentals, not academic theory.
>
> For each question: **short answer → key detail → what to say out loud / how an SE would reason about it.**

---

# Part 1 — Diagnosing a slow database

## Q1. A user reports the app is slow. The DB looks "fine" on dashboards. Walk me through.

**Framework (interviewer's favorite — narrate this):**

1. **Clarify scope** — one user or many? Specific endpoint or app-wide? Started when?
2. **Define "slow"** — p50, p95, or p99? Total time or DB time?
3. **Confirm with data** — APM (Datadog/New Relic), request logs with timing, slow query log.
4. **Localize the bottleneck** — is the time spent in: app code, network, DB query, lock waits, connection acquisition, downstream service?
5. **Inspect the actual query** — `EXPLAIN` / `EXPLAIN ANALYZE`. Look at row counts, scan type, joins.
6. **Compare to baseline** — was this query fast last week? Did data volume grow? Did the query plan change?
7. **Fix at the right layer** — index, query rewrite, cache, schema, hardware, or app-level batching.

**Say out loud:** "Dashboards aggregate. A p50 that looks fine can hide a p99 that's terrible for one segment. I'd pull per-query and per-customer breakdowns."

---

## Q2. What are the common causes of a slow query?

1. **Missing or wrong index** — full table scan.
2. **Stale statistics** — optimizer picks bad plan.
3. **Large result set** — fetching way more rows than needed (`SELECT *`, no `LIMIT`).
4. **N+1 queries** — one query per row in a loop.
5. **Locks / blocking** — long-running transaction holding rows.
6. **Joins on unindexed columns**.
7. **Implicit type conversion** — `WHERE id = '123'` when `id` is INT, can prevent index use.
8. **Functions on indexed columns** — `WHERE LOWER(email) = ...` defeats the index unless you have a functional index.
9. **OR conditions** — sometimes the optimizer can't use indexes for both sides.
10. **Hot rows / contention** — many writers updating the same row.

---

## Q3. How do you read an `EXPLAIN` plan?

Key things to look for:

- **Scan type** — `Index Scan` / `Index Only Scan` (good) vs `Seq Scan` (full table — bad on large tables).
- **Rows estimated vs actual** — large mismatch = stale stats, run `ANALYZE`.
- **Join type** — `Nested Loop` (good for small inner side), `Hash Join` (good for large unsorted), `Merge Join` (sorted inputs).
- **Cost** — Postgres shows `(cost=startup..total rows=N width=B)`. Compare branches.
- **Sort / Hash buffers spilling to disk** — visible in `EXPLAIN ANALYZE` output.
- **Filter vs Index Cond** — `Index Cond` uses the index; `Filter` runs after the scan (still scanned rows).

**Always prefer `EXPLAIN ANALYZE`** when safe — it actually runs the query and shows real timings.

---

## Q4. What is the N+1 query problem?

You run one query to fetch N parent rows, then one query per row to fetch related data.

```js
const users = await db.query('SELECT * FROM users');
for (const user of users) {
    user.orders = await db.query('SELECT * FROM orders WHERE user_id=?', user.id);
}
```

That's 1 + N queries. For N=1000, you've made 1001 round-trips.

**Fix:**
- **JOIN** — one query with `LEFT JOIN orders ...` (careful with row duplication).
- **Batch fetch** — get all user IDs, then `WHERE user_id IN (...)`, then group in app.
- **DataLoader pattern** — coalesce parallel requests into one batched query.
- **ORM eager loading** — `.includes(:orders)` / `.preload(:orders)` / `select_related`.

---

## Q5. When does an index hurt instead of help?

- **Write-heavy tables** — every INSERT/UPDATE/DELETE has to update each index. More indexes = slower writes.
- **Very small tables** — sequential scan is faster than the index lookup.
- **Low cardinality columns** — `gender`, `is_active`. Optimizer may skip the index entirely; if it doesn't, performance suffers.
- **Indexes the optimizer ignores** — wasted disk + write cost. Drop them.
- **Bloat** — unused or duplicate indexes still take RAM/disk.

**Rule of thumb:** index columns used in `WHERE`, `JOIN`, `ORDER BY`. Don't index everything — measure.

---

## Q6. Composite index — what's the column ordering rule?

**Leftmost prefix rule.** An index on `(a, b, c)` can serve queries filtering by:
- `a` ✅
- `a AND b` ✅
- `a AND b AND c` ✅
- `b` alone ❌
- `b AND c` ❌
- `a AND c` ✅ (but only `a` uses index seek; `c` is filtered)

**Ordering strategy:**
- Most selective column first (usually).
- Equality columns before range columns: `WHERE a = ? AND b > ?` → index `(a, b)`.
- Match common access patterns.

---

## Q7. Covering index vs regular index

A **covering index** includes all the columns the query needs, so the DB never touches the table heap.

```sql
-- Query
SELECT email, name FROM users WHERE id = 5;

-- Covering index in Postgres
CREATE INDEX idx_users_id_covering ON users(id) INCLUDE (email, name);
```

EXPLAIN shows **Index Only Scan**. Much faster — no random I/O to fetch row data.

---

## Q8. What is connection pooling? Why does it matter?

Opening a DB connection is **expensive** — TCP handshake + auth + session setup, often 50–500ms. A pool keeps a set of pre-opened connections that requests check out and return.

**Common pitfalls:**
- **Pool too small** — requests queue, latency spikes.
- **Pool too large** — DB CPU/memory swamped by hundreds of connections (Postgres in particular handles each connection as a process, expensive past ~200).
- **No timeout on checkout** — requests hang forever waiting for a connection.
- **Connections leaked** — code paths that don't release on error → pool exhaustion.

**Tools:** PgBouncer (Postgres), ProxySQL (MySQL), HikariCP (Java).

**Say out loud:** "If I see 'connection pool exhausted' errors, I check three things: leaked connections, slow queries holding connections too long, and pool size vs concurrency."

---

## Q9. Long-running transaction — what's the operational risk?

- **Locks held longer** — blocks other writers, can cause deadlocks or timeouts.
- **Replication lag** — replicas can't apply changes until the transaction commits.
- **Vacuum can't reclaim** (Postgres) — old row versions pile up → bloat → slower queries (the "long-running transaction holds back vacuum" problem).
- **Connection pinned** — one less in the pool.

**Fix:** break large operations into batches with their own short transactions.

---

# Part 2 — Caching

## Q10. Cache strategies — name them and when to use each

- **Cache-aside (lazy loading)** — app checks cache; on miss, reads DB, writes to cache. *Most common.* Stale until expired.
- **Read-through** — cache library reads from DB on miss (similar to cache-aside but encapsulated).
- **Write-through** — write goes to cache + DB synchronously. Slow writes, fresh cache.
- **Write-behind (write-back)** — write to cache, async flush to DB. Fast writes, risk of data loss.
- **Refresh-ahead** — proactively refresh popular entries before they expire.

---

## Q11. Cache invalidation strategies

The two hardest problems in CS: cache invalidation, naming, and off-by-one errors.

- **TTL (time-to-live)** — simplest. Tolerate staleness for the TTL window.
- **Write-through** — update cache when DB is updated.
- **Explicit invalidation** — on DB write, delete the key. (Subtle race: read repopulates stale data between delete and DB commit. Common fix: delete after commit, accept short window.)
- **Versioning** — cache key includes version (`user:5:v17`); bumping version makes old key unreachable.

**Pitfall — thundering herd:** when a popular key expires, hundreds of requests miss simultaneously and hit the DB. Fix: jittered TTLs, request coalescing (singleflight), pre-warming.

---

## Q12. Cache stampede / dogpile — how do you mitigate?

When a hot key expires and many concurrent requests all rebuild it:

1. **Locking** — first miss takes a lock, others wait. Redis SETNX pattern.
2. **Probabilistic early expiration** — refresh slightly before TTL with some randomness.
3. **Stale-while-revalidate** — serve stale, refresh async.
4. **Jitter on TTL** — `TTL = base + random(0, jitter)` so keys don't all expire at once.

---

# Part 3 — Replication

## Q13. What is replication? Why do we use it?

Copying data from one DB (primary) to one or more secondaries (replicas).

**Reasons:**
- **Read scaling** — route read traffic to replicas.
- **High availability** — failover if primary dies.
- **Backups without load** — take backups from a replica.
- **Geographic latency** — replicas close to users.
- **Reporting / analytics** — isolate heavy queries from production.

---

## Q14. Synchronous vs asynchronous replication

| | Sync | Async |
|---|---|---|
| Primary waits for | Replica acknowledgement | Nothing (fire and forget) |
| Latency | Higher (RTT to replica) | Lower |
| Data loss on primary crash | None | Possible (unreplicated writes lost) |
| Replica lag | Effectively zero | Can grow |
| Common use | Critical financial data | Most web apps |

**Semi-sync** — primary waits for *one* replica to acknowledge, then async to the rest. Compromise.

---

## Q15. What is replication lag? What causes it?

Replicas falling behind the primary. The replica applies changes after they're streamed from the primary. Lag is the time between a write happening on primary and being visible on the replica.

**Causes:**
- **Heavy writes** — replica can't keep up with primary's write rate.
- **Single-threaded replication apply** (classic MySQL) — even if primary parallelizes writes, replica replays serially.
- **Long transactions** — replica must wait for commit before applying.
- **Network latency** — geographic distance, bandwidth limits.
- **Replica running heavy reads** — competing for CPU/IO with the apply thread.
- **Schema changes** (e.g., big ALTER TABLE).

**Mitigation:** parallel apply (`slave_parallel_workers` in MySQL, logical replication in Postgres), faster replica hardware, sharding, read-your-writes consistency at app layer.

---

## Q16. The "read-your-writes" problem

User updates their profile, immediately refreshes — and sees the old data.

**Cause:** write went to primary, refresh went to a lagging replica.

**Fixes:**
- **Read from primary for X seconds after a write** (sticky session).
- **Read from primary for that specific user** until lag catches up.
- **Track a write timestamp / LSN** per session and only read from replicas at/past that point.
- **Eventual consistency in UI** — show optimistic UI, accept brief staleness.

---

## Q17. Statement-based vs row-based replication

- **Statement-based** — replicates the SQL statement. Compact, but **non-deterministic** statements (`NOW()`, `RAND()`, `LIMIT` without `ORDER BY`) can diverge between primary and replica.
- **Row-based** — replicates the actual row changes. Larger logs, but deterministic.
- **Mixed** — DB picks per statement (MySQL default for years).

Row-based is the safer default. Postgres uses WAL-based which is essentially row-level.

---

## Q18. Logical vs physical replication

- **Physical (binary)** — replica is a byte-for-byte copy. Whole cluster only. Can't replicate selectively. Same major version required.
- **Logical** — replicates change events. Can target specific tables/rows, replicate across versions, transform data en route.

Postgres has both (`streaming replication` is physical, `pgoutput` / `wal2json` for logical). Logical is heavier per byte but more flexible.

---

## Q19. Failover — automatic vs manual. What can go wrong?

**Failover** = promoting a replica when primary fails.

**Automatic failover risks:**
- **Split-brain** — old primary comes back online and thinks it's still primary. Two primaries → data divergence.
- **False positive** — network blip, not actually down, but failover triggers.
- **Data loss** — async replica was behind; promoting it loses recent writes.

**Mitigation:**
- **Fencing / STONITH** ("shoot the other node in the head") — kill old primary before promoting.
- **Quorum-based decisions** (Raft/Paxos-style consensus) — Patroni, etcd.
- **Sync replication for critical writes**.

**Manual failover** — safer for non-critical systems but RTO (recovery time objective) is human-bound.

---

## Q20. What's the difference between RPO and RTO?

- **RPO (Recovery Point Objective)** — how much **data** can you lose? Last 5 min? Zero?
- **RTO (Recovery Time Objective)** — how long can you be **down**? 1 min? 1 hour?

Replication and backups choices flow from these. Async replication = non-zero RPO. Manual failover = larger RTO.

---

# Part 4 — Scaling beyond replication

## Q21. Vertical vs horizontal scaling

- **Vertical (scale up)** — bigger box (more CPU/RAM/IO). Simple, no app changes. Ceiling exists. Single point of failure unchanged.
- **Horizontal (scale out)** — more boxes. Theoretically unlimited. Requires sharding, distributed consensus, harder ops.

**Read replicas** are a form of horizontal scaling for reads only — writes still hit the single primary.

---

## Q22. What is sharding? When do you need it?

Partitioning data **across multiple primaries**. Each shard owns a subset of rows.

**When:** when a single primary can't handle the write throughput or storage size even with vertical scaling.

**Strategies:**
- **Range sharding** — `users 1-1M → shard 1, 1M-2M → shard 2`. Easy to understand, prone to hotspots.
- **Hash sharding** — `hash(user_id) % N`. Even distribution, but resharding is painful (most keys remap).
- **Directory / lookup-based** — a service maps each key to a shard. Flexible, adds a lookup hop.
- **Consistent hashing** — used by Cassandra, DynamoDB. Minimizes remapping when shards added.

**Tradeoffs:**
- Cross-shard queries and transactions are hard.
- Re-sharding is painful (live migration, dual-writing).
- Schema changes need coordination across shards.

---

## Q23. CAP theorem — the practical version

In the presence of a **network partition (P)**, you must choose between **Consistency (C)** and **Availability (A)**.

- **CP system** — refuses requests during partition to keep data consistent (e.g., a quorum DB).
- **AP system** — keeps serving during partition, accepts that data may diverge (e.g., Dynamo-style).

**Reality:** networks always partition eventually, so the real question is **how the system behaves during a partition.** Most production DBs are configurable.

**PACELC** extends CAP: when there's **P**artition, choose **A** vs **C**; **E**lse (no partition), choose **L**atency vs **C**onsistency.

---

## Q24. Eventual consistency — what does it actually mean?

If no new updates are made, all replicas will **eventually** converge to the same value. There's a window of staleness.

**Implications:**
- Reads may return stale data.
- Two clients reading the same key at the same time may see different values briefly.
- Conflict resolution needed when writes happen on multiple nodes (LWW = last-write-wins, vector clocks, CRDTs).

Use when: low-latency global reads matter more than strict freshness (social feeds, view counts, product listings).

Avoid when: financial balances, inventory decrement, anything where stale = wrong.

---

## Q25. Multi-primary (multi-master) replication — pros and pitfalls

Multiple nodes accept writes; changes propagate between them.

**Pros:** lower write latency for geographically distributed users, no single point of write failure.

**Pitfalls:**
- **Write conflicts** — two nodes update the same row → reconciliation needed.
- **Increased complexity** — harder to reason about ordering.
- **Replication topology** — full mesh? ring? Failure modes multiply.

Most apps don't actually need this. Single-primary + read replicas covers ~95% of use cases.

---

## Q26. Distributed transactions — 2PC

**Two-Phase Commit:**
1. **Prepare** — coordinator asks each participant if it can commit. Each locks resources and replies yes/no.
2. **Commit/Abort** — if all say yes, coordinator tells all to commit. Otherwise abort.

**Problems:**
- **Blocking** — if coordinator fails mid-protocol, participants are stuck holding locks.
- **Latency** — multiple round trips.
- **Not partition-tolerant**.

**Alternatives:** Sagas (sequence of local transactions with compensating actions), eventual consistency with idempotent operations.

---

# Part 5 — Common SE debugging scenarios

## S1. "DB CPU is at 100%."

1. Check active queries (`SHOW PROCESSLIST` / `pg_stat_activity`). Any long-running or stuck?
2. Slow query log — what's the most expensive query right now?
3. Recent deploys — did a query change?
4. Cardinality change — did data volume just balloon (e.g., a backfill)?
5. Lock contention (`pg_locks`, `SHOW ENGINE INNODB STATUS`).
6. Connection storm — too many connections, each running cheap queries → cumulative load.

---

## S2. "Replica lag is growing."

1. Is the primary write rate elevated? (Spike vs steady increase.)
2. Is the replica IO/CPU saturated?
3. Long transaction on the primary?
4. Single-threaded apply hitting a CPU-bound op?
5. Network throughput primary→replica?
6. Schema change running?

**Mitigation menu:** throttle writes, scale replica vertically, enable parallel apply, route reads to primary temporarily.

---

## S3. "We're seeing intermittent 'connection refused' / 'too many connections'."

1. Pool size on each app instance × number of instances vs DB `max_connections`.
2. Are connections being leaked?
3. Recent traffic spike?
4. Long-running queries pinning connections?
5. Add a connection proxy (PgBouncer/ProxySQL) — multiplex client connections.

---

## S4. "Order totals are wrong after our migration to read replicas."

Classic read-after-write inconsistency. Reads of fresh writes are landing on lagging replicas.

**Fix:**
- Route reads-after-recent-write to primary.
- Stickiness per user for X seconds.
- Track an LSN/timestamp per session.

---

# Part 6 — Rapid-fire concept checks

1. **What's a WAL?** Write-Ahead Log. All changes written here before applied to data files. Powers recovery + replication.
2. **What does `ANALYZE` do?** Updates table statistics the query planner uses.
3. **What does `VACUUM` do (Postgres)?** Reclaims storage from dead row versions left by MVCC. `VACUUM FULL` rewrites the table (locks).
4. **What is MVCC?** Multi-Version Concurrency Control. Writers create new row versions, readers see a consistent snapshot — readers don't block writers.
5. **What's a deadlock?** Two transactions each holding a lock the other wants. DB detects + kills one.
6. **What's a phantom read?** Re-running the same query sees new rows inserted by another transaction. Prevented by SERIALIZABLE isolation.
7. **Difference between READ COMMITTED and REPEATABLE READ?** READ COMMITTED sees committed data on each statement; REPEATABLE READ takes a snapshot at transaction start and sticks with it.
8. **What's connection pinning?** A specific app session always uses the same DB connection (e.g., temp tables, session vars).
9. **Heap vs index?** Heap = the table's actual row data. Index = a separate structure pointing to heap rows.
10. **What's a hot row?** A single row receiving heavy concurrent writes, causing lock contention. Fix: shard the counter (N shards, sum on read).

---

# How to answer these in the interview

**Structure each answer:**
1. **One-line definition.**
2. **Why it matters / when you use it.**
3. **A pitfall or tradeoff.**
4. **If possible — tie to a real experience.** "We had this in production where..."

**Words that score with Amazon interviewers:**
- "blast radius" (scope of impact)
- "RPO / RTO"
- "p50, p95, p99" (not just "average")
- "narrow it down" (debugging methodology)
- "tradeoff" (showing you don't have dogma)
- "first thing I'd check" (showing structured thinking)

**Avoid:**
- Speaking in absolutes ("you should never do X"). Real systems have tradeoffs.
- Reciting trivia without context. They want to know *when* you'd use each thing.
- Getting stuck in academic theory. Tie everything back to "and that's why in production, we'd...".
