---
title: 'Neon Functions: backend logic next to your data'
description: Serverless compute that sits on your Neon branch
excerpt: >-
  Neon Functions are Node.js 24 compute you deploy onto a Neon branch, in the
  same region as your Lakebase Postgres database, with DATABASE_URL injected
  automatically. They're long-running enough that agents can stream for minutes
  and WebSockets or SSE can stay open while data flows.
date: '2026-08-17T12:00:00'
updatedOn: '2026-08-10T17:30:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-functions-backend-logic-next-to-your-data/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Neon Functions: backend logic next to your data - Neon'
  description: Serverless compute that sits on your Neon branch
  keywords: []
  noindex: false
  ogTitle: 'Neon Functions: backend logic next to your data - Neon'
  ogDescription: Serverless compute that sits on your Neon branch
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-functions-backend-logic-next-to-your-data/cover.jpg
---

<Admonition type="note" title="We're building backends">
Neon started by building a serverless Postgres database that branches, but a database alone isn't enough for how apps get built today. When a coding agent ships an app, it needs Postgres, then files, then something to run long-lived logic next to that data, then a way to call models. That's the [Neon backend](https://neon.com/blog/neon-backend-is-beta): [Lakebase Postgres](https://neon.com/docs/postgres/overview) (our database) at the center, with [Object Storage](https://neon.com/docs/storage/overview), [Functions](https://neon.com/docs/compute/functions/overview), [Auth](https://neon.com/docs/auth/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview) around it.
</Admonition>

Once we decided to evolve Neon into a [complete set of cloud backend primitives](https://neon.com/docs/get-started/backend-overview), it was clear Functions should be one of the first tools we launch.  Most serverless handlers talk to the database over the public internet - and that's fine, but there are hiccups we were itching to fix. Every query pays a cross-network round trip, you wire secrets yourself, and runtimes often cap at a few seconds, so an agent mid-tool-loop or a WebSocket never gets a fair shot.

We designed Neon Functions to flip that. They're Node.js 24 compute you deploy onto a Neon branch, in the same region as your [Lakebase Postgres](https://neon.com/docs/introduction/neon-and-lakebase) database, with DATABASE_URL injected automatically. They're long-running enough that agents can stream for minutes and WebSockets or SSE can stay open while data flows. You still host your UI elsewhere (not meant to host frontends!) while putting the data-adjacent slice of the backend here.

## If the job involves the database, run the function next to it

Neon functions run on the same infra that runs your Postgres and the same region as your [branch](https://neon.com/docs/introduction/branching).

At runtime Neon injects that branch's DATABASE_URL, and if you're using other parts of the Neon backend, like the [AI Gateway](https://neon.com/docs/ai-gateway/overview) or [Object Storage](https://neon.com/docs/storage/overview), those credentials land too. So a function that reads from Postgres, pulls an attachment from Object Storage, and streams an answer through the AI Gateway doesn't assemble three third-party accounts - it reads process.env on the branch it was deployed to.

That cuts the cross-region (or even cross-VPC) hop you'd otherwise pay on every query from a remote serverless host. And because the function stays up across requests, you keep a long-lived pg Pool open instead of opening a fresh connection on every invoke the way edge-style handlers often do.

![Diagram 1](https://cdn.neonapi.io/public/images/pages/blog/neon-functions-backend-logic-next-to-your-data/diagram-1.jpg)

<Admonition type="note" title="Neon Functions aren't meant for full-stack hosting">
We recommend you keep the UI on Vercel, Netlify, or wherever you already host frontends. Reach for Neon Functions when the work starts inside Neon, or when the primary job is reading and writing Neon primitives.
</Admonition>

## Long-running for agents and realtime

This is one thing we were sure about when designing Functions: they had to be long-running. Lambda-style caps are fine for CRUD, but [longer runtimes are needed in the age of agents](https://neon.com/docs/compute/functions/agents), since one agent request can stream for minutes while the agent calls models and tools.

This is also relevant for [WebSockets and SSE](https://neon.com/docs/compute/functions/websockets). You can use functions to export an upgrade handler for WebSockets, or return text/event-stream for SSE, and fan out across isolates with Postgres LISTEN/NOTIFY instead of standing up Redis.

<Admonition type="note" title="Another important note">
A function isn't a background job runner: it's always requested and always returns a web response (JSON, a stream, SSE, or a WebSocket upgrade). For queued work with its own lifecycle, [pair a function with something like Inngest today.](https://neon.com/guides/durable-workflow-on-neon-functions)
</Admonition>

## Functions branch like the rest of your stack

[Branching](https://neon.com/docs/introduction/branching) is Neon’s flagship feature. Powered by the underlying [lakebase architecture](https://neon.com/docs/introduction/architecture-overview), a Neon branch acts like a lightweight copy-on-write environment of your database - now that you can create in one API call, instantly, without duplicating storage up front.

Now that Neon also has [Object Storage](https://neon.com/docs/storage/overview), files branch with the database as well - and the same goes for [Managed Better Auth](https://neon.com/docs/auth/overview) and [AI Gateway](https://neon.com/docs/ai-gateway/overview). We want all our backend primitives to branch, and Functions are no exception.

![Diagram 2](https://cdn.neonapi.io/public/images/pages/blog/neon-functions-backend-logic-next-to-your-data/diagram-2.jpg)

When you create a branch in Neon, functions follow that same branch_id:

- When you deploy a function onto main, it gets a public HTTPS URL scoped to that branch
- You then create a child branch, and this branch gets its own copy of the function (different ID, different invocation URL) with DATABASE_URL
- When you code against the child branch (e.g. as a preview), it’ll feel exactly like production, but and you'll be talking to isolated data
- Once you’re done, you delete the branch, and the function gets deleted with it.

<Admonition type="note" title="Branch your entire backend">
We started by making Postgres branchable, and now we’re expanding our branch semantics to the entire backend stack. Apart from functions, you can also deploy [Object Storage, Auth, and AI Gateway](https://neon.com/blog/neon-backend-is-beta) into your Neon projects, and every time you branch, your entire backend will duplicate instantly.
</Admonition>

## Declaring Functions

Let’s now get into how to deploy functions in practice.

We recommend doing it via [neon.ts](https://neon.com/docs/reference/neon-ts). This is [Neon's backend-as-code config](https://neon.com/blog/neon-sdk) - one file can declare Postgres databases, Functions, Object Storage buckets, Auth, and the AI Gateway for a branch.

When you create a [Neon project](https://neon.com/docs/manage/projects), you get a default branch with our database, [Lakebase Postgres](https://neon.com/docs/postgres/overview), already on it; link that project locally, add a function to neon.ts, and neon deploy provisions it on the linked branch.

```
import { defineConfig } from '@neon/config/v1';
export default defineConfig({
  preview: {
    functions: {
      hello: {
        name: 'My first function',
        source: './functions/hello.ts',
      },
    },
  },
});
```

A function is any module whose default export provides fetch(request) and returns a Response. [Hono](https://hono.dev) is the recommended framework. Because the runtime stays up across requests, we recommend creating a pg Pool once at module scope and reuse it.

```
import { Hono } from 'hono';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const app = new Hono();
app.get('/', async (c) => {
  const { rows } = await pool.query('SELECT version()');
  return c.json(rows[0]);
});
export default app;
```

<Admonition type="note" title="For functions, pg Pool > Neon serverless driver">
We don’t recommend using @neondatabase/serverless with Neon fucntions. Our serverless driver is built for short-lived, edge-style invocations.
</Admonition>

## Coming soon: schedules and triggers for your Functions

Today, Neon Functions are invoked over HTTP - but we're already working on the next layer: a declarative invocation surface (function triggers) so Neon can call your functions from schedules and service events without an external scheduler or app-tier glue.

It is still WIP, but this is how we're thinking about it:

- Native cron that can run even while the database is asleep
- Then storage events: object created, deleted, or replaced
- Then auth, database, and platform events

Of course, the triggers will be branch-scoped as well. Stay tuned.

## A few examples: building with functions

Each of these is a complete, runnable build. Read the source on GitHub, or scaffold one with `neon bootstrap --template <name>`

- [REST API with Hono](https://github.com/neondatabase/examples/tree/main/with-hono) (hono)
- [Image-generation agent](https://github.com/neondatabase/examples/tree/main/with-ai-sdk) with the AI SDK, AI Gateway, and Object Storage (ai-sdk)
- [Personal-assistant agent](https://github.com/neondatabase/examples/tree/main/with-mastra) with Mastra (mastra)
- [MCP server](https://github.com/neondatabase/examples/tree/main/with-mcp) backed by Postgres (mcp)
- [Realtime chat](https://github.com/neondatabase/examples/tree/main/with-realtime-chat) over WebSockets (realtime-chat)
- [Realtime counter](https://github.com/neondatabase/examples/tree/main/with-realtime-sse) with SSE (realtime-sse)
- [Discord](https://github.com/neondatabase/examples/tree/main/bots/discord-bot-http), [Telegram](https://github.com/neondatabase/examples/tree/main/bots/telegram-bot-http), and [WhatsApp](https://github.com/neondatabase/examples/tree/main/bots/whatsapp-bot-http) bots

Browse them all at [Build on Neon](http://build-on-neon.vercel.app).

## Deploy one and poke it

Functions are free during beta on any pricing plan. Start from the [Functions quickstart](https://neon.com/docs/compute/functions/get-started), and if something breaks, [tell us on Discord](https://discord.gg/92vNTzKDGp).
