---
title: Neon AI Gateway
subtitle: One API for frontier and open-source models from OpenAI, Google, and more. Built into your Neon project.
summary: >-
  Neon AI Gateway is the LLM gateway built into the Neon backend. One
  Neon credential gives you access to models across multiple providers. Standard AI
  SDKs work without code changes. Each branch gets its own gateway endpoint.
enableTableOfContents: true
updatedOn: '2026-09-15T18:17:04.567Z'
---

## Model access

Neon AI Gateway serves both frontier and open-weight models.

**See every supported model in the [model catalog](/docs/ai-gateway/models#available-models).**

Any paid project with prepaid credits can access all available models. See [AI Gateway prepaid credits](/docs/ai-gateway/prepaid-credits) to get started.

## Get started

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## Overview

Neon AI Gateway is the LLM inference layer built into the Neon backend. It lets you call models from OpenAI, Google, and other providers using your Neon credential, without setting up separate provider accounts. Your existing OpenAI SDK works without code changes. Just point it at your branch endpoint.

> AI Gateway is in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). Create your project in one of these regions to use it. Support is expanding toward all regions. It requires a paid Neon plan. See [Pricing](#pricing) for details.

<Admonition type="important">
Participation in this Beta is subject to our Terms of Service. Access is not available to users, organizations, or entities located in or operating from regions restricted by Anthropic's [Supported Regions Policy](https://www.anthropic.com/supported-countries). This restriction also applies to entities that are majority owned, directly or indirectly, by companies headquartered in unsupported regions.
</Admonition>

- **One credential for all providers.** A single Neon credential gives you access to models from OpenAI, Google, Meta, Databricks, and Alibaba. No separate provider accounts needed.
- **Standard SDKs, one URL change.** OpenAI SDK and google-genai both work out of the box.
- **AI follows your branches.** Each branch has its own gateway endpoint. If you use Neon branches for preview deployments, AI requests from a feature branch are scoped to that branch. It's the same isolation your database already gets.
- **Streaming support.** Server-sent events work on all endpoints with no extra configuration.
- **Shorter, OpenRouter-style paths.** Every dialect has a short top-level path: `/v1/chat/completions` for chat completions, and a provider-prefixed path for the native dialects (`/openai/v1/...`, `/anthropic/v1/...`, `/gemini/v1beta/...`). `GET /v1/models` lists the catalog. See [Shorter paths](/docs/ai-gateway/models#shorter-paths).

## Pricing

AI Gateway usage draws down a prepaid credit balance. Here's how pricing works:

- **Paid plans only.** AI Gateway is available on Neon's Launch and Scale plans. Any paid customer with prepaid credits can access all available models. There's no difference in AI Gateway pricing or model access between the two plans.
- **No markup.** Neon charges the same per-token rate as the model provider. Published provider prices are passed on to users with no additional markup.
- **Prepaid credits.** Inference draws down a prepaid credit balance. 1 credit equals $1 USD, with a $5 minimum purchase, and credits are valid for 12 months from purchase. You buy credits from the **Billing** page in the [Neon Console](https://console.neon.tech/app/billing).

See the [model catalog](/docs/ai-gateway/models#available-models) for per-model rates, and [AI Gateway prepaid credits](/docs/ai-gateway/prepaid-credits) for how to buy credits and manage your balance.

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
