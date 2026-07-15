---
title: Neon AI Gateway
subtitle: One API for frontier and open-source models from Anthropic, OpenAI, Google, and more. Built into your Neon project.
summary: >-
  Neon AI Gateway is the LLM gateway built into the Neon backend. One
  Neon credential gives you access to models across multiple providers. Standard AI
  SDKs work without code changes. Each branch gets its own gateway endpoint.
enableTableOfContents: true
updatedOn: '2026-07-15T17:54:41.160Z'
---

Neon AI Gateway is the LLM inference layer built into the Neon backend. It lets you call models from Anthropic, OpenAI, Google, and other providers using your Neon credential, without setting up separate provider accounts. Your existing OpenAI or Anthropic SDK works without code changes. Just point it at your branch endpoint.

> AI Gateway is in beta and available only in **AWS US East (Ohio) (`aws-us-east-2`)**, so create your project there to use it. It requires a paid Neon plan. Inference is free for paid plans during beta. See [Pricing](#pricing) for what to expect when billing begins.

<Admonition type="important">
Participation in this Beta is subject to our Terms of Service. Access is not available to users, organizations, or entities located in or operating from regions restricted by Anthropic's [Supported Regions Policy](https://www.anthropic.com/supported-countries). This restriction also applies to entities that are majority owned, directly or indirectly, by companies headquartered in unsupported regions.
</Admonition>

- **One credential for all providers.** A single Neon credential gives you access to models from Anthropic, OpenAI, Google, Meta, Databricks, and Alibaba. No separate provider accounts needed.
- **Standard SDKs, one URL change.** OpenAI SDK, Anthropic SDK, and google-genai all work out of the box.
- **AI follows your branches.** Each branch has its own gateway endpoint. If you use Neon branches for preview deployments, AI requests from a feature branch are scoped to that branch. It's the same isolation your database already gets.
- **Streaming support.** Server-sent events work on all endpoints with no extra configuration.
- **Shorter, OpenRouter-style paths.** Chat completions and Gemini are reachable at a shorter top-level `/v1/...` path; OpenAI Responses and Anthropic Messages have their own shorter aliases (`/openai/v1/...`, `/anthropic/v1/...`). `GET /v1/models` lists the catalog. See [Shorter paths](/docs/ai-gateway/models#shorter-v1-paths).

## Pricing

AI Gateway pricing isn't finalized. Here's what to expect once it moves out of beta:

- **Paid plans only.** AI Gateway will be available on Neon's Launch and Scale plans. There's no difference in AI Gateway pricing or model access between the two plans.
- **No markup.** Neon charges the same per-token rate as the model provider. Published provider prices are passed on to users with no additional markup.
- **Free for now.** Inference remains free through the end of the beta. Billing starts when AI Gateway reaches GA.

We'll publish exact per-model rates on the [Neon pricing page](https://neon.com/pricing) and update this page before billing begins.

## Quickstart

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## Starter templates

Browse working examples at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/). Two templates use AI Gateway:

**`ai-sdk`**: An image-generation agent that routes model calls through AI Gateway, stores results in Neon Object Storage, and writes metadata to Postgres on a Neon Function.

```bash
neon bootstrap --template ai-sdk
```

**`mastra`**: A personal assistant that uses AI Gateway for LLM calls with Postgres-backed memory on a Neon Function.

```bash
neon bootstrap --template mastra
```

<NeedHelp/>
