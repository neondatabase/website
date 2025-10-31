---
title: Neon CLI commands — init
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2025-10-31T00:00:00.000Z'
---

## Before you begin

- Before running the `init` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `init` command

The `init` command sets up your project to work seamlessly with AI coding assistants like Cursor, VS Code with Copilot, or Claude Code. It configures the Neon MCP (Model Context Protocol) server and creates context files that give your AI assistant full knowledge about your Neon project and best practices.

### Usage

```bash
neon init
```

### What it does

When you run `neon init`, the command performs the following setup steps:

1. **Configures the Neon MCP Server** — Sets up the connection between your AI coding assistant and Neon, enabling the assistant to interact with your databases, branches, and projects
2. **Creates `neon.md`** — Generates a file with detailed guidelines and best practices for working with Neon in your project
3. **Creates `AGENTS.md`** (for Cursor) — Sets up Cursor-specific configuration to enable seamless integration with Neon

After running `init`, you can ask your AI assistant questions like "Get started with Neon" or "Create a new database branch," and the assistant will have full context about your project setup and Neon's capabilities.

### Options

This command supports [global options](/docs/reference/neon-cli#global-options) only.

## Example

Initialize a Neon project in your current directory:

```bash
neon init
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

The `init` command is currently optimized for:

- **Cursor** (full support)
- **VS Code** (coming soon)
- **Claude Code** (coming soon)

<Admonition type="note">
The files created by `neon init` are safe to commit to your repository. They contain documentation and configuration but no sensitive credentials.
</Admonition>

<NeedHelp/>
