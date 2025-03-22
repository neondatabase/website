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

## Key components

Let's break down the key components in this setup:

- **Cline**: Cline is an autonomous coding agent streamlining your development process within your IDE. It offers powerful features for creating, editing, executing, and even browsing, all under your guidance. Cline has support for the Model Context Protocol (MCP), facilitating seamless interaction with external tools.

- **Neon MCP Server**: Neon's MCP server acts as a bridge between MCP clients like Cline and [Neon's API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), letting you work with Neon databases using natural language commands.

- **Model Context Protocol (MCP)**: MCP is a lightweight communication standard that allows Cline and Neon MCP Server to work together.

## Setting up Neon MCP Server in Cline

The following steps show how to set up Neon MCP Server in Cline.

### Prerequisites

Before you begin, ensure you have the following:

1.  **Cline extension and Setup:**
    - Download and install the Cline VS Code extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev).
    - Set up Cline by following the [Getting Started guide](https://docs.cline.bot/getting-started/getting-started-new-coders#setting-up-openrouter-api-key) which involves obtaining an [OpenRouter API key](https://openrouter.ai) to work with Cline.
2.  **A Neon Account and Project:** You'll need a Neon account and a project. You can quickly create a new Neon project here [pg.new](https://pg.new)
3.  **Neon API Key:** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/profile). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](https://neon.tech/docs/manage/api-keys).
    <Admonition type="warning" title="Neon API Key Security">
    Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
    </Admonition>
4.  **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Installation and Configuration

**Configure Neon MCP Server in Cline:**

1. Open Cline by clicking on the Cline icon in the VS Code sidebar.
2. To configure MCP Servers in Cline, you need to modify the `cline_mcp_settings.json` file.
   ![Cline Add MCP Tool](/docs/guides/cline-add-mcp.gif)
3. This will open the `cline_mcp_settings.json` file.
4. In the `cline_mcp_settings.json` file, you need to specify a list of MCP servers.

<Tabs labels={["MacOS/Linux", "Windows", "Windows (WSL)"]}>

<TabItem>
Use the following JSON structure as a template, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

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
</TabItem>

<TabItem>
Use the following JSON structure as a template, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

   ```json
   {
     "mcpServers": {
       "neon": {
         "command": "cmd",
         "args": ["/c", "npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
       }
     }
   }
   ```
</TabItem>

<TabItem>
Use the following JSON structure as a template, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

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
</TabItem>

</Tabs>

   - **`neon`**: This is a name you choose for your MCP server connection.
   - **`command`**: This is the command Cline will execute to start the Neon MCP server.
     - For **MacOS/Linux**, it uses `npx` directly.
     - For **Windows**, it uses `cmd /c` to execute the `npx` command in the command prompt.
     - For **Windows (WSL)**, it uses `wsl /c` to execute the `npx` command within the WSL environment.
     - The `npx` command runs the `@neondatabase/mcp-server-neon` package and passes your Neon API key as an argument.
   - Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

   - Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

5. **Save** the `cline_mcp_settings.json` file.
6. If the integration is successful, you should see the Neon MCP server listed in the Cline MCP Servers Installed section.

![Cline Available MCP Tools](/docs/guides/cline-available-mcp-tools.png)

You've now configured Neon MCP Server in Cline and can manage your Neon Postgres databases using AI.

## Neon MCP Server Tools

Neon MCP server exposes the following actions, which primarily map to **Neon API endpoints**:

- `list_projects`: Lists all your Neon projects. This uses the Neon API to retrieve a summary of all projects associated with your Neon account. _Note: This particular action is still under development. It's not yet returning results as expected._
- `describe_project`: Retrieves detailed information about a specific Neon project. Provides comprehensive details about a chosen project, such as its ID, name, and associated branches.
- `create_project`: Creates a new Neon project — a container in Neon for branches, databases, roles, and computes.
- `delete_project`: Deletes an existing Neon project.
- `create_branch`: Creates a new branch within a Neon project. Leverages Neon's branching feature, allowing you to create new branches for development or migrations.
- `delete_branch`: Deletes an existing branch in a Neon project.
- `describe_branch`: Retrieves details about a specific branch. Retrieves information about a particular branch, such as its name and ID.
- `get_connection_string`: Retrieves a connection string for a specific database in a Neon project. Returns a formatted connection string that can be used to connect to the database.
- `run_sql`: Runs a single SQL query against a Neon database. Allows you to run read or write SQL queries.
- `run_sql_transaction`: Runs a series of SQL queries within a transaction against a Neon database. Enables running multiple SQL statements as a single atomic transaction, ensuring data consistency.
- `get_database_tables`: Lists all tables in a specified Neon database. Provides a list of tables.
- `describe_table_schema`: Retrieves the schema definition of a specific table. Details the structure of a table, including columns and data types.
- `prepare_database_migration`: Initiates a database migration process, utilizing a temporary branch for safety. Begins the process of altering your database schema, safely using Neon's branching feature.
- `complete_database_migration`: Completes a migration process, applying changes to your main database and cleaning up temporary resources.

These actions enable any MCP client like Cline to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon’s branching for safe preview and commit.

## Development Workflow: Adding a Column with Cline and Neon MCP

Let's walk through a typical development scenario: Quickly adding a column for prototyping using natural language within Cline. The following chat log demonstrates a real interaction with Cline and the Neon MCP server.

**Scenario:** During development, you decide to track timestamps for entries in your `playing_with_neon` table. You want to quickly add a `created_at` column.

Check out the video below to see how Cline and Neon MCP Server can help you add a new column to your database table using natural language commands.

<video autoPlay playsInline muted loop width="800" height="600" controls>
  <source type="video/mp4" src="/videos/pages/doc/cline-neon-mcp.mp4"/>
</video>

<Admonition type="tip" title="Security Reminder">
For your security, review the tool's purpose before permitting the operation to proceed. Remember that LLMs can sometimes produce unexpected results, so careful monitoring is always recommended.
</Admonition>

Here's the conversation log between the user and Cline:

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
> The migration looks good - the created_at column has been added successfully and is populated with timestamps. Now I can complete the migration to apply these changes to the main branch.
> Cline wants to use a tool on the neon MCP server: complete_database_migration
> The migration has been successfully completed and the temporary branch has been deleted. Let me verify the changes in the main branch and show the updated table structure.
> Cline wants to use a tool on the neon MCP server: run_sql
> The migration has been successfully completed. The created_at column has been added to the table and is populated with timestamps.
```

**Key takeaways:**

- **Natural language interaction:** You can use simple, conversational English to interact with your database through Cline.
- **Step-by-step guidance:** Cline confirms each step and provides details like branch names and migration IDs.
- **MCP Tools in Action:** The underlying MCP tools (`get_database_tables`, `run_sql`, `prepare_database_migration`, `complete_database_migration`) illustrate the automated process.
- **Branching for safety:** The agent automatically creates a temporary branch for schema changes. The user will be prompted to confirm the migration before applying it to the main branch.

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
