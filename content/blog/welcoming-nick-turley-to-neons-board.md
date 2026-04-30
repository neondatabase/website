---
title: Neon Welcomes OpenAI’s Nick Turley to Board of Directors
description: Driving next generation infra for developers and agents
excerpt: >-
  We are thrilled to announce that Nick Turley, Head of Product for ChatGPT at
  OpenAI, is joining Neon’s Board of Directors. Nick brings deep expertise in
  product leadership from his roles at OpenAI, Instacart, and Dropbox. “This
  role represents an opportunity to help shape how a f...
date: '2025-02-27T18:15:31'
updatedOn: '2025-02-27T18:15:33'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/welcoming-nick-turley-to-neons-board/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Neon Welcomes OpenAI's Nick Turley to Board of Directors - Neon
  description: >-
    We are thrilled to announce that Nick Turley, Head of Product for ChatGPT at
    OpenAI, is joining Neon's Board of Directors.
  keywords: []
  noindex: false
  ogTitle: Neon Welcomes OpenAI's Nick Turley to Board of Directors - Neon
  ogDescription: >-
    We are thrilled to announce that Nick Turley, Head of Product for ChatGPT at
    OpenAI, is joining Neon's Board of Directors.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/welcoming-nick-turley-to-neons-board/social.jpg
source:
  wpId: 8639
  wpSlug: welcoming-nick-turley-to-neons-board
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/welcoming-nick-turley-to-neons-board/neon-nick-turley-1-1024x576-229c4648.jpg)

**We are thrilled to announce that** [Nick Turley](https://www.linkedin.com/in/nicholasturley/)**, Head of Product for ChatGPT at OpenAI, is joining Neon’s Board of Directors**. Nick brings deep expertise in product leadership from his roles at OpenAI, Instacart, and Dropbox.

> **“This role represents an opportunity to help shape how a fundamental piece of internet infrastructure evolves in the age of AI.”<br />**<br />_Nick Turley, Head of Product, ChatGPT_

## A turning point for software development

This appointment comes at a pivotal moment for us. Our separation of storage and compute for Postgres has unlocked instant provisioning, autoscaling, and database branching, leading to over 750,000 databases deployed by the end of 2024.

Then, overnight, a [key product launch](https://blog.replit.com/introducing-replit-agent) from an important Neon customer and partner, [Replit](https://replit.com), started a shift in how infrastructure is used. Replit Agent is capable of both generating code and provisioning infrastructure, including databases on Neon. It quickly started spinning up new instances every few seconds. Others followed, like [Create.xyz](https://www.create.xyz/). We now see more databases created by codegen than humans in Neon.

<EmbedTweet url="https://twitter.com/nikitabase/status/1894791456046625258?ref_src=twsrc%5Etfw" text="Number of database created per day. You can find @Replit agent launch, @create_xyz launch, and then @Replit mobile launch on this graph. We now have 4x more databases created by codegen than by humans. pic.twitter.com/2NIYiCCoam — Nikita Shamgunov (@nikitabase) February 26, 2025" />

**The next generation of developer infrastructure will differentiate on agent experience**. If we are truly focused on helping engineering teams build scalable applications with unprecedented speed, we cannot ignore the AI interface.

## LLMs are taking the lead

A couple years ago, LLMs helped developers write code faster through autocomplete and refactoring. Now, LLMs are taking over the reins and taking on the generation of code from the ground up themselves.

New code-generation tools allow developers to go from a prompt to a fully functioning application in a matter of minutes. While human iteration is still needed, the game is on—we believe that most new applications will be started with AI agents, at least for the first 10 to 100 iterations.

At the same time, LLM providers (OpenAI, Anthropic, Google) are launching products that require runtime code execution and infrastructure. Examples are [OpenAI canvas](https://openai.com/index/introducing-canvas/) and [Claude Artifacts](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), which expand on the capabilities of the now established chat interfaces for LLMs. In doing so, they will take on external services as dependencies.

## What this means for infrastructure

SAI agents aren’t just “writing code”. They’re setting up [Git repositories](https://lovable.dev/blog/incident-github-outage), [launching databases](https://neon.tech/blog/looking-at-how-replit-agent-handles-databases), [deploying applications](https://www.create.xyz/docs/publish-and-share/publish), and [running tests](https://docs.devin.ai/use-cases/testing-refactoring). This introduces new demands on infrastructure:

- Parallelism at scale – AI agents generate and deploy code continuously, far exceeding human-driven workflows. Infrastructure must support high-volume and concurrent deployments.
- Instant deploys and forkable environments — AI agents iterate rapidly. Workloads should spin up instantly while avoiding unnecessary fixed costs that act as a barrier for scale.
- Strong isolation – AI-generated code is unpredictable. Secure sandboxes will be critical to prevent jailbreaks and security risks.
- Full-stack integrations – AI-generated applications will need reliable connections to relational databases, blob storage, and all other infrastructure components.

## Building the future for developers and agents

This shift is already underway. It’s hard to predict how much code AI agents will execute, test, and deploy in the coming years. But one thing is clear: the scale will be massive.

Nick Turley’s leadership will help us refine our strategy and continue building infrastructure that meets the demands of this future. We’re excited to welcome him to our Board of Directors and to continue shaping the future of developer and agentic infrastructure.
