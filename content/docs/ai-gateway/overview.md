---
title: Neon AI Gateway
subtitle: LLM inference built into your Neon branch
summary: >-
  Neon AI Gateway is the LLM inference layer built into the Neon backend. One
  Neon credential gives you access to 39 models across 7 providers. Standard AI
  SDKs work without code changes. Each branch gets its own gateway endpoint.
enableTableOfContents: true
updatedOn: '2026-06-15T14:41:04.978Z'
---

<PrivatePreviewEnquire/>

Neon AI Gateway is the LLM inference layer built into the Neon backend. It lets you call models from Anthropic, OpenAI, Google, and other providers using your Neon credential, without setting up separate provider accounts. Your existing OpenAI or Anthropic SDK works without code changes. Just point it at your branch endpoint.

During the private preview, AI Gateway is available for new projects in the AWS us-east-2 region only, and foundation model access requires a paid Neon plan.

- **One credential for all providers.** A single Neon credential gives you access to 39 models across Anthropic, OpenAI, Google, Meta, DeepSeek, Databricks, and Alibaba. No separate provider accounts needed.
- **Standard SDKs, one URL change.** OpenAI SDK, Anthropic SDK, and google-genai all work out of the box.
- **AI follows your branches.** Each branch has its own gateway endpoint. If you use Neon branches for preview deployments, AI requests from a feature branch are scoped to that branch. It's the same isolation your database already gets.
- **Streaming support.** Server-sent events work on all endpoints with no extra configuration.

## Quickstart

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## Starter templates

Browse working examples at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/). Two templates use AI Gateway:

**`ai-sdk`** — An image-generation agent that routes model calls through AI Gateway, stores results in Neon Storage, and writes metadata to Postgres on a Neon Function.

```bash
neonctl bootstrap --template ai-sdk
```

**`mastra`** — A personal assistant that uses AI Gateway for LLM calls with Postgres-backed memory on a Neon Function.

```bash
neonctl bootstrap --template mastra
```

<NeedHelp/>
