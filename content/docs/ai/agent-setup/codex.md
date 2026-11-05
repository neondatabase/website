---
title: Set up Neon in Codex
subtitle: Install the Neon plugin in the Codex CLI or the Codex app
summary: >-
  Install the Neon plugin in OpenAI Codex from the plugin directory (`/plugins`
  in the Codex CLI, or Plugins in the Codex app), or run `npx neon@latest
  plugins --agent codex --global`. The plugin bundles the Neon MCP Server, shown in
  Codex as the Neon app, and Neon's agent skills. Also covers MCP-only setup in
  .codex/config.toml and skills-only setup.
enableTableOfContents: true
agentPrompt: I use Codex.
redirectFrom:
  - /docs/ai/ai-codex-plugin
---

The Neon plugin gives [OpenAI Codex](https://developers.openai.com/codex/) Neon's [agent skills](https://developers.openai.com/codex/skills/), so it knows how to build on Neon. It also adds the Neon MCP Server, so Codex can act on your Neon account. In Codex, the MCP Server appears as the **Neon** app.

## Install the plugin

<Tabs labels={["Codex CLI", "Codex app", "Neon CLI"]}>

<TabItem>

In the Codex CLI, run `/plugins`, open **Neon**, and choose **Add to Codex**. To install the Codex CLI first, see [Codex CLI](https://developers.openai.com/codex/cli).

</TabItem>

<TabItem>

In the Codex app, open **Plugins**, search for **Neon**, and choose **Add to Codex**.

</TabItem>

<TabItem>

Install the plugin at user level:

```bash
npx neon@latest plugins --agent codex --global
```

</TabItem>

</Tabs>

If Codex asks you to connect Neon, follow the prompts. To set up the plugin and link a Neon project in one step, run [`npx neon@latest init`](/docs/cli/init) instead.

## Check that it works

Start a new thread, or type `@` to pick the **Neon** plugin, and ask:

```text
Use Neon to create a new Postgres database for my project and help me connect to it.
```

## Other ways to install

### MCP Server only

```bash
npx add-mcp https://mcp.neon.tech/mcp -a codex
```

This adds a `neon` entry to `.codex/config.toml` (add `-g` to write `~/.codex/config.toml` instead). Restart Codex. If Codex doesn't prompt you to sign in, run `codex mcp login neon` and click **Authorize** in the OAuth window.

Or run [`npx neon@latest mcp --agent codex`](/docs/cli/mcp). For read-only mode and other access controls, see the [Neon MCP Server](/docs/ai/neon-mcp-server) reference.

### Skills only

```bash
npx neon@latest skills --agent codex
```

For a schema refactoring walkthrough, see [Safe AI-powered schema refactoring with OpenAI Codex and Neon](/guides/openai-codex-neon-mcp). If something isn't working, see [MCP troubleshooting](/docs/ai/neon-mcp-server#troubleshooting).

<NeedHelp/>
