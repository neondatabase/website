---
title: Neon AI Gateway
subtitle: One API for open-weight and foundation models from OpenAI, Google, and more. Built into your Neon project.
summary: >-
  Neon AI Gateway is the LLM gateway built into your Neon project. One
  Neon credential gives you access to models across multiple providers. Standard AI
  SDKs work without code changes. Each branch gets its own gateway endpoint.
enableTableOfContents: true
updatedOn: '2026-09-26T00:49:26.569Z'
layout: wide
hideCopyPage: true
---

<div className="not-prose -mb-4 grid grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-start gap-16 lg:mb-6 lg:grid-cols-1 lg:gap-10">

<div className="[&>div]:my-0!">
<p className="mt-0 mb-4 max-w-2xl text-base leading-[1.6] tracking-tight text-gray-new-20 [text-wrap:pretty] dark:text-gray-new-80">One endpoint and one Neon credential for models from many providers, scoped to your branch the same way your data is.</p>
<p className="mt-0 mb-6 max-w-2xl text-sm leading-[1.6] tracking-tight text-gray-new-30 [text-wrap:pretty] dark:text-gray-new-70"><strong className="font-medium text-black-pure dark:text-white">Before you start:</strong> AI Gateway needs a paid Neon plan (<a className="underline underline-offset-2 hover:text-green-45" href="/docs/ai-gateway/models#pricing">Launch or Scale</a>) with <a className="underline underline-offset-2 hover:text-green-45" href="/docs/ai-gateway/prepaid-credits">prepaid credits</a> ($5 minimum).</p>
<AgentPrompt title="Set up with your agent" src="/prompts/ai-gateway-landing.md" buttonText="Copy prompt" />
</div>

<img
  src="/docs/ai-gateway/hero-ai-gateway.svg"
  alt="One AI Gateway endpoint for your app reaches many model providers."
  className="not-prose aspect-[364/350] w-full max-w-[320px] object-contain object-top lg:max-w-[420px]"
/>

</div>

Neon AI Gateway is the LLM gateway built into your Postgres branch. Point your existing OpenAI SDK at the branch endpoint and call models from many providers with one credential, with no separate account for each provider and your AI requests scoped to a branch the same way your data is.

## Available models

Browse the full catalog below. Switch between the **Text**, **Image**, and **Embeddings** tabs, filter by provider or open weights, sort any column, and click a model for a copy-paste quickstart. Chat and image models get AI SDK, Mastra, Python, TypeScript, and cURL; embedding models get Python, TypeScript, and cURL. The endpoint each snippet targets is baked into its base URL: `/v1` for chat completions and embeddings, `/openai/v1` for the Responses API (image generation).

<AiGatewayModelIndex/>

For full request paths and when to prefer each endpoint, see [Which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use). For embedding models (dimensions, normalization, and choosing a distance operator), see [Embeddings](/docs/ai-gateway/embeddings).

## Get started

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Endpoints, model IDs, rate limits, pricing, and provider terms." icon="database">Model reference</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/embeddings" description="Turn text into vectors for search with the OpenAI-compatible embeddings endpoint." icon="database">Embeddings</a>

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
