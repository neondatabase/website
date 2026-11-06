---
title: Set up Neon in Claude Code
subtitle: Install the Neon plugin for agent skills and the Neon MCP Server
summary: >-
  Install the Neon plugin in Claude Code with `npx neon@latest plugins --agent
  claude-code --global`, or from Neon's plugin marketplace with `/plugin install
  neon-postgres@neon`. The plugin bundles seven Neon agent skills and the Neon
  MCP Server. Also covers the official Claude marketplace listing, MCP-only
  setup with OAuth or an API key, and skills-only setup.
enableTableOfContents: true
agentPrompt: I use Claude Code.
redirectFrom:
  - /docs/ai/ai-claude-code-plugin
---

The Neon plugin gives [Claude Code](https://docs.anthropic.com/en/docs/claude-code) Neon's agent skills, so it knows how to build on Neon, and the Neon MCP Server, so it can act on your Neon account.

## Install the plugin

Run:

```bash
npx neon@latest plugins --agent claude-code
```

This installs the plugin at user level, for all your projects. See [`neon plugins`](/docs/cli/plugins) for all options.

Then run `/reload-plugins` in Claude Code, or start a new session. Claude Code asks you to sign in to Neon with OAuth the first time it uses an MCP tool.

To set up the plugin and link a Neon project in one step, run [`npx neon@latest init`](/docs/cli/init) instead.

## Check that it works

Ask Claude Code:

```text
Which Neon skills do you have access to?
```

You should see the Neon skills listed. Then try:

```text
Get started with Neon
```

## Other ways to install

### From a plugin marketplace

In a Claude Code session, install the plugin from Neon's marketplace. This is the same plugin `neon plugins` installs:

```text
/plugin marketplace add neondatabase/agent-skills
/plugin install neon-postgres@neon
```

It's also in Anthropic's official marketplace as `neon@claude-plugins-official`. That listing is pinned to a specific commit and updated separately, so it can lag behind. Install from one marketplace only.

### MCP Server only

To add only the Neon MCP Server, without skills, use OAuth:

```bash
claude mcp add --transport http neon https://mcp.neon.tech/mcp
```

Start a new `claude` session, or run `/mcp`, to sign in. For a [Neon API key](/docs/manage/api-keys) instead, run [`npx neon@latest mcp --agent claude-code`](/docs/cli/mcp), which mints one. The [config generator](/docs/ai/neon-mcp-server#config-generator) also builds an API key config, with read-only mode and other access controls.

### Skills only

```bash
npx neon@latest skills --agent claude-code
```

For an end-to-end example, see [Get started with Claude Code and Neon MCP Server](/guides/claude-code-mcp-neon). If something isn't working, see [MCP troubleshooting](/docs/ai/neon-mcp-server#troubleshooting).

<NeedHelp/>
