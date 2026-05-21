---
title: How SMASHSEND Cut Costs by 95% by Moving from RDS to Neon
description: 'Pooling got faster, and now they use branching for every environment'
excerpt: >-
  “We moved from AWS RDS to Neon in literally hours, and the benefits have
  already been massive. Built-in pooling fixed our background job failures,
  branching lets us test safely, and we cut our database bill from $1,500 to $70
  a month” (Jorge Ferreiro, Founder of SMASHSEND) SMASHS...
date: '2025-06-03T16:43:54'
updatedOn: '2025-06-03T17:04:36'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/smashsend-from-rds-to-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: How SMASHSEND Cut Costs by 95% by Moving from RDS to Neon - Neon
  description: >-
    SMASHSEND runs on Postgres, and at first, they picked AWS RDS. But soon
    enough, RDS started introducing some problems.
  keywords: []
  noindex: false
  ogTitle: How SMASHSEND Cut Costs by 95% by Moving from RDS to Neon - Neon
  ogDescription: >-
    SMASHSEND runs on Postgres, and at first, they picked AWS RDS. But soon
    enough, RDS started introducing some problems.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/smashsend-from-rds-to-neon/social.jpg
---

<blockquote>
<p><strong>“We moved from AWS RDS to Neon in literally hours, and the benefits have already been massive. Built-in pooling fixed our background job failures, branching lets us test safely, and we cut our database bill from $1,500 to $70 a month”</strong>  (<a href="https://www.linkedin.com/in/jgferreiro/"><em>Jorge Ferreiro</em></a><em>, Founder of </em><a href="https://smashsend.com/"><em>SMASHSEND</em></a><em>)</em></p>
</blockquote>

[SMASHSEND](https://smashsend.com/) is an AI-powered email marketing platform specialized in helping small and medium-sized businesses grow through effective campaigns. The platform supports both marketing and transactional emails, and it offers a user-friendly, Notion-inspired editor for crafting professional emails without coding. Features include AI-assisted writing, smart segmentation, automation workflows, and seamless integrations via webhooks.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/smashsend-from-rds-to-neon/mockupsendingcampaignsd29edbaa-1024x577-06eebbf9.png" alt="Image" />
<figcaption>Want to see it in action? Scroll to the end of this post</figcaption>
</figure>

## Why RDS wasn’t working

SMASHSEND runs on Postgres, and at first, the team picked AWS RDS to host their database. But soon enough, RDS started introducing some problems:

### The cost didn’t match the usage.

SMASHSEND’s workload is bursty by design. When a customer sends a campaign, traffic spikes; outside of those windows, usage drops to near zero. But RDS doesn’t care about true usage: in RDS, you are renting VMs – it’s cloud Postgres, but not very sophisticated. The SMASHSEND team ended up paying $1,000 to $1,500 every month, even when the database was idle most of the time, which didn’t make much sense.

### High connections kept breaking production.

As more campaigns went out, background jobs started failing. SMASHSEND runs on a serverless infrastructure (more about this later) which would spin up concurrent processes, and each one tried to open a new Postgres connection. Before long, they were hitting limits. They tried the recommended fix, RDS Proxy, but it came with its own issues: it wasn’t publicly exposable, required its own setup, and added even more to the monthly bill.

### Testing environments were expensive to replicate.

SMASHSEND, like any app running Postgres in production, is not only running a single prod DB but also dev and testing environments. The nature of their app demanded schema changes to be tested in realistic environments, but replicating this with RDS required some maintenance – and the only option implied to provision an entirely new instance. It was more configuration, more overhead, and more cost, just to validate a migration or preview a feature.

### Even basic setups were too much work.

RDS wasn’t just expensive: it was in the way. Soon enough, the team started spending time configuring firewalls, managing networking rules, juggling regional instances… For a small team focused on building product, this was an annoyance.

## From frustration to fix: migrating to Neon

<blockquote>
<p><strong>“There’s zero reason to use RDS in 2025. Neon is the most disruptive Postgres database platform out there, and every startup should be using it.” </strong> (<a href="https://www.linkedin.com/in/jgferreiro/"><em>Jorge Ferreiro</em></a><em>, Founder of </em><a href="https://smashsend.com/"><em>SMASHSEND</em></a>)</p>
</blockquote>

### A 3-step migration in ~3 hours

The SMASHSEND team started looking for a Postgres alternative and found [Neon](https://neon.com/), which matched their serverless architecture and their workflows. They followed a straightforward migration plan, and were fully moved over by the end of the afternoon:

1. **Snapshot & import**. They first exported their RDS snapshot and imported it into Neon. It took ~30 minutes.
2. **Flip env vars**. They updated connection strings in Vercel and background workers (~20 minutes)
3. **Dark-launch and monitor**. Finally, they gradually rolled out traffic, starting with 10% behind a feature flag, then moving to 100% once dashboards looked healthy (~2 hours)

### The before and after

After the migration from RDS to Neon, here’s what changed:

- **Costs dropped by more than 95%.** With Neon’s serverless architecture, databases can scale down when idle, saving costs.
- **Performance keeps up with traffic.** When activity increases, Neon automatically scales compute to maintain speed and stability, no overprovisioning required.
- **Connection pooling was built-in.** The moment SMASHSEND switched, their background jobs stopped failing. Neon’s built-in pooling meant no more managing proxies or hitting connection limits.
- **Branching replaced full testing environments.** Every PR now creates an ephemeral Neon branch, which makes it easy to preview schema changes, validate migrations, and catch issues before they reach production.
- **Integrated workflows.** Neon’s integrations with GitHub and Vercel gives the team a tighter feedback loop, helping them catch bugs early.
- **Fits their stack.** SMASHSEND runs on a fully serverless architecture that works perfectly with Neon:
  - Frontend: Vercel
  - Backend: Node.js with Hapi.js
  - Background jobs: Redis and autoscaler clusters
  - ClickHouse for analytics
  - And CircleCI and GitHub Actions for CI/CD

## A better way to run Postgres

If you’re running into similar issues with RDS, [give Neon a try](https://console.neon.tech/signup). Our [free plan](https://neon.com/pricing) makes it easy to explore the platform, and if you need assistance for your migration, [we’re here to help](https://neon.com/contact-sales). We’ve supported many teams in moving with near-zero downtime.

---

Thank you so much to SMASHSEND (previous ZooTools) for sharing their story! Here’s a quick tutorial of their platform:

<YoutubeIframe embedId="KKz4t2zeUC4" isDocPost={false} />
