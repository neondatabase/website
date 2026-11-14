---
title: "Is there an OpenRouter alternative without a markup or credit fee?"
subtitle: "Neon AI Gateway charges each provider's published per-token rate with no markup, and credits cost their face value: 1 credit is $1. OpenRouter also passes through provider prices, but adds a 5.5% fee (Standard) or 8% (Business) when you buy credits."
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T22:54:32.784Z'
isDraft: false
previousLink:
  title: 'How do I move a supabase-js app to another backend without rewriting my queries?'
  slug: move-supabase-js-app-without-rewriting-queries
nextLink:
  title: 'pg_search vs pg_textsearch vs Lakebase Search: which BM25 extension should I use for Postgres?'
  slug: pg-search-vs-pg-textsearch-vs-lakebase-search-bm25
---

Yes. [Neon AI Gateway](/docs/ai-gateway/overview) serves models from OpenAI, Anthropic, Google, and open-weight labs behind one OpenAI-compatible endpoint. It charges the same per-token rate as the model provider, with no additional markup ([pricing](/docs/ai-gateway/models#pricing)). You pay with prepaid credits, and 1 credit equals $1 USD, so $100 of credits costs $100 ([prepaid credits](/docs/ai-gateway/prepaid-credits#how-credits-and-pricing-work)).

## Where OpenRouter's fee sits

OpenRouter doesn't mark up inference either. Its fee is charged when you buy credits ([OpenRouter pricing](https://openrouter.ai/pricing), [OpenRouter FAQ](https://openrouter.ai/docs/faq)):

- **Standard**: 5.5% on each credit purchase, with a $0.80 minimum. Buying $100 of credits costs $105.50.
- **Business**: 8% on each credit purchase.
- **Crypto payments**: a 5% fee.
- **Bring your own key**: the first $25,000 of list-price inference per month carries no fee on Standard and Business, then 5% of what the same request would cost on OpenRouter.

On a small budget the difference is a few dollars. On a large monthly model bill, 5.5% or 8% of every top-up adds up.

## Side by side

|                         | Neon AI Gateway                                  | OpenRouter (Standard)                   |
| ----------------------- | ------------------------------------------------ | --------------------------------------- |
| Inference pricing       | Provider list price, no markup                   | Provider list price, no markup          |
| Fee when buying credits | None: 1 credit = $1                              | 5.5% ($0.80 minimum)                    |
| Minimum purchase        | $5                                               | No minimum spend                        |
| Credit expiry           | 12 months after purchase                         | May expire one year after purchase      |
| Free option             | Buy credits on the Neon Free plan                | 25+ free models, 50 requests per day    |
| Credentials             | One Neon credential, scoped to a branch          | OpenRouter API keys                     |
| Default limits          | 200,000 tokens per minute, $20 per day spend cap | No plan-based rate limit on paid models |

AI Gateway is available on every Neon plan, including Free: you add a payment card and buy credits without upgrading. Neon's default limits are soft and may vary by account ([usage limits](/docs/ai-gateway/prepaid-credits#usage-limits)).

## Switch an OpenAI SDK client

Both gateways speak the OpenAI chat completions format, so moving is a change to the key, the base URL, and the model ID. Neon uses short model IDs such as `gpt-5-mini` ([models](/docs/ai-gateway/models)):

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const response = await client.chat.completions.create({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'What is Neon?' }],
});
```

Clients that ask for an OpenRouter-style base URL work with `https://<branch-host>/v1` ([chat completions](/docs/ai-gateway/chat-completions)). `neon env pull` writes both variables for the current branch ([authentication](/docs/ai-gateway/authentication)).

## When OpenRouter fits better

OpenRouter lists 600+ models from 80+ providers, routes around a failing provider automatically, and supports bring-your-own-key and per-key credit caps. If you need a model Neon doesn't serve, or provider fallback across many hosts, it's the stronger choice.

Neon AI Gateway fits when your app already runs on Neon. The credential is scoped to a branch and works on every branch below it, so preview and eval branches call models without new keys. A [Neon Function](/docs/compute/functions/overview) gets the gateway variables injected next to `DATABASE_URL`, and model usage is paid from the same Neon account as your Postgres, Object Storage, and Functions ([authentication](/docs/ai-gateway/authentication)).

The gateway runs in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions).

Vendor details verified on 2026-11-13 against the linked pages.

<CTA title="Call any model with one Neon credential" description="Buy AI Gateway credits on any plan and make your first request." buttonText="AI Gateway quickstart" buttonUrl="/docs/ai-gateway/get-started" />
