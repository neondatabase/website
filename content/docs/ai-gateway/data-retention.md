---
title: Neon AI Gateway data retention
subtitle: Zero data retention at the model provider, and what Databricks retains
summary: >-
  Open-weight models in Neon AI Gateway run entirely on Databricks and never
  reach a third party, so the model provider retains nothing. Proprietary models
  are routed to the provider under Databricks' retention policy. Databricks
  retains requests only briefly for security and abuse, and never to train
  models.
enableTableOfContents: true
---

Neon AI Gateway gives you access to many models through a single Neon credential. The models are hosted and served by [Databricks Model Serving](https://docs.databricks.com/aws/en/machine-learning/model-serving): Neon AI Gateway is powered by Databricks.

What gets retained, and by whom, depends on the kind of model you call:

- **Open-weight models** run entirely on Databricks' own infrastructure. Your prompts and responses are never sent to the model's originator, so only Databricks retention applies.
- **Proprietary models** are routed to the model provider that serves them. Provider retention is governed by Databricks' partner model provider retention policy.

In both cases, Databricks processes the request, retains data only briefly for security and abuse purposes, and never uses it to train models.

## Open-weight models

Open-weight models are hosted and served directly by Databricks. Your prompts and responses never leave Databricks for a third party, so the model's originator never receives your data. For these models, the provider operates under **zero data retention (ZDR)** because it is never in the request path. Only [Databricks retention](#databricks-retention) applies.

Open-weight models in the catalog include Meta Llama, Alibaba Qwen, Zhipu AI GLM, Moonshot AI Kimi, Google Gemma, and OpenAI's gpt-oss models. To see which models are open weight, filter the catalog on the [Models](/docs/ai-gateway/models) page.

## Proprietary models

Proprietary models, such as OpenAI's GPT models, Google Gemini, and xAI Grok, are routed to the model provider to serve your request. Provider retention is governed by [Databricks' partner model provider retention policy](https://docs.databricks.com/aws/en/machine-learning/model-serving#partner-model-provider-data-retention), which documents the exceptions:

- **OpenAI**: for certain coding and routing customers, OpenAI may retain content its classifiers flag as potentially policy-violating. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data#safety-retention).
- **Anthropic**: for its frontier models (currently Fable 5 and later Mythos-class models), data is retained for safety purposes for all customers. See [Anthropic data retention](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

This retention relies on automated scanning before any limited human review. The catalog expands over time and these terms can change, so Databricks' partner model provider retention policy is the authoritative source of truth for which providers and models retain data.

## Databricks retention

Databricks may store the inputs and outputs of your requests for up to 30 days, within the region where the request is processed. This data is isolated per customer and is accessible only to detect and respond to security or abuse concerns. Your inputs and outputs are not used to train models or improve services.

For the authoritative and latest policy, see [Databricks Model Serving data retention](https://docs.databricks.com/aws/en/machine-learning/model-serving#data-retention).

<NeedHelp/>
