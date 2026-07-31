---
title: Three Ways to Use Neon for AI
description: From backend for agents to your own vectorstore
excerpt: >-
  It’s not only hype: developers are working with AI every day – both using new
  AI-powered tools and building their own. At Neon, we’re seeing Postgres widely
  used in three AI workflows: Vector search with pgvector Many AI applications
  rely on vector embeddings for semantic search,...
date: '2025-07-29T16:34:01'
updatedOn: '2025-10-02T00:22:03'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/three-ways-to-use-neon-for-ai/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Three Ways to Use Neon for AI - Neon
  description: >-
    Explore Neon AI use cases - as a vector store, in tools like Cursor & Devin,
    and as a Postgres backend for agents.
  keywords: []
  noindex: false
  ogTitle: Three Ways to Use Neon for AI - Neon
  ogDescription: >-
    Explore Neon AI use cases - as a vector store, in tools like Cursor & Devin,
    and as a Postgres backend for agents.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/three-ways-to-use-neon-for-ai/social.jpg
---

It’s not only hype: developers are working with AI every day – both using new AI-powered tools and building their own. At Neon, we’re seeing Postgres widely used in three AI workflows:

1. powering vector-based apps with pgvector,
2. managing databases from AI-assisted coding tools,
3. and serving as the backend for agents that deploy full-stack applications

## Vector search with pgvector

Many AI applications rely on vector embeddings for semantic search, RAG pipelines and similarity-based recommendations. The default approach is to pair a vector database with a separate relational store – one for your embeddings, another for everything else (users, metadata, analytics, etc.).

But this split setup often adds more overhead than it solves, especially for small teams. You now have two systems to manage, sync, scale, and secure, with different query logic, and raising costs. If Postgres already handles your application data, why introduce a separate database just for that?

<blockquote>
<p><strong>“Having two separate databases for one product was inefficient in every way: cost, performance, and developer experience” </strong><em>(Giorgi Kenchadze, Founder & CEO at <a href="https://vecstore.app/">Vecstore</a>)</em></p>
</blockquote>

That’s why more developers are reaching for [pgvector](https://neon.com/docs/extensions/pgvector), the open-source Postgres extension that turns any table into a vector database. You can store embeddings alongside the rest of your data, run similarity search with HNSW indexes, and combine it all in a single SQL query.

[Neon](https://neon.com/) (which of course supports pvector) adds some serverless Postgres magic to further improve price-performance and developer experience. For example,

- **Autoscaling handles unpredictable query and indexing spikes:** Vector workloads can be bursty, especially during large-scale indexing or similarity searches across many embeddings. With Neon, [compute resources scale automatically based on demand](https://neon.com/docs/introduction/autoscaling) – you don’t need to pre-allocate capacity or tune resource limits manually.
- **Branching enables safe experiments:** Neon’s [copy-on-write branching](https://neon.com/docs/introduction/branching) lets teams create isolated environments for testing changes, whether that’s trying a different embedding model, adjusting chunking strategies, or benchmarking a new HNSW index configuration. You can compare performance or behavior without touching production data.
- **Multi-project architecture improves latency and isolation –** Neon makes it easier to manage many separate database projects across multiple regions, each isolated with their own compute and branches. Even small teams can serve search workloads closer to end users, avoid cross-region hops, and maintain tenant-level isolation.

<blockquote>
<p><strong>“When I started RagRabbit, I did testing on vector databases, but I didn’t see a real advantage. Postgres with Pgvector covers everything I need” </strong><em>(Marco D’Alia, Software Architect behind <a href="https://github.com/madarco/ragrabbit">RagRabbit</a>)</em></p>
</blockquote>

To get started, explore our [pgvector guide](https://neon.com/docs/extensions/pgvector) and our examples.

## Postgres for your developer tools

Neon’s [MCP Server](https://neon.com/docs/ai/neon-mcp-server) simplifies provisioning and debugging databases via tools like Cursor, Devin, abnd many others, by exposing a structured API for managing Postgres branches in development environments.

- Cursor supports Neon via a [one-click setup](https://neon.com/guides/cursor-mcp-neon#option-1-setting-up-the-remote-hosted-neon-mcp-server)
- Devin connect to Neon via the [MCP Marketplace](https://cognition.ai/blog/mcp-marketplace)
- You can also use it via [GitHub Copilot in VS Code](https://neon.com/guides/neon-mcp-server-github-copilot-vs-code?utm_source=chatgpt.com)
- Or in [Windsurf](https://neon.com/guides/windsurf-mcp-neon), [Claude Desktop](https://neon.com/guides/neon-mcp-server), or [Cline](https://neon.com/guides/cline-mcp-neon)

<Admonition type="warning" title="before proceeding, healthy disclaimer">
The MCP Server works best for development. Agents can work on Neon’s [dev branches](https://neon.com/flow/branch-per-developer) - any changes will be isolated from your production data.
</Admonition>

Neon MCP supports a broad set of dev-focused actions, including

- `create_branch` / `reset_branch_data` – isolate changes for safe experimentation
- `list_slow_queries`, `explain_sql_statement` – surface performance issues
- `prepare_query_tuning`, `complete_query_tuning` – test and implement fixes
- Authentication via OAuth or Neon’s API keys

To get started, explore our [MCP server](https://neon.com/docs/ai/neon-mcp-server) page.

## Backend for agents

Whether deploying a new app, testing an idea, or executing user prompts, modern agents need to provision a database at runtime, use it briefly, and discard it. Neon makes this pattern successful with serverless Postgres that can be controlled entirely via API, and it’s already powering agents like Replit, Databutton, [Create.xyz](https://create.xyz), same.new, and many others.

<blockquote>
<p><strong>“Integrating Neon was a no-brainer. It gives every Databutton app a production-grade Postgres database in seconds, with zero overhead” </strong><em>(<a href="https://www.linkedin.com/in/martinsroed/overlay/about-this-profile/">Martin Skow Røed</a>, CTO and co-founder of Databutton)</em></p>
</blockquote>

Why does Neon fit so well with agentic workflows?

- **Neon provisions in under a second.** Neon allows agents to create a fully functional Postgres database in one API call. Provisioning is fast enough to happen inside a single agent loop, without blocking downstream tasks or create friction for the end user.
- **No sign-up flow.** Agents can provision databases anonymously via API. End users don’t need to create Neon accounts or authenticate – the database is created on their behalf and expires automatically.
- **Affordable at scale.** Modern agentic fleets create thousands of new databases per day. Neon’s compute automatically suspends when idle, so you (the agent builder) are only charged for active usage and storage – aka, if your end-user is actually using the app. This makes short-lived environments economically feasible even at scale.
- **Quota controls via API.** You can define usage limits and policies directly via the API, controlling the actions your end-users are allowed to do at scale, and keeping control over cost and resource usage.
- **Branching enables app timelines and rollback.** Agents can use Neon’s copy-on-write branching to create snapshots of the entire database at key points in time, making it possible to build timeline-style experiences where end users can roll back to earlier versions of their app, complete with data state.
- **Built-in backend.** Via Neon Auth, agents can ship apps with secure, user-scoped access out of the box without wiring up external identity services.

<blockquote>
<p><strong>“Neon’s speed of provisioning and serverless scale-to-zero is critical for us”<em> </em></strong><em>(Dhruv Amin, Co-founder at Create.xyz)</em></p>
</blockquote>

Keep reading about [using Neon for agents](https://neon.com/use-cases/ai-agents).

<Admonition type="note" title="For platform builders">
We also offer [Launchpad](https://neon.new/), an instant way to provision a Neon Postgres database from CLI, backend, or agent logic. No signup required and it expires automatically unless the user claim it. [See an example implementation (by Netlify).](https://neon.com/blog/netlify-db-powered-by-neon)
</Admonition>

## Get started for free

Whether you’re embedding a vector store, building with AI-assisted dev tools, or powering agents that spin up infrastructure on the fly, Neon gives you Postgres that fits your AI use case. Try it yourself via our [Free Plan](https://console.neon.tech/signup) or [neon.new](https://neon.new/).
