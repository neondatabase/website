---
title: 'Databuddy Is Open-Sourcing Privacy-First Analytics, Built on Neon'
description: 'A clean, open stack for analytics'
excerpt: >-
  “I was surprised by how fast Neon was. It was faster than my self-hosted setup
  and Prisma Postgres. This plus the convenience of the Free Plan makes it a
  no-brainer for building your projects.” (Issa Nassar, founder of Databuddy)
  Databuddy is a new privacy-first web and product a...
date: '2025-08-28T15:50:25'
updatedOn: '2025-08-28T15:50:26'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Databuddy Is Open-Sourcing Privacy-First Analytics, Built on Neon - Neon'
  description: >-
    Databuddy is a new privacy-first web and product analytics platform that
    balances power and simplicity. It's open-source and built on Neon.
  keywords: []
  noindex: false
  ogTitle: 'Databuddy Is Open-Sourcing Privacy-First Analytics, Built on Neon - Neon'
  ogDescription: >-
    Databuddy is a new privacy-first web and product analytics platform that
    balances power and simplicity. It's open-source and built on Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/social.jpg
---

<figure className="wp-block-image size-large">
<img loading="lazy" decoding="async" width="1024" height="576" src="https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-1024x576-3d49c950.jpg" alt="" srcset="https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-1024x576-3d49c950.jpg 1024w, https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-300x169-817f2505.jpg 300w, https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-768x432-5e032c0b.jpg 768w, https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-1536x864-0be1fef4.jpg 1536w, https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-2048x1152-8a3b899a.jpg 2048w, https://cdn.neonapi.io/public/images/pages/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon/neon-databuddy-288x162-617aec8f.jpg 288w" sizes="auto, (max-width: 1024px) 100vw, 1024px" />
</figure>

<blockquote>
<p><strong>“I was surprised by how fast Neon was. It was faster than my self-hosted setup and Prisma Postgres. This plus the convenience of the Free Plan makes it a no-brainer for building your projects.” </strong>(Issa Nassar, founder of <a href="https://www.databuddy.cc/">Databuddy</a>)</p>
</blockquote>

[Databuddy](https://www.databuddy.cc/) is a new privacy-first web and product analytics platform that strikes the perfect balance between power and simplicity. Inspired by tools like Plausible and PostHog, it’s built to be more developer-friendly and fully open source, solving a common dilemma for small teams choosing analytics tools – everything feels either too simple or too complex. Databuddy aims to get it just right. [You can use it for free via their Free Plan.](https://app.databuddy.cc/login)

<figure className="wp-block-image">
<img decoding="async" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf0yplFZJEbAgB2QdGQttE6y9ZqPEBKxc5Gh-mhgsM6SaSrV6RoDkfxyOfY8eVsbMGZwh815XQtj4cfAJF2TdXMf9PEdwf6qoBcI9U_qBXLZX0W-iuT1QVQIe0hjr9kZwGVJ6JC8w?key=9fWMmabqD6-hJRANxikHUw" alt=""/>
<figcaption className="wp-element-caption">Try it out at https://www.databuddy.cc/</figcaption>
</figure>

## Building on Neon: Top Postgres Performance Without the Hassle

<blockquote>
<p><strong>“I’ve been through the pain of self-hosting: setting everything up, tuning PgBouncer, dealing with connection limits. Neon gives me great performance without the maintenance” </strong>(<a href="https://x.com/izadoesdev">Issa Nassar</a>, founder of <a href="https://www.databuddy.cc/">Databuddy</a>)</p>
</blockquote>

Issa first got familiar with [Neon](https://neon.com/) during a hackathon project, loving how easy it was to spin up multiple projects under the [Free Plan](https://neon.com/pricing). When it came time to build Databuddy, he also explored many Postgres options, including Supabase and Prisma Postgres. But here’s what made the difference in Neon’s favor:

- **Composable stack.** Tools like Supabase are experts in bundling multiple tools into a vertically integrated stack, while Neon’s main focus is to do one thing well (serverless Postgres) and to stay as composable as possible. That philosophy aligns with how Issa approaches his stack.
- **Simplicity.** Issa had experience running Postgres himself: provisioning machines, wiring in PgBouncer for connection pooling, managing daily backups. With Neon, all of that just worked out of the box.
- **Performance.** Neon wasn’t just easy to use – it was fast. Issa was surprised to find that Neon even outperformed his own self-hosted Postgres setup. It’s possible this might have come down to a misconfiguration, but that’s the benefit of Neon: you don’t have to debug it, it just works.

<Admonition type="tip" title="Databuddy is a now member of the Neon Open Source Program">
We sponsor promising open source projects that start on our Free Plan, increasing their resource limits and helping them grow. If you’re building in public, scaling, and could use a little headroom, apply [here](https://forms.gle/nP9FQ3jKe7t1NPgu9).
</Admonition>

## Databuddy’s Architecture And Tech Stack

_You can check out all of Databuddy’s code_ [in this repo.](https://github.com/databuddy-analytics/Databuddy)

Let’s take a closer look at Databuddy’s composable stack:

- **Frontend:** Built with Next.js, styled with Tailwind CSS, and powered by Bun for blazing-fast builds and dev workflow.
- **API layer:** A self-hosted backend using Elysia and tRPC.
- **ORM:** Drizzle handles all database interactions with Neon, using pooled connections for performance and efficiency.
- **Database layer:**
  - Neon stores all structured metadata and takes care of the low-latency relational operations.
  - ClickHouse stores raw events and analytics data at scale, taking care of the heavy analytical queries.
- **Auth & routing logic:** Every tracked website is assigned a unique website_id. Incoming events are first verified against Neon to confirm ownership and then passed on to ClickHouse.
- **Dev tooling:** Bun drives the entire workflow – compilation, testing, database migrations, SDK builds, even running in the docker containers

<blockquote>
<p><strong>“This is a really simple setup that works. Neon handles the transactional side, ClickHouse handles the heavy lifting, and I get to choose exactly how everything else fits together” </strong> (<a href="https://x.com/izadoesdev">Issa Nassar</a>, founder of <a href="https://www.databuddy.cc/">Databuddy</a>)</p>
</blockquote>

## Start Building

[Databuddy](https://www.databuddy.cc/) is open source and growing fast. Give the project a ⭐️ on [GitHub](https://github.com/databuddy-analytics/Databuddy), follow [@izadoesdev](https://x.com/izadoesdev) for updates, and [spin up a Neon database](https://console.neon.tech/signup) to start building your own stack.
