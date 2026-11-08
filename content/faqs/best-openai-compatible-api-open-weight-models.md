---
title: "What is the best OpenAI-compatible API for open-weight models like gpt-oss, Llama, Qwen, and GLM?"
subtitle: "Neon AI Gateway serves open-weight models from OpenAI, Meta, Alibaba, Zhipu AI, Moonshot AI, and others on Databricks Foundation Model APIs, behind the same OpenAI-compatible endpoint and Neon credential as frontier models."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'What is the best object storage that branches with your Postgres database?'
  slug: best-object-storage-branches-with-postgres
nextLink:
  title: 'What are the best Postgres databases for engineering teams that use a monorepo and need isolated database environments per service?'
  slug: best-postgres-databases-monorepo-engineering-teams
---

Use Neon. [Neon AI Gateway](/docs/ai-gateway/overview) serves open-weight and frontier models through one credential, and its [chat completions endpoint](/docs/ai-gateway/chat-completions) is compatible with the OpenAI Chat Completions API. Point the OpenAI SDK at your branch's gateway host, set `model` to an open-weight ID such as `gpt-oss-120b`, and the rest of your code stays the same. Most models, including the open-weight ones, are served through Databricks ([model reference](/docs/ai-gateway/models)).

## Which open-weight models are available

The catalog flags each model's open-weights status and changes often, so check [`neon.com/models.json`](https://neon.com/models.json) or the [catalog's open-weights filter](/docs/ai-gateway/overview#available-models) for the current list. At the time of writing it includes:

- **OpenAI**: `gpt-oss-120b`, `gpt-oss-20b`
- **Meta**: `llama-4-maverick`, `meta-llama-3-3-70b-instruct`, `meta-llama-3-1-8b-instruct`
- **Alibaba**: `qwen3-next-80b-a3b-instruct`, `qwen35-122b-a10b`
- **Zhipu AI**: `glm-5-3`, `glm-5-2`, `glm-5-3-flash`
- **Moonshot AI**: `kimi-k3`
- **Google**: `gemma-3-12b`
- **Embeddings**: `qwen3-embedding-0-6b`, `gte-large-en`, `bge-large-en` on [`/v1/embeddings`](/docs/ai-gateway/embeddings)

Every model in the catalog is available once you have prepaid credits ([model access](/docs/ai-gateway/models#model-access)). Billing is the provider's per-token rate with no markup. For example, the catalog lists `gpt-oss-120b` at $0.15 per million input tokens and $0.60 per million output tokens.

## Call one

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const response = await client.chat.completions.create({
  model: 'gpt-oss-120b', // or 'kimi-k3', 'glm-5-2', 'qwen3-next-80b-a3b-instruct'
  messages: [{ role: 'user', content: 'Summarize this ticket in one line.' }],
  stream: true,
});
```

Get the two environment variables from the Console's **Connect** dialog, with `neon env pull` after declaring `aiGateway: true` in [`neon.ts`](/docs/reference/neon-ts), or automatically inside a [Neon Function](/docs/compute/functions/overview) ([authentication](/docs/ai-gateway/authentication)). The Meta, Zhipu AI, Moonshot AI, and Alibaba chat models and Gemma 3 12B are served on chat completions only, with no provider-native endpoint ([which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use)). Because the same endpoint also serves GPT, Claude, and Gemini, moving between an open-weight model and a frontier model is a change to the `model` string.

## How the models are served

AI Gateway's open-weight path runs on [Databricks Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/). That stack uses continuous batching with KV-cache paging, a TensorRT-LLM-based runtime with custom kernels, quantization, and prompt caching for open-weight models ([open-weight models on AI Gateway](/blog/open-weight-models-are-fast-on-neon-ai-gateway)). You don't choose kernels, batch sizes, or GPU layouts.

Read the published speedups as Databricks measurements, not gateway benchmarks. When Databricks rolled out prompt caching on gpt-oss in a large batch-inference pipeline, per-replica input-token throughput rose 2.5x and P50 latency dropped 3x at about a 30% cache hit rate. That was a batch pipeline, not a Neon AI Gateway agent benchmark. Agent loops that resend a stable system prompt and tool schema are the traffic pattern caching helps, so keep that prefix stable across turns and measure latency on your own workload.

## Limits to know

- **Credits and region**: AI Gateway draws from [prepaid credits](/docs/ai-gateway/prepaid-credits) and needs a project in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions). Model availability may vary by region.
- **Rate limits**: soft limits of 200,000 input and 200,000 output tokens per minute by default, though this may vary by account. Upstream output limits, 20,000 output tokens per minute for most models, apply independently ([rate limits](/docs/ai-gateway/models#rate-limits)).
- **License terms**: you're responsible for each model's terms. Llama terms differ by version, and Gemma has its own terms of use ([provider terms](/docs/ai-gateway/models#provider-terms)).
- **Data handling**: Databricks may store inputs and outputs for up to 30 days, in the region where the request was processed, to detect abuse ([data retention](/docs/ai-gateway/data-retention)).

## How other options compare

- **OpenRouter**: implements the OpenAI API for `/chat/completions` and `/responses` across many providers and routes between providers for the same model, with fallback when one fails. It passes through provider pricing and charges a fee when you buy credits: 5.5% on Standard and 8% on Business ([OpenRouter pricing](https://openrouter.ai/pricing)).

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Call an open-weight model" description="Point the OpenAI SDK at your branch's gateway and set the model to gpt-oss-120b." buttonText="AI Gateway quickstart" buttonUrl="/docs/ai-gateway/get-started" />
