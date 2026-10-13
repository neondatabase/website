---
title: 'In-Depth: Neon vs Supabase Free Plan'
subtitle: Compare Neon and Supabase free plans on projects, storage, branches, backups, functions, auth, and egress to see which fits your prototypes and AI agents.
author: neon-team
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-07-15T00:00:00.000Z'
updatedOn: '2026-10-13T17:36:31.362Z'
---

<Admonition type="note">
Plan limits in this guide were checked against the Neon and Supabase documentation and pricing pages on October 13, 2026. Confirm the current limits on the [Neon pricing](/pricing) page and on Supabase's pricing page before you decide.
</Admonition>

Neon and Supabase both give you a Postgres backend for $0 a month, with a database, managed authentication, serverless functions, and S3-compatible file storage. The free plans differ in how many projects you get, what happens when a project sits idle, and whether you can branch your backend or undo a mistake.

This guide compares the two free plans feature by feature, so you can see what each one includes. For a service-by-service comparison beyond the free plans, read [Neon vs Supabase](/guides/neon-vs-supabase).

## How is Neon unique?

### 1. 100 projects that scale to zero instead of pausing

Supabase Free allows only 2 active projects, and the limit applies to you across every organization where you're an Owner or Administrator. When a project is inactive for a week, Supabase pauses it, and it stays offline until you resume it from the dashboard.

Neon Free includes 100 projects ([source](/docs/introduction/plans#projects)). When a project is idle, its compute scales to zero after 5 minutes and wakes within a few hundred milliseconds on the next query ([source](/docs/introduction/scale-to-zero)). A demo you built months ago still loads when someone opens it.

### 2. Every project gets its own free allowances

On Neon Free, each project gets its own 100 CU-hours of compute, 1 GB of Postgres storage, 5 GB of Object Storage, 5 GB of egress, and a Functions allowance of 1M invocations and 10 active and 400 waiting Capacity-Hours every month ([source](/docs/introduction/plans)). A new project brings a new allowance instead of splitting the existing one. Postgres storage has one extra limit: 20 GB in total across all your projects.

Supabase applies most Free quotas, including egress, file storage, and Edge Function invocations, to the whole organization, no matter how many projects it has.

### 3. Branches and a 6-hour undo, even on Free (#ai-assisted-development)

Neon Free includes 10 branches per project. A branch is a copy-on-write copy of your whole backend: the database, [Managed Better Auth](/docs/auth/overview) users and sessions, [Object Storage](/docs/storage/overview) buckets and objects, and [Functions](/docs/compute/functions/overview). An AI agent or a preview deployment can work against real data without touching production ([branching](/docs/introduction/branching)). If a migration or a `DROP TABLE` goes wrong, you can restore a branch to any point in the last 6 hours ([instant restore](/docs/postgres/backup-restore/branch-restore)).

Supabase Free doesn't include branching, backups, or point-in-time recovery. Instead, Supabase recommends that Free projects export their data regularly with the Supabase CLI.

### 4. Functions that run for 15 minutes in its free plan

Neon Functions can take up to 15 minutes to send the first byte, and streams stay open while data flows. Each function gets 2,048 MiB of memory, and each project gets 1M invocations a month ([source](/docs/compute/functions/reference/runtime-limits)). On Supabase Free, Edge Functions stop after 150 seconds, get 256 MB of memory, and share 500K invocations across the whole organization. That leaves room for AI agents that chain several model calls, and for WebSocket or SSE servers that hold a connection open.

## Neon vs Supabase Free plan at a glance

| Feature                | Neon Free                                                                     | Supabase Free                                                         |
| :--------------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| Monthly price          | $0                                                                            | $0                                                                    |
| Functions              | 1M invocations per project, 15 minutes to the first byte, 2,048 MiB of memory | 500K invocations per organization, 150-second limit, 256 MB of memory |
| Managed authentication | 60K MAU                                                                       | 50K MAU                                                               |
| Data API               | PostgREST-compatible REST API                                                 | REST plus GraphQL                                                     |
| Object storage         | 5 GB per project, files up to 5 GiB                                           | 1 GB per organization, files up to 50 MB                              |
| Egress                 | 5 GB per project                                                              | 5 GB uncached and 5 GB cached, per organization                       |
| Database storage       | 1 GB per project, 20 GB in total                                              | 500 MB per project                                                    |
| Projects               | 100                                                                           | 2 active                                                              |
| Database compute       | Autoscales up to 2 CU (8 GB RAM), scales to zero after 5 minutes              | Shared CPU with up to 500 MB RAM, paused after 1 week of inactivity   |
| Log retention          | 3 days for Functions and Object Storage logs                                  | 1 day for API and database logs                                       |
| Team members           | Unlimited, with Admin, Editor, Viewer, and Collaborator roles                 | Unlimited, with Owner, Admin, and Developer roles                     |
| History retention      | Restore to any point in the last 6 hours, 1 manual snapshot                   | No backups or point-in-time recovery                                  |
| Branches               | 10 per project                                                                | Not included                                                          |

Sources: [Neon plans](/docs/introduction/plans), [Neon Functions limits](/docs/compute/functions/reference/runtime-limits), [Neon Data API](/docs/data-api/overview), [Neon Object Storage limits](/docs/storage/overview#limits), [Neon logs](/docs/introduction/monitor-logs), [Neon user permissions](/docs/manage/user-permissions).

## Comparing the free plans feature by feature

### 1. Projects per organization

|                       | Neon Free        | Supabase Free                                                              |
| :-------------------- | :--------------- | :------------------------------------------------------------------------- |
| Projects              | 100              | 2 active, plus any number of paused projects                               |
| How the limit applies | Per organization | Per user, across every organization where you're an Owner or Administrator |

A project is a full backend with its own database, branches, auth, functions, and storage. With 100 projects, you can give every app, customer, or agent experiment its own project. On Supabase Free, a third project means pausing one of the first two, and creating another organization doesn't help, because the limit follows you across organizations.

### 2. Database storage

|                     | Neon Free | Supabase Free                              |
| :------------------ | :-------- | :----------------------------------------- |
| Per project         | 1 GB      | 500 MB                                     |
| Across all projects | 20 GB     | 1 GB (500 MB in each of 2 active projects) |

Neon Free gives each project twice the database storage, and up to 20 times as much across all your projects ([source](/docs/introduction/plans#storage)).

### 3. Database compute and idle behavior (#idle-behavior)

|                      | Neon Free                                             | Supabase Free                                |
| :------------------- | :---------------------------------------------------- | :------------------------------------------- |
| Compute size         | Autoscales up to 2 CU (8 GB RAM)                      | Shared CPU with up to 500 MB RAM, fixed size |
| Monthly compute      | 100 CU-hours per project                              | Always on until the project is paused        |
| Pooled connections   | Up to 10K                                             | 200                                          |
| When the app is idle | Scales to zero after 5 minutes                        | Paused after 1 week of inactivity            |
| When traffic returns | Wakes automatically within a few hundred milliseconds | You resume the project from the dashboard    |

When load arrives, a Neon Free compute scales up to 8 GB of RAM, while a Supabase Free project stays on its fixed instance until you upgrade. A suspended Neon compute doesn't use CU-hours, and 100 CU-hours run a 0.25 CU compute for 400 hours a month ([source](/docs/introduction/plans#compute)). Neon's connection pooler accepts up to 10K client connections, which helps serverless apps that open a connection per request ([source](/docs/connect/connection-pooling)).

The bigger difference shows up on a low-traffic application: a Neon project never pauses, while a Supabase Free project with low activity over 7 days is paused until you manually resume it from the dashboard.

### 4. Branches

|                        | Neon Free                                                    | Supabase Free |
| :--------------------- | :----------------------------------------------------------- | :------------ |
| Branches               | 10 per project                                               | Not included  |
| What a branch includes | Database, auth, Object Storage, and Functions, copy-on-write | Not included  |

A Neon branch shares its parent's data through copy-on-write, and it's ready for a preview deployment, a test run, or an agent experiment right away ([source](/docs/introduction/branching)). On Supabase, branching starts on paid plans at $0.01344 per branch per hour.

### 5. Log retention

|               | Neon Free                                    | Supabase Free                   |
| :------------ | :------------------------------------------- | :------------------------------ |
| Log retention | 3 days for Functions and Object Storage logs | 1 day for API and database logs |

Neon keeps logs three times as long, so you can pull a wider window with `neon logs query --since 48h` and filter it by severity or service name ([source](/docs/cli/logs)). The same filters and search are available in the Neon Console.

### 6. History retention

|                       | Neon Free                                                    | Supabase Free                            |
| :-------------------- | :----------------------------------------------------------- | :--------------------------------------- |
| Point-in-time restore | Any point in the last 6 hours (up to 1 GB of change history) | Not included                             |
| Snapshots and backups | 1 manual snapshot                                            | Not included, so you export with the CLI |

On Neon Free, you can rewind a branch to the moment before a bad migration, or keep a snapshot of a known good state ([source](/docs/introduction/plans#instant-restore)). If you delete a whole project by mistake, you can recover it within 7 days ([source](/docs/manage/projects#recover-a-deleted-project)). On Supabase, backups start on the Pro plan, and point-in-time recovery is a paid add-on.

### 7. Functions

Both free plans include serverless functions: [Neon Functions](/docs/compute/functions/overview) on Neon and Edge Functions on Supabase.

|                            | Neon Free                                                                         | Supabase Free                    |
| :------------------------- | :-------------------------------------------------------------------------------- | :------------------------------- |
| Monthly invocations        | 1M per project                                                                    | 500K per organization            |
| Request duration           | Up to 15 minutes to the first byte, then streams stay open while data flows       | Up to 150 seconds                |
| Memory                     | 2,048 MiB                                                                         | 256 MB                           |
| Runtime                    | Node.js 24                                                                        | Deno                             |
| Scheduled runs             | [Function Triggers](/docs/compute/functions/triggers/overview) on a cron schedule | `pg_cron` and `pg_net`           |
| Branches with the database | Yes, each branch runs its own deployment against its own data                     | Branching isn't included on Free |

Neon Free includes twice as many invocations in every project, 8 times the memory, and requests that can run for 15 minutes instead of 150 seconds. Each project also gets its own 10 active and 400 waiting Capacity-Hours of function compute, so a second app doesn't share the first app's allowance ([source](/docs/introduction/plans#functions)). Long requests matter for AI agents that chain several model calls, and for WebSocket or SSE servers that hold a connection open ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

<Admonition type="note">
Neon Functions and Object Storage run in four AWS regions today: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore). Create your project in one of them to use both.
</Admonition>

### 8. Object storage

Both free plans include S3-compatible file storage: [Neon Object Storage](/docs/storage/overview) on Neon and Supabase Storage on Supabase.

|                                                                  | Neon Free                                                  | Supabase Free                                                            |
| :--------------------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| Included storage                                                 | 5 GB per project                                           | 1 GB per organization                                                    |
| Maximum file size                                                | 5 GiB                                                      | 50 MB                                                                    |
| S3-compatible API                                                | Yes                                                        | Yes                                                                      |
| Choose which sites can upload from the browser (`PutBucketCors`) | Supported, the preflight returns only your allowed origins | Not supported, every origin gets `Access-Control-Allow-Origin: *`        |
| Tag objects (`PutObjectTagging`, `GetObjectTagging`)             | Supported, tags are stored and returned                    | `PutObjectTagging` returns `200`, but `GetObjectTagging` returns no tags |
| Read size and ETag in one call (`GetObjectAttributes`)           | Supported                                                  | Not supported                                                            |
| Branches with the database                                       | Yes, every bucket and object, copy-on-write                | Branching isn't included on Free                                         |

Neon Free includes 5 times the storage, and each new project adds another 5 GB. Files can be up to 5 GiB, so videos, datasets, and model outputs fit in one upload, while Supabase Free caps each file at 50 MB. Neon also supports more of the S3 API. You can limit browser uploads and downloads to your own site with a CORS rule, tag a file (for example `status=pending-review`) without a database write, and read a file's size and ETag in one call ([S3 compatibility](/docs/storage/s3-compatibility)). And Neon branches your files with the database, so a preview branch's rows and files come from the same point in time.

### 9. Managed authentication

Both free plans include managed authentication: [Managed Better Auth](/docs/auth/overview) on Neon and Supabase Auth on Supabase.

|                                     | Neon Free (Managed Better Auth)                                                        | Supabase Free (Supabase Auth)                      |
| :---------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------- |
| Monthly active users                | 60K                                                                                    | 50K                                                |
| Branches with the database          | Yes, each branch gets its own users, sessions, and auth settings                       | Branching isn't included on Free                   |
| Organizations, members, invitations | Built in with the [Organization plugin](/docs/auth/guides/plugins/organization) (Beta) | Not built in, so you model them in your own tables |

Neon Free covers 10K more monthly active users. Because auth branches with the database, you can test sign-up, password reset, and OAuth flows on a preview branch without creating test users in production. For multi-tenant apps, the Organization plugin adds organizations, roles, and invitation flows without extra tables. Neon also includes shared Google OAuth credentials for testing, so Google sign-in works before you register your own OAuth app ([source](/docs/auth/overview)).

### 10. Egress

Egress is the data your project sends out over the internet, like query results, file downloads, and function responses.

|                   | Neon Free                                              | Supabase Free                                      |
| :---------------- | :----------------------------------------------------- | :------------------------------------------------- |
| Monthly allowance | 5 GB per project                                       | 5 GB uncached and 5 GB cached, per organization    |
| Shared by         | Postgres, Object Storage, and Functions in the project | Every service in every project in the organization |
| Adding a project  | Adds another 5 GB                                      | Shares the same allowance                          |

On Neon, every project gets its own 5 GB, so a second or third app doesn't eat into the first app's allowance ([source](/docs/introduction/plans#public-network-transfer)). On Supabase, the allowance is split into uncached egress and cached egress (served from the CDN cache), and all of it is shared across the organization.

### 11. Team members

|                                  | Neon Free                                      | Supabase Free               |
| :------------------------------- | :--------------------------------------------- | :-------------------------- |
| Members                          | Unlimited                                      | Unlimited                   |
| Roles                            | Admin, Editor, Viewer, and Collaborator        | Owner, Admin, and Developer |
| Read-only access                 | Viewer role                                    | Team plan ($599/month)      |
| Access to selected projects only | Collaborator role with per-project permissions | Team plan ($599/month)      |

Both free plans allow unlimited members. Neon Free also lets you give a teammate read-only access, or give a contractor access to a single project and nothing else ([source](/docs/manage/user-permissions)). On Supabase, read-only and project-scoped access start on the Team plan.

## How good is each free plan, practically?

Here's what a few common use cases look like on each platform, and what you'd pay for them.

### A developer with three small live apps

Take a developer who runs three small apps at the same time: a habit tracker with about 200 users, a waitlist page for their next idea that gets a handful of visits a week, and the backend for a community Discord bot:

| Platform | Plan                             | Monthly total |
| :------- | :------------------------------- | :------------ |
| Neon     | Free                             | **$0**        |
| Supabase | Not supported on Free, needs Pro | **About $45** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon:** the Free plan includes 100 projects, so each app gets its own project with its own 100 CU-hours, 1 GB of Postgres storage, and 5 GB of egress. The quiet waitlist page scales to zero between visits and wakes on the next one, so all three apps cost $0.
- **Supabase:** not supported on the Free plan, which allows 2 active projects, so the third app needs the Pro plan. Pro costs $25 a month and covers the first project, and the other two run on Micro compute at about $10 a month each: $25 + (2 × $10) = about $45. Staying on Free would also mean the waitlist page pauses after a quiet week until someone resumes it.

</details>

### A video feedback app with 200 MB screen recordings

Take a prototype where users upload 10-minute 1080p screen recordings of up to 200 MB each, with 4 GB stored (about 20 recordings) and 3 GB watched a month (roughly 3 hours of viewing):

| Platform | Plan                             | Monthly total |
| :------- | :------------------------------- | :------------ |
| Neon     | Free                             | **$0**        |
| Supabase | Not supported on Free, needs Pro | **$25**       |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon:** the Free plan accepts files up to 5 GiB, so each 200 MB recording uploads as a single file. It includes 5 GB of Object Storage and 5 GB of egress per project, so 4 GB stored and 3 GB watched cost $0, as long as the rest of the project's egress stays under 2 GB.
- **Supabase:** not supported on the Free plan, which caps each file at 50 MB and file storage at 1 GB. The Pro plan at $25 a month raises the per-file limit to up to 500 GB and includes 100 GB of file storage and 250 GB of egress.

</details>

### An AI agent that branches and needs an undo

Take an AI coding agent that works on its own branch for 10 hours a month, on a project where you want to restore the database to the minute before a bad change:

| Platform | Plan                                                                      | Monthly total  |
| :------- | :------------------------------------------------------------------------ | :------------- |
| Neon     | Free                                                                      | **$0**         |
| Supabase | Not supported on Free, needs Pro with a Small compute and the PITR add-on | **About $130** |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon:** the agent's branches run at 0.25 CU for 10 hours, which is 2.5 CU-hours, leaving 97.5 of the project's 100 CU-hours for the main branch. The agent can keep up to 9 branches next to the main branch, within the Free plan's 10 per project. Restoring to any point in the last 6 hours is included.
- **Supabase:** not supported on the Free plan, which doesn't include branching or point-in-time recovery. The Pro plan costs $25. Point-in-time recovery requires at least a Small compute (about $15 a month, minus the $10 compute credit = $5) and costs about $100 a month for 7 days of history. 10 branch-hours on the default Micro compute cost 10 × $0.01344 = $0.13. Total: $25 + $5 + $100 + $0.13 = about $130.

</details>

## When to choose Neon vs Supabase

Choose **Neon Free** if:

- You build several prototypes or side projects, and want each one online without visiting it every week.
- You use an AI coding agent, and want a branch of the whole backend for each experiment and a 6-hour restore window when something breaks.
- Your app stores user uploads, or files larger than 50 MB, and you want to limit browser uploads to your own site with CORS rules.
- Your functions run AI agents, stream responses, or hold WebSocket connections for longer than 150 seconds.
- You want to give a teammate read-only access, or a contractor access to one project only.

Choose **Supabase Free** if:

- You run one or two projects and use them at least once a week, so pausing never applies.
- Your team already builds on Supabase and its client libraries.
- Most of your traffic is served from the CDN cache, where the separate 5 GB of cached egress helps.

### Recommendations by use case

- **For vibe coding and prototypes:** Neon, for 100 projects that scale to zero and never need a manual resume.
- **For a portfolio of side projects:** Neon, because every project gets its own compute, storage, egress, and Functions allowance.
- **For AI agents:** Neon, for copy-on-write branches of the whole backend and a 6-hour restore window.
- **For apps with file uploads:** Neon, for 5 GB of Object Storage per project and files up to 5 GiB.
- **For one app you already run on Supabase and use every week:** Supabase, since the Free plan covers one or two active projects.

## Frequently asked questions

<Faq>

<FaqItem question="Does Neon pause free projects like Supabase does?">

No. Neon scales an idle compute to zero after 5 minutes and wakes it automatically on the next query, within a few hundred milliseconds. Supabase pauses a Free project after a week of inactivity, and you resume it from the dashboard.

</FaqItem>

<FaqItem question="How many free projects can I create on Neon and Supabase?">

Neon Free includes 100 projects. Supabase Free allows 2 active projects per user, across every organization where you're an Owner or Administrator. Paused Supabase projects don't count toward the limit.

</FaqItem>

<FaqItem question="Which free plan includes more database storage?">

Neon. Each Neon Free project includes 1 GB of Postgres storage, up to 20 GB across all your projects. Each Supabase Free project includes 500 MB, and the project switches to read-only mode when it's exceeded.

</FaqItem>

<FaqItem question="Do the free plans include backups?">

Neon Free lets you restore a branch to any point in the last 6 hours and keep 1 manual snapshot. Supabase Free doesn't include backups or point-in-time recovery, and Supabase recommends exporting Free projects regularly with the Supabase CLI.

</FaqItem>

<FaqItem question="Can I use branching on a free plan?">

On Neon, yes. Neon Free includes 10 branches per project, and each branch includes the database, auth, Object Storage, and Functions. Supabase doesn't include branching on the Free plan. On paid plans, each Supabase branch is billed per hour.

</FaqItem>

<FaqItem question="Is free egress per project or per organization?">

On Neon, egress is per project: each project gets 5 GB a month, shared by Postgres, Object Storage, and Functions in that project. On Supabase, egress is per organization: 5 GB uncached and 5 GB cached, shared by every project in the organization.

</FaqItem>

<FaqItem question="Which free plan is better for AI agents?">

Neon. An agent can create a copy-on-write branch of the whole backend for each experiment, restore a branch to any point in the last 6 hours, and spread its work across up to 100 projects. Neon Functions can also run for up to 15 minutes before responding, which leaves room for agents that chain several model calls.

</FaqItem>

<FaqItem question="Can I use Neon Functions and Object Storage on the Free plan?">

Yes. Both are available on every plan, including Free. They run in four AWS regions today: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), so create your project in one of them.

</FaqItem>

</Faq>

## Continue the comparison

<DetailIconCards>
<a href="/guides/neon-vs-supabase" title="Backend comparison" description="Compare the two backends service by service" icon="database">Neon vs Supabase overview</a>
<a href="/guides/neon-launch-plan-vs-supabase-pro-plan" title="MVP and startup" description="Compare the Neon Launch and Supabase Pro plans for an app with real users" icon="wallet">Stage 2: MVP and startup</a>
<a href="/guides/neon-scale-plan-vs-supabase-team-plan" title="Scaling a business" description="Compare capacity, compliance, recovery, and read scaling" icon="scale-up">Stage 3: Scaling</a>
</DetailIconCards>

<NeedHelp/>
