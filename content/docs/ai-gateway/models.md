---
title: AI Gateway models
subtitle: Available models and how to specify them
summary: >-
  Neon AI Gateway serves Databricks-hosted foundation models from Anthropic,
  OpenAI, Google, Meta, Databricks, and Alibaba. Use short model IDs
  like claude-sonnet-4-6 or gpt-5-mini. The databricks- prefix is also accepted.
enableTableOfContents: true
updatedOn: '2026-07-14T19:04:57.024Z'
---

<PrivatePreviewEnquire/>

Neon AI Gateway serves models hosted by Databricks. Use short model IDs in the `model` field — for example, `claude-sonnet-4-6`, `gpt-5-mini`, `gemini-2-5-flash`. The `databricks-` prefixed form is also accepted. The Neon Console and most examples use the short form.

<Admonition type="important">
Models are hosted by Databricks and served through Neon AI Gateway. By using these models, you are responsible for complying with each provider's applicable terms of use. See [Provider terms](#provider-terms) below.
</Admonition>

<Admonition type="note">
Model availability may vary by region. The catalog expands over time, so check back for new additions.
</Admonition>

The full catalog is published as the [`neon` provider on models.dev](https://models.dev/providers/neon) — the machine-readable source of truth — and served as JSON at [`neon.com/models.json`](https://neon.com/models.json).

## Model access

Every project with AI Gateway access can call open-weight models (Llama, Qwen, gpt-oss, and others) right away. Check **Open weights only** in the [model catalog](#available-models) to see the full list.

Foundation models from Anthropic, OpenAI, and Google are being rolled out gradually as we expand capacity. Request access from the **AI Gateway** page in the Neon Console.

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

Once billing begins, usage will also be capped by your prepaid credit balance. See [Pricing](#pricing) below.

## Pricing

Inference is free during the private preview. See [Pricing](/docs/ai-gateway/overview#pricing) for what to expect when billing begins.

## Available models

Browse the full catalog below. Switch between the **Text** and **Image** tabs, filter by provider or open weights, sort any column, and click a model for a copy-paste quickstart (AI SDK, Mastra, Python, TypeScript, or cURL). The endpoint each snippet targets is baked into its base URL — `/v1` for chat completions, `/openai/v1` for the Responses API (image generation).

<AiGatewayModelIndex/>

For full request paths and when to prefer each endpoint, see [Which endpoint to use](#which-endpoint-to-use).

## Which endpoint to use

Most models work with the [Chat completions](/docs/ai-gateway/chat-completions) endpoint. It is the recommended starting point and works with all providers. Use a provider-specific endpoint when required:

All paths below are appended to your branch's bare AI Gateway host (`NEON_AI_GATEWAY_BASE_URL`).

| Provider                  | Recommended endpoint   | Notes                                                                                    |
| ------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| Anthropic                 | `/v1/chat/completions` | Use `/anthropic/v1/messages` for extended thinking and prompt caching                    |
| OpenAI (most models)      | `/v1/chat/completions` | Use `/openai/v1/responses` for Responses API features                                    |
| OpenAI (codex variants)   | `/openai/v1/responses` | These models require the Responses API and don't work with chat/completions              |
| Google Gemini             | `/v1/chat/completions` | Use `/ai-gateway/gemini/v1beta/models/{model}:generateContent` with the google-genai SDK |
| Google Gemma 3 12B        | `/v1/chat/completions` | Chat completions only. Doesn't support the Gemini SDK endpoint                           |
| Meta, Databricks, Alibaba | `/v1/chat/completions` | Chat completions only                                                                    |

## Provider terms

Models are hosted by Databricks and served through Neon AI Gateway. You are responsible for complying with each provider's applicable terms of use.

| Provider      | Terms                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anthropic     | [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)                                                                                                                       |
| OpenAI        | [OpenAI Usage Policies](https://openai.com/policies/usage-policies)                                                                                                                 |
| Google Gemini | [Google Cloud Acceptable Use Policy](https://cloud.google.com/terms/aup) · [Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy) |
| Google Gemma  | [Gemma Terms of Use](https://ai.google.dev/gemma/terms) · [Gemma Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy)                                          |
| Meta          | Terms differ by Llama version. See the Notes column in the [Meta models table](#meta).                                                                                              |

> AI Gateway doesn't currently log or store the prompts, completions, or other request content you send through it, though this isn't a formal guarantee and is subject to change during the private preview. Neon doesn't yet offer a zero-data-retention agreement, an opt-out from provider training on your requests, or regional data residency; all requests are routed through AWS us-east-2 regardless of your project's region.

<NeedHelp/>
