---
title: Set up Neon in VS Code and GitHub Copilot
subtitle: Install the Neon plugin, the Neon MCP Server, or Neon's custom agents for GitHub Copilot
summary: >-
  Set up Neon for GitHub Copilot in VS Code and the GitHub Copilot CLI. Install
  the Neon plugin at user level with `npx neon@latest plugins --agent vscode
  --global`, or add only the Neon MCP Server to .vscode/mcp.json with OAuth or
  an API key. Also covers the Neon VS Code extension, which configures the MCP
  Server on sign-in, and the Neon Migration Specialist and Neon Performance
  Analyzer custom agents for Copilot.
enableTableOfContents: true
agentPrompt: I use GitHub Copilot in VS Code.
redirectFrom:
  - /docs/ai/ai-github-copilot-agents
  - /guides/neon-mcp-server-github-copilot-vs-code
---

GitHub Copilot in VS Code gets Neon through the Neon plugin, which bundles Neon's agent skills and the Neon MCP Server. To use MCP servers in VS Code, you need the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions.

## Install the plugin

For VS Code, `neon plugins` installs the plugin at user level only, so pass `--global`:

```bash
npx neon@latest plugins --agent vscode --global
```

The GitHub Copilot CLI uses the same plugin target (`github-copilot`), so `--agent github-copilot-cli --global` installs to the same place.

[`npx neon@latest init`](/docs/cli/init) sets up VS Code with the skills and MCP Server installed separately (not the plugin) and links a Neon project.

## Check that it works

Open GitHub Copilot Chat, [switch to Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode), and ask:

```text
Get started with Neon
```

## Other ways to install

### MCP Server only

```bash
npx add-mcp https://mcp.neon.tech/mcp -a vscode
```

This writes `.vscode/mcp.json` in your project (`-g` writes your user-level `mcp.json`). Restart VS Code or enable the server in settings, and click **Authorize** when the OAuth window opens. Or run [`npx neon@latest mcp --agent vscode`](/docs/cli/mcp).

To configure it by hand with a [Neon API key](/docs/manage/api-keys), add this to `.vscode/mcp.json`:

```json
{
  "servers": {
    "neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_NEON_API_KEY>"
      }
    }
  }
}
```

For read-only mode and other access controls, see the [Neon MCP Server](/docs/ai/neon-mcp-server) reference.

### Skills only

```bash
npx neon@latest skills --agent vscode
```

### Neon VS Code extension

The [Neon VS Code extension](/docs/local/vscode-extension) lets you browse projects, branches, and tables in the editor. When you sign in, it also configures the Neon MCP Server.

## Neon custom agents for GitHub Copilot

Neon publishes two custom agents for GitHub Copilot in the [awesome-copilot](https://github.com/github/awesome-copilot) repository. Both work on temporary branches (default TTL of 4 hours), away from your main branch:

- The [Neon Migration Specialist](https://github.com/github/awesome-copilot/blob/main/agents/neon-migration-specialist.agent.md) tests a migration on a temporary branch, then opens a PR with the migration files for you or your CI/CD to apply. It works with your ORM's migration system (Prisma, Drizzle, SQLAlchemy, Django, Rails, and more) and never runs migrations on your main branch.
- The [Neon Performance Analyzer](https://github.com/github/awesome-copilot/blob/main/agents/neon-optimization-analyzer.agent.md) finds slow queries with `pg_stat_statements` and `EXPLAIN`, tests indexes and query rewrites on a temporary branch, and opens a PR with before and after metrics.

Both agents call the Neon API directly, so they need a [Neon API key](https://console.neon.tech/app/settings#api-keys) and a project ID or connection string. They ask for these if you haven't provided them. To install an agent, use its **Install in VS Code** button in the [awesome-copilot custom agents list](https://github.com/github/awesome-copilot/blob/main/docs/README.agents.md), or add its `.agent.md` file to your repository's `.github/agents/` directory. Then mention it in GitHub Copilot Chat:

```text
@neon-migration-specialist Add a new email column to my users table
```

<NeedHelp/>
