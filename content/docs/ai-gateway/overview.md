---
title: Neon AI Gateway
subtitle: LLM inference built into your Neon branch
summary: >-
  Neon AI Gateway is the LLM inference layer in the Neon backend for apps and
  agents. Use your branch credential to call foundation models from Anthropic,
  OpenAI, Google, and Alibaba without managing provider API keys. Standard AI
  SDKs work out of the box. Point them at your branch host and start calling
  models immediately.
enableTableOfContents: true
updatedOn: '2026-06-11T11:29:12.425Z'
---

<Admonition type="note" title="Private Preview">
Neon AI Gateway is currently in Private Preview, available for new projects in the AWS us-east-2 region only. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends). Foundation model access requires a paid Neon plan.
</Admonition>

Neon AI Gateway is the LLM inference layer in the Neon backend for apps and agents. Use your branch credential to call foundation models from Anthropic, OpenAI, Google, and Alibaba. No provider API keys required. Your existing OpenAI or Anthropic SDK works without changes. Point it at your branch host and start making requests.

- **No provider credentials to manage.** Authenticate with your existing Neon credential.
- **Standard SDKs, one URL change.** OpenAI SDK, Anthropic SDK, and google-genai all work out of the box.
- **Branches with your database.** Every branch gets its own gateway endpoint, so you can test AI features in preview branches without touching production.
- **39 models across 7 providers.** Claude, GPT, Gemini, Llama, DeepSeek, and more, all accessible with the same credential.
- **Streaming support.** Server-sent events work on all endpoints with no extra configuration.

## Quickstart

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock-landscape">Authentication</a>

</DetailIconCards>

<NeedHelp/>
