---
title: 'Neon vs Cloudflare D1: In-Depth Comparison (2026)'
subtitle: Compare Neon and Cloudflare D1 on the database engine, free plans, branching, backups, backend services, limits, and pricing, with cost examples.
author: neon-team
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-11-15T00:00:00.000Z'
updatedOn: '2026-11-15T15:02:16.686Z'
---

<Admonition type="note">
Features and prices in this guide were checked against the Neon and Cloudflare documentation and pricing pages on November 15, 2026. Confirm the current rates on the [Neon pricing](/pricing) page and on Cloudflare's [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) page before you decide.
</Admonition>

Neon and Cloudflare D1 are both serverless SQL databases that you don't have to size, and both stop charging for compute when nobody is querying them. The biggest difference is the engine. D1 runs SQLite's SQL semantics on Cloudflare's network and is designed to be queried from Workers, with each database capped at 10 GB. Neon runs Postgres, the database most production apps already use, and adds the rest of a backend around it: auth, file storage, functions, and realtime, all of which branch with your data.

This guide compares the two for a developer starting a project and for a team running one in production, shows what each costs in three scenarios, and recommends one for each type of project.

## How is Neon different?

### 1. It's Postgres, and it works from any runtime

[Lakebase Postgres](/docs/introduction/architecture-overview) is Postgres 14 to 18 ([source](/docs/reference/compatibility)). Your ORM, migration tool, admin GUI, `psql`, and Postgres extensions like [`pgvector`](/docs/extensions/pgvector) work with it as they do anywhere else, and so does what you already know about Postgres. You can connect from a Cloudflare Worker through [Hyperdrive](/docs/guides/cloudflare-hyperdrive) or the [serverless driver](/docs/serverless/serverless-driver), and just as easily from Vercel, a Python script, a mobile backend, or your laptop.

D1 uses SQLite's SQL dialect and is built to be queried from Workers and Pages through a binding, with an HTTP API for access from elsewhere (<a href="https://developers.cloudflare.com/d1/" target="_blank" rel="nofollow noopener noreferrer">source</a>). SQLite has no users, roles, or row-level security, and Postgres extensions aren't available.

### 2. More room on the Free plan

Neon Free includes 100 projects, each with 100 CU-hours of compute a month, 1 GB of Postgres storage (20 GB across all projects), 10 branches, and 5 GB of egress ([source](/docs/introduction/plans)). Each project's compute scales to zero after 5 minutes idle and resumes on the next query, typically in a few hundred milliseconds, and projects are never paused for inactivity ([scale to zero](/docs/introduction/scale-to-zero)).

D1 on the Workers Free plan includes 10 databases of up to 500 MB each, with 5 GB of storage in total. Reads are limited to 5 million rows and writes to 100,000 rows per day, and once an account hits either limit, queries return errors until the limit resets at 00:00 UTC (<a href="https://developers.cloudflare.com/d1/platform/limits/" target="_blank" rel="nofollow noopener noreferrer">limits</a>, <a href="https://developers.cloudflare.com/d1/platform/pricing/" target="_blank" rel="nofollow noopener noreferrer">pricing</a>).

### 3. A backend you can branch

A Neon branch is a copy-on-write copy of your whole backend: the database, [Managed Better Auth](/docs/auth/overview) users and sessions, [Object Storage](/docs/storage/overview) buckets and files, and [Functions](/docs/compute/functions/overview). It starts with your data and is usually ready in under a second, so a pull request, a teammate, or an AI agent can test a change without touching production. A branch can delete itself after a time you set ([branch expiration](/docs/guides/branch-expiration)).

D1 doesn't have branches. To test a change on a copy, you export the database and import it into a new one, and a running export blocks other requests to the database (<a href="https://developers.cloudflare.com/d1/best-practices/import-export-data/" target="_blank" rel="nofollow noopener noreferrer">source</a>). D1's Time Travel restores a database to an earlier minute by overwriting it in place, and it can't yet copy a database to a new one (<a href="https://developers.cloudflare.com/d1/reference/time-travel/" target="_blank" rel="nofollow noopener noreferrer">source</a>).

### 4. One database that grows with your app

On Neon's paid plans, storage has no hard limit and grows with your data, and compute autoscales up to 16 CU (≈64 GB RAM), or runs at a fixed size up to 56 CU (≈224 GB RAM) on Scale ([autoscaling](/docs/introduction/autoscaling), [plans](/docs/introduction/plans)). Postgres processes reads and writes from many connections at once, and [read replicas](/docs/introduction/read-replicas) take read traffic off the primary.

**Each D1 database is capped at 10 GB, and Cloudflare says the limit can't be increased.** Each database is also single-threaded and processes queries one at a time, so its throughput depends on how long each query takes: at 1 ms per query it handles at most 1,000 queries a second. A database that gets too many concurrent requests returns an "overloaded" error once its queue is full (<a href="https://developers.cloudflare.com/d1/platform/limits/" target="_blank" rel="nofollow noopener noreferrer">source</a>). D1 is designed for spreading data across many small databases, for example one per user or tenant, so an app that outgrows 10 GB has to split its data.

### 5. Production controls and compliance

Neon's Scale plan includes SOC 2, ISO 27001, GDPR, and self-serve HIPAA, plus [IP Allow](/docs/introduction/ip-allow), [Private Networking](/docs/guides/neon-private-networking), an uptime SLA, and metrics and logs export, with no monthly minimum ([plans](/docs/introduction/plans), [compliance](/docs/security/compliance)). If you run a project per customer or per agent, you can cap each project's compute, egress, and storage from the API ([consumption limits](/docs/guides/consumption-limits)), and with [Claimable Neon](/claimable-neon) an agent can create a database before its user has a Neon account.

## Feature-by-feature comparison

### Database

| Feature                                       | Neon                                                                       | Cloudflare D1                                                     |
| :-------------------------------------------- | :------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **Engine**                                    | Postgres 14 to 18                                                          | SQLite's SQL semantics                                            |
| **Largest database**                          | No hard limit on paid plans, 1 GB per project on Free                      | 10 GB on Workers Paid, 500 MB on Free, **and can't be increased** |
| **Concurrency**                               | Many concurrent reads and writes                                           | **Single-threaded, one query at a time per database**             |
| **Compute**                                   | Autoscales up to 16 CU (≈64 GB RAM), fixed up to 56 CU on Scale            | No compute to size, runs within Workers CPU and memory limits     |
| **Scale to zero**<br/>Compute stops when idle | Yes, after 5 minutes, and it wakes in a few hundred milliseconds           | Yes, you're not billed for compute when there are no queries      |
| **Access control**                            | Postgres roles and row-level security                                      | No users, roles, or row-level security                            |
| **Extensions**                                | `pgvector`, PostGIS, `pg_cron`, and [more](/docs/extensions/pg-extensions) | Not available                                                     |
| **Read replicas**                             | In the same region, sharing the primary's storage                          | Global, in regions closer to users, at no extra charge            |
| **Where you query it from**                   | Any Postgres driver, the serverless driver, Hyperdrive, or the Data API    | A Workers binding, or the HTTP API                                |

D1's read replicas run in regions around the world and aren't billed separately, so a read-heavy app with users on several continents can serve reads close to each of them (<a href="https://developers.cloudflare.com/d1/best-practices/read-replication/" target="_blank" rel="nofollow noopener noreferrer">source</a>). Neon's read replicas run in the same region as the primary and share its storage, so they start in a few seconds and add no storage cost ([source](/docs/introduction/read-replicas)).

### Free plan

| Feature                        | Neon Free                                                                                 | D1 on Workers Free                                      |
| :----------------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **Databases**                  | 100 projects                                                                              | 10 databases                                            |
| **Storage**                    | 1 GB per project, 20 GB in total                                                          | 500 MB per database, 5 GB in total                      |
| **Usage limits**               | 100 CU-hours of compute per project, per month                                            | 5M rows read and 100K rows written per day, per account |
| **Branches**                   | 10 per project                                                                            | Not available                                           |
| **Point-in-time restore**      | 6 hours                                                                                   | 7 days                                                  |
| **Egress**                     | 5 GB per project                                                                          | No egress charges                                       |
| **Auth, files, and functions** | 60K monthly active users, 5 GB of Object Storage, and 1M Function invocations per project | Not part of D1                                          |

The usage limits work differently. On Neon, each project has its own monthly compute allowance, and a project that uses it up has its compute suspended until the next billing period ([plans](/docs/introduction/plans)). On D1, the read and write limits are shared across your account and reset every day, so one busy database can use up the allowance for the other nine.

D1 keeps more history on Free, with 7 days of Time Travel compared with Neon's 6-hour restore window, and it doesn't charge for egress.

### Branching and recovery

| Feature                        | Neon                                                             | Cloudflare D1                                       |
| :----------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------- |
| **Branches**                   | A copy-on-write copy of the database, auth, files, and functions | **Not available**                                   |
| **Test a change on real data** | Create a branch, usually ready in under a second                 | Create a new database and import the data           |
| **Point-in-time restore**      | 6 hours on Free, up to 7 days on Launch, up to 30 days on Scale  | Up to 7 days on Free and 30 days on Workers Paid    |
| **Query a past state**         | Yes, without changing the live database                          | No, a restore replaces the database's current state |
| **Snapshots**                  | 1 on Free, 100 on paid plans, plus scheduled backups             | Not available                                       |

A Neon restore saves the previous state to a backup branch, so you can undo it ([source](/docs/postgres/backup-restore/branch-restore)). You can also query any point in the history window directly ([time travel queries](/docs/postgres/backup-restore/time-travel-assist)).

D1's Time Travel is always on and costs nothing extra. It restores a database to any minute in its window by overwriting the database in place and cancelling in-flight queries, and you can undo a restore by restoring to the bookmark it returns. It can't yet copy a database to a new one (<a href="https://developers.cloudflare.com/d1/reference/time-travel/" target="_blank" rel="nofollow noopener noreferrer">source</a>).

### Backend services

D1 is a database. On Cloudflare, file storage, compute, and other services are separate products, such as R2 for files and Workers for code, each with its own pricing and limits. User authentication isn't part of D1.

| Feature                        | Neon                                                                                         | Cloudflare D1                       |
| :----------------------------- | :------------------------------------------------------------------------------------------- | :---------------------------------- |
| **Auth**                       | [Managed Better Auth](/docs/auth/overview), with users stored in your database               | Not part of D1                      |
| **File storage**               | S3-compatible [Object Storage](/docs/storage/overview) that branches with the database       | Separate product (R2)               |
| **Functions**                  | [Functions](/docs/compute/functions/overview) next to the data, up to 15 minutes per request | Separate product (Workers)          |
| **Realtime**                   | [Neon Realtime](/docs/realtime/overview) (beta) makes any read-only SQL query live           | Not part of D1                      |
| **HTTP API with access rules** | PostgREST-compatible [Data API](/docs/data-api/overview) that enforces row-level security    | HTTP API without row-level security |
| **AI models**                  | [AI Gateway](/docs/ai-gateway/overview) with one credential for several providers            | Separate product                    |

On Neon, these services live in the same project as the database, so a branch carries all of them. A preview branch gets its own auth users and files, and an AI agent working on a branch can't change production users or uploads.

### Pricing and plans

| Feature              | Neon                                                                      | Cloudflare D1                                                                                           |
| :------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| **Monthly minimum**  | None on any plan                                                          | $5 for Workers Paid                                                                                     |
| **What you pay for** | Compute in CU-hours, storage in GB-months                                 | Rows read, rows written, and storage                                                                    |
| **Compute**          | $0.106/CU-hour on Launch, $0.222/CU-hour on Scale                         | No compute charge for D1. Workers that query it bill separately                                         |
| **Reads and writes** | Not billed separately                                                     | 25B rows read and 50M rows written included, then $0.001 per million reads and $1.00 per million writes |
| **Storage**          | $0.35/GB-month                                                            | 5 GB included, then $0.75/GB-month                                                                      |
| **Databases**        | 100 projects on Launch, 1,000 on Scale, with no per-project fee           | 100,000 included, then $0.10 per database per month                                                     |
| **Egress**           | 5 GB per project on Free, 500 GB per project on paid plans, then $0.10/GB | None                                                                                                    |

Neon bills for the time your compute runs, so the cost of a query depends on how long it keeps the compute busy, not on how many rows it touches ([plans](/docs/introduction/plans)). D1 bills for every row a query scans or writes: a `SELECT` that scans a 5,000-row table counts as 5,000 rows read, and inserts, updates, and deletes each count as rows written. Every index on a written column adds another row written (<a href="https://developers.cloudflare.com/d1/platform/pricing/" target="_blank" rel="nofollow noopener noreferrer">source</a>).

That makes D1 inexpensive for read-heavy apps with good indexes, and expensive for write-heavy ones.

## How much does Neon cost compared to D1? (#cost-examples)

### A job board with 150K listings, on the free plans

Take a job board that lists 150K jobs, imports new ones every night, and gets about 3K visitors a month, mostly during the day:

| Platform      | Plan                                      | Monthly total |
| :------------ | :---------------------------------------- | :------------ |
| Neon          | Free                                      | **$0**        |
| Cloudflare D1 | Not supported on Free, needs Workers Paid | **$5**        |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** each listing takes about 5 KB, including its description, search index, and filter indexes. That's 150K × 5 KB = about 750 MB of data. Pages are cached by your hosting platform's CDN, so most visits don't reach the database. The project sends about 2 GB of egress a month, and its compute runs at 0.25 CU (≈1 GB RAM) for about 12 hours a day, including the nightly import.
- **Neon:** 0.25 CU × 12 hours × 30 days = 90 CU-hours, inside the project's 100 CU-hours. The 750 MB fits inside the 1 GB of Postgres storage per project, and 2 GB of egress fits inside the 5 GB per project, so the job board costs $0.
- **Cloudflare D1:** not supported on Workers Free, which limits each database to 500 MB. Workers Paid costs $5 a month, and 750 MB fits inside its included 5 GB of storage, for $5.

</details>

### An event-tracking app that writes 10M rows a day, on Launch vs Workers Paid

Take an analytics app that records about 10M events a day, around 115 a second, keeps the last 7 days, and deletes older events every night:

| Platform      | Plan         | Monthly total  |
| :------------ | :----------- | :------------- |
| Neon          | Launch       | **About $42**  |
| Cloudflare D1 | Workers Paid | **About $557** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** each event takes about 100 bytes, so 7 days of events (70M rows) is about 8 GB with indexes. Each month, the app inserts 300M rows and deletes 300M rows. Inserts are batched.
- **Neon:** compute averages 0.5 CU around the clock: 0.5 CU × 730 hours = 365 CU-hours × $0.106 = $38.69. Storage is 8 GB × $0.35 = $2.80, and about 3 GB of change history for instant restore is 3 GB × $0.20 = $0.60. Total: about $42.
- **Cloudflare D1:** inserts and deletes both count as rows written, for 600M rows written a month. The first 50M are included, so (600M − 50M) × $1.00 per million = $550. Storage beyond the included 5 GB is (8 − 5) × $0.75 = $2.25. With the $5 Workers Paid minimum, the total is about $557, before the extra rows written for each index. At several milliseconds per write, 115 writes a second is also close to what a single D1 database can process, so batching isn't optional.

</details>

### A B2B app with 25 GB of data, on Launch vs Workers Paid

Take a B2B SaaS app with 25 GB of data and steady weekday traffic, mostly reads:

| Platform      | Plan         | Monthly total                                    |
| :------------ | :----------- | :----------------------------------------------- |
| Neon          | Launch       | **About $48**, in one database                   |
| Cloudflare D1 | Workers Paid | **About $20**, split across at least 3 databases |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** compute averages 0.5 CU around the clock on Neon. On D1, reads and writes stay inside the included 25B rows read and 50M rows written.
- **Neon:** 365 CU-hours × $0.106 = $38.69, plus 25 GB × $0.35 = $8.75, for about $48.
- **Cloudflare D1:** the $5 minimum plus (25 − 5) × $0.75 = $15 of storage, for about $20. Since each database is capped at 10 GB, the data has to be split across at least three databases, for example by customer. Queries can't join across databases, and each one is still limited to one query at a time.

</details>

D1 costs less here if your data splits cleanly by customer and your queries never need to cross that split. If you'd rather keep one database, run reports across all customers, or let traffic from a large customer use more than one query at a time, Neon keeps that possible without a migration later.

## When to choose Neon vs Cloudflare D1

Choose **Neon** if:

- You want Postgres, with your existing ORM, tools, extensions, and the access control that comes with it.
- You want a free plan with 100 projects, 1 GB per project, and auth, file storage, and functions included.
- You want a branch with your data, auth users, and files for every pull request, experiment, or AI agent.
- Your database could grow past 10 GB, or needs many concurrent writes.
- Your app writes a lot of rows, since Neon bills for compute time rather than rows written.
- You query the database from more than Workers: Vercel, a Python service, a mobile backend, or a coding agent.
- You need SOC 2, HIPAA, or an uptime SLA.

Choose **Cloudflare D1** if:

- Your whole app runs on Workers, and you want the database in the same platform and bill.
- Your app is read-heavy and serves users on several continents, so global read replicas help.
- Your data splits naturally into many small databases, each under 10 GB.
- You serve large responses and want no egress charges.
- SQLite's feature set covers what you need.

### Recommendations by project type

- **For side projects and vibe-coded apps:** Neon, since Free includes 100 projects of up to 1 GB each, with auth and file storage, and projects scale to zero instead of hitting a daily query limit.
- **For apps built on Cloudflare Workers:** either. D1 is built into Workers, and Neon connects through Hyperdrive or the serverless driver when you want Postgres ([Cloudflare Workers guide](/docs/guides/cloudflare-workers)).
- **For AI agents that change your app:** Neon, since an agent can work on a branch with real data and auth, and let it expire.
- **For write-heavy apps like analytics, logging, or IoT:** Neon, since writes aren't billed per row and a database isn't limited to one query at a time.
- **For read-heavy content sites with a global audience:** D1, since reads are inexpensive and replicas run close to users.
- **For B2B SaaS:** Neon, since one Postgres database grows past 10 GB, and Scale includes SOC 2, HIPAA, and an uptime SLA.
- **For platforms that create a database per user or agent:** both are built for it. D1 includes 100,000 databases on Workers Paid. Neon has no per-project fee, per-project consumption limits, and an [Agent Plan](/docs/introduction/agent-plan) with no project limit.

To try Neon, run this command in your project. It sets up Neon for your AI coding agent, links a project, and writes your `DATABASE_URL` to `.env`:

```bash
npx neon@latest init
```

## Frequently asked questions

<Faq>

<FaqItem question="Is D1 Postgres?">

No. D1 uses SQLite's SQL semantics. SQL that works in SQLite generally works in D1, but Postgres-specific features such as roles, row-level security, and extensions like `pgvector` aren't available ([D1 overview](https://developers.cloudflare.com/d1/)).

</FaqItem>

<FaqItem question="Can I use Neon with Cloudflare Workers?">

Yes. Connect through [Hyperdrive](/docs/guides/cloudflare-hyperdrive), which pools connections across Cloudflare's network, or use the [Neon serverless driver](/docs/serverless/serverless-driver) over HTTP or WebSockets. You can keep the rest of your app on Workers and R2 and use Neon for the database ([Cloudflare Workers guide](/docs/guides/cloudflare-workers)).

</FaqItem>

<FaqItem question="What happens when a D1 database reaches 10 GB?">

It can't grow further. Cloudflare says the 10 GB limit per database can't be increased, so you'd split the data across more databases, for example one per customer ([D1 limits](https://developers.cloudflare.com/d1/platform/limits/)). On Neon's paid plans, storage has no hard limit ([plans](/docs/introduction/plans)).

</FaqItem>

<FaqItem question="Which is cheaper, Neon or D1?">

It depends on how your app reads and writes. D1 bills for rows read and written, so read-heavy apps with good indexes cost little, and write-heavy apps cost more. Neon bills for compute time and storage, so a database that writes a lot but runs on a small compute stays inexpensive, as the [cost examples](#cost-examples) show. D1 has no egress charges, and Neon includes 500 GB of egress per project on paid plans.

</FaqItem>

<FaqItem question="Does either one pause my database when it's idle?">

Neither one takes your database offline. D1 doesn't bill for compute when there are no queries. Neon scales a project's compute to zero after 5 minutes idle and resumes it on the next query, typically within a few hundred milliseconds, and never pauses projects for inactivity ([Does Neon pause inactive projects?](/faqs/does-neon-pause-inactive-projects)).

</FaqItem>

<FaqItem question="How do I move from D1 to Neon?">

Export your D1 database to a `.sql` file with `wrangler d1 export` ([D1 import and export](https://developers.cloudflare.com/d1/best-practices/import-export-data/)), load it into a local SQLite database, and migrate that to Lakebase Postgres with `pgloader`, which maps SQLite types to Postgres types ([Migrate from SQLite](/docs/import/migrate-sqlite)). Then point your Worker at Neon through Hyperdrive or the serverless driver ([Cloudflare Workers guide](/docs/guides/cloudflare-workers)).

</FaqItem>

</Faq>

<NeedHelp/>
