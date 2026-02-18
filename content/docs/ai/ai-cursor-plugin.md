---
title: Cursor plugin for Neon
summary: >-
  Covers setup of the Neon Cursor plugin, which bundles Neon agent skills and
  Neon MCP server access in Cursor for natural language database workflows.
description: >-
  Install the Neon Cursor plugin to use Neon agent skills and MCP-powered
  database operations directly in Cursor.
updatedOn: '2026-02-16T23:25:57.647Z'
---

The **Neon Cursor plugin** adds Neon-specific Skills and MCP integration to Cursor so your assistant can both reason about best practices and take database actions.

It is distributed from the [Neon agent-skills repository](https://github.com/neondatabase/agent-skills) and packages:

- The `neon-postgres` Skill bundle for Neon workflows
- Neon MCP server access for project and database operations
- Shared plugin packaging designed for both Cursor and Claude Code

## Overview

The plugin combines guidance and actions:

- **Skills** provide workflow-level instructions for tasks like choosing a connection method, setting up ORMs, and using Neon branching patterns.
- **MCP integration** allows tool-driven operations such as listing projects, creating branches, and running SQL through Neon APIs.

Together, this gives Cursor enough context to suggest the right approach and enough capability to execute it.

## What is included

The Cursor plugin currently includes:

- **Neon Skill bundle (`neon-postgres`)**
- **Neon MCP server configuration** for natural language database management

For plugin packaging details, see the [Cursor plugin template](https://github.com/cursor/plugin-template).

## Install the plugin in Cursor

1. Open Cursor chat and run:

   ```text
   /add-plugin neon-postgres
   ```

2. After installation, prompt Cursor with:

   ```text
   Get started with Neon
   ```

3. Follow the prompts to complete authentication and start using Neon Skills and MCP tools.

## Use with Neon quick setup

If you want Neon to configure AI tooling automatically, run:

```bash
npx neonctl@latest init
```

This configures MCP and installs Neon agent skills for supported editors.

## Learn more

- [Neon Agent Skills repository](https://github.com/neondatabase/agent-skills)
- [AI Agents and Tools overview](/docs/ai/ai-agents-tools)
- [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon)
