---
title: Set up Neon in Claude.ai and Claude Desktop
subtitle: Add Neon as a Claude connector, or configure the Neon MCP Server in Claude Desktop
summary: >-
  Connect Claude.ai or Claude Desktop to Neon by adding the official Neon
  connector (Settings > Connectors > Browse connectors) and signing in with
  OAuth. Claude Desktop can also load the Neon MCP Server from
  claude_desktop_config.json through the mcp-remote bridge.
enableTableOfContents: true
---

Claude.ai and Claude Desktop connect to Neon through the hosted [Neon MCP Server](/docs/ai/neon-mcp-server), which is an official Claude connector. Add the connector once and sign in, and Claude can manage your projects, branches, and SQL in natural language.

Using Claude Code? See [Set up Neon in Claude Code](/docs/ai/agent-setup/claude-code) instead.

<Admonition type="important" title="Security">
The Neon MCP Server is intended for **development and testing only**. Always review LLM-requested actions before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Add the Neon connector

You don't need a custom connector URL. In [Claude.ai](https://claude.ai) or Claude Desktop:

1. Open **Settings** from your profile menu.
2. Select **Connectors** (sometimes shown under **Customize > Connectors**).
3. Click **Browse connectors** (top-right of that page), find **Neon**, and add it.
4. Authorize access to your Neon account.

Then ask in natural language, for example:

```text
List my Neon projects
```

See [Available tools](/docs/ai/neon-mcp-server#available-tools) for everything the server can do.

## Use a config file instead

Claude Desktop's `claude_desktop_config.json` only supports local (stdio) servers. If you manage Claude Desktop with that file, add the [`mcp-remote` bridge config](/docs/ai/neon-mcp-server#deprecated-stdio). Open the file from **Settings** → **Developer** → **Edit Config**, then restart Claude Desktop. For a walkthrough, see [Get started with Claude Desktop and Neon MCP Server](/guides/neon-mcp-server).

<NeedHelp/>
