---
title: 'Meet BaseHub: Developer Velocity And Efficiency Right Down to The Database'
description: They are building a modern CMS experience using Neon
excerpt: >-
  “Databases have always been such a pain in terms of the migration flow,
  backups, scaling, risk of breaking production… In Neon, everything feels
  easier and much safer to do” Julian Benegas, CEO of BaseHub BaseHub is a new
  kind of headless CMS, designed to make content managemen...
date: '2024-09-10T07:12:25'
updatedOn: '2024-09-10T07:12:29'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Meet BaseHub: Developer Velocity And Efficiency Right Down to The Database -
    Neon
  description: >-
    BaseHub is a new headless CMS designed to make content management fast,
    simple, and collaborative. Built on Neon.
  keywords: []
  noindex: false
  ogTitle: >-
    Meet BaseHub: Developer Velocity And Efficiency Right Down to The Database -
    Neon
  ogDescription: >-
    BaseHub is a new headless CMS designed to make content management fast,
    simple, and collaborative. Built on Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database/neon-basehub-1024x576-8cdf5b1e.jpg)

<blockquote>
<p><strong>“Databases have always been such a pain in terms of the migration flow, backups, scaling, risk of breaking production… In Neon, everything feels easier and much safer to do”</strong></p>
<cite>Julian Benegas, CEO of BaseHub</cite>
</blockquote>

[BaseHub](https://basehub.com/home) is a new kind of headless CMS, designed to make content management fast, simple, and collaborative for developers and editors. It includes features like versioning, AI-driven content modeling, and branching (coming soon ✨). Now in Public Beta, [BaseHub has free tier for anyone to sign up and start using.](https://basehub.com/signup)

<figure>
<a href="https://basehub.com/">
<img src="https://cdn.neonapi.io/public/images/pages/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database/screenshot-2024-09-10-at-80335percente2percent80percentafam-1024x517-61fb8119.png" alt="Image" />
</a>
<figcaption><em>Explore a demo: </em><a href="https://basehub.com/"><em>BaseHub.com</em></a><br></br><br></br></figcaption>
</figure>

The BaseHub team has a background in building content-heavy websites; they grew frustrated with the typical CMS experience (slow, cumbersome) and decided to build BaseHub prioritizing collaboration, and developer-friendly APIs.

They recently launched a [collection of fully customizable templates](https://basehub.com/blog/introducing-basehub-templates) built with Next.js to help developers and teams kickstart their web projects. The collection includes templates for marketing websites, documentation, and help centers, with more on the way. [Check them out.](https://basehub.com/templates)

![Image](https://cdn.neonapi.io/public/images/pages/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database/screenshot-2024-09-10-at-80439percente2percent80percentafam-1024x577-b654f7fe.png)

## How autoscaling lowers database costs for BaseHub

<blockquote>
<p>“Instead of having to overprovision our servers to handle peak loads, which leads to inefficiencies and higher costs, Neon’s autoscaling handles it. We get more performance when we need it”</p>
<cite>Julian Benegas, CEO of BaseHub</cite>
</blockquote>

When BaseHub began its journey, they started building on Supabase. For the early phases of the project, Supabase was a great, convenient choice thanks to its useful starter kits and compatibility with the other tools their team was exploring. It was not until BaseHub matured from a project to a product with real users and increasing demands that they started thinking about upgrading their database.

Specifically: once they got to production, the BaseHub team noticed how their traffic pattern was variable. For short periods of time, BaseHub needed more compute—but in Supabase (like in most Postgres databases) there was no compute autoscaling, which forced them to overprovision resources. This quickly led to higher costs for the production database.

These cost inefficiencies also came from their non-prod environments. BaseHub uses a staging database, which (like all staging databases) is typically only used for a few hours—not 24/7. It seemed natural to have a way to pay very little for it by default, without having to do any manual work or babysit it in any way.

With its focus on efficiency and DX, [Neon](https://neon.tech/) is a special kind of Postgres service. It adds a custom-built [serverless architecture](https://neon.tech/blog/architecture-decisions-in-neon) to Postgres, bringing an [autoscaling experience](https://neon.tech/docs/introduction/autoscaling) that dynamically adjusts resources based on actual demand—[scaling down all the way to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero) when databases are not being accessed. With Neon, during high-traffic moments, BaseHub gets the compute power it needs; during quieter times, the servers scale back down automatically, reducing unnecessary overhead.

Likewise, non-production environments like staging automatically scale down when not in use, eliminating idle compute costs entirely. When needed, databases spin back up in under 500 ms—without any manual intervention.

## The icing on the cake: testing changes via database branching

<blockquote>
<p>“Neon’s branching feature is like magic. With its copy-on-write implementation, we can create branches instantly without the overhead of traditional backups. This makes it easy to replicate issues without touching the live database”</p>
<cite>Julian Benegas, CEO of BaseHub</cite>
</blockquote>

Another specialty of Neon is [database branching](https://neon.tech/docs/introduction/branching). Due to its unique [storage design](https://neon.tech/blog/get-page-at-lsn), Neon databases can branch via copy-on-write, giving developers a branch with a perfect copy of data and schema to run tests on and experiment with. Branches can also be used as [instant, lightweight backups.](https://neon.tech/docs/guides/branch-restore)

By using branches, BaseHub could create isolated database copies for testing without relying on traditional backups. This not only makes migrations smoother, but it also makes debugging faster and safer—especially in production—while reducing operational costs. All changes going to production are first tested on an isolated branch and only applied to production once they’re safe.

## More icing: the Neon serverless driver

<blockquote>
<p>“With the Neon serverless driver, we’ve seen a significant improvement in query speed. Before, we had to rely on node compatibility within Cloudflare Workers, which caused slower queries”</p>
<cite>Julian Benegas, CEO of BaseHub</cite>
</blockquote>

BaseHub also uses the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) to connect Cloudflare Workers directly to Neon, which helped them get faster performance across regions. It is a low-latency Postgres driver designed for JavaScript and TypeScript environments, using HTTP for one-shot queries or WebSockets for interactive transactions.

To wrap it up, a TL;DR into the rest of their stack: frontend is Next.js, they use Vercel for deployment, and Drizzle as their ORM.

## Give them a go

BaseHub and Neon align on key priorities: a fast and smooth developer experience, efficiency with flexibility, **and a free tier.** [Create a BaseHub account](https://basehub.com/signup) to explore their beta. And to get a Postgres database with autoscaling, branching, and serverless speed, [get started with Neon.](https://console.neon.tech/signup) Databases in the Free plan can autoscale up to 2 CPU, 8 GB memory to cover for your traffic spikes.
