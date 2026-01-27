---
title: Claude Code plugin for Neon
description: >-
  Install the Neon Claude Code plugin to give Claude access to Neon's APIs,
  Postgres workflows, and built-in Skills.
updatedOn: '2026-01-27T00:00:00.000Z'
---

The **Neon Claude Code plugin** adds Neon-specific Agent Skills and MCP integration to Claude Code, Anthropic's AI development environment.

## Overview

Once installed, the plugin gives Claude context-aware guidance for the full Neon development workflow — from project setup and connections to authentication, APIs, and more. See [Agent Skills](/docs/ai/agent-skills) for details on what's covered.

## What's included

The plugin contains:

- **Neon Agent Skills** — Context-aware guidance for working with Neon features
- **MCP server integration** — Connects Claude to Neon's APIs for live database operations

## How it works

Agent Skills are Markdown-based instructions that tell Claude how to complete specific tasks — like setting up a database connection, configuring authentication, or running migrations. When you ask Claude to perform a task (for example, _"Set up Neon Auth for my Next.js app"_), it checks the available skills, finds a match, and loads the relevant instructions.

The MCP server integration lets Claude interact with Neon's live API endpoints. That means Claude can:

- Query Neon for project information
- Create or delete branches and databases
- Validate connection strings
- Run SQL queries and migrations

## Install the plugin

1. Add the Neon marketplace:

   ```bash
   /plugin marketplace add neondatabase/agent-skills
   ```

2. Install the Neon plugin:

   ```bash
   /plugin install neon-postgres@neon-agent-skills
   ```

Once installed, verify by asking Claude Code:

```
Which skills do you have access to?
```

You should see the Neon skills listed. Start using them with natural language prompts like:

- _"Get started with Neon"_
- _"Set up Drizzle ORM with Neon"_
- _"Create a new Neon branch using the API"_

Claude will automatically select and execute the relevant skill.

## Learn more

- [Agent Skills overview](/docs/ai/agent-skills) — Full list of available skills and installation options
- [Agent Skills repository](https://github.com/neondatabase/agent-skills) — Source code and documentation
- [Claude Code documentation](https://docs.anthropic.com/en/docs/agents/claude-code)

If you run into issues, visit our [Discord](https://discord.gg/92vNTzKDGp) or open an issue in the [agent-skills repository](https://github.com/neondatabase/agent-skills/issues).
