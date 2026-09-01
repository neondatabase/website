---
title: 'Neon CLI command: skills'
tag: new
tagTheme: green
subtitle: 'Install and update Neon agent skills in your coding agents'
summary: >-
  The Neon CLI `skills` command installs [Neon agent skills](/docs/ai/agent-skills)
  into your coding agents so they know how to work with Neon. Run it with no
  flags for an interactive walkthrough, or pass flags to pick the skills and
  agents and skip the prompts. Use `neon skills update` to refresh installed
  skills to their latest versions.
enableTableOfContents: true
updatedOn: '2026-09-01T16:04:17.197Z'
---

The `skills` command installs [Neon agent skills](/docs/ai/agent-skills) into your coding agents, so tools like Cursor and Claude Code know how to work with Neon's Postgres, AI Gateway, Object Storage, and Functions.

```bash
neon skills
```

[Install the Neon CLI](/docs/cli/install) with `npm i -g neon@latest`, or run it once with `npx neon@latest skills`.

With no flags it runs an interactive walkthrough: pick the agents, then the skills, then confirm. Pass flags to skip the prompts and script it. Without a terminal, pass `-y` or `--skill` to tell it which skills to install; `--agent` alone isn't enough.

<Callout title="skills vs init">
For the full setup, use [`neon init`](/docs/cli/init). For just one piece: `neon skills` (skills), [`neon plugins`](/docs/cli/plugins) (skills and MCP), or [`neon mcp`](/docs/cli/mcp) (MCP server).
</Callout>

`skills` runs via `npx`, so it needs Node.js 22.20.0+; older or missing Node stops the command with an upgrade message.

<CliSubcommands command="skills" />

## neon skills (#skills)

<CliUsage command="skills" />

<CliOptions command="skills" />

### Choosing agents

Without `--agent`, the interactive command lists all supported agents, pre-selects the ones it detects, and lets you toggle the selection. In non-interactive mode, `-y` installs into every detected agent. Pass `--agent <name>` (repeatable) to name agents explicitly and skip the picker.

The supported agents are `antigravity`, `cline`, `cline-cli`, `claude-code`, `claude-desktop`, `codex`, `cursor`, `gemini-cli`, `goose`, `github-copilot-cli`, `grok-build`, `opencode`, `vscode`, `windsurf`, and `zed`. A few also accept aliases (`claude` for `claude-code`, `copilot` for `vscode`, `gemini` for `gemini-cli`). Passing an unknown agent stops the command and prints the current supported list.

An agent that can't install skills is skipped with a warning. Agents that share a target collapse into one: Claude Desktop and Claude Code both write to `claude-code`, and VS Code and the GitHub Copilot CLI both write to `github-copilot`.

### Choosing skills

Without `--skill`, the interactive command lets you pick from the catalog, and `-y` installs the default set. Pass `--skill <name>` (repeatable) to name skills explicitly and skip the picker.

The available skills are:

| Skill                            | Installed by default |
| -------------------------------- | -------------------- |
| `neon`                           | Yes                  |
| `neon-ai-gateway`                | Yes                  |
| `neon-functions`                 | Yes                  |
| `neon-object-storage`            | Yes                  |
| `neon-postgres`                  | Yes                  |
| `neon-postgres-branches`         | Yes                  |
| `neon-postgres-egress-optimizer` | Yes                  |
| `neon-postgres-agent-platforms`  | No                   |

Passing an unknown skill stops the command and prints the current supported list.

The list of installable skills is built into each CLI release, so a skill that Neon publishes after the version you installed won't appear until you upgrade the CLI.

### Directory vs user-level

By default `skills` installs into the current directory, so the setup travels with the repository. Pass `--global` to install user-level skills instead, which apply across your projects.

### Examples

Run the interactive install:

```bash
neon skills
```

Install non-interactively into every detected agent, using the default skills in the current directory:

```bash
neon skills -y
```

Install named skills into a specific agent. Naming both `--skill` and `--agent` skips every prompt:

```bash
neon skills -s neon -s neon-ai-gateway --agent cursor
```

```text filename="Output"
Skills
Scope           Skills                 Agents  Status
this directory  neon, neon-ai-gateway  cursor  installed

INFO: Wrote skills in this directory.
```

Install user-level skills that apply across your projects:

```bash
neon skills --global
```

## neon skills update (#update)

Updates every skill installed in the current directory to its latest version, or every user-level skill with `--global`. It takes neither `--agent` nor `--skill`; it updates whatever is already installed. When there's nothing to update, the status is `none` and the `Detail` column shows the reason.

<CliUsage command="skills update" />

<CliOptions command="skills update" />

Update skills in the current directory without prompting:

```bash
neon skills update -y
```

```text filename="Output"
Skills
Scope           Status   Detail
this directory  updated  ✓ Updated 1 skill(s)
```

Update user-level skills:

```bash
neon skills update --global -y
```
