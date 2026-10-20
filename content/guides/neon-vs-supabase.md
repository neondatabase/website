---
title: 'Neon vs Supabase: In-Depth Comparison (2026)'
subtitle: Compare Neon and Supabase on branching, autoscaling, backups, auth, functions, storage, compliance, and pricing, with cost examples for each stage.
author: rishi-raj-jain
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-05-06T00:00:00.000Z'
updatedOn: '2026-10-14T09:39:44.914Z'
---

<Admonition type="note">
Features and prices in this guide were checked against the Neon and Supabase documentation and pricing pages on October 14, 2026. Confirm the current rates on the [Neon pricing](/pricing) page and on Supabase's pricing page before you decide.
</Admonition>

Neon and Supabase both give you a Postgres backend with managed authentication, a Data API, serverless functions, and S3-compatible file storage. The biggest difference is the architecture: Neon runs every service on a serverless core that autoscales, scales to zero, and branches with your data, while Supabase runs each project on a fixed Postgres instance that's billed every hour on paid plans.

This guide compares the two service by service, shows what each one costs at three stages, and recommends one for each type of team. For a plan-by-plan comparison, pick your stage:

<DetailIconCards>
<a href="/guides/neon-vs-supabase-free-plan" title="Prototyping and vibe coding" description="Compare the free plans for prototypes, side projects, and AI-assisted development" icon="code">Stage 1: Prototyping</a>
<a href="/guides/neon-launch-plan-vs-supabase-pro-plan" title="Launching an MVP or startup" description="Compare the Neon Launch and Supabase Pro plans for an app with real users" icon="wallet">Stage 2: MVP and startup</a>
<a href="/guides/neon-scale-plan-vs-supabase-team-plan" title="Scaling a business" description="Compare the Neon Scale and Supabase Team plans for larger production workloads" icon="scale-up">Stage 3: Scaling</a>
</DetailIconCards>

## How is Neon different?

### 1. A backend you can branch

A Neon branch is a copy-on-write copy of your whole backend: the database, [Managed Better Auth](/docs/auth/overview) users and sessions, [Object Storage](/docs/storage/overview) buckets and objects, and [Functions](/docs/compute/functions/overview) ([source](/docs/introduction/branching)). It starts with your production data and is **usually ready in under a second**, so a pull request, a teammate, or an AI agent can test against real data without touching production. **An AI agent can create a branch, run its change, and set the branch to delete itself after an hour** ([source](/docs/guides/branch-expiration)). You can also restore a branch to an earlier point in time to recover from a bad migration ([source](/docs/postgres/backup-restore/branch-restore)).

A Supabase preview branch is a separate environment with its own instance. **It has to start that instance and run your migrations and seed files before it's ready, and it starts without your production data, auth users, or files**, so every experiment waits on setup and runs against sample data. It's also billed for every hour it exists.

### 2. You pay for usage, not for running instances

Neon has no monthly minimum on any plan ([source](/docs/introduction/plans#price)). A compute autoscales within a range you set, up to 16 CU (64 GB RAM), and scales to zero when it's idle, so a project that nobody is using costs only its storage ([autoscaling](/docs/introduction/autoscaling), [scale to zero](/docs/introduction/scale-to-zero)). On paid plans, every project also gets its own 500 GB egress allowance ([source](/docs/introduction/plans#public-network-transfer)).

Supabase Pro costs at least $25 a month, and Team costs at least $599. Each project runs on a fixed instance that's billed every hour of the month, and handling more load means resizing it manually, usually with **some downtime** (<a href="https://supabase.com/docs/guides/platform/compute-and-disk" target="_blank" rel="nofollow noopener noreferrer">source</a>). One egress allowance covers the whole organization.

### 3. Built for apps and agents that create many backends

Neon Free and Launch include 100 projects, and Scale includes 1,000, with no fee per project ([source](/docs/introduction/plans#projects)). That fits a project per app, per customer, or per AI agent, and you can create projects and branches from the API, the CLI, or the [MCP server](/docs/ai/neon-mcp-server). For platforms that create thousands of databases, the [Agent Plan](/docs/introduction/agent-plan) has no project limit. Your app can also call models from several AI providers through [AI Gateway](/docs/ai-gateway/overview) with your Neon credential, at each provider's list price.

Supabase Free allows 2 active projects, and on paid plans each extra project adds an always-on instance from about $10 a month. Supabase doesn't offer an AI gateway.

### 4. Controls for platforms with many projects

If you run a project for each of your users, Neon lets you control every project through the API. You can cap a project's compute time, written data, egress, and branch size, and Neon suspends that project's compute when it reaches a cap, so a user on your free tier can't use more than you allow ([source](/docs/guides/consumption-limits)). You can also give each project its own autoscaling range to match your pricing tiers, and read each project's usage from the consumption API to bill your users for what they use ([source](/docs/guides/consumption-metrics)). With [Claimable Neon](/claimable-neon), your app or an AI agent can create a project before the user has a Neon account, and the user claims it later. An unclaimed project expires after 72 hours ([source](/docs/guides/platform-integration-overview#claimable-database-flow)). The [database per user](/use-cases/database-per-user) use case shows how these fit together.

On Supabase, **the Spend Cap applies to the whole organization rather than to each project**, it's available only on Pro, and **it doesn't cover compute**, so you can't give each of your users their own usage limit.

## Service-by-service comparison

### Database

Neon's database is [Lakebase Postgres](/docs/introduction/architecture-overview): Postgres 14 to 18 on separate compute and storage ([source](/docs/reference/compatibility)). Supabase runs each project on a Postgres instance with its own disk.

<InlineSvg src="/docs/guides/neon-vs-supabase-architecture.svg" title="Neon runs independent services on Lakebase Postgres, a serverless core that separates compute from storage, while Supabase builds its services on a traditional Postgres instance that couples compute and disk, with auth, API, and storage state living in the database" />

| Feature                                               | Neon                                                             | Supabase                                                                                |
| :---------------------------------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Autoscaling**<br/>Compute changes size with load    | Yes, up to 16 CU (64 GB RAM), without a restart                  | No, a fixed instance that you resize manually, usually with **some downtime**           |
| **Scale to zero**<br/>Compute stops when idle         | Yes, after 5 minutes, and it wakes in a few hundred milliseconds | Not on paid plans. Free projects pause after a week of inactivity until you resume them |
| **Largest compute**                                   | 56 CU (224 GB RAM) on Scale                                      | 16XL (256 GB RAM)                                                                       |
| **Read replicas**<br/>Extra computes for read traffic | Share the primary's storage and bill only while they run         | Run all month at the primary's size, with their own disk 1.25 times its size            |
| **Connection pooling**                                | Up to 10K pooled connections per compute                         | From 200 clients on Micro to 12K on 16XL                                                |
| **Storage price**                                     | $0.35/GB-month for the data you store                            | 8 GB of disk per project, then $0.125/GB-month for the disk you provision               |

Since a Neon compute autoscales, you pay for your average usage instead of sizing an instance for your peak ([source](/docs/introduction/autoscaling)). Across Neon's fleet, production databases use 2.4x less compute under autoscaling than they would on a fixed size set at their P99.5 usage plus 20% ([autoscaling report](/autoscaling-report)). Read replicas read from the same storage as the primary, so they start in a few seconds and add no storage cost ([source](/docs/introduction/read-replicas)).

Supabase offers a larger single instance, with 256 GB of RAM, and its disk costs less per GB, so a large database that's rarely queried can cost less on Supabase.

### Branching (#branching)

| Feature                                          | Neon                                                                                                           | Supabase                                                                                   |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **Starting data**<br/>What a new branch contains | A copy-on-write copy of the parent's data                                                                      | Only what your seed files insert, with no production data                                  |
| **Ready to use**                                 | **Usually in under a second**                                                                                  | **After a new instance starts and your migrations and seed files run**                     |
| **Auth, files, and functions**                   | Auth users, Object Storage, and Functions branch with the database                                             | **Preview branches start without your auth users or files**                                |
| **Cleanup**                                      | Set an expiration, and the branch deletes itself                                                               | Preview branches are deleted when the pull request is merged or closed                     |
| **Billing**                                      | 10 branches per project included (25 on Scale), then $1.50/branch-month, plus compute only while a branch runs | Every hour the branch exists, from $0.01344/hour on Micro, and compute credits don't apply |

A Neon branch shares its parent's storage and stores only the data it changes, so you pay only for the storage those changes use ([source](/docs/introduction/plans#storage)). Its compute scales to zero when nobody is using it, so a preview that waits a day for review costs almost nothing. For the workflow-level comparison, read [Branch-per-PR vs a shared staging database](/guides/branch-per-pr-vs-staging-database).

On Supabase, **every new branch waits for its own instance to start and for your migrations and seed files to run**, and once it's ready, it has no production data, auth users, or files. That slows down AI agents that create a branch for each attempt, and teammates who want a fresh environment for each experiment.

### Backups and recovery

| Feature                                                         | Neon                                                                                                           | Supabase                                                                               |
| :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Point-in-time restore**<br/>Restore to any moment in a window | Included: 6 hours on Free, up to 7 days on Launch, and up to 30 days on Scale, at $0.20/GB-month on paid plans | Add-on for $100/month per 7 days, with at least a Small compute. Not available on Free |
| **During a restore**                                            | Takes a few seconds, and a backup branch lets you undo it                                                      | **Downtime** until the restore finishes                                                |
| **Manual snapshots**                                            | 1 on Free, 100 on paid plans                                                                                   | No snapshots, so you export with `pg_dump` or the Supabase CLI                         |
| **Scheduled backups**                                           | Daily, weekly, or monthly on paid plans, kept up to 35 days                                                    | Daily on paid plans, kept 7 days on Pro and 14 days on Team. None on Free              |

On Neon, a restore saves the previous state to a backup branch, so you can undo it ([source](/docs/postgres/backup-restore/branch-restore)). Backup schedules take snapshots automatically, and those snapshots don't count toward the limit of 100 manual snapshots ([source](/docs/guides/backup-restore)). On Supabase, **turning on point-in-time recovery stops the daily backups**, and the project is unavailable until a restore finishes.

### Auth (#auth)

Neon's [Managed Better Auth](/docs/auth/overview) is hosted [Better Auth](https://www.better-auth.com/), and Supabase Auth is Supabase's own product. Both store your users in your Postgres database.

| Feature                                           | Neon                                                                                                     | Supabase                                                                                     |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Included monthly active users**                 | 60K on Free, up to 1M on paid plans                                                                      | 50K on Free, 100K on Pro and Team, then $0.00325/MAU                                         |
| **Access control**<br/>How your data is protected | Sessions are verified in your app server, and RLS applies only to tables you expose through the Data API | Clients reach tables through the Data API, so every exposed table needs a correct RLS policy |
| **In a branch**                                   | Users and sessions branch with your database                                                             | Preview branches start without your auth users                                               |
| **Default email sender**                          | Shared and rate-limited, for verification codes only                                                     | 2 auth emails per hour, project-wide                                                         |

With up to 1M monthly active users included on paid plans, a growing consumer app pays nothing extra for auth on Neon ([source](/docs/introduction/plans#auth)). On Supabase, every 100K users beyond the included 100K adds $325 a month. On both platforms, the default email sender is for development, so connect your own email provider before launch ([source](/docs/auth/production-checklist)).

### Functions

| Feature              | Neon                                                                      | Supabase                                                     |
| :------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------- |
| **Runtime**          | Node.js 24                                                                | Deno-compatible TypeScript                                   |
| **Maximum run time** | 15 minutes to the first byte, and streams stay open while data flows      | 150 seconds on Free, 400 seconds on paid plans               |
| **Memory**           | 2,048 MiB                                                                 | 256 MB                                                       |
| **Where it runs**    | On a branch, in the same region as its data, with `DATABASE_URL` injected | Close to your users, in regions around the world             |
| **Invocations**      | 1M per project on Free, and $0.60/M plus Capacity-Hours on paid plans     | 500K per organization on Free, 2M on Pro and Team, then $2/M |

The longer run time covers AI agents that chain several model calls, and WebSocket or SSE servers that hold connections open ([source](/docs/compute/functions/reference/runtime-limits)). Since a Neon Function runs in the same region as its branch, its queries don't cross regions. Supabase Edge Functions run close to your users instead, and Supabase tells you to treat the database as a remote service when you call it from a function. A function that runs far from your database's region waits on a network round trip for every query.

Supabase includes 2M invocations on paid plans, so short handlers like webhooks can cost less there.

### Object storage

| Feature                                                             | Neon                                                         | Supabase                                                             |
| :------------------------------------------------------------------ | :----------------------------------------------------------- | :------------------------------------------------------------------- |
| **In a branch**<br/>What a new branch's buckets contain             | Every bucket and file from the parent, copied on write       | **No files from your main project**                                  |
| **S3 API coverage**<br/>Beyond reads, writes, and multipart uploads | CORS rules, bucket and object tags, and browser form uploads | **No CORS rules or tags**                                            |
| **S3 access keys**<br/>What a server key can reach                  | **Read-only or read-write, limited to one branch**           | Full access to every bucket, bypassing RLS                           |
| **Included storage**                                                | 5 GB per project on Free                                     | 1 GB per organization on Free, 100 GB per organization on paid plans |
| **Price**                                                           | $0.023/GB-month on paid plans, with no request charges       | $0.0213/GB-month beyond the included 100 GB                          |
| **Largest file**                                                    | 5 GiB                                                        | 50 MB on Free, up to 500 GB on paid plans                            |

Neon Object Storage branches with your database. A new branch starts with every bucket and file from its parent, along with the rows that point at them, and uploads, overwrites, or deletes on that branch never reach production ([source](/docs/storage/buckets#bucket-branching)). A preview can test an upload flow against real files, and an AI agent can clean up files on its own branch without touching production. **A new Supabase branch starts without any files from your main project**, so a preview of a page that shows user uploads has nothing to show until you upload test files.

Neon also covers more of the S3 API. You can set CORS rules so that only your site can upload from the browser, tag buckets and objects, and accept uploads from a browser form with a presigned POST ([source](/docs/storage/s3-compatibility)). Each Neon credential is read-only or read-write and works only on its branch and the branches created from it ([source](/docs/storage/authentication)). A [Function Trigger](/docs/compute/functions/triggers/object-storage) can also run a function whenever a file is uploaded. **Supabase's S3 API doesn't support CORS rules or tags, and its S3 access keys have full access to every bucket and bypass RLS**, so a leaked key exposes every file in the project.

Supabase accepts much larger files on paid plans, up to 500 GB, for raw video or database backups.

### AI (#ai)

| Feature                                                             | Neon                                                                    | Supabase    |
| :------------------------------------------------------------------ | :---------------------------------------------------------------------- | :---------- |
| **AI Gateway**<br/>One credential for models from several providers | Yes, on paid plans, billed from prepaid credits at provider list prices | Not offered |
| **Gateway per branch**                                              | Each branch has its own endpoint                                        | Not offered |
| **Vector search**                                                   | `pgvector`                                                              | `pgvector`  |

AI Gateway routes requests to models from Anthropic, OpenAI, Google, and other providers using your Neon credential, at list prices with no markup ([source](/docs/ai-gateway/overview)). A preview branch can test a new model without changing production. On Supabase, you sign up with each provider and manage a separate API key and bill for each one.

### Compliance and security (#compliance)

| Feature                                               | Neon                                                                       | Supabase                                                                                                                                         |
| :---------------------------------------------------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Certifications**<br/>Audits and regulations covered | SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, ISO 27701, GDPR, and CCPA       | SOC 2 Type 2, ISO 27001, and GDPR                                                                                                                |
| **Plan with compliance reports**                      | Scale, with no monthly minimum                                             | **Team, from $599/month**                                                                                                                        |
| **HIPAA**                                             | Self-serve on Scale: accept the BAA in the Console, at no extra cost today | **Paid add-on on Team, with no listed price**, after you request a BAA through a form                                                            |
| **HIPAA project requirements**                        | Turn on HIPAA in the project's settings                                    | **Point-in-time recovery ($100/month per 7 days, with at least a Small compute)**, SSL enforcement, network restrictions, and connection logging |
| **Uptime SLA**                                        | Included on Scale                                                          | Enterprise plan only                                                                                                                             |
| **Private networking**                                | AWS PrivateLink and IP Allow on Scale                                      | AWS PrivateLink on Team                                                                                                                          |
| **Read-only and per-project roles**                   | Viewer and Collaborator roles on every plan                                | Team plan (from $599/month)                                                                                                                      |

Neon Scale includes SOC 2, ISO 27001, and the other reports above with no monthly minimum, and you request them from the [Trust Center](https://trust.neon.com/) ([source](/docs/security/compliance)). HIPAA is self-serve on Scale: you accept the Business Associate Agreement in the Console and turn on HIPAA for each project that stores health data. It's included at no extra cost today, and Neon will give notice before it adds a 15% surcharge ([source](/docs/security/hipaa)). Every connection to Neon already requires TLS, and Scale adds [IP Allow](/docs/introduction/ip-allow) and [Private Networking](/docs/guides/neon-private-networking) ([source](/docs/security/security-overview)).

On Supabase, **compliance reports start on the Team plan, at least $599 a month**, and HIPAA is a paid add-on on top of that. A HIPAA project also has to turn on point-in-time recovery, so **the smallest HIPAA setup costs about $704 a month before the add-on's own price**: $599 for Team, $100 for 7 days of point-in-time recovery, and $5 for a Small compute after the $10 compute credit.

### Pricing and plans

| Feature                    | Neon                                                                      | Supabase                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------- |
| **Monthly minimum**        | None on any plan                                                          | $25 on Pro, $599 on Team                                                                                          |
| **Free plan**              | 100 projects that scale to zero when idle                                 | 2 active projects that pause after a week of inactivity                                                           |
| **Projects on paid plans** | 100 on Launch, 1,000 on Scale, with no per-project fee                    | The first is included, then from about $10 a month each                                                           |
| **Idle compute**           | Not billed, since compute scales to zero                                  | Billed every hour on paid plans                                                                                   |
| **Egress**                 | 5 GB per project on Free, 500 GB per project on paid plans, then $0.10/GB | Per organization: 5 GB uncached and 5 GB cached on Free, 250 GB of each on paid plans, then $0.09/GB and $0.03/GB |

Neon bills compute in CU-hours (a CU is about 4 GB of RAM), storage in GB-months, and Functions in invocations and Capacity-Hours, with Free plan allowances for each ([source](/docs/introduction/plans)). Supabase charges a subscription that includes quotas, plus each project's instance by the hour, plus any usage beyond the quotas.

## How much does Neon cost compared to Supabase? (#cost-examples)

Here's one example for each stage, with what you'd pay on each platform. Each plan guide has more examples for its stage.

### A job board with 150K listings, on the free plans

Take a job board that lists 150K jobs, imports new ones every night, and gets about 3K visitors a month, mostly during the day:

| Platform | Plan                             | Monthly total |
| :------- | :------------------------------- | :------------ |
| Neon     | Free                             | **$0**        |
| Supabase | Not supported on Free, needs Pro | **$25**       |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** each listing takes about 5 KB: a 500-word description stored as HTML and compressed by Postgres, the job details, a full-text search index, and indexes for filters like location and salary. That's 150K × 5 KB = about 750 MB of Postgres data. Pages are cached by your hosting platform's CDN, so most visits and search engine crawls don't reach the database. The project sends about 2 GB of egress a month, and its compute runs at 0.25 CU for about 12 hours a day, including the nightly import.
- **Neon:** 0.25 CU × 12 hours × 30 days = 90 CU-hours, inside the project's 100 CU-hours. The 750 MB fits inside the 1 GB of Postgres storage per project, and 2 GB of egress fits inside the 5 GB per project, so the job board costs $0. The compute scales to zero for the rest of the day.
- **Supabase:** not supported on the Free plan, which limits each database to 500 MB. The Pro plan costs $25 a month, its $10 compute credit covers a Micro instance, and 750 MB fits inside the included 8 GB of disk, for $25.

</details>

For more examples on the free plans, read [Neon vs Supabase Free plan](/guides/neon-vs-supabase-free-plan).

### A B2B API with a preview for every pull request, on Launch vs Pro

Take a startup with 6 engineers that runs an API its customers call around the clock. The team opens about 60 pull requests a month, and each one gets a preview environment that stays up for 2 days:

| Platform | Plan                      | Monthly total  |
| :------- | :------------------------ | :------------- |
| Neon     | Launch                    | **About $45**  |
| Supabase | Pro with a Medium compute | **About $114** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 5 GB of Postgres data, from about 20M records at about 250 bytes each including indexes. Compute averages 0.5 CU around the clock, with peaks of about 1 CU (4 GB RAM). Each preview's compute runs for about 3 hours at 0.25 CU while CI and reviewers use it, and each preview changes about 10 MB of data.
- **Neon:** production uses 0.5 CU × 730 hours = 365 CU-hours × $0.106 = $38.69, plus 5 GB × $0.35 = $1.75 of database storage. The previews use 60 × 3 hours × 0.25 CU = 45 CU-hours × $0.106 = $4.77, and they store only their changes, about 10 MB each for 2 days, which costs about $0.01. About 4 previews exist at a time, inside the 10 branches included per project, for about $45 in total. Each preview starts with a copy of production data, auth users, and files.
- **Supabase:** a Medium instance (4 GB RAM) is the smallest that handles the 1 CU peaks, at about $60 a month, minus the $10 compute credit = $50, plus the $25 subscription = $75. Each preview branch is billed for every hour it exists: 60 × 48 hours = 2,880 hours × $0.01344 = $38.71 on Micro compute, and compute credits don't apply to branches. Total: about $114. The previews start from migrations and seed files, without production data.

</details>

For more examples on these plans, read [Neon Launch vs Supabase Pro](/guides/neon-launch-plan-vs-supabase-pro-plan).

### A ticketing platform with on-sale spikes, on Scale vs Team

Take a ticketing platform that sells tickets around the clock and runs 8 big on-sales a month, when tens of thousands of fans try to buy in the same hour:

| Platform | Plan                    | Monthly total    |
| :------- | :---------------------- | :--------------- |
| Neon     | Scale                   | **About $190**   |
| Supabase | Team with a 4XL compute | **About $1,553** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 40 GB of Postgres data: about 36 GB from 3M orders a year over 3 years, at about 4 KB per order with its tickets, payments, and indexes, plus about 4 GB of events, venues, seat maps, and customer accounts. Compute averages 1 CU around the clock and runs at about 9 CU (36 GB RAM) for 1 hour during each on-sale.
- **Neon:** the compute autoscales between 1 and 9 CU: (1 CU × 730 hours) + (8 more CU × 8 hours) = 794 CU-hours × $0.222 = $176.27, plus 40 GB × $0.35 = $14 of database storage, for about $190. The compute scales back down after each on-sale, with no resizing.
- **Supabase:** the $599 monthly minimum, plus a 4XL instance (64 GB RAM, 16 vCPUs), the smallest that handles the 9 CU peaks, at about $960 minus the $10 compute credit = $950. Disk beyond the included 8 GB adds (40 − 8) × $0.125 = $4. Total: about $1,553. Running a smaller instance and resizing it before and after each on-sale would mean 16 resizes a month, each usually with **some downtime**.

</details>

For more examples on these plans, read [Neon Scale vs Supabase Team](/guides/neon-scale-plan-vs-supabase-team-plan).

## When to choose Neon vs Supabase

Choose **Neon** if:

- Your traffic changes through the day or week, or your app sits idle, and you want to pay for your average usage instead of your peak.
- You want a branch with production data, auth users, and files for every pull request, experiment, or AI agent, **ready in under a second**.
- You run many backends: a project per app, per customer, or per agent.
- Your app could pass 100K monthly active users.
- You want point-in-time restore, snapshots, and scheduled backups without add-ons.
- Your functions run AI agents, stream responses, or hold WebSocket connections longer than 400 seconds.
- You need SOC 2, HIPAA, or an uptime SLA without a $599 monthly minimum.
- Your app calls models from several AI providers, and you want one credential and one bill.

Choose **Supabase** if:

- Your team already builds on Supabase and its client libraries.
- You run one app with steady traffic that fits a single fixed instance all month.
- Your database is large but rarely queried, so storage is most of your bill.
- You need to store files larger than 5 GiB, like raw video or database backups.
- You need more than 224 GB of RAM on a single database instance.
- Your functions handle up to 2M short requests a month, like webhooks.

### Recommendations by team type

- **For teams that use preview environments:** Neon, since each pull request gets a branch with production data that's usually ready in under a second.
- **For archives and other storage-heavy databases:** Supabase, since disk costs $0.125/GB-month after the included 8 GB.
- **For solo developers and vibe coders:** Neon, since Free includes 100 projects that scale to zero instead of pausing.
- **For AI agents that iterate on your app:** Neon, since an agent can create a branch with your data and auth in under a second, test its change, and let the branch expire, **without waiting for a new instance to start**.
- **For B2B SaaS that goes through security reviews:** Neon, since SOC 2, HIPAA, and an uptime SLA come with Scale, with no monthly minimum.
- **For apps that store very large media or backups:** Supabase, since paid plans accept files up to 500 GB.
- **For startups shipping an MVP:** Neon, since there's no monthly minimum and auth covers up to 1M monthly active users.
- **For platforms that create a database per user or AI agent:** Neon, since projects have no per-project fee, and the Agent Plan has no project limit.
- **For AI product teams:** Neon, since AI Gateway and 15-minute Functions run next to your data.
- **For agencies that build apps for clients:** Neon, since each client's project costs only its usage and gets its own egress allowance.

To try Neon, run this command in your project. It sets up Neon for your AI coding agent, links a project, and writes your `DATABASE_URL` to `.env`:

```bash
npx neon@latest init
```

## Frequently asked questions

<Faq>

<FaqItem question="Is Neon just a database?">

No. Neon is a Postgres backend: [Lakebase Postgres](/docs/introduction/architecture-overview) with [Managed Better Auth](/docs/auth/overview), a PostgREST-compatible [Data API](/docs/data-api/overview), [Functions](/docs/compute/functions/overview), S3-compatible [Object Storage](/docs/storage/overview), and [AI Gateway](/docs/ai-gateway/overview). These services branch with your database, so a branch is a copy of the whole backend.

</FaqItem>

<FaqItem question="What's the difference between a Neon branch and a Supabase branch?">

A Neon branch is a copy-on-write copy of the parent branch's data and services, usually ready in under a second. It bills for compute only while it runs, and 10 branches per project are included (25 on Scale). A Supabase preview branch is a separate environment with its own instance. **It's ready only after that instance starts and your migrations and seed files run**, it has no production data, auth users, or files, and it's billed for every hour it exists, from $0.01344/hour on Micro.

</FaqItem>

<FaqItem question="Which is cheaper, Neon or Supabase?">

It depends on your traffic. Neon bills for the compute you use, scales to zero when idle, and has no monthly minimum, so apps with idle time or changing traffic usually cost less on Neon, as the [cost examples](#cost-examples) show. Supabase can cost less for a large database that's rarely queried, since its disk costs $0.125/GB-month after the included 8 GB, compared with $0.35/GB-month on Neon.

</FaqItem>

<FaqItem question="Which compliance certifications do Neon and Supabase have?">

Neon has SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, ISO 27701, GDPR, and CCPA, plus self-serve HIPAA, all on the Scale plan with no monthly minimum ([source](/docs/security/compliance)). Supabase has SOC 2 Type 2, ISO 27001, and GDPR, with reports on the Team plan from $599 a month, and HIPAA as a paid add-on.

</FaqItem>

<FaqItem id="only-on-one-side" question="Does Neon have managed realtime, cron jobs, or queues?">

Realtime, yes. [Neon Realtime](/docs/realtime/overview) (beta) makes any read-only SQL query live, including joins, aggregates, and ordering, and works with branching and scale to zero. Supabase Realtime pushes messages and row changes to clients, with subscriptions that filter on column values ([how they compare](/docs/realtime/overview#how-does-neon-realtime-compare-with-alternatives)). For a custom realtime server, [Functions](/docs/compute/functions/websockets) can also host WebSocket and SSE endpoints.

Cron jobs and queues aren't managed services on Neon today. The [`pg_cron`](/docs/extensions/pg_cron) extension schedules jobs inside Postgres, though jobs run only while the compute is active.

</FaqItem>

<FaqItem question="Does Neon support row-level security?">

Yes. RLS works on Neon as it does on any Postgres, and the [Data API](/docs/data-api/access-control) uses it when you expose tables to the browser. With Managed Better Auth, you can also verify sessions in your app server instead, so RLS is optional.

</FaqItem>

<FaqItem question="Can I use Neon and Supabase together?">

Yes. Both run standard Postgres, so you can keep an existing app on Supabase and run new databases on Neon, for example a database per customer or per AI agent.

</FaqItem>

<FaqItem question="How do I migrate from Supabase to Neon?">

Start with [Migrate from Supabase to Lakebase Postgres](/docs/import/migrate-from-supabase) for the database, then [Migrate from Supabase Auth](/docs/auth/migrate/from-supabase) for your users.

</FaqItem>

</Faq>

<NeedHelp/>
