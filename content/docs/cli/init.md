---
title: 'Neon CLI command: init'
subtitle: Set up the current directory for Neon with agent tooling, a linked project,
  and an optional neon.ts config
summary: >-
  The `neon init` command sets up the current directory to use Neon with your AI
  coding assistant. It installs agent tooling (either a plugin, or skills and the
  MCP server), links a Neon project, and optionally writes a neon.ts config. It
  runs interactively by default; pass -y for the recommended setup with no prompts,
  or add flags such as --skill, MCP options, or --claimable for the custom setup.
enableTableOfContents: true
updatedOn: '2026-09-26T07:10:22.076Z'
redirectFrom:
  - /docs/reference/cli-init
---

The `init` command sets up the current directory to use Neon with your AI coding assistant. It's a thin wrapper that runs Neon's other setup commands for you: it installs agent tooling, [links a Neon project](/docs/cli/link), and can write a [`neon.ts` config](/docs/cli/config). It sets up the current directory in place.

`init` is interactive, so run it from a terminal. It asks how coding agents should get Neon, prompts you to pick a project to link, and asks whether to write `neon.ts`. If you don't have the CLI installed, run it with `npx`:

```bash
npx neon@latest init
```

For agents, CI, or scripts that can't answer prompts, see [Run it non-interactively](#run-it-non-interactively).

<Admonition type="note" title="Behavior changed in Neon CLI 6.0">
Before 6.0, `init` could scaffold a starter template in an empty directory, and it accepted `--template` and `--skip-template`. From 6.0, `init` only sets up the current directory in place, those template flags are gone, and `-y` runs a recommended setup. To scaffold a starter project, use [`neon bootstrap`](/docs/cli/bootstrap) instead.
</Admonition>

## Usage

<CliUsage command="init" />

## Recommended and custom setup

`init` has two setup modes:

- **Recommended setup** installs tooling for your detected coding agents, links a Neon project when the CLI is authenticated (or the session is interactive), and writes a default `neon.ts`. Run it with no prompts using `-y`. When no agents are detected, it writes the default skills in the current directory.
- **Custom setup** applies the specific answers you pass as flags and falls back to the recommended defaults for anything you don't. Passing `--skill`, an MCP flag (`--mcp-auth`, `--mcp-config-location`, or `--mcp-project-scoped`), `--no-agent-setup`, or `--claimable` selects it.

`-y` alone runs the recommended setup without prompts and never opens a browser. `-y` with any of those flags runs the custom setup with your answers, still without prompts.

## What it does

### Choose how coding agents get Neon

In a terminal, `init` asks how your coding agents should get Neon:

- **Plugin (recommended)** installs the `neon-postgres` plugin, which bundles agent skills and the MCP server.
- **Skills and MCP separately** installs [agent skills](/docs/cli/skills), then the [Neon MCP server](/docs/cli/mcp).
- **Skip agent setup** continues without a plugin, skills, or MCP.

You can also make this choice with flags, which skips the prompt:

- `--agent` (without skill or MCP flags) installs the plugin for the named agents, plus skills and MCP for any agent the plugin can't cover.
- `--skill` selects skills (not the plugin) and skips the skills picker. Combined with an MCP flag, it also configures MCP.
- An MCP flag (`--mcp-auth`, `--mcp-config-location`, or `--mcp-project-scoped`) selects skills and MCP.
- `--no-agent-setup` skips agent setup entirely.

The plugin and the skills-plus-MCP option are mutually exclusive; `init` sets up one family per run. Installing skills needs Node.js 22.20 or newer.

Recommended setup installs agent tooling globally for your detected agents, so it's available across projects. Custom setup can set up the current directory instead: pass `--mcp-config-location project` to write the MCP configuration locally. To control the scope yourself, run [`neon skills`](/docs/cli/skills) or [`neon plugins`](/docs/cli/plugins) directly.

### Link a project and write neon.ts

After agent setup, `init` runs [`neon link`](/docs/cli/link) (unless the directory is already linked). Linking writes a `.neon` file with your org, project, and branch, and pulls the branch's environment variables (including `DATABASE_URL`) into `.env` if one exists, otherwise `.env.local`. Pass `--no-link` to set up agent tooling and `neon.ts` without linking a project; you can link later with `neon link`.

It can also write a [`neon.ts` config](/docs/cli/config) you can edit and apply with `neon config apply`. In a terminal, `init` asks whether to create it. Pass `--config` to create it without asking, `--no-config` to skip it, or `--services` to create it with specific services declared (which implies `--config`). Pass `--package-manager` (`npm`, `pnpm`, `yarn`, or `bun`) to choose which package manager installs the `neon.ts` dependencies.

## Options

<CliOptions command="init" />

Pass `-y` (alias `--yes`) to run each step with its defaults instead of prompting. On its own, `-y` runs the recommended setup: it detects agents from your global agent configuration, the project folders, and the host CLI agent you're running inside, then installs the plugin globally for each detected agent that supports it, and skills and MCP for the rest. Run `neon init --help` to see which agents fall into each family. If it detects no agent, it writes the default skills in the current directory. `-y` links your only organization and project, or prints the IDs and exits when you have several (pass `--org-id`/`--project-id` to choose), and it never opens a browser.

Pass `--agent` (alias `-a`) to name the coding agents to set up, which skips both detection and the picker. It's repeatable (`neon init --agent cursor --agent claude-code`) and works with `-y`. Without skill or MCP flags, it installs the plugin, plus skills and MCP for any agent the plugin can't cover. Run `neon init --help` to see which agents each family supports. Passing `--agent` with no value returns an error.

Pass `--claimable` to create a [claimable project](/docs/reference/claimable-neon) that expires in 72 hours unless it's claimed. This selects the custom setup.

## Run it non-interactively

Combine `-y` with any of those flags to set up without prompts, for example in CI or from an agent. Without a TTY, pass `-y` or enough flags to answer every question:

```bash
neon init -y --agent cursor
```

By default, `init` links to the project the directory is already linked to, and when it isn't linked yet, [`neon link`](/docs/cli/link) picks one interactively. To target a project without prompts, `init` forwards project-selection flags to `link`: pass `--project-id` (with `--org-id`) to link an existing project, or `--org-id`, `--project-name`, and `--region-id` to create and link a new one. Pass `--branch` to pin a branch.

```bash
# Existing project, fully non-interactive
neon init -y --agent cursor --project-id <project-id> --org-id <org-id>

# Create a new project and link it
neon init -y --agent cursor --org-id <org-id> --project-name my-app --region-id aws-us-east-2

# Custom setup: install the neon skill and configure MCP with OAuth in this directory
neon init -y --skill neon --mcp-auth oauth --mcp-config-location project
```

Authenticate without a browser by setting `NEON_API_KEY` or passing `--api-key`. Agents can find the IDs with `neon orgs list --output json` and `neon projects list --org-id <org-id> --output json`. To control `neon.ts` in the same run, add `--config`, `--no-config`, or `--services`.

## What gets created

The files created depend on the flags you pass. Each one is written by the command `init` runs, so see that command's page for details.

| Artifact                                              | Written by                                                                                            | Scope              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| `.neon` (org, project, and branch context)            | [`neon link`](/docs/cli/link)                                                                         | Project            |
| `.env` or `.env.local` (`DATABASE_URL` and Neon vars) | [`neon link`](/docs/cli/link)                                                                         | Project            |
| `neon.ts` (config-as-code policy)                     | [`neon config init`](/docs/cli/config)                                                                | Project            |
| Agent skills, MCP config, or plugin                   | [`neon skills`](/docs/cli/skills) / [`neon mcp`](/docs/cli/mcp) / [`neon plugins`](/docs/cli/plugins) | Project, per agent |

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

Install the Neon plugin for a specific agent and create a [claimable project](/docs/reference/claimable-neon). Naming an agent with `--agent` selects the custom setup, which installs the plugin at the project level:

```bash
neon init -y --claimable --agent cursor
```

<details>
<summary>Show output</summary>

```text
Installing the Neon plugin...
INFO: Installing the Neon plugin for Cursor (1/1)...
Plugins
Scope    Plugin         Agent   Status
project  neon-postgres  cursor  installed
INFO: Installed the Neon plugin (project).
Creating a claimable project...
Project Id            sweet-breeze-12345678
Branch Id             br-restless-wildflower-a1b2c3d4
State                 unclaimed
Project Expires At    2026-09-29T01:51:07.360Z
Granted Capabilities  postgres
Creating neon.ts...
Installing Neon dependencies with npm...
Pulling Neon environment variables...
INFO: → Pulling env from branch main (br-restless-wildflower-a1b2c3d4)
INFO: Pulled 3 Neon variables into /path/to/your/app/.env.local: DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_BRANCH

Neon setup complete.
--------------------

  Agents   Neon plugin: cursor
  Project  claimable
  Config   neon.ts created

Next:
  This project expires at 2026-09-29T01:51:07.360Z.
  To keep it, open the claim flow and sign in to Neon:
  neon claim accept
```

</details>

## Manual setup

To configure an editor without running `init`, or to register only the Neon MCP server, see [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon). To install only agent skills, use [`neon skills`](/docs/cli/skills); to install only the MCP server, use [`neon mcp`](/docs/cli/mcp).
