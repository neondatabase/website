---
title: 'In-Depth: Neon Scale vs Supabase Team Plan'
subtitle: Compare Neon Scale and Supabase Team on pricing, compliance, backups, replicas, private networking, observability, and AI Gateway for production apps.
author: rishi-raj-jain
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-07-15T00:00:00.000Z'
updatedOn: '2026-10-14T09:42:15.709Z'
---

<Admonition type="note">
Plan limits and prices in this guide were checked against the Neon and Supabase documentation and pricing pages on October 14, 2026. Confirm the current rates on the [Neon pricing](/pricing) page and on Supabase's pricing page before you decide.
</Admonition>

Neon's Scale plan and Supabase's Team plan are the plans for production apps that need compliance reports, longer recovery windows, and network controls. The biggest difference is how they bill: Scale has no monthly minimum and charges only for what your app uses, while Team has a $599 monthly minimum and adds an always-on instance for every project you run, plus any usage beyond the included quotas.

This guide compares the two plans feature by feature. For a service-by-service comparison beyond the plans, read [Neon vs Supabase](/guides/neon-vs-supabase).

## How is Neon unique?

### 1. Compliance and security without a $599 monthly minimum

Neon Scale has no base fee. SOC 2, ISO 27001, HIPAA, IP Allow, Private Networking, and metrics export come with the plan, and you pay only for the compute, storage, and services your app uses ([source](/docs/introduction/plans#compliance-and-security)).

Supabase Team costs at least $599 a month, and its $10 compute credit covers one Micro instance. Every project also runs on its own always-on instance, billed every hour.

### 2. Compute that autoscales and scales to zero

A Neon compute autoscales within a range you set, up to 16 CU (64 GB RAM), with no restart, so you pay for your average usage instead of your peak ([source](/docs/introduction/autoscaling)). On Scale, you also set how long a compute stays idle before it scales to zero, starting at 1 minute, or keep it always on ([source](/docs/introduction/scale-to-zero)).

A Supabase Team project runs on a fixed instance that's billed every hour of the month, and handling more load means resizing it manually, usually with **some downtime**.

### 3. An uptime SLA on a self-serve plan

Neon Scale includes an uptime SLA, so you don't need an enterprise contract to give your customers an availability commitment ([source](/docs/introduction/plans#uptime-sla)). On Supabase, the uptime SLA comes only with the Enterprise plan, and Team includes a response SLA for support tickets instead.

### 4. 30 days of point-in-time restore and scheduled backups, without add-ons

On Neon Scale, you can restore your production branch to any point in the last 30 days, and you pay $0.20/GB-month for the change history you keep ([source](/docs/postgres/backup-restore/history-window)). Backup schedules also take daily, weekly, or monthly snapshots and keep them for up to 35 days ([source](/docs/guides/backup-restore#create-backup-schedules)).

Supabase Team keeps daily backups for 14 days. Point-in-time recovery is an add-on that costs $100 a month for every 7 days of history, so a 28-day window costs $400 a month, and it needs at least a Small compute.

### 5. Read replicas that share your primary's storage

A Neon read replica is a compute that reads from the same storage as your primary, so it starts in a few seconds, adds no storage cost, and bills only while it runs ([source](/docs/introduction/read-replicas)). Each replica has its own size and can scale to zero when it's idle.

A Supabase read replica is a separate database that runs all month on the same compute size as the primary, with its own disk 1.25 times the size of the primary's, and compute credits don't apply to it.

### 6. Functions that run for up to 15 minutes

A Neon Function has 2,048 MiB of memory and can run for up to 15 minutes before it sends its first byte, then keep streaming while data flows ([source](/docs/compute/functions/reference/runtime-limits)). That covers AI agents that chain several model calls, and WebSocket or SSE servers that hold connections open.

A Supabase Edge Function on Team stops after 400 seconds and has 256 MB of memory.

### 7. One credential for models from several AI providers

Neon AI Gateway lets your app call models from OpenAI, Google, and other providers with your Neon credential, at each provider's list price with no markup ([source](/docs/ai-gateway/overview)). Each branch has its own gateway endpoint, so a preview branch can test a new model without changing production.

Supabase doesn't offer an AI gateway, so you sign up with each provider and manage a separate API key and bill for each one.

## Comparing the production plans feature by feature

### 1. Projects per organization (#projects-per-organization)

|                         | Neon Scale                      | Supabase Team                                       |
| :---------------------- | :------------------------------ | :-------------------------------------------------- |
| Included projects       | 1,000, and more on request      | 1, covered by the $10 compute credit                |
| Cost of a project       | No fee, only the usage it bills | About $10 a month or more for its always-on compute |
| Cost of an idle project | Storage only                    | The full compute price, every hour                  |

A project is a full backend with its own database, branches, auth, functions, and storage. On Neon Scale, you can give each app, environment, or customer its own project, which keeps their data separate for security reviews, and idle projects bill only their storage ([source](/docs/introduction/plans#projects)). On Supabase, the $599 monthly minimum is per organization, but compute is per project, so every staging environment, second app, or customer database adds its own instance.

### 2. Database compute and idle behavior

|                      | Neon Scale                                                                     | Supabase Team                                    |
| :------------------- | :----------------------------------------------------------------------------- | :----------------------------------------------- |
| Billing              | $0.222/CU-hour, only while the compute runs                                    | A fixed instance, billed every hour of the month |
| Scaling              | Autoscales up to 16 CU (64 GB RAM) with no restart, or fixed sizes up to 56 CU | Manual resize, usually with **some downtime**    |
| When the app is idle | Scales to zero after an idle period you choose, or stays on                    | Keeps running and billing                        |
| Pooled connections   | Up to 10K on any compute size                                                  | From 200 on Micro to 12K on 16XL                 |

A Neon compute scales up when traffic increases and down when it drops, so you pay for your average usage instead of your peak ([source](/docs/introduction/autoscaling)). On Scale, you set how long a compute waits before it scales to zero, so production can stay on while staging and other projects suspend when they're idle ([source](/docs/introduction/scale-to-zero)). A Supabase instance runs at one size, so you either pay for your peak all month or resize it manually, usually with **some downtime** (<a href="https://supabase.com/docs/guides/platform/compute-and-disk" target="_blank" rel="nofollow noopener noreferrer">source</a>). Neon's connection pooler also accepts up to 10K client connections on any compute size, while Supabase raises its pooler limit only with larger instances ([source](/docs/connect/connection-pooling)).

### 3. Database storage

|               | Neon Scale                                           | Supabase Team                                                 |
| :------------ | :--------------------------------------------------- | :------------------------------------------------------------ |
| Price         | $0.35/GB-month                                       | 8 GB per project included, then $0.125/GB-month               |
| What's billed | The data you store, measured hourly                  | The disk you provision, which can grow but not shrink         |
| Resizing      | Not needed, storage grows and shrinks with your data | Wait about 4 hours after each disk change before the next one |
| Read replicas | No extra storage                                     | A disk 1.25 times the size of the primary's                   |

Neon bills only the data you actually store, measured hourly. Read replicas share the primary's storage, and a child branch bills only the data it changes ([source](/docs/introduction/plans#storage)). Supabase bills the disk you provision, which can grow but not shrink.

### 4. Read replicas (#read-scaling)

<InlineSvg src="/docs/guides/neon-vs-supabase-read-replicas.svg" title="Neon read replicas are extra computes reading from the same shared storage as the primary, while Supabase read replicas are separate database instances with their own replicated disk" />

|         | Neon Scale                                       | Supabase Team                                             |
| :------ | :----------------------------------------------- | :-------------------------------------------------------- |
| Compute | Its own size, with autoscaling and scale to zero | The same size as the primary, running all month           |
| Storage | None, since it reads from the primary's storage  | Its own disk, 1.25 times the size of the primary's        |
| Billing | CU-hours only while it runs                      | Every hour, for compute and disk, without compute credits |

A Neon read replica reads from the primary's storage, so it starts in a few seconds with all of your data, and you can size it for its own workload ([source](/docs/introduction/read-replicas)). For example, a reporting replica that runs at 4 CU for 3 hours each night costs about $80 a month on Neon Scale. On Supabase Team, a replica for a 2XL primary costs about $410 a month for compute alone, plus its disk.

### 5. Branches (#preview-environments)

|                           | Neon Scale                                                                    | Supabase Team                                                                          |
| :------------------------ | :---------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| Included                  | 25 per project                                                                | None                                                                                   |
| Additional branches       | $1.50/branch-month (about $0.002/hour), plus compute only while a branch runs | $0.01344/hour per branch on Micro (about $10 a month), and compute credits don't apply |
| What a branch starts with | Production data, auth, Object Storage, and Functions, copy-on-write           | Your migrations and seed data                                                          |

A Neon branch is usually ready in under a second with your production data, and its compute scales to zero when it's idle ([source](/docs/introduction/branching)). With 40 preview branches open at the same time, Neon Scale bills only the 15 beyond the included 25, which is $22.50 a month plus compute while they run ([source](/docs/introduction/plans#extra-branches)). On Supabase Team, the same 40 branches cost about $392 a month on Micro compute, and each one starts from your migrations and seed files, without your production data or files.

### 6. History retention (#recovery)

|                       | Neon Scale                                                | Supabase Team                                                                           |
| :-------------------- | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| Point-in-time restore | Up to 30 days, billed at $0.20/GB-month of change history | $100/month per 7 days, so $400/month for 28 days, and it needs at least a Small compute |
| During a restore      | Takes a few seconds, and a backup branch lets you undo it | **Downtime** until the restore finishes                                                 |

On Neon Scale, you can restore your production branch to any point in the last 30 days, and you pay only for the change history you keep ([source](/docs/postgres/backup-restore/history-window)). Before you restore, Time Travel Assist lets you query the database as it was at any point in that window to find the right moment. The restore also keeps your previous state in a backup branch, so you can undo it ([source](/docs/postgres/backup-restore/branch-restore)). On Supabase Team, a project is also unavailable until a restore finishes, so every restore means **downtime** for your app.

### 7. Scheduled backups

|                               | Neon Scale                                                                               | Supabase Team      |
| :---------------------------- | :--------------------------------------------------------------------------------------- | :----------------- |
| Frequency                     | Daily, weekly, or monthly, and you can combine them in one schedule                      | Daily              |
| Retention                     | Up to 35 days for scheduled snapshots, while manual snapshots stay until you delete them | 14 days            |
| Price                         | $0.09/GB-month, and each scheduled snapshot after the first bills only its changes       | Included           |
| With point-in-time restore on | Backup schedules keep running                                                            | Daily backups stop |

Neon backup schedules take snapshots of your production branch on the days and at the times you choose, and keep each one for up to 35 days ([source](/docs/guides/backup-restore#create-backup-schedules)). Manual snapshots don't expire unless you set an expiration, so you can keep a copy from before a major release or for an audit. On Supabase Team, daily backups are kept for 14 days, and **when you turn on point-in-time recovery, Supabase stops taking daily backups**.

### 8. Compliance and uptime SLA (#compliance-access-controls-and-support)

|                               | Neon Scale                                                                  | Supabase Team                                                                                      |
| :---------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| Certifications and frameworks | SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, ISO 27701, GDPR, and CCPA        | SOC 2 Type 2, ISO 27001, and GDPR                                                                  |
| HIPAA                         | Self-serve: accept the BAA in the Console, then turn it on for each project | Paid add-on, and each HIPAA project also needs point-in-time recovery and at least a Small compute |
| Uptime SLA                    | Included                                                                    | Enterprise plan only                                                                               |

Neon Scale covers two certifications that Supabase doesn't list: SOC 3, a public summary of the SOC 2 report that you can share with prospects, and ISO 27701, which extends ISO 27001 to privacy and helps with GDPR reviews ([source](/docs/security/compliance)). You can request the reports from the Neon Trust Center. For HIPAA, you accept the Business Associate Agreement in the Console and turn on HIPAA for each project that stores health data ([source](/docs/security/hipaa)). On Supabase Team, HIPAA is a paid add-on, and each HIPAA project also needs point-in-time recovery and at least a Small compute, which adds at least $105 a month per project on top of the add-on.

### 9. IP rules

|                   | Neon Scale (IP Allow)                     | Supabase Team (network restrictions) |
| :---------------- | :---------------------------------------- | :----------------------------------- |
| What it restricts | Postgres connections to the project       | Postgres and pooler connections      |
| Allowed formats   | Single addresses, ranges, and CIDR blocks | IPv4 and IPv6 CIDR blocks            |

With IP Allow, only the addresses you list can connect to your databases ([source](/docs/introduction/ip-allow)). You can also apply the list to protected branches only, like production, so preview and development branches stay reachable from CI and developer machines. Scale supports up to 5 protected branches per project, and they can't be deleted or reset ([source](/docs/guides/protected-branches)).

### 10. Private networking and private network transfer

|                | Neon Scale                  | Supabase Team                       |
| :------------- | :-------------------------- | :---------------------------------- |
| Connection     | AWS PrivateLink             | AWS PrivateLink through VPC Lattice |
| Transfer price | $0.01/GB in both directions | No published rate                   |

With Neon Private Networking, your app connects to Postgres through AWS PrivateLink, so traffic stays on AWS's network. You can turn off public internet access to the project, or allow only specific VPC endpoints ([source](/docs/guides/neon-private-networking)). Traffic over the private connection costs $0.01/GB in both directions and doesn't count toward the project's 500 GB public egress allowance ([source](/docs/introduction/plans#private-network-transfer)). For example, 2 TB a month between your AWS app and Neon costs $20. Supabase Team includes PrivateLink for database connections, but Supabase doesn't publish what it charges for that traffic, so you can't estimate that cost in advance.

### 11. Metrics and logs export

|               | Neon Scale                                          | Supabase Team                                                |
| :------------ | :-------------------------------------------------- | :----------------------------------------------------------- |
| Metrics       | Sent to Datadog or any OpenTelemetry platform       | A Prometheus endpoint (beta) that your own collector scrapes |
| Postgres logs | Sent to the same destination (Beta)                 | Log drains, $60/month per drain, plus $0.20/M events         |
| Export fee    | None, though logs count toward the project's egress | The drain fee, plus egress for every log sent                |

On Neon Scale, you add your Datadog API key or OpenTelemetry endpoint once, and Neon sends metrics and Postgres logs from every compute in the project, including CPU, memory, connections, and pooler stats ([Datadog](/docs/guides/datadog), [OpenTelemetry](/docs/guides/opentelemetry)). There's no export fee. On Supabase Team, a log drain is a project add-on that costs $60 a month plus $0.20 per million events, so sending logs from 5 production projects to Datadog costs at least $300 a month. Supabase metrics come from a beta endpoint that you scrape with your own collector, like the Datadog Agent or Prometheus.

### 12. Functions

|                  | Neon Scale                                                                  | Supabase Team          |
| :--------------- | :-------------------------------------------------------------------------- | :--------------------- |
| Invocations      | $0.60/M                                                                     | 2M included, then $2/M |
| Request duration | Up to 15 minutes to the first byte, then streams stay open while data flows | Up to 400 seconds      |
| Memory           | 2,048 MiB                                                                   | 256 MB                 |

A Neon Function can run for 15 minutes with 8 times the memory of a Supabase Edge Function, so it can run AI agents that chain several model calls, and WebSocket or SSE servers that hold connections open ([runtime limits](/docs/compute/functions/reference/runtime-limits)). Neon's invocation rate is less than a third of Supabase's, and Neon also bills the compute time each request uses, at $0.12 per active and $0.03 per waiting Capacity-Hour on Scale ([source](/docs/introduction/plans#functions)). Supabase Team includes 2M invocations before its rate applies.

<Admonition type="note">
Neon Functions, Object Storage, and AI Gateway run in four AWS regions today: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore). Create your project in one of them to use all three.
</Admonition>

### 13. Object storage

|                                                                  | Neon Scale                                                 | Supabase Team                                                            |
| :--------------------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| Price                                                            | $0.023/GB-month, no request charges                        | 100 GB per organization included, then $0.0213/GB-month                  |
| Maximum file size                                                | 5 GiB per object                                           | Up to 500 GB per file, for large files like raw video and backups        |
| Choose which sites can upload from the browser (`PutBucketCors`) | Supported, the preflight returns only your allowed origins | Not supported, every origin gets `Access-Control-Allow-Origin: *`        |
| Tag objects (`PutObjectTagging`, `GetObjectTagging`)             | Supported, tags are stored and returned                    | `PutObjectTagging` returns `200`, but `GetObjectTagging` returns no tags |
| Read size and ETag in one call (`GetObjectAttributes`)           | Supported                                                  | Not supported                                                            |
| Branches with the database                                       | Yes, every bucket and object, copy-on-write                | No, branches start with empty storage                                    |

Neon supports more of the S3 API, so you can limit browser uploads to your own site, tag files without a database write, and read a file's size and ETag in one call ([S3 compatibility](/docs/storage/s3-compatibility)). A Neon preview branch also gets your production files along with your production rows. Neon bills storage from the first GB, and downloads come out of each project's 500 GB egress allowance instead of one shared organization quota ([source](/docs/introduction/plans#object-storage)). Supabase Team includes 100 GB of storage for the whole organization and doesn't branch storage, but it accepts files up to 500 GB, which suits apps that store raw video or large backups.

### 14. Managed authentication

|                                      | Neon Scale (Managed Better Auth)                                                       | Supabase Team (Supabase Auth)                      |
| :----------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------- |
| Monthly active users                 | Up to 1M included, and more on request                                                 | 100K included, then $0.00325/MAU                   |
| Branches start with production users | Yes, copy-on-write, with their own sessions and auth settings                          | No, branches start from your seed data             |
| Organizations, members, invitations  | Built in with the [Organization plugin](/docs/auth/guides/plugins/organization) (Beta) | Not built in, so you model them in your own tables |

Neon Scale includes 10 times as many monthly active users. At 300K users, Supabase Team adds $650 a month, and at 1M users it adds $2,925 a month, while both stay inside Neon's 1M allowance ([source](/docs/introduction/plans#auth)). For B2B apps, the Organization plugin adds organizations, roles, and invitation flows.

### 15. AI Gateway

|               | Neon Scale                                                               | Supabase Team                                               |
| :------------ | :----------------------------------------------------------------------- | :---------------------------------------------------------- |
| Hosted models | Models from OpenAI, Google, and other providers with one Neon credential | No AI gateway, so you sign up with each provider separately |
| Price         | Each provider's list price, with no markup, paid from prepaid credits    | Each provider's own pricing and bill                        |

Neon AI Gateway lets your app call models from several providers with your Neon credential and your existing OpenAI SDK, so you don't need a separate account, API key, and bill for each provider ([source](/docs/ai-gateway/overview)). Because each branch has its own gateway endpoint, a preview branch can test a new model or prompt without changing production. Inference costs the provider's list price, paid from prepaid credits that you buy in the Neon Console ([source](/docs/ai-gateway/prepaid-credits)).

### 16. Egress

|                   | Neon Scale                                             | Supabase Team                                       |
| :---------------- | :----------------------------------------------------- | :-------------------------------------------------- |
| Monthly allowance | 500 GB per project                                     | 250 GB uncached and 250 GB cached, per organization |
| After that        | $0.10/GB                                               | $0.09/GB uncached, $0.03/GB cached                  |
| Shared by         | Postgres, Object Storage, and Functions in the project | Every service in every project in the organization  |
| Adding a project  | Adds another 500 GB                                    | Shares the same allowance                           |

On Neon, every project gets its own 500 GB, so a second app or a dedicated customer project doesn't use up the first project's allowance ([source](/docs/introduction/plans#public-network-transfer)). On Supabase, one allowance covers the whole organization, so it shrinks with every project you add.

## How good is each plan for production? (#modeling-a-month)

Here's what a few common use cases look like on each platform, and what you'd pay for them.

### An HR platform that needs a SOC 2 report

Take an HR and payroll platform used by 2K companies that ask for a SOC 2 report and a 14-day restore window. The platform stores pay stubs, tax forms, and onboarding documents for 100K employees, sends metrics and Postgres logs to Datadog, and gets most of its traffic during business hours on weekdays:

| Platform | Plan                                                          | Monthly total    |
| :------- | :------------------------------------------------------------ | :--------------- |
| Neon     | Scale                                                         | **About $223**   |
| Supabase | Team with an XL compute and 14 days of point-in-time recovery | **About $1,103** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 2K companies with about 50 employees each, 200 GB of Postgres data (tables and indexes) from about 1 MB of payroll and HR records per employee per year over 2 years, and 1 TB of documents, about 10 MB per employee. Compute averages 2 CU during 10 business hours on 22 weekdays and 0.25 CU for the rest of the month with scale to zero turned off, with peaks of about 4 CU (16 GB RAM). About 20 GB of changes are kept for the 14-day restore window, and Datadog receives 5M log events a month.
- **Neon:** (2 CU × 10 hours × 22 days) + (0.25 CU × 510 hours) = 567.5 CU-hours × $0.222 = $125.99, plus 200 GB × $0.35 = $70 of database storage, 20 GB × $0.20 = $4 of change history, and 1,000 GB × $0.023 = $23 of Object Storage, for about $223. The Datadog export has no fee, and the SOC 2 report comes with Scale.
- **Supabase:** the $599 monthly minimum, plus an XL instance (16 GB RAM, 4 vCPUs), the smallest that handles the 4 CU peaks, at about $210 minus the $10 compute credit = $200. Add (200 − 8) × $0.125 = $24 for disk beyond the included 8 GB, (1,000 − 100) × $0.0213 = $19.17 for storage beyond the included 100 GB, $200 for 14 days of point-in-time recovery, and a $60 log drain plus 5 × $0.20 = $1 for 5M log events. Total: about $1,103.

</details>

### A SaaS with a separate database for each customer

Take a B2B app with 300 business customers, where each customer's data and files live in their own project to keep them isolated. Each customer has about 20 users who attach files like contracts and images, and they use the app about 6 hours a day on weekdays:

| Platform | Plan                                  | Monthly total    |
| :------- | :------------------------------------ | :--------------- |
| Neon     | Scale                                 | **About $2,442** |
| Supabase | Team with a Micro compute per project | **About $3,562** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 300 projects, each with 2 GB of Postgres data (tables and indexes), 5 GB of files from about 10 MB of uploads per user per month over 2 years, and an average of 0.25 CU (1 GB RAM) while it's in use.
- **Neon:** 300 projects × 0.25 CU × 6 hours × 22 days = 9,900 CU-hours × $0.222 = $2,197.80, plus 300 × 2 GB × $0.35 = $210 of database storage and 300 × 5 GB × $0.023 = $34.50 of Object Storage, for about $2,442. Each project scales to zero outside working hours, and 300 projects fit inside the 1,000 included with Scale.
- **Supabase:** 300 Micro instances at $0.01344 × 730 hours = $9.81 each, or $2,943.36, minus the $10 compute credit = $2,933.36, plus the $599 monthly minimum and (1,500 − 100) × $0.0213 = $29.82 for storage beyond the 100 GB included for the organization. Total: about $3,562. Each customer's data fits inside the 8 GB of disk included per project.

</details>

### An online marketplace (with a reporting replica)

Take an online marketplace with 500K listings, including sold ones, and traffic throughout the day, plus a read replica that runs reports every night:

| Platform | Plan                                       | Monthly total    |
| :------- | :----------------------------------------- | :--------------- |
| Neon     | Scale                                      | **About $456**   |
| Supabase | Team with a 2XL compute and a read replica | **About $1,452** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 50 GB of Postgres data (tables and indexes) for listings, users, orders, and messages, and 1.5 TB of listing photos, from 6 photos per listing at about 500 KB each with their resized versions. Compute averages 2 CU around the clock with peaks of about 6 CU (24 GB RAM), and the replica runs at 4 CU for 3 hours a night. Photos are served through a CDN on both platforms, so egress stays within the included allowances.
- **Neon:** the primary uses 2 CU × 730 hours = 1,460 CU-hours × $0.222 = $324.12, the replica uses 4 CU × 3 hours × 30 days = 360 CU-hours × $0.222 = $79.92, and both share 50 GB × $0.35 = $17.50 of database storage. Add 1,500 GB × $0.023 = $34.50 of Object Storage, for about $456.
- **Supabase:** the $599 monthly minimum, plus a 2XL primary (32 GB RAM, 8 vCPUs), the smallest that handles the 6 CU peaks, at about $410 minus the $10 compute credit = $400. The replica runs on the same 2XL size for another $410, since compute credits don't apply to replicas. Disk adds (50 − 8) × $0.125 = $5.25 for the primary and 62.5 GB × $0.125 = $7.81 for the replica, whose disk is 1.25 times the size of the primary's. Storage adds (1,500 − 100) × $0.0213 = $29.82 beyond the included 100 GB. Total: about $1,452.

</details>

## When to choose Neon Scale vs Supabase Team

Choose **Neon Scale** if:

- Your customers ask for SOC 2, ISO 27001, or HIPAA, and you don't want to pay a $599 monthly minimum to get them.
- You need an uptime SLA without an enterprise contract.
- Your traffic changes through the day, week, or year, and you want to pay for your average usage instead of your peak.
- You give each customer, app, or environment its own project.
- You run read replicas for reports or analytics that don't need to run all day.
- You need point-in-time restore for up to 30 days, or weekly and monthly backups.
- You want metrics and Postgres logs in Datadog or another OpenTelemetry platform without a fee per drain.
- Your app calls models from several AI providers, and you want one credential and one bill.

Choose **Supabase Team** if:

- Your team already builds on Supabase and its client libraries.
- Your database is large but rarely queried, so storage is most of your bill.
- You need more than 224 GB of RAM on a single database instance.
- You need to store files larger than 5 GiB, like raw video or database backups.
- Your functions handle up to 2M short requests a month, like webhooks, which fit inside Team's included invocations.

### Recommendations by use case

- **For SaaS with a database per customer:** Neon, since each project costs only its usage, and idle customers cost only their storage.
- **For large databases with heavy traffic around the clock:** Supabase, since a fixed instance with 32 GB of RAM or more costs less than the same compute on Neon Scale.
- **For B2B SaaS that goes through security reviews:** Neon, since SOC 2, ISO 27001, IP Allow, and an uptime SLA come with Scale, with no monthly minimum.
- **For AI products:** Neon, since AI Gateway gives your app models from several providers with one credential, at provider list prices.
- **For archives and other storage-heavy databases:** Supabase, since disk costs $0.125/GB-month after the included 8 GB.
- **For healthcare apps:** Neon, since you turn on HIPAA in the Console, and point-in-time restore comes with the plan instead of an add-on.
- **For apps on AWS that connect privately:** Neon, since PrivateLink traffic has a published price of $0.01/GB.
- **For apps that store large media or backups:** Supabase, since Team accepts files up to 500 GB.
- **For apps with reporting and analytics:** Neon, since a read replica bills only while it runs and shares the primary's storage.

## Neon Scale vs Supabase Team plan at a glance

<details>
<summary>Per-feature comparison</summary>

| Feature                  | Neon Scale                                                                       | Supabase Team                                                                   |
| :----------------------- | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| Monthly price            | No minimum, pay for usage                                                        | From $599, including $10 of compute credits                                     |
| Projects                 | 1,000, with no per-project fee                                                   | First project included, then from about $10 a month each                        |
| Database compute         | $0.222/CU-hour, autoscales up to 16 CU (64 GB RAM), fixed sizes up to 56 CU      | Fixed instance per project, from Micro (1 GB RAM, about $10 a month), always on |
| Database storage         | $0.35/GB-month on the data you store                                             | 8 GB of disk per project, then $0.125/GB-month on provisioned disk              |
| Read replicas            | Compute only, sized and scaled separately from the primary                       | Same compute size as the primary, plus a disk 1.25 times its size               |
| Branches                 | 25 per project, then $1.50/branch-month, plus compute while a branch runs        | Each branch billed hourly, from $0.01344/hour on Micro compute                  |
| History retention        | Restore to any point in up to 30 days ($0.20/GB-month)                           | Point-in-time recovery for $100/month per 7 days                                |
| Scheduled backups        | Daily, weekly, or monthly, kept up to 35 days ($0.09/GB-month)                   | Daily, kept 14 days                                                             |
| Compliance               | SOC 2, SOC 3, ISO 27001, ISO 27701, GDPR, CCPA, and HIPAA                        | SOC 2, ISO 27001, GDPR, and HIPAA as a paid add-on                              |
| Uptime SLA               | Included                                                                         | Enterprise plan only                                                            |
| IP rules                 | IP Allow with addresses, ranges, and CIDR blocks                                 | Network restrictions with CIDR blocks                                           |
| Private networking       | AWS PrivateLink                                                                  | AWS PrivateLink through VPC Lattice                                             |
| Private network transfer | $0.01/GB                                                                         | No published rate                                                               |
| Metrics and logs export  | Sent to Datadog or any OpenTelemetry platform, with no export fee                | Metrics endpoint to scrape (beta), log drains at $60/month each                 |
| Functions                | $0.60/M invocations, 15 minutes to the first byte, 2,048 MiB of memory           | 2M invocations, then $2/M, 400-second limit, 256 MB of memory                   |
| Object storage           | $0.023/GB-month, no request charges, files up to 5 GiB                           | 100 GB per organization, then $0.0213/GB-month, files up to 500 GB              |
| Managed authentication   | Up to 1M MAU                                                                     | 100K MAU, then $0.00325/MAU                                                     |
| AI Gateway               | Models from multiple providers with one Neon credential, at provider list prices | Not offered                                                                     |
| Data API                 | PostgREST-compatible REST API                                                    | REST plus GraphQL                                                               |
| Egress                   | 500 GB per project, then $0.10/GB                                                | 250 GB uncached and 250 GB cached per organization, then $0.09/GB and $0.03/GB  |

Sources: [Neon plans](/docs/introduction/plans), [Neon read replicas](/docs/introduction/read-replicas), [Neon compliance](/docs/security/compliance), [Neon Functions limits](/docs/compute/functions/reference/runtime-limits), [Neon AI Gateway](/docs/ai-gateway/overview), [Neon Data API](/docs/data-api/overview), [Neon Object Storage](/docs/storage/overview).

</details>

## Frequently asked questions

<Faq>

<FaqItem question="Does the Neon Scale plan have a monthly minimum?">

No. Neon Scale has no base fee, and you pay only for the compute, storage, and services you use. Supabase Team has a $599 monthly minimum, and compute and usage beyond the included quotas cost extra.

</FaqItem>

<FaqItem question="Which plan includes an uptime SLA?">

Neon Scale includes an uptime SLA. On Supabase, the uptime SLA is available only on the Enterprise plan, and Team includes a response SLA for support tickets.

</FaqItem>

<FaqItem question="Which compliance certifications does each plan cover?">

Neon Scale covers SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, ISO 27701, GDPR, and CCPA, with self-serve HIPAA. Supabase Team covers SOC 2 Type 2, ISO 27001, and GDPR, with HIPAA as a paid add-on.

</FaqItem>

<FaqItem question="How far back can I restore my database?">

On Neon Scale, you can restore your production branch to any point in the last 30 days, and you pay $0.20/GB-month for the change history you keep. On Supabase Team, daily backups are kept for 14 days, and point-in-time recovery costs $100 a month per 7 days, up to $400 a month for 28 days.

</FaqItem>

<FaqItem question="Can I schedule weekly or monthly backups?">

On Neon Scale, yes. Backup schedules can take daily, weekly, or monthly snapshots and keep them for up to 35 days, at $0.09/GB-month. Supabase Team takes daily backups and keeps them for 14 days.

</FaqItem>

<FaqItem question="How are read replicas billed?">

On Neon Scale, a read replica bills only for its compute while it runs, because it reads from the primary's storage. On Supabase Team, a replica runs on the same compute size as the primary all month, with its own disk 1.25 times the size of the primary's.

</FaqItem>

<FaqItem question="How much does private networking cost?">

On Neon Scale, traffic over AWS PrivateLink costs $0.01/GB in both directions. Supabase Team includes PrivateLink for database connections but doesn't publish a rate for that traffic.

</FaqItem>

<FaqItem question="Can I send metrics and logs to Datadog?">

Yes, on both. Neon Scale sends metrics and Postgres logs to Datadog or any OpenTelemetry platform with no export fee. On Supabase Team, each log drain costs $60 a month plus $0.20 per million events, and metrics come from an endpoint that you scrape with your own collector.

</FaqItem>

</Faq>

## Continue the comparison

<DetailIconCards>
<a href="/guides/neon-vs-supabase" title="Backend comparison" description="Compare the two backends service by service" icon="database">Neon vs Supabase overview</a>
<a href="/guides/neon-vs-supabase-free-plan" title="Prototyping and vibe coding" description="Compare Neon Free and Supabase Free" icon="code">Stage 1: Prototyping</a>
<a href="/guides/neon-launch-plan-vs-supabase-pro-plan" title="MVP and startup" description="Compare the Neon Launch and Supabase Pro plans" icon="wallet">Stage 2: MVP and startup</a>
</DetailIconCards>

<NeedHelp/>
