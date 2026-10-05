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
<p className="mt-0 mb-6 max-w-2xl text-sm leading-[1.6] tracking-tight text-gray-new-30 [text-wrap:pretty] dark:text-gray-new-70"><strong className="font-medium text-black-pure dark:text-white">Before you start:</strong> AI Gateway requires a paid Neon plan (<a className="underline underline-offset-2 hover:text-green-45" href="#pricing">Launch or Scale</a>) with <a className="underline underline-offset-2 hover:text-green-45" href="/docs/ai-gateway/prepaid-credits">prepaid credits</a> ($5 minimum), and your project must be in a <a className="underline underline-offset-2 hover:text-green-45" href="#overview">supported region</a>. Make sure your account has all three before running the prompt, otherwise setup stops at the plan, credits, or region step.</p>
<AgentPrompt title="Set up with your agent" src="/prompts/ai-gateway-landing.md" buttonText="Copy prompt" />
</div>

<img
  src="/docs/ai-gateway/hero-ai-gateway.svg"
  alt="One AI Gateway endpoint for your app reaches many model providers."
  className="not-prose aspect-[364/350] w-full max-w-[320px] object-contain object-top lg:max-w-[420px]"
/>

</div>

## Get started

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/embeddings" description="Turn text into vectors for search with the OpenAI-compatible embeddings endpoint." icon="database">Embeddings</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## About Neon AI Gateway

Neon AI Gateway is an LLM gateway built into your Postgres branch. Point your existing OpenAI SDK at the branch endpoint and call many models with one credential, and AI requests scope to a branch the same way your data does.

- **One credential across all providers.** Call models from many providers with no separate account for each.
- **Keep your SDK.** Point your existing AI SDK at the branch endpoint, with no new client to learn.
- **Scoped to your branch.** Each branch has its own gateway endpoint.
- **Streaming built in.** Stream responses with no extra setup.
- **Familiar paths.** The same short paths OpenAI and OpenRouter use, plus native provider paths when you need them. See [Shorter paths](/docs/ai-gateway/models#shorter-paths).

## Model access

Neon AI Gateway serves open-weight and foundation models. Any paid project with prepaid credits can use the open-weight models right away. Foundation models are rolled out gradually, so the full catalog opens up over time.

To request access to foundation models that aren't enabled for your project yet, drop your email below and we'll reach out as access opens up.

<RequestForm type="backend-platform" title="Request access to foundation models" description="Drop your email and we'll reach out as access opens up." buttonText="Request access" confirmation="You're on the list. We'll be in touch as access opens up." />

**See every supported model in the [model catalog](/docs/ai-gateway/models#available-models).** See [AI Gateway prepaid credits](/docs/ai-gateway/prepaid-credits) to add credits.

## Overview

Neon AI Gateway is the LLM inference layer built into the Neon backend. It lets you call models from OpenAI, Google, and other providers using your Neon credential, without setting up separate provider accounts. Your existing OpenAI SDK works without code changes. Just point it at your branch endpoint.

> AI Gateway is currently available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Create your project in one of these regions to use it. Support is expanding toward [all regions](/docs/introduction/regions). It requires a paid Neon plan. See [Pricing](#pricing) for details.

<Admonition type="important">
Use of AI Gateway is subject to our Terms of Service. Access is not available to users, organizations, or entities located in or operating from regions restricted by Anthropic's [Supported Regions Policy](https://www.anthropic.com/supported-countries). This restriction also applies to entities that are majority owned, directly or indirectly, by companies headquartered in unsupported regions.
</Admonition>

## Pricing

AI Gateway usage draws down a prepaid credit balance. Here's how pricing works:

- **Paid plans only.** AI Gateway is available on Neon's Launch and Scale plans, with no difference in pricing or model access between the two. Any paid customer with prepaid credits can use the open-weight models. See [Model access](#model-access) for the full foundation model catalog.
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
