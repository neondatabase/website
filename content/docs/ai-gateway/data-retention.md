---
title: Neon AI Gateway data retention
subtitle: Zero data retention (ZDR) and what each party retains
summary: >-
  Most models served through Neon AI Gateway operate under zero data retention
  (ZDR): the provider does not store or train on your prompts and responses.
  This page lists the per-provider retention terms and explains what Databricks,
  the platform behind the gateway, retains.
enableTableOfContents: true
---

Neon AI Gateway gives you access to many models through a single Neon credential. Behind the gateway, those models are hosted and served by [Databricks Model Serving](https://docs.databricks.com/aws/en/machine-learning/model-serving): Neon AI Gateway is powered by Databricks, so a request you send to the gateway is processed by Databricks and then by the provider of the model you call.

That means two parties handle your prompts and responses:

- **The model provider**, such as OpenAI or Anthropic, that serves the specific model you call.
- **Databricks**, the platform that runs the models behind the gateway.

This page explains what each one retains. For most models the answer is nothing: they operate under zero data retention (ZDR).

## Model provider retention

Most models served through the gateway operate under **zero data retention (ZDR)**: the provider does not retain or train on your prompts and responses. The only exceptions are certain frontier models from OpenAI and Anthropic, which Databricks' partner model provider retention policy requires to retain data for safety purposes.

The table below shows, for each provider served through the gateway, whether it retains or trains on your data.

| Provider          | Retains your data                                                                                                                                                                                                                                       | Trains on your data |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| OpenAI            | For certain coding and routing customers, content its classifiers flag as potentially policy-violating. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data#safety-retention).                                           | No                  |
| Anthropic         | For its frontier models (currently Fable 5 and later Mythos-class models), retained for safety purposes for all customers. See [Anthropic data retention](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data). | No                  |
| Google            | No                                                                                                                                                                                                                                                      | No                  |
| Meta              | No                                                                                                                                                                                                                                                      | No                  |
| Alibaba           | No                                                                                                                                                                                                                                                      | No                  |
| Zhipu AI          | No                                                                                                                                                                                                                                                      | No                  |
| Thinking Machines | No                                                                                                                                                                                                                                                      | No                  |
| Moonshot AI       | No                                                                                                                                                                                                                                                      | No                  |
| xAI               | No                                                                                                                                                                                                                                                      | No                  |

The catalog expands over time. [Databricks' partner model provider retention policy](https://docs.databricks.com/aws/en/machine-learning/model-serving#partner-model-provider-data-retention) is the source of truth for which providers retain data.

## Databricks retention

Databricks may store the inputs and outputs of your requests for up to 30 days, within the region where the request is processed. This data is isolated per customer and is accessible only to detect and respond to security or abuse concerns. Your inputs and outputs are not used to train models or improve services.

For the authoritative and latest policy, see [Databricks Model Serving data retention](https://docs.databricks.com/aws/en/machine-learning/model-serving#data-retention).

<NeedHelp/>
