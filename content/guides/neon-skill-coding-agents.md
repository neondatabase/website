---
title: 'Get better code from your AI coding agent with the Neon skill'
subtitle: 'How the Neon skill helps AI coding agents write higher-quality Postgres code by encoding Neon best practices directly into your project'
author: anthony-giuliano
enableTableOfContents: true
excludeFromBlog: true
createdAt: '2026-05-12T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

<YoutubeIframe embedId="NN251KTjAo8" />

If you're using an AI coding agent to build an app with Neon, add the **Neon skill** to your project. It puts Neon's best practices directly into your repository so your agent writes better Neon code from the first prompt.

### What is the Neon skill?

A "skill" is a Markdown document that lives in your project and gives your AI coding agent domain-specific knowledge about Neon. When your agent reads the Neon skill, it understands how to use Neon correctly without you having to explain the nuances in every prompt.

The Neon skill distills Neon's most important best practices into a concise, structured format. It covers:

- **Neon connection methods and drivers**: which driver to use depending on your deployment target
- **Neon branching workflows**: how to use Neon branches for preview environments, testing, and migrations
- **Neon schema and migration patterns**: conventions that work well with the lakebase architecture
- **Neon environment variable setup**: the correct way to wire up your Neon connection string

Without the Neon skill, your agent relies on its training data, which may be months or years out of date. With the Neon skill, it has current, authoritative guidance from Neon.

### How do I install the Neon skill?

There are a few ways to add the Neon skill to your project, depending on which tool you use. See [Agent Skills](/docs/ai/agent-skills) for all options.

**npx skills (any agent or editor)**

For any AI tool that supports the [Agent Skills](https://agentskills.io) format, install the skill from the [Agent Skills repository](https://github.com/neondatabase/agent-skills). The skill is also listed on [skills.sh](https://skills.sh).

```bash
npx skills add neondatabase/agent-skills -s neon-postgres -y
```

If you have the [Neon CLI](/docs/cli) installed, `neon skills` does the same thing interactively.

**Cursor plugin**

If you're using [Cursor](https://cursor.com), run this in Cursor chat, or install from [cursor.com/marketplace/neon](https://cursor.com/marketplace/neon):

```text
/add-plugin neon-postgres
```

This installs both the Neon skill **and** the [Neon MCP server](/docs/ai/neon-mcp-server), which lets your agent work with your Neon account directly: creating branches, running queries, and managing projects, all from the chat.

**Claude Code plugin**

If you're using [Claude Code](https://claude.ai/code), install the Neon plugin, which also bundles the skill and the Neon MCP server:

```bash
/plugin marketplace add neondatabase/agent-skills
/plugin install neon-postgres@neon
```

### Does the Neon skill actually change the code my agent writes?

Yes. Here's a real example using a Next.js app with Neon and Drizzle.

Suppose you prompt your agent:

> This is a Next.js app that I'll be hosting on Vercel. Please set up Neon with Drizzle.

**Without the Neon skill**, the agent produces:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

This uses the [Neon serverless driver](/docs/serverless/serverless-driver), which connects to Neon over HTTP. It runs without errors, but it's no longer the fastest option for Vercel deployments.

**With the Neon skill**, the agent produces:

```typescript
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { attachDatabasePool } from '@vercel/functions';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
attachDatabasePool(pool);
export const db = drizzle(pool);
```

This uses the standard **Node Postgres driver** with a connection pool and Vercel's `attachDatabasePool` function, which closes idle connections before Vercel suspends the function so the pool doesn't leak connections.

### Why does my agent write suboptimal Neon code without the Neon skill?

As of 2026, Vercel supports **connection pooling with Fluid Compute**, which makes a standard `pg` pool with `attachDatabasePool` the lowest-latency way to connect to Neon from a Next.js app on Vercel, not the HTTP-based Neon serverless driver.

Most AI models have training data that predates this change. They've seen thousands of examples of the Neon serverless driver being used for Vercel deployments, so that's what they reach for by default.

The Neon skill's connection methods section explains this and tells the agent which connection method to use for each deployment target. Because the agent reads the skill before writing code, it picks the right one.

### Does the Neon skill only help with one edge case?

No, the connection method example is one of many. Across a full application (connection handling, migrations, branch-per-PR workflows, read replica routing), there are many similar cases where agent training data lags behind Neon's current best practices.

Without the skill, an agent can make a string of suboptimal choices: code that runs, but misses performance, reliability, or workflow improvements that Neon offers.

### How much does the Neon skill affect my final codebase?

A single wrong connection method is easy to spot and fix. But AI agents make many small decisions across a codebase, and not all of them are as visible as a wrong import. Over time those minor choices add up and degrade your Neon integration.

The Neon skill takes about a minute to set up and applies to every prompt after that.

### Where can I find the Neon skill?

The Neon skill is in the [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills) repository, on [skills.sh](https://skills.sh) (search for **neon-postgres**), and in the plugin marketplaces for Cursor and Claude Code. See [Agent Skills](/docs/ai/agent-skills) for the full list of Neon skills.
