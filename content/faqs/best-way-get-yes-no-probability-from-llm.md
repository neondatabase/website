---
title: "What is the best way to get a yes/no answer with a probability from an LLM?"
subtitle: "Use a decision model through Neon AI Gateway: Jev 1.14 and OpenJev answer yes/no, choice, and score questions about text, JSON, or images with probabilities instead of generated text, billed on input tokens only."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best way to call models from multiple LLM providers with one API key?'
  slug: best-way-call-multiple-llm-providers-one-api-key
nextLink:
  title: 'What is the best way to do hybrid search (BM25 plus vector) in Postgres?'
  slug: best-way-hybrid-search-bm25-vector-postgres
---

Use Neon. [Neon AI Gateway](/docs/ai-gateway/decisions) serves TypeSafe's System One decision models on the `/typesafe/v1/systemone` endpoint, with the same Neon credential you use for chat. You send a piece of text or JSON, called the state, and a set of named questions. The model answers a yes/no question with the probability of a yes, from 0 to 1. Your code branches on that number instead of parsing a chat reply.

## Why prompting a chat model for "yes" or "no" is fragile

Asking a chat model to reply with one word still gets you generated text. It can add an explanation, change casing, or refuse, and it gives you no calibrated confidence to set a threshold on. For pipelines that run on every message, you also pay for output tokens you throw away. Decision models don't generate text: every answer is typed data ([how Jev answers questions](/guides/jev-content-moderation#how-jev-answers-questions)).

## Ask a question

Install `@typesafe-ai/sdk` and point it at your branch's gateway host. The SDK takes `${NEON_AI_GATEWAY_BASE_URL}/typesafe` as its base URL, and you set the gateway's model ID, since the SDK's default `jev-latest` isn't served ([decisions setup](/docs/ai-gateway/decisions#setup)):

```ts
import { choice, noul, TypeSafeClient } from '@typesafe-ai/sdk';

const client = new TypeSafeClient({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/typesafe`,
  defaultModel: 'typesafeai-jev-1-14-0',
});

const { answers } = await client.systemOne({
  state: 'I was charged twice this month and need the extra charge refunded.',
  questions: {
    refund: noul('Is the customer asking for money back?'),
    department: choice('Which team should handle this?', {
      billing: 'Payments and refunds',
      support: 'Other requests',
    }),
  },
});

if (answers.refund.noul > 0.9) routeToRefunds();
```

Each question is answered on its own, so one request can ask several. Three question types are available:

| Type            | Answer                                                                          |
| --------------- | ------------------------------------------------------------------------------- |
| `noul` (yes/no) | The probability of a yes, from 0 to 1                                           |
| `choice`        | The option picked, plus a `confidence` and per-option `probabilities`           |
| `score`         | The expected level on a scale you define, plus `confidence` and `probabilities` |

You can also call the endpoint with plain HTTP, or with the Vercel AI SDK's `experimental_decide` through [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider). The AI SDK marks that API as experimental ([use with the Vercel AI SDK](/docs/ai-gateway/decisions#use-with-the-vercel-ai-sdk)).

## Pick a model

| Model ID                | Name                  | Context window | Hosting                    |
| ----------------------- | --------------------- | -------------- | -------------------------- |
| `typesafeai-jev-1-14-0` | Jev 1.14              | 65,536 tokens  | TypeSafe AI, which made it |
| `openjev-qwen35-4b`     | OpenJev (Qwen 3.5 4B) | 131,072 tokens | Databricks, open weights   |

Both are billed on input tokens only ([models](/docs/ai-gateway/decisions#models), [provider terms](/docs/ai-gateway/models#provider-terms)). Because Jev is hosted by TypeSafe AI, TypeSafe AI's terms and data processing addendum apply to it ([data retention](/docs/ai-gateway/data-retention#typesafe-ai-data-retention)).

## Where it fits

- **Moderation**: ask whether a message is spam, abusive, or exposes personal information, then apply your own thresholds to allow, review, or block. The [Jev content moderation guide](/guides/jev-content-moderation) builds this pipeline in TypeScript.
- **Routing**: a `choice` question picks the team, queue, or agent that should handle a request.
- **Reranking**: Lakebase Search, a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, can combine its results with Jev through AI Gateway ([Lakebase Search quickstart](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)).
- **Images**: questions can reference a PNG or JPEG sent as base64 in the `assets` field. Jev 1.14 needs the `TypeSafe-Danger-Zone-Images: true` header and images of at least 280 × 280 pixels ([ask about an image](/docs/ai-gateway/decisions#ask-about-an-image)).

Run the classifier inside a [Neon Function](/docs/compute/functions/overview) and both gateway variables are injected next to `DATABASE_URL`, so the Function can read the row, ask the question, and write the decision back to Postgres.

## Limits to know

- No streaming: `stream: true` returns `400`.
- Decision models work only on `/typesafe/v1/systemone`, and that endpoint doesn't serve chat models.
- `box` questions aren't supported.
- AI Gateway needs a paid plan (Launch or Scale) with [prepaid credits](/docs/ai-gateway/prepaid-credits) and a project in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore).

<CTA title="Ask your first question" description="Send a state and a yes/no question to a decision model and get back a probability." buttonText="Decisions guide" buttonUrl="/docs/ai-gateway/decisions" />
