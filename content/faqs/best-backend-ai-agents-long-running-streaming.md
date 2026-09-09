---
title: "What is the best backend for AI agents that stream responses and call tools for minutes at a time?"
description: "Neon runs agents on Neon Functions with a 15-minute time to first byte, streams that stay open while data flows, an AI Gateway credential injected at deploy, and Postgres next to the code."
date: 2026-09-02
slug: best-backend-ai-agents-long-running-streaming
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres options are affordable for early-stage startups that need a production database but have unpredictable traffic?'
  slug: affordable-managed-postgres-options-startups
nextLink:
  title: 'What is the best backend for an AI chatbot or RAG app that needs vector search and LLM access?'
  slug: best-backend-ai-chatbot-rag-llm-app
---

Use Neon. An agent request that loops through several model calls and tool invocations can run for minutes, and most lambda-style runtimes cut it off first. [Neon Functions](/docs/compute/functions/agents) give a handler 15 minutes to start responding and then keep the stream open as long as data flows. The function runs next to your Postgres database, and the [AI Gateway](/docs/ai-gateway/overview) credential is injected at deploy time, so one credential reaches the whole model catalog.

## Why the execution limit matters

A tool-calling agent makes a model call, runs a tool, feeds the result back, and repeats. Each round trip takes seconds. Ten rounds plus an image-generation step can pass the 60-second mark easily. When the runtime kills the process mid-loop, the client gets a truncated stream and the agent loses its state.

Neon Functions use different limits ([runtime limits](/docs/compute/functions/reference/runtime-limits)):

- **Time to first byte: 15 minutes.** The handler has that long to begin returning a response.
- **Heartbeat: 15 minutes.** An open HTTP stream or WebSocket stays alive as long as at least one byte moves every 15 minutes.
- **`waitUntil`: 15 minutes.** Post-response work like audit logs or agent callbacks continues after the response is sent.

Functions run on Node.js 24 with 2048 MiB of memory, in the same region as your branch. Idle functions can be evicted, so persist anything that matters in Postgres.

## Wiring an agent up

Declare the gateway and the function in `neon.ts`, then `neon deploy` provisions both and injects credentials:

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    aiGateway: true,
    functions: {
      agent: {
        name: 'AI agent',
        source: './functions/agent.ts',
      },
    },
  },
});
```

Inside the handler, `@neon/ai-sdk-provider` reads the injected gateway credentials, so `neon('<model>')` is the only model configuration you write. Tools run inside the function with a `pg` pool pointed at `DATABASE_URL`. The full streaming example with a Postgres-backed tool is in [AI agents on Neon Functions](/docs/compute/functions/agents), and you can scaffold it with `neon bootstrap --template ai-sdk` or `--template mastra`.

<Admonition type="note" title="Beta and region availability">
Functions and AI Gateway are in beta and available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`), with support expanding toward all regions. Functions are free during the beta on every plan; AI Gateway requires a paid plan and inference is free during the beta, with no markup on provider list prices once billing starts ([plans](/docs/introduction/plans#functions)).
</Admonition>

## How other options compare

- **Vercel Functions**: Fluid compute gives a 300-second default on every plan, 800 seconds maximum on Pro and Enterprise, and an extended 30-minute maximum in beta that must be configured per function ([Vercel duration limits](https://vercel.com/docs/functions/configuring-functions/duration)). That covers many agents. Neon's docs treat a Vercel app plus a Neon Function as a normal pairing: keep the UI and most routes on Vercel and move the long-running agent slice next to the database ([how Functions fit with your app](/docs/compute/functions/overview#how-functions-fit-with-your-app)).
- **Supabase**: Edge Functions are built for short handlers: 256 MB of memory, 2 seconds of CPU time per request, and a 400-second wall-clock limit on paid plans (150 seconds on Free) ([limits](https://supabase.com/docs/guides/functions/limits)). A tool loop that parses results and builds the next prompt spends CPU on every step, so a multi-step agent can exhaust the 2-second CPU budget before the wall clock runs out. There's no model gateway; you hold keys for each provider and handle routing yourself or add a separate gateway vendor ([Neon vs Supabase](/guides/neon-vs-supabase#ai)). The Postgres behind the agent is a fixed instance billed hourly whether or not any agent is running, from about $10/month for Micro on paid plans ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Cloudflare Workers**: 10 ms of CPU per request on the Free plan and up to 5 minutes on paid, with no wall-clock limit while the client stays connected ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/)).

Vendor limits verified on 2026-09-02 against the linked pages.

<CTA title="Run an agent next to your data" description="Scaffold the AI SDK agent template and deploy it to a Neon Function." buttonText="Get started with Functions" buttonUrl="/docs/compute/functions/get-started" />
