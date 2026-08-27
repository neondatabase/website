---
title: 'Neon CLI command: init'
subtitle: Set up the current directory for Neon with agent tooling, a linked project,
  and a neon.ts config
summary: >-
  The `neon init` command sets up the current directory to use Neon with your AI
  coding assistant. In an empty directory it scaffolds a starter template first,
  then installs agent tooling (either a plugin, or skills and the MCP server), links a
  Neon project, and writes a neon.ts config. It runs interactively; for agents and
  CI, run the underlying commands directly.
enableTableOfContents: true
updatedOn: '2026-08-27T22:59:15.528Z'
redirectFrom:
  - /docs/reference/cli-init
---

The `init` command sets up the current directory to use Neon with your AI coding assistant. It's a thin wrapper that runs Neon's other setup commands for you: it installs agent tooling (either the [Neon plugin](/docs/cli/plugins), or [agent skills](/docs/cli/skills) and the [Neon MCP server](/docs/cli/mcp)), [links a Neon project](/docs/cli/link), and writes a [`neon.ts` config](/docs/cli/config). In an empty directory, it [scaffolds a starter template](/docs/cli/bootstrap) first.

`init` is interactive, so run it from a terminal. It asks how coding agents should get Neon, and prompts you to pick a project to link. If you don't have the CLI installed, run it with `npx`:

```bash
npx neon@latest init
```

For agents, CI, or scripts that can't answer prompts, see [Run it non-interactively](#run-it-non-interactively).

## Usage

<CliUsage command="init" />

## What it does

What `init` runs depends on whether the directory is empty:

| Directory                  | What `init` does                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| Empty (nothing but `.git`) | Runs [`neon bootstrap`](/docs/cli/bootstrap): scaffolds a template, then agent tooling and linking |
| Already has files          | Installs agent tooling, links a project, then runs [`neon config init`](/docs/cli/config)          |

A directory counts as empty only when it contains nothing but a `.git` folder. Any other entry, including a `README`, a `.env` file, or a `.gitignore`, makes it an existing app. So a directory you just ran `git init` in that already has a `.gitignore` takes the existing-app path.

### Choose how coding agents get Neon

In a directory that already has files, `init` asks how your coding agents should get Neon:

- **Plugin (recommended)** installs the `neon-postgres` plugin, which bundles agent skills and the MCP server.
- **Skills and MCP separately** installs [agent skills](/docs/cli/skills), then the [Neon MCP server](/docs/cli/mcp).
- **Skip agent setup** continues without a plugin, skills, or MCP.

The plugin and the skills-plus-MCP option are mutually exclusive. Installing skills needs Node.js 22.20 or newer.

### Link a project and write neon.ts

After agent setup, `init` runs [`neon link`](/docs/cli/link) (unless the directory is already linked). Linking writes a `.neon` file with your org, project, and branch, and pulls the branch's environment variables (including `DATABASE_URL`) into `.env` if one exists, otherwise `.env.local`. It then runs [`neon config init`](/docs/cli/config), which creates a `neon.ts` config you can edit and apply with `neon config apply`.

## Options

<CliOptions command="init" />

Pass `-y` (alias `--yes`) to run each step with its defaults instead of prompting: in an empty directory it scaffolds the default template; otherwise it installs the plugin when a project-level Cursor, Claude Code, or Codex setup is detected (else skills and MCP), then links and writes `neon.ts`. Even with `-y`, first-time sign-in still opens a browser, and `link` still asks which project to use unless the directory is already linked.

The old `--agent`, `--data`, `--preview`, and `--skip-migrations` flags were removed. `neon init --agent` and `neon init --data` now return an error pointing you to `neon init` or `neon init -y`.

## Run it non-interactively

`init` needs an interactive terminal. It can't finish in a non-interactive shell (such as CI, a script, or many in-editor agent shells) because it prompts for agent setup and for a project to link, and it has no flag to supply those. To set up Neon without prompts, run the underlying commands directly, each of which takes explicit flags:

```bash
# Install agent tooling for a specific editor
neon skills --agent cursor -s neon -s neon-postgres
# or install the plugin instead:
neon plugins --agent cursor

# Link a specific project (no prompt)
neon link --project-id <project-id> --org-id <org-id>

# Scaffold neon.ts
neon config init --services none
```

Authenticate without a browser by setting `NEON_API_KEY` or passing `--api-key`. See [`neon skills`](/docs/cli/skills), [`neon plugins`](/docs/cli/plugins), [`neon link`](/docs/cli/link), and [`neon config`](/docs/cli/config) for the full options.

## What gets created

The files created depend on the path you take. Each one is written by the command `init` runs, so see that command's page for details.

| Artifact                                              | Written by                                                                                            | Scope                        |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| `.neon` (org, project, and branch context)            | [`neon link`](/docs/cli/link)                                                                         | Project                      |
| `.env` or `.env.local` (`DATABASE_URL` and Neon vars) | [`neon link`](/docs/cli/link)                                                                         | Project                      |
| `neon.ts` (config-as-code policy)                     | [`neon config init`](/docs/cli/config)                                                                | Project                      |
| Agent skills, MCP config, or plugin                   | [`neon skills`](/docs/cli/skills) / [`neon mcp`](/docs/cli/mcp) / [`neon plugins`](/docs/cli/plugins) | Project or global, per agent |
| Scaffolded template files (empty dir only)            | [`neon bootstrap`](/docs/cli/bootstrap)                                                               | Project                      |

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
