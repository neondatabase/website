---
title: 'Neon CLI command: init'
subtitle: Initialize an app project with Neon, including auth, MCP server, extensions,
  and agent skills
summary: >-
  The `neon init` command sets up a project to use Neon with an AI coding
  assistant by running OAuth, creating an API key, writing the Neon MCP server
  config, and installing agent skills. It supports Cursor, VS Code, Claude
  Code, and any editor supported by add-mcp. Use this page when starting a
  new project with `npx neon@latest init` or when you need to know which
  files get created and where. The `--agent` flag enables agent/JSON mode and
  auto-detects the editor, skipping the interactive selection prompt.
enableTableOfContents: true
updatedOn: '2026-07-14T19:02:46.207Z'
redirectFrom:
  - /docs/reference/cli-init
---

The `init` command sets up your app project to use Neon with your AI coding assistant. It authenticates via OAuth, creates a Neon API key, configures the Neon MCP server for your editor (installing the [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) for Cursor and VS Code), and installs [Neon agent skills](https://github.com/neondatabase/agent-skills). Run it once from your project root.

## Usage

<CliUsage command="init" />

You can also run `init` without installing the CLI:

```bash
npx neon@latest init
```

After running the command, restart your editor and ask your AI assistant to "Get started with Neon" to launch an interactive onboarding guide. The installed agent skills help you get started, including configuring a database connection. For Cursor and VS Code, the Neon Local Connect extension also provides database schema browsing, SQL editing, and table data management directly in your IDE.

Under the hood, `init` runs `npx skills add neondatabase/agent-skills --skill neon-postgres --agent <name>` for each selected editor. You can also run this command directly to install skills without the rest of the init flow, or use `npx skills add ... -g` to install globally. See [neon-postgres on skills.sh](https://skills.sh/neondatabase/agent-skills/neon-postgres) for more about the skill.

<Admonition type="warning">
Skills are installed at the project level in the current working directory. Run `init` from your project root, otherwise skills will end up in the wrong location. You may want to commit project-level files so teammates get the same skills, or add them to `.gitignore` for per-developer setup.
</Admonition>

## Options

<CliOptions command="init" />

Use `--agent` to enable agent/JSON mode: the editor is auto-detected and the interactive selection prompt is skipped. Without `--agent`, `init` runs an interactive wizard that detects installed tools and lets you choose which to configure; if nothing is detected, you go straight to that list.

## Coding assistant support

`init` is backed by the `neon-init` package bundled with `neon`. Besides Cursor, VS Code, and Claude Code, the interactive flow can configure any client that [add-mcp supports](/docs/ai/connect-mcp-clients-to-neon#supported-agents-add-mcp). To register only the Neon MCP server in a client config (no `init`, no agent skills, no extension install), run `npx add-mcp https://mcp.neon.tech/mcp`. See [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon).

## What gets created

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

## Credentials and API keys

If you previously authenticated with `neon auth`, `init` reuses those credentials (from `~/.config/neonctl/credentials.json`). Otherwise, it opens the browser for OAuth.

`init` creates a new API key each time it runs (named `neonctl-init-{timestamp}`). If you run it more than once, you can revoke old keys in the [Neon Console API Keys settings](https://console.neon.tech/app/settings/api-keys).

For Claude Code, if a Neon MCP entry already exists in `~/.claude.json`, `init` prompts before overwriting it.

## Examples

Navigate to the root directory of your application and run the `init` command:

```bash
cd /path/to/your/app
npx neon@latest init
```

<details>
<summary>Show output</summary>

```text filename="Output"
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

</details>

## Manual setup

If you prefer to configure manually or need to set up for other IDEs, [create a Neon API key](https://console.neon.tech/app/settings?modal=create_api_key) in the Neon Console. Example configuration for Claude Code (`~/.claude.json`):

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
