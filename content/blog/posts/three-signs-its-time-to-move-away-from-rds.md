---
title: Three Signs It’s Time To Move Away From AWS RDS
description: 'If you see these bottlenecks, run'
excerpt: >-
  Amazon RDS has long been the default choice for hosting Postgres in AWS. Its
  reliability makes it a solid pick for many teams—but as workloads evolve, RDS
  can start becoming a serious bottleneck. Spotting the signs early can save
  your team time, money, and headaches. Signs of dan...
date: '2024-12-23T17:11:07'
updatedOn: '2025-01-09T01:17:34'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/three-signs-its-time-to-move-away-from-rds/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Three Signs It’s Time To Move Away From AWS RDS - Neon
  description: >-
    As your use case evolves, RDS can start become a bottleneck. Spotting the
    signs early can save you time, money, and headaches.
  keywords: []
  noindex: false
  ogTitle: Three Signs It’s Time To Move Away From AWS RDS - Neon
  ogDescription: >-
    As your use case evolves, RDS can start become a bottleneck. Spotting the
    signs early can save you time, money, and headaches.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/three-signs-its-time-to-move-away-from-rds/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/three-signs-its-time-to-move-away-from-rds/neon-move-away-1-1024x576-1d139eb0.jpg)

[Amazon RDS](https://aws.amazon.com/rds/postgresql/) has long been the default choice for hosting Postgres in AWS. Its reliability makes it a solid pick for many teams—but as workloads evolve, RDS can start becoming a serious bottleneck. Spotting the signs early can save your team time, money, and headaches.

## Signs of danger in RDS

### Sign 1: You’re spending too much time in the RDS dashboard

At first, managing RDS instances might feel manageable—something you can easily handle alongside your other tasks. But as your project grows and you onboard more engineers, you might find yourself spending more and more time battling with AWS, particularly:

- **Scaling feels manual and disruptive**. You’re planning downtime or re-provisioning instances every time workloads change.
- **Non-prod environments are messy**. You’re juggling exports, imports, and scripts to keep your dev, staging, and test environments consistent.
- **You’re auditing your deployment for inefficiencies**. Your bill looks higher than it should, so you end up analyzing your increasingly complex deployment to find optimization opportunities.

### Sign 2: Your RDS metrics show you’re overpaying

So yeah, auditing time. You log into the AWS console and check Performance Insights to see how your instances are performing. What you see:

- **Compute usage is low**. You have large machines provisioned, but your instances rarely (if ever) hit peak capacity.
- **Storage is wasted**. The majority of instances have more than 50% of their storage sitting idle—e.g., you’ve provisioned a 2 TB volume, but your current database size is only 800 GB.
- **You’re forgetting to manually pause non-prod instances**. Your dev, test, and staging environments are only used for a few hours, but they stay on 24/7.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/three-signs-its-time-to-move-away-from-rds/screenshot-2025-01-08-at-51118percente2percent80percentafpm-1024x388-f6fadccc.png" alt="Image" />
<figcaption>Typical CPU utilization pattern in a production database in RDS. Traffic peaks once per day up to 60% capacity, going down to 10% capacity for the rest of the day. Based on a real use case.</figcaption>
</figure>

### Sign 3: Your production instance is a ticking time bomb

This sign is the scariest. You’ve got a single, big production instance—e.g. a database hosting data for thousands of customers—and it’s starting to feel _too large_. You can’t see the end of this as you scale:

- **Scaling means bigger machines**. Adding more customers means provisioning increasingly larger compute and storage instances. The inefficiencies you’re already seeing in underutilized resources will only get worse. It’ll be hard to escape from these high bills, even if usage fluctuates or drops.
- **Compliance is getting harder to maintain**. With so much data centralized in a single instance, meeting security and compliance requirements across regions is becoming very stressful.
- **Restores are slow (and nerve-wracking)**. If you ever need to restore data or perform a point-in-time recovery for a customer, the size and complexity of your instance means waiting hours—or longer—for the process to complete safely.

## What to do?

There are different [hacks](https://aws.amazon.com/blogs/database/optimizing-costs-in-amazon-rds/) you could try to address these RDS bottlenecks in the short term, but there’s also the possibility of trying another Postgres database, moving some of your workloads there, and fixing things once and for all. [Neon](https://neon.tech/home) is one of your options. [Hundreds of teams](https://neon.tech/case-studies) have moved from RDS to Neon to solve these problems—here’s how it helps:

### Use branching for your ephemeral environments

Neon’s [database branching](https://neon.tech/flow) eliminates the need for syncing seed data or managing multiple [dev and test environments](https://neon.tech/use-cases/dev-test) manually. You can spin up isolated branches in seconds, perfectly mirroring production, and tear them down just as quickly. This saves time and enables you to automate everything via CI/CD using the [Neon API](https://neon.tech/docs/reference/api-reference).

<blockquote>
<p>“Neon’s branching paradigm has been great for us. It lets us create isolated environments without having to move huge amounts of data around. This has lightened the load on our ops team, now it’s effortless to spin up entire environments.” <em>Jonathan Reyes, Principal Engineer at Dispatch – </em><a href="https://neon.tech/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora">Read case study</a></p>
</blockquote>

<blockquote>
<p>“Developers already face significant delays when working on a PR—running CI tests, ensuring everything is ready for preview, it all adds up. Time to launch is crucial for us: when we tried Neon and saw that spinning up a new branch takes seconds, we were blown away” – <em>Alex Co, Head of Platform Engineering at Mindvalley – </em><a href="https://neon.tech/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches">Read case study</a></p>
</blockquote>

### Implement autoscaling for storage and compute

Neon’s [serverless architecture](https://neon.tech/docs/introduction/serverless) scales storage and compute independently based on actual usage. Dev, test, and staging environments are automatically paused when they’re not being used, without you needing to remember. Your production database automatically [gets more CPU and memory when traffic or requests increase](https://neon.tech/docs/introduction/autoscaling) and scales down when the extra compute is no longer needed. Same for storage—you’re not locked into a storage volume.

<blockquote>
<p>“Instead of having to overprovision our servers to handle peak loads, which leads to inefficiencies and higher costs, Neon’s autoscaling handles it. We get more performance when we need it” – <em>Julian Benegas, CEO of BaseHub</em> – <a href="https://neon.tech/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database">Read case study</a></p>
</blockquote>

<blockquote>
<p>“Neon perfectly meets our needs for a Postgres solution that scales with demand. We can push the boundaries of what’s possible in our projects without compromising efficiency or costs” –<em> Technical Director at White Widget</em> – <a href="https://neon.tech/blog/white-widgets-secret-to-scalable-postgres-neon">Read case study</a></p>
</blockquote>

### Cover yourself for multitenancy

Neon supports a [database-per-user multi-tenant architecture,](https://neon.tech/docs/use-cases/database-per-user) where each user or tenant can have their own Neon project. A “project” in Neon is equivalent to an instance in terms of isolation but is much easier to manage—[a single engineer can manage a fleet with hundreds of thousands of projects](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases). This approach doesn’t require large machines and reduces risks by isolating workloads. It also simplifies compliance and makes point-in-time restores [effortless](https://neon.tech/docs/guides/branch-restore), even for large datasets.

<blockquote>
<p>“Our customers require their data to live in an isolated database, but implementing this in RDS was cumbersome and expensive. We switched over to Neon to reduce costs and operational overhead” – <em>Joey Teunissen, CTO at OpusFlow</em> – <a href="https://neon.tech/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers">Read case study</a></p>
</blockquote>

<blockquote>
<p>“We’ve been able to automate virtually all database management tasks via the Neon API. This saved us a tremendous amount of time and engineering effort. Neon allows us to offer dedicated databases to our customers without worrying about the cost of idle resources” – <em>Himanshu Bhandoh, Software Engineer at Retool</em> –<a href="https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases"> Read case study</a></p>
</blockquote>

---

Neon has a [Free Plan](https://neon.tech/pricing). [Get started right away](https://console.neon.tech/signup) and experiment.

<Admonition type="tip" title="Neon vs RDS: FAQ">
If you're interested in a detailed comparison of Neon vs RDS, check out [neon.tech/rds](https://neon.tech/rds).
</Admonition>
