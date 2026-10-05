---
title: Neon AI Gateway data retention
subtitle: What Databricks and partner model providers retain when you use Neon AI Gateway
summary: >-
  Neon AI Gateway is powered by Databricks Model Serving. Databricks may
  temporarily store inputs and outputs for up to 30 days to prevent, detect, and
  mitigate abuse. Partner model providers OpenAI and Anthropic may retain data
  for safety purposes for certain models.
enableTableOfContents: true
---

Neon AI Gateway gives you one credential for many models, all served through [Databricks Model Serving](https://docs.databricks.com/aws/en/machine-learning/model-serving). Data retention for your requests follows Databricks' policy, which covers what Databricks retains and what partner model providers may retain.

This page summarizes that policy. For the authoritative and latest terms, see [Databricks Model Serving data retention](https://docs.databricks.com/aws/en/machine-learning/model-serving#data-retention).

## Databricks data retention

For all Model Serving workloads, Databricks retains container build logs for up to 30 days and metrics data for up to 14 days.

As part of providing the service, Databricks may temporarily process and store your inputs and outputs to prevent, detect, and mitigate abuse or harmful uses. Your inputs and outputs are:

- Isolated from those of other customers
- Stored in the region where your request was processed, for up to 30 days
- Only accessible for detecting and responding to security or abuse concerns

## Partner model provider data retention

Partner model providers may retain data for safety purposes. This retention relies on automated scanning before any limited human review.

### OpenAI

In accordance with [OpenAI's safety retention policy](https://developers.openai.com/api/docs/guides/your-data#safety-retention), for `gpt-5-5`, `gpt-5-5-pro`, and future models, OpenAI may retain certain coding and routing customers' content that OpenAI's classifiers detect as potentially violating OpenAI's usage policies. Otherwise, retention isn't affected.

Coding and routing customers are customers that:

- Provide software engineering or deployment work for third parties, such as code generation, code completion, and agentic development or deployment workflows
- Act as model-access intermediary platforms or services that let third parties use OpenAI models for cyber-risk-relevant software development, alongside access to other providers' models

All other customers may be subject to additional retention upon advance notice.

### Anthropic

For Anthropic's Fable 5 and future Mythos-class models, all customers are subject to data retention for safety purposes, as described in [Anthropic's data retention practices](https://support.claude.com/en/articles/15425996-data-retention-practices-for-mythos-class-models).

<NeedHelp/>
