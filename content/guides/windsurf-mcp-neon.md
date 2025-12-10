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

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.

The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.

For more information, see [MCP security guidance →](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Key components

Let's break down the key components in this setup:

- **Codeium Windsurf**: Windsurf is Codeium's next-generation AI IDE, featuring Cascade, an agentic chatbot that supports Model Context Protocol (MCP) for interfacing with external tools.

- **Neon MCP Server**: Neon's MCP server acts as a bridge between MCP clients like Windsurf and [Neon's API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), letting you work with Neon databases using natural language commands.

- **Model Context Protocol (MCP)**: MCP is a lightweight communication standard that allows Windsurf and Neon MCP Server to work together.

## Setting up Neon MCP Server in Windsurf

You have two options for connecting Windsurf to the Neon MCP Server:

1. **Remote MCP Server (Preview):** Connect to Neon's managed MCP server using OAuth for authentication. This method is more convenient as it eliminates the need to manage API keys in Windsurf. Additionally, you will automatically receive the latest features and improvements as soon as they are released.

2. **Local MCP Server:** Run the Neon MCP server locally on your machine, authenticating with a Neon API key.

### Prerequisites

Before you begin, ensure you have the following:

1.  **Codeium Windsurf Editor:** Download and install Windsurf from [codeium.com/windsurf](https://codeium.com/windsurf).
2.  **A Neon Account and Project:** You'll need a Neon account and a project. You can quickly create a new Neon project here [pg.new](https://pg.new)
3.  **Neon API Key (for Local MCP server):** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/api-keys). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](/docs/manage/api-keys).

    <Admonition type="important" title="Neon API Key Security">
    Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
    </Admonition>

4.  **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Option 1: Setting up the Remote Hosted Neon MCP Server

This method uses Neon's managed server and OAuth authentication.

You can either watch the video below or follow the steps to set up the Neon MCP server in Windsurf.

<video controls playsInline loop width="800" height="600">
  <source type="video/mp4" src="https://neondatabase.wpengine.com/wp-content/uploads/2025/04/neon-hosted-mcp-server.mp4"/>
</video>

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).
</Admonition>

1. Open Windsurf.
2. Open Cascade by using `⌘L` on MacOS or `Ctrl+L` on Windows/Linux.
3. Click on the plug icon (🔌), then click the **"Configure"** button.
   ![Windsurf Configure MCP](/docs/guides/windsurf-configure-mcp.png)
4. This will open up the MCP configuration file in Windsurf.
5. Add the "Neon" server entry within the `mcpServers` object:

   ```json
   {
     "mcpServers": {
       "Neon": {
         "url": "https://mcp.neon.tech/mcp"
       }
     }
   }
   ```

   If you have other MCP servers configured, you can copy just the Neon part.

6. **Save** the MCP configuration file.
7. An OAuth window will open in your browser. Follow the prompts to authorize Windsurf to access your Neon account.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)
8. You can verify that the connection is successful by checking the available MCP servers. The toolbar should indicate that you have Neon MCP server available.

   ![Windsurf MCP Toolbar](/docs/guides/windsurf-mcp-server-available.png)

9. Windsurf is now connected to the Neon MCP server.

<Admonition type="note">
The remote hosted MCP server is in preview due to the [new OAuth MCP specification](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authorization/), expect potential changes as we continue to refine the OAuth integration.
</Admonition>

<Admonition type="tip" title="Troubleshooting OAuth Errors">
If you encounter an error message like `{"code":"invalid_request","error":"invalid redirect uri"}` when starting Windsurf with the remote MCP server, this is typically due to cached OAuth credentials. To fix this issue:

1. Remove the MCP authentication cache by running: `rm -rf ~/.mcp-auth`
2. Restart Windsurf
3. The OAuth flow will start fresh, allowing you to properly authenticate

This error commonly occurs when there are changes to the OAuth configuration or when cached credentials become invalid.
</Admonition>

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API
key for authentication.

1. Open Windsurf.
2. Open Cascade by using `⌘L` on MacOS or `Ctrl+L` on Windows/Linux.
3. Click on the hammer icon (🔨), then click the **"Configure"** button.
   ![Windsurf Configure MCP](/docs/guides/windsurf-configure-mcp.png)
4. This will open up the MCP configuration file in Windsurf.
5. Click on "View raw config" to open the Windsurf's MCP configuration file.
6. Add the "Neon" server entry within the `mcpServers` object:

   <CodeTabs labels={["MacOS/Linux", "Windows", "Windows (WSL)"]}>

   ```json
   {
     "mcpServers": {
       "Neon": {
         "command": "npx",
         "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
       }
     }
   }
   ```

   ```json
   {
     "mcpServers": {
       "Neon": {
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
       "Neon": {
         "command": "wsl",
         "args": ["npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
       }
     }
   }
   ```

   </CodeTabs>

   > Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section:

   If you have other MCP servers configured, you can copy just the `Neon` part.

7. **Save** the MCP configuration file.
8. You can verify that the connection is successful by checking the available MCP servers. The toolbar should indicate that you have Neon MCP server available.
   ![Windsurf MCP Toolbar with Server Available](/docs/guides/windsurf-mcp-server-available.png)

   You've now configured Neon MCP Server in Windsurf and can manage your Neon Postgres databases using AI.

<MCPTools />

These actions enable any MCP client like Windsurf to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon's branching for safe preview and commit.

## Development Workflow: Adding a Column with Windsurf and Neon MCP

Let's walk through a typical development scenario: Quickly adding a column for prototyping using natural language within Windsurf's Cascade. The following chat log demonstrates a real interaction with Windsurf and the Neon MCP server.

**Scenario:** During development, you decide to track timestamps for entries in your `playing_with_neon` table. You want to quickly add a `created_at` column.

<Admonition type="tip" title="Security Reminder">
Be aware that Cascade currently executes commands directly from your prompts without confirmation unlike other IDE's and apps like [Cursor](/guides/cursor-mcp-neon) and [Claude](/guides/neon-mcp-server).  Review your requests thoroughly to avoid unintended or unwanted actions.
</Admonition>

Following is a sample interaction with Cascade where you can see how it uses the Neon MCP server to add a new column to your database table:

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
> I've verified that the created_at column has been added successfully in the temporary branch. Would you like me to commit this migration to the production branch?
> The migration has been completed successfully! The created_at column has been added to the playing_with_neon table. Let's verify the change in the production branch:
> Perfect! The created_at column has been successfully added and populated with timestamps. For existing rows, it was set to the time when the column was added. Any new rows added to the table will automatically get their creation timestamp.
```

**Key takeaways:**

- **Natural language interaction:** You can use simple, conversational English to interact with your database through Windsurf's Cascade.
- **MCP Tools in Action:** The underlying MCP tools (`get_database_tables`, `run_sql`, `prepare_database_migration`, `complete_database_migration`) illustrate the automated process.
- **Branching for safety:** The agent automatically creates a temporary branch for schema changes and tests them before committing to the production branch.

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
> The branch has been created successfully and is ready for use. You can now make changes to this branch without affecting the production branch. Would you like to do anything with this new branch?
```

![Windsurf creating a new Neon branch](/docs/guides/windsurf-mcp-create-new-branch.png)

Cascade will use the `create_branch` MCP tool to create the branch and provide you with the branch name and ID. Notice how we don't need to specify the project ID, as Cascade remembers the active project context.

## Conclusion

Windsurf with Neon MCP Server lets you use natural language to interact with your database and take advantage of Neon's branching capabilities for fast iteration. This approach is ideal for quickly testing database ideas and making schema changes during development.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Windsurf Documentation](https://docs.windsurf.com/windsurf/getting-started)
- [Windsurf MCP](https://docs.windsurf.com/windsurf/cascade/mcp)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
