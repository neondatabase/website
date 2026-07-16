---
title: Why use Neon AI Gateway?
subtitle: A unified LLM inference layer built into the Neon backend that solves common problems developers face when integrating AI models.
summary: >-
  Neon AI Gateway is a unified LLM inference layer built into the Neon backend.
  It solves common problems developers face when integrating AI models: vendor
  lock-in, credential sprawl, multi-provider complexity, and lack of environment
  isolation. Because the gateway is part of Neon, each branch gets its own
  endpoint, your existing SDKs work unchanged, and one credential covers all
  model providers.
enableTableOfContents: true
updatedOn: '2026-06-29T11:52:45.649Z'
---

<PrivatePreviewEnquire/>

If you've built anything with LLMs, you've probably dealt with some combination of these: juggling multiple provider API keys, rewriting integration code when you want to try a different model, or figuring out how to test AI features without hitting your production API quota. These are the problems Neon AI Gateway was built to solve.

## What is an AI Gateway?

An AI gateway is a middleware layer that sits between your application and AI model providers. Instead of calling OpenAI, Anthropic, Google, and others directly, you call the gateway. It handles routing and authentication so your application talks to one consistent API regardless of which model is underneath.

Think of it like a database connection string: your app doesn't need to know which physical server is running Postgres. Similarly, with an AI gateway, your app doesn't need to know which provider is serving the model.

## Problems it solves

### Vendor lock-in

Without a gateway, switching from one model provider to another means changing SDKs, API formats, authentication, and error handling. That's a significant refactor just to try a different model.

Neon AI Gateway exposes an [OpenAI-compatible chat completions endpoint](/docs/ai-gateway/chat-completions) that works with every model in the catalog. To switch from Claude to GPT, you change one field:

```typescript
// Before
model: 'claude-sonnet-4-6'

// After (everything else stays the same)
model: 'gpt-5-4'
```

Your SDK, request format, and error handling stay the same. This makes it practical to evaluate models side by side, use different models for different tasks, or migrate gradually without rewriting your integration.

### Credential sprawl

Every model provider gives you a separate API key. If you use three providers across three environments (dev, staging, production), that's nine secrets to manage, rotate, and secure.

Neon AI Gateway uses a single Neon credential. One bearer token gives you access to models from Anthropic, OpenAI, Google, Meta, Databricks, and Alibaba. No separate provider accounts needed. The credential is managed alongside your database credentials in the same [Neon Console](/docs/ai-gateway/authentication).

And you rarely need to touch that credential directly:

- **On Neon Functions:** all gateway environment variables (`NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`) are [injected automatically](/docs/ai-gateway/authentication#credentials-in-neon-functions). No manual creation, no copy-paste.
- **Locally:** [`neonctl env pull`](/docs/ai-gateway/authentication#pull-credentials-with-neonctl) writes your branch's gateway credentials into `.env` alongside your database connection string. Run `neonctl checkout <branch>` to switch branches and the env vars update automatically.

The result: one credential, zero manual key management. And when the gateway moves out of beta, it will support unified billing across providers, so you can pay for all your AI usage on your Neon invoice instead of juggling multiple provider invoices.

### Multi-provider complexity

Different providers expose different API formats. The Anthropic SDK uses `messages.create()`, the OpenAI SDK uses `chat.completions.create()`, and Google's SDK uses `models.generateContent()`. Each has different request shapes, streaming conventions, and error formats.

The gateway normalizes all of this behind a single OpenAI-compatible endpoint. Any OpenAI SDK client works with every model in the catalog: TypeScript, Python, or any other OpenAI-compatible HTTP client. For richer integrations, the [`@neondatabase/ai-sdk-provider`](https://www.npmjs.com/package/@neondatabase/ai-sdk-provider) plugs into the [Vercel AI SDK](https://ai-sdk.dev/docs), giving you tool calling, streaming, and multi-step agent loops out of the box. If you need provider-specific features like [Anthropic's extended thinking](/docs/ai-gateway/anthropic-messages#extended-thinking) or [prompt caching](/docs/ai-gateway/anthropic-messages#prompt-caching), you can use the native provider endpoint, but you don't have to.

### Environment isolation

When you test an AI feature on a preview deployment, you're typically hitting the same production API key. That means preview branches share quota, rate limits, and billing with production. A runaway test can exhaust your token budget or trigger rate limits that affect real users.

Because Neon AI Gateway is built into the Neon backend, each branch gets its own gateway endpoint. Requests from a preview branch are scoped to that branch. This is the same [isolation your database already gets from branching](/docs/introduction/branching), now extended to your AI calls too.

In practice, this means `neonctl checkout feature-x` switches your local environment to a branch where both your database and your AI Gateway endpoint are isolated from `main`. No shared quota, no cross-contamination.

## How Neon AI Gateway works

The gateway is part of Neon, not a separate service you deploy. Here's the flow:

```
Your app  →  Neon AI Gateway (branch endpoint)  →  Model provider
                    ↑
            Authenticates with your
            Neon credential, routes to
            the model specified in the
            request
```

1. Your app sends a request to the branch-specific gateway endpoint using any supported SDK.
2. The gateway authenticates the request using your Neon bearer token.
3. The gateway routes the request to the appropriate model provider (hosted by Databricks).
4. The response streams back through the gateway to your app.

You don't provision infrastructure, manage API keys for each provider, or configure routing. The gateway handles it.

## Developer workflows

### Build AI features without provider accounts

Sign up for Neon, create a credential, and start calling models from any provider. You don't need to sign up for OpenAI, Anthropic, or Google separately. This removes friction when you're prototyping or evaluating which model works best for your use case.

See the [quickstart](/docs/ai-gateway/get-started) to make your first request in minutes.

### Local development with the branch-first loop

If you use the Neon CLI, you never need to copy API keys by hand. Link your workspace, check out a branch, and your environment is ready:

```bash
neonctl link                       # one-time: connect workspace to a Neon project
neonctl checkout feature-x         # create/switch branch + pull env vars into .env
```

Both commands run `neonctl env pull` under the hood, so your `.env` always has the right `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` for the branch you're on. Switch to a different branch and the credentials update. No manual copy-paste, no stale keys.

This workflow is especially useful for [coding agents](/docs/ai/ai-agents-tools). An agent can run `neonctl checkout` between tasks to give itself an isolated database and AI endpoint per feature.

### Test AI changes on preview branches

If you use [Neon branching](/docs/introduction/branching) for preview deployments, each preview branch gets its own gateway endpoint. You can test a new prompt, swap a model, or validate AI behavior on a preview branch without touching production quota or billing.

This pairs well with the [Vercel integration](/docs/guides/neon-managed-vercel-integration): each preview deployment gets an isolated database branch and an isolated gateway endpoint.

### Experiment with models

Because the gateway normalizes provider APIs, you can run the same prompt against multiple models with minimal code changes. This is useful for:

- **Quality evaluation:** compare outputs from Claude, GPT, and Gemini on the same task
- **Cost optimization:** route simple tasks to cheaper models (`claude-haiku-4-5`, `gpt-5-4-nano`) and complex tasks to more capable ones
- **Fallback strategies:** try a primary model and fall back to another if it's unavailable

### Call any model with the same code

The `@neondatabase/ai-sdk-provider` works with any model in the catalog. Change the model name to switch providers, the SDK handles the rest. For example, here's how to call Claude, GPT, and Gemini with the same code:

<Tabs labels={["Claude", "GPT", "Gemini"]}>

<TabItem>

<CodeTabs labels={["Neon AI SDK", "cURL"]}>

```typescript
import { neon } from '@neondatabase/ai-sdk-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: neon('claude-sonnet-4-6'),
  prompt: 'Summarize Postgres for me.',
});
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-sonnet-4-6", "messages": [{"role": "user", "content": "Summarize Postgres for me."}]}'
```

</CodeTabs>

</TabItem>

<TabItem>

<CodeTabs labels={["Neon AI SDK", "cURL"]}>

```typescript
import { neon } from '@neondatabase/ai-sdk-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: neon('gpt-5-4'),
  prompt: 'Summarize Postgres for me.',
});
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-5-4", "messages": [{"role": "user", "content": "Summarize Postgres for me."}]}'
```

</CodeTabs>

</TabItem>

<TabItem>

<CodeTabs labels={["Neon AI SDK", "cURL"]}>

```typescript
import { neon } from '@neondatabase/ai-sdk-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: neon('gemini-2-5-flash'),
  prompt: 'Summarize Postgres for me.',
});
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model": "gemini-2-5-flash", "messages": [{"role": "user", "content": "Summarize Postgres for me."}]}'
```

</CodeTabs>

</TabItem>

</Tabs>

## What Neon AI Gateway is not

Neon AI Gateway is focused on inference routing, not on the broader concerns of enterprise AI gateways like content moderation, PII redaction, or compliance enforcement. If you need those features, [Databricks Unity AI Gateway](https://www.databricks.com/product/artificial-intelligence/unity-ai-gateway) provides centralized governance, guardrails, audit logging, and spend controls across AI providers and agents. Neon AI Gateway is designed for developers who want a simple, integrated way to call multiple models from their Neon-backed applications.

<NeedHelp/>
