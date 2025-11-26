---
title: 'Get started with Cline and Neon Postgres MCP Server'
subtitle: 'Make schema changes with natural language using Cline and Neon MCP Server'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-22T00:00:00.000Z'
updatedOn: '2025-02-22T00:00:00.000Z'
---

Imagine adjusting your database schema simply by describing the change in plain English. This is possible by combining [Cline](https://cline.bot) with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon).

This guide demonstrates how to use [Cline](https://docs.cline.bot/mcp-servers/mcp) and Neon's MCP server to perform database migrations in your Neon project.

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.

The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.

For more information, see [MCP security guidance →](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Key components

Let's break down the key components in this setup:

- **Cline**: Cline is an autonomous coding agent streamlining your development process within your IDE. It offers powerful features for creating, editing, executing, and even browsing, all under your guidance. Cline has support for the Model Context Protocol (MCP), facilitating seamless interaction with external tools.

- **Neon MCP Server**: Neon's MCP server acts as a bridge between MCP clients like Cline and [Neon's API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), letting you work with Neon databases using natural language commands.

- **Model Context Protocol (MCP)**: MCP is a lightweight communication standard that allows Cline and Neon MCP Server to work together.

## Setting up Neon MCP Server in Cline

You have two options for connecting Cline to the Neon MCP Server:

1. **Remote MCP Server (Preview):** Connect to Neon's managed MCP server using OAuth for authentication. This method is more convenient as it eliminates the need to manage API keys in Cline. Additionally, you will automatically receive the latest features and improvements as soon as they are released.

2. **Local MCP Server:** Run the Neon MCP server locally on your machine, authenticating with a Neon API key.

### Prerequisites

Before you begin, ensure you have the following:

1.  **Cline extension and Setup:**
    - Download and install the Cline VS Code extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev).
    - Set up Cline by following the [Getting Started guide](https://docs.cline.bot/getting-started/getting-started-new-coders#setting-up-openrouter-api-key) which involves obtaining an [OpenRouter API key](https://openrouter.ai) to work with Cline.
2.  **A Neon Account and Project:** You'll need a Neon account and a project. You can quickly create a new Neon project here [pg.new](https://pg.new)
3.  **Neon API Key (for Local MCP server):** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/profile). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](/docs/manage/api-keys).
    <Admonition type="warning" title="Neon API Key Security">
    Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
    </Admonition>
4.  **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Option 1: Setting up the remote hosted Neon MCP Server

This method uses Neon's managed server and OAuth authentication.

### Installation and configuration

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).
</Admonition>

1. Open Cline by clicking the **Cline** icon in the VS Code sidebar.
2. In the Cline navigation bar, select the **MCP Servers** icon.
   ![Cline MCP Servers Icon](/docs/guides/cline-mcp-servers-icon.png)
3. Click **Remote Servers** to add a new remote MCP server.
4. Fill out the form with the following details:
   - **Name:** `Neon`
   - **URL:** `https://mcp.neon.tech/mcp`
   - **Transport Type:** Streamable HTTP

   ![Cline Add Remote MCP Server](/docs/guides/cline-add-remote-mcp-server.png)

5. Click **Add Server** to register the Neon MCP server.
6. Cline will prompt you to authenticate with Neon via OAuth. Click **Authenticate**.
7. A browser window will open asking you to sign in to your Neon account and authorize Cline to access your Neon projects.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)
8. Once authentication is complete, Cline will display a confirmation message, and **Neon** will appear under your list of available MCP servers.

<Admonition type="note">
  The remote hosted MCP server is in preview due to the [new OAuth MCP specification](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authorization/), expect potential changes as we continue to refine the OAuth integration.
</Admonition>

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API key for authentication.

1. Open Cline by clicking the **Cline** icon in the VS Code sidebar.
2. In the Cline navigation bar, select the **MCP Servers** icon.
   ![Cline MCP Servers Icon](/docs/guides/cline-mcp-servers-icon.png)
3. Click **Configure** to open the MCP server settings.
   ![Cline MCP Server Configure](/docs/guides/cline-mcp-server-configure.png)
4. This will open the `cline_mcp_settings.json` file.
5. In the `cline_mcp_settings.json` file, you need to specify a list of MCP servers.
6. Paste the following JSON configuration into it. Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section:
   <CodeTabs labels={["MacOS/Linux", "Windows", "Windows (WSL)"]}>

   ```json
   {
     "mcpServers": {
       "neon": {
         "command": "npx",
         "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
       }
     }
   }
   ```

   ```json
   {
     "mcpServers": {
       "neon": {
         "command": "cmd",
         "args": [
           "/c",
           "npx",
           "-y",
           "@neondatabase/mcp-server-neon",
           "start",
           "<YOUR_NEON_API_KEY>"
         ]
       }
     }
   }
   ```

   ```json
   {
     "mcpServers": {
       "neon": {
         "command": "wsl",
         "args": ["npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
       }
     }
   }
   ```

   </CodeTabs>

7. **Save** the `cline_mcp_settings.json` file.
8. You should see a notification in VS Code that says: "MCP servers updated".
   ![Cline MCP Server Updated](/docs/guides/cline-mcp-config-update.png)
9. Cline is now configured to use the local Neon MCP server. You should see **neon** listed under available MCP servers.

### Verifying the Integration

Now that you have the Neon MCP server set up either remotely or locally, you can verify the connection and test the available tools. If the integration is successful, you should see the Neon MCP server listed in the Cline MCP Servers Installed section.

![Cline Available MCP Tools](/docs/guides/cline-available-mcp-tools.png)

You've now configured Neon MCP Server in Cline and can manage your Neon Postgres databases using AI.

<MCPTools />

These actions enable any MCP client like Cline to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon's branching for safe preview and commit.

## Development Workflow: Adding a Column with Cline and Neon MCP

Let's walk through a typical development scenario: Quickly adding a column for prototyping using natural language within Cline. The following chat log demonstrates a real interaction with Cline and the Neon MCP server.

**Scenario:** During development, you decide to track timestamps for entries in your `playing_with_neon` table. You want to quickly add a `created_at` column.

<Admonition type="tip" title="Security Reminder">
For your security, review the tool's purpose before permitting the operation to proceed. Remember that LLMs can sometimes produce unexpected results, so careful monitoring is always recommended.
</Admonition>

Following is a sample interaction with Cline where you can see how it uses the Neon MCP server to add a column to your table:

```text shouldWrap
User: in my neon project id: fancy-bush-59303206, list all my tables
Cline: I need to list all tables in the specified Neon project. Since I have access to the Neon MCP server, I can use the get_database_tables tool to accomplish this task. The tool requires:
> projectId - which the user provided: "fancy-bush-59303206"
> databaseName - which I can default to "neondb" as it's the standard default database name in Neon
> Cline wants to use a tool on the neon MCP server: get_database_tables
> Your Neon project (fancy-bush-59303206) has 1 table in the public schema:
> - playing_with_neon (Base Table)


User: can you show me first 5 rows in it?
Cline: I'll use the run_sql tool to execute a SELECT statement that retrieves the first 5 rows from the playing_with_neon table. I'll use LIMIT 5 to ensure we only get the first 5 rows.
> Cline wants to use a tool on the neon MCP server: run_sql
> I have successfully retrieved the first 5 rows from the playing_with_neon table. I'll present this data in a clear, formatted way.
> | id | name       | value     |
> |----|------------|-----------|
> | 1  | c4ca4238a0 | 0.857180 |
> | 2  | c81e728d9d | 0.416151 |
> | 3  | eccbc87e4b | 0.440935 |
> | 4  | a87ff679a2 | 0.438505 |
> | 5  | e4da3b7fbb | 0.686455 |

User: can you add a created_at column, use a temporary branch
Cline: I'll use the prepare_database_migration tool to add a created_at column to the playing_with_neon table. This tool will automatically create a temporary branch for safety. After the migration is prepared, I'll need to verify it before completing it.
> Cline wants to use a tool on the neon MCP server: prepare_database_migration
> Let me verify the migration by checking the table structure in the temporary branch. I'll use run_sql to describe the table and ensure the created_at column was added correctly.
> Cline wants to use a tool on the neon MCP server: run_sql
> The created_at column has been successfully added to the table in the temporary branch with the correct data type and default value. Let me verify the data by selecting a few rows to ensure everything looks correct.
> Cline wants to use a tool on the neon MCP server: run_sql
> The migration looks good - the created_at column has been added successfully and is populated with timestamps. Now I can complete the migration to apply these changes to the production branch.
> Cline wants to use a tool on the neon MCP server: complete_database_migration
> The migration has been successfully completed and the temporary branch has been deleted. Let me verify the changes in the production branch and show the updated table structure.
> Cline wants to use a tool on the neon MCP server: run_sql
> The migration has been successfully completed. The created_at column has been added to the table and is populated with timestamps.
```

**Key takeaways:**

- **Natural language interaction:** You can use simple, conversational English to interact with your database through Cline.
- **Step-by-step guidance:** Cline confirms each step and provides details like branch names and migration IDs.
- **MCP Tools in Action:** The underlying MCP tools (`get_database_tables`, `run_sql`, `prepare_database_migration`, `complete_database_migration`) illustrate the automated process.
- **Branching for safety:** The agent automatically creates a temporary branch for schema changes. The user will be prompted to confirm the migration before applying it to the production branch.

You can verify the changes in your Neon Console or by querying the database directly.

![Neon Console with added column](/docs/guides/neon-cursor-mcp-added-column.png)

<Admonition type="note">
While the Neon MCP server allows you to utilize all of Neon's functionalities, you can also use a [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Bonus: Creating a project and branch

Beyond schema changes, you can also manage your Neon projects and branches directly within Cline using natural language commands. This can be useful for quickly setting up a new development or test environment.

### Creating a new project

Let's say you want to create a new Neon project named "my-new-project". You can simply tell Cline:

```text shouldWrap
User: Create a Neon project named "my-new-project"
Cline: I see that I have access to the Neon MCP server which provides tools for interacting with Neon's API. Looking at the available tools, I can use the create_project tool to create a new Neon project with the specified name "my-new-project".
> Cline wants to use a tool on the neon MCP server:
> create_project ARGUMENTS: { "name": "my-new-project" }
> I've created a new Neon project named "my-new-project". Here are the project details:
> Project ID: muddy-bar-98083629
> Default branch: main
> Default database: neondb
```

![Cline creating a new Neon project](/docs/guides/cline-mcp-create-new-project.png)

Cline will then use the `create_project` MCP tool to initiate the project creation. It will provide you with a project ID and name.

### Creating a New Branch

Once you have a project, you can easily create new branches for development or experimentation. For example, to create a branch named "feature-x" in your "my-new-project" project:

```text shouldWrap
User: Create a branch named "feature-x"
Cline: I'll use the create_branch tool from the Neon MCP server to create a new branch named "feature-x" in the project we just created (project ID: muddy-bar-98083629).
> Cline wants to use a tool on the neon MCP server:
> create_branch ARGUMENTS: { "project_id": "muddy-bar-98083629", branchName": "feature-x" }
> I've created a new branch named "feature-x" in your Neon project. Here are the branch details:
> Branch ID: br-broad-base-a5kh7wyi
> Branch name: feature-x
> Parent branch: br-lively-cherry-a5kz48n6
```

![Cline creating a new Neon branch](/docs/guides/cline-mcp-create-new-branch.png)

Cline will use the `create_branch` MCP tool to create the branch and provide you with the branch name and ID. Notice how we don't need to specify the project ID, as Cline remembers the active project context.

## Conclusion

Cline with Neon MCP Server lets you use natural language to interact with your database and take advantage of Neon's branching capabilities for fast iteration. This approach is ideal for quickly testing database ideas and making schema changes during development.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Cline Documentation](https://docs.cline.bot)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
