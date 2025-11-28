---
title: Neon CLI commands — init
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2025-11-28T18:21:08.472Z'
---

## Before you begin

- Before running the `init` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `init` command

The `init` command initializes your app project with Neon using your AI coding assistant. It installs the Neon MCP (Model Context Protocol) Server, which enables your AI assistant to help set up your Neon integration, and authenticates it to Neon using a Neon API key.

The command supports **Cursor**, **VS Code with GitHub Copilot**, and **Claude Code CLI**. It automatically detects which IDE you have installed and configures the MCP server accordingly.

### Usage

#### From the CLI:

You can run it from the Neon CLI to install the Neon MCP (Model Context Protocol) Server and authenticate.

```bash
neon init
```

#### npx

You can also run the `init` command in the root directory of your app with `npx` instead of installing the Neon CLI locally:

```bash
npx neonctl@latest init
```

After running the command, restart your IDE and ask your AI assistant to "Get started with Neon" to launch an interactive onboarding guide. The Neon MCP Server uses AI rules defined in [neon-get-started.mdc](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-get-started.mdc) to help you get started with Neon, including helping you configure a database connection.

<Admonition type="note">
For Cursor users, you can also ask: "Get started with Neon using MCP Resource"
</Admonition>

### Options

This command supports [global options](/docs/reference/neon-cli#global-options) only.

## Example

Navigate to the root directory of your application and run the `neonctl@latest init` command:

```bash
cd /path/to/your/app
npx neonctl@latest init
```

The command outputs progress as it completes each step:

```bash
npx neonctl@latest init

┌  Adding Neon to your project
│
◆  Which editor(s) would you like to configure? (Space to toggle each option, Enter to confirm your selection)
│  ◼ Cursor
│  ◼ VS Code
│  ◻ Claude CLI
│
◒  Authenticating
┌────────┬──────────────────┬────────┬────────────────┐
│ Login  │ Email            │ Name   │ Projects Limit │
├────────┼──────────────────┼────────┼────────────────┤
│ alex   │ alex@domain.com  │ Alex   │ 60             │
└────────┴──────────────────┴────────┴────────────────┘
◇  Authentication successful ✓
│
◇  Installed Neon MCP server
│
◇  Success! Neon is now ready to use with Cursor / VS Code.
│
│
◇  What's next? ─────────────────────────────────────────────────────────────╮
│                                                                            │
│  Restart Cursor / VS Code and type in "Get started with Neon" in the chat  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────╯
```

## Supported AI Assistants

The `init` command supports:

- **Cursor** — Ask: "Get started with Neon using MCP Resource"
- **VS Code with GitHub Copilot** — Ask: "Get started with Neon"
- **Claude Code CLI** — Ask: "Get started with Neon"

The command automatically detects your IDE and configures the appropriate MCP server integration.

<NeedHelp/>
