---
title: Codex plugin for Neon
summary: >-
  Covers the Neon Postgres Codex plugin: Serverless Postgres project and
  database management, MCP, neon-postgres guidance, and the egress optimizer
  skill.
description: >-
  Install the Neon Postgres plugin in OpenAI Codex for MCP-backed database
  management plus skills for Neon workflows and egress cost optimization.
updatedOn: '2026-04-17T22:00:00.000Z'
---

The **Neon Postgres** Codex plugin helps you manage **Neon Serverless Postgres** projects and databases. It adds Neon-specific [Agent Skills](https://developers.openai.com/codex/skills/) and Neon API access to [OpenAI Codex](https://developers.openai.com/codex/), including the **Neon MCP Server** for project and database management and skills that cover connection methods, branching, autoscaling, [Neon Auth](/docs/auth/overview), and more.

## Overview

Codex plugins combine **skills** (reusable instructions), **apps** (connections that let Codex act in a product), and **MCP servers** so Codex can follow the right steps and use the right tools. The Neon Postgres plugin wires Codex to Neon so it can provision databases and help you connect your app, not only read static guidance.

A typical starting prompt looks like:

```text
Use Neon to create a new Serverless Postgres database for my project and help me connect to it.
```

You can also ask Codex to use the Neon Postgres plugin explicitly when you want it to create and manage Neon Serverless Postgres projects and databases through the bundled tools and skills.

Once everything is installed, Codex can help you:

- Create and manage Neon projects and databases
- Choose connection patterns and frameworks (for example Drizzle ORM)
- Configure serverless Postgres connections
- Apply Neon best practices for branching, autoscaling, and auth

## What's included

The Neon Postgres plugin bundles these parts (as shown in Codex):

| Component                          | Type  | What it does                                                                                                                                                                                                                                                         |
| ---------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Neon Postgres**                  | App   | Manage Neon Postgres databases. Backed by the **Neon MCP Server** for project and database operations.                                                                                                                                                               |
| **Neon Postgres**                  | Skill | Guides and best practices for Neon Serverless Postgres: connection methods, branching, autoscaling, Neon Auth, and related topics. This corresponds to the **`neon-postgres`** skill in the [Agent Skills repository](https://github.com/neondatabase/agent-skills). |
| **Neon Postgres Egress Optimizer** | Skill | Diagnose and reduce excessive Postgres **data transfer (egress)** costs.                                                                                                                                                                                             |

Together, the app gives Codex tools to act on your Neon organization and projects, while the skills steer workflows and deep dives (including cost optimization).

## How it works

Skills are Markdown workflows Codex can load when a task matches. For example, when you ask to integrate Neon with an ORM or tune connections, Codex can use the **Neon Postgres** skill for step-by-step guidance.

The **Neon Postgres** app connects Codex to Neon's APIs through MCP so it can, for example:

- Query Neon for project information
- Create or delete branches and databases
- Validate connection strings
- Run SQL queries and migrations

The **Neon Postgres Egress Optimizer** skill is for tasks focused on finding and fixing high egress, not for everyday CRUD.

## Install the plugin in Codex

### Codex CLI

If the `codex` command is not available yet, install the [Codex CLI](https://developers.openai.com/codex/cli) first:

<Tabs labels={["npm", "Homebrew"]}>

<TabItem>

```bash
npm install -g @openai/codex
codex
```

</TabItem>

<TabItem>

```bash
brew install --cask codex
codex
```

</TabItem>

</Tabs>

The second line starts Codex in your terminal. For Windows, release binaries, and other install options, see the [Codex CLI](https://developers.openai.com/codex/cli) documentation.

With Codex running, run `/plugins` to open the plugin list, open **Neon Postgres**, and choose **Add to Codex**.

### Codex app

Open **Plugins**, browse or search for **Neon Postgres**, open the plugin, then choose **Add to Codex**.

### Complete setup (both paths)

Some plugins ask you to authenticate when you install or the first time you use them. Follow the prompts to connect Neon if asked.

Start a new thread and describe what you want in natural language, or type `@` to pick the **Neon Postgres** plugin or a specific bundled skill. See [Codex app commands](https://developers.openai.com/codex/app/commands) and [Skills](https://developers.openai.com/codex/skills/) in the OpenAI Codex documentation.

## Use with Neon quick setup

To configure Neon MCP and agent skills across supported tools from the command line, you can run:

```bash
npx neonctl@latest init
```

That flow can set up OAuth, API keys, MCP configuration, and project-level skills where applicable. See the [`neonctl init` reference](/docs/reference/cli-init) for details.

## Use skills outside the Codex plugin

The [Agent Skills repository](https://github.com/neondatabase/agent-skills) publishes the same skills for other AI tools. Install the main Neon skill with:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

See [Agent Skills](/docs/ai/agent-skills) for global vs project install and other options.

## Learn more

- [Codex plugins](https://developers.openai.com/codex/plugins/) (OpenAI)
- [Codex skills](https://developers.openai.com/codex/skills/) (OpenAI)
- [Agent Skills repository](https://github.com/neondatabase/agent-skills)
- [Agent Skills overview](/docs/ai/agent-skills)
- [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon) (includes Codex)
- [AI Agents and Tools overview](/docs/ai/ai-agents-tools)

If you run into issues, visit our [Discord](https://discord.gg/92vNTzKDGp) or open an issue in the [Agent Skills repository](https://github.com/neondatabase/agent-skills/issues).
