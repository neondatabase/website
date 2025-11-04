---
title: Neon CLI commands — init
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2025-11-04T14:08:21.560Z'
---

## Before you begin

- Before running the `init` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `init` command

The `init` command helps you quickly connect your app to Neon and enable the Neon integration in your Cursor chat. The command configures the Neon MCP (Model Context Protocol) Server and creating context files that give your AI assistant full knowledge about your Neon project and best practices.

### Usage

Run this command in the root directory of your application:

```bash
neon init
```

Or use `npx` without installing the CLI globally:

```bash
npx neonctl@latest init
```

### What it does

When you run `neon init`, the command **Configures the Neon MCP Server**, enabling you to interact with your databases, branches, and projects.

After setup, you can ask your Cursor chat to "Get started with Neon using MCP Resource".

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
◒  Authenticating.
┌────────┬──────────────────┬────────┬────────────────┐
│ Login  │ Email            │ Name   │ Projects Limit │
├────────┼──────────────────┼────────┼────────────────┤
│ alex   │ alex@domain.com  │ Alex   │ 20             │
└────────┴──────────────────┴────────┴────────────────┘
◇  Authentication successful ✓
│
◇  Installed Neon MCP server
│
◇  Success! Neon is now ready to use with Cursor.
│
│
◇  What's next? ────────────────────────────────────────────────────────────────────────────╮
│                                                                                           │
│  Restart Cursor and ask Cursor to "Get started with Neon using MCP Resource" in the chat  │
│                                                                                           │
├───────────────────────────────────────────────────────────────────────────────────────────╯
│
└  Have feedback? Email us at feedback@neon.tech
```

## AI Assistant Support

This feature is currently in beta for Cursor, with VS Code and Claude Code support coming soon.

<NeedHelp/>
