---
title: "Is there an LLM gateway that charges provider prices and puts all model usage on one bill?"
subtitle: "Neon AI Gateway charges each model provider's published per-token rate with no markup, and usage for every model draws down one prepaid credit balance on your Neon account, next to your Postgres, Object Storage, and Functions usage."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I build a live dashboard on Postgres without polling the database?'
  slug: live-dashboard-postgres-without-polling
nextLink:
  title: 'Should I use Managed Better Auth or self-host Better Auth?'
  slug: managed-better-auth-vs-self-hosting-better-auth
---

Yes. [Neon AI Gateway](/docs/ai-gateway/overview) serves models from OpenAI, Anthropic, Google, and open-weight labs behind one Neon credential, and charges the same per-token rate as the model provider, with no additional markup ([pricing](/docs/ai-gateway/models#pricing)). Usage for every model draws down one prepaid credit balance that you buy from the **Billing** page of the Neon Console, so token spend lands with the rest of your Neon backend instead of on a separate statement per lab ([plans](/docs/introduction/plans#ai-gateway)).

## What one bill replaces

Calling labs directly means an account, a key, a payment method, and an invoice per provider, plus a separate rate-limit dashboard for each. Comparing spend across models means reconciling those statements. With AI Gateway, a `gpt-5-mini` call, a Claude call, and a `qwen3-embedding-0-6b` call all draw from the same balance, and switching between them is a change to the `model` string ([get started](/docs/ai-gateway/get-started#swap-models)).

## How pricing works

- **Provider rates**: each request is billed on its token usage at the provider's published rate. Embedding and decision models are billed on input tokens only ([embeddings](/docs/ai-gateway/embeddings#models), [decisions](/docs/ai-gateway/decisions#models)).
- **Prepaid credits**: 1 credit equals $1 USD. The minimum purchase is $5, and credits are valid for 12 months from purchase ([prepaid credits](/docs/ai-gateway/prepaid-credits#how-credits-and-pricing-work)).
- **Same rates on both paid plans**: AI Gateway is available on Launch and Scale, with no difference in pricing or model access between the two. Any paid account with credits can call every model in the catalog.
- **Per-model rates**: the catalog at [`neon.com/models.json`](https://neon.com/models.json) is the machine-readable source of truth. Each entry lists input and output rates per million tokens, and cache rates where the model supports them.

## Managing the balance

Only organization admins can buy credits, and the organization must be billed directly by payment card. In **Billing**, the **AI gateway credits** card shows credits remaining and the credits added in the last 30 days ([view your balance](/docs/ai-gateway/prepaid-credits#view-your-balance-and-usage-history)).

To avoid running dry, turn on **auto-reload**: when the balance drops below a threshold you set, Neon buys a fixed amount with the card on file ([automatic top-up](/docs/ai-gateway/prepaid-credits#automatic-top-up)). Usage is metered after a request is served, so a final request can push the balance slightly below zero.

## Limits to plan around

- **Rate limits**: soft limits of 200,000 input and 200,000 output tokens per minute per account, counted separately. Upstream output limits can also return `429` ([rate limits](/docs/ai-gateway/models#rate-limits)).
- **Daily spend cap**: an account-level daily cap guards against runaway cost. If you exceed it, every AI Gateway endpoint returns `429` with `REQUEST_LIMIT_EXCEEDED` until it resets ([troubleshooting](/docs/ai-gateway/troubleshooting#429-account-quota-exceeded)).
- **No Free plan access**: AI Gateway isn't included in the Free plan. If you downgrade, your credits stay on the account and become usable again when you upgrade.
- **Some accounts can't self-serve**: sales-invoiced, marketplace, trial, sponsored, and shared-token accounts can't buy credits through the Console flow.
- **Regions**: AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore).

## Spend next to the rest of your backend

Because the gateway is part of your Neon project, model calls sit beside the resources that use them. A [Neon Function](/docs/compute/functions/overview) gets `DATABASE_URL`, `NEON_AI_GATEWAY_TOKEN`, and `NEON_AI_GATEWAY_BASE_URL` injected, so a request that reads Postgres and calls a model uses services that bill on the same account ([environment variables](/docs/compute/functions/environment-variables)). Every branch gets its own gateway endpoint, and eval or preview traffic draws from the same balance ([branching](/docs/introduction/branching)).

## How other options compare

- **OpenRouter**: passes through provider pricing with no markup on inference, but charges a 5.5% fee ($0.80 minimum) when you buy credits, and 5% for crypto payments ([OpenRouter FAQ](https://openrouter.ai/docs/faq)).
- **Vercel AI Gateway**: no markup and no added fee on tokens, paid with prepaid AI Gateway Credits. Some optional capabilities, such as team-wide zero data retention and custom reporting, add surcharges ([pricing](https://vercel.com/docs/ai-gateway/pricing)).

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Buy credits and make a request" description="Add AI Gateway credits in the Console, then call any model with one Neon credential." buttonText="AI Gateway prepaid credits" buttonUrl="/docs/ai-gateway/prepaid-credits" />
