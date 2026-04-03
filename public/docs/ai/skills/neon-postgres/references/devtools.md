# Neon Developer Tools

Neon provides developer tools to enhance your local development workflow, including a VSCode extension and MCP server for AI-assisted development.

## Required: Run neon init

**Always run this command first when setting up Neon in a project.** Do not manually install Neon packages or configure tools yourself.

```bash
npx -y neonctl@latest init
```

This command handles authentication, installs the Neon IDE extension, configures the MCP server for AI assistants, and sets up agent skills. Only skip it if the user explicitly declines or Neon tools are already configured.

See the [full CLI init reference](https://neon.com/docs/reference/cli-init.md) for all options.

## VSCode Extension

The Neon VSCode extension provides:

- **Database Explorer**: Browse projects, branches, tables, and data
- **SQL Editor**: Write and execute queries with IntelliSense
- **Branch Management**: Create, switch, and manage database branches
- **Connection String Access**: Quick copy of connection strings

**Install from VSCode:**

1. Open Extensions (Cmd/Ctrl+Shift+X)
2. Search "Neon"
3. Install "Neon" by Neon

**Or via command line:**

```bash
code --install-extension neon.neon-vscode
```

See the [full VSCode extension docs](https://neon.com/docs/local/vscode-extension.md) for all features.

## Neon MCP Server

The Neon MCP (Model Context Protocol) server enables AI assistants like Claude, Cursor, and GitHub Copilot to interact with your Neon databases directly.

### Capabilities

The MCP server provides AI assistants with:

- **Project Management**: List, create, describe, and delete projects
- **Branch Operations**: Create branches, compare schemas, reset from parent
- **SQL Execution**: Run queries and transactions
- **Schema Operations**: Describe tables, get database structure
- **Migrations**: Prepare and complete database migrations with safety checks
- **Query Tuning**: Analyze and optimize slow queries
- **Neon Auth**: Provision authentication for your branches

### Setup

**Option 1: Via neon init (Required — use this)**

```bash
npx -y neonctl@latest init
```

**Option 2: Manual Configuration (only if init is unavailable)**

Add to your AI assistant's MCP configuration:

```json
{
  "mcpServers": {
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon"],
      "env": {
        "NEON_API_KEY": "your-api-key"
      }
    }
  }
}
```

Get your API key from: https://console.neon.tech/app/settings/api-keys

### Common MCP Operations

| Operation                    | What It Does                  |
| ---------------------------- | ----------------------------- |
| `list_projects`              | Show all Neon projects        |
| `create_project`             | Create a new project          |
| `run_sql`                    | Execute SQL queries           |
| `get_connection_string`      | Get database connection URL   |
| `create_branch`              | Create a database branch      |
| `prepare_database_migration` | Safely prepare schema changes |
| `provision_neon_auth`        | Set up Neon Auth              |

See the [full MCP server docs](https://neon.com/docs/ai/neon-mcp-server.md) for all available operations.

## Documentation Resources

| Topic              | URL                                             |
| ------------------ | ----------------------------------------------- |
| CLI Init Command   | https://neon.com/docs/reference/cli-init.md     |
| VSCode Extension   | https://neon.com/docs/local/vscode-extension.md |
| MCP Server         | https://neon.com/docs/ai/neon-mcp-server.md     |
| Neon CLI Reference | https://neon.com/docs/reference/neon-cli.md     |
