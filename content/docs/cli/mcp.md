---
title: 'Neon CLI command: mcp'
subtitle: 'Install the Neon MCP Server into your coding agents'
summary: >-
  The Neon CLI `mcp` command installs the [Neon MCP Server](/docs/ai/neon-mcp-server)
  into your coding agents by writing their MCP config for you. Run it with no flags
  for an interactive walkthrough, or pass flags to skip the prompts and script the
  install. It handles the server URL, authentication, and which tools each agent
  gets.
enableTableOfContents: true
---

The `mcp` command installs the [Neon MCP Server](/docs/ai/neon-mcp-server) into your coding agents by writing their MCP config for you. It points each agent at the hosted server (`https://mcp.neon.tech/mcp`), sets up authentication, and can narrow which tools the agent sees.

Run `neon mcp` with no flags for an interactive walkthrough: it asks whether to write global or project-level config, which detected agents to install into, and whether to authenticate with a minted API key or OAuth, then shows you what it will do before writing anything. Pass flags to skip the prompts and run it non-interactively, which is what you want in scripts or a headless environment.

<Callout title="mcp vs init">
For the full setup, use [`neon init`](/docs/cli/init). For just one piece: [`neon skills`](/docs/cli/skills) (skills), [`neon plugins`](/docs/cli/plugins) (skills and MCP), or `neon mcp` (MCP server).
</Callout>

## Usage

<CliUsage command="mcp" />

## Options

<CliOptions command="mcp" />

### Authentication

By default, `mcp` mints a new Neon API key and writes it into each agent's config. Minting requires you to already be signed in, so run [`neon auth`](/docs/cli/auth) first or pass `--api-key`. If you aren't authenticated, the command stops and tells you to sign in, pass `--api-key`, or use `--oauth`.

<Admonition type="warning" title="Minted keys are account-wide by default">
By default a minted API key reaches everything your account can access, in every organization. Pass `--project-id` to limit a newly minted key to a single project instead (see [Scoping the tools](#scoping-the-tools)). The command prints the key's id when it mints one. Revoke it with [`neon api-keys revoke <id>`](/docs/cli/api-keys).
</Admonition>

To install without minting a key, pass `--oauth`. This writes the server URL only, and the agent prompts you to sign in to Neon on first use. When `mcp` finds a Neon API key already configured for an agent, it reuses that key instead of minting a new one.

### Choosing agents

Without `--agent`, the interactive command detects installed agents and lets you pick from them. In non-interactive mode, `-y` installs into every detected agent. Pass `--agent <name>` (repeatable) to name agents explicitly and skip the picker.

The supported agents are `antigravity`, `cline`, `cline-cli`, `claude-code`, `codex`, `cursor`, `gemini-cli`, `goose`, `github-copilot-cli`, `grok-build`, `mcporter`, `opencode`, `vscode`, `windsurf`, and `zed`. A few names also accept aliases (`claude` for `claude-code`, `copilot` for `vscode`, `gemini` for `gemini-cli`). Passing an unknown agent stops the command and prints the current supported list. A supported agent that can't take the chosen config (for example, one with no project-level config file when you pass `--project`) is reported and skipped.

### Scoping the tools

By default the server exposes every MCP tool. Use these flags to narrow what an agent can do:

- `--read-only` hides the write tools by adding `?readonly=true` to the server URL.
- `--category <name>` limits tools to one or more categories (repeatable, or comma-separated). Categories are `projects`, `branches`, `schema`, `querying`, `neon_auth`, `data_api`, `observability`, and `docs`.
- `--project-id <id>` pins the tools to a single Neon project with `?projectId=`, and limits a newly minted key to that project.

`--read-only` and `--category` shape the server URL only; they don't change a key's scope, and neither does reusing an already-configured key.

### Global vs project config

By default `mcp` writes global (per-user) agent config. Pass `--project` to write project-level config in the current directory instead, so the setup travels with the repository. If a project-level config file is tracked by git, the command refuses to write an API key into it. Use `--oauth` in that case, or untrack the file first.

## Examples

Run the interactive install. It walks you through config location, agents, and authentication, then asks you to confirm:

```bash
neon mcp
```

Install non-interactively into every detected agent, using global config. It reuses an API key already configured for an agent, or mints a new one (you must be signed in to mint):

```bash
neon mcp -y
```

Install without minting a key. Each agent prompts you to sign in to Neon on first use:

```bash
neon mcp --oauth
```

Install into specific agents only:

```bash
neon mcp --agent cursor --agent claude-code
```

Write project-level config that travels with the repository. Here, `--oauth` skips minting a key and `--agent` names the target directly, so the command runs without prompts:

```bash
neon mcp --oauth --project --agent cursor
```

```text
INFO: Wrote /home/user/my-app/.cursor/mcp.json
INFO: URL: https://mcp.neon.tech/mcp
MCP
Agent   Status
cursor  installed
INFO: The agent will prompt for Neon sign-in on first use.
```

Give the agent read-only access:

```bash
neon mcp --read-only
```

Limit the agent to schema and querying tools:

```bash
neon mcp --category querying --category schema
```

Pin the tools to one project and limit the minted key to it:

```bash
neon mcp --project-id cold-grass-40154007
```
