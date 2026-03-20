---
title: Provision Postgres at Scale with the Neon API
description: >-
  Embed Postgres in your platform or agent, with instant provisioning,
  scale-to-zero, and API-enforced usage limits
excerpt: >-
  Neon offers the most powerful Postgres API on the market for applications that
  need to provision and manage thousands of databases programmatically. Whether
  you’re building a platform (like Retool) or deploying infrastructure through
  AI agents (like Replit), Neon gives you the to...
date: '2025-04-16T17:28:11'
updatedOn: '2025-05-16T22:53:03'
category: workflows
categories:
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/provision-postgres-neon-api/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Provision Postgres at Scale with the Neon API - Neon
  description: >-
    Provision and manage Postgres at scale with the Neon API—ideal for developer
    platforms and AI agents needing thousands of databases.
  keywords: []
  noindex: false
  ogTitle: Provision Postgres at Scale with the Neon API - Neon
  ogDescription: >-
    Provision and manage Postgres at scale with the Neon API—ideal for developer
    platforms and AI agents needing thousands of databases.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/provision-postgres-neon-api/social.png
source:
  wpId: 9218
  wpSlug: provision-postgres-neon-api
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/provision-postgres-neon-api/neon-api-notxt-1024x576-cff0ddaa.jpg)

**Neon offers the most powerful Postgres API on the market for applications that need to provision and manage thousands of databases programmatically.** Whether you’re building a platform (like [Retool](https://retool.com/?igaag=167570084603&igaat=&igacm=17502105052&igacr=714762401726&igakw=retool&igamt=e&igant=g&rcid=701Qo00000jMiZyIAK&_keyword=retool&adgroupid=167570084603&utm_source=google&utm_medium=search&utm_campaign=17502105052&utm_term=retool&utm_content=714762401726&hsa_acc=7420316652&hsa_cam=17502105052&hsa_grp=167570084603&hsa_ad=714762401726&hsa_src=g&hsa_tgt=kwd-395242915847&hsa_kw=retool&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gbraid=0AAAAAC71fc0zfZHV9Vut9UoynHYMWUts-&gclid=Cj0KCQjwqv2_BhC0ARIsAFb5Ac9-j6ZjTXThN9FmxsqhVukOnuGf79zNslPX-mukuMqR0tOE2W3uDSEaAtXyEALw_wcB)) or deploying infrastructure through AI agents (like [Replit](https://replit.com)), Neon gives you the tools to do it efficiently and at scale.

**Why is that?** It starts with Neon’s serverless architecture, which enables instant provisioning and scale-to-zero—making it a natural fit for these use cases. Building on this advantage (and informed by early partnerships with products like [Vercel Postgres](https://neon.tech/blog/neon-postgres-on-vercel) and [RetoolDB](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases)) we’ve gained deep experience with embedded Postgres workflows. We’ve since [consolidated that experience](https://x.com/nikitabase/status/1837138637516931252) by powering fully autonomous database provisioning in platforms like Replit Agent and Create.xyz, where AI agents spin up thousands of databases daily using Neon.

From there, we’ve continued to evolve our API to offer deeper levels of control. The result is an **API specialized for managing fleets of Postgres databases at scale.**

## The Use Cases Driving API-First Postgres

The Neon API is useful for any developer, but when it comes to managing Postgres fleets at scale, two use cases stand out where it’s a perfect fit:

- **Platforms with embedded Postgres.** These are developer platforms that let users spin up dedicated Postgres databases as part of their product experience (e.g. [Vercel](https://neon.tech/blog/neon-postgres-on-vercel), [Koyeb](https://www.koyeb.com/blog/serverless-postgres-public-preview), [Genezio](https://genezio.com/docs/integrations/neon-postgres/)).
- **AI agents.** These are AI tools like [Replit Agent](https://neon.tech/blog/looking-at-how-replit-agent-handles-databases) or [Create.xyz](https://neon.tech/blog/from-idea-to-full-stack-app-in-one-conversation-with-create), which are able to dynamically deploy Postgres databases while building apps on behalf of users. These agents generate thousands of databases daily as they build and run applications, relying on Neon to provision and manage each one behind the scenes.

<Admonition type="note" title="are you building something similar?">
[Reach out to us.](https://neon.tech/contact-sales) Our team has plenty of useful advice on how to embed Postgres effectively into your platform or agent, and how to manage the fleet efficiently. We're happy to chat about your use case and explore whether Neon is the right fit!
</Admonition>

## How the Neon API Helps You Manage Thousands of Postgres DBs

For platforms and agents deploying thousands of isolated databases, the Neon API offers **fine-grained control** over provisioning, scaling, and usage. Paired with Neon’s [instant provisioning](https://neon.tech/demos/instant-postgres) and [scale-to-zero](https://neon.tech/docs/introduction/scale-to-zero) capabilities, it gives teams the flexibility to manage large fleets of Postgres databases programmatically, while staying cost-efficient.

In most embedded Postgres workflows, [one Neon project maps to one Postgres database](https://neon.tech/docs/use-cases/database-per-user#setting-up-neon-for-database-per-user). That means managing a fleet of databases at scale is really about managing thousands of Neon projects—the features we’ve progressively added to the Neon API, as we work with parrners, make this possible even with small teams.

<Admonition type="info" title="true story">
The Retool team was able to manage [300k+ Neon projects](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) with a team of one engineer.
</Admonition>

### Enforce consumption quotas per project

With the Neon API, you can set **hard limits** on resource consumption for each project—ensuring cost control and predictable resource allocation.

You can define:.

- Set max compute uptime allowed per billing cycle (via `active_time_seconds`)
- Set max CPU seconds allowed across all computes (via `compute_time_seconds`)
- Set max amount of data written for the month (via `written_data_bytes`)
- Set max storage per branch (via `logical_size_bytes`)

**Why this matters:** This not only prevents unexpected resource consumption but allows better control over multi-tiered pricing models. For example, you can set quotas per plan.

### Control compute settings

The API also lets you define **precise autoscaling behavior** for each project:

- Set the minimum vCPU size (`autoscaling_limit_min_cu`)
- Set the maximum vCPU size (`autoscaling_limit_max_cu`)
- Define the timeout before compute suspends (`suspend_timeout_seconds`)

**Why this matters:** You can tune performance and efficiency per tier. Free-tier projects can scale down aggressively, while enterprise-tier ones stay warm with higher limits.

### Track consumption across your database fleet

You also have visibility into usage across thousands of projects:

- Total compute uptime (`active_time_seconds`)
- Total CPU time used (`compute_time_seconds`)
- Total data written (`written_data_bytes`)
- Total outbound data transferred (`data_transfer_bytes`)

**Why this matters:** You can monitor usage in real time, alert users when they approach limits, and implement billing based on actual consumption.

## Interfaces for AI agents

Neon also offers dedicated interfaces for AI agents that need to spin up and manage Postgres databases in real time. These interfaces are built to support agentic workflows where infrastructure is provisioned on the fly and managed autonomously (e.g. like [Replit Agent](https://replit.com/) or [Create.xyz](https://create.xyz/)).

### Neon Model Context Protocol (MCP) Server

The [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) is an emerging standard that enables large language models and AI agents to interact with APIs and developer tools using structured, natural-language commands. [Neon’s MCP server](https://neon.tech/docs/ai/neon-mcp-server) enables agents to perform tasks like

- Creating and deleting Postgres databases
- Running SQL queries
- Managing branches and migrations

Originally, Neon’s MCP server was available for local use. Now, with the launch of the [remote MCP server,](https://neon.tech/blog/announcing-neons-remote-mcp-server) developers no longer need to install or configure anything locally. The hosted version luses OAuth 2.1 for secure authentication, allowing agents to act on behalf of users without requiring API keys.

### @neondatabase/toolkit

We also have a lightweight, agent-friendly toolkit for provisioning and querying Neon databases. It includes:

- [The Neon TypeScript SDK,](https://neon.tech/docs/reference/typescript-sdk) for programmatic access to Neon resources.
- [The Neon Serverless Driver](https://github.com/neondatabase/serverless), which supports SQL queries over HTTP and works in edge environments like Cloudflare Workers or Vercel Functions.

## Wrap Up

If you’re building a platform or AI agent that needs to provision and manage databases at scale, Neon is exactly what you’re looking for. [Reach out to us](https://neon.tech/contact-sales) with any questions.

<Admonition type="note" title="Try Neon - $100 on us">
If you haven't tried Neon yet, [sign up via this link](https://fyi.neon.tech/credits) and get $100 in credits.
</Admonition>
