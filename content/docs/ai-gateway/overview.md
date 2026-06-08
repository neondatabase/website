---
title: Neon AI Gateway
subtitle: LLM inference built into your Neon branch
summary: >-
  Neon AI Gateway is the LLM inference layer in the Neon backend for apps and
  agents. Use your branch credential to call foundation models from Anthropic,
  OpenAI, Google, and Alibaba without managing provider API keys. Standard AI
  SDKs work out of the box — point them at your branch host and start calling
  models immediately.
enableTableOfContents: true
updatedOn: '2026-06-08T16:11:48.651Z'
---

<Admonition type="note" title="Private Preview">
Neon AI Gateway is currently in Private Preview. To request access, sign up at [neon.com/blog/were-building-backends](https://neon.com/blog/were-building-backends). Foundation model access requires a paid Neon plan. Free plan users receive access to open-source models on a round-robin basis.
</Admonition>

Neon AI Gateway is the LLM inference layer in the Neon backend for apps and agents. Use your branch credential to call foundation models from Anthropic, OpenAI, Google, and Alibaba — no provider API keys required. Your existing OpenAI or Anthropic SDK works without changes; just point it at your branch host.

- **No provider credentials to manage** — authenticate with your existing Neon credential
- **Standard SDKs, one URL change** — OpenAI SDK, Anthropic SDK, and google-genai all work out of the box
- **Branches with your database** — every branch gets its own gateway endpoint, so you can test AI features in preview branches without touching production
- **20+ models across 4 providers** — Claude, GPT, Gemini, and Qwen, all accessible with the same credential
- **Streaming support** — server-sent events work on all endpoints with no extra configuration

## Quickstart

<DetailIconCards>

<a href="/docs/ai-gateway/get-started" description="Get a credential and make your first inference request in minutes." icon="todo">Quickstart</a>

<a href="/docs/ai-gateway/models" description="Browse the full model catalog and learn how to specify models in requests." icon="database">Models</a>

<a href="/docs/ai-gateway/chat-completions" description="Use the OpenAI-compatible endpoint with any model in the catalog." icon="code">Chat completions</a>

<a href="/docs/ai-gateway/authentication" description="Understand how Neon credentials work with AI Gateway." icon="lock">Authentication</a>

</DetailIconCards>

<NeedHelp/>
