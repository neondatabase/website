---
title: Neon CLI commands — init
subtitle: Use the Neon CLI to manage Neon directly from the terminal
summary: >-
  Step-by-step guide for initializing an app project with Neon using the CLI,
  including authentication, configuring the Neon MCP Server, and installing
  necessary extensions and agent skills for supported editors.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.134Z'
---

## Before you begin

- Before running the `init` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- The `init` command requires authentication. If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running `neon init` will automatically launch the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `init` command

The `init` command initializes your app project with Neon using your AI coding assistant. It configures the Neon MCP (Model Context Protocol) Server or installs the Neon Local Connect extension depending on your editor, installs agent skills, and enables your AI assistant to help set up your Neon integration.

This command will:

- Authenticate via OAuth (opens your browser)
- Create a Neon API key for you automatically
- For **VS Code and Cursor**: Install the [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect), which includes the Neon MCP Server and provides database development tools directly in your IDE
- For **Claude Code**: Configure the Neon MCP Server in `~/.claude.json`
- Install [Neon agent skills](https://github.com/neondatabase/agent-skills) for your selected editor(s)

<Admonition type="note">
Authentication is required to run this command. If you're not already authenticated, the command will automatically launch your browser to complete the authentication process.
</Admonition>

The `init` command supports: **Cursor**, **VS Code with GitHub Copilot**, and **Claude Code**. It automatically detects which editors you have installed and lets you choose which to configure.

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

After running the command, restart your editor and ask your AI assistant to "Get started with Neon" to launch an interactive onboarding guide. The command installs [Neon agent skills](https://github.com/neondatabase/agent-skills) to help you get started with Neon, including helping you configure a database connection. For Cursor and VS Code users, the Neon Local Connect extension also provides database schema browsing, SQL editing, and table data management directly in your IDE.

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
◒  Authenticating...
┌────────┬──────────────────┬────────┬────────────────┐
│ Login  │ Email            │ Name   │ Projects Limit │
├────────┼──────────────────┼────────┼────────────────┤
│ alex   │ alex@domain.com  │ Alex   │ 60             │
└────────┴──────────────────┴────────┴────────────────┘
◇  Authentication successful ✓
│
◇  Installing agent skills for Neon...
│
◇  Agent skills installed ✓
│
◇  Neon Local Connect extension installed for Cursor / VS Code.
│
├  What's next? ───────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                  │
│  Restart Cursor / VS Code, open the Neon extension and type                                      |
|  in "Get started with Neon" in your agent chat                                                   │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
│
└  Have feedback? Email us at feedback@neon.tech
```

## Supported AI Assistants

The `init` command supports:

- **Cursor** — Ask: "Get started with Neon"
- **VS Code with GitHub Copilot** — Ask: "Get started with Neon"
- **Claude Code** — Ask: "Get started with Neon"

The command automatically detects which editors are installed and lets you select which to configure.

## Manual setup

If you prefer to configure manually or need to set up for other IDEs, [create a Neon API key](https://console.neon.tech/app/settings?modal=create_api_key) in the Neon Console and use this configuration:

Example configuration for Claude Code (`~/.claude.json`):

```json
{
  "mcpServers": {
    "Neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <NEON_API_KEY>"
      }
    }
  }
}
```

For detailed manual setup instructions for all editors, see [Connect MCP clients](/docs/ai/connect-mcp-clients-to-neon).

<NeedHelp/>
