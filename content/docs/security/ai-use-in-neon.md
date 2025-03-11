---
title: AI use in Neon
subtitle: How Neon integrates AI into its platform
enableTableOfContents: true
updatedOn: '2025-03-05T12:14:08.771Z'
---

Neon integrates AI to enhance user experience across different parts of the platform. Below is an overview of where and how AI is used in Neon.

## AI in the Neon SQL Editor

The Neon SQL Editor includes AI-powered features to assist with writing, optimizing, and generating names for SQL queries. To enable these capabilities, we share your database schema with the AI agent, but **no actual data is shared**.

Neon currently uses [Amazon Bedrock](https://aws.amazon.com/bedrock/) as the LLM provider for the Neon SQL Editor. All requests are processed within AWS’s secure infrastructure, where other Neon resources are also managed.

For more details, see [AI features in the Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor#ai-features).

## AI chat assistance

Neon provides AI-powered chat assistance across multiple platforms to help users with documentation, troubleshooting, and best practices. These AI chat assistants are developed by third-party companies under contract with Neon.

Neon AI chat assistance is built on publicly available sources, including Neon documentation, public 3rd party vendor documentation, Neon GitHub repositories, the Neon public OpenAPI specification, and other publicly available content. It does not process or incorporate personally identifiable information (PII) or private user data.

For details on where to access Neon AI chat assistants, see [Neon AI chat assistance](https://neon.tech/docs/introduction/support#neon-ai-chat-assistance).

## Questions about AI use in Neon?

If you have questions about Neon's AI integrations, please reach out to [Neon Support](https://console.neon.tech/app/projects?modal=support).
