---
title: 'Neon CLI command: plugins'
subtitle: 'Install the Neon plugin into coding agents that support plugin marketplaces'
summary: >-
  The Neon CLI `plugins` command installs the `neon-postgres` plugin into
  coding agents that support plugin marketplaces, such as Claude Code, Cursor,
  and Codex. The plugin bundles Neon's agent skills and MCP access. Run it with
  no flags for an interactive walkthrough, or pass `--agent` and `-y` to pick
  the agents and skip the prompts.
enableTableOfContents: true
updatedOn: '2026-11-09T17:20:34.296Z'
---

The `plugins` command installs the `neon-postgres` plugin into coding agents that support plugin marketplaces, so tools like Claude Code, Cursor, and Codex know how to work with Neon. The plugin bundles [Neon's agent skills](/docs/ai/agent-skills) and the [Neon MCP Server](/docs/ai/neon-mcp-server) in one package.

```bash
neon plugins
```

[Install the Neon CLI](/docs/cli/install) with `npm i -g neon@latest`, or run it once with `npx neon@latest plugins`.

With no flags it runs an interactive walkthrough: pick the agents, then confirm. Pass flags to skip the prompts and script it. Without a terminal, pass `-y` to install into detected agents, or name agents with `--agent`.

<Callout title="plugins vs skills vs mcp">
Use [`neon plugins`](/docs/cli/plugins) for agents that support plugin marketplaces, where the plugin bundles skills and MCP in one. For the full setup, use [`neon init`](/docs/cli/init); for skills or the MCP server on their own, use [`neon skills`](/docs/cli/skills) or [`neon mcp`](/docs/cli/mcp).
</Callout>

`plugins` runs via `npx`, so it needs Node.js; without it the command stops with a message to install Node.js and retry.

## Usage

<CliUsage command="plugins" />

## Options

<CliOptions command="plugins" />

### Choosing agents

Without `--agent`, the interactive command lists the supported agents, pre-selects the ones it detects, and lets you toggle the selection. In non-interactive mode, `-y` installs into every detected agent. Pass `--agent <name>` (repeatable) to name agents explicitly and skip the picker.

The agents that support plugins are `claude-code`, `claude-desktop`, `codex`, `cursor`, `github-copilot-cli`, `grok-build`, `kimi-code`, and `vscode`. Several also accept aliases: `claude` for `claude-code`, `grok` for `grok-build`, and `copilot`, `github-copilot`, or `vs-code` for `vscode`. Passing an unknown agent stops the command and prints the supported list. An agent with no plugin support is skipped when others can install, or stops the command when it's the only one selected.

Agents that share a target collapse into one: Claude Desktop and Claude Code both write to `claude-code`.

### Install location

`plugins` installs the plugin user-level, so it applies to every project. There's no project-level install. The `--global` flag from earlier versions is still accepted and does the same thing as the default, so existing scripts keep working (Neon CLI 8.23.2 and later).

## Examples

Run the interactive install:

```bash
neon plugins
```

Install into a specific agent, skipping every prompt:

```bash
neon plugins --agent claude-code -y
```

```text filename="Output"
Plugins
Scope  Plugin         Agent        Status
user   neon-postgres  claude-code  installed

Installed the Neon plugin (user).
```

Install into several agents at once:

```bash
neon plugins --agent cursor --agent claude-code
```

Install non-interactively into every detected agent:

```bash
neon plugins -y
```
