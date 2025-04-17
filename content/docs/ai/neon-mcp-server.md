---
title: Neon MCP Server
subtitle: Manage your Neon Postgres databases using natural language commands with the
  Neon MCP Server.
enableTableOfContents: true
updatedOn: '2025-04-13T12:26:57.410Z'
---

The **Neon MCP Server** is an open-source tool that lets you interact with your Neon Postgres databases in **natural language**.

Imagine you want to create a new database. Instead of using the Neon Console or API, you could just type a request like, "Create a database named 'my-new-database'". Or, to see your projects, you might ask, "List all my Neon projects". The Neon MCP Server makes this possible.

It works by acting as a bridge between natural language requests and the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Built upon the [Model Context Protocol (MCP)](https://modelcontextprotocol.org), it translates your requests into the necessary Neon API calls, allowing you to manage everything from creating projects and branches to running queries and performing database migrations.

## Understanding MCP and Neon MCP Server

The [**Model Context Protocol (MCP)**](https://modelcontextprotocol.org) standardizes communication between LLMs and external tools. It defines a client-server architecture, enabling LLMs (Hosts) to connect to specialized servers that provide context and tools for interacting with external systems. The key components of the MCP architecture are:

- **Hosts**: These are AI applications, such as Claude Desktop or IDEs like Cursor, that initiate connections to MCP servers
- **Clients**: These reside within the host application and maintain one-to-one connections with individual MCP servers
- **Server**: These programs, such as Neon's MCP Server, provide context, tools, and prompts to clients, enabling access to external data and functionalities

### Why use MCP?

Traditionally, connecting AI models to different data sources required developers to create custom code for each integration. This fragmented approach increased development time, maintenance burdens, and limited interoperability between AI models and tools. MCP addresses this challenge by providing a standardized protocol that simplifies integration, accelerates development, and enhances the capabilities of AI assistants.

### What is Neon MCP server?

**Neon MCP Server** acts as the **Server** in the MCP architecture, specifically designed for Neon. It provides a set of **tools** that MCP Clients (like Claude Desktop, Cursor) can utilize to manage Neon resources. This includes actions for project management, branch management, executing SQL queries, and handling database migrations, all driven by natural language requests.

**Key Benefits of using Neon MCP Server:**

- **Natural language interaction:** Manage Neon databases using intuitive, conversational commands.
- **Simplified database management:** Perform complex actions without writing SQL or directly using the Neon API.
- **Enhanced Productivity:** Streamline workflows for database administration and development.
- **Accessibility for non-developers:** Empower users with varying technical backgrounds to interact with Neon databases.
- **Database migration support:** Leverage Neon's branching capabilities for database schema changes initiated via natural language.

<Admonition type="warning" title="Security Considerations">
The Neon MCP server grants powerful database management capabilities through natural language requests.  **Always review and authorize actions** requested by the LLM before execution. Ensure that only authorized users and applications have access to the Neon MCP server and Neon API keys.
</Admonition>

## Setup options

You can set up the Neon MCP Server in two ways:

### Remote hosted server (preview)

You can use Neon's managed MCP server, available at `https://mcp.neon.tech`. This is the **easiest** way to start using the Neon MCP Server. It streamlines the setup process by utilizing OAuth for authentication, eliminating the need to manage Neon API keys directly in your client configuration.

<Admonition type="note">
The remote hosted MCP server is currently in its preview phase. As the [OAuth specification for MCP](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authorization/) is still quite new, we are releasing it in this preview state. During the initial weeks, you may experience some adjustments to the setup. However, the instructions provided should be straightforward to follow at this time.
</Admonition>

#### Prerequisites:

- An MCP Client application (e.g., Cursor, Windsurf, Claude Desktop, Cline, Zed).
- A Neon account.

#### Setup steps:

You can watch the video below for a quick overview of the setup process.

<video playsInline loop width="800" height="600" controls>
  <source type="video/mp4" src="https://neondatabase.wpengine.com/wp-content/uploads/2025/04/neon-hosted-mcp-server.mp4"/>
</video>

Steps:

1.  Go to your MCP Client's settings where you configure MCP Servers (this varies by client)
2.  Register a new MCP Server. Add a configuration block for "Neon" under 'mcpServers' key. The configuration should look like this:

    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
        }
      }
    }
    ```

    This command uses `npx` to run a [small helper (`mcp-remote`)](https://github.com/geelen/mcp-remote) that connects to Neon's hosted server endpoint (`https://mcp.neon.tech/sse`).

3.  Save the configuration and **restart or refresh** your MCP client application.
4.  The first time the client initializes Neon's MCP server, it should trigger an **OAuth flow**:
    - Your browser will open a Neon page asking you to authorize the "Neon MCP Server" to access your Neon account.
    - Review the requested permissions and click **Authorize**.
    - You should see a success message, and you can close the browser tab.
5.  Your MCP client should now be connected to the Neon Remote MCP Server and ready to use.

### Local MCP Server

You can install Neon MCP server locally using `npm` or `smithey`.

#### Prerequisites

- **Node.js (>= v18.0.0):** Ensure Node.js version 18 or higher is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **Neon API Key:** You will need a Neon API key to authenticate the Neon MCP Server with your Neon account. You can create one from the [Neon Console](https://console.neon.tech/app/settings/api-keys) under your Profile settings. Refer to the [Neon documentation on API Keys](/docs/manage/api-keys#creating-api-keys) for detailed instructions.

<Admonition type="note">
We recommend using Smithery for installation, as it streamlines the process and guarantees compatibility across MCP clients.
</Admonition>

#### Installation via Smithery - MCP Registry

[Smithery](https://smithery.ai) provides a streamlined method for installing MCP servers.

1.  Open your terminal.
2.  Run the Smithery installation command:

    ```bash
    npx -y @smithery/cli install neon --client <client_name>
    ```

    Replace `<client_name>` with the name of your MCP client application. Supported client names include:

    - `claude` for [Claude Desktop](https://claude.ai/download)
    - `cursor` for [Cursor](https://cursor.com) (Installing via `smithery` makes the MCP server a global MCP server in Cursor)
    - `windsurf` for [Windsurf Editor](https://codeium.com/windsurf)
    - `roo-cline` for [Roo Cline VS Code extension](https://github.com/RooVetGit/Roo-Code)
    - `witsy` for [Witsy](https://witsyai.com/)
    - `enconvo` for [Enconvo](https://www.enconvo.com/)
    - `vscode` for [Visual Studio Code (Preview)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

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

3.  Restart your MCP Client application. For example, if you are using Claude Desktop, quit and reopen the application.

#### Installation via npm

Open your MCP client application and navigate to the settings where you can configure MCP servers. The location of these settings may vary depending on your client. Add a configuration block for "Neon" under the `mcpServers` key. Your configuration should look like this:

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

<Admonition type="note">

If you are using Windows and encounter issues while adding the MCP server, you might need to use the Command Prompt (`cmd`) or Windows Subsystem for Linux (`wsl`) to run the necessary commands. Your configuration setup may resemble the following:

<CodeTabs labels={["Windows", "Windows (WSL)"]}>

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

</Admonition>

### Troubleshooting

If your client does not use `JSON` for configuration of MCP servers (such as older versions of Cursor), you can use the following command when prompted:

```bash
npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
```

## Supported actions (tools)

The Neon MCP Server provides the following actions, which are exposed as "tools" to MCP Clients. You can use these tools to interact with your Neon projects and databases using natural language commands.

**Project management:**

- **`list_projects`**: Retrieves a list of your Neon projects, providing a summary of each project associated with your Neon account.
- **`describe_project`**: Fetches detailed information about a specific Neon project, including its ID, name, and associated branches and databases.
- **`create_project`**: Creates a new Neon project in your Neon account. A project acts as a container for branches, databases, roles, and computes.
- **`delete_project`**: Deletes an existing Neon project and all its associated resources.

**Branch management:**

- **`create_branch`**: Creates a new branch within a specified Neon project. Leverages [Neon's branching](/docs/introduction/branching) feature for development, testing, or migrations.
- **`delete_branch`**: Deletes an existing branch from a Neon project.
- **`describe_branch`**: Retrieves details about a specific branch, such as its name, ID, and parent branch.

**SQL query execution:**

- **`get_connection_string`**: Returns your database connection string.
- **`run_sql`**: Executes a single SQL query against a specified Neon database. Supports both read and write operations.
- **`run_sql_transaction`**: Executes a series of SQL queries within a single transaction against a Neon database.
- **`get_database_tables`**: Lists all tables within a specified Neon database.
- **`describe_table_schema`**: Retrieves the schema definition of a specific table, detailing columns, data types, and constraints.

**Database migrations (schema changes):**

- **`prepare_database_migration`**: Initiates a database migration process. Critically, it creates a temporary branch to apply and test the migration safely before affecting the production branch.
- **`complete_database_migration`**: Finalizes and applies a prepared database migration to the production branch. This action merges changes from the temporary migration branch and cleans up temporary resources.

## Usage examples

After setting up either the remote or local server and connecting your MCP client, you can start interacting with your Neon databases using natural language.

**Example interactions**

- **List projects:** `"List my Neon projects"`
- **Create a new project:** `"Create a Neon project named 'my-test-project'"`
- **List tables in a database:** `"What tables are in the database 'my-database' in project 'my-project'?"`
- **Add a column to a table:** `"Add a column 'email' of type VARCHAR to the 'users' table in database 'main' of project 'my-project'"`
- **Run a query:** `"Show me the first 10 rows from the 'users' table in database 'my-database'"`

<Video  
sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]}
width={960}
height={1080}
/>

You can also refer to our individual guides for detailed examples on using the Neon MCP Server with specific MCP clients:

- [Claude Desktop](/guides/neon-mcp-server)
- [Cursor](/guides/cursor-mcp-neon)
- [Cline](/guides/cline-mcp-neon)
- [Windsurf (Codium)](/guides/windsurf-mcp-neon)
- [Zed](/guides/zed-mcp-neon)

## Conclusion

The Neon MCP Server enables natural language interaction with Neon Postgres databases, offering a simplified way to perform database management tasks. You can perform actions such as creating new Neon projects and databases, managing branches, executing SQL queries, and making schema changes, all through conversational requests. Features like branch-based migrations contribute to safer schema modifications. By connecting your preferred MCP client to the Neon MCP Server, you can streamline database administration and development workflows, making it easier for users with varying technical backgrounds to interact with Neon databases.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
