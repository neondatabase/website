---
title: 'Cheapest Postgres hosting for developers (2026)'
subtitle: 'Compare the cheapest Postgres hosting for developers, including Neon, Supabase, and Amazon RDS. See which free tiers last and which run out of credits.'
author: rishi-raj-jain
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-11-09T00:00:00.000Z'
---

A lot of Postgres hosts say they're free, but "free" can mean a lot of things. It can be as generous as 100 databases with no time limit ([yes, really](/pricing)), or as limited as a 30-day trial that needs a credit card.

This guide ranks these hosts by what they actually cost, from the free tier to the first bill.

<Admonition type="tip" title="Looking for team or platform scale?">
If you're building an AI app, giving each customer their own database, or creating a preview branch for every pull request, we have a separate guide on the [best Postgres hosting for SaaS and AI agents](/guides/best-postgres-hosting-saas-and-ai-agents-2026).
</Admonition>

## What should you look for in a free Postgres plan?

At a minimum, look for:

- **A free tier that doesn't expire:** A side project should still work a year from now, without credits running out.
- **No monthly minimum:** When you outgrow the free tier, the first bill should be a few dollars (not a base fee).
- **Idle databases that cost (almost) nothing:** Most side projects are idle most of the time, so you shouldn't pay for the hours nobody uses them.

The best free plans go further with:

- **Branching for iteration:** You should be able to try a schema change or a new feature on a copy of your data.
- **Auth:** Sign-up and login that store users in your database, so you don't need a separate auth service for a side project.
- **Object storage:** A place for uploads like images and files next to your database, without another account and bill.
- **Fast wake-ups:** A database that pauses to save money should wake up in under a second when someone visits.
- **Room for many projects:** Most developers have more than one project, so each project should get its own free allowance.
- **No extra fees:** No charges for a public IP address, a storage minimum, or I/O requests on top of the listed price.

Here's how the free tiers of the six hosts covered in this guide compare:

| Provider                            | Free offer                                                             | How long it lasts                                 | Databases                                      | Free egress                                                            | Credit card                                                 |
| :---------------------------------- | :--------------------------------------------------------------------- | :------------------------------------------------ | :--------------------------------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------- |
| **Neon**                            | Free plan, with 100 CU-hours per project each month                    | Permanent                                         | 100 projects                                   | 5 GB per project                                                       | Not required                                                |
| **Supabase**                        | Free plan                                                              | Permanent                                         | 2 active projects                              | 5 GB per organization, plus 5 GB for Storage files served from its CDN | Not required                                                |
| **Render Postgres**                 | 1 free database with 256 MB of RAM                                     | 30 days, then deleted after a 14-day grace period | 1 per workspace                                | 5 GB per workspace                                                     | Not required                                                |
| **Amazon Aurora PostgreSQL**        | $100 of AWS credits, plus up to $100 more, on the AWS Free plan        | 6 months, or until the credits run out            | 2 clusters, created with express configuration | 100 GB a month, shared across AWS services                             | Not required for most new accounts, but AWS may ask for one |
| **Google Cloud SQL for PostgreSQL** | A 30-day trial instance, plus $300 of Google Cloud credits for 90 days | 30 days for the trial instance                    | 1 trial instance per project                   | None ($0.19/GiB)                                                       | Required for the Google Cloud trial                         |
| **Amazon RDS for PostgreSQL**       | The same AWS credits, shared with every other AWS service you use      | 6 months, or until the credits run out            | Limited by the credits, from `db.t4g.micro`    | 100 GB a month, shared across AWS services                             | Not required for most new accounts, but AWS may ask for one |

## What's the cheapest Postgres hosting for developers?

<Admonition type="info" title="The short answer">

- **Neon** is the cheapest place to build: its Free plan costs $0 for up to 100 projects that never expire, and each one includes Postgres, Managed Better Auth, Object Storage, and Functions, so every app gets a backend for free. As an app grows, Neon's paid plans have no base fee and bill only the hours your database is awake.
- If you want the lowest flat price for only a database that stays on all day, **Render** ($6.30 a month) and **Google Cloud SQL** ($9.37 a month) are the cheapest options.
- On AWS, **Aurora** costs cents a month while it's paused, if your app can wait about 15 seconds for it to resume.

</Admonition>

### 1. Neon

[Neon](/docs/introduction) is a complete set of cloud backend primitives for apps and agents, built around Lakebase Postgres. Compute [scales to zero](/docs/introduction/scale-to-zero) after 5 minutes without queries, so an idle database doesn't use up your free compute, and the next query wakes it in a few hundred milliseconds. While it's awake, it [autoscales](/docs/introduction/autoscaling) with the load.

Each project is its own Postgres instance with its own free allowance. On the Free plan, you can test a migration on a [branch](/docs/introduction/branching) (a copy of your data, ready in about a second) and use [instant restore](/docs/postgres/backup-restore/branch-restore) to roll back if something goes wrong.

Free projects also include [Managed Better Auth](/docs/auth/overview), [Object Storage](/docs/storage/overview), and [Functions](/docs/compute/functions/overview), all managed from the Console, the CLI, or the [Neon MCP server](/docs/ai/neon-mcp-server). To try Postgres without an account, use [Claimable Neon](/docs/reference/claimable-neon).

**Why do developers choose Neon?**

Looking at <a href="https://www.producthunt.com/products/neon/reviews" target="_blank" rel="nofollow noopener noreferrer">Product Hunt reviews</a> and Reddit threads, developers choose Neon for:

- **Branching:** Reviewers branch the database the way they branch code, to test schema migrations on a copy of their data.
- **Easy setup:** A database is running in a few minutes, with little to manage afterward.
- **Standard Postgres:** It's the Postgres they already know, with serverless scaling on top.

**Strengths:**

- Idle databases scale to zero, so they don't use compute, and wake in a few hundred milliseconds
- A separate free allowance for each of up to 100 projects, so every side project gets its own database
- Managed Better Auth for up to 60K monthly active users, 5 GB of Object Storage, and Functions with 1M invocations a month, each per project on the Free plan
- No base fee on paid plans, so a project that outgrows Free costs only what it uses
- Branches and instant restore on the Free plan, to test a change or undo a bad migration

**Watch out for:**

- At 0.25 CU, 100 CU-hours cover about 13 hours awake a day (idle time doesn't count, since compute scales to zero), so an always-on app can't stay on Free. When a Free project uses up its monthly compute, it's suspended until the next month or until you upgrade to usage-based billing (your data is kept)
- Writes that would grow a Free project past its 1 GB storage limit fail until you free space or upgrade
- Instant restore covers only the last 6 hours on Free, with 1 manual snapshot and no scheduled backups
- Functions and Object Storage are available in [four AWS regions today](/docs/storage/overview#limits)

<Admonition type="tip" title="Best for">
Developers with several side projects who want each one on its own free Postgres database, with branches for testing changes and the same database when they move to a paid plan.
</Admonition>

### 2. Supabase

**Supabase** bundles Postgres with Auth, Storage, Edge Functions, and Realtime in each project, and generates REST and GraphQL APIs from your schema. Its dashboard includes a table editor and an SQL editor, and row-level security policies control what each user can read and write.

All of this is on the Free plan. Each project runs on its own always-on instance, and Supabase can pause a free project after 7 days of low activity until you resume it from the dashboard. Free Edge Functions stop after 150 seconds, and backups and branching need a paid plan.

**Why do developers choose Supabase?**

Looking at <a href="https://www.producthunt.com/products/supabase/reviews" target="_blank" rel="nofollow noopener noreferrer">Product Hunt</a> and <a href="https://www.peerspot.com/products/supabase-reviews" target="_blank" rel="nofollow noopener noreferrer">PeerSpot</a> reviews, developers choose Supabase to:

- **Build on the Free plan:** Reviewers run early apps on the Free plan, and some note that it includes vector support.
- **Stay on Postgres:** Reviewers like that it's Postgres underneath, so they aren't locked into a custom query language.
- **Secure data with row-level security:** Policies limit each user to their own data, though reviewers also call this the hardest part to learn.

**Strengths:**

- Auth for up to 50K monthly active users, 1 GB of file storage, Edge Functions, and Realtime on the Free plan
- A Pro bill that starts at $25 a month and includes one Micro instance and 8 GB of disk
- Auto-generated REST and GraphQL APIs, so you don't pay for a separate API server
- Open source, so you can self-host the stack on a VPS and pay only for the server

**Watch out for:**

- Free projects can be paused after a week of low activity, until you resume them manually
- No backups or point-in-time recovery on Free
- Every project runs on an always-on instance, so each new project adds to the bill once you're on a paid plan

<details>
<summary>Quick Neon vs Supabase free tier comparison</summary>

- Neon includes 100 free projects, Supabase includes 2 active ones
- Neon includes 1 GB of Postgres storage per project, Supabase includes 500 MB
- Neon includes Auth for 60K monthly active users per project, Supabase includes 50K
- Neon includes 5 GB of egress per project, Supabase includes 5 GB for the whole organization
- Both are permanent and don't need a credit card

</details>

<Admonition type="tip" title="Best for">
Developers with one or two apps used at least weekly who want Postgres, Auth for up to 50K monthly active users, and Storage in one project for free.
</Admonition>

### 3. Render Postgres

**Render Postgres** is the managed Postgres on Render, a platform that also hosts web services, static sites, background workers, and cron jobs. It runs on a fixed instance size, from 256 MB of RAM up to 128 CPUs and 1,024 GB of RAM, and paid instances include point-in-time recovery (3 days on the Hobby plan).

Each workspace gets one free database, with 256 MB of RAM and 1 GB of storage. It expires 30 days after you create it, and Render deletes it, along with its data, 14 days later unless you upgrade. A Render database doesn't pause when it's idle, so a paid instance bills every hour.

**Strengths:**

- The cheapest paid instance in this list, $6 a month for `0.1c-256mb`, plus $0.30/GB-month of storage
- No base fee on the Hobby workspace plan, so you pay only for compute and storage
- Web services, static sites, and cron jobs on the same platform, so your app and database share one bill

**Watch out for:**

- The free database expires after 30 days, and Render deletes it, with its data, 14 days later unless you upgrade
- Only one free database per workspace, with no backups
- No scale to zero, so a paid instance bills every hour, even when nobody's using it
- No database branching: preview environments (on the Pro workspace plan and up) create an empty database with the same setup for each pull request instead of a copy of your data
- No built-in auth or realtime, so sign-in and live updates need a separate service or your own code running on a web service

<details>
<summary>Quick Neon vs Render free tier comparison</summary>

- Neon's free tier is permanent, Render's free database expires after 30 days
- Neon includes 100 free projects, Render includes 1 free database per workspace
- Both include 1 GB of Postgres storage
- Neon includes branching, Auth, and Object Storage on the Free plan, Render doesn't offer branching or auth
- Neither needs a credit card

</details>

<Admonition type="tip" title="Best for">
Developers who already host their app on Render and want the cheapest always-on Postgres instance in this list, from about $6.30 a month.
</Admonition>

### 4. Amazon Aurora PostgreSQL (Serverless v2)

**Amazon Aurora** is AWS's own Postgres-compatible database. It stores six copies of your data across three Availability Zones and can add up to 15 read replicas. Serverless v2 resizes compute with the load in Aurora Capacity Units (ACUs, about 2 GiB of RAM each), and with a minimum of 0 ACUs, an instance pauses after 5 minutes without connections. Resuming takes about 15 seconds, and any open connection, including an idle pooled one, keeps it from pausing.

AWS Free plan credits cover up to 2 clusters created with **express configuration**, which connects through an internet access gateway, so you don't need to set up a VPC. Connections use short-lived IAM tokens instead of a password, so your app has to generate one before it connects.

**Why do companies choose Aurora?**

Looking at <a href="https://www.capterra.com/p/199608/Aurora/reviews/" target="_blank" rel="nofollow noopener noreferrer">Capterra</a> and <a href="https://www.peerspot.com/products/amazon-aurora-reviews" target="_blank" rel="nofollow noopener noreferrer">PeerSpot</a> reviews, companies choose Aurora to:

- **Scale with the load:** Reviewers like how easily it scales up and down, instead of running a fixed instance size.
- **Lower their bills:** Some report lower bills after moving from Oracle or self-managed databases, though cost is also the most common complaint.

**Strengths:**

- Auto-pause, so an idle database bills only storage, at $0.10/GB-month
- No monthly minimum for compute, so ten idle side projects cost about $1.40 a month
- Works with the rest of AWS, including IAM, CloudWatch, and Lambda

**Watch out for:**

- About 15 seconds to resume a paused instance (30 seconds or more after a day), which can be longer than your app's connection timeout
- Idle pooled connections and RDS Proxy keep an instance from pausing
- Express clusters need IAM tokens to connect, so a plain connection string with a password doesn't work

<details>
<summary>Quick Neon vs Aurora free tier comparison</summary>

- Neon's free tier is permanent, Aurora's lasts up to 6 months or until AWS credits run out
- Neon includes 100 free projects, Aurora's free plan allows 2 clusters
- Both include 1 GB of storage per database
- Neon wakes in a few hundred milliseconds, Aurora takes about 15 seconds

</details>

<Admonition type="tip" title="Best for">
Developers already on AWS whose database is idle most of the month, who want it to cost cents a month while it's paused.
</Admonition>

### 5. Google Cloud SQL for PostgreSQL

**Cloud SQL for PostgreSQL** is Google Cloud's managed Postgres. It runs standard Postgres on an instance you size yourself, from a shared-core `db-f1-micro` with 0.6 GiB of RAM up to 96 vCPUs and 624 GiB of RAM, and you can add high availability and cross-region read replicas.

New and existing Google Cloud customers can run a free 30-day trial instance in a new project, and new customers also get $300 of credits for 90 days. After that, Cloud SQL doesn't pause on its own: you can stop an instance, but it stays stopped until you start it again. The shared-core `db-f1-micro` and `db-g1-small` are meant for test and development, and they aren't covered by the SLA.

**Why do companies choose Cloud SQL?**

Looking at <a href="https://www.peerspot.com/products/google-cloud-sql-reviews" target="_blank" rel="nofollow noopener noreferrer">PeerSpot reviews</a>, companies choose Cloud SQL to:

- **Skip database management:** Reviewers say it's easy to set up, and Google handles the management so they can focus on their apps.
- **Scale when they need to:** Reviewers can resize instances and add replicas as their workload grows, though several call it expensive for heavier workloads.

**Strengths:**

- The cheapest always-on instance on AWS or Google Cloud, about $9.37 a month for a `db-f1-micro` with 10 GB of SSD
- No charge for a public IP address while the instance runs, so apps outside Google Cloud connect at no extra cost
- A free 30-day trial instance with 8 vCPUs and 64 GB of RAM, open to existing customers too
- High availability and cross-region read replicas when you need them

**Watch out for:**

- No scale to zero, and a stopped instance doesn't start again when a connection arrives
- A stopped instance still bills its storage and its idle IP address ($0.01 an hour), so stopping a `db-f1-micro` saves only about $0.37 a month
- Data sent to apps outside Google Cloud bills at $0.19/GiB

<details>
<summary>Quick Neon vs Cloud SQL free tier comparison</summary>

- Neon's free tier is permanent, Cloud SQL's trial instance lasts 30 days
- Neon includes 100 free projects, Cloud SQL includes 1 trial instance per project
- Neon doesn't need a credit card, Google Cloud does
- Cloud SQL's trial instance is much bigger: 8 vCPUs, 64 GB of RAM, and 100 GB of storage

</details>

<Admonition type="tip" title="Best for">
Developers on Google Cloud with a small database that's busy all day, who want the cheapest always-on instance on a major cloud, from about $9.37 a month.
</Admonition>

### 6. Amazon RDS for PostgreSQL

**Amazon RDS for PostgreSQL** runs standard community Postgres on a fixed instance size, from 1 GiB to 4,096 GiB of RAM. AWS handles backups, patching, and failover, and you can add Multi-AZ standbys, read replicas, up to 35 days of point-in-time recovery, and blue/green deployments.

On the AWS Free plan, an RDS instance draws from the same credits as every other AWS service you use. It can't scale to zero: you can stop it for up to 7 days, but RDS starts it again after that, so a side project's database runs most of the month whether anyone uses it or not.

**Why do companies choose RDS?**

Looking at <a href="https://www.capterra.com/p/192201/Amazon-RDS/reviews/" target="_blank" rel="nofollow noopener noreferrer">Capterra</a> and <a href="https://www.peerspot.com/products/amazon-rds-reviews" target="_blank" rel="nofollow noopener noreferrer">PeerSpot</a> reviews (most cover RDS in general, not only PostgreSQL), companies choose RDS to:

- **Stop managing database servers:** AWS takes care of provisioning, patching, and backups.
- **Scale as they grow:** Reviewers cite storage autoscaling and resizing instances without much work.
- **Stay close to the rest of AWS:** Reviewers like the reliability and the integration with other AWS services, and Postgres users like how quickly new major versions arrive.

**Strengths:**

- A flat bill of about $17.63 a month for a `db.t4g.micro`, including storage and a public IPv4 address
- Multi-AZ deployments, read replicas, and up to 35 days of point-in-time recovery when you need them

**Watch out for:**

- No scale to zero, and a stopped instance starts again on its own after 7 days
- A public IPv4 address adds $3.65 a month if your app connects from outside AWS
- `db.t4g` instances run in Unlimited mode by default, so sustained CPU use can add CPU credit charges

<details>
<summary>Quick Neon vs RDS free tier comparison</summary>

- Neon's free tier is permanent, RDS's lasts up to 6 months or until AWS credits run out
- Neon includes 100 free projects, RDS has no free database count, only credits
- Neon scales an idle database to zero, an RDS instance runs every hour until you stop it
- Neon has no storage minimum, RDS bills at least 20 GB

</details>

<Admonition type="tip" title="Best for">
Developers already on AWS with a database that's busy all day, who want a flat bill that starts at about $17.63 a month.
</Admonition>

## What does it actually cost?

Let's walk through three developer-sized workloads with estimated monthly costs after the free credits run out. In all three, the app runs outside the provider's network (for example, on Vercel or Netlify), so the database has to accept connections from the internet. Totals leave out egress, the data your database sends to your app. See each provider's allowance in the [free tier comparison](#what-should-you-look-for-in-a-free-postgres-plan).

### A Discord bot for a small community

Take a Discord bot with 0.1 GB of data, like user settings, scores, and reminders. Members use it on and off through the day, and since the database pauses only after 5 minutes without queries, it stays awake about 8 hours a day, or 240 hours a month:

| Provider                            | Plan                                 | While the bot is quiet                                             | Monthly total |
| :---------------------------------- | :----------------------------------- | :----------------------------------------------------------------- | :------------ |
| **Neon**                            | Free                                 | Scales to zero, wakes in a few hundred milliseconds                | **$0.00**     |
| **Supabase**                        | Free                                 | Stays online, since the bot is used every day                      | **$0.00**     |
| **Render Postgres**                 | `0.1c-256mb`                         | Runs all month                                                     | **$6.30**     |
| **Google Cloud SQL for PostgreSQL** | `db-f1-micro`, Enterprise edition    | Runs all month                                                     | **$9.37**     |
| **Amazon Aurora PostgreSQL**        | Serverless v2, express configuration | Pauses, and the first command after a pause waits about 15 seconds | **$14.61**    |
| **Amazon RDS for PostgreSQL**       | `db.t4g.micro`, On-Demand            | Runs all month                                                     | **$17.63**    |

<details>
<summary>Curious how each total is calculated?</summary>

| Provider                            | Compute                              | Storage and other charges                                | Total      |
| :---------------------------------- | :----------------------------------- | :------------------------------------------------------- | :--------- |
| **Neon** (Free)                     | 0.25 CU × 240 h = 60 of 100 CU-hours | 0.1 GB of the 1 GB allowance                             | **$0.00**  |
| **Supabase** (Free)                 | Included in the Free plan            | 0.1 GB of the 500 MB allowance                           | **$0.00**  |
| **Render Postgres**                 | $6 `0.1c-256mb` instance             | 1 GB × $0.30 = $0.30                                     | **$6.30**  |
| **Google Cloud SQL for PostgreSQL** | 730 h × $0.0105 = $7.67              | 10 GB of SSD × $0.17 = $1.70                             | **$9.37**  |
| **Amazon Aurora PostgreSQL**        | 0.5 ACU × 240 h × $0.12 = $14.40     | 0.1 GB × $0.10 = $0.01, plus 1M I/O × $0.20/M = $0.20    | **$14.61** |
| **Amazon RDS for PostgreSQL**       | 730 h × $0.016 = $11.68              | 20 GB × $0.115 = $2.30, plus 730 h × $0.005 IPv4 = $3.65 | **$17.63** |

**Notes:**

- At 0.25 CU, Neon's 100 CU-hours cover about 13 hours awake a day. A bot that polls the database every few minutes never lets it pause, which uses 182.5 CU-hours a month and goes past the Free allowance. On Neon Launch, that's $19.38 (182.5 CU-hours × $0.106, plus 0.1 GB × $0.35). Query the database when a Discord event arrives instead of polling.
- Discord expects a response to a slash command within 3 seconds, so on Aurora the bot has to defer its reply while the database resumes.
- On Neon, a bot that uses Discord's HTTP interactions endpoint can run as a [Function](/docs/compute/functions/overview) next to its database, within the Free plan's 1M invocations a month, so you don't pay for a separate bot host. Supabase Edge Functions can do the same, within 500K invocations.
- Aurora can resume above 0.5 ACU, so its compute is a lower bound. An express configuration cluster connects through the internet access gateway, which has no separately published fee. A full configuration cluster with a public IP address adds $3.65 a month.
- Render's free database covers the first 30 days, then expires, so the bot needs `0.1c-256mb` after that.
- Cloud SQL excludes internet egress, which bills at $0.19/GiB.

</details>

Neon and Supabase both keep a bot like this free, and Render's $6.30 instance is the cheapest way to keep it always on. Aurora's pauses save a few dollars compared with RDS, but at 8 hours awake a day, it already costs more than Cloud SQL's smallest always-on instance.

### Ten side projects

Most developers don't have just one project. Take ten of them (a portfolio, a few demos, some weekend experiments), each with 0.3 GB of data and about 15 visits a month. Each visit keeps the database awake for about 6 minutes (one minute of queries, then the 5-minute idle timeout), so each project is awake about 1.5 hours a month.

The cheapest way to run them on an always-on host is to put all ten in one instance, as separate databases. That cuts the bill, but one app's traffic spike or a bad migration affects all ten, and you can't restore, delete, or transfer one project without touching the rest:

| Provider                            | Plan                                 | One database per project | All ten in one shared instance |
| :---------------------------------- | :----------------------------------- | :----------------------- | :----------------------------- |
| **Neon**                            | Free                                 | **$0.00**                | Not needed                     |
| **Amazon Aurora PostgreSQL**        | Serverless v2, express configuration | **$1.40**                | **$1.40**                      |
| **Render Postgres**                 | `0.1c-256mb`                         | **$63.00**               | **$7.50**                      |
| **Google Cloud SQL for PostgreSQL** | `db-f1-micro`, Enterprise edition    | **$93.70**               | **$9.37**                      |
| **Supabase**                        | Pro                                  | **$115.00**              | **$25.00**                     |
| **Amazon RDS for PostgreSQL**       | `db.t4g.micro`, On-Demand            | **$176.30**              | **$17.63**                     |

<details>
<summary>Curious how each total is calculated?</summary>

| Provider                            | One database per project                                             | All ten in one shared instance                                                 |
| :---------------------------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **Neon** (Free)                     | 10 of 100 projects, 3 GB of the 20 GB total, about 0.4 CU-hours each | Not needed                                                                     |
| **Amazon Aurora PostgreSQL**        | 10 × ($0.09 compute + $0.03 storage + $0.02 I/O) = $1.40             | 15 h × 0.5 ACU × $0.12 = $0.90, plus $0.30 storage and $0.20 I/O               |
| **Render Postgres**                 | 10 × $6.30 = $63.00                                                  | $6 instance + 5 GB × $0.30 = $7.50 (3 GB needs the 5 GB size)                  |
| **Google Cloud SQL for PostgreSQL** | 10 × $9.37 = $93.70                                                  | $7.67 instance + 10 GB of SSD × $0.17 = $9.37 (3 GB fits in the 10 GB minimum) |
| **Supabase**                        | $25 Pro + 10 × $10 Micro − $10 credit = $115.00                      | $25 Pro + $10 Micro − $10 credit = $25.00                                      |
| **Amazon RDS for PostgreSQL**       | 10 × $17.63 = $176.30                                                | $11.68 instance + $2.30 for 20 GB of gp3 + $3.65 IPv4 = $17.63                 |

**Notes:**

- Supabase Free allows 2 active projects, so ten projects need Pro. The total assumes all ten are in one Pro organization. Keeping 2 in a separate Free organization and 8 on Pro costs $95.00 ($25 Pro + 8 × $10 Micro − $10 credit). In a shared project, all ten apps also share one Auth user pool and one set of Storage buckets.
- The AWS Free plan allows 2 Aurora clusters, so ten clusters need a Paid plan.
- Render allows one free database per workspace, and its free database expires after 30 days, so ten projects need paid instances.
- On Neon, each project includes 5 GB of egress, so ten projects get 50 GB. On Supabase Pro, all ten share the organization's 250 GB, and on Render's Hobby workspace they share 5 GB, then $0.15/GB.

</details>

On Neon, each project gets its own free allowance, so ten projects still cost $0.

### A weekend hackathon project

Take a hackathon app with 0.2 GB of data. Your team builds and tests it for 48 hours, demos it, and then nobody touches it again. The first month covers the weekend, with and without new-account credits, and every month after that is what the database costs if you forget to delete it:

| Provider                            | Plan                                 | After the demo                                      | First month, new account | First month, after credits | Each month after    |
| :---------------------------------- | :----------------------------------- | :-------------------------------------------------- | :----------------------- | :------------------------- | :------------------ |
| **Neon**                            | Free                                 | Scales to zero and stays there                      | **$0.00**                | **$0.00**                  | **$0.00**           |
| **Supabase**                        | Free                                 | Paused after 7 days, until you resume it            | **$0.00**                | **$0.00**                  | **$0.00**           |
| **Render Postgres**                 | Free                                 | Expires after 30 days, and is deleted 14 days later | **$0.00**                | **$0.00**                  | **$0.00** (deleted) |
| **Amazon Aurora PostgreSQL**        | Serverless v2, express configuration | Pauses, and bills only storage                      | **$0.00**                | **$3.10**                  | **$0.02**           |
| **Google Cloud SQL for PostgreSQL** | `db-f1-micro`, Enterprise edition    | Keeps running until you stop or delete it           | **$0.00**                | **$9.37**                  | **$9.37**           |
| **Amazon RDS for PostgreSQL**       | `db.t4g.micro`, On-Demand            | Keeps running until you delete it                   | **$0.00**                | **$17.63**                 | **$17.63**          |

<details>
<summary>Curious how each total is calculated?</summary>

| Provider                            | First month                                                                                | Each month after              |
| :---------------------------------- | :----------------------------------------------------------------------------------------- | :---------------------------- |
| **Neon** (Free)                     | 0.25 CU × 48 h = 12 of 100 CU-hours, and 0.2 GB of the 1 GB allowance                      | No compute, 0.2 GB of storage |
| **Supabase** (Free)                 | Included in the Free plan, and 0.2 GB of the 500 MB allowance                              | Paused, 0.2 GB of storage     |
| **Render Postgres**                 | Free database, and 0.2 GB of the 1 GB allowance                                            | Deleted, along with its data  |
| **Amazon Aurora PostgreSQL**        | 0.5 ACU × 48 h × $0.12 = $2.88, plus 1M I/O × $0.20/M = $0.20, plus 0.2 GB × $0.10 = $0.02 | 0.2 GB × $0.10 = $0.02        |
| **Google Cloud SQL for PostgreSQL** | 730 h × $0.0105 = $7.67, plus 10 GB of SSD × $0.17 = $1.70                                 | The same $9.37                |
| **Amazon RDS for PostgreSQL**       | 730 h × $0.016 = $11.68, plus 20 GB × $0.115 = $2.30, plus $3.65 IPv4                      | The same $17.63               |

**Notes:**

- Even if a busy weekend autoscales Neon to its 2 CU limit for all 48 hours, that's 96 CU-hours, which is still within the 100 included.
- On a new account, AWS Free plan credits cover the first month on Aurora and RDS, and the Cloud SQL trial instance or Google Cloud's $300 of credits cover it on Cloud SQL. The other two columns are what you pay once the credits or the trial are gone.
- You can stop an RDS instance after the demo, but RDS starts it again on its own after 7 days.
- Stopping the Cloud SQL instance after the demo cuts the bill only to about $9.00 a month, since its storage ($1.70) and idle IP address (730 h × $0.01 = $7.30) still bill.

</details>

Any of the free tiers can carry a hackathon weekend. The difference is what happens after the demo: on Neon, Supabase, and Aurora, a forgotten database costs (almost) nothing, while Cloud SQL and RDS keep billing every hour until you delete them. Render's free database costs nothing too, but Render deletes it, with its data, 44 days after you create it. On Neon and Supabase, the same free project also covers sign-in and file uploads, so the whole backend costs $0 for the weekend.

## Which Postgres host is cheapest for you?

- Want 100 free projects with Postgres, Auth, and Object Storage that never expire? **Neon**.
- Want Postgres, Auth, and Storage in one dashboard for one or two apps? **Supabase**.
- Already hosting your app on Render? **Render Postgres**.
- On AWS, with a database that's idle most of the month? **Amazon Aurora PostgreSQL**.
- Want the cheapest always-on instance on a major cloud? **Google Cloud SQL for PostgreSQL**.
- On AWS, with a database that's busy all day? **Amazon RDS for PostgreSQL**.

### For students and developers learning Postgres

- **Neon** for a permanent free plan with no credit card, and [Claimable Neon](/docs/reference/claimable-neon) for a database without an account
- **Supabase** for a permanent free plan with Auth and Storage to learn alongside Postgres, if you use it at least once a week so it isn't paused

### For hackathon teams

- **Neon** for a free project per idea, with 10 branches, Managed Better Auth, and Object Storage, so sign-in and uploads work on the Free plan and a forgotten project costs nothing after the demo ([see the cost](#a-weekend-hackathon-project))
- **Google Cloud SQL for PostgreSQL** for a 30-day trial instance with 8 vCPUs and 64 GB of RAM, if your project only needs to run for the length of the event and you're already on Google Cloud

### For indie hackers with many small projects

- **Neon** for 100 free projects with no time limit, each with its own compute, Auth, Object Storage, and Functions allowance, and no base fee once one of them grows ([see the cost](#ten-side-projects))
- **Amazon Aurora PostgreSQL** for cents a month per idle cluster, if you're on AWS and your visitors can wait about 15 seconds for a resume
- **Supabase** for the option to self-host the whole stack on a VPS later, so you pay only for the server

### For developers launching their first paid product

- **Neon** for a Launch plan with no base fee that bills only the hours your database is awake
- **Render Postgres** for the cheapest always-on instance in this list, $6 a month plus storage, if your app already runs on Render
- **Supabase** for a flat $25 a month on Pro with a Micro instance (1 GB of RAM), or $30 with a Small instance (2 GB of RAM) for an app that's busy around the clock (<a href="https://supabase.com/pricing" target="_blank" rel="nofollow noopener noreferrer">pricing</a>)

### For developers who already build on AWS or Google Cloud

- **Amazon Aurora PostgreSQL** for a database that pauses when idle, inside your AWS account
- **Amazon RDS for PostgreSQL** for a busy, always-on database inside your AWS account and VPC
- **Google Cloud SQL for PostgreSQL** for the cheapest always-on instance on a major cloud, a `db-f1-micro` from about $9.37 a month

## Frequently asked questions

<Faq>

<FaqItem question="Which Postgres hosts have a free tier that doesn't expire?">

**Neon** and **Supabase**. Both free plans are permanent. **Render**'s free database expires after 30 days. **Amazon RDS** and **Aurora** are covered by AWS Free plan credits for up to 6 months, and **Google Cloud SQL** has a 30-day trial instance plus 90 days of Google Cloud credits for new customers.

</FaqItem>

<FaqItem question="Which free Postgres tiers require a credit card?">

Neon, Supabase, and Render don't need one. Google Cloud requires a credit card or another payment method for its free trial and for the Cloud SQL trial instance. AWS no longer asks most new accounts for a payment method on the Free plan, but it may ask for one to verify your identity.

</FaqItem>

<FaqItem question="Does Aurora Serverless v2 scale to zero?">

Yes, if you set the minimum capacity to 0 ACUs. An instance then auto-pauses after 5 minutes or more without connections, and stops billing for compute while it's paused. It takes about 15 seconds to resume, or 30 seconds or more after it's been paused for over a day. Open connections, including idle pooled ones, and RDS Proxy keep it from pausing.

</FaqItem>

<FaqItem question="Is there still a 750-hour free tier for Amazon RDS?">

Only for AWS accounts created before July 15, 2025, and only for their first 12 months. Accounts created after that get the AWS Free plan, where RDS usage draws from up to $200 of credits shared with every other AWS service, for up to 6 months.

</FaqItem>

<FaqItem question="Is it cheaper to put several projects in one database instance?">

On hosts that bill each instance by the hour, yes. Ten side projects in one RDS instance cost about $17.63 a month instead of $176.30. But one project's traffic or a bad migration then affects all of them, and you can't restore or delete one project on its own. On Neon, each project gets its own free allowance, so you can keep projects separate at no extra cost ([see the cost](#ten-side-projects)).

</FaqItem>

</Faq>
