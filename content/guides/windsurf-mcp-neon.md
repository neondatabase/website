---
title: 'Get started with Windsurf and Neon Postgres MCP Server'
subtitle: 'Make schema changes with natural language using Codeium Windsurf and Neon MCP Server'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-22T00:00:00.000Z'
updatedOn: '2025-02-22T00:00:00.000Z'
---

Imagine adjusting your database schema simply by describing the change in plain English. This is possible by combining [Codeium Windsurf](https://codeium.com/windsurf) with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon).

This guide demonstrates how to use [Windsurf's Cascade](https://docs.codeium.com/windsurf/cascade) and Neon's MCP server to perform database migrations in your Neon project.

## Key components

Let's break down the key components in this setup:

- **Codeium Windsurf**: Windsurf is Codeium's next-generation AI IDE, featuring Cascade, an agentic chatbot that supports Model Context Protocol (MCP) for interfacing with external tools.

- **Neon MCP Server**: Neon's MCP server acts as a bridge between MCP clients like Windsurf and [Neon's API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), letting you work with Neon databases using natural language commands.

- **Model Context Protocol (MCP)**: MCP is a lightweight communication standard that allows Windsurf and Neon MCP Server to work together.

## Setting up Neon MCP Server in Windsurf

The following steps show how to set up Neon MCP Server in Windsurf.

### Prerequisites

Before you begin, ensure you have the following:

1.  **Codeium Windsurf Editor:** Download and install Windsurf from [codeium.com/windsurf](https://codeium.com/windsurf).
2.  **A Neon Account and Project:** You'll need a Neon account and a project. You can quickly create a new Neon project here [pg.new](https://pg.new)
3.  **Neon API Key:** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/profile). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](https://neon.tech/docs/manage/api-keys).

    <Admonition type="warning" title="Neon API Key Security">
    Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
    </Admonition>

4.  **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Installation and Configuration

**Configure Neon MCP Server in Windsurf:**

1. Open Windsurf.
2. Open Cascade by using `⌘L`.
3. To configure MCP Servers in Windsurf, you need to modify the `~/.codeium/windsurf/mcp_config.json` file.
4. To quickly access this file, find the toolbar above the Cascade input and click the hammer icon (🔨), then click the **"Configure"** button.
   ![Windsurf Cascade Add MCP Tool](/docs/guides/windsurf-cascade-add-mcp-tool.gif)
5. This will open the `~/.codeium/windsurf/mcp_config.json` file in the IDE.
6. In the `mcp_config.json` file, you need to specify a list of MCP servers.

<Tabs labels={["MacOS/Linux", "Windows", "Windows (WSL)"]}>

<TabItem>
Use the following JSON structure as a template, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

   ```json shouldWrap
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

   ```json shouldWrap
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

   ```json shouldWrap
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
   - **`command`**: This is the command Windsurf will execute to start the Neon MCP server.
     - For **MacOS/Linux**, it uses `npx` directly.
     - For **Windows**, it uses `cmd /c` to execute the `npx` command in the command prompt.
     - For **Windows (WSL)**, it uses `wsl /c` to execute the `npx` command within the WSL environment.
     - The `npx` command runs the `@neondatabase/mcp-server-neon` package and passes your Neon API key as an argument.
   - Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key that you obtained from the [Prerequisites](#prerequisites) section.

7. **Save** the `mcp_config.json` file.
8. Click **"Refresh"** (🔄) in the MCP toolbar in Windsurf Cascade.
9. If the integration is successful, the toolbar should indicate that you have MCP servers available, and you should see "1 available MCP server" (or more if you configured additional servers).

![Windsurf MCP Toolbar with Server Available](/docs/guides/windsurf-mcp-server-available.png)

You've now configured Neon MCP Server in Windsurf and can manage your Neon Postgres databases using AI.

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

These actions enable any MCP client like Windsurf to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon’s branching for safe preview and commit.

## Development Workflow: Adding a Column with Windsurf and Neon MCP

Let's walk through a typical development scenario: Quickly adding a column for prototyping using natural language within Windsurf's Cascade. The following chat log demonstrates a real interaction with Windsurf and the Neon MCP server.

**Scenario:** During development, you decide to track timestamps for entries in your `playing_with_neon` table. You want to quickly add a `created_at` column.

Check out the video below to see how Windsurf and Neon MCP Server can help you add a new column to your database table using natural language commands.

<video autoPlay playsInline muted loop width="800" height="600" controls>
  <source type="video/mp4" src="/videos/pages/doc/windsurf-neon-mcp.mp4"/>
</video>

<Admonition type="tip" title="Security Reminder">
Be aware that Cascade currently executes commands directly from your prompts without confirmation unlike other IDE's and apps like [Cursor](/guides/cursor-mcp-neon) and [Claude](/guides/neon-mcp-server).  Review your requests thoroughly to avoid unintended or unwanted actions.
</Admonition>

Here's the conversation log between the user and Cascade:

```text shouldWrap
User: in my neon project id: fancy-bush-59303206, list all the tables
Cascade: I'll help you list all the tables in your Neon project. I'll use the default database name 'neondb' since it wasn't specified.
> MCP Tool: neon / get_database_tables
> I found 1 table in your Neon project:
> - playing_with_neon (in the public schema)
> Would you like to see more details about this table or perform any operations on it?

User: can you show me first 5 rows?
Cascade: I'll query the first 5 rows from the playing_with_neon table.
> MCP Tool: neon / run_sql
> Here are the first 5 rows from the table. The table has three columns:
> id: An integer identifier
> name: A string column containing what appears to be hash-like values
> value: A numeric column with decimal values between 0 and 1
> Would you like to perform any other operations on this table?

User: can you add created_at column?
Cascade: I'll help you add a created_at column to the playing_with_neon table. I'll create a migration to add this column with a timestamp data type.
> MCP Tool: neon / prepare_database_migration
> Let me verify the changes in the temporary branch to make sure the column was added correctly.
> I've verified that the created_at column has been added successfully in the temporary branch. Would you like me to commit this migration to the main branch?
> The migration has been completed successfully! The created_at column has been added to the playing_with_neon table. Let's verify the change in the main branch:
> Perfect! The created_at column has been successfully added and populated with timestamps. For existing rows, it was set to the time when the column was added. Any new rows added to the table will automatically get their creation timestamp.
```

**Key takeaways:**

- **Natural language interaction:** You can use simple, conversational English to interact with your database through Windsurf's Cascade.
- **MCP Tools in Action:** The underlying MCP tools (`get_database_tables`, `run_sql`, `prepare_database_migration`, `complete_database_migration`) illustrate the automated process.
- **Branching for safety:** The agent automatically creates a temporary branch for schema changes and tests them before committing to the main branch.

You can verify the changes in your Neon Console or by querying the database directly.

![Neon Console with added column](/docs/guides/neon-cursor-mcp-added-column.png)

<Admonition type="note">
While the Neon MCP server allows you to utilize all of Neon's functionalities, you can also use a [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Bonus: Creating a project and branch

Beyond schema changes, you can also manage your Neon projects and branches directly within Windsurf using natural language commands. This can be useful for quickly setting up a new development or test environment.

### Creating a new project

Let's say you want to create a new Neon project named "my-new-project". You can simply tell Cascade:

```text shouldWrap
User: Create a Neon project named "my-new-project"
Cascade: I'll help you create a new Neon project with the specified name.
> MCP Tool: neon / create_project
> Tool Arguments: { "name": "my-new-project" }
> Great! I've created a new Neon project for you with the following details:
> Project Name: `my-new-project`
> Project ID: `restless-butterfly-08800888`
> Default Branch: `main`
> Default Database: `neondb`
> The project is now ready for use. You can start creating tables, running queries, or creating additional databases as needed. Would you like to do anything specific with your new project?
```

![Windsurf creating a new Neon project](/docs/guides/windsurf-mcp-create-new-project.png)

Cascade will then use the `create_project` MCP tool to initiate the project creation. It will provide you with a project ID and name.

### Creating a New Branch

Once you have a project, you can easily create new branches for development or experimentation. For example, to create a branch named "feature-x" in your "my-new-project" project:

```text shouldWrap
User: Create a branch named "feature-x"
Cascade: I'll create a new branch named "feature-x" in your Neon project.
> MCP Tool: neon / create_branch
> Tool Arguments: { "projectId": "restless-butterfly-08800888", "branchName": "feature-x" }
> Perfect! I've created a new branch with the following details:
> Branch Name: `feature-x`
> Branch ID: `br-aged-sun-a5woam3c`
> Project ID: `restless-butterfly-08800888`
> The branch has been created successfully and is ready for use. You can now make changes to this branch without affecting the main branch. Would you like to do anything with this new branch?
```

![Windsurf creating a new Neon branch](/docs/guides/windsurf-mcp-create-new-branch.png)

Cascade will use the `create_branch` MCP tool to create the branch and provide you with the branch name and ID. Notice how we don't need to specify the project ID, as Cascade remembers the active project context.

## Conclusion

Windsurf with Neon MCP Server lets you use natural language to interact with your database and take advantage of Neon's branching capabilities for fast iteration. This approach is ideal for quickly testing database ideas and making schema changes during development.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Codeium Windsurf Documentation](https://docs.codeium.com/windsurf/getting-started)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
