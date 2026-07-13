---
title: AI Gateway models
subtitle: Available models and how to specify them
summary: >-
  Neon AI Gateway serves Databricks-hosted foundation models from Anthropic,
  OpenAI, Google, Meta, Databricks, and Alibaba. Use short model IDs
  like claude-sonnet-4-6 or gpt-5-mini. The databricks- prefix is also accepted.
enableTableOfContents: true
updatedOn: '2026-07-13T13:21:37.393Z'
---

<PrivatePreviewEnquire/>

Neon AI Gateway serves models hosted by Databricks. Use short model IDs in the `model` field — for example, `claude-sonnet-4-6`, `gpt-5-mini`, `gemini-2-5-flash`. The `databricks-` prefixed form is also accepted. The Neon Console and most examples use the short form.

<Admonition type="important">
Models are hosted by Databricks and served through Neon AI Gateway. By using these models, you are responsible for complying with each provider's applicable terms of use. See [Provider terms](#provider-terms) below.
</Admonition>

<Admonition type="note">
Model availability may vary by region. The catalog expands over time, so check back for new additions.
</Admonition>

## Quick picks

Not sure which model to use? Start here.

| I want to...                            | Recommended model                         | Open-weight alternative       |
| --------------------------------------- | ----------------------------------------- | ----------------------------- |
| Build a general chat or reasoning app   | `claude-sonnet-4-6`                       | `llama-4-maverick`            |
| Understand images                       | `claude-sonnet-4-6` or `gemini-2-5-flash` | `llama-4-maverick`            |
| Process audio or video                  | `gemini-3-5-flash`                        | —                             |
| Generate or review code                 | `gpt-5-3-codex`                           | `gpt-oss-120b`                |
| Run extended or deep reasoning          | `claude-opus-4-7` or `gpt-5-1`            | `qwen3-next-80b-a3b-instruct` |
| Handle very long documents (1M+ tokens) | `gemini-3-1-pro` or `claude-opus-4-7`     | `qwen35-122b-a10b`            |
| Keep costs low for lightweight tasks    | `claude-haiku-4-5` or `gpt-5-4-nano`      | `meta-llama-3-1-8b-instruct`  |

## Rate limits

During the private preview, the following limits apply:

| Limit                                   | Value         |
| --------------------------------------- | ------------- |
| Per model (tokens per minute)           | 200,000 TPM   |
| All models combined (tokens per minute) | 1,100,000 TPM |

If you hit a limit, you'll receive a `429 Too Many Requests` response. Requests resume when the rate limit window resets.

These limits apply to input tokens. Upstream output token limits (20,000 OTPM for most models) apply independently, so you can hit a `429` on output tokens without reaching the input limit. See [Databricks Foundation Model API limits](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/limits) for details.

## Pricing

Inference is free during the private preview. See [Pricing](/docs/ai-gateway/overview#pricing) for what to expect when billing begins.

## Available models

Endpoints are shown in short form. See [Which endpoint to use](#which-endpoint-to-use) for full paths and when to prefer each one.

### Anthropic

| Model ID            | Inputs      | Context | Endpoints                                 | Notes                                    |
| ------------------- | ----------- | ------- | ----------------------------------------- | ---------------------------------------- |
| `claude-opus-4-8`   | text, image | —       | `chat/completions` · `anthropic/messages` | Most capable Claude model                |
| `claude-opus-4-7`   | text, image | 1M      | `chat/completions` · `anthropic/messages` | Extended thinking available              |
| `claude-opus-4-6`   | text, image | 1M      | `chat/completions` · `anthropic/messages` | Adaptive thinking with max effort level  |
| `claude-opus-4-5`   | text, image | 200K    | `chat/completions` · `anthropic/messages` | Extended thinking available              |
| `claude-opus-4-1`   | text, image | 200K    | `chat/completions` · `anthropic/messages` |                                          |
| `claude-sonnet-4-6` | text, image | —       | `chat/completions` · `anthropic/messages` | Recommended. Instant + extended thinking |
| `claude-sonnet-4-5` | text, image | —       | `chat/completions` · `anthropic/messages` | Instant + extended thinking              |
| `claude-sonnet-4`   | text, image | —       | `chat/completions` · `anthropic/messages` | Instant + extended thinking              |
| `claude-haiku-4-5`  | text, image | —       | `chat/completions` · `anthropic/messages` | Fast and cost-effective                  |

### Google

| Model ID                | Inputs                    | Context | Endpoints                     | Notes                 |
| ----------------------- | ------------------------- | ------- | ----------------------------- | --------------------- |
| `gemini-3-5-flash`      | text, image, video, audio | —       | `chat/completions` · `gemini` |                       |
| `gemini-3-1-pro`        | text, image, video, audio | 1M      | `chat/completions` · `gemini` |                       |
| `gemini-3-1-flash-lite` | text, image, video, audio | —       | `chat/completions` · `gemini` |                       |
| `gemini-3-pro`          | text, image, video, audio | 1M      | `chat/completions` · `gemini` |                       |
| `gemini-3-flash`        | text, image, video, audio | —       | `chat/completions` · `gemini` |                       |
| `gemini-2-5-pro`        | text, image, video, audio | 1M      | `chat/completions` · `gemini` | Deep Think Mode       |
| `gemini-2-5-flash`      | text, image, video, audio | 1M      | `chat/completions` · `gemini` |                       |
| `gemma-3-12b`           | text, image               | 128K    | `chat/completions`            | Chat completions only |

### Databricks

Open-weight models hosted by Databricks. Text input only. Chat completions only.

| Model ID                  | Context | Endpoints          | Notes                                    |
| ------------------------- | ------- | ------------------ | ---------------------------------------- |
| `databricks-gpt-oss-120b` | 128K    | `chat/completions` | Recommended. Adjustable reasoning effort |
| `databricks-gpt-oss-20b`  | 128K    | `chat/completions` |                                          |

### Meta

| Model ID                                 | Inputs      | Context | Endpoints          | Notes                                                                                                                                                                                                              |
| ---------------------------------------- | ----------- | ------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `databricks-llama-4-maverick`            | text, image | —       | `chat/completions` | Recommended. [Llama 4 Community License](https://www.llama.com/llama4/license) · [Acceptable Use](https://www.llama.com/llama4/use-policy)                                                                         |
| `databricks-meta-llama-3-3-70b-instruct` | text        | 128K    | `chat/completions` | [Llama 3.3 Community License](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/LICENSE) · [Acceptable Use](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/USE_POLICY.md) |
| `databricks-meta-llama-3-1-8b-instruct`  | text        | 128K    | `chat/completions` | [Llama 3.1 Community License](https://www.llama.com/llama3_1/license/) · [Acceptable Use](https://www.llama.com/llama3_1/use-policy/)                                                                              |

### Alibaba

Text input only. Chat completions only.

| Model ID                                 | Context | Endpoints          | Notes                            |
| ---------------------------------------- | ------- | ------------------ | -------------------------------- |
| `databricks-qwen3-next-80b-a3b-instruct` | —       | `chat/completions` |                                  |
| `databricks-qwen35-122b-a10b`            | 256K    | `chat/completions` | Always reasons before responding |

### OpenAI

All OpenAI models have a 400K token context window and accept text and image inputs.

| Model ID             | Endpoints                               | Notes                                                              |
| -------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| `gpt-5-4`            | `chat/completions` · `openai/responses` |                                                                    |
| `gpt-5-4-mini`       | `chat/completions` · `openai/responses` |                                                                    |
| `gpt-5-4-nano`       | `chat/completions` · `openai/responses` |                                                                    |
| `gpt-5-3-codex`      | `openai/responses`                      | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `gpt-5-2-codex`      | `openai/responses`                      | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `gpt-5-2`            | `chat/completions` · `openai/responses` |                                                                    |
| `gpt-5-1-codex-max`  | `openai/responses`                      | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `gpt-5-1-codex-mini` | `openai/responses`                      | Requires [OpenAI Responses API](/docs/ai-gateway/openai-responses) |
| `gpt-5-1`            | `chat/completions` · `openai/responses` | Instant + Thinking modes                                           |
| `gpt-5`              | `chat/completions` · `openai/responses` |                                                                    |
| `gpt-5-mini`         | `chat/completions` · `openai/responses` |                                                                    |
| `gpt-5-nano`         | `chat/completions` · `openai/responses` |                                                                    |

## Which endpoint to use

Most models work with the [Chat completions](/docs/ai-gateway/chat-completions) endpoint. It is the recommended starting point and works with all providers. Use a provider-specific endpoint when required:

| Provider                  | Recommended endpoint                     | Notes                                                                                    |
| ------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Anthropic                 | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/anthropic/v1/messages` for extended thinking and prompt caching         |
| OpenAI (most models)      | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/openai/v1/responses` for Responses API features                         |
| OpenAI (codex variants)   | `/ai-gateway/openai/v1/responses`        | These models require the Responses API and don't work with chat/completions              |
| Google Gemini             | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/gemini/v1beta/models/{model}:generateContent` with the google-genai SDK |
| Google Gemma 3 12B        | `/ai-gateway/mlflow/v1/chat/completions` | Chat completions only. Doesn't support the Gemini SDK endpoint                           |
| Meta, Databricks, Alibaba | `/ai-gateway/mlflow/v1/chat/completions` | Chat completions only                                                                    |

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
