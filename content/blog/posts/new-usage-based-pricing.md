---
title: 'Neon’s New Pricing, Explained: Usage-Based With a $5 Minimum'
description: 'No quotas, no overages, just pay for what you use'
excerpt: >-
  We’ve just rolled out a major update to Neon’s pricing. Starting today, our
  paid plans are fully usage-based. That means you only pay for what you use,
  with no quotas to manage, no overages to worry about, and no need to guess how
  much capacity you’ll need upfront. We’re only enf...
date: '2025-08-14T13:03:58'
updatedOn: '2025-12-09T01:16:05'
category: company
categories:
  - company
authors:
  - mike-jerome
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/new-usage-based-pricing/cover.png
  alt: null
isFeatured: true
seo:
  title: 'Neon’s New Pricing, Explained: Usage-Based With a $5 Minimum - Neon'
  description: >-
    We just rolled out a major pricing update, including two of our most
    requested changes: more storage for Free users, and a $5 /month plan.
  keywords: []
  noindex: false
  ogTitle: 'Neon’s New Pricing, Explained: Usage-Based With a $5 Minimum - Neon'
  ogDescription: >-
    We just rolled out a major pricing update, including two of our most
    requested changes: more storage for Free users, and a $5 /month plan.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/new-usage-based-pricing/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/new-usage-based-pricing/new-pricing-1-1024x570-0dc1bd83.png)

<Admonition type="important" title="Update (December 2025)">
We are no longer enforcing the $5 minimum in our paid plans - if you consume $3, that's what you'll be charged. [Check our pricing page for the up to date pricing information.](https://neon.com/pricing)
</Admonition>

We’ve just rolled out a major update to [Neon’s pricing](https://neon.com/pricing). **Starting today, our paid plans are fully usage-based.** That means you only pay for what you use, with no quotas to manage, no overages to worry about, and no need to guess how much capacity you’ll need upfront. **We’re only enforcing a $5/month minimum spend** to cover the costs of maintaining your account and keeping your databases ready to go.

And yes – the Free plan stays. Not only that, but we’ve added a much-requested change: more storage. **Instead of 0.5 GB total, you now get 0.5 GB of storage per project in the Free Plan**, up to 5 GB across 10 projects.

## How Usage-Based Pricing Works in Neon

If our plans are now fully usage-based, what exactly does that mean? It means that your Neon bill will be determined by pricing four core resources:

- Compute usage, in CU-hours
- Storage usage, in GB-months
- Additional branch usage, in branch-hours (only when you exceed your included “simultaneous branches” quota)
- And restore history, in GB-months of data changes (if you have Instant Restores enabled)

We’ll explain each of these below.

### Compute usage (CU-hours)

This is the time your database is actively running, measured in CU-hours. Neon is a [serverless Postgres](https://neon.com/docs/introduction/serverless) engine, and that means:

- When your database is running, it automatically scales between the min and max [autoscaling limits](https://neon.com/docs/introduction/autoscaling) you set.
- Your monthly compute usage will reflect what your application actually used, not some preallocated block.
- For databases that don’t run 24/7, Neon automatically scales to zero after a period of inactivity (5 minutes by default). You can [configure this behavior](https://neon.com/docs/guides/scale-to-zero-guide), but it makes Neon incredibly efficient for dev/test databases or projects that have quiet periods (e.g. outside of business hours).

The metric we use to bill compute is CU-hour:

- A CU (Compute Unit) is a measure of your compute size: 1 CU = 1 vCPU + 4 GB RAM
- A CU-hour represents 1 CU running for 1 hour

**Example:** If a 2 CU database runs for 3 hours, that’s 6 CU-hours. Our billing engine keeps track of this automatically, summing up all your real usage across all databases at the end of the month.

### Storage usage (GB-months)

This is the amount of data stored across your projects. In Neon, storage is usage-based and [bottomless](https://neon.com/storage) – you don’t need to provision or resize volumes. Instead, you’re billed based on the actual amount of data your projects consume over time.

With this new pricing model, we’ve aligned how we bill for storage with Neon’s branching architecture:

- Every project starts with a root branch.
- From there, you can create child branches – isolated environments for testing, development, previews, etc.
- Thanks to Neon’s copy-on-write model, child branches don’t duplicate data. Creating a branch doesn’t mean doubling your storage usage.
- Instead, only the delta (the changes between the root and the child branch) counts toward your monthly storage.

The metric we use is GB-month:

- A GB-month represents 1 GB of data stored for a full month.
- We meter storage hourly, then sum it across the month. So if you store 2 GB for half the month, that’s counted as 1 GB-month.

**Example:** If your root branch stores 3 GB and your child branches add a combined 0.5 GB of changes, your billed storage would be 3.5 GB, measured proportionally across the month.

### Additional branch usage (branch-hours)

Branches are a core feature of Neon, and some use cases call for having many active branches at once. Each plan accounts for a number of simultaneous branches per project at no extra cost; but if you go over that quota, we’ll charge based on how long the extra concurrent branches exist.

This pricing model allows us to [safely scale our infrastructure](https://neon.com/blog/may-june-recap) to support high simultaneous branch usage while keeping costs predictable and affordable. You’re free to create and delete branches all month long, and as long as you stay within your plan’s included number of _active_ branches at any given time, you won’t be charged a penny extra.

If you do surpass that number, the metric we’ll use to bill you for the additional branches is branch-hour:

- A branch-hour = 1 additional branch × 1 hour of lifetime
- Remember, we will only meter branches that exceed your simultaneous branch quota

<Admonition type="tip" title="TL;DR">
Many branches? No problem. Too many at the same time? That’s where extra cost might kick in - but even then, it’s just $0.002 per branch-hour.
</Admonition>

**Example:** If your plan includes 10 branches and you create 2 additional ones that each live for 5 hours beyond your included quota, that’s 10 branch-hours, billed at $0.002/branch-hour = $0.02 total added to your bill.

### Restore history (Instant Restore charges)

Neon supports Instant Restores, also known as point-in-time recovery (PITR). These let you rewind your database to a previous state instantly, which is ideal for fixing bad migrations, user errors, or debugging production incidents.

Instant Restores are optional, and you can select which restore window is more convenient for your use case. Here’s how they’re billed:

- You’re charged $0.20 per GB-month of data changes retained during your restore window.
- This is separate from regular storage. It reflects WAL (write-ahead log) data retained for restores.

<Admonition type="info" title="What counts as data changes?">
Any time your database writes new data or modifies existing data, that activity generates WAL. So: a quiet database = fewer changes = low PITR storage cost. A high-write workload = more changes = higher PITR cost.
</Admonition>

**Example:** If you generate 1 GB of data changes per day and set a 7-day restore window, that’s 7 GB of PITR data = $1.40/month.

You can reduce this cost by shortening your restore window, or eliminate it entirely if you don’t need PITR.

## Explaining the $5 Minimum Spend

On paid plans, Neon enforces a $5/month minimum spend. This isn’t a flat fee or prepayment, it’s just the minimum amount you’ll be billed in any given month. If your usage-based charges (compute, storage, branches, etc.) add up to less than $5, we’ll round your invoice up to $5; if your usage exceeds $5, you’ll pay exactly what you used.

<Admonition type="tip" title="TL;DR">
Your monthly invoice will be $5 or your actual usage, whichever is higher.
</Admonition>

This minimum helps us cover the base cost of keeping your projects online and ready to scale while still keeping our pricing accessible.

## Meet the New Plans

We now offer three plans: Free, Launch, and Scale, with usage-based pricing across the board. This is a summary of how they break down – check out [our pricing page](https://neon.com/pricing) for details.

### Free: Perfect for learning, hacking, and shipping early ideas

Everything you need to start building on Neon, completely free – including:

- 10 projects
- 50 CU-hours/month _(with Neon’s scale-to-zero, this takes you a long way – see below)_
- 0.5 GB storage per project
- 10 branches/project
- 5 GB of egress traffic/month
- Autoscaling up to 2 CU
- Instant Restores that go back up to 6 hours or 1 GB of changes (whichever is smaller)
- 1-day monitoring for UI-level metrics and logs

As part of this pricing update, we’ve also adjusted how compute is allocated. Instead of bundling all your usage into a single account-wide pool, we’re now metering compute usage per project. Each project gets 50 CU-hours/month, meaning you can use up to 500 CU-hours total across 10 projects on the new Free plan.

<Admonition type="important" title="What does 50 CU-hours really mean in practice?">
To give some perspective: **50 CU-hours is enough to run a 0.25 vCPU app for 200 hours/month, enough to stay online during business hours, Monday to Friday.** Since Neon suspends databases after 5 minutes of inactivity, most development and preview branches will consume far less than that.
</Admonition>

And the good news is, if you do need more compute, the Launch plan starts at just $5/month minimum, making it easy to scale up without overcommitting.

### Launch: For teams that need room to grow

Launch is an ideal paid plan for growing projects and early startups that care more about keeping costs low than meeting compliance requirements or production-grade reliability standards.

There’s a $5/month minimum spend, but everything else is fully usage-based:

- Pay-as-you-go compute at $0.14 per CU-hour.
- Pay-as-you-go storage at $0.35 per GB-month
- 10 branches/project included, then $0.002 per branch-hour

You also get extras like:

- Autoscaling up to 16 CU (16 vCPU / 64 GB RAM)
- The possibility to set a 7-day restore window for point-in-time recovery
- 3-day UI metrics/logs retention
- 100 GB/month of egress traffic

### Scale: For the most demanding workloads

Scale is our highest-tier plan, designed for production-grade workloads that require advanced security, availability, and compliance features. Like Launch, Scale is fully usage-based, with all of its additional capabilities included within its $0.26 per CU-hour compute price.

These features reflect the higher operational demands of running mission-critical systems on Neon, and include:

- 1,000 projects (great for [agents](https://neon.com/use-cases/ai-agents) and [platforms](https://neon.com/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases))
- 99.95% SLA-backed uptime
- Private networking and IP allow lists
- Metrics and logs export to Datadog and OTel
- SOC 2 and GDPR compliance
- 14-day UI monitoring window
- Larger compute sizes (up to 56 vCPU, 224 GB RAM)
- 25 branches per project included, with usage-based pricing beyond that
- 30-day Instant Restore window

Rather than bundling these features into a flat monthly fee, we continue to tie costs directly to usage, giving you access to all of Scale’s capabilities exactly when your workload requires them, without overcommitting up front.

## A Pricing Model That Matches the Product

We built Neon fully serverless because we believe in the power and convenience of this architecture. Our infrastructure is dynamic by design, and we thought our pricing had to reflect that.

With this update, we’ve moved away from fixed quotas and pre-packaged plans toward something more flexible and developer-friendly. Instead of choosing a bundle of resources up front, you can now grow usage organically, with a lower barrier to entry ($5/month vs $19).

This makes Neon more accessible at every stage, from hacking on the Free tier to scaling production workloads, with as little friction as possible.

---

## Note to Users

Our new pricing plans are available immediately, but we won’t disrupt your current setup or operations.

**For Free plan users:<br />** If you’re reading this, you’re already on the new Free plan (or will be within a few hours). The new storage limits (0.5 GB per project) will apply right away. The new compute limit of 50 CU-hours per project also applies, but we’ve reset your CU-hour counter today, giving you a fresh 50 CU-hours to use for the rest of the month. This migration happens automatically on our side.

**For paid plan users:<br />** You will not be migrated automatically. You can keep your current plan and rate for now, or switch to one of the new usage-based plans manually from the Neon console at any time (available immediately).

As always, feel free to join us [on Discord](https://discord.gg/92vNTzKDGp) if you have any questions or want to talk to the team directly.
