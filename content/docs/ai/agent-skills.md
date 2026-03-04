---
title: Agent Skills
subtitle: Teach your AI coding assistant how to work with Neon
enableTableOfContents: true
updatedOn: '2026-03-04T00:00:00.000Z'
redirectFrom:
  - /docs/ai/ai-rules
  - /docs/ai/ai-rules-neon-toolkit
  - /docs/ai/ai-rules-neon-auth
  - /docs/ai/ai-rules-neon-drizzle
  - /docs/ai/ai-rules-neon-serverless
  - /docs/ai/ai-rules-neon-typescript-sdk
  - /docs/ai/ai-rules-neon-python-sdk
  - /docs/ai/ai-rules-neon-api
---

Agent Skills provide your AI coding assistant with structured context about Neon's features, APIs, and best practices. With skills installed, your assistant produces more accurate code and avoids common mistakes when working with Neon.

## Install

There are several ways to install the Neon skill depending on your editor and workflow.

### npx skills

For any AI tool that supports the [Agent Skills](https://agentskills.io) format, install the Neon skill directly:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

This works with Cursor, Claude Code, and other compatible tools. The `-s` flag selects a specific skill from the repository. Available skills include `neon-postgres` (the main Neon development skill) and `claimable-postgres` (for [disposable databases](/docs/reference/claimable-postgres)).

Useful flags:

- `-y` skips the interactive prompt and installs immediately
- `-g` installs the skill globally instead of at the project level (see [Project-level vs. global install](#project-level-vs-global-install))

### Cursor plugin

If you're using Cursor, install the Neon plugin from the marketplace. It bundles skills and the Neon MCP Server in one package.

In Cursor chat, run:

```text
/add-plugin neon-postgres
```

Or install from [cursor.com/marketplace/neon](https://cursor.com/marketplace/neon). See [Cursor plugin for Neon](/docs/ai/ai-cursor-plugin) for details.

### Claude Code plugin

If you're using Claude Code, install the Neon plugin for skills and MCP integration:

```bash
/plugin marketplace add neondatabase/agent-skills
/plugin install neon-postgres@neon
```

See [Claude Code plugin for Neon](/docs/ai/ai-claude-code-plugin) for details.

### neonctl init

The `neonctl init` command sets up your project to use Neon with your AI coding assistant. It authenticates via OAuth, creates an API key, configures the MCP server for your editor, installs the Neon extension for Cursor and VS Code, and installs agent skills at the project level:

```bash
npx neonctl@latest init
```

After running `init`, restart your editor and ask your AI assistant to "Get started with Neon" to launch the interactive onboarding guide. See the [`neonctl init` reference](/docs/reference/cli-init) for details.

## Project-level vs. global install

Skills can be installed at two levels:

- **Project level** (default): Skills are installed in your project directory, for example via `neonctl init` or `npx skills add`. Your AI assistant picks them up when working in that project. This is best for team workflows since the configuration can be committed with the project.
- **Global**: Skills are installed at the user or system level and available across all projects. Useful for personal development environments where you want Neon context everywhere. Pass the `-g` flag to install globally:

  ```bash
  npx skills add neondatabase/agent-skills -s neon-postgres -g
  ```

## What's covered

The Neon skill provides guidance across the full development workflow:

- **Getting started** with Neon, including project setup and key features (branching, autoscaling, scale-to-zero, instant restore, read replicas)
- **Connections**, including the serverless driver, connection pooling, and connection strings
- **Authentication** with Neon Auth
- **Data API** via `@neondatabase/neon-js`
- **Platform APIs and SDKs**, including the REST API, TypeScript SDK, and Python SDK
- **Developer tools**, including the CLI, VS Code extension, and MCP server

For example, ask your assistant to "set up Neon Auth in my Next.js app" and it will provide the correct imports, configuration, and middleware setup. Or ask it to "connect my app to Neon with Drizzle" and it will generate a working schema and connection configuration using the serverless driver.

## How it works

Your AI assistant reads the `SKILL.md` file to understand what Neon guidance is available. When you ask about a specific topic, the skill fetches the relevant documentation from online, so your assistant always has up-to-date context without bundling everything locally. For the complete source, see the [Agent Skills repository](https://github.com/neondatabase/agent-skills).

