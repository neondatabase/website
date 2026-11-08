---
title: Set up Neon in ChatGPT
subtitle: Add the Neon plugin from the ChatGPT plugins directory
summary: >-
  Add the Neon plugin to ChatGPT from Settings > Plugins > Browse directory.
  The plugin includes Neon's agent skills and the Neon app, which connects
  ChatGPT to your Neon account through the Neon MCP Server with OAuth.
---

The Neon plugin for ChatGPT includes Neon's agent skills and the **Neon** app. The app connects ChatGPT to your Neon account through the [Neon MCP Server](/docs/ai/neon-mcp-server). With the plugin, ChatGPT can manage your projects, branches, and SQL in natural language.

<Admonition type="important" title="Security">
The Neon MCP Server is intended for **development and testing only**. Always review LLM-requested actions before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Add the Neon plugin

1. In ChatGPT, go to **Settings** → **Plugins** → **Browse directory**.
2. Search for **Neon** and click **+ Install plugin**.
3. Sign in to Neon when prompted. During authorization, choose read-only or full access.

Then ask in natural language, for example:

```text
List my Neon projects
```

See [Available tools](/docs/ai/neon-mcp-server#available-tools) for everything the Neon app can do.

## Use Neon with dots

Dots, ChatGPT's always-on agents, use the same plugin settings as your ChatGPT account. After you install the Neon plugin, connect it to a dot from **Customize** → **Plugins** in the dot's profile. See [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot).

To build an app on Neon with OpenAI's coding agent, see [Set up Neon in Codex](/docs/ai/agent-setup/codex).

<NeedHelp/>
