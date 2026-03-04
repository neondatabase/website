---
title: Claude Code plugin for Neon
summary: >-
  Covers the setup of the Neon Claude Code plugin, which integrates
  Neon-specific Skills and API access into Claude Code, enabling tasks like
  managing databases and configuring serverless connections.
description: >-
  Install the Neon Claude Code plugin to give Claude access to Neon's APIs,
  Postgres workflows, and built-in Skills.
updatedOn: '2026-03-04T00:00:00.000Z'
---

The **Neon Claude Code plugin** adds Neon-specific Skills and API access to Claude Code, Anthropic's AI development environment. It's part of the [Neon Agent Skills repository](https://github.com/neondatabase/agent-skills), and it bundles guided Skills plus an MCP (Model Context Protocol) server integration.

## Overview

Claude Skills are Markdown-based workflows that tell Claude how to complete specific tasks (like setting up a database connection, editing a file, or running a script). The Neon plugin packages several of these Skills into a reusable bundle, so Claude Code can interact directly with Neon Postgres.

Once installed, the plugin gives Claude the ability to:

- Create and manage Neon projects and databases
- Connect frameworks like Drizzle ORM
- Configure serverless Postgres connections
- Reference Neon documentation and best practices in context

## What's included

The plugin contains:

- **Claude Skills** for guided Neon workflows
- **An MCP server integration** that connects Claude to Neon's APIs

### Included Skills

| Skill                  | Description                                                                                                                                                                         |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **neon-postgres**       | The main Neon development skill. Covers getting started, connections, Drizzle ORM, Neon Auth, the Data API, platform SDKs, and developer tools like the CLI and MCP server.        |
| **claimable-postgres**  | Provides workflows for creating disposable, temporary Postgres databases for prototyping, testing, and demos.                                                                      |

## How it works

Each Skill is a Markdown file with a description and a step-by-step workflow. When you ask Claude to perform a task (for example, _"Integrate Neon with Drizzle"_), it checks the available Skill descriptions, finds a match, and loads the full instructions to complete the task.

The plugin's MCP server integration lets Claude interact with Neon's live API endpoints. That means Claude can:

- Query Neon for project information
- Create or delete branches and databases
- Validate connection strings
- Run SQL queries and migrations

## Install the plugin in Claude Code

1. Add the Neon marketplace:

   ```bash
   /plugin marketplace add neondatabase/agent-skills
   ```

2. Install the Neon plugin:

   ```bash
   /plugin install neon-postgres@neon
   ```

3. Verify the installation:
   Ask Claude Code:

   ```text
   which skills do you have access to?
   ```

   You should see the `neon-postgres` skill listed.

4. Start using the Skills:
   Use natural language prompts like:
   > "Use the neon-drizzle Skill to set up Drizzle ORM with Neon."

Claude will automatically select and execute the relevant workflow.

## Use skills outside Claude Code

The [Agent Skills repository](https://github.com/neondatabase/agent-skills) provides skills for other AI tools as well. You can install them with:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

See [Agent Skills](/docs/ai/agent-skills) for all installation options.

## Learn more

- [Agent Skills repository](https://github.com/neondatabase/agent-skills)
- [Agent Skills overview](/docs/ai/agent-skills)
- [Claude Skills documentation](https://docs.anthropic.com/en/docs/agents/claude-code)
- [AI Agents and Tools overview](/docs/ai/ai-agents-tools)

If you run into issues, visit our [Discord](https://discord.gg/92vNTzKDGp) or open an issue in the [Agent Skills repository](https://github.com/neondatabase/agent-skills/issues).
