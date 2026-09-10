---
title: Neon AI Gateway
subtitle: One API for frontier and open-source models from OpenAI, Google, and more. Built into your Neon project.
summary: >-
  Neon AI Gateway is the LLM gateway built into the Neon backend. One
  Neon credential gives you access to models across multiple providers. Standard AI
  SDKs work without code changes. Each branch gets its own gateway endpoint.
enableTableOfContents: true
updatedOn: '2026-09-10T10:23:31.223Z'
---

## Foundation model access

Neon AI Gateway serves frontier models like GPT (`gpt-5`) and Gemini (`gemini-3-flash`) alongside open-weight models like Qwen and gpt-oss.

**See every supported model in the [model catalog](/docs/ai-gateway/models#available-models).**

Open-weight models are available to every project right away. Frontier models from OpenAI and Google are rolling out gradually. Don't see them in your project yet? Request early access below.

When AI Gateway reaches GA, all available models will be open to any paid Neon customer with prepaid credits, with no early-access step.

<RequestForm type="backend-platform" title="Request early access to additional foundation models" description="Drop your email and we'll reach out as access opens up." buttonText="Request Early Access" confirmation="You're on the list. We'll be in touch as access opens up." />

## Get started

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## Overview

Neon AI Gateway is the LLM inference layer built into the Neon backend. It lets you call models from OpenAI, Google, and other providers using your Neon credential, without setting up separate provider accounts. Your existing OpenAI SDK works without code changes. Just point it at your branch endpoint.

> AI Gateway is in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). Create your project in one of these regions to use it. Support is expanding toward all regions. It requires a paid Neon plan. Inference is free for paid plans during beta. See [Pricing](#pricing) for what to expect when billing begins.

<Admonition type="important">
Participation in this Beta is subject to our Terms of Service. Access is not available to users, organizations, or entities located in or operating from regions restricted by Anthropic's [Supported Regions Policy](https://www.anthropic.com/supported-countries). This restriction also applies to entities that are majority owned, directly or indirectly, by companies headquartered in unsupported regions.
</Admonition>

- **One credential for all providers.** A single Neon credential gives you access to models from OpenAI, Google, Meta, Databricks, and Alibaba. No separate provider accounts needed.
- **Standard SDKs, one URL change.** OpenAI SDK and google-genai both work out of the box.
- **AI follows your branches.** Each branch has its own gateway endpoint. If you use Neon branches for preview deployments, AI requests from a feature branch are scoped to that branch. It's the same isolation your database already gets.
- **Streaming support.** Server-sent events work on all endpoints with no extra configuration.
- **Shorter, OpenRouter-style paths.** Every dialect has a short top-level path: `/v1/chat/completions` for chat completions, and a provider-prefixed path for the native dialects (`/openai/v1/...`, `/anthropic/v1/...`, `/gemini/v1beta/...`). `GET /v1/models` lists the catalog. See [Shorter paths](/docs/ai-gateway/models#shorter-paths).

## Pricing

Inference is free during the beta. Billing begins when AI Gateway reaches GA. Here's what to expect once it does:

- **Paid plans only.** AI Gateway will be available on Neon's Launch and Scale plans. Any paid customer with prepaid credits will be able to access all available models. There's no difference in AI Gateway pricing or model access between the two plans.
- **No markup.** Neon will charge the same per-token rate as the model provider. Published provider prices are passed on to users with no additional markup.
- **Prepaid credits.** Inference will draw down a prepaid credit balance. 1 credit will equal $1 USD, with a $5 minimum purchase, and credits will be valid for 12 months from purchase. You'll buy credits from the **Billing** page in the [Neon Console](https://console.neon.tech/app/billing).

We'll publish exact per-model rates on the [Neon pricing page](https://neon.com/pricing) and update this page before billing begins.

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

## Frequently asked questions

<Faq>

<FaqItem question="Who can use AI Gateway?">
During the beta, AI Gateway is available on Neon's paid plans (Launch and Scale). When it reaches GA, any paid Neon customer with prepaid credits will be able to access all available models.
</FaqItem>

<FaqItem question="How much will AI Gateway credits cost?">
When billing begins, 1 credit will equal $1 USD, with a $5 minimum purchase. You'll buy credits from the **Billing** page in the [Neon Console](https://console.neon.tech/app/billing). Inference is free during the beta.
</FaqItem>

<FaqItem question="Will my credit balance be able to go negative?">
Yes, by a small amount. Usage can exceed your remaining balance before it's detected, so a minimum balance of $2 will apply to account for this.
</FaqItem>

<FaqItem question="Will credits expire?">
Credits will be valid for 12 months from the date of purchase.
</FaqItem>

<FaqItem question="What happens to my credits if I downgrade to Free?">
Your credits will stay on your account, but you won't be able to use AI Gateway while on the Free plan. They become available again if you upgrade to a paid plan.
</FaqItem>

<FaqItem question="What are the default usage limits?">
By default, each account has a soft limit of 200,000 tokens per minute. Separately, Neon enforces an account-level daily spend cap on total usage. It applies even during the free beta, isn't a fixed published number, and can vary by account. Both guard against runaway costs and platform abuse. If you're blocked and need a limit raised, [contact Support](/docs/introduction/support). See [Rate limits](/docs/ai-gateway/models#rate-limits) for details.
</FaqItem>

<FaqItem question="What happens if I hit a usage limit?">
Requests are blocked once you reach your per-minute token limit or daily spend limit, and the gateway returns an `HTTP 429` response:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway daily token limit exceeded"
}
```

See [Troubleshooting](/docs/ai-gateway/troubleshooting#429-account-quota-exceeded).
</FaqItem>

</Faq>

<NeedHelp/>
