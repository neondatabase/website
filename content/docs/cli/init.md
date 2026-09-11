---
title: 'Neon CLI command: init'
subtitle: Set up the current directory for Neon with agent tooling, a linked project,
  and an optional neon.ts config
summary: >-
  The `neon init` command sets up the current directory to use Neon with your AI
  coding assistant. In an empty directory it lets you pick a starter template or
  skip scaffolding, then installs agent tooling (either a plugin, or skills and the
  MCP server), links a Neon project, and optionally writes a neon.ts config. It runs
  interactively by default; pass -y and --agent for an unattended agent setup.
enableTableOfContents: true
updatedOn: '2026-09-11T02:29:56.410Z'
redirectFrom:
  - /docs/reference/cli-init
---

The `init` command sets up the current directory to use Neon with your AI coding assistant. It's a thin wrapper that runs Neon's other setup commands for you: it installs agent tooling (either the [Neon plugin](/docs/cli/plugins), or [agent skills](/docs/cli/skills) and the [Neon MCP server](/docs/cli/mcp)), [links a Neon project](/docs/cli/link), and can write a [`neon.ts` config](/docs/cli/config). In an empty directory, it also [scaffolds a starter template](/docs/cli/bootstrap): pick one interactively, name one with `--template`, or skip scaffolding with `--skip-template`.

`init` is interactive, so run it from a terminal. It asks how coding agents should get Neon, and prompts you to pick a project to link. If you don't have the CLI installed, run it with `npx`:

```bash
npx neon@latest init
```

For agents, CI, or scripts that can't answer prompts, see [Run it non-interactively](#run-it-non-interactively).

## Usage

<CliUsage command="init" />

## What it does

What `init` runs depends on whether the directory is empty:

| Directory                  | What `init` does                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Empty (nothing but `.git`) | Scaffolds a starter template with [`neon bootstrap`](/docs/cli/bootstrap), then sets up agent tooling and links a project |
| Already has files          | Sets up agent tooling, links a project, and optionally writes a [`neon.ts` config](/docs/cli/config)                      |

A directory counts as empty only when it contains nothing but a `.git` folder. Any other entry, including a `README`, a `.env` file, or a `.gitignore`, makes it an existing app. So a directory you just ran `git init` in that already has a `.gitignore` takes the existing-app path.

In an empty directory, pass `--skip-template` to skip scaffolding and take the existing-app path instead: `init` sets up agent tooling, links a project, and optionally writes `neon.ts` without adding template files.

### Choose how coding agents get Neon

In a directory that already has files, `init` asks how your coding agents should get Neon:

- **Plugin (recommended)** installs the `neon-postgres` plugin, which bundles agent skills and the MCP server.
- **Skills and MCP separately** installs [agent skills](/docs/cli/skills), then the [Neon MCP server](/docs/cli/mcp).
- **Skip agent setup** continues without a plugin, skills, or MCP.

The plugin and the skills-plus-MCP option are mutually exclusive. Installing skills needs Node.js 22.20 or newer.

`init` sets up agent tooling at the project level. It has no global option; for a user-level install, run [`neon skills --global`](/docs/cli/skills) or [`neon plugins --global`](/docs/cli/plugins) directly.

### Link a project and write neon.ts

After agent setup, `init` runs [`neon link`](/docs/cli/link) (unless the directory is already linked). Linking writes a `.neon` file with your org, project, and branch, and pulls the branch's environment variables (including `DATABASE_URL`) into `.env` if one exists, otherwise `.env.local`.

It can also write a [`neon.ts` config](/docs/cli/config) you can edit and apply with `neon config apply`. In a terminal, `init` asks whether to create it. Pass `--config` to create it without asking, `--no-config` to skip it, or `--services` to create it with specific services declared (which implies `--config`). When you scaffold a template, `init` keeps the `neon.ts` that template ships and ignores these flags.

## Options

<CliOptions command="init" />

Pass `-y` (alias `--yes`) to run each step with its defaults instead of prompting. In an empty directory it scaffolds the default template. Otherwise it sets up agent tooling, then links and writes `neon.ts`. With `-y`, `init` detects the target agent from the project folders, else the host CLI agent you're running inside. It installs the plugin for a plugin-capable agent (Cursor, Claude Code, or Codex), or skills and MCP for any other agent. If it detects no agent, it exits and asks you to pass `--agent`. Even with `-y`, first-time sign-in still opens a browser, and `link` still asks which project to use unless the directory is already linked.

Pass `--agent` (alias `-a`) to name the coding agents to set up, which skips both detection and the picker. It's repeatable (`neon init --agent cursor --agent claude-code`) and works with `-y`. `init` sets up one family per run, so it forwards the names to the plugin, or to skills and the MCP server, not both. Run `neon init --help` to see which agents each family supports. Passing `--agent` with no value returns an error.

## Run it non-interactively

Combine `-y` with `--agent` to do the agent setup without prompts, for example in CI or from an agent:

```bash
neon init -y --agent cursor
```

By default, `init` links to the project the directory is already linked to, and when it isn't linked yet, [`neon link`](/docs/cli/link) picks one interactively. To target a project without prompts, `init` forwards project-selection flags to `link`: pass `--project-id` (with `--org-id`) to link an existing project, or `--org-id`, `--project-name`, and `--region-id` to create and link a new one. Pass `--branch` to pin a branch.

```bash
# Existing project, fully non-interactive
neon init -y --agent cursor --project-id <project-id> --org-id <org-id>

# Create a new project and link it
neon init -y --agent cursor --org-id <org-id> --project-name my-app --region-id aws-us-east-2
```

Authenticate without a browser by setting `NEON_API_KEY` or passing `--api-key`. Agents can find the IDs with `neon orgs list --output json` and `neon projects list --org-id <org-id> --output json`. To control `neon.ts` in the same run, add `--config`, `--no-config`, or `--services`; in an empty directory, add `--skip-template` to skip scaffolding.

## What gets created

The files created depend on the path you take. Each one is written by the command `init` runs, so see that command's page for details.

| Artifact                                              | Written by                                                                                            | Scope              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| `.neon` (org, project, and branch context)            | [`neon link`](/docs/cli/link)                                                                         | Project            |
| `.env` or `.env.local` (`DATABASE_URL` and Neon vars) | [`neon link`](/docs/cli/link)                                                                         | Project            |
| `neon.ts` (config-as-code policy)                     | [`neon config init`](/docs/cli/config)                                                                | Project            |
| Agent skills, MCP config, or plugin                   | [`neon skills`](/docs/cli/skills) / [`neon mcp`](/docs/cli/mcp) / [`neon plugins`](/docs/cli/plugins) | Project, per agent |
| Scaffolded template files (empty dir only)            | [`neon bootstrap`](/docs/cli/bootstrap)                                                               | Project            |

## Examples

Run `init` from your project root:

```bash
npx neon@latest init
```

Choose your agent setup, then pick a project to link. Linking writes the context and pulls your environment variables:

```text
Linked /path/to/your/app/.neon:
  orgId:     org-example-12345678
  projectId: polished-snowflake-12345678
  branch:    main

Pulled 3 Neon variables into /path/to/your/app/.env.local: NEON_BRANCH, DATABASE_URL, DATABASE_URL_UNPOOLED
```

After setup, restart your editor and ask your assistant to "Get started with Neon." The installed [Neon MCP server](/docs/ai/neon-mcp-server) points your assistant to the right docs, so it can connect to your database and use Neon features as you build.

## Manual setup

To configure an editor without running `init`, or to register only the Neon MCP server, see [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon). To install only agent skills, use [`neon skills`](/docs/cli/skills); to install only the MCP server, use [`neon mcp`](/docs/cli/mcp).
