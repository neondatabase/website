---
title: Prompt caching
subtitle: Reuse a repeated prompt prefix to cut input cost and latency
summary: >-
  How prompt caching works on Neon AI Gateway: which models cache
  automatically, how to add cache_control for Claude models, how to confirm a
  cache hit in the response usage, and how cache-read and cache-write tokens
  are priced.
enableTableOfContents: true
updatedOn: '2026-11-20T17:03:32.892Z'
---

Prompt caching lets a model reuse work it already did for the start of a prompt. When a request begins with the same tokens as a recent request, such as a long system prompt, a reference document, tool definitions, or the earlier turns of a conversation, the provider reads that prefix from its cache instead of processing it again. Cached input tokens are billed at a lower cache-read rate and the response comes back faster.

Caching happens at the model provider. Neon AI Gateway passes your request through, so the provider's caching rules apply. Most models cache automatically. Claude models cache only when you mark the prompt with `cache_control`.

Prompt caching never caches responses. Every request still generates a new answer. If you want to return a stored answer for a repeated request, cache it in your application.

## How caching works

A cache hit needs a shared prefix, not an identical prompt. The provider matches your prompt from the first token and reuses the longest part it already has. Everything after the first token that differs is processed at the normal input rate.

That's why caching suits:

- **Multi-turn chat and agents.** Each turn resends the conversation so far, so every turn after the first can read the previous turns from cache.
- **Long system prompts and tool definitions.** Requests that share the same instructions and tools reuse them.
- **Repeated questions about one document.** Put the document first and the question last.

Cache entries are short-lived. A prefix that isn't reused for a few minutes is usually gone, and providers only cache prompts above a minimum length, typically around 1,000 tokens. A cache hit is never guaranteed, so treat it as a cost and latency optimization, not something your app depends on.

## Caching by model

| Lab                                | How caching works                     | What you do                                                                           |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| Anthropic (Claude)                 | Explicit. Only marked prefixes cache. | Add `cache_control` to the prompt. See [Cache Claude prompts](#cache-claude-prompts). |
| OpenAI (GPT)                       | Automatic                             | Nothing                                                                               |
| Google (Gemini)                    | Automatic                             | Nothing                                                                               |
| Zhipu AI (GLM), Moonshot AI (Kimi) | Automatic                             | Nothing                                                                               |

To see a specific model's cache rates, check its `pricing` object in [`/v1/models`](#cache-pricing).

## Cache Claude prompts

Claude models cache a prompt only up to a `cache_control` breakpoint. Put the content that stays the same at the start of the prompt and mark the last block of it with `cache_control: { type: 'ephemeral' }`. Everything up to and including that block is cached.

`cache_control` works on both the [chat completions](/docs/ai-gateway/chat-completions) endpoint and the [Anthropic Messages](/docs/ai-gateway/anthropic-messages) endpoint. Both endpoints share one cache, so a prefix written through one can be read through the other.

On chat completions, `cache_control` goes on a text content block, so send the system message as an array of blocks instead of a plain string:

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
import { readFileSync } from 'node:fs';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const handbook = readFileSync('handbook.md', 'utf8');

// cache_control isn't in the OpenAI SDK types, so build the block separately.
const cachedHandbook = {
  type: 'text' as const,
  text: handbook,
  cache_control: { type: 'ephemeral' },
};

const response = await client.chat.completions.create({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  messages: [
    { role: 'system', content: [cachedHandbook] },
    { role: 'user', content: 'What is required before a production deployment?' },
  ],
});

console.log(response.usage);
// First call:  { cache_creation_input_tokens: 13627, cache_read_input_tokens: 0, ... }
// Second call: { cache_creation_input_tokens: 0, cache_read_input_tokens: 13627, ... }
```

```python shouldWrap
import os
from pathlib import Path
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

handbook = Path("handbook.md").read_text()

response = client.chat.completions.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {
            "role": "system",
            "content": [
                {"type": "text", "text": handbook, "cache_control": {"type": "ephemeral"}}
            ],
        },
        {"role": "user", "content": "What is required before a production deployment?"},
    ],
)

print(response.usage)
```

```bash shouldWrap
jq -n --rawfile handbook handbook.md '{
  "model": "claude-sonnet-5",
  "max_tokens": 1024,
  "messages": [
    {"role": "system", "content": [{"type": "text", "text": $handbook, "cache_control": {"type": "ephemeral"}}]},
    {"role": "user", "content": "What is required before a production deployment?"}
  ]
}' | curl -X POST "$NEON_AI_GATEWAY_BASE_URL/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @-
```

</CodeTabs>

Run the request twice. The first call writes the prefix to the cache and reports it in `cache_creation_input_tokens`. The second call reads it and reports it in `cache_read_input_tokens`. A request with no `cache_control` reports `0` for both, however often you repeat it.

For the same request with the Anthropic SDK, see [Prompt caching](/docs/ai-gateway/anthropic-messages#prompt-caching) on the Anthropic Messages page. Anthropic's [prompt caching guide](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) covers where you can place breakpoints, including tool definitions and images, and the minimum cacheable length for each model.

### Cache lifetime

A Claude cache entry lasts five minutes by default, and each cache hit refreshes it. If your app often pauses longer than that between requests, as a long-running agent might, request a one-hour lifetime with `ttl`:

```json
{ "type": "text", "text": "...", "cache_control": { "type": "ephemeral", "ttl": "1h" } }
```

The usage object reports one-hour writes in `cache_creation.ephemeral_1h_input_tokens` and five-minute writes in `cache_creation.ephemeral_5m_input_tokens`.

## Confirm a cache hit

There's no cache-hit flag in the response. Check the cached token count in `usage` instead. A positive count means the provider read that many input tokens from cache. A zero count means a cache miss, a prompt below the minimum length, or a model that doesn't report caching.

The field name depends on the endpoint and, on chat completions, on the model:

| Endpoint                                        | Models                        | Cached tokens read                          | Cache tokens written                                                  |
| ----------------------------------------------- | ----------------------------- | ------------------------------------------- | --------------------------------------------------------------------- |
| `/v1/chat/completions`                          | OpenAI, Zhipu AI, Moonshot AI | `usage.prompt_tokens_details.cached_tokens` | `usage.prompt_tokens_details.cache_write_tokens` (some OpenAI models) |
| `/v1/chat/completions`                          | Claude, Gemini                | `usage.cache_read_input_tokens`             | `usage.cache_creation_input_tokens` (Claude)                          |
| `/openai/v1/responses`                          | OpenAI                        | `usage.input_tokens_details.cached_tokens`  | `usage.input_tokens_details.cache_write_tokens`                       |
| `/anthropic/v1/messages`                        | Claude                        | `usage.cache_read_input_tokens`             | `usage.cache_creation_input_tokens`                                   |
| `/gemini/v1beta/models/{model}:generateContent` | Gemini                        | `usageMetadata.cachedContentTokenCount`     | Not applicable                                                        |

On chat completions, read both places so the same code works for every model:

```typescript
const cachedTokens =
  response.usage?.prompt_tokens_details?.cached_tokens ??
  (response.usage as { cache_read_input_tokens?: number } | undefined)?.cache_read_input_tokens ??
  0;
```

Cached tokens are part of the input count. On chat completions, `prompt_tokens` includes them. On the Anthropic Messages endpoint, `input_tokens` counts only the tokens that weren't read from or written to cache, so the full input is the sum of `input_tokens`, `cache_read_input_tokens`, and `cache_creation_input_tokens`.

## Cache pricing

Cached input has its own rates, separate from the base input rate:

- **Cache read.** Input tokens read from cache. This rate is much lower than the base input rate, usually about a tenth of it.
- **Cache write.** Input tokens written to cache. Only some models list this rate, including Claude models and some newer OpenAI models. It's higher than the base input rate.

As with all AI Gateway usage, Neon passes on the provider's published rates [with no markup](/docs/ai-gateway/models#pricing). To get a model's current rates, call `GET /v1/models` and read its `pricing` object. Rates are in USD per token:

```bash
curl "$NEON_AI_GATEWAY_BASE_URL/v1/models" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN"
```

```json
{
  "id": "claude-sonnet-5",
  "pricing": {
    "prompt": "0.000002",
    "completion": "0.00001",
    "input_cache_read": "0.0000002",
    "input_cache_write": "0.0000025"
  }
}
```

| Field               | Meaning                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| `prompt`            | Base input rate                                                             |
| `completion`        | Output rate                                                                 |
| `input_cache_read`  | Rate for input tokens read from cache                                       |
| `input_cache_write` | Rate for input tokens written to cache, if any                              |
| `overrides`         | Different rates above a prompt size threshold (`min_prompt_tokens`), if any |

The same rates are in the [model catalog](https://neon.com/models.json) as `cost.cache_read` and `cost.cache_write`, in USD per million tokens.

### When caching saves money

For most models with automatic caching there's nothing to weigh: they have no cache-write rate, and every hit is cheaper than base input.

When a model has a cache-write rate, as Claude models do, a write costs more than base input, so caching a prefix pays off only if it's read again. One cache read usually saves more than the write premium costs. Multi-turn conversations, agents, and tool-use loops reread the prefix on every turn and come out well ahead. A true one-shot request that never repeats pays the write premium for nothing, so leave `cache_control` off those.

## Get more cache hits

- **Put static content first.** Order your prompt from most stable to least stable: tool definitions, system prompt, reference documents, conversation history, then the new user message.
- **Keep the prefix byte-for-byte identical.** A timestamp, request ID, or user name near the top of the system prompt breaks the match at that point. So does reordering tools or changing their descriptions.
- **Append, don't rewrite.** Agents that summarize or prune earlier turns change the prefix and lose the cache from that point on.
- **Reuse within the cache lifetime.** Entries expire after a few minutes without use. For Claude, use [`ttl: "1h"`](#cache-lifetime) for workloads with longer gaps.

## Next steps

- [Chat completions](/docs/ai-gateway/chat-completions): call any model through the OpenAI-compatible endpoint
- [Anthropic Messages API](/docs/ai-gateway/anthropic-messages): use the Anthropic SDK with Claude models
- [Model reference](/docs/ai-gateway/models): endpoints, rate limits, and pricing

<NeedHelp/>
