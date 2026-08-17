---
title: LLMs belong in your backend
description: AI Gateway brings Databricks-scale inference to your Neon branch
excerpt: >-
  Neon AI Gateway is how we put LLM calls into the Neon backend the same way we
  put files, functions, and auth there. It allows you to call models right from
  Neon, instead of collecting lab accounts.
date: '2026-08-17T12:00:00'
updatedOn: '2026-08-15T15:42:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/llms-belong-in-your-backend/cover.jpg
  alt: >-
    The title "LLMs belong in your backend" beside a code window enabling
    aiGateway in a Neon config file, with model provider logos floating around
    it
isFeatured: false
seo:
  title: LLMs belong in your backend - Neon
  description: AI Gateway brings Databricks-scale inference to your Neon branch
  keywords: []
  noindex: false
  ogTitle: LLMs belong in your backend - Neon
  ogDescription: AI Gateway brings Databricks-scale inference to your Neon branch
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/llms-belong-in-your-backend/cover.jpg
---

<Admonition type="note" title="We're building backends">
Neon started with a serverless Postgres database that branches. But a database alone isn't enough for how apps get built today. When a coding agent ships an app, it now deploys the [Neon backend](https://neon.com/blog/neon-backend-is-beta) - [Lakebase Postgres](https://neon.com/docs/postgres/overview) (our database) plus [Object Storage](https://neon.com/docs/storage/overview), [Functions](https://neon.com/docs/compute/functions/overview), [Managed Better Auth](https://neon.com/docs/auth/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview).
</Admonition>

LLMs are part of the modern backend stack now. We think tokens sit next to storage and compute as one of the foundational primitives for apps and developer workflows - not an optional add-on you wire in later.

Most teams still treat them that way though. They’re calling OpenAI, Google, Anthropic, or an open-weight host straight from the app, with one key per lab that is swapped whenever they try a different model. This experience feels old: juggling separate bills and rate-limit dashboards is annoying, and you have to keep track of which key belongs in which environment and which embedding model produced which vectors.

[Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) is how we put LLM calls into the Neon backend the same way we put files, functions, and auth there. It allows you to call models right from Neon, instead of collecting lab accounts. It still works with the SDKs you're already using - you just change the base URL and the key, and from there, there's just one Neon credential to manage. Every model you call (open-weight or frontier) shows up on your Neon bill, with no markup over the labs' published pricing.

<Admonition type="note" title="Hosted by Databricks">
Neon AI Gateway is not a thin proxy that marks up someone else's API. It serves models hosted by Databricks, on the same [Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/) infrastructure Databricks already runs at scale.
</Admonition>

![Neon AI Gateway sits in the Neon backend next to Postgres, Object Storage, Functions, and Auth](https://cdn.neonapi.io/public/images/pages/blog/llms-belong-in-your-backend/diagram-1.jpg)

## What you get when model calls live in your backend

### One call can access a wide catalog of frontier and open-weight models

The first win is straightforward: you stop juggling API keys from every lab when you switch models or ship a product that supports more than one. Comparing models (or building features that can swap providers) is as simple as changing a string. One Neon bearer credential with the ai_gateway:invoke scope covers the catalog:

```
// OpenAI
model: 'gpt-5-6-sol'
// Anthropic
model: 'claude-sonnet-5'
// Open weights (examples)
model: 'kimi-k3'
model: 'glm-5-2'
model: 'gpt-oss-120b'
```

Chat completions sit on an OpenAI-compatible /v1 path, so the same client works across providers. Native routes stay available when you need provider-specific surfaces (OpenAI Responses, Gemini, Anthropic Messages). Streaming works end to end.

Our supported model list grows often enough that any number we aim to print goes stale immediately. Check the live catalog on the [models page](https://neon.com/docs/ai-gateway/models). We aim to offer new models the same day they launch, and we’re committed to shipping both open-weight and proprietary models on the same endpoint.

<video width="2328" height="1366" style={{ aspectRatio: '2328 / 1366' }} autoPlay loop muted playsInline src="https://cdn.neonapi.io/public/images/pages/blog/llms-belong-in-your-backend/ai-models.mp4"></video>

### All your LLM usage gets unified in one bill, without penalizing you on pricing

Unified access is also simpler for billing and cost visibility. LLM usage lands on your Neon invoice instead of a stack of lab statements, so you can see token spend next to the rest of your backend. We pass through each provider's published per-token rates, without markup.

<Admonition type="note" title="Coming soon">
Deeper LLM observability and spend controls are on our immediate roadmap for even more convenience when keeping track of token spend. Stay tuned.
</Admonition>

### Your LLM endpoints branch with the rest of your stack

We always repeat this when talking about our backend: we want every primitive to speak [branches](https://neon.com/docs/introduction/branching) - our AI Gateway is no exception.

Powered by the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview), a Neon branch is a lightweight "copy" environment of your backend that actually doesn't duplicate storage - only the compute you consume when running adds to your bill. Branching is the most popular feature of our Postgres database (Lakebase Postgres), and now we've been expanding the branching semantics across the backend. All our tools ([Object Storage](https://neon.com/docs/storage/overview) buckets, [Managed Better Auth](https://neon.com/docs/auth/overview), [Functions](https://neon.com/docs/compute/functions/overview), and now AI Gateway) can branch.

So, each Neon branch gets its own AI Gateway host - so a preview deploy hits br-preview-…, not production's endpoint. neon env pull writes `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` for the branch you're on, next to `DATABASE_URL` - same branch-first loop as Postgres.

Credentials follow lineage, not a single shared lab key. A credential created on `main` works on `main` and its descendants (preview, feature, CI). It does not work on a sibling lineage. So you are not pasting the same OpenAI (or Google, or Anthropic) key into every PR bot - instead, each branch calls its own gateway host, with a Neon credential that is only valid inside that branch family. When you delete the branch, that host goes with it.

![Each Neon branch gets its own AI Gateway host, with credentials that follow branch lineage](https://cdn.neonapi.io/public/images/pages/blog/llms-belong-in-your-backend/diagram-2.png)

### Agent state, data, models - all lives in one Neon branch

We've built Neon AI Gateway so it sits right next to [Lakebase Postgres](https://neon.com/docs/postgres/overview), [Functions](https://neon.com/docs/compute/functions/overview), [Object Storage](https://neon.com/docs/storage/overview), and [Managed Better Auth](https://neon.com/docs/auth/overview) - the model call isn't bolted onto your backend, it's one of the primitives.

Let's zoom into what that means. For a long time, "LLM + database" mostly meant retrieval. Embed chunks into a vector column, run similarity search, stuff the top hits into a prompt, send it to a lab API. That path is still the starting point for a lot of agent backends - and retrieval got denser every year: BM25 next to vectors, rerankers, hybrid search, more of the loop living next to the data instead of in a separate vector product.

LLMs got better at retrieval too. Teams built harnesses around them - teaching the model what data is relevant and how to fetch it - so the agent isn't guessing how to query your database. Alongside that came agent memory: another primitive for logging state and handing it back to the model on the next turn.

Retrieval and memory are still the foundation. But what's getting interesting is when all of it lives in one place: database and files for state, Functions for orchestration, and models on the same branch. It's early days, but agent–database interaction is already moving past simple RAG.

You can start to see where this goes:

- Post-training an open-weight model on data that already lives in your Postgres
- Logging agent traces, then branching so you can replay database state at a point in time
- Eval loops that copy the whole backend - search indexes, files, model endpoint - and try a different retrieval harness without touching production

In practice, a request already looks like this today:

- A [Neon Function](https://neon.com/docs/compute/functions/overview) wakes up on a branch
- It reads DATABASE_URL to fetch memory or run retrieval
- It pulls a file from Object Storage if it needs it
- It calls a model through AI Gateway with the same branch's credential

One branch, one deploy, one set of env vars. The Function already gets `DATABASE_URL`, `NEON_AI_GATEWAY_TOKEN`, and `NEON_AI_GATEWAY_BASE_URL` [injected automatically](https://neon.com/docs/ai-gateway/authentication#credentials-in-neon-functions). The model call and the data live one process.env apart. Create a Neon branch and you copy that whole story, not just the database.

![A Neon Function on a branch reads the database, pulls a file from Object Storage, and calls a model through AI Gateway](https://cdn.neonapi.io/public/images/pages/blog/llms-belong-in-your-backend/diagram-3.jpg)

## Neon AI Gateway = Databricks scale and performance

Neon AI Gateway is the Neon access path onto Databricks [Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/)  - the infra already moving [more than 145 trillion tokens a month](https://neon.com/blog/neon-backend-is-beta) (and counting). Open-weight models get the same serving work as frontier ones, [getting top performance (2.5x throughput and 3x lower latency) due to features like prompt caching](https://www.databricks.com/blog/accelerating-llm-inference-prompt-caching-open-source-models-databricks).

<Admonition type="note" title="Coming soon">
We'll go deeper on open-weight performance and prompt caching in a follow-up blog post.
</Admonition>

## Switching over

Switching to the Neon AI Gateway from a lab API is quite simple. Declare the gateway in [neon.ts](https://neon.com/docs/reference/neon-ts) and deploy:

```
import { defineConfig } from '@neon/config/v1';
export default defineConfig({
  preview: {
    aiGateway: true,
  },
});
neon deploy
```

That provisions credentials and pulls them into `.env` as `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL`.

(Or create a credential in the Console under APP BACKEND → Credentials, check `ai_gateway:invoke`, and copy the snippet once.)

Then point the SDK you already use at Neon:

```
import OpenAI from 'openai';
import 'dotenv/config';
const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN, // was process.env.OPENAI_API_KEY
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`, // was OpenAI's default host
});
const response = await client.chat.completions.create({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);
```

`NEON_AI_GATEWAY_BASE_URL` is the bare branch host (`https://br-…-api.ai.…aws.neon.tech`). You append the dialect path yourself (`/v1` for chat completions, `/openai/v1` for Responses, and so on).

For TypeScript apps on the Vercel AI SDK, [@neon/ai-sdk-provider](https://www.npmjs.com/package/@neon/ai-sdk-provider) reads those env vars and routes each catalog model to the right gateway endpoint. Two starter templates already wire this together - [ai-sdk](https://build-on-neon.vercel.app/) (image-generation agent with AI Gateway + Object Storage + a Neon Function) and [mastra](https://build-on-neon.vercel.app/) (personal assistant with Postgres-backed memory on a Function):

```
neon bootstrap --template ai-sdk
```

## Try it

**Tokens are a backend primitive, and they should live where the rest of the backend lives. Neon AI Gateway puts frontier and open-weight models right on your branch, billed through Neon with no markup, with Databricks-scale performance.**

AI Gateway is in beta, it is free to use during the beta period. Point your SDK at Neon, call a model, and [send us feedback](https://discord.gg/92vNTzKDGp) - we’re working hard to take AI Gateway to GA!
