---
title: Neon CLI commands — init
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2026-01-30T14:03:06.280Z'
---

## Before you begin

- Before running the `init` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- The `init` command requires authentication. If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running `neon init` will automatically launch the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `init` command

The `init` command initializes your app project with Neon using your AI coding assistant. It installs the Neon MCP (Model Context Protocol) Server, Cursor skills, and the Neon VS Code Extension, enabling your AI assistant to help set up your Neon integration and providing database development tools directly in your IDE.

This command will:

- Authenticate via OAuth (opens your browser)
- Create a Neon API key for you automatically
- Configure your editor to connect to Neon's remote MCP server
- Install Cursor skills from the [Neon skills repository](https://github.com/neondatabase-labs/ai-skills)
- Install the Neon VS Code Extension (for Cursor and VS Code)

<Admonition type="note">
Authentication is required to run this command. If you're not already authenticated, the command will automatically launch your browser to complete the authentication process.
</Admonition>

The `init` command supports: **Cursor**, **VS Code with GitHub Copilot**, and **Claude Code**. It automatically detects which IDE you have installed and configures accordingly. Note that the VS Code Extension is installed for Cursor and VS Code only.

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

After running the command, restart your IDE and ask your AI assistant to "Get started with Neon" to launch an interactive onboarding guide. The Neon MCP Server installs Cursor skills from the [Neon skills repository](https://github.com/neondatabase-labs/ai-skills) to help you get started with Neon, including helping you configure a database connection. The Neon VS Code Extension (installed for Cursor and VS Code) provides database schema browsing, SQL editing, and table data management directly in your IDE.

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
◇  Installed Neon VS Code Extension
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

## Manual setup

If you prefer to configure manually or need to set up for other IDEs, [create a Neon API key](https://console.neon.tech/app/settings?modal=create_api_key) in the Neon Console and use this configuration:

Example configuration for Cursor:

```json
{
  "mcpServers": {
    "Neon": {
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <$NEON_API_KEY>"
      }
    }
  }
}
```

For detailed manual setup instructions for all editors, see [Connect MCP clients](/docs/ai/connect-mcp-clients-to-neon).

<NeedHelp/>
