---
title: Model reference
subtitle: Which models exist, how to call them, and the rules that apply
summary: >-
  Reference for Neon AI Gateway: model access and how to request foundation
  models, which endpoint to use, shorter and longer request paths, the
  /v1/models API, rate limits, pricing, and provider terms.
enableTableOfContents: true
updatedOn: '2026-09-26T00:49:26.569Z'
---

Neon AI Gateway serves models hosted by Databricks. Use short model IDs in the `model` field, for example `gpt-5-mini` or `gemini-3-flash`. The `databricks-` prefixed form is also accepted. The Neon Console and most examples use the short form.

<Admonition type="important">
Models are hosted by Databricks and served through Neon AI Gateway. By using these models, you are responsible for complying with each provider's applicable terms of use. See [Provider terms](#provider-terms) below.
</Admonition>

Model availability may vary by region, and the catalog expands over time, so check back for new additions.

> AI Gateway is currently available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Create your project in one of these regions to use it. Support is expanding toward [all regions](/docs/introduction/regions). It requires a paid Neon plan. See [Pricing](#pricing) for details.

The full catalog is served as JSON at [`neon.com/models.json`](https://neon.com/models.json), the machine-readable source of truth, and mirrored as the [`neon` provider on models.dev](https://models.dev/providers/neon).

Every model in the catalog carries a `released` boolean. `false` marks a model listed ahead of its announcement: it stays in `neon.com/models.json` and `neon.com/models`, and an app that shows a model list should leave it out:

```js
const models = Object.values(catalog.neon.models).filter((model) => model.released);
```

## Model access

Neon AI Gateway gives you one credential for both open-weight and foundation models. Any paid project with prepaid credits can use the open-weight models right away. Foundation models are rolled out gradually, so the full catalog opens up over time. The [model catalog](/docs/ai-gateway/overview#available-models) is always the source of truth for what you can call today.

To request access to foundation models that aren't enabled for your project yet, drop your email below and we'll reach out as access opens up.

<RequestForm type="backend-platform" title="Request access to foundation models" description="Drop your email and we'll reach out as access opens up." buttonText="Request access" confirmation="You're on the list. We'll be in touch as access opens up." />

## Rate limits

The following limit applies per account:

| Limit                   | Value   |
| ----------------------- | ------- |
| Tokens per minute (TPM) | 200,000 |

If you hit the limit, you'll receive a `429 Too Many Requests` response with a message like `ai gateway per-minute token limit exceeded for model "<model-id>"`. Requests resume when the rate limit window resets.

The TPM limit is counted against total tokens (input and output combined), not input alone. Upstream output token limits (20,000 OTPM for most models) apply independently, so you can hit a `429` on output tokens without reaching the gateway's TPM limit. See [Databricks Foundation Model API limits](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/limits) for details.

The 200,000 TPM ceiling is a soft limit. If you need a higher limit, [contact Support](/docs/introduction/support).

A separate account-level daily spend cap also applies and can block AI Gateway requests with a `429` / `REQUEST_LIMIT_EXCEEDED`. It isn't a fixed published number and can vary by account. See [Pricing](#pricing) for details, or [Troubleshooting](/docs/ai-gateway/troubleshooting#429-account-quota-exceeded) if you hit it.

## Pricing

AI Gateway usage draws down a prepaid credit balance. Here's how pricing works:

- **Paid plans only.** AI Gateway is available on Neon's Launch and Scale plans, with no difference in pricing or model access between the two. Any paid customer with prepaid credits can use the open-weight models. See [Model access](#model-access) for the full foundation model catalog.
- **No markup.** Neon charges the same per-token rate as the model provider. Published provider prices are passed on to users with no additional markup.
- **Prepaid credits.** Inference draws down a prepaid credit balance. 1 credit equals $1 USD, with a $5 minimum purchase, and credits are valid for 12 months from purchase. You buy credits from the **Billing** page in the [Neon Console](https://console.neon.tech/app/billing).

See the [model catalog](/docs/ai-gateway/overview#available-models) for per-model rates, and [AI Gateway prepaid credits](/docs/ai-gateway/prepaid-credits) for how to buy credits and manage your balance.

Independent of billing, Neon enforces an account-level daily spend cap on AI Gateway usage, separate from the per-minute rate limits above. If your account exceeds it, every AI Gateway endpoint returns `429 Too Many Requests` with error code `REQUEST_LIMIT_EXCEEDED` until the cap resets or the block is lifted. Neon hasn't published a fixed cap value; it isn't a flat number and can vary by account. See [Troubleshooting](/docs/ai-gateway/troubleshooting#429-account-quota-exceeded) if you hit this.

## Which endpoint to use

Most models work with the [Chat completions](/docs/ai-gateway/chat-completions) endpoint. It is the recommended starting point and works with all providers. Use a provider-specific endpoint when required:

All paths below are appended to your branch's bare AI Gateway host (`NEON_AI_GATEWAY_BASE_URL`).

| Provider                                       | Recommended endpoint   | Notes                                                                         |
| ---------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| OpenAI (most models)                           | `/v1/chat/completions` | Use `/openai/v1/responses` for Responses API features                         |
| OpenAI (`gpt-5-3-codex`, `gpt-5-5-pro`)        | `/openai/v1/responses` | These models require the Responses API and don't work with chat/completions   |
| Google Gemini                                  | `/v1/chat/completions` | Use `/gemini/v1beta/models/{model}:generateContent` with the google-genai SDK |
| Google Gemma 3 12B                             | `/v1/chat/completions` | Chat completions only. Doesn't support the Gemini SDK endpoint                |
| Meta, Zhipu AI, Thinking Machines, Moonshot AI | `/v1/chat/completions` | Chat completions only                                                         |
| Alibaba (chat models)                          | `/v1/chat/completions` | Chat completions only                                                         |
| Alibaba (embedding models)                     | `/v1/embeddings`       | No chat completions — returns a vector, not text                              |

## Shorter paths

Each inference dialect is reachable at two equivalent paths: a shorter top-level path (recommended, and what most examples and the `@neon/ai-sdk-provider` use) and a longer `/ai-gateway/<dialect>/v1` path. Both forms behave identically, using the same branch host, bearer token, request body, response body, model routing, rate limits, and quota, and **neither is deprecated**. The longer `/ai-gateway/...` paths keep working indefinitely.

The shorter form isn't a uniform `/v1/<dialect>` rule. The unified chat completions endpoint is a bare `/v1/chat/completions`, matching the OpenAI and OpenRouter convention. The native dialects are prefixed by provider instead, and each keeps its own upstream version segment so the path matches what that provider's SDK expects: `/openai/v1/...` and `/gemini/v1beta/...`.

Use the shorter paths when you want OpenAI/OpenRouter-style URLs. Use the `/ai-gateway/...` paths when a framework or existing Neon example expects the older dialect-specific route.

| Shorter path                                         | Equivalent to                                              |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| `POST /v1/chat/completions`                          | `/ai-gateway/mlflow/v1/chat/completions`                   |
| `POST /openai/v1/responses`                          | `/ai-gateway/openai/v1/responses`                          |
| `POST /gemini/v1beta/models/{model}:generateContent` | `/ai-gateway/gemini/v1beta/models/{model}:generateContent` |

### List available models

`GET /v1/models` lists the model catalog in an OpenRouter-shaped response, authenticated the same way as the endpoints above. Unlike the inference dialects, the model list has only this `/v1/models` path, with no `/ai-gateway/...` form.

```bash shouldWrap
curl "$NEON_AI_GATEWAY_BASE_URL/v1/models" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN"
```

```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-5-mini",
      "canonical_slug": "gpt-5-mini",
      "name": "GPT-5 Mini",
      "object": "model",
      "owned_by": "openai",
      "created": 0,
      "enabled": true,
      "context_length": null,
      "architecture": {
        "modality": "text->text",
        "input_modalities": ["text"],
        "output_modalities": ["text"],
        "tokenizer": "GPT",
        "instruct_type": null
      },
      "top_provider": {
        "is_moderated": false,
        "context_length": null,
        "max_completion_tokens": null
      },
      "pricing": null,
      "per_request_limits": null
    }
  ]
}
```

The response returns one object per model. Key fields:

- `enabled` is whether your account can call the model. If `false`, a request returns a `403` (see [Troubleshooting](/docs/ai-gateway/troubleshooting#403-model-requires-a-verified-account)). Gated models are sometimes left out of the list entirely, so use `enabled: true` as your check. See [Model access](#model-access) for what determines access and how to request more models.
- `id`, `name`, and `owned_by` identify the model. Use `id` (or its `databricks-` prefixed form) in the `model` field of a request.
- `canonical_slug`, `architecture`, and `top_provider` are OpenRouter-compatible descriptive fields.
- `created` is always `0`, and `pricing`, `per_request_limits`, and `context_length` are currently always `null`. Use the [model catalog](/docs/ai-gateway/overview#available-models) for context windows and model details.

### Check what your account can call

To list only the models your account can call, filter on `enabled`:

```bash shouldWrap
curl "$NEON_AI_GATEWAY_BASE_URL/v1/models" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  | jq -r '.data[] | select(.enabled) | .id'
```

## Provider terms

Models are hosted by Databricks and served through Neon AI Gateway. You are responsible for complying with each provider's applicable terms of use.

| Provider      | Terms                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI        | [OpenAI Usage Policies](https://openai.com/policies/usage-policies)                                                                                                                 |
| Google Gemini | [Google Cloud Acceptable Use Policy](https://cloud.google.com/terms/aup) · [Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy) |
| Google Gemma  | [Gemma Terms of Use](https://ai.google.dev/gemma/terms) · [Gemma Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy)                                          |
| Meta          | Terms differ by Llama version. See the Notes column in the [Meta models table](#meta).                                                                                              |

<Admonition type="important">
Use of AI Gateway is subject to our Terms of Service. Access is not available to users, organizations, or entities located in or operating from regions restricted by Anthropic's [Supported Regions Policy](https://www.anthropic.com/supported-countries). This restriction also applies to entities that are majority owned, directly or indirectly, by companies headquartered in unsupported regions.
</Admonition>

<NeedHelp/>
