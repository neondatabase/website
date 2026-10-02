---
title: 'Neon gives you 100 projects for free, with 1 GB of Postgres storage each'
description: Now, go build
excerpt: >-
  Database storage on the Neon Free plan is now 1 GB per project, up from 0.5
  GB. You still get 100 projects, with existing projects getting the new limit
  automatically.
date: '2026-10-02T12:00:00'
updatedOn: '2026-10-01T23:50:00.000Z'
category: product
categories:
  - product
  - company
authors:
  - brad-van-vugt
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-free-plan-1-gb-per-project/cover.jpg
  alt: 'Neon gives you 100 projects for free, with 1 GB of Postgres storage each'
isFeatured: true
seo:
  title: 'Neon gives you 100 projects for free, with 1 GB of Postgres storage each - Neon'
  description: Now, go build
  keywords: []
  noindex: false
  ogTitle: 'Neon gives you 100 projects for free, with 1 GB of Postgres storage each - Neon'
  ogDescription: Now, go build
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-free-plan-1-gb-per-project/social.jpg
---

<video autoPlay muted loop playsInline width="708" height="507" aria-label="Neon pricing page showing 1 GB of storage per Free plan project">
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-free-plan-1-gb-per-project/pricing-page-clip-1gb.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-free-plan-1-gb-per-project/pricing-page-clip-1gb.mp4" type="video/mp4" />
</video>

<Admonition type="note" title="Just shipped">
Database storage on the Neon Free plan is now 1 GB per project, up from 0.5 GB. You still get 100 projects, with existing projects getting the new limit automatically.
</Admonition>

We don't want you hitting limits on Neon. We know you're building more than ever with coding agents, a lot of it on free plans, and the last thing you need is to keep count of how many projects you have left or how close each one is to its limits.

The Neon Free plan assumes the agent workflow: lots of projects, lots of experiments, most of them idle most of the time. You get 100 projects, each with its own compute allowance, and as of today each with 1 GB of Postgres storage.

More storage per project was one of the most requested changes to the Free plan. We can ship it because Neon gets more efficient as it grows - we're creating new projects at a rate of more than one per second.

If there's something else you'd like to see, tell us on [Discord](https://neon.com/discord). We really listen.

## What the Free plan gives you now

Every Free project in Neon is a full backend, with generous limits on every tool - not only Postgres:

### The database: Lakebase Postgres

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Lakebase Postgres demo">
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/lakebase.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/lakebase.mp4" type="video/mp4" />
</video>

- 1 GB of storage per project
- 100 CU-hours of compute per project per month, enough to run a 0.25 CU compute for 400 hours
- Autoscaling up to 2 CU (≈8 GB RAM)
- 10 branches per project
- A 6-hour instant restore window

### Managed Better Auth

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Managed Better Auth demo">
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/auth.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/auth.mp4" type="video/mp4" />
</video>

- Up to 60,000 monthly active users
- With email and password, OAuth, magic links, and OTP

### Object Storage

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Object Storage demo">
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/storage.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/storage.mp4" type="video/mp4" />
</video>

- 5 GB per project
- S3-compatible, and it branches with your project

### Functions

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Functions demo">
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/functions.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/functions.mp4" type="video/mp4" />
</video>

- Node.js functions that run on the same branch and in the same region as your database, with `DATABASE_URL` injected for you
- 1M invocations, plus 10 active and 400 waiting capacity-hours per month

## One Neon backend per idea

You don't ask whether an idea deserves a GitHub repo: your agent runs `git init` and you find out later. We want to host your backends in the same way: deploy a new Neon project for every idea, every client demo, every experiment without checking your free plan limits.

One command connects your coding agent to Neon:

```bash
npx neon@latest init
```

This installs the Neon plugin, which bundles agent skills and the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server), and links the current directory to a Neon project. From there, your agent can manage your projects end-to-end.

## What to build: a few ideas

Each of these starter apps runs on Free plan primitives. Scaffold one with `neon bootstrap`, then hand it to your agent:

**[Realtime chat](https://github.com/neondatabase/examples/tree/main/with-realtime-chat)**: a Next.js chat where signed-in users talk over WebSockets to a Hono server running on Functions, with every message stored in Postgres. Uses Lakebase Postgres, Managed Better Auth, and Functions.

  ```bash
  npx neon@latest bootstrap my-chat --template realtime-chat
  ```

**[File indexer](https://github.com/neondatabase/examples/tree/main/with-files-sdk)**: a script uploads files to an Object Storage bucket with the Files SDK, and a storage trigger in `neon.ts` calls a Function that indexes each new object in Postgres. Uses Lakebase Postgres, Object Storage, and Functions.

  ```bash
  npx neon@latest bootstrap my-files --template files-sdk
  ```

**[Discord bot](https://github.com/neondatabase/examples/tree/main/bots/discord-bot-http)**: a Discord bot hosted on Functions, with slash commands and interactive buttons, that stores user profiles and per-user command usage in Postgres. Uses Lakebase Postgres and Functions.

  ```bash
  npx neon@latest bootstrap my-bot --template discord-bot-http
  ```

Run `npx neon@latest bootstrap --list-templates` to see every starter.

## Bring your projects over

If you have a project stuck at its free limit somewhere else, point your agent to our [migration docs](https://neon.com/docs/import/migrate-intro) and ask it to move your project to Neon. Share what you're building with us on [Discord](https://neon.com/discord).
