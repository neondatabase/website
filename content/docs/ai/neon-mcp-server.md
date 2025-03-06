---
title: 'Neon MCP Server'
subtitle: 'Manage your Neon Postgres databases using natural language commands with the Neon MCP Server.'
enableTableOfContents: true
updatedOn: '2025-03-06T00:00:00.000Z'
---

The **Neon MCP Server** is an open-source tool that unlocks a more intuitive way to interact with your Neon Postgres databases: **natural language**. Instead of writing SQL queries or navigating APIs, you can simply use conversational English to manage your Neon projects and databases.

Think of it this way:  Imagine you want to create a new database. Instead of using the Neon Console or API, you could just type a request like, "Create a database named 'my-new-database'".  Or, to see your projects, you might ask, "List all my Neon projects".  The Neon MCP Server is what makes this possible.

It works by acting as a smart bridge between your natural language requests and the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).  Built upon the [Model Context Protocol (MCP)](https://modelcontextprotocol.org), it translates your simple commands into the necessary Neon API calls, allowing you to manage everything from creating projects and branches to running queries and performing database migrations – all through simple conversation.

## Understanding MCP and Neon MCP Server

The [**Model Context Protocol (MCP)**](https://modelcontextprotocol.org) standardizes communication between LLMs and external tools. It defines a client-server architecture, enabling LLMs (Hosts) to connect to specialized servers that provide context and tools for interacting with external systems. The key components of the MCP architecture are:

- **Host**: These are LLM applications, such as Claude Desktop or integrated development environments (IDEs), that initiate connections to MCP servers
- **Client**: These reside within the host application and maintain one-to-one connections with individual servers
- **Server**: These programs provide context, tools, and prompts to clients, enabling access to external data and functionalities

### Why use MCP?

Traditionally, connecting AI models to different data sources required developers to create custom code for each integration. This fragmented approach led to increased development time, maintenance burdens, and limited interoperability between AI models and tools. MCP tackles this challenge by providing a standardized protocol that simplifies integration, accelerates development, and enhances the capabilities of AI assistants.

### What is Neon MCP server?

**Neon MCP Server** acts as the **Server** in the MCP architecture, specifically designed for Neon. It provides a set of **tools** that MCP Clients (like Claude Desktop, Cursor) can utilize to manage Neon resources.  This includes actions for project management, branch management, executing SQL queries, and handling database migrations, all driven by natural language requests.

**Key Benefits of using Neon MCP Server:**

- **Natural Language Interaction:** Manage Neon databases using intuitive, conversational commands.
- **Simplified Database Management:** Perform complex actions without writing SQL or directly using the Neon API.
- **Enhanced Productivity:** Streamline workflows for database administration and development.
- **Accessibility for Non-Developers:** Empower users with varying technical backgrounds to interact with Neon databases.
- **Safe Database Migrations:** Leverage Neon's branching capabilities for safe and previewable database schema changes initiated via natural language.

<Admonition type="warning" title="Security Considerations">
The Neon MCP server grants powerful database management capabilities through natural language requests.  **Always review and authorize actions** requested by the LLM before execution. Ensure that only authorized users and applications have access to the MCP server and Neon API keys.
</Admonition>

## Installation

You can install the Neon MCP Server using either `npm` or `smithery`.

### Prerequisites

- **Node.js (>= v18.0.0):** Ensure Node.js version 18 or higher is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **Neon API Key:**  You will need a Neon API key to authenticate the Neon MCP Server with your Neon account. You can create one from the [Neon Console](https://console.neon.tech/app/settings/api-keys) under your Profile settings. Refer to the [Neon documentation on API Keys](/docs/manage/api-keys#creating-api-keys) for detailed instructions.

<Admonition type="note">
We recommend using Smithery for installation, as it streamlines the process and guarantees compatibility across MCP clients. Note that only Claude Desktop is automatically configured with the Neon MCP Server when installed via npm. For manual configuration of [Cursor](/guides/cursor-mcp-neon), [Cline](/guides/cline-mcp-neon) and [Winsurf](/guides/windsurf-mcp-neon), please refer to our detailed guides
</Admonition>

### Installation via Smithery - MCP Registry

[Smithery](https://smithery.ai) provides a streamlined method for installing MCP servers.

1.  **Open your terminal.**
2.  **Run the Smithery installation command:**

    ```bash
    npx -y @smithery/cli install neon --client <client_name>
    ```

    Replace `<client_name>` with the name of your MCP client application. Supported client names include:

    - `claude` for [Claude Desktop](https://claude.ai/download)
    - `windsurf` for [Windsurf Editor](https://codeium.com/windsurf)
    - `roo-cline` for [Roo Cline VS Code extension](https://github.com/RooVetGit/Roo-Code)
    - `witsy` for [Witsy](https://witsyai.com/)
    - `enconvo` for [Enconvo](https://www.enconvo.com/)

    For example, to install for Claude Desktop, use:

    ```bash
    npx -y @smithery/cli install neon --client claude
    ```

    You will be then prompted to enter the Neon API key.

    ```text
    ✔ Successfully resolved neon
    Installing remote server. Please ensure you trust the server author, especially when sharing sensitive data.
    For information on Smithery's data policy, please visit: https://smithery.ai/docs/data-policy
    ? The API key for accessing the Neon. You can generate one through the Neon console. (required) 
    *********************************************************************
    neon successfully installed for claude
    ```

3.  **Restart your MCP Client application.** For example, if you are using Claude Desktop, quit and reopen the application.

### Installation via npm

1.  **Open your terminal.**
2.  **Run the initialization command:**

    ```bash
    npx @neondatabase/mcp-server-neon init $NEON_API_KEY
    ```
    Replace `$NEON_API_KEY` with your actual Neon API key.
    
3.  Restart Claude Desktop

## Supported Actions (Tools)

The Neon MCP Server provides the following actions, which are exposed as "tools" to MCP Clients. You can use these tools to interact with your Neon projects and databases using natural language commands.

**Project Management:**

- **`list_projects`**: Retrieves a list of your Neon projects, providing a summary of each project associated with your Neon account.
- **`describe_project`**: Fetches detailed information about a specific Neon project, including its ID, name, and associated branches and databases.
- **`create_project`**: Creates a new Neon project in your Neon account. A project acts as a container for branches, databases, roles, and computes.
- **`delete_project`**: Deletes an existing Neon project and all its associated resources.

**Branch Management:**

- **`create_branch`**: Creates a new branch within a specified Neon project.  Leverages [Neon's branching](/docs/introduction/branching) feature for development, testing, or migrations.
- **`delete_branch`**: Deletes an existing branch from a Neon project.
- **`describe_branch`**: Retrieves details about a specific branch, such as its name, ID, and parent branch.

**SQL Query Execution:**

- **`run_sql`**: Executes a single SQL query against a specified Neon database. Supports both read and write operations.
- **`run_sql_transaction`**: Executes a series of SQL queries within a single transaction against a Neon database.
- **`get_database_tables`**: Lists all tables within a specified Neon database.
- **`describe_table_schema`**: Retrieves the schema definition of a specific table, detailing columns, data types, and constraints.

**Database Migrations (Schema Changes):**

- **`prepare_database_migration`**: Initiates a database migration process.  Critically, it creates a temporary branch to apply and test the migration safely before affecting the main branch.
- **`complete_database_migration`**: Finalizes and applies a prepared database migration to the main branch. This action merges changes from the temporary migration branch and cleans up temporary resources.

## Usage examples

After installing and configuring the Neon MCP Server with your chosen MCP client, you can start interacting with your Neon databases using natural language.

**Example interactions**

- **List projects:**  `"List my Neon projects"`
- **Create a new project:** `"Create a Neon project named 'my-test-project'"`
- **List tables in a database:** `"What tables are in the database 'my-database' in project 'my-project'?"`
- **Add a column to a table:** `"Add a column 'email' of type VARCHAR to the 'users' table in database 'main' of project 'my-project'"`
- **Run a query:** `"Show me the first 10 rows from the 'users' table in database 'my-database'"`

<Video  
sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]}
width={960}
height={1080}
/>

You can also refere to our individual guides for detailed examples on using the Neon MCP Server with specific MCP clients:

- [Claude Desktop](/guides/neon-mcp-server)
- [Cursor](/guides/cursor-mcp-neon)
- [Cline](/guides/cline-mcp-neon)
- [Windsurf (Codium)](/guides/windsurf-mcp-neon)

## Conclusion

The Neon MCP Server enables natural language interaction with Neon Postgres databases, offering a simplified way to perform database management tasks. You can perform actions such as creating new Neon projects and databases, managing branches, executing SQL queries, and making schema changes, all through conversational requests. Features like branch-based migrations contribute to safer schema modifications. By connecting your preferred MCP client to the Neon MCP Server, you can streamline database administration and development workflows, making it easier for users with varying technical backgrounds to interact with Neon databases.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon Docs](/docs)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)
- [Getting started with Neon MCP server with Claude Desktop](/guides/neon-mcp-server)
- [AI-assisted database migrations with Cursor and Neon Postgres MCP Server](/guides/cursor-mcp-neon)
- [Getting started with Cline and Neon Postgres MCP Server](/guides/cline-mcp-neon)
- [Getting started with Windsurf and Neon Postgres MCP Server](/guides/windsurf-mcp-neon)

<NeedHelp/>
