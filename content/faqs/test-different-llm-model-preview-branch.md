---
title: "How do I test a different LLM model on a preview branch before switching production?"
subtitle: "Branch your Neon backend, deploy the branch with a different model ID through Neon AI Gateway, and run your evals against a copy-on-write clone of production data. Production keeps its model until you merge the change."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Is there a Supabase Realtime alternative that supports live queries with joins and aggregates?'
  slug: supabase-realtime-alternative-live-sql-joins
nextLink:
  title: 'What tools allow restoring a database to before a bug occurred?'
  slug: tools-for-restoring-database-before-bug
---

Use Neon. A [Neon branch](/docs/introduction/branching) is a copy-on-write clone of your database, and it also gets its own Functions deployment and its own [AI Gateway](/docs/ai-gateway/overview) endpoint. Because AI Gateway serves models from many providers behind one credential, trying another model on the branch is a one-string change. You test it against production-shaped data while production keeps calling its current model.

## Why model swaps are hard to test

A model change alters tone, tool-calling behavior, output format, and cost all at once. Testing it on a handful of hand-written prompts misses the edge cases in real data, and testing it in production risks bad answers for real users. Testing against a separate provider account adds another key to manage. On Neon, the eval environment is a branch: same schema, same rows, same files, same credential system.

## Make the model a deploy-time setting

Read the model ID from an environment variable in your [Function](/docs/compute/functions/overview), so each branch can deploy with its own value:

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const response = await client.chat.completions.create({
  model: process.env.CHAT_MODEL ?? 'gpt-5-mini',
  messages,
});
```

Inside a Function, `NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL`, and `DATABASE_URL` are injected for the branch the Function runs on. Declare `CHAT_MODEL` in the function's `env` field in [`neon.ts`](/docs/reference/neon-ts). Values there are resolved when `neon deploy` runs, so they can come from `process.env` ([environment variables](/docs/compute/functions/environment-variables#in-neonts)):

```ts
functions: {
  chat: {
    name: 'Chat',
    source: './functions/chat.ts',
    env: { CHAT_MODEL: process.env.CHAT_MODEL ?? 'gpt-5-mini' },
  },
},
aiGateway: true,
```

## Run the eval on a branch

```bash
neon checkout eval/sonnet --create         # branch from the default branch and switch to it
CHAT_MODEL=claude-sonnet-5 neon deploy     # deploy this branch's Function with the new model
```

`neon deploy` provisions the branch's services and writes its credentials into `.env` ([backend overview](/docs/get-started/backend-overview#branch-your-whole-backend)). The branch's Function now answers from the branch's copy of your data with the new model, at its own URL. Run your eval set against both URLs, or write model outputs into an eval table on the branch and compare them with SQL. Nothing you write on the branch reaches production.

The same loop covers retrieval changes. On a branch, you can re-embed your content with a different [embedding model](/docs/ai-gateway/embeddings) or vector size, run evals against real data, and keep the change only if it wins ([generate embeddings with AI Gateway](/blog/generate-embeddings-with-neon-ai-gateway)).

To keep eval branches from piling up, give new branches a TTL with the `branch` function in `neon.ts`, or [set an expiration](/docs/guides/branch-expiration) when you create one.

## Things to check when you swap models

- **Response shape**: for most models `message.content` is a string, but some return an array of content blocks, for example once a model reasons. Handle both shapes ([which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use)).
- **Unsupported parameters**: Gemini models reject `parallel_tool_calls: false`, and `gemini-4-argon` rejects `temperature` and `reasoning_effort` on chat completions ([chat completions](/docs/ai-gateway/chat-completions#switching-models)).
- **Endpoint requirements**: Codex variants such as `gpt-5-3-codex` work only on the [Responses API endpoint](/docs/ai-gateway/openai-responses).
- **Cost**: eval traffic draws down the same prepaid credit balance as production, at each provider's per-token rate. Compare per-model rates in [`neon.com/models.json`](https://neon.com/models.json) before you switch.
- **Rate limits**: the 200,000 input and output tokens per minute soft limits apply per account, so a large eval run shares headroom with production ([rate limits](/docs/ai-gateway/models#rate-limits)).

AI Gateway needs a paid plan (Launch or Scale) with [prepaid credits](/docs/ai-gateway/prepaid-credits) and a project in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore).

## Ship the winner

When the new model wins, deploy it to production the same way: set `CHAT_MODEL` and run `neon deploy` on the default branch. Because the model is a string and the credential doesn't change, there's no new SDK, key, or billing account to add.

<CTA title="Branch your backend for an eval" description="See how a branch forks Postgres, Functions, and AI Gateway together." buttonText="Backend overview" buttonUrl="/docs/get-started/backend-overview" />
