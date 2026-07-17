---
title: AI Gateway models
subtitle: Available models and how to specify them
summary: >-
  Neon AI Gateway serves Databricks-hosted foundation models from Anthropic,
  OpenAI, Google, Meta, Databricks, and Alibaba. Use short model IDs
  like claude-sonnet-4-6 or gpt-5-mini. The databricks- prefix is also accepted.
enableTableOfContents: true
updatedOn: '2026-07-17T11:46:46.418Z'
---

<FeatureBetaProps feature_name="Neon AI Gateway" />

Neon AI Gateway serves models hosted by Databricks. Use short model IDs in the `model` field, for example `claude-sonnet-4-6`, `gpt-5-mini`, or `gemini-2-5-flash`. The `databricks-` prefixed form is also accepted. The Neon Console and most examples use the short form.

<Admonition type="important">
Models are hosted by Databricks and served through Neon AI Gateway. By using these models, you are responsible for complying with each provider's applicable terms of use. See [Provider terms](#provider-terms) below.
</Admonition>

Model availability may vary by region, and the catalog expands over time, so check back for new additions.

The full catalog is published as the [`neon` provider on models.dev](https://models.dev/providers/neon), the machine-readable source of truth, and served as JSON at [`neon.com/models.json`](https://neon.com/models.json).

## Model access

Neon AI Gateway serves frontier models like Claude (`claude-sonnet-4-6`), GPT (`gpt-5`), and Gemini (`gemini-2-5-flash`) alongside open-weight models like Qwen and gpt-oss. See the full list in the [catalog](#available-models) below.

Open-weight models are available to every project right away. Frontier models from Anthropic, OpenAI, and Google are rolling out gradually. Don't see them in your project yet? [Request early access](/docs/ai-gateway/overview#foundation-model-access).

## Available models

Browse the full catalog below. Switch between the **Text** and **Image** tabs, filter by provider or open weights, sort any column, and click a model for a copy-paste quickstart (AI SDK, Mastra, Python, TypeScript, or cURL). The endpoint each snippet targets is baked into its base URL: `/v1` for chat completions, `/openai/v1` for the Responses API (image generation).

<AiGatewayModelIndex/>

For full request paths and when to prefer each endpoint, see [Which endpoint to use](#which-endpoint-to-use).

## Rate limits

During the beta, the following limit applies per account:

| Limit                   | Value   |
| ----------------------- | ------- |
| Tokens per minute (TPM) | 200,000 |

If you hit the limit, you'll receive a `429 Too Many Requests` response with a message like `ai gateway TPM limit exceeded for model "<model-id>"`. Requests resume when the rate limit window resets.

The TPM limit is counted against total tokens (input and output combined), not input alone. Upstream output token limits (20,000 OTPM for most models) apply independently, so you can hit a `429` on output tokens without reaching the gateway's TPM limit. See [Databricks Foundation Model API limits](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/limits) for details.

Once billing begins, usage will also be capped by your prepaid credit balance. See [Pricing](#pricing) below.

## Pricing

Inference is free during the beta. See [Pricing](/docs/ai-gateway/overview#pricing) for what to expect when billing begins.

Independent of billing, Neon enforces an account-level daily spend cap on AI Gateway usage, separate from the per-minute rate limits above. If your account exceeds it, every AI Gateway endpoint returns `429 Too Many Requests` with error code `REQUEST_LIMIT_EXCEEDED` until the cap resets or the block is lifted. This can happen even though inference itself isn't billed yet. Neon hasn't published a fixed cap value; it isn't a flat number and can vary by account. See [Troubleshooting](/docs/ai-gateway/troubleshooting#429-account-quota-exceeded) if you hit this.

## Which endpoint to use

Most models work with the [Chat completions](/docs/ai-gateway/chat-completions) endpoint. It is the recommended starting point and works with all providers. Use a provider-specific endpoint when required:

All paths below are appended to your branch's bare AI Gateway host (`NEON_AI_GATEWAY_BASE_URL`).

| Provider                  | Recommended endpoint   | Notes                                                                                    |
| ------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| Anthropic                 | `/v1/chat/completions` | Chat completions only                                                                    |
| OpenAI (most models)      | `/v1/chat/completions` | Use `/openai/v1/responses` for Responses API features                                    |
| OpenAI (codex variants)   | `/openai/v1/responses` | These models require the Responses API and don't work with chat/completions              |
| Google Gemini             | `/v1/chat/completions` | Use `/ai-gateway/gemini/v1beta/models/{model}:generateContent` with the google-genai SDK |
| Google Gemma 3 12B        | `/v1/chat/completions` | Chat completions only. Doesn't support the Gemini SDK endpoint                           |
| Meta, Databricks, Alibaba | `/v1/chat/completions` | Chat completions only                                                                    |

<Admonition type="warning" title="Content shape varies by model">
For most models, `message.content` in a chat completions response is a plain string. For some models, confirmed on Gemini 3.x (`gemini-3-5-flash`, `gemini-3-1-pro`), `gpt-oss-120b`, and `qwen35-122b-a10b`, it's an array of typed content blocks instead (`{ type: 'reasoning', ... }`, `{ type: 'text', text: ... }`), matching how those models represent output natively. A low `max_tokens` value can also cut a response off before the `text` block appears, leaving only a `reasoning` block. Handle both shapes:

```typescript
const { content } = response.choices[0].message;
const text = typeof content === 'string'
  ? content
  : content.find((block) => block.type === 'text')?.text ?? '';
```

</Admonition>

## Shorter /v1 paths

Most dialects above are also reachable at a shorter path with no `/ai-gateway/<dialect>` prefix. These are additive aliases: the `/ai-gateway/...` paths documented throughout this page keep working and aren't deprecated. Both forms use the same branch host, bearer token, request body, response body, model routing, rate limits, and quota behavior. Only chat completions and Gemini use a top-level `/v1/...` prefix; OpenAI Responses has its own shorter prefix instead of a bare `/v1/`.

Use the shorter paths when you want OpenAI/OpenRouter-style URLs. Use the `/ai-gateway/...` paths when a framework or existing Neon example expects the older dialect-specific route.

| Shorter path                                            | Equivalent to                                              |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| `POST /v1/chat/completions`                             | `/ai-gateway/mlflow/v1/chat/completions`                   |
| `POST /openai/v1/responses`                             | `/ai-gateway/openai/v1/responses`                          |
| `POST /v1/gemini/v1beta/models/{model}:generateContent` | `/ai-gateway/gemini/v1beta/models/{model}:generateContent` |

### List available models

`GET /v1/models` lists the model catalog in an OpenRouter-shaped response, authenticated the same way as the endpoints above:

```bash shouldWrap
curl "$NEON_AI_GATEWAY_BASE_URL/v1/models" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN"
```

```json
{
  "object": "list",
  "data": [
    {
      "id": "claude-sonnet-4-6",
      "canonical_slug": "claude-sonnet-4-6",
      "pricing": null,
      "per_request_limits": null,
      "context_length": null
    }
  ]
}
```

`canonical_slug`, `pricing`, `per_request_limits`, and `context_length` are reserved OpenRouter-compatible fields. `pricing`, `per_request_limits`, and `context_length` are currently always `null`; use the tables earlier on this page for context window and model details in the meantime.

## Provider terms

Models are hosted by Databricks and served through Neon AI Gateway. You are responsible for complying with each provider's applicable terms of use.

| Provider      | Terms                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anthropic     | [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)                                                                                                                       |
| OpenAI        | [OpenAI Usage Policies](https://openai.com/policies/usage-policies)                                                                                                                 |
| Google Gemini | [Google Cloud Acceptable Use Policy](https://cloud.google.com/terms/aup) · [Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy) |
| Google Gemma  | [Gemma Terms of Use](https://ai.google.dev/gemma/terms) · [Gemma Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy)                                          |
| Meta          | Terms differ by Llama version. See the Notes column in the [Meta models table](#meta).                                                                                              |

<NeedHelp/>
