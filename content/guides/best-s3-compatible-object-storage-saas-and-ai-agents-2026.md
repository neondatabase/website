---
title: 'Best object storage for SaaS and AI agents (2026)'
subtitle: 'Compare Neon Object Storage, S3, R2, Upstash Blob, and Supabase Storage for SaaS and AI agents on pricing, egress, free tiers, and branching files with your database.'
author: rishi-raj-jain
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-09-24T00:00:00.000Z'
---

Every SaaS app ends up storing files: avatars, invoices, PDF exports, chat attachments. AI agents add even more of them, like generated images, scraped pages, and tool outputs. Naturally, you'd store those files in an S3-compatible bucket and reference each one from a Postgres row.

But because most services can't fork a database and its bucket at the same time, this setup becomes tricky when you want a copy of both (database and object storage) to test your changes against.

An agent that runs several experiments a day against both the database and its files needs an isolated copy of those files for each run. Copying objects one by one costs you both time and money.

This guide compares five object storage options on three things: price, how much the free and paid tiers include, and whether storage branches with your database so that you (or the agents) working on your app can test every change against real data and files.

## What do you need from object storage?

At a minimum, object storage for a modern app should:

- Speak the **S3 API**, so the aws4fetch, boto3, AWS SDK, and the AWS CLI work without a custom client.
- Support **presigned URLs** so browsers upload and download directly, without routing bytes through your server.
- Offer **private and public buckets** so user uploads stay private and public assets stay cacheable.
- Have **predictable pricing** you can estimate.

For SaaS teams and agent builders, the options that stand out add:

- **Low or no egress fees:** Egress is usually the biggest line item on a file-heavy app, far ahead of storage itself.
- **No per-request charges:** Agents list, read, and write objects constantly, and per-request pricing grows with every tool call.
- **A usable free tier:** Enough room to build and test a real app before you pay.
- **Branching with the database:** A preview or agent run gets the rows and the files at the same point in time, in a single step.

Let's quickly see how the five options compare on price before we go deeper:

| Provider                 | Storage (per GB-month)                    | Requests                           | Egress (per GB)                                                                           | Free tier                                                               |
| :----------------------- | :---------------------------------------- | :--------------------------------- | :---------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **Neon Object Storage**  | $0.023                                    | Free                               | **Per project**: 500 GB included, then $0.10                                              | 5 GB of storage and 5 GB of egress **per project**, up to 100 projects  |
| **Amazon S3 (Standard)** | $0.023 (first 50 TB)                      | $0.005/1K writes, $0.0004/1K reads | First 100 GB free, then $0.09                                                             | Up to $200 in credits for new accounts                                  |
| **Cloudflare R2**        | $0.015                                    | $4.50/M Class A, $0.36/M Class B   | Free                                                                                      | 10 GB, 1M Class A, 10M Class B per month                                |
| **Upstash Blob**         | $0.02                                     | $4.50/M advanced, $0.30/M simple   | First 1 TB free, then $0.02                                                               | 1 GB, 10K simple and 2K advanced ops, 10 GB egress                      |
| **Supabase Storage**     | 100 GB **per org** included, then $0.0213 | Free                               | **Per org**: 250 GB uncached included, then $0.09, and 250 GB cached included, then $0.03 | 1 GB of storage and 5 GB of egress **per org**, up to 2 active projects |

And here's how they compare on branching:

| Provider                | Branches with your database                  |
| :---------------------- | :------------------------------------------- |
| **Neon Object Storage** | Yes, copy-on-write with every Neon branch    |
| **Supabase Storage**    | Branches start with empty storage by default |
| **Amazon S3**           | No, copy objects to a new bucket or prefix   |
| **Cloudflare R2**       | No, copy objects to a new bucket or prefix   |
| **Upstash Blob**        | No, copy objects to a new bucket or prefix   |

## What's the best object storage for SaaS and AI agents?

### 1. Neon Object Storage

[Neon Object Storage](/docs/storage/overview) is S3-compatible object storage built into your Neon project. What sets it apart is branching where each Neon branch gets its own isolated view of storage.

When you [create a branch](/docs/introduction/branching), it inherits every bucket and object from its parent at that moment. New uploads, overwrites, and deletes on the child stay on the child, and the parent never sees them.

This makes it a good fit for agents. An agent can branch before a risky run, change files freely, and discard the branch without touching production. Nothing gets copied, so the branch is ready instantly, with rows and files from the same point in time. To see how much cost this saves when agents use Neon Object Storage, read [An agent that runs 5 experiments a day](#an-agent-that-runs-5-experiments-a-day).

Let's quickly walk through creating a bucket and using it in a multi-tenant SaaS app:

#### Declare a bucket as code

Buckets are declared in [`neon.ts`](/docs/reference/neon-ts), next to the rest of your Neon setup:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({ buckets: { invoices: {} } });
```

Running `neon deploy` creates the bucket and writes `DATABASE_URL` and the `AWS_*` S3 credentials into `.env.local` automatically.

Once the bucket exists, your app can write files to it and track each one in Postgres.

#### Scope file uploads by tenant

With an S3 client [pointed at your branch](/docs/storage/get-started#configure-your-client) and the [Neon serverless driver](/docs/serverless/serverless-driver), a multi-tenant app would upload under the tenant's prefix, record the key in Postgres, and then return the presigned URL to browser with expiration:

```typescript shouldWrap
const key = `tenants/${tenantId}/invoices/${invoiceId}.pdf`;

await s3.send(new PutObjectCommand({ Bucket: 'invoices', Key: key, Body: pdf }));
await sql`INSERT INTO invoices (tenant_id, object_key) VALUES (${tenantId}, ${key})`;

const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: 'invoices', Key: key }), { expiresIn: 3600 });
```

On S3, the upload is a PUT request at $5 per million. On R2, it's a Class A operation at $4.50 per million, and on Upstash Blob it's an advanced operation at the same $4.50 per million. On Neon, **none of these calls adds a request charge**, so you only pay for the bytes you store and serve.

#### How Neon bills storage and egress

On the Launch and Scale plans, storage costs $0.023/GB-month. Egress comes out of the project's [public network transfer](/docs/introduction/plans#public-network-transfer) allowance: **500 GB per project per month**, then $0.10/GB. Note that:

- **The allowance is per project** (not per organization): Every project you create gets its own 500 GB on Launch and Scale and 5 GB on the Free plan.
- **The allowance is shared by everything inside the project**: Postgres query results, Object Storage downloads, and Functions responses all count toward the same 500 GB, so a project that serves 400 GB of files and 150 GB of query results pays for (400 + 150 − 500) × $0.10 = $5.00 of egress.
- **Projects are cheap to create**: The Free and Launch plans allow up to 100 projects, and Scale allows 1,000 (more on request), with no per-project fee. Giving each app, large customer, or agent workload its own project gives each one its own 500 GB allowance.

**Strengths:**

- Buckets and objects branch with the database, copy-on-write
- No per-request charges, so agents that list and read constantly don't increase your bill
- 500 GB of monthly egress included **per project** on paid plans
- 5 GB of storage and 5 GB of egress free **per project**, with up to 100 projects on the Free plan
- Ability to run [Function Triggers](/docs/compute/functions/triggers/object-storage) when an object is uploaded

**Watch out for:**

- Available in four AWS regions today (US East Ohio, US East N. Virginia, Frankfurt, and Singapore)
- Supports a subset of the S3 API, where lifecycle rules and versioning are stored [but not enforced](/docs/storage/s3-compatibility)

<Admonition type="tip" title="Best for">
SaaS teams and agent builders who already use Postgres and want every preview deploy, test run, or agent experiment to get the database and its files at the same point in time.
</Admonition>

### 2. Amazon S3

**Amazon S3** is the original object store. It has the widest feature set in this list: storage classes from Standard to Glacier Deep Archive, lifecycle rules, versioning, replication, and event notifications.

S3 has no concept of a database branch, so to give a preview environment its own files, you create a bucket (or prefix) per branch and copy objects into it with `aws s3 sync`. Each copied object is a billed COPY request, and the sync time grows with your object count.

S3 Standard costs $0.023/GB-month, plus $0.005 per 1K writes and $0.0004 per 1K reads. Egress is free for the first 100 GB a month, then $0.09/GB. For files you serve publicly, that quickly outgrows storage: keeping 1 TB in S3 costs about $23 a month, but serving it only once costs about $81.

**Strengths:**

- 99.999999999% (11 nines) durability, with strong read-after-write consistency
- The most complete feature set: storage classes, lifecycle, versioning, replication
- Available in more regions than any other option here, so you can store data close to your users
- Deep integration with the rest of AWS (Lambda, CloudFront, IAM, Athena)

**Watch out for:**

- $0.09/GB egress after the first 100 GB
- Per-request billing on every read, write, list, and copy
- No free tier beyond time-limited credits for new accounts

<Admonition type="tip" title="Best for">
Teams already on AWS who need storage classes or compliance features, and whose traffic stays inside AWS where egress is cheaper.
</Admonition>

### 3. Cloudflare R2

**Cloudflare R2** is S3-compatible storage with zero egress fees, which means you pay for storage and operations but never for the bytes you serve.

Like S3, R2 doesn't branch with your database, so a per-preview copy means a new bucket and a `CopyObject` for every object, each billed as a Class A operation.

R2 Standard costs $0.015/GB-month, with writes and lists at $4.50 per million, and reads at $0.36 per million.

Its free tier is the largest here for a single bucket: every month you get 10 GB of storage, 1 million Class A operations, and 10 million Class B operations.

**Strengths:**

- Free egress, which makes the bill predictable for public, download-heavy apps
- The cheapest storage rate in this set at $0.015/GB-month
- A free tier that covers many small production apps
- Pairs with Cloudflare Workers and the Cloudflare CDN

**Watch out for:**

- Class A operations at $4.50 per million add up for write-heavy agents
- No database branching, so preview copies cost a Class A operation per object

<Admonition type="tip" title="Best for">
Apps that serve a lot of public files (media, downloads, user-generated content) where egress would dominate the bill on any other provider.
</Admonition>

### 4. Upstash Blob

**Upstash Blob** is serverless, S3-compatible storage. Files are replicated to a global CDN, and the `@upstash/blob` SDK handles browser uploads, multipart with pause and resume, and signed reads for private buckets.

Upstash Blob has no branching, and since copies are advanced operations, cloning a bucket for each preview or agent run is billed per object.

On pay-as-you-go, storage costs $0.02/GB-month, and egress is free up to 1 TB a month, then $0.02/GB. Simple operations (reads) cost $0.30 per million, and advanced operations (uploads, copies, and bucket listings) cost $4.50 per million.

**Strengths:**

- Global CDN replication by default (with no region to configure)
- A typed SDK with React hooks built for browser uploads
- 1 TB of free egress a month on pay-as-you-go, then $0.02/GB, far below S3 and Supabase overage rates

**Watch out for:**

- No database branching
- Listing a bucket counts as an advanced operation at $4.50 per million
- A small free tier (2,000 advanced operations a month runs out quickly when an agent lists buckets)

<Admonition type="tip" title="Best for">
Frontend-heavy apps that want global CDN delivery and direct browser uploads with a typed SDK, and that don't need storage to fork with a database.
</Admonition>

### 5. Supabase Storage

**Supabase Storage** is S3-compatible storage bundled into a Supabase project, with access control through Postgres row-level security and built-in image transformations.

Supabase has database branching on paid plans, at $0.01344 per branch per hour. But a new branch starts without your production data or storage objects by default. The **Include data** option copies production database data into the branch **without duplicating storage objects**, and it requires the Point-in-Time Recovery add-on ($100 per month per 7-days).

To get files into a branch, you'd need to re-upload them. Re-uploading 20 GB at 50 MB/s takes about seven minutes per branch, and if the files come from production, each branch also pays for that download as egress.

#### How Supabase bills storage and egress

The Pro plan costs $25 a month and includes 100 GB of storage (then $0.0213/GB-month) and two separate egress quotas:

- **Uncached egress:** 250 GB included, then $0.09/GB
- **Cached egress (Smart CDN serves from a cache hit):** 250 GB included, then $0.03/GB

Note that these quotas apply to the **whole organization** (not to each project). Supabase sums usage across every project in the org, and egress from every service (Database, Auth, Storage, Edge Functions, Realtime, and Log Drains) counts toward the same quotas. Adding a project doesn't add quota.

**Strengths:**

- 100 GB of storage, 250 GB of uncached egress, and 250 GB of cached egress bundled into the Pro plan
- Cheaper $0.03/GB egress for files served from the CDN cache
- Access control with Postgres row-level security policies
- Built-in image transformations (100 origin images on Pro, then $5 per 1K)

**Watch out for:**

- Branches start with empty storage, so every preview re-uploads its files, which costs minutes and egress per branch
- Storage and egress quotas are shared by every project and service in the entire organization
- $0.09/GB for uncached egress beyond the quota, which includes private files served through a fresh signed URL each time

<Admonition type="tip" title="Best for">
Teams already building on Supabase who want storage, auth, and database policies in one project, and whose previews need only a small set of seed files.
</Admonition>

## What does it actually cost?

Per-GB rates only tell part of the story, so let's walk through three workloads with estimated costs on each provider.

### A SaaS app serving user uploads

Take a SaaS app in one project with 100 GB of files, 500 GB of monthly egress, 1 million uploads, and 10 million reads per month. The files are private user uploads, served with a fresh presigned URL on each download, like the [example above](#scope-file-uploads-by-tenant):

| Provider                | Plan          | Storage | Requests | Egress | Monthly total |
| :---------------------- | :------------ | :------ | :------- | :----- | :------------ |
| **Cloudflare R2**       | Pay-as-you-go | $1.35   | $0       | $0     | **$1.35**     |
| **Neon Object Storage** | Launch        | $2.30   | $0       | $0     | **$2.30**     |
| **Upstash Blob**        | Pay-as-you-go | $2.00   | $7.50    | $0     | **$9.50**     |
| **Amazon S3**           | Pay-as-you-go | $2.30   | $9.00    | $36.00 | **$47.30**    |
| **Supabase Storage**    | Pro           | $25.00  | $0       | $22.50 | **$47.50**    |

<details>
<summary>Curious how each total is calculated?</summary>

- **Cloudflare R2:** storage is (100 GB − 10 GB free) × $0.015 = $1.35. The 1M uploads (Class A) and 10M reads (Class B) both fit inside the free 1M and 10M operations, and egress is free.
- **Neon Object Storage:** storage is 100 GB × $0.023 = $2.30. Requests are free. Egress is (500 GB − 500 GB per-project allowance) × $0.10 = $0.
- **Upstash Blob:** storage is 100 GB × $0.02 = $2.00. Requests are (1M advanced × $4.50/M) + (10M simple × $0.30/M) = $4.50 + $3.00 = $7.50. Egress is $0, because 500 GB is under the free 1 TB.
- **Amazon S3:** storage is 100 GB × $0.023 = $2.30. Requests are (1,000K PUTs × $0.005/1K) + (10,000K GETs × $0.0004/1K) = $5.00 + $4.00 = $9.00. Egress is (500 GB − 100 GB free) × $0.09 = $36.00.
- **Supabase Storage:** the Pro base fee is $25.00, and 100 GB of storage fits inside the included 100 GB. Egress is (500 GB − 250 GB uncached quota) × $0.09 = $22.50, because a fresh signed URL on each download misses the CDN cache.

</details>

Both of the cheapest totals sit right at a limit: R2's free operations and Neon's 500 GB per-project egress allowance. Past those limits, R2 starts charging per request while egress stays free, and Neon starts charging $0.10/GB for egress while requests stay free, however many calls your app or agents make.

### Serving files from several projects

Per-project and per-organization allowances might look the same when you have a single project. Now, take a team that runs four apps (or gives each of its four largest customers a dedicated project), and each one serves 400 GB of files a month. That's 1,600 GB of egress in total. This table shows egress only:

| Provider                | Plan   | How the allowance applies                             | Egress cost |
| :---------------------- | :----- | :---------------------------------------------------- | :---------- |
| **Neon Object Storage** | Launch | 4 projects, each with its own 500 GB                  | **$0**      |
| **Supabase Storage**    | Pro    | 4 projects in 1 org, all sharing one 250 GB quota     | **$121.50** |
| **Supabase Storage**    | Pro    | 4 projects in 1 org, if every download is a cache hit | **$40.50**  |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon, one project per app:** each project's 400 GB fits inside its own 500 GB allowance, so 4 × $0 = $0.
- **Supabase, uncached:** (1,600 GB − 250 GB) × $0.09 = $121.50.
- **Supabase, cached:** (1,600 GB − 250 GB) × $0.03 = $40.50.

</details>

On Neon, each project you add brings another 500 GB, and the Launch plan allows up to 100 projects with no per-project fee. On Supabase, adding a project doesn't add quota, so every new project also takes a share from the same 250 GB.

### An agent that runs 5 experiments a day

Now take an agent that forks its working state for every run. Each run lasts about an hour and needs its own copy of 20K files (20 GB in total), plus the rows that reference those files.

The runs happen at different times, and each branch is deleted when its run ends, so only one run branch exists alongside production at any time. That's 150 runs a month:

| Provider                | Plan          | How each run gets its files                          | Copies the database too? | What you pay for                                                                                     | Monthly total |
| :---------------------- | :------------ | :--------------------------------------------------- | :----------------------- | :--------------------------------------------------------------------------------------------------- | :------------ |
| **Neon Object Storage** | Launch        | Branch the project, copy-on-write                    | Yes                      | 0.25 CU of compute for 150 run-hours at $0.106/CU-hour. Branching the files is free.                 | **$3.98**     |
| **Cloudflare R2**       | Pay-as-you-go | Copy 20K objects to a new bucket or prefix           | No                       | 3M copies and lists at $4.50/M after 1M free ($9.01), plus $0.06 of temporary storage                | **$9.07**     |
| **Upstash Blob**        | Pay-as-you-go | Copy 20K objects to a new bucket or prefix           | No                       | 3M copies and lists at $4.50/M ($13.51), plus $0.08 of temporary storage                             | **$13.59**    |
| **Amazon S3**           | Pay-as-you-go | `aws s3 sync` 20K objects to a new bucket or prefix  | No                       | 3M COPY and LIST requests at $5/M ($15.02), plus $0.09 of temporary storage                          | **$15.11**    |
| **Supabase Storage**    | Pro           | Branch the database, re-upload 20 GB from production | Yes                      | $100 PITR add-on, 2,750 GB of egress at $0.09 ($247.50), and Micro compute for 150 run-hours ($2.02) | **$349.52**   |

Above are the costs on top of what you already pay to run production (so they leave out base fees like Supabase's $25 Pro plan). Each run's copy is deleted when the run ends, and temporary storage is prorated over a 730-hour month: 20 GB × 150 run-hours ÷ 730 hours = 4.11 GB-months.

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon Object Storage:** 0.25 CU × 150 run-hours × $0.106/CU-hour = $3.98. Branching the files and rows is copy-on-write, so there's no copy charge, and nothing leaves the project as egress. Two branches (production plus one run) stay within the Launch plan's 10 included branches, so there's no extra-branch fee.
- **Cloudflare R2:** each run makes 20K `CopyObject` requests plus 20 list requests (1,000 keys per page), so 20,020 × 150 runs = 3,003,000 Class A operations. (3,003,000 − 1M free) × $4.50/M = $9.01. Temporary storage is 4.11 GB-months × $0.015 = $0.06.
- **Upstash Blob:** 3,003,000 advanced operations × $4.50/M = $13.51, with no free operations on pay-as-you-go. Temporary storage is 4.11 GB-months × $0.02 = $0.08.
- **Amazon S3:** 3,003,000 COPY and LIST requests × $0.005/1K = $15.02. Temporary storage is 4.11 GB-months × $0.023 = $0.09.
- **Supabase Storage:** the PITR add-on is $100. Each run downloads 20 GB from production, so 150 × 20 GB = 3,000 GB of egress, and (3,000 GB − 250 GB uncached quota) × $0.09 = $247.50. Branch compute is 150 run-hours × $0.01344 = $2.02.

</details>

A few things to keep in mind:

- **R2, Upstash Blob, and S3** copy each object with a server-side copy request, so the files never leave the provider and aren't billed as egress. On S3, keep both buckets in the same region to avoid inter-region transfer charges. They only copy the files, though, so you'd still pay separately to copy the database.
- **Supabase's egress depends on caching and on the rest of the organization.** If the downloads hit the CDN cache (a public bucket, or the same signed URL reused across runs), only the first run's 20 GB is uncached, and it fits inside the 250 GB uncached quota. The other 2,980 GB bill as cached egress: (2,980 GB − 250 GB) × $0.03 = $81.90, for a total of $183.92. But the quotas are shared with every project in the organization, so if production traffic already used them, all 3,000 GB bills at $0.09 = $270.00.
- The copy approach also has another cost the table doesn't show: **time**. Copying 20K objects before every run means the agent waits on I/O before it does any work.

Supabase takes the longest here because its branches start with empty buckets. Seeding 20 GB into each branch at 50 MB/s takes about seven minutes, which adds up to almost 17 hours a month of agents waiting on uploads across 150 runs. On Neon, [branch creation](/docs/introduction/branching) is copy-on-write for both, so the run starts in under a second with rows and files from the same instant.

## Which object storage should you choose?

- **Want your files to branch with your database for previews and agent runs?** Choose **Neon Object Storage**.
- **Serving lots of public downloads and want zero egress fees?** Choose **Cloudflare R2**.
- **All-in on AWS and need storage classes or lifecycle rules?** Choose **Amazon S3**.
- **Want global CDN delivery and a typed SDK for browser uploads?** Choose **Upstash Blob**.
- **Already on Supabase and want storage bundled into your plan?** Choose **Supabase Storage**.

### Recommendations by team type

#### For solo developers or side projects

- **Neon Object Storage** for 5 GB of storage and 5 GB of egress free per project, alongside a free Postgres database
- **Cloudflare R2** for 10 GB free and free egress

#### For early-stage SaaS startups

- **Neon Object Storage** for preview deploys where every PR gets its own database and files
- **Cloudflare R2** when public file serving drives most of your traffic
- **Supabase Storage** if you're already on Supabase and the Pro plan allowances fit

#### For teams building AI agents

- **Neon Object Storage** for a branch per agent run with no per-request charges
- **Cloudflare R2** for agents that mostly read and serve files publicly
- **Amazon S3** for agents that already run inside AWS

#### For enterprises

- **Amazon S3** for the deepest feature set, compliance tooling, and storage classes
- **Cloudflare R2** for egress-heavy workloads at scale
- **Neon Object Storage** for teams that want isolated, production-shaped environments for every change

## Frequently asked questions

<Faq>

<FaqItem question="What's the cheapest object storage for AI agents in 2026?">

**Neon Object Storage**, because it has no per-request charges and branches files with the database. In the [5-experiments-a-day example](#an-agent-that-runs-5-experiments-a-day), that's $3.98 a month including a database copy, versus $9.07 to $15.11 on R2, Upstash Blob, and S3 for copying the files alone.

</FaqItem>

<FaqItem question="Which object storage has the best free tier for building AI agents?">

**Neon Object Storage** gives you 5 GB of storage and 5 GB of egress per project with no per-request limits, and the Free plan allows up to 100 projects.

</FaqItem>

<FaqItem question="Is Neon's egress allowance per project or per organization?">

Per project. On the Launch and Scale plans, each project includes 500 GB of egress a month, then $0.10/GB, and everything in the project (Postgres, Object Storage, and Functions) shares that allowance.

</FaqItem>

<FaqItem question="Can object storage branch with my database?">

Only **Neon Object Storage** branches buckets and objects together with the database, using copy-on-write. **Supabase** branches the database, but new branches start with empty storage by default. **Amazon S3**, **Cloudflare R2**, and **Upstash Blob** have no branching, so you copy objects into a new bucket or prefix yourself.

</FaqItem>

<FaqItem question="Can I use the AWS SDK with Neon Object Storage?">

Yes, Neon Object Storage is S3-compatible, so you can point the AWS SDK for JavaScript, boto3, or the AWS CLI at your branch's storage endpoint and use path-style addressing (`forcePathStyle: true` in JavaScript). The [S3 compatibility](/docs/storage/s3-compatibility) page lists every supported operation.

</FaqItem>

<FaqItem question="Why do per-request charges hit agents harder than apps?">

A typical app reads and writes a file a handful of times per user action. An agent may list a bucket, read dozens of objects, and write intermediate results on every step of every run. With per-operation billing, every step in each run multiplies the costs. Neon Object Storage doesn't charge per request at all.

</FaqItem>

<FaqItem question="How do I keep files and database rows in sync across environments?">

Branch them together. On Neon, every branch gets the parent's rows and files from the same point in time, so they are always in sync with each other within a branch.

</FaqItem>

</Faq>
