---
title: 'xpander.ai Brings AI Agents to Slack, With Neon Powering the Backend'
description: Run memory-backed agents inside your Slack workspace
excerpt: >-
  “The entire memory layer of our agent, all its session data, is stored in
  Neon. It’s the backend for everything the agent remembers.” (Ran Sheinberg,
  co-founder and CPO of xpander.ai) xpander is a new platform built for helping
  developers build and run production-ready AI agents....
date: '2025-08-07T16:50:28'
updatedOn: '2025-09-10T01:03:07'
category: ai
categories:
  - ai
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/xpander-ai-agents-slack-neon-backend/cover.png
  alt: null
isFeatured: false
seo:
  title: 'xpander.ai Brings AI Agents to Slack, With Neon Powering the Backend - Neon'
  description: >-
    Xpander brings AI agents to Slack, using Neon to power their per-tenant
    memory architecture with full isolation.
  keywords: []
  noindex: false
  ogTitle: 'xpander.ai Brings AI Agents to Slack, With Neon Powering the Backend - Neon'
  ogDescription: >-
    Xpander brings AI agents to Slack, using Neon to power their per-tenant
    memory architecture with full isolation.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/xpander-ai-agents-slack-neon-backend/cover.png
source:
  wpId: 10534
  wpSlug: xpander-ai-agents-slack-neon-backend
  exportedAt: '2026-03-20T13:31:00.745Z'
---

> **“The entire memory layer of our agent, all its session data, is stored in Neon. It’s the backend for everything the agent remembers.”** (Ran Sheinberg, co-founder and CPO of [xpander.ai)](https://xpander.ai/)

[xpander](https://xpander.ai/) is a new platform built for helping developers build and run production-ready AI agents. Today, they’re launching a major new feature – a [Slack integration](https://slack.xpander.ai/) that lets you deploy agents as fully autonomous teammates inside any workspace – powered by memory, agentic tools, support for local or remote MCP servers, and any LLM.

<EmbedTweet url="https://twitter.com/xpander_ai/status/1953361112394539094?ref_src=twsrc%5Etfw" text="Today we're introducing 𝗦𝗹𝗮𝗰𝗸-𝗻𝗮𝘁𝗶𝘃𝗲 𝗮𝗴𝗲𝗻𝘁𝘀 – because in order to unlock real AI Employees, we need to start from having AI agents work where your teams work. 𝗖𝗵𝗲𝗰𝗸 𝘂𝘀 𝗼𝘂𝘁 𝗼𝗻 𝗣𝗿𝗼𝗱𝘂𝗰𝘁 𝗛𝘂𝗻𝘁→ https://t.co/Utxj71dWQ9 #ProductHunt #AI pic.twitter.com/huJ42T16vW — xpander.ai (@xpander_ai) August 7, 2025" />

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>

## Build Agents Like Products

xpander isn’t just an SDK or a playground but a full backend-as-a-service for agent builders. The platform handles the heavy lifting so teams can focus on the logic and behavior of their agents, not the infrastructure. With xpander, you get:

- A low-code + yes-code workbench to configure, test, and iterate on agents
- Built-in agent memory, toolchains, and multi-agent orchestration
- Native Slack, MCP, web UI, and webhook integration
- CI/CD pipelines, versioning, and governance tools for managing agents at scale

xpander is framework-agnostic and built for developers. You can start visually, export your agent into your IDE, and continue coding before deploying it back to the cloud.

<figure>
<video autoPlay muted loop width="2862" height="1772">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/xpander-ai-agents-slack-neon-backend/xpander-homepaege-bf268d7a.mov" />
</video>
<figcaption>Check them out at https://xpander.ai/</figcaption>
</figure>

## Just Launched: Agents in Slack

[The new Slack integration](https://slack.xpander.ai/) makes it easy to drop an agent into any Slack workspace. The agent becomes an autonomous teammate – listening in, responding, and taking action based on user input and your configured toolchain. This is super useful for

- Support agents that can open tickets, check status, and schedule calls
- Sales agents that can answer FAQs and qualify leads
- Internal assistants that monitor channels and trigger workflows…

And because agents are built and deployed through Xpander, they’re easy to customize, extend, and govern across teams.

<video autoPlay muted loop width="1016" height="926">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/xpander-ai-agents-slack-neon-backend/xpander-slack-agent-90705dcc.mov" />
</video>

## How Neon Powers xpander’s Multi‑Tenant Architecture

> **“For every tenant in our system, we create a dedicated project in Neon. That lets us isolate memory and scale cleanly as agent usage grows.”** (Ran Sheinberg, co-founder and CPO of [xpander.ai](https://xpander.ai/))

Behind every Slack agent built on xpander is a Neon project. Neon makes it trivial to spin up a new Postgres backend per customer – this is why Neon’s project‑per‑tenant model works so well:

- **True instance-level isolation, without the overhead.** Instead of packing customers into shared schemas or a single monolithic database, Neon creates a separate project (aka an isolated Postgres instance) for each tenant. That means no noisy‑neighbor problems and clean data isolation from day one.
- **Instant provisioning via API.** Spinning up a new project for a tenant takes seconds via Neon’s API, and you get branches for incorporating features like checkpoints and rollbacks – all without affecting other users.
- **Serverless scaling, optimized for agent workloads.** Neon separates compute from storage and auto‑scales per project. This ensures that if an agent is inactive, the project silently scales to zero, consuming minimal resources and costs.

What this means for xpander:

- When a new tenant is created, xpander automatically provisions a Neon project for them, complete with agent memory, tool configurations, and session history.
- Because each tenant’s memory is stored in a separate Neon project, xpander avoids resource contention and ensures predictable performance regardless of usage spikes.
- Cost stays low – each project can be assigned a small compute unit, and when idle, they autosuspend automatically.

## What’s Next

xpander’s Slack integration is just one step in their broader mission: to make agents not just easier to build, but easier to run, govern, and evolve. They plan to introduce optional features that let customers fine-tune and optimize their agents over time, including reinforcement learning loops that build on historical agent memory. Neon provides the structured, user-unique queryable memory layer that makes this kind of intelligent feedback cycle possible.

xpander is also continuing to expand its interface layer, from Slack and webhooks to MCP and custom web UIs, so agents can live wherever users already work.

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>
