---
title: Get started with your AI agent
subtitle: Connect your AI coding assistant to Neon
summary: >-
  `npx neon@latest init` connects an AI coding assistant to Neon,
  installing agent skills and configuring the MCP server in one command.
enableTableOfContents: true
updatedOn: '2026-07-14T19:02:46.207Z'
---

`npx neon@latest init` gives your agent two things: Neon-specific context from agent skills, and tools to act on your Neon account through the MCP server. The result is an agent that can connect your app to Neon and help you use Neon features as you build. For Cursor and VS Code, it also installs the Neon Local Connect extension for in-editor schema browsing.

See how [the full Neon backend fits together](/docs/get-started/full-backend-quickstart) across Postgres, storage, functions, AI, and auth.

## Before you start

You'll need:

- [Node.js 18+](https://nodejs.org/)
- A supported AI coding assistant, such as Cursor, VS Code with GitHub Copilot, Claude Code, Codex, Zed, Gemini CLI, Cline, OpenCode, or another [client supported by add-mcp](/docs/ai/connect-mcp-clients-to-neon#supported-agents-add-mcp)

<Steps>

## Run the init command

From your project root, run:

```bash
npx neon@latest init
```

The wizard asks which editor to configure, then:

- Signs you in to Neon (or signs you up for free)
- Creates a Neon API key
- Installs [agent skills](/docs/ai/agent-skills)
- Configures the [Neon MCP server](/docs/ai/neon-mcp-server)
- For Cursor and VS Code, installs the [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect)

Run this from your project root so the skills are installed in the right place. For details and manual setup, see the [`neon init` reference](/docs/cli/init).

## Restart your editor

Reload your editor so it picks up the new MCP configuration and skills. For Cursor and VS Code, this also activates the Neon Local Connect extension.

## Tell your agent

In your editor's AI chat, send:

```text
Get started with Neon
```

Your agent reads the installed skill and uses the MCP server to walk you through setup. It can:

- Create a Neon project
- Configure your app
- Write your `DATABASE_URL` to `.env`
- Suggest a Postgres driver and starter query

The exact flow depends on your project. Your agent can scaffold a new connection or help with a migration.

</Steps>

## What's next

- [About branching](/docs/introduction/branching)
- [Managed BetterAuth](/docs/auth/overview)
- [Data API](/docs/data-api/overview)
- [Browse your schema with Neon Local Connect](/docs/local/vscode-extension)
- [`neon init` reference](/docs/cli/init)

<NeedHelp/>
