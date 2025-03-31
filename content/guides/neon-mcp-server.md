---
title: 'Get started with Claude Desktop and Neon MCP Server'
subtitle: 'Enable natural language interaction with your Neon Postgres databases using LLMs'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-06T00:00:00.000Z'
updatedOn: '2025-02-06T00:00:00.000Z'
---

Imagine managing your database with natural language. Instead of complex SQL, you can simply ask your AI assistant to "create a new table for customer orders" or "show me last quarter's sales figures." This is the power of the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol), an open standard for AI interaction with external systems.

This guide will introduce you to [Neon's MCP server](https://github.com/neondatabase/mcp-server-neon), which allows you to use Large Language Models (LLMs) for intuitive database management. At its core, Neon MCP server allows tools like Claude to easily communicate with the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

With Neon's MCP server and an LLM like Claude, you can simplify workflows, improve productivity, and manage your Postgres databases more naturally. Let’s explore how this approach can make database management easier and more efficient.

## Understanding MCP

The **Model Context Protocol (MCP)** is a standard that helps LLMs communicate with external tools, like databases and APIs. It's like a translator, making it easier to connect LLMs to services and data. For the Neon MCP server, it's the protocol that lets Claude (and other LLMs) understand and control your Neon databases through the Neon API.

MCP follows a client-server architecture, where a host application can connect to multiple servers. The key components include:

- **Host**: These are LLM applications, such as Claude Desktop or integrated development environments (IDEs), that initiate connections to MCP servers
- **Client**: These reside within the host application and maintain one-to-one connections with individual servers
- **Server**: These programs provide context, tools, and prompts to clients, enabling access to external data and functionalities

### Why use MCP?

Traditionally, connecting AI models to different data sources required developers to create custom code for each integration. This fragmented approach led to increased development time, maintenance burdens, and limited interoperability between AI models and tools. MCP tackles this challenge by providing a standardized protocol that simplifies integration, accelerates development, and enhances the capabilities of AI assistants.

### What is Neon MCP server?

**Neon's MCP server** is an open-source tool that lets LLMs like **Claude manage your Neon databases using natural language by interacting with the Neon API.** It translates your simple English instructions into **Neon API calls**.

Examples of natural language commands that are converted to **Neon API actions**:

- **Create a Postgres database called `my-database`**: Calls the Neon API to create a database
- **Add a column `created_at` to the 'users' table in project `my-project`**: Uses the Neon API to run an SQL command
- **List all my Neon projects**: Calls the Neon API to fetch a project list

### Why use Neon MCP server?

Neon MCP server, combined with Neon, offers:

- **Simple Setup:** Easily connect LLMs to **Neon API**.
- **Natural Language:** Manage databases without direct **Neon API** coding.
- **Empowering Non-Developers**: Intuitive database interaction for everyone.

<Admonition type="warning">
The Neon MCP server's ability to execute arbitrary commands from natural language requests requires careful attention to security.  Always review and approve actions before they are committed.  Grant access only to authorized users and applications.
</Admonition>

**Key Actions available via Neon MCP server (powered by Neon API):**

Neon MCP server exposes the following actions, which primarily map to **Neon API endpoints**:

- `list_projects`: Action to list all your Neon projects. This uses the Neon API to retrieve a summary of all projects associated with your Neon account.
- `describe_project`: Action to get detailed information about a specific Neon project. Provides comprehensive details about a chosen project, such as its ID, name, and associated branches.
- `create_project`: Action to create a new Neon project — a container in Neon for branches, databases, roles, and computes.
- `delete_project`: Action to delete an existing Neon project.
- `create_branch`: Action to create a new branch within a Neon project. Leverages Neon's branching feature, allowing you to create new branches for development or migrations.
- `delete_branch`: Action to delete an existing branch in a Neon project.
- `describe_branch`: Action to get details about a specific branch. Retrieves information about a particular branch, such as its name and ID.
- `get_connection_string`: Action to retrieve a connection string for a specific database in a Neon project. Returns a formatted connection string that can be used to connect to the database.
- `run_sql`: Action to execute a single SQL query against a Neon database. Allows you to run read or write SQL queries.
- `run_sql_transaction`: Action to execute a series of SQL queries within a transaction against a Neon database. Enables running multiple SQL statements as a single atomic transaction, ensuring data consistency.
- `get_database_tables`: Action to list all tables in a specified Neon database. Provides a list of tables.
- `describe_table_schema`: Action to retrieve the schema definition of a specific table. Details the structure of a table, including columns and data types.
- `prepare_database_migration`: Action to initiate a database migration process, utilizing a temporary branch for safety. Begins the process of altering your database schema, safely using Neon's branching feature.
- `complete_database_migration`: Action to apply and finalize a prepared database migration to the main branch. Completes a migration process, applying changes to your main database and cleaning up temporary resources.

These actions enable any MCP Host to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon’s branching for safe preview and commit.

## Setting up Neon MCP server

We'll use Claude Desktop to interact with Neon MCP server. Here's how to set it up:

### Prerequisites

- **Node.js (>= v18):** Install from [nodejs.org](https://nodejs.org/).
- **Claude Desktop:** Install Anthropic's [Claude Desktop](https://claude.ai/download).
- **Neon API Key:** Get your [Neon API Key](/docs/manage/api-keys#creating-api-keys).

### Installation steps

1.  Open your terminal.
2.  Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

  This command configures Neon MCP server to connect to your Neon account using the **Neon API Key**, as shown here:

  ```bash
  npx -y @smithery/cli@latest install neon --client claude --config "{\"neonApiKey\":\"napi_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\"}"
  ✔ Successfully resolved neon
  Installing remote server. Please ensure you trust the server author, especially when sharing sensitive data.
  For information on Smithery's data policy, please visit: https://smithery.ai/docs/data-policy
  neon successfully installed for claude
  ```

3.  Restart Claude Desktop. You can do so by quitting the Claude Desktop and opening it again.

- Test: Ask Claude `"List my Neon projects"`. If it works, you'll see your projects listed by Claude, fetched using the **Neon API**. For example, you might see output similar to this:

  ![Claude output](/guides/images/claude_mcp/claude_list_project.png)

## Using Neon MCP server

Neon MCP server lets you manage Neon via **Neon API calls**

### Neon platform operations

- **List databases:** `"What databases do I have in my Neon project?"`
- **Create a new Neon project**: `"Create a new Neon named my-project"`
- **Create a new database**: `"Create a new database called my-database in the Neon project named my-project"`

### Simple SQL queries

- **Insert records"** `"Create a table named posts with 20 records."`
- **Query a table:** `"Show me 10 posts from 'posts' table in database 'my-database' of project 'my-project'"` (Triggers `run_sql` action to execute query)

### Schema exploration

- **List tables:** `"What tables are in database 'my-database' of project 'my-project'?"` (Triggers `get_database_tables` action to get table list)
- **Table schema:** `"Show schema of 'posts' table in database 'my-database' of project 'my-project'"` (Triggers `describe_table_schema` action to describe schema)

### Quick example: Neon MCP server in action

Imagine you want to add a column to a table in your Neon project. Instead of writing SQL migrations and directly calling the Neon API, with Neon MCP server and Claude, you can say: `"In my social network Neon project, edit the posts table and add a deleted_at column."`

<Video  
sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]}
width={960}
height={1080}
/>

Using Neon MCP server, Claude will:

1. **Confirm project:** Check which project you are referring to.
2. **Check schema:** Look at the `posts` table structure.
3. **Make migration:** Create the SQL to add the column
4. **Preview changes:** Show you the changes in a safe, temporary branch leveraging Neon's branching feature.
5. **Apply changes:** After you approve, apply the change to your database.
6. **Confirm success:** Tell you the column is added and prompt you to commit the migration.

This shows how Neon MCP server simplifies and makes database management safer with natural language, all powered by the **Neon API** under the hood.

## Real-world use cases

Neon MCP server can be used in various scenarios. Here are just a few possibilities:

- **SaaS apps:** Faster development with natural language database management
- **Dev/Test:** Quick database setup for testing
- **AI agents:** Simple database backend for AI using natural language
- **Internal tools:** Data access for non-technical teams via natural language interaction

## Security considerations

When Claude uses the Neon MCP tool, you'll see an authorization prompt: "Allow tool from "neon"?"

![Claude output](/guides/images/claude_mcp/claude_allow_tool.png)

For your security, review the tool's purpose before permitting the operation to proceed. Remember that LLMs can sometimes produce unexpected results, so careful monitoring is always recommended.

## Conclusion

Neon MCP server makes database management conversational and easier by enabling natural language interaction with the Neon API. It simplifies tasks, automates processes, and opens new ways to use AI with databases.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon Docs](/docs)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
