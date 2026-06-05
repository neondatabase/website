---
title: 'Neon CLI command: init'
subtitle: Initialize an app project with Neon, including auth, MCP server, extensions,
  and agent skills
summary: >-
  The `neon init` command sets up a project to use Neon with an AI coding
  assistant by running OAuth, creating an API key, writing the Neon MCP server
  config, and installing agent skills. It supports Cursor, VS Code, Claude
  Code, and any editor supported by add-mcp. Use this page when starting a
  new project with `npx neonctl@latest init` or when you need to know which
  files get created and where. The `--agent` flag targets a specific editor
  without the interactive prompt.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

## The `init` command

The `init` command sets up your app project to use Neon with your AI coding assistant. Run it once from your project root to get started.

This command will:

- Authenticate via OAuth (opens your browser if needed)
- Create a Neon API key
- For Cursor and VS Code, install the [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) and configure the MCP server
- For Claude Code, configure the MCP server in `~/.claude.json`
- For many other assistants (Claude Desktop, Codex, Zed, Gemini CLI, GitHub Copilot CLI, Cline, OpenCode, and others), write MCP config via [add-mcp](https://github.com/neondatabase/add-mcp) as part of the wizard
- Install [Neon agent skills](https://github.com/neondatabase/agent-skills)

### Coding assistant support

**init** is backed by the **neon-init** package bundled with **neonctl**. Besides Cursor, VS Code, and Claude Code, the interactive flow can configure any client that [add-mcp supports](/docs/ai/connect-mcp-clients-to-neon#supported-agents-add-mcp). To register **only** the Neon MCP server in a client config (no **init**, no agent skills, no extension install), run **`npx add-mcp https://mcp.neon.tech/mcp`**. See [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon).

### What gets created

| Artifact                                                                                                          | Location                                         | Scope   |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| Neon API key                                                                                                      | Neon account (named `neonctl-init-{timestamp}`)  | Account |
| OAuth credentials (created on first auth)                                                                         | `~/.config/neonctl/credentials.json`             | Global  |
| MCP config (Cursor)                                                                                               | `~/.cursor/mcp.json` (written by extension)      | Global  |
| MCP config (VS Code)                                                                                              | VS Code global `mcp.json` (written by extension) | Global  |
| MCP config (Claude Code)                                                                                          | `~/.claude.json` (written by init)               | Global  |
| [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) | Cursor / VS Code                                 | Global  |
| Agent skills                                                                                                      | `.agents/skills/`                                | Project |
| Skills symlink (Claude Code only)                                                                                 | `.claude/skills/neon-postgres`                   | Project |
| `skills-lock.json`                                                                                                | Project root                                     | Project |

### Credentials and API keys

If you previously authenticated with `neon auth`, `init` reuses those credentials (from `~/.config/neonctl/credentials.json`). Otherwise, it opens the browser for OAuth.

`init` creates a new API key each time it runs (named `neonctl-init-{timestamp}`). If you run it more than once, you can revoke old keys in the [Neon Console API Keys settings](https://console.neon.tech/app/settings/api-keys).

For Claude Code, if a Neon MCP entry already exists in `~/.claude.json`, `init` prompts before overwriting it.

### Usage

Run from the root directory of your project:

```bash
npx neonctl@latest init
```

If you have the [Neon CLI installed](/docs/reference/neon-cli#install-the-neon-cli), you can also run:

```bash
neon init
```

After running the command, restart your editor and ask your AI assistant to "Get started with Neon" to launch an interactive onboarding guide. The command installs [Neon agent skills](https://github.com/neondatabase/agent-skills) to help you get started with Neon, including helping you configure a database connection. For Cursor and VS Code users, the Neon Local Connect extension also provides database schema browsing, SQL editing, and table data management directly in your IDE.

Under the hood, `init` runs `npx skills add neondatabase/agent-skills --skill neon-postgres --agent <name>` for each selected editor. You can also run this command directly to install skills without the rest of the init flow, or use `npx skills add ... -g` to install globally. See [neon-postgres on skills.sh](https://skills.sh/neondatabase/agent-skills/neon-postgres) for more about the skill.

<Admonition type="warning">
Skills are installed at the project level in the current working directory. Run `init` from your project root, otherwise skills will end up in the wrong location. You may want to commit project-level files so teammates get the same skills, or add them to `.gitignore` for per-developer setup.
</Admonition>

### Options

| Option               | Description                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `-a, --agent <name>` | Configure a specific editor, skipping the interactive selection prompt. Supported values: `cursor`, `copilot` (VS Code), `claude`. |

When no `--agent` is specified, `init` is an interactive wizard that detects installed tools and lets you choose which to configure. If nothing is detected, you go straight to that list.

## Example

Navigate to the root directory of your application and run the `neonctl@latest init` command:

```bash
cd /path/to/your/app
npx neonctl@latest init
```

The command outputs progress as it completes each step:

```bash
npx neonctl@latest init

┌  Adding Neon MCP server, extension (for VS Code and Cursor) and agent skills
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
│ alex   │ alex@domain.com  │ Alex   │ 100            │
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
│  Restart Cursor / VS Code, open the Neon extension and type                                      │
│  in "Get started with Neon" in your agent chat                                                   │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
│
└  Have feedback? Email us at feedback@neon.tech
```

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
