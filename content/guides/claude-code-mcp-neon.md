---
title: 'Get started with Claude Code and Neon Postgres MCP Server'
subtitle: 'Interact with Neon APIs using Claude Code through natural language'
author: pedro-figueiredo
enableTableOfContents: true
createdAt: '2025-08-27T00:00:00.000Z'
updatedOn: '2026-06-19T23:17:10.824Z'
---

This guide shows how to use [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon) to manage your Neon databases.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. Always review and authorize actions requested by the LLM before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Setting up Neon MCP Server in Claude Code

### Prerequisites

Make sure you have:

1. **Claude Code:** Ensure you have Claude Code installed. Visit [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code) for installation instructions.
2. **Neon API Key (for Local MCP server):** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/api-keys). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](/docs/manage/api-keys).

   <Admonition type="important" title="Neon API Key Security">
   Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
   </Admonition>

3. **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Quick Setup (Recommended)

The fastest way to get started is with the [`neonctl init`](/docs/cli/init) command, which automates OAuth authentication, API key creation, and Claude Code configuration:

```bash
npx neonctl@latest init
```

This command authenticates via OAuth, creates an API key, and configures Claude Code to connect to Neon's remote MCP server. Once complete, ask your AI assistant **"Get started with Neon"**.

### Option 1: Setting up the Remote Hosted Neon MCP Server (OAuth)

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#config-generator).
</Admonition>

1. Open your terminal.
2. Add the Neon MCP server to Claude Code with the following command:
   ```sh
   claude mcp add --transport http neon https://mcp.neon.tech/mcp
   ```
3. Start a new session of `claude` to trigger the OAuth authentication flow:
   ```sh
   claude
   ```
4. You can also trigger authentication with `/mcp` within Claude Code.

<Admonition type="tip">

If you prefer to authenticate using a Neon API key, provide the `Authorization` header to the `mcp add` command:

```sh
claude mcp add --transport http neon https://mcp.neon.tech/mcp \
    --header "Authorization: Bearer <YOUR_NEON_API_KEY>"
```

Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section.

</Admonition>

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API key for authentication.

1. Open your terminal.
2. Add the Neon MCP server to Claude Code with the following command, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key:

   ```sh
   claude mcp add neon -- npx -y @neondatabase/mcp-server-neon start "<YOUR_NEON_API_KEY>"
   ```

3. Start a new Claude Code session with the `claude` command and start using the Neon MCP server:
   ```sh
   claude
   ```

### Verification

Verify the connection:

1. Start Claude Code:

   ```sh
   claude
   ```

2. Type `/mcp` to see the available MCP servers and tools.

3. Try out a Neon MCP Server tool by typing a query like `List my Neon projects` to see your projects and verify the connection.

For a full list of available tools, see [available tools](/docs/ai/neon-mcp-server#available-tools) in the Neon MCP Server overview.

## Development Workflow: Adding a Column with Claude Code and Neon MCP

Here's an example interaction adding a `created_at` column to a table:

```text shouldWrap
User: In my neon project id: round-salad-44063611 list all the tables
Claude Code: I'll help you list all the tables in your Neon project. I'll use the default database name 'neondb' since none was specified.
> Called MCP Tool (get_database_tables)
> I found one table in your database:
> playing_with_neon (in the public schema)
> Would you like to see more details about this table's structure or perform any other operations with it?

User: Can you show me first 5 rows?
Claude Code: I'll query the first 5 rows from the playing_with_neon table.
> Called MCP Tool (run_sql)
> Here are the first 5 rows from the table. The table has three columns:
> id (sequential numbers)
> name (string values)
> value (decimal numbers)
> Would you like to perform any other operations with this data?

User: can you add a created_at column?
Claude Code: I'll help you add a created_at column to the playing_with_neon table. I'll set it up with a timestamp data type and set it to automatically record the creation time of new rows.
> Called MCP Tool (prepare_database_migration)
> Let me verify the change in the temporary branch to make sure it was applied correctly.
> Called MCP Tool (run_sql)
> I've added the created_at column to the playing_with_neon table in a temporary branch. Would you like to commit this migration to the production branch?
> Migration Details:
> Migration ID: a65babcd-d1cc-401f-89b5-762570570102
> Temporary Branch Name: br-silent-cherry-a1eqrl6i
> Temporary Branch ID: br-silent-cherry-a1eqrl6i
> Migration Result: Success
> Please let me know if you'd like to proceed with applying this change to the production branch.

User: yeah do it
Claude Code: I'll complete the migration and apply the changes to the production branch.
> Called MCP Tool (complete_database_migration)
> The migration has been successfully completed! The created_at column has been added to your table in the production branch, and the temporary branch has been cleaned up.
```

You can verify the changes in your Neon Console or by querying the database directly.

<Admonition type="note">
While the Neon MCP server allows you to use all of Neon's functionalities, you can also use a [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
