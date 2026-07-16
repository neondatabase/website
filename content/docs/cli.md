---
title: Neon CLI
subtitle: 'The Neon command-line interface: every command, with options and examples'
summary: >-
  Neon CLI (neon) is the terminal tool for managing Neon projects, branches,
  databases, roles, connection strings, functions, buckets, and the Data API
  without using the web console. This page indexes every command with its
  subcommands and documents the global options, including --output (json, yaml,
  table), --api-key (NEON_API_KEY), and --context-file. Built for terminal
  workflows, CI/CD automation, scripts, and AI agents.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/neon-cli
  - /docs/reference/cli-create-app
  - /docs/neonctl
  - /docs/get-started/neonctl
updatedOn: '2026-07-15T00:08:00.682Z'
---

One CLI for every Neon surface: manage Postgres, Functions, Storage, the Data API, and Managed Better Auth from the terminal, with branch-scoped workflows built in.

```bash filename="Install"
npm i -g neon
```

## Get started

<DetailIconCards forceGreenIcon>
<a href="/docs/cli/install" description="Install the Neon CLI, authenticate, and connect your first Neon project in minutes." theme="grey" icon="network">Install and connect</a>
<a href="/docs/cli/quickstart" description="Create a project, manage branches, and run your first Neon CLI commands." theme="grey" icon="rocket">Quickstart</a>
</DetailIconCards>

## Agent mode

Use Neon CLI with Claude Code, Cursor, Codex, and other AI development tools.

<Admonition type="note">
Every command supports `--output json` for machine-readable results, and setting the `NEON_API_KEY` environment variable authenticates non-interactively. For AI agents, [`neon link --agent`](/docs/cli/link) emits a JSON state-machine response with a discriminated `status` field describing the next step, instead of prompting.
</Admonition>

## Commands reference

Browse every Neon CLI command, organized by category. The CLI is invoked as `neon`. `neonctl` is an alias for `neon`, so any command works with either name.

### Setup & context [toc-only]

### Projects & branches [toc-only]

### Connect to Postgres [toc-only]

### Config as code [toc-only]

### Functions, storage & data [toc-only]

### Org & network [toc-only]

<CliCommandIndex />

## Global options

Global options are optional and work with any Neon CLI command.

<CliGlobalOptions />

More about global options:

- **Output:** table output may omit fields. Use `--output json` or `--output yaml` to see all data.
- **Authentication:** the CLI checks credentials in this order: the `--api-key` option, the `NEON_API_KEY` environment variable (`export NEON_API_KEY=<neon_api_key>`), the `credentials.json` file that `neon auth` creates in the config directory (override its location with `--config-dir`), then interactive web authentication. To get a key, see [Create an API key](/docs/manage/api-keys#creating-api-keys).
- **Context file:** sets a default organization, project, or branch so you don't repeat IDs in every command. Create one with [`neon link`](/docs/cli/link) (preferred) or [`set-context`](/docs/cli/set-context).
- **Analytics:** Neon collects anonymous data about which commands and options are used, never user-defined data such as project IDs or command payloads. Opt out with `--no-analytics`.
- **Help:** `--help` works at every level: `neon --help`, `neon branches --help`, `neon branches create --help`.

## GitHub repository

The Neon CLI is open source. See the [neondatabase/neon-pkgs](https://github.com/neondatabase/neon-pkgs/tree/main/packages/cli) repository.
