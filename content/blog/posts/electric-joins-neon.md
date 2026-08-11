---
title: Electric is joining team Neon at Databricks
description: Together we're building the complete backend for agentic apps.
excerpt: >-
  Today Databricks announced that Electric, the team behind PGlite and the
  Electric sync engine, is joining Databricks. We have our own reason to
  celebrate: Electric is joining the Neon team within Databricks, bringing
  lightweight WASM Postgres + real-time sync to Neon.
date: '2026-08-11T13:00:00'
updatedOn: '2026-08-11T13:00:00'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/electric-joins-neon/neon-electric.jpg
  alt: Electric joins Neon
isFeatured: true
seo:
  title: Electric is joining team Neon at Databricks - Neon
  description: Together we're building the complete backend for agentic apps.
  keywords: []
  noindex: false
  ogTitle: Electric is joining team Neon at Databricks - Neon
  ogDescription: Together we're building the complete backend for agentic apps.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/electric-joins-neon/neon-electric.jpg
---

![Electric joins Neon](https://cdn.neonapi.io/public/images/pages/blog/electric-joins-neon/neon-electric.jpg)

Today Databricks announced that [Electric](https://electric.ax/), the team behind [PGlite](https://pglite.dev/) and the Electric sync engine, is joining Databricks. We have our own reason to celebrate: Electric is joining the Neon team within Databricks, bringing lightweight WASM Postgres + real-time sync to Neon. The two teams are already at work on new backend capabilities, and we can't wait to see the apps and agents our customers build with them.

## Why Electric

Electric built two things in particular that have become key primitives in the agentic era. The first is PGlite, a full Postgres database small enough to run inside the application itself. PGlite runs in sandboxes, in embedded apps, and in serverless environments and it has grown from 1M to 13M weekly downloads in the last year.

The second is a sync engine. It keeps data continuously synchronized between a central Postgres database and connected clients like browser tabs, mobile apps, or agents running in a sandbox. Sync engines power collaborative products like Google Docs, Figma, and Notion, and the same technology is critical to keeping state synchronized across fleets of agents.

Both are Postgres to the core, which is why they fit in so well at Neon.

## PGlite: Postgres everywhere

More software will be built over the next few years than in all of history. As coding agents drive the cost of creation to zero, the number of applications explodes, and most of them are small. You can't have an age of abundance if every app requires a fixed minimum of compute.

In [our very first post announcing Neon](https://neon.com/blog/hello-world#:~:text=you%20have%20to%20make%20the%20cost%20of%20running%20the%20service%20an%20important%20design%20consideration%20on%20par%20with%20manageability%2C%20reliability%2C%20and%20performance.), we called this out:

> You have to make the cost of running the service an important design consideration on par with manageability, reliability, and performance.

This has proven to be more true than we could have ever imagined.

PGlite pushes in the same direction. A database that runs inside agent sandboxes and browser tabs, synchronized in real time with Lakebase Postgres in the cloud, lowers the entry cost for cloud apps and agents. Software abundance needs innovations like PGlite: millions of small, fast applications, each with real Postgres underneath.

## Sync: Realtime that agents can use

Complex problems like conflict resolution, partial replication, and reconnection logic make real-time sync difficult to build from scratch. Now agents are writing most of the code, and the problem persists. Ask a coding agent to build a CRUD app and it succeeds. Ask it to implement real-time sync and the failure rate goes way up.

But luckily for us, Auth and ORMs have shown the way: give agents a primitive so good they never have to improvise. Better Auth did this for auth. Drizzle did it for ORM. Real-time sync needs the same treatment, a primitive that agents reach for by default and get right on the first try. The Electric team has spent years building exactly that, and it slots into Neon next to the primitives already on the platform: Lakebase Postgres, Auth, Storage, Functions, and the AI Gateway.

## Shared DNA

There's also another reason this is a good fit. PGlite began as a proof of concept by Neon co-founder Stas Kelvich, exploring Postgres compiled to WASM. Electric took that experiment and turned it into a database that millions of projects build on every week. Bringing the teams together closes a loop that started years ago.

More than the shared history, though, we share an ethos. Electric is a team of Postgres hackers. They take a 30-year-old database we all love and pull it into the future, connecting it to how the world builds apps today. That's the same instinct that produced branching, scale-to-zero, and instant provisioning at Neon. We're glad to have them.

Read the [Databricks announcement](https://www.databricks.com/blog/electric-joins-databricks-bring-wasm-postgres-ai-agent-sandboxes) and hear from [Electric's founders](https://electric.ax/blog/2026/08/11/electric-joining-databricks) on why they joined.
