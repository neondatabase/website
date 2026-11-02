---
title: "What is the best way to call models from multiple LLM providers with one API key?"
subtitle: "Use Neon AI Gateway: one Neon credential and one OpenAI-compatible endpoint reach models from OpenAI, Anthropic, Google, and open-weight labs, and you switch models by changing the model string."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best way to add OAuth to an MCP server?'
  slug: best-way-add-oauth-to-mcp-server
nextLink:
  title: 'What is the best way to get a yes/no answer with a probability from an LLM?'
  slug: best-way-get-yes-no-probability-from-llm
---

Use Neon. [Neon AI Gateway](/docs/ai-gateway/overview) serves models from many providers behind one Neon credential. The [chat completions endpoint](/docs/ai-gateway/chat-completions) is compatible with the OpenAI Chat Completions API and works with every chat model in the catalog, so the OpenAI SDK you already use talks to GPT, Claude, Gemini, Llama, Qwen, and other models once you change its base URL and key. No provider API keys are needed ([authentication](/docs/ai-gateway/authentication)).

## Why one key per provider gets messy

Calling each lab directly means one account, one key, one bill, and one rate-limit dashboard per provider. Every environment needs the right key, and trying a different model often means adding a new SDK and a new secret. With AI Gateway, usage from every model draws down one prepaid credit balance on your Neon bill, at the same per-token rate the provider charges ([pricing](/docs/ai-gateway/models#pricing)).

## One client, any model

Create a credential with the `ai_gateway:invoke` scope, or declare `aiGateway: true` in [`neon.ts`](/docs/reference/neon-ts) and run `neon deploy`, which provisions the credential and pulls `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` into your `.env` ([get started](/docs/ai-gateway/get-started)). Then point the OpenAI SDK at your branch's gateway host:

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const response = await client.chat.completions.create({
  model: 'gpt-5-mini', // or 'gemini-3-flash', 'qwen3-next-80b-a3b-instruct'
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

Switching providers means changing the `model` field. Streaming works the same way as with OpenAI: add `stream: true`. The quickstart runs from a plain Node or Python script, so your app doesn't have to run on Neon. Inside a [Neon Function](/docs/compute/functions/overview), both gateway variables are injected next to `DATABASE_URL`, so there's no credential step at all ([environment variables](/docs/compute/functions/environment-variables)).

For TypeScript apps on the Vercel AI SDK, [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) reads the same variables and routes each catalog model to the right endpoint. The `mastra` starter template (`neon bootstrap --template mastra`) shows Mastra calling models through the gateway ([overview](/docs/ai-gateway/overview#starter-templates)).

## Native endpoints for provider-specific features

Chat completions is the recommended starting point, but the same credential also reaches each provider's own API shape ([which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use)):

- [`/anthropic/v1/messages`](/docs/ai-gateway/anthropic-messages) for the Anthropic SDK, extended thinking, and prompt caching.
- [`/openai/v1/responses`](/docs/ai-gateway/openai-responses) for the Responses API. Codex variants such as `gpt-5-3-codex` require it.
- [`/gemini/v1beta/models/{model}:generateContent`](/docs/ai-gateway/gemini) for the `google-genai` SDK.
- [`/v1/embeddings`](/docs/ai-gateway/embeddings) for embedding models and [`/typesafe/v1/systemone`](/docs/ai-gateway/decisions) for decision models.

`GET /v1/models` lists the catalog in an OpenRouter-shaped response, and [`neon.com/models.json`](https://neon.com/models.json) is the machine-readable source of truth for model IDs and per-token rates.

## Limits to know

- **Paid plans only**: AI Gateway needs a Launch or Scale plan with [prepaid credits](/docs/ai-gateway/prepaid-credits) ($5 minimum purchase). Any paid account with credits can call every model in the catalog.
- **Regions**: your project must be in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore).
- **Rate limits**: soft limits of 200,000 input and 200,000 output tokens per minute per account, counted separately ([rate limits](/docs/ai-gateway/models#rate-limits)).
- **Response shape**: a few models return `message.content` as an array of content blocks instead of a string, so handle both when you swap in a new model.
- **Data handling**: most models run on Databricks Model Serving, which may store inputs and outputs for up to 30 days to detect abuse ([data retention](/docs/ai-gateway/data-retention)).

## How other options compare

- **OpenRouter**: an OpenAI-compatible API across many providers. It passes through provider pricing with no inference markup, but charges a 5.5% fee ($0.80 minimum) when you buy credits. It also supports bringing your own provider keys ([OpenRouter FAQ](https://openrouter.ai/docs/faq)).
- **Vercel AI Gateway**: provider list prices with no markup, paid through prepaid AI Gateway Credits. Free monthly credits cover a subset of models, and purchased credits unlock the full catalog ([pricing](https://vercel.com/docs/ai-gateway/pricing)).

On Neon, the gateway is part of the same project as your database, and each [branch](/docs/introduction/branching) gets its own gateway endpoint.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Make your first gateway request" description="Create a credential, point the OpenAI SDK at your branch, and call any model in the catalog." buttonText="AI Gateway quickstart" buttonUrl="/docs/ai-gateway/get-started" />
