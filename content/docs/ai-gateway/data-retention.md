---
title: Neon AI Gateway data retention
subtitle: What is retained when you use the gateway, and by whom
summary: >-
  When you call a model through Neon AI Gateway, your prompts and responses are
  handled by the platform that runs the gateway and by the model provider. This
  page explains what each retains, how long, and for what purpose, and where the
  authoritative policies live.
enableTableOfContents: true
---

Neon AI Gateway gives you access to many models through a single Neon credential. Behind the gateway, those models are hosted and served by [Databricks Model Serving](https://docs.databricks.com/aws/en/machine-learning/model-serving): Neon AI Gateway is powered by Databricks, so a request you send to the gateway is processed by Databricks and then by the provider of the model you call.

That means two parties handle your prompts and responses:

- **Databricks**, the platform that runs the models behind the gateway.
- **The model provider**, such as OpenAI or Google, that serves the specific model you call.

This page explains what each one retains.

## Databricks retention

Databricks may store the inputs and outputs of your requests for up to 30 days, within the region where the request is processed. This data is isolated per customer and is accessible only to detect and respond to security or abuse concerns. Your inputs and outputs are not used to train models or improve services.

For the authoritative and latest policy, see [Databricks Model Serving data retention](https://docs.databricks.com/aws/en/machine-learning/model-serving).

## Model provider retention

Model providers served through the gateway do not retain or train on your data, except for the providers and models identified in Databricks' partner model provider retention policy.

| Provider          | Retains your data                                                                                                                                                                                             | Trains on your data |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| OpenAI            | For certain coding and routing customers, content its classifiers flag as potentially policy-violating. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data#safety-retention). | No                  |
| Google            | No                                                                                                                                                                                                            | No                  |
| Meta              | No                                                                                                                                                                                                            | No                  |
| Alibaba           | No                                                                                                                                                                                                            | No                  |
| Zhipu AI          | No                                                                                                                                                                                                            | No                  |
| Thinking Machines | No                                                                                                                                                                                                            | No                  |
| Moonshot AI       | No                                                                                                                                                                                                            | No                  |
| xAI               | No                                                                                                                                                                                                            | No                  |

The catalog expands over time. Databricks' partner model provider retention policy is the source of truth for which providers retain data.

<NeedHelp/>
