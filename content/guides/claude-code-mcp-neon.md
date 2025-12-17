---
title: 'Get started with Claude Code and Neon Postgres MCP Server'
subtitle: 'Interact with Neon APIs using Claude Code through natural language'
author: pedro-figueiredo
enableTableOfContents: true
createdAt: '2025-08-27T00:00:00.000Z'
updatedOn: '2025-08-27T00:00:00.000Z'
---

Imagine adjusting your database schema simply by describing the change in plain English. This is possible by combining [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon).

This guide demonstrates how to use Claude Code's command-line interface and Neon's MCP server to perform database migrations in your Neon project.

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.

The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.

For more information, see [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Key components

Let's break down the key components in this setup:

- **Claude Code**: Claude Code is Anthropic's official CLI tool that supports Model Context Protocol (MCP) for interfacing with external tools (APIs, databases, etc.)

- **Neon MCP Server**: Neon's MCP server acts as a bridge between MCP clients like Claude Code and [Neon's API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), letting you work with Neon databases using natural language commands.

- **Model Context Protocol (MCP)**: MCP is a lightweight communication standard that allows Claude Code and Neon MCP Server to work together.

## Setting up Neon MCP Server in Claude Code

You have three options for connecting Claude Code to the Neon MCP Server:

1. **Quick Setup (Recommended):** Use the `neonctl init` command to automatically configure Claude Code with OAuth authentication and API key creation.

2. **Remote MCP Server (OAuth):** Manually connect to Neon's managed MCP server using OAuth for authentication. This method is more convenient as it eliminates the need to manage API keys in Claude Code. Additionally, you will automatically receive the latest features and improvements as soon as they are released.

3. **Local MCP Server:** Run the Neon MCP server locally on your machine, authenticating with a Neon API key.

### Prerequisites

Before you begin, ensure you have the following:

1. **Claude Code:** Ensure you have Claude Code installed. Visit [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code) for installation instructions.
2. **Neon API Key (for Local MCP server):** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/api-keys). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](/docs/manage/api-keys).

   <Admonition type="important" title="Neon API Key Security">
   Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
   </Admonition>

3. **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Quick Setup (Recommended)

The fastest way to get started is with the [`neonctl init`](/docs/reference/cli-init) command, which automates OAuth authentication, API key creation, and Claude Code configuration:

```bash
npx neonctl@latest init
```

This command authenticates via OAuth, creates an API key, and configures Claude Code to connect to Neon's remote MCP server. Once complete, ask your AI assistant **"Get started with Neon"**.

### Option 1: Setting up the Remote Hosted Neon MCP Server (OAuth)

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).
</Admonition>

This method uses Neon's managed server and OAuth authentication.

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

<Admonition type="note">
The remote hosted MCP server is in preview due to the [new OAuth MCP specification](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authorization/), expect potential changes as we continue to refine the OAuth integration.
</Admonition>

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API key for authentication.

1. Open your terminal.
2. Add the Neon MCP server to Claude Code with the following command, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key:

   ```sh
   claude mcp add neon -- npx -y @neondatabase/mcp-server-neon start "<YOUR_NEON_API_KEY>"
   ```

   > Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section.

3. Start a new Claude Code session with the `claude` command and start using the Neon MCP server:
   ```sh
   claude
   ```

You've now configured the Neon MCP Server in Claude Code and can manage your Neon Postgres databases using AI.

### Verification

Now that you have the Neon MCP server set up either remotely or locally, you can verify the connection and test the available tools.

1. Start Claude Code:

   ```sh
   claude
   ```

2. Type `/mcp` to see the available MCP servers and tools.

3. Try out a Neon MCP Server tool by typing a query like `List my Neon projects` to see your projects and verify the connection.

<MCPTools />

These actions enable any MCP client like Claude Code to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon's branching for safe preview and commit.

## Development Workflow: Adding a Column with Claude Code and Neon MCP

Let's walk through a typical development scenario: Quickly adding a column for prototyping using natural language within Claude Code. The following chat log demonstrates a real interaction with Claude Code and the Neon MCP server.

**Scenario:** During development, you decide to track timestamps for entries in your `playing_with_neon` table. You want to quickly add a `created_at` column.

<Admonition type="tip" title="Security Reminder">
For your security, review the tool's purpose before permitting the operation to proceed. Remember that LLMs can sometimes produce unexpected results, so careful monitoring is always recommended.
</Admonition>

Here's the conversation log between the user and Claude Code:

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

**Key takeaways:**

- **Natural language interaction:** You can use simple, conversational English to interact with your database.
- **Step-by-step guidance:** Claude Code confirms each step and provides details like branch names and migration IDs.
- **MCP Tools in Action:** The underlying MCP tools (`get_database_tables`, `run_sql`, `prepare_database_migration`, `complete_database_migration`) illustrate the automated process.
- **Branching for safety:** The agent automatically creates a temporary branch for schema changes. The user will be prompted to confirm the migration before applying it to the production branch.

You can verify the changes in your Neon Console or by querying the database directly.

<Admonition type="note">
While the Neon MCP server allows you to utilize all of Neon's functionalities, you can also use a [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Bonus: Creating a project and branch

Beyond schema changes, you can also manage your Neon projects and branches directly within Claude Code using natural language commands. This can be useful for quickly setting up a new development or test environment.

### Creating a new project

Let's say you want to create a new Neon project named "my-new-project". You can simply tell Claude Code:

```text shouldWrap
User: Create a Neon project named "my-new-project"
Claude Code: I'll help you create a new Neon project with the specified name.
> Called MCP Tool (create_project)
> Great! I've created a new Neon project for you with the name "my-new-project". Here are the important details:
> Project ID: orange-dawn-33739962
> Default branch: main
> Default database: neondb
> The project is ready to use. You can start creating tables and working with your database right away.
```

Claude Code will then use the `create_project` MCP tool to initiate the project creation. It will provide you with a project ID and name.

### Creating a New Branch

Once you have a project, you can easily create new branches for development or experimentation. For example, to create a branch named "feature-x" in your "my-new-project" project:

```text shouldWrap
User: Create a branch named "feature-x"
Claude Code: Perfect! I've created a new branch named "feature-x". Here are the details:
> Branch ID: br-cold-mountain-a523ka2w
> Branch name: feature-x
> Parent branch ID: br-odd-pine-a5y53krm
> The branch has been created successfully and is ready for use.
```

Claude Code will use the `create_branch` MCP tool to create the branch and provide you with the branch name and ID. Notice how we don't need to specify the project ID, as Claude Code remembers the active project context.

## Conclusion

Claude Code combined with the Neon MCP Server, whether using the **Remote Hosted (Preview)** option or the **Local Server** setup, lets you use natural language to interact with your database and take advantage of Neon's branching capabilities for fast iteration. This approach is ideal for quickly testing database ideas and making schema changes during development.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
