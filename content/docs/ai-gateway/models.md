---
title: AI Gateway models
subtitle: Available models and how to specify them
summary: >-
  Neon AI Gateway serves Databricks-hosted foundation models from Anthropic,
  OpenAI, Google, and Alibaba. All model IDs use the databricks- prefix.
  Use these IDs in the model field of any request regardless of which endpoint
  you are using.
enableTableOfContents: true
updatedOn: '2026-06-08T16:11:48.651Z'
---

Neon AI Gateway serves models hosted by Databricks. All model IDs use the `databricks-` prefix — for example, `databricks-claude-sonnet-4-6`. Use these IDs in the `model` field of any request, regardless of which endpoint you use.

<Admonition type="note">
Model availability may vary by region. The catalog expands over time — check back for new additions.
</Admonition>

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

| Model ID                        | Notes |
| ------------------------------- | ----- |
| `databricks-gpt-5-5-pro`        |       |
| `databricks-gpt-5-5`            |       |
| `databricks-gpt-5-4`            |       |
| `databricks-gpt-5-4-mini`       |       |
| `databricks-gpt-5-4-nano`       |       |
| `databricks-gpt-5-3-codex`      |       |
| `databricks-gpt-5-2-codex`      |       |
| `databricks-gpt-5-2`            |       |
| `databricks-gpt-5-1-codex-max`  |       |
| `databricks-gpt-5-1-codex-mini` |       |
| `databricks-gpt-5-1`            |       |

### Alibaba

| Model ID                      | Notes |
| ----------------------------- | ----- |
| `databricks-qwen35-122b-a10b` |       |

## Which endpoint to use

You can use any model with the [Chat completions](/docs/ai-gateway/chat-completions) endpoint — it is provider-agnostic. Use a provider-specific endpoint when you need native features:

| Provider  | Recommended endpoint                     | When to use the native endpoint                                                          |
| --------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Anthropic | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/anthropic/v1/messages` for extended thinking and prompt caching         |
| OpenAI    | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/openai/v1/responses` for the Responses API                              |
| Google    | `/ai-gateway/mlflow/v1/chat/completions` | Use `/ai-gateway/gemini/v1beta/models/{model}:generateContent` with the google-genai SDK |
| Alibaba   | `/ai-gateway/mlflow/v1/chat/completions` | —                                                                                        |

<NeedHelp/>
