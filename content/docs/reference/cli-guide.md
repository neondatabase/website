---
title: Neon CLI
subtitle: Install, authenticate, and manage Neon from your terminal
enableTableOfContents: true
redirectFrom:
  - /docs/reference/neon-cli
  - /docs/reference/cli-quickstart
  - /docs/reference/cli-install
---

<Admonition type="tip" title="Fastest setup">
Run `npx neonctl@latest init` from your project root. It handles auth, API key, MCP server config, and agent skills in one step. [Learn more](#neon-init)
</Admonition>

## Install

| Method           | Command                  |
| ---------------- | ------------------------ |
| Homebrew (macOS) | `brew install neonctl`   |
| npm              | `npm i -g neonctl`       |
| bun              | `bun install -g neonctl` |
| npx (no install) | `npx neonctl <command>`  |

## Authenticate

The CLI authenticates automatically on first use, it opens your browser for OAuth. Credentials are saved to `~/.config/neonctl/credentials.json`.

Alternatively, use an API key environment variable or `--api-key`:

```bash
export NEON_API_KEY=neon_api_...
neon projects list
```

## Global options

These work with any command:

| Flag             | Description                                        | Default             |
| ---------------- | -------------------------------------------------- | ------------------- |
| `-o, --output`   | Output format: `json`, `yaml`, or `table`          | `table`             |
| `--api-key`      | Neon API key (overrides env and saved credentials) | `$NEON_API_KEY`     |
| `--config-dir`   | Path to neonctl config directory                   | `~/.config/neonctl` |
| `--context-file` | Context file for project/branch defaults           | `.neon`             |
| `--no-color`     | Disable colored output (useful in CI)              | color on            |
| `--no-analytics` | Opt out of anonymous usage analytics               | analytics on        |
| `-v, --version`  | Show version                                       |                     |
| `-h, --help`     | Show help (works on any command/subcommand)        |                     |

## CLI-only commands

These commands don't map to REST API operations — they're unique to the CLI.

### `neon init`

One-command setup for AI coding assistants. Authenticates, creates an API key, configures MCP server for your editor (Cursor, VS Code, Claude Code, and many others), and installs agent skills.

```bash
npx neonctl@latest init
```

### `neon auth`

Opens browser for OAuth authentication and saves credentials locally. You usually don't need to run this directly — the CLI authenticates automatically on first use.

```bash
neon auth
```

### `neon set-context`

Sets a default project (and optionally branch) for your CLI session, so you don't need to pass `--project-id` on every command. Creates a `.neon` context file in your project root.

```bash
# Set context interactively
neon set-context

# Set context during project creation
neon projects create --name myproject --set-context

# Use a named context file
neon set-context --context-file ./contexts/staging.json
```

The CLI finds the `.neon` file by walking up from your current directory to the nearest `package.json` or `.git`.

### `neon me`

Show the current authenticated user.

```bash
neon me
```

### `neon completion`

Generate a shell completion script for tab-completion of commands and options.

```bash
# bash
neon completion >> ~/.bashrc

# zsh
neon completion >> ~/.zshrc
```

## Resource commands

These commands manage Neon resources. Each row links to the CLI tab on the corresponding API reference page, where you can see flags, required parameters, and examples.

<CliCommandTable />

<Callout>
Use `neon <command> --help` to see all flags for any command directly in your terminal. For example: `neon branches create --help`
</Callout>
