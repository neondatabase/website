---
title: Neon CLI commands — init
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2025-10-31T19:17:38.911Z'
---

## Before you begin

- Before running the `init` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `init` command

The `init` command helps you quickly connect your app to Neon and enable the Neon integration in your Cursor chat. The command walks you through an interactive setup, configuring the Neon MCP (Model Context Protocol) server and creating context files that give your AI assistant full knowledge about your Neon project and best practices.

### Usage

Run this command in the root directory of your application:

```bash
neon init
```

Or use `npx` without installing the CLI globally:

```bash
npx neonctl init
```

### What it does

When you run `neon init`, the command performs the following setup steps:

1. **Configures the Neon MCP Server** — Sets up the connection between your AI coding assistant and Neon, enabling the assistant to interact with your databases, branches, and projects
2. **Creates `neon.md`** — Generates a file with detailed guidelines and best practices for working with Neon in your project
3. **Creates `AGENTS.md`** (for Cursor) — Sets up Cursor-specific configuration to enable integration with Neon

After setup, you can ask your Cursor chat to "Get started with Neon" and it will have full context about your project and Neon best practices.

### Options

This command supports [global options](/docs/reference/neon-cli#global-options) only.

## Example

Navigate to the root directory of your application and initialize Neon:

```bash
cd /path/to/your/app
neon init
```

Or use `npx`:

```bash
cd /path/to/your/app
npx neonctl init
```

The command will output progress as it completes each step:

```bash
🚀 Neon Project Initialization
Step 1/3: Configuring Neon MCP Server...
Step 2/3: Creating neon.md with detailed guidelines...
Step 3/3: Creating AGENTS.md for Cursor...
✓ Success! Neon project initialized.
```

## AI Assistant Support

This feature is currently in beta for Cursor, with VS Code and Claude Code support coming soon.

<Admonition type="note">
The files created by `neon init` are safe to commit to your repository. They contain documentation and configuration but no sensitive credentials.
</Admonition>

<NeedHelp/>
