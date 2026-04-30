---
title: How Zite Provisions Isolated Postgres Databases for Every User
description: 'Lessons from running Zite Database, powered by Neon'
excerpt: >-
  “We were getting ready to hire dedicated engineers just to manage and scale
  Zite Database. With Neon, we didn’t need to do that – we were able to give
  every end user their own database, including on the free plan” (Dominic Whyte,
  Co-founder at Zite) Zite is an AI-native app build...
date: '2026-02-06T20:56:25'
updatedOn: '2026-02-25T07:22:07'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-zite-provisions-isolated-postgres-databases-for-every-user/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Zite Provisions Isolated Postgres Databases for Every User - Neon
  description: >-
    Zite gives every end user a dedicated Postgres database, even on their free
    plan. Learn how they built Zite Database with Neon.
  keywords: []
  noindex: false
  ogTitle: How Zite Provisions Isolated Postgres Databases for Every User - Neon
  ogDescription: >-
    Zite gives every end user a dedicated Postgres database, even on their free
    plan. Learn how they built Zite Database with Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-zite-provisions-isolated-postgres-databases-for-every-user/social.jpg
source:
  wpId: 12349
  wpSlug: how-zite-provisions-isolated-postgres-databases-for-every-user
  exportedAt: '2026-03-20T13:31:00.745Z'
---

> **“We were getting ready to hire dedicated engineers just to manage and scale Zite Database. With Neon, we didn’t need to do that – we were able to give every end user their own database, including on the free plan”**<br /><br />([Dominic Whyte](https://www.linkedin.com/in/dominicwhyte/), Co-founder at [Zite](https://www.zite.com/))

[Zite](https://www.zite.com/) is an AI-native app builder for the kind of internal and external tools that simplify daily tasks for business teams, from [dashboards](https://www.zite.com/marketplace/categories/dashboards) to [CRMs](https://www.zite.com/marketplace/categories/internal-tools) to [AI apps](https://www.zite.com/marketplace/categories/ai-apps). It is built by the team behind [Fillout](https://www.fillout.com/), a product used by tens of thousands of teams every week to collect and work with data.

<BlogQuote quote="“We were getting ready to hire dedicated engineers just to manage and scale Zite Database. With Neon, we didn’t need to do that - we were able to give every end user their own database, including on the free plan ”" author="Dominic Whyte" role="Co-founder at Zite" photo="https://cdn.neonapi.io/public/images/pages/blog/how-zite-provisions-isolated-postgres-databases-for-every-user/1641046185221-150x150-92eeb984.jpeg" />

<video autoPlay muted loop width="2474" height="2130">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/how-zite-provisions-isolated-postgres-databases-for-every-user/zite-homepage-8f6010ac.mov" />
</video>

The core principle behind Zite is to help teams turn ideas into truly operational software. Apps come with a built-in backend database, workflows for business logic, and user management with permissions handled out of the box; non-technical subject-matter experts can describe what they want to build, and the platform takes care of the infrastructure needed to run it reliably.

They also have a [handy marketplace with templates](https://www.zite.com/marketplace) you can explore for inspiration:

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-zite-provisions-isolated-postgres-databases-for-every-user/screenshot-2026-02-03-at-55632-pm-1024x824-3f2fc957.png" alt="Image" />
<figcaption>Take a look: zite.com/marketplace</figcaption>
</figure>

## Live apps need a Postgres database

Even before Zite launched, the original Fillout team was already aware of the need for adding a database as a first-class product in the stack. Fillout users were already collecting structured information every day, e.g. responses flowing into tables, powering workflows, and feeding downstream tools; and as teams started building more complex applications, the limits of relying on a hidden storage layer became obvious.

With the launch of Zite, those needs became even more pronounced. Zite users weren’t just collecting data: they were now building full business applications, and those apps needed a database underneath it.

So the team decided it was time to make the database itself a first-class part of the product. They built [Zite Database](https://www.zite.com/database), a managed database tightly integrated within Zite’s forms and app builder. Users could now create tables, work with millions of rows, and use the database as the foundation for dashboards and custom applications – all without having to set any infrastructure up themselves or worry about scaling.

<video autoPlay muted loop width="1280" height="716">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/how-zite-provisions-isolated-postgres-databases-for-every-user/zite-database-web-71ad6655.mp4" />
</video>

## But a shared storage layer breaks at scale

> **“We first considered running Zite Database on a large, shared Postgres database in RDS, but it quickly became clear that this wasn’t an ideal long-term solution”**<br /><br />([Dominic Whyte](https://www.linkedin.com/in/dominicwhyte/), Co-founder at [Zite](https://www.zite.com/))

The initial architecture for Zite Database initially involved a single large Postgres database hosted on AWS RDS, with customer data logically sharded across organizations. But the limits of a shared database became increasingly apparent, especially as adoption took off:

- **Noisy neighbors became inevitable.** Some Zite customers were building lightweight apps, while others were sending thousands of requests per second.
- **Performance was hard to optimize.** A single database had to serve wildly different usage patterns, making performance tuning difficult.
- **Isolation was complex.** While data was separated logically, performance and reliability guarantees were still shared.
- **Scaling = operational work.** Growing usage required constant monitoring, tuning, and capacity planning.

## Rethinking the architecture: deploying databases-per-user via Neon

The team began to rethink the architecture from first principles. Instead of asking how to safely pack more customers into the same database, they flipped the question: what if every customer had their own isolated database?

On paper, that sounds expensive and operationally heavy – but this is where [Neon](https://neon.com/) enters the picture.

Neon is a serverless Postgres database with a [unique shape](https://neon.com/docs/get-started/dev-experience) that makes it particularly well suited for [powering in-app and embedded database products](https://neon.com/platforms), like Zite Database. Rather than treating databases as heavy, monolithic infrastructure, Neon makes them [lightweight and programmable](https://neon.com/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases), allowing APIs to spin them up and manage them automatically.

- **Instant provisioning.** Neon databases can be created in seconds, making it possible to give every organization a dedicated Postgres database the moment they create their first one.
- **API-first.** Platforms like Zite can treat the database as part of the product flow rather than a manually operated service.
- **Usage-based pricing.** Costs scale with real usage instead of pre-allocated capacity, making it economically viable to deploy many isolated databases.
- **Scale-to-zero** Databases that aren’t actively used don’t consume compute, which is critical when running a large fleet with a free plan.

Neon’s model allowed Zite to fully embrace a per-customer database architecture without introducing additional operational burden – in fact, it reduced it. They simply integrated Neon into their platform: Zite uses [Neon’s TypeScript API](https://neon.com/docs/reference/typescript-sdk) client to provision and manage databases directly from their application code. They didn’t have to build custom abstractions or infrastructure tooling.

> **“Because Neon is usage-based and can scale down databases when they aren’t being used, we’re able to deploy thousands of new databases per day without costs getting out of hand”**<br /><br />([Dominic Whyte](https://www.linkedin.com/in/dominicwhyte/), Co-founder at [Zite](https://www.zite.com/))

## Build your product on databases, not around them

By rethinking its database architecture, Zite turned what could have been an operational bottleneck into a core product advantage. Deploying and managing Zite Databases stopped being something the team had to worry about and they could fully focus on providing a great end-user experience. Get a first-hand taste of how it looks by [creating a free Zite account](https://build.fillout.com/signup?redirectPath=%2Fhome%2Fzite%2Fnew) and building your first apps running on Zite Database.

<Admonition type="tip" title="Offer Postgres to your users">
If you’re also building a platform, agent, or product that needs to provision databases programmatically, Neon makes it possible to deploy and manage large fleets of isolated Postgres databases even with small teams and budgets. [Try it on our Free plan](https://console.neon.tech/signup) - it gives you 100 isolated projects to [prove your PoC](https://neon.com/docs/guides/platform-integration-overview#embedded-postgres-integration).
</Admonition>
