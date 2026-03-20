---
title: 'From Heroku to Neon: The dev.to Story'
description: Serverless Postgres for a platform used by millions
excerpt: >-
  “We didn’t just want a better Postgres database, we wanted a partner who
  shared our focus on developers. With Neon, we finally have a setup that scales
  with our platform and our values.” (Peter Frank, DEV Co-Founder) DEV needs no
  introduction. For millions of developers getting s...
date: '2025-06-19T16:04:37'
updatedOn: '2025-06-19T23:20:05'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/dev-from-heroku-to-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'From Heroku to Neon: The dev.to Story - Neon'
  description: >-
    Millions of developers visit dev.to daily - now running on Neon. Here’s why
    they left Heroku and how we’re supporting devs together.
  keywords: []
  noindex: false
  ogTitle: 'From Heroku to Neon: The dev.to Story - Neon'
  ogDescription: >-
    Millions of developers visit dev.to daily - now running on Neon. Here’s why
    they left Heroku and how we’re supporting devs together.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/dev-from-heroku-to-neon/social.png
source:
  wpId: 10064
  wpSlug: dev-from-heroku-to-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/dev-from-heroku-to-neon/neon-from-heroku-1-1024x576-0a79df39.jpg)

> **“We didn’t just want a better Postgres database, we wanted a partner who shared our focus on developers. With Neon, we finally have a setup that scales with our platform and our values.”** (Peter Frank, [DEV](https://dev.to/) Co-Founder)

[DEV](https://dev.to/) needs no introduction. For millions of developers getting started with programming, [dev.to](https://dev.to/) is their town square. With over 3 million registered users, ~500k daily pageviews, and 500+ new community articles and discussions published daily, the DEV community serves a global audience with tutorials, product announcements, in-depth technical discussions, career advice, and more.

Behind the scenes, this means handling a constantly growing database workload with user accounts, reactions, comments, page views, editorial tools, partner integrations…

All of it runs on Postgres. It started on Heroku, now it’s powered by Neon.

## Why Heroku Wasn’t Enough

Heroku Postgres was a reliable backend for the early days of DEV, but as the platform scaled to millions of users, they began looking for a service that better fit their needs.

The biggest issue was rigidity. Heroku’s scaling model made it hard to adjust resources cleanly or predictably – the DEV team was paying for unused capacity across the board, and there was no easy way to right-size compute independently from storage or to scale read replicas on demand.

> **“Our Heroku bill was thousands of dollars a month, and we knew this bill was inflated. We either had too many or too few resources allocated to our database, and adjustments typically were a big project with downtime”** (Ben Halpern, [DEV](https://dev.to/) Co-Founder)

Heroku’s rigidity translated into:

- Heavy instances for modest workloads – aka, high bills
- Limited replica options, with no ability to pause or scale dynamically
- Operational overhead – setting up follower databases for analytics or experimentation required effort
- Lost engineering time

As DEV’s needs evolved, it became clear that Heroku’s serverful model was holding them back. They needed more control and a better developer experience.

## Finding Neon

The team started looking for a new Postgres provider that could support their scale and that aligned with how they wanted to build. They looked at _all the options_, from enterprise-focused platforms to developer-centric tools. Neon stood out immediately.

> **“What first attracted us to Neon was the efficient scaling, it solved our core issues right away. But what kept us interested were all the thoughtful developer-experience wins. You just don’t see that from general-purpose cloud Postgres providers.”** (Ben Halpern, [DEV](https://dev.to/) Co-Founder)

### Serverless Postgres with autoscaling (no overprovisioning)

The immediate win was how Neon eliminated the need to overprovision. With Neon, there are no instance sizes – instead, [Neon is serverless:](https://neon.tech/docs/get-started-with-neon/why-neon) CPU, memory, connections, and storage scale up and down with actual usage and responding to [highly performant algorithms](https://neon.tech/docs/guides/autoscaling-algorithm).

Capacity spikes? Neon handles it. Quiet periods? Neon scales down automatically. No manual resizing, no guessing at tiers, no paying for “just in case.” It’s that simple.

### Built for developers, not DBAs

Neon is Postgres for developers. DEV valued this focus on DX right away: Neon’s intuitive UI and [API-first approach](https://neon.tech/blog/provision-postgres-neon-api) that made it easy to automate database operations, [branches](https://neon.tech/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) could be created and torn down programmatically, they were integrations with platforms like [Vercel](https://neon.tech/blog/neon-vercel-integration) – making full-stack previews as simple as opening a pull request.

And just like DEV, Neon was accessible by design. There’s a generous free plan, no onboarding friction, and no vendor lock-in. Just fast, flexible Postgres, built to match the way modern developers work.

> **“There was this magic moment with Neon. We could just offer a path for our community members to spin up a serverless Postgres database in seconds. No infra setup, no complications, no sales process – just start building.”** (Peter Frank, [DEV](https://dev.to/) Co-Founder)

### Lightweight read replicas that just work

The DEV team had experimented with read replicas on Heroku, but every replica was a full instance – expensive to maintain and hard to justify when the bill came.

Neon’s [replicas](https://neon.tech/docs/guides/read-replica-guide) are fundamentally different. Spinning up a replica doesn’t mean duplicating your whole environment; instead, Neon can launch additional compute nodes that read from the same underlying storage, making it simple to offload read-heavy workloads without the cost and complexity of provisioning full clones.

The DEV team can now launch lightweight, read-only replicas for analytics or internal automation without any overhead in maintenance or costs. They’re connecting tools like [Metabase](https://www.metabase.com/) and their in-house workflow automation scripts to these replicas, with plans to do more over time.

### Real data, real resting

> **“We plan to make much more flexible use of multiple environments for testing against real data. That’s something Neon makes significantly easier.”** (Ben Halpern, [DEV](https://dev.to/) Co-Founder)

DEV’s architecture is a Ruby on Rails app deeply integrated with Postgres via ActiveRecord. Their main database stores most of the platform’s application logic and state – prod was 1.2TB at the moment of migration and it’s growing steadily.

With such a large dataset, Neon’s [branching model](https://neon.com/flow) offers a major advantage over conventional setups like Heroku. Instead of provisioning separate database instances for staging or QA (and constantly working to keep them in sync), [branches](https://neon.com/docs/introduction/branching#what-is-a-branch) in Neon act like lightweight clones of your production data.

Branches share the same underlying storage but operate in isolated compute environments, so you can spin up dev, testing or preview environments in seconds, with no duplication or overhead. And because branches can be created and torn down programmatically, they fit naturally into [modern CI/CD workflows](https://neon.com/docs/get-started-with-neon/workflow-primer).

## More Than a Migration: A Developer-First Partnership

> **“We didn’t just want a better database: we wanted a partner who shared our focus on developers.”** (Peter Frank, [DEV](https://dev.to/) Co-Founder)

This developer focus was in full alignment with DEV’s ethos, and it laid the foundation for a perfect synergy. What began as a technical migration quickly became a deeper collaboration, with the two teams started collaborating regularly on shared content and campaigns to educate and empower developers, together with special offers.

Speaking of…<br />

<Admonition type="tip" title="Deal for DEV Members">
If you’re exploring Neon for the first time, [sign up with this link](https://console.neon.tech/app/?promo=OZHcuQtJHCLlOMhpi3YeZasOF) and receive **$100 in Neon credits**. And if you’re already part of the DEV community, check out the [DEV++](https://dev.to/++) deals for exclusive perks, including extra Neon credits and member-only resources.
</Admonition>

## Looking Ahead

Like many others, DEV grew frustrated with the waste and rigidity of serverful architectures. When they found Neon, they didn’t just switch database providers – they entered a partnership built on a shared belief: that developers deserve Postgres infrastructure that’s efficient, modern, and built for how software gets made today.

Whether you’re scaling a production app or hacking on a side project, Neon makes it easy to get started with Postgres. [Sign up to Free plan](https://console.neon.tech/signup) and start building right away, or [reach out to our team](https://neon.tech/contact-sales) if you (like DEV) are exploring leaner Postgres solutions for your business.
