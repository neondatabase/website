---
title: Set up Neon in Cursor
subtitle: Install the Neon plugin for agent skills and the Neon MCP Server
summary: >-
  Install the Neon plugin in Cursor with `/add-plugin neon-postgres` in Cursor
  chat, from the Cursor marketplace, or with `npx neon@latest plugins --agent
  cursor --global`. The plugin bundles seven Neon agent skills and the Neon MCP Server.
  Also covers MCP-only setup (one-click install, OAuth, or an API key) and
  skills-only setup.
enableTableOfContents: true
agentPrompt: I use Cursor.
redirectFrom:
  - /docs/ai/ai-cursor-plugin
---

The Neon plugin gives Cursor Neon's agent skills, so it knows how to build on Neon, and the Neon MCP Server, so it can act on your Neon account.

## Install the plugin

In Cursor chat, run:

```text
/add-plugin neon-postgres
```

Or install it from [cursor.com/marketplace/neon](https://cursor.com/marketplace/neon), or from a terminal at user level:

```bash
npx neon@latest plugins --agent cursor --global
```

When Cursor first uses a Neon MCP tool, follow the prompts to sign in to Neon.

To set up the plugin and link a Neon project in one step, run [`npx neon@latest init`](/docs/cli/init) instead.

## Check that it works

Ask Cursor:

```text
Get started with Neon
```

## Other ways to install

### MCP Server only

<a href="https://cursor.com/en-US/install-mcp?name=Neon&config=eyJ1cmwiOiJodHRwczovL21jcC5uZW9uLnRlY2gvbWNwIn0%3D"><img src="/docs/local/mcp-install-dark.svg" alt="Add Neon MCP Server to Cursor" height="32" /></a>

Click the button to add the Neon MCP Server with OAuth. For a [Neon API key](/docs/manage/api-keys) instead, run [`npx neon@latest mcp --agent cursor`](/docs/cli/mcp), which mints one. The [config generator](/docs/ai/neon-mcp-server#config-generator) also builds an API key config, with read-only mode and other access controls.

### Skills only

```bash
npx neon@latest skills --agent cursor
```

For an end-to-end example, see [Get started with Cursor and the Neon MCP Server](/guides/cursor-mcp-neon). If something isn't working, see [MCP troubleshooting](/docs/ai/neon-mcp-server#troubleshooting).

<NeedHelp/>
