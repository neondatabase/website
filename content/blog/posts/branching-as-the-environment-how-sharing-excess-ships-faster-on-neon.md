---
title: 'Branching as the Environment: How Sharing Excess Ships Faster on Neon'
description: >-
  Sharing Excess’s three-person development team routes perishable food at a
  national scale and ships faster with Neon branching, production-like test
  data, and scale-to-zero.
excerpt: >-
  “For a small team, branching and scale-to-zero just make our lives markedly
  easier. We’re able to use real data without risky scripts touching production,
  and we don’t pay overnight for what we don’t use.” — Ryan McHenry, Head of
  Technology, Sharing Excess What is Sharing Excess?...
date: '2025-10-23T17:49:17'
updatedOn: '2025-10-24T23:37:10'
category: case-study
categories:
  - case-study
authors:
  - taraneh-dohmer
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/branching-as-the-environment-how-sharing-excess-ships-faster-on-neon/cover.jpg
  alt: sharing excess case study
isFeatured: false
seo:
  title: 'Branching as the Environment: How Sharing Excess Ships Faster on Neon - Neon'
  description: >-
    Sharing Excess’s lean three-person dev team routes perishable food
    nationwide faster and safer using Neon’s branching, production-like test
    data, and scale-to-zero capabilities.
  keywords: []
  noindex: false
  ogTitle: 'Branching as the Environment: How Sharing Excess Ships Faster on Neon - Neon'
  ogDescription: >-
    Sharing Excess’s lean three-person dev team routes perishable food
    nationwide faster and safer using Neon’s branching, production-like test
    data, and scale-to-zero capabilities.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/branching-as-the-environment-how-sharing-excess-ships-faster-on-neon/social.jpg
---

<blockquote>
<p><em>“For a small team, branching and scale-to-zero just make our lives markedly easier. We’re able to use real data without risky scripts touching production, and we don’t pay overnight for what we don’t use.” </em><br></br>— Ryan McHenry, Head of Technology, Sharing Excess</p>
</blockquote>

## What is Sharing Excess?

In the United States, nearly 40% of food goes to waste while 47 million Americans go hungry. [Sharing Excess](https://www.sharingexcess.com/) is a nonprofit food-rescue organization that redirects surplus food from retailers, wholesale markets, and farms to community hunger relief organizations. Their mission is to build a more sustainable and equitable food system that helps reduce waste and feed communities.

![Image](https://cdn.neonapi.io/public/images/pages/blog/branching-as-the-environment-how-sharing-excess-ships-faster-on-neon/scheme-3-1024x458-073f5e60.jpg)

The work is a real-time logistics challenge. Perishable cargo, often in pallets and truckloads, must be split and routed daily across a network of 1,800+ vendors. For example, 30 bins of watermelons (weighing thousands of pounds) from a single pickup must be distributed to multiple partners because no single site can absorb it all. Accuracy and speed are everything.<br />

## Engineering at Sharing Excess: Team, Stack and Workflow

Sharing Excess runs a deliberately lean engineering organization: a three-person core team ( engineers and analysts) led by Head of Technology Ryan McHenry, with additional support from co-op interns and community volunteers. The team maintains guardrails like point-in-time restore (PITR) and daily pg_dump backups while focusing most cycles on shipping products.

- **Language:** Typescript (front + backend)
- **Repos & apps:** Monorepo structure using Bun Workspaces with separate client and server apps, as well as packages for db, types/schemas, ui
- **Frontend:** React 18, built with Vite + VitePWA (installable/offline); Chakra UI; Clerk for auth; Tanstack Query, Form + Store, Mapbox, deployed on **Railway**
- **Backend: Bun/TypeScript** with a Hono API
- **Database:** Postgres on Neon with **Drizzle ORM** (schema & connection management)
- **Auth:** Clerk
- **Typing/Validation:** Zod
- **Tooling/Visualization: Retool** (external data visualizations)
- **Analytics + Error Management:** Sentry, Mixpanel, APITally
- **AI + LLM Services:** Anthropic
- **Infrastructure/Hosting:** **Dockerized** setup on **Railway**

![Image](https://cdn.neonapi.io/public/images/pages/blog/branching-as-the-environment-how-sharing-excess-ships-faster-on-neon/image-5-1024x607-17808dd6.png)

## Platform Architecture

Sharing Excess’s platform consists of data systems, services, and web/mobile clients that coordinate food rescue nationwide, 24/7. Each environment (production, staging, and per-developer) connects to its corresponding Neon branch for predictable end-to-end behavior. Learn more about it [here](https://github.com/sharingexcess).<br />

![Image](https://cdn.neonapi.io/public/images/pages/blog/branching-as-the-environment-how-sharing-excess-ships-faster-on-neon/diagram-v2-1024x705-5a8fd2b3.jpg)

## Why Sharing Excess Migrated to Neon

After outgrowing Firebase’s NoSQL model, Sharing Excess needed more powerful querying, realistic dev/test environments, and simpler operations. Here’s what Sharing Excess had to say about their switch to Neon:

- **Unopinionated, low-maintenance Postgres.** Neon lets Sharing Excess choose their app layer (Hono, Drizzle, Clerk) while Neon manages the database. Industry standard PostgreSQL makes interoperability with additional tools + services easy and thoughtless.<br />
- **Environment parity with branch-per-environment.** Each application environment (per team member development branches, staging, production) connects to its matching database branch, so staging and development mirror production without reconfiguration.<br />
- **Realistic testing and safe collaboration with production-like, anonymized data.** Branches reset from production and run through on-demand anonymization for easy access in local development.<br />
- **Operational rigor without toil via built-in guardrails.** PITR and history, plus daily pg_dump backups, keep confidence high and data-loss risk mitigated.<br />
- **Spend aligned to usage with scale-to-zero.** Idle branches scale down outside operating hours, cutting costs and allow the team to optimize their workflows, not their invoices.

## Database Branching Workflow

<blockquote>
<p><em>“The feature that will truly keep me attached to Neon is branching. We can reset from the parent branch at any point, which lets us work with up-to-date data as we develop new features . When you’re working in a real-time logistics environment, that makes all the difference in catching bugs before they ship.”</em><em><br></br></em>— Ryan McHenry, Head of Technology, Sharing Excess</p>
</blockquote>

Neon branching reshapes Sharing Excess’s development workflow in three key ways:

1. **Dev/Test with realistic environments**
2. **Clean, automated release flow branching**
3. **Create production-like data with anonymization**

### Dev/Test with Realistic Environments

Neon branching enables a production branch, a staging branch, and individual child branches for each active developer. Everyone works with up-to-date, production-like data, which prevents bugs and keeps test behavior close to production.

### Clean, Automated Release Flow Branching

Branching also significantly lowers operational overhead. GitHub **feature → staging → production** merges map **one-to-one** to Neon branches and environments. Each stage connects to the correct database without manual reconfiguration, reducing deployment mistakes and shortening the path from code merge to realistic integration testing.

### Create Production-like Data with Anonymization

Sharing Excess combines Neon branching with an in-house anonymization process, enabling safe sharing with external collaborators while protecting sensitive data.

<blockquote>
<p><em>“Neon branching is game-changing for how we work. Our workflow is built around clean, simple, and well-synchronized production, staging, and development branches. Neon branching makes it just so much simpler to manage our devops without writing complicated scripts or risking production data.”</em><strong><em><br></br></em></strong>— Ryan McHenry, Head of Technology, Sharing Excess</p>
</blockquote>

## Neon Cuts Development Time and Costs for Small Teams

Neon helps Sharing Excess focus their operational effort where it matters most. With a branch-per-environment Postgres workflow, PITR, and managed scaling, the team spends less time on routine database maintenance without compromising operational standards. Developers test against up-to-date, production-like datasets and safely share anonymized copies with collaborators. And because scale-to-zero reduces idle costs, more of every dollar goes to rescuing perishable food.

You can learn more about Sharing Excess’s mission and their amazing projects on [their website](https://www.sharingexcess.com/). Should it resonate with you, consider supporting Sharing Excess by [donating or volunteering](https://www.sharingexcess.com/get-involved).
