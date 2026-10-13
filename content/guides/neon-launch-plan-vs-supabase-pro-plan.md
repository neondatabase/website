---
title: 'In-Depth: Neon Launch vs Supabase Pro Plan'
subtitle: Compare Neon Launch and Supabase Pro on pricing, compute, projects, branches, backups, auth, functions, storage, and egress for your MVP or startup.
author: rishi-raj-jain
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-07-15T00:00:00.000Z'
updatedOn: '2026-10-13T19:35:11.209Z'
---

<Admonition type="note">
Plan limits and prices in this guide were checked against the Neon and Supabase documentation and pricing pages on October 13, 2026. Confirm the current rates on the [Neon pricing](/pricing) page and on Supabase's pricing page before you decide.
</Admonition>

Neon's Launch plan and Supabase's Pro plan are the entry-level paid plans for an MVP or early-stage startup. The biggest difference is how they bill: Launch has no monthly minimum and charges only for what your app uses, while Pro is a $25 monthly subscription plus an always-on instance for every project you run.

This guide compares the two paid plans feature by feature. For a service-by-service comparison beyond the plans, read [Neon vs Supabase](/guides/neon-vs-supabase).

## How is Neon unique?

### 1. No monthly minimum, and no fee per project

Neon Launch has no base fee. You pay for the compute, storage, and services your app uses, and the plan includes 100 projects with no per-project charge ([source](/docs/introduction/plans#price)). An idle project doesn't use compute, so a staging environment or side app costs only its storage between uses.

Supabase Pro costs $25 a month, which includes $10 of compute credits for one project. Every additional project runs on its own always-on instance, starting at about $10 a month for Micro compute.

### 2. Compute that autoscales and scales to zero

A Neon compute autoscales within a range you set, up to 16 CU (64 GB RAM), so you pay for the compute you use instead of a fixed size ([source](/docs/introduction/autoscaling)). On Launch, it scales to zero after 5 minutes of inactivity, and you can turn that off for an always-on database ([source](/docs/introduction/scale-to-zero)).

A Supabase Pro project runs on a fixed instance that's billed every hour of the month, and handling more load means resizing it manually, usually with less than 2 minutes of downtime (<a href="https://supabase.com/docs/guides/platform/compute-and-disk" target="_blank" rel="nofollow noopener noreferrer">source</a>).

### 3. 1M monthly active users included

Neon Launch includes [Managed Better Auth](/docs/auth/overview) for up to 1M monthly active users ([source](/docs/introduction/plans#auth)). Supabase Pro includes 100K, then charges $0.00325 for every additional monthly active user, so 1M monthly active users cost an extra $2,925 a month.

### 4. Branches and point-in-time restore without add-ons

Neon Launch includes 10 branches per project. Each branch is a copy-on-write copy of the whole backend, including the database, auth, Object Storage, and Functions, so it's usually ready in under a second because no data is copied ([source](/docs/get-started/dev-experience#agents-first)). You can also restore your production branch to any point in a history window of up to 7 days ([instant restore](/docs/postgres/backup-restore/branch-restore)).

On Supabase Pro, each branch is a separate instance billed by the hour, and it starts without your production data. Copying that data into a branch takes longer as your database grows, and it needs the point-in-time recovery add-on, which costs $100 a month and also needs at least a Small compute.

## Neon Launch vs Supabase Pro plan at a glance

| Feature                | Neon Launch                                                                 | Supabase Pro                                                                    |
| :--------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| Monthly price          | No minimum, pay for usage                                                   | $25, including $10 of compute credits                                           |
| Projects               | 100, with no per-project fee                                                | First project included, then from about $10 a month each                        |
| Database compute       | $0.106/CU-hour, autoscales up to 16 CU (64 GB RAM), optional scale to zero  | Fixed instance per project, from Micro (1 GB RAM, about $10 a month), always on |
| Database storage       | $0.35/GB-month on the data you store                                        | 8 GB of disk per project, then $0.125/GB-month on provisioned disk              |
| Branches               | 10 per project, then $1.50/branch-month, plus compute while a branch runs   | Each branch billed hourly, from $0.01344/hour on Micro compute                  |
| History retention      | Restore to any point in up to 7 days ($0.20/GB-month), 100 manual snapshots | Daily backups kept 7 days, point-in-time recovery from $100/month               |
| Functions              | $0.60/M invocations, 15 minutes to the first byte, 2,048 MiB of memory      | 2M invocations, then $2/M, 400-second limit, 256 MB of memory                   |
| Object storage         | $0.023/GB-month, no request charges, files up to 5 GiB                      | 100 GB per organization, then $0.0213/GB-month, files up to 500 GB              |
| Managed authentication | Up to 1M MAU                                                                | 100K MAU, then $0.00325/MAU                                                     |
| Data API               | PostgREST-compatible REST API                                               | REST plus GraphQL                                                               |
| Egress                 | 500 GB per project, then $0.10/GB                                           | 250 GB uncached and 250 GB cached per organization, then $0.09/GB and $0.03/GB  |
| Team members           | Unlimited, with Admin, Editor, Viewer, and Collaborator roles               | Unlimited, with Owner, Admin, and Developer roles                               |

Sources: [Neon plans](/docs/introduction/plans), [Neon Functions limits](/docs/compute/functions/reference/runtime-limits), [Neon Data API](/docs/data-api/overview), [Neon Object Storage](/docs/storage/overview), [Neon user permissions](/docs/manage/user-permissions).

## Comparing the paid plans feature by feature

### 1. Projects per organization (#projects-per-organization)

|                         | Neon Launch                     | Supabase Pro                                        |
| :---------------------- | :------------------------------ | :-------------------------------------------------- |
| Included projects       | 100, with no per-project fee    | 1, covered by the $10 compute credit                |
| Cost of a project       | No fee, only the usage it bills | About $10 a month or more for its always-on compute |
| Cost of an idle project | Storage only                    | The full compute price, every hour                  |

A project is a full backend with its own database, branches, auth, functions, and storage. On Neon, giving each app, environment, or customer its own project costs nothing extra, and idle projects bill only their storage ([source](/docs/introduction/plans#projects)). On Supabase, the $25 subscription is per organization, but compute is per project, so every staging environment, second app, or tenant database adds its own instance. For example, 10 small customer databases, each with 1 GB of Postgres data and active about an hour a day at 0.25 CU, cost about $11.50 a month on Neon Launch and about $115 on Supabase Pro, where each one runs on an always-on Micro instance.

### 2. Database storage

|               | Neon Launch                         | Supabase Pro                                          |
| :------------ | :---------------------------------- | :---------------------------------------------------- |
| Price         | $0.35/GB-month                      | 8 GB per project included, then $0.125/GB-month       |
| What's billed | The data you store, measured hourly | The disk you provision, which can grow but not shrink |

Neon bills only the data you actually store, measured hourly, and a child branch costs only the data it changes, so ten preview branches of a 5 GB database don't cost ten times as much ([source](/docs/introduction/plans#storage)). Supabase bills the disk you provision, which can grow but not shrink, so after a one-time import or a cleanup, you keep paying for the larger disk. A Supabase branch with your production data also gets its own larger disk, which adds to the cost of each of those branches.

### 3. Database compute and idle behavior

|                      | Neon Launch                                               | Supabase Pro                                                |
| :------------------- | :-------------------------------------------------------- | :---------------------------------------------------------- |
| Billing              | $0.106/CU-hour, only while the compute runs               | A fixed instance, billed every hour of the month            |
| Scaling              | Autoscales up to 16 CU (64 GB RAM) with no restart        | Manual resize, usually with less than 2 minutes of downtime |
| When the app is idle | Scales to zero after 5 minutes, or stays on if you prefer | Keeps running and billing                                   |
| Pooled connections   | Up to 10K                                                 | 200 on Micro, 1K on XL                                      |

A Neon compute scales up when traffic increases and down when it drops, so you pay for your average usage instead of your peak ([source](/docs/introduction/autoscaling)). A Supabase instance runs at one size, so you either pay for your peak all month or resize it manually. Neon's connection pooler also accepts up to 10K client connections on any compute size, while a Supabase Micro instance accepts 200 pooled clients ([source](/docs/connect/connection-pooling)).

### 4. Branches (#preview-environments)

|                           | Neon Launch                                                         | Supabase Pro                                          |
| :------------------------ | :------------------------------------------------------------------ | :---------------------------------------------------- |
| Included                  | 10 per project                                                      | None                                                  |
| Price                     | $1.50/branch-month after 10, plus compute only while a branch runs  | $0.01344/hour per branch on Micro (about $10 a month) |
| What a branch starts with | Production data, auth, Object Storage, and Functions, copy-on-write | Your migrations and seed data                         |

A Neon branch is usually ready in under a second with your production data, and its compute scales to zero when it's idle ([source](/docs/introduction/branching)). A Supabase branch is a separate instance that bills by the hour while it exists, and it starts from your migrations and seed files, without your production data or files.

### 5. History retention

|                       | Neon Launch                                                   | Supabase Pro                                                   |
| :-------------------- | :------------------------------------------------------------ | :------------------------------------------------------------- |
| Point-in-time restore | Up to 7 days, billed at $0.20/GB-month of change history      | $100/month add-on for 7 days, which also needs a Small compute |
| Backups and snapshots | 100 manual snapshots, plus scheduled backups ($0.09/GB-month) | Daily backups kept 7 days                                      |

On Neon Launch, you can restore your production branch to any point before a bad migration, and you pay only for the change history you keep. The history window starts at 1 day, and you can raise it to 7 days ([source](/docs/postgres/backup-restore/history-window)). Deleted projects can also be recovered within 7 days ([source](/docs/manage/projects#recover-a-deleted-project)). On Supabase Pro, daily backups are included, but restoring to a specific point in time costs at least $105 a month more: $100 for the add-on, plus $5 to move from Micro to Small compute.

### 6. Functions

|                  | Neon Launch                                                                 | Supabase Pro           |
| :--------------- | :-------------------------------------------------------------------------- | :--------------------- |
| Invocations      | $0.60/M                                                                     | 2M included, then $2/M |
| Request duration | Up to 15 minutes to the first byte, then streams stay open while data flows | Up to 400 seconds      |
| Memory           | 2,048 MiB                                                                   | 256 MB                 |

A Neon Function can run for 15 minutes with 8 times the memory of a Supabase Edge Function, so it can run AI agents that chain several model calls, and WebSocket or SSE servers that hold connections open ([runtime limits](/docs/compute/functions/reference/runtime-limits)). Neon's invocation rate is less than a third of Supabase's, and Neon also bills the compute time each request uses. Supabase Pro includes 2M invocations before its rate applies.

<Admonition type="note">
Neon Functions and Object Storage run in four AWS regions today: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore). Create your project in one of them to use both.
</Admonition>

### 7. Object storage

|                                                                  | Neon Launch                                                | Supabase Pro                                                             |
| :--------------------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| Price                                                            | $0.023/GB-month, no request charges                        | 100 GB per organization included, then $0.0213/GB-month                  |
| Maximum file size                                                | 5 GiB per object                                           | Up to 500 GB per file, for large files like raw video and backups        |
| Choose which sites can upload from the browser (`PutBucketCors`) | Supported, the preflight returns only your allowed origins | Not supported, every origin gets `Access-Control-Allow-Origin: *`        |
| Tag objects (`PutObjectTagging`, `GetObjectTagging`)             | Supported, tags are stored and returned                    | `PutObjectTagging` returns `200`, but `GetObjectTagging` returns no tags |
| Read size and ETag in one call (`GetObjectAttributes`)           | Supported                                                  | Not supported                                                            |
| Branches with the database                                       | Yes, every bucket and object, copy-on-write                | No, branches start with empty storage                                    |

Neon supports more of the S3 API, so you can limit browser uploads to your own site, tag files without a database write, and read a file's size and ETag in one call ([S3 compatibility](/docs/storage/s3-compatibility)). A Neon preview branch also gets your production files along with your production rows. Neon bills storage from the first GB, and downloads come out of each project's 500 GB egress allowance instead of one shared organization quota ([source](/docs/introduction/plans#object-storage)). Supabase Pro includes 100 GB of storage for the whole organization and doesn't branch storage, but it accepts files up to 500 GB, which suits apps that store raw video or large backups.

### 8. Managed authentication

|                                      | Neon Launch (Managed Better Auth)                                                      | Supabase Pro (Supabase Auth)                       |
| :----------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------- |
| Monthly active users                 | Up to 1M included                                                                      | 100K included, then $0.00325/MAU                   |
| Branches start with production users | Yes, copy-on-write, with their own sessions and auth settings                          | No, branches start from your seed data             |
| Organizations, members, invitations  | Built in with the [Organization plugin](/docs/auth/guides/plugins/organization) (Beta) | Not built in, so you model them in your own tables |

Neon Launch includes 10 times as many monthly active users. At 300K users, like the photo app below, Supabase Pro adds $650 a month, and at 1M users it adds $2,925 a month, while both stay inside Neon's 1M allowance ([source](/docs/introduction/plans#auth)). For multi-tenant apps, the Organization plugin adds organizations, roles, and invitation flows.

### 9. Egress

|                   | Neon Launch                                            | Supabase Pro                                        |
| :---------------- | :----------------------------------------------------- | :-------------------------------------------------- |
| Monthly allowance | 500 GB per project                                     | 250 GB uncached and 250 GB cached, per organization |
| After that        | $0.10/GB                                               | $0.09/GB uncached, $0.03/GB cached                  |
| Shared by         | Postgres, Object Storage, and Functions in the project | Every service in every project in the organization  |
| Adding a project  | Adds another 500 GB                                    | Shares the same allowance                           |

On Neon, every project gets its own 500 GB, so a second app or a dedicated customer project doesn't use up the first project's allowance ([source](/docs/introduction/plans#public-network-transfer)). On Supabase, one allowance covers the whole organization, so it shrinks with every project you add.

### 10. Team members

|                                  | Neon Launch                                    | Supabase Pro                |
| :------------------------------- | :--------------------------------------------- | :-------------------------- |
| Members                          | Unlimited                                      | Unlimited                   |
| Roles                            | Admin, Editor, Viewer, and Collaborator        | Owner, Admin, and Developer |
| Read-only access                 | Viewer role                                    | Team plan ($599/month)      |
| Access to selected projects only | Collaborator role with per-project permissions | Team plan ($599/month)      |

Neon Launch lets you give a teammate read-only access, or give a contractor access to a single project ([source](/docs/manage/user-permissions)). On Supabase, read-only and project-scoped access start on the Team plan. Both plans allow unlimited members.

## How good is each plan for production? (#cost-scenarios)

Here's what a few common use cases look like on each platform, and what you'd pay for them.

### An appointment booking app for 500 salons

Take a booking app used by 500 salons, where 20K clients book appointments each month. Salons upload 2 GB of photos and logos, and bookings happen between 8 a.m. and 8 p.m., with almost no traffic overnight:

| Platform | Plan                      | Monthly total |
| :------- | :------------------------ | :------------ |
| Neon     | Launch                    | **About $20** |
| Supabase | Pro with a Medium compute | **About $75** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 2 GB of Postgres data (tables and indexes), an average of 0.5 CU during the 12 busy hours, and peaks of about 1 CU (4 GB RAM).
- **Neon:** 0.5 CU × 12 hours × 30 days = 180 CU-hours × $0.106 = $19.08, plus 2 GB × $0.35 = $0.70 of database storage and 2 GB × $0.023 = $0.05 of Object Storage, for about $20. The compute scales to zero overnight, and 20K users fit inside the 1M MAU included with Managed Better Auth.
- **Supabase:** a Medium instance (4 GB RAM) is the smallest that handles the 1 CU peaks, and it runs all night. It costs about $60 a month, minus the $10 compute credit = $50, plus the $25 subscription, for about $75. The data, files, and users fit inside the included disk, storage, and MAU.

</details>

### A consumer photo app with 300K monthly active users

Take a photo-sharing app with 300K monthly active users, 200 GB of stored photos, and 400 GB of photo views a month, with traffic throughout the day:

| Platform | Plan                   | Monthly total  |
| :------- | :--------------------- | :------------- |
| Neon     | Launch                 | **About $124** |
| Supabase | Pro with an XL compute | **About $882** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 10 GB of Postgres data (tables and indexes), an average of about 1.5 CU, peaks of about 4 CU (16 GB RAM), and photo views served from Supabase's CDN cache.
- **Neon:** 1.5 CU × 730 hours = 1,095 CU-hours × $0.106 = $116.07, plus 10 GB × $0.35 = $3.50 of database storage and 200 GB × $0.023 = $4.60 of Object Storage, for about $124. The 400 GB of photo views fits inside the project's 500 GB egress allowance, as long as the rest of its egress stays under 100 GB, and 300K users fit inside the 1M MAU.
- **Supabase:** an XL instance (16 GB RAM, 4 vCPUs) is the smallest that handles the 4 CU peaks: about $210 a month, minus the $10 compute credit = $200, plus the $25 subscription = $225. Disk beyond the included 8 GB adds (10 − 8) × $0.125 = $0.25. Storage beyond the included 100 GB adds (200 − 100) × $0.0213 = $2.13. Cached egress beyond the included 250 GB adds (400 − 250) × $0.03 = $4.50. Auth beyond the included 100K users adds (300K − 100K) × $0.00325 = $650. Total: about $882.

</details>

### A seasonal app, like a tax-filing assistant

Take a tax-filing assistant with 50K users from February to April, and about 2K users for the rest of the year:

| Platform | Plan                                               | Yearly total     |
| :------- | :------------------------------------------------- | :--------------- |
| Neon     | Launch                                             | **About $285**   |
| Supabase | Pro, resized to Large in season and Micro after it | **About $603**   |
| Supabase | Pro with a Large compute all year                  | **About $1,503** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Assumptions:** 10 GB of Postgres data (tables and indexes), about 2 CU (8 GB RAM) for 12 hours a day during the season, and about 0.25 CU for 2 hours a day for the rest of the year.
- **Neon:** in season, 2 CU × 12 hours × 30 days = 720 CU-hours × $0.106 = $76.32, plus 10 GB × $0.35 = $3.50, for about $80 a month. Off season, 0.25 CU × 2 hours × 30 days = 15 CU-hours × $0.106 = $1.59, plus $3.50, for about $5 a month. Over a year: (3 × $79.82) + (9 × $5.09) = about $285. Autoscaling and scale to zero handle the change in traffic without any resizing.
- **Supabase, resized twice a year:** a Large instance (8 GB RAM, 2 vCPUs) for the 3-month season at about $125.25 a month ($110, minus the $10 compute credit, plus the $25 subscription and $0.25 for disk beyond the included 8 GB), and Micro for the other 9 months at $25.25 a month, since the $10 compute credit covers Micro. That's about $603 a year, but it takes a manual resize before and after the season, each usually with less than 2 minutes of downtime.
- **Supabase, Large all year:** a Large instance (8 GB RAM, 2 vCPUs) handles the season's peaks. It costs about $110 a month, minus the $10 compute credit = $100, plus the $25 subscription = $125, plus (10 − 8) × $0.125 = $0.25 for disk beyond the included 8 GB. That's about $125.25 a month, or about $1,503 a year.

</details>

## When to choose Neon Launch vs Supabase Pro

Choose **Neon Launch** if:

- Your traffic is bursty, or your app is idle overnight or off season, and you want to pay only for what you use.
- You run several backends, like staging, a second app, or a project per customer.
- Your app could pass 100K monthly active users.
- You want a preview branch with production data for every pull request, and point-in-time restore without an add-on.
- Your functions run AI agents, stream responses, or hold WebSocket connections longer than 400 seconds.
- You want to give a teammate read-only access, or a contractor access to one project only.

Choose **Supabase Pro** if:

- You run one app with steady traffic that fits a single fixed instance all month.
- Your team already builds on Supabase and its client libraries.
- You prefer a flat monthly subscription with bundled quotas, like 100 GB of file storage.
- Your database is large but rarely queried, so storage is most of your bill.
- You need to store files larger than 5 GiB, like raw video or database backups.
- Your functions handle up to 2M short requests a month, like webhooks, which fit inside Pro's included invocations.

### Recommendations by use case

- **For business-hours and seasonal apps:** Neon, since compute scales down when traffic drops and costs nothing while idle, with no monthly minimum.
- **For multi-tenant SaaS:** Neon, since a project per customer costs only its usage and comes with its own egress allowance.
- **For consumer apps:** Neon, since auth covers up to 1M monthly active users without per-user charges.
- **For teams that use preview environments:** Neon, since each pull request can get a copy-on-write branch with production data that's usually ready in under a second.
- **For archives and other storage-heavy databases:** Supabase, since disk costs $0.125/GB-month after the included 8 GB.
- **For apps that store large media or backups:** Supabase, since Pro accepts files up to 500 GB.
- **For integrations that receive webhooks:** Supabase, since Pro includes 2M function invocations a month before charging for them.

## Frequently asked questions

<Faq>

<FaqItem question="Does the Neon Launch plan have a monthly minimum?">

No. Neon Launch has no base fee, and you pay only for the compute, storage, and services you use. Supabase Pro starts at $25 a month.

</FaqItem>

<FaqItem question="How much does an extra project cost on Neon Launch and Supabase Pro?">

On Neon Launch, there's no per-project fee, and an idle project costs only its storage. On Supabase Pro, every project after the first runs on its own always-on instance, starting at about $10 a month.

</FaqItem>

<FaqItem question="How many monthly active users are included?">

Neon Launch includes up to 1M monthly active users with Managed Better Auth. Supabase Pro includes 100K, then charges $0.00325 per additional monthly active user.

</FaqItem>

<FaqItem question="Is point-in-time recovery included?">

On Neon Launch, yes. You can restore your production branch to any point in a history window of up to 7 days, and you pay $0.20/GB-month for the change history you keep. On Supabase Pro, point-in-time recovery is a $100 monthly add-on for 7 days, and it needs at least a Small compute.

</FaqItem>

<FaqItem question="How are preview branches billed?">

Neon Launch includes 10 branches per project, then $1.50 per branch-month, and a branch's compute bills only while it runs. On Supabase Pro, each branch is its own instance, billed from $0.01344 an hour on Micro compute.

</FaqItem>

<FaqItem question="Can I keep a Neon database always on?">

Yes. On the Launch plan, you can turn off scale to zero, so the compute never suspends. Autoscaling still adjusts its size with load.

</FaqItem>

<FaqItem question="Is egress per project or per organization?">

On Neon, egress is per project: each project includes 500 GB a month, then $0.10/GB. On Supabase, egress is per organization: 250 GB uncached and 250 GB cached, shared by every project.

</FaqItem>

<FaqItem question="Which plan is cheaper for a multi-tenant SaaS?">

Neon, in most cases. A project per customer costs only its usage on Neon, while each Supabase project adds an always-on instance. For 10 small customer databases, that's about $11.50 a month on Neon Launch and about $115 on Supabase Pro.

</FaqItem>

</Faq>

## Continue the comparison

<DetailIconCards>
<a href="/guides/neon-vs-supabase" title="Backend comparison" description="Compare the two backends service by service" icon="database">Neon vs Supabase overview</a>
<a href="/guides/neon-vs-supabase-free-plan" title="Prototyping and vibe coding" description="Compare Neon Free and Supabase Free" icon="code">Stage 1: Prototyping</a>
<a href="/guides/neon-scale-plan-vs-supabase-team-plan" title="Scaling a business" description="Compare capacity, compliance, recovery, and read scaling" icon="scale-up">Stage 3: Scaling</a>
</DetailIconCards>

<NeedHelp/>
