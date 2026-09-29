---
title: AI Gateway data retention
subtitle: What Databricks and model providers retain when you use the gateway
summary: >-
  Neon AI Gateway serves models hosted by Databricks. Databricks may store
  inputs and outputs for up to 30 days for security and abuse detection only,
  and does not train on them. Model providers do not retain your data, except
  for the providers identified in Databricks' partner model provider retention
  policy.
enableTableOfContents: true
---

Neon AI Gateway serves models hosted by [Databricks](https://docs.databricks.com/aws/en/machine-learning/model-serving). Two parties handle your prompts and responses: the Databricks platform that runs the gateway, and the model provider that serves the model you call. This page explains what each one retains.

## Databricks retention

Databricks may store the inputs and outputs of your requests in the same region as your workspace for up to 30 days. This data is isolated per customer and is accessible only to detect and respond to security or abuse concerns. Your inputs and outputs are not used to train models or improve services.

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
