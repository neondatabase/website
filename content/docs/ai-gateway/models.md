---
title: AI Gateway models
subtitle: Available models and how to specify them
summary: >-
  Neon AI Gateway serves Databricks-hosted foundation models from Anthropic,
  OpenAI, Google, and Alibaba. All model IDs use the databricks- prefix.
  Use these IDs in the model field of any request regardless of which endpoint
  you are using.
enableTableOfContents: true
updatedOn: '2026-06-10T17:16:40.599Z'
---

Neon AI Gateway serves models hosted by Databricks. All model IDs use the `databricks-` prefix (for example, `databricks-claude-sonnet-4-6`). Use these IDs in the `model` field of any request, regardless of which endpoint you use.

<Admonition type="note">
Model availability may vary by region. The catalog expands over time, so check back for new additions.
</Admonition>

## List available models

You can fetch the current model catalog from the Neon API:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/ai_gateway/models" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

The response includes each model's `id`, `provider`, and `display_name`:

```json
{
  "models": [
    { "id": "databricks-claude-sonnet-4-6", "provider": "anthropic", "display_name": "Claude Sonnet 4.6" },
    { "id": "databricks-gpt-5-4", "provider": "openai", "display_name": "GPT-5.4" },
    { "id": "databricks-gemini-2-5-flash", "provider": "google", "display_name": "Gemini 2.5 Flash" }
  ]
}
```

Use the `id` field in the `model` parameter of any inference request.

## Available models

### Anthropic

| Model ID                       | Notes                          |
| ------------------------------ | ------------------------------ |
| `databricks-claude-opus-4-8`   | Most capable Claude model      |
| `databricks-claude-opus-4-7`   |                                |
| `databricks-claude-opus-4-6`   |                                |
| `databricks-claude-opus-4-5`   |                                |
| `databricks-claude-sonnet-4-6` | Recommended for most use cases |
| `databricks-claude-haiku-4-5`  | Fast and cost-effective        |

### Google

| Model ID                           | Notes |
| ---------------------------------- | ----- |
| `databricks-gemini-3-5-flash`      |       |
| `databricks-gemini-3-1-pro`        |       |
| `databricks-gemini-3-1-flash-lite` |       |
| `databricks-gemini-3-pro`          |       |
| `databricks-gemini-3-flash`        |       |
| `databricks-gemini-2-5-pro`        |       |
| `databricks-gemini-2-5-flash`      |       |

### OpenAI

| Model ID                        | Notes                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| `databricks-gpt-5-5-pro`        | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `databricks-gpt-5-5`            |                                                                    |
| `databricks-gpt-5-4`            |                                                                    |
| `databricks-gpt-5-4-mini`       |                                                                    |
| `databricks-gpt-5-4-nano`       |                                                                    |
| `databricks-gpt-5-3-codex`      | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `databricks-gpt-5-2-codex`      | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `databricks-gpt-5-2`            |                                                                    |
| `databricks-gpt-5-1-codex-max`  | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `databricks-gpt-5-1-codex-mini` | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `databricks-gpt-5-1`            |                                                                    |

### Alibaba

| Model ID                      | Notes |
| ----------------------------- | ----- |
| `databricks-qwen35-122b-a10b` |       |

## Which endpoint to use

Most models work with the [Chat completions](/docs/ai-gateway/chat-completions) endpoint. It is the recommended starting point and works with all providers. Use a provider-specific endpoint when required:

| Provider                               | Recommended endpoint                     | Notes                                                                                    |
| -------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Anthropic                              | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/anthropic/v1/messages` for extended thinking and prompt caching         |
| OpenAI (most models)                   | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/openai/v1/responses` for Responses API features                         |
| OpenAI (`gpt-5-5-pro`, codex variants) | `/ai-gateway/openai/v1/responses`        | These models require the Responses API and do not work with chat/completions             |
| Google                                 | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/gemini/v1beta/models/{model}:generateContent` with the google-genai SDK |
| Alibaba                                | `/ai-gateway/mlflow/v1/chat/completions` |                                                                                          |

<NeedHelp/>
