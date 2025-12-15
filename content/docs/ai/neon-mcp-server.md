---
title: Neon MCP Server overview
subtitle: Learn about managing your Neon projects using natural language with Neon MCP
  Server
enableTableOfContents: true
updatedOn: '2025-11-14T19:50:51.302Z'
---

The **Neon MCP Server** is an open-source tool that lets you interact with your Neon Postgres databases in **natural language**.

## Get started

The fastest way to set up Neon's MCP Server is with one command:

```bash
npx neonctl@latest init
```

This command will:
- Authenticate via OAuth (opens your browser)
- Create a Neon API key for you automatically
- Configure your editor's MCP settings automatically

Currently the `init` command supports: **Cursor**, **VS Code with GitHub Copilot**, and **Claude Code**

After running the command, restart your editor and ask your AI assistant to **"Get started with Neon"** to launch the interactive onboarding guide. For more details, see the [neonctl init documentation](/docs/reference/cli-init).

**Prefer manual configuration?** See [Connect MCP clients](/docs/ai/connect-mcp-clients-to-neon) for step-by-step instructions for any editor, including Windsurf, ChatGPT, Zed, and others.

---

Imagine you want to create a new database. Instead of using the Neon Console or API, you could just type a request like, "Create a database named 'my-new-database'". Or, to see your projects, you might ask, "List all my Neon projects". The Neon MCP Server makes this possible.

It works by acting as a bridge between natural language requests and the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Built upon the [Model Context Protocol (MCP)](https://modelcontextprotocol.org), it translates your requests into the necessary Neon API calls, allowing you to manage everything from creating projects and branches to running queries and performing database migrations.

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.

The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.

For more information, see [MCP security guidance →](#mcp-security-guidance).
</Admonition>

## Understanding MCP and Neon MCP Server

The [**Model Context Protocol (MCP)**](https://modelcontextprotocol.org) standardizes communication between LLMs and external tools. It defines a client-server architecture, enabling LLMs (Hosts) to connect to specialized servers that provide context and tools for interacting with external systems. The key components of the MCP architecture are:

- **Hosts**: These are AI applications, such as Claude Desktop, Claude Code, or IDEs like Cursor, that initiate connections to MCP servers
- **Clients**: These reside within the host application and maintain one-to-one connections with individual MCP servers
- **Server**: These programs, such as Neon's MCP Server, provide context, tools, and prompts to clients, enabling access to external data and functionalities

### Why use MCP?

Traditionally, connecting AI models to different data sources required developers to create custom code for each integration. This fragmented approach increased development time, maintenance burdens, and limited interoperability between AI models and tools. MCP addresses this challenge by providing a standardized protocol that simplifies integration, accelerates development, and enhances the capabilities of AI assistants.

### What is Neon MCP server?

**Neon MCP Server** acts as the **Server** in the MCP architecture, specifically designed for Neon. It provides a set of **tools** that MCP clients (like Claude Desktop, Claude Code, Cursor) can utilize to manage Neon resources. This includes actions for project management, branch management, executing SQL queries, and handling database migrations, all driven by natural language requests.

**Key Benefits of using Neon MCP Server:**

- **Natural language interaction:** Manage Neon databases using intuitive, conversational commands.
- **Simplified database management:** Perform complex actions without writing SQL or directly using the Neon API.
- **Enhanced Productivity:** Streamline workflows for database administration and development.
- **Accessibility for non-developers:** Empower users with varying technical backgrounds to interact with Neon databases.
- **Database migration support:** Leverage Neon's branching capabilities for database schema changes initiated via natural language.

<Admonition type="important" title="Security Considerations">
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

- An MCP Client application (e.g., Cursor, Windsurf, Claude Desktop, Claude Code, Cline, Zed, ChatGPT).
- A Neon account.

<Admonition type="tip" title="Install in a single click for Cursor users">
Click the button below to install the Neon MCP server in Cursor. When prompted, click **Install** within Cursor.

<a href="cursor://anysphere.cursor-deeplink/mcp/install?name=Neon&config=eyJ1cmwiOiJodHRwczovL21jcC5uZW9uLnRlY2gvbWNwIn0%3D"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add Neon MCP server to Cursor" height="32" /></a>

</Admonition>

#### Setup steps:

1.  Go to your MCP Client's settings where you configure MCP Servers (this varies by client)
2.  Register a new MCP Server. When prompted for the configuration, name the server "Neon" and enter `https://mcp.neon.tech/mcp` as the Remote MCP Server URL.

    > MCP supports two remote server transports: the deprecated Server-Sent Events (SSE) and the newer, recommended Streamable HTTP. If your LLM client doesn't support Streamable HTTP yet, you can switch the endpoint from `https://mcp.neon.tech/mcp` to `https://mcp.neon.tech/sse` to use SSE instead.

3.  Save the configuration and **restart or refresh** your MCP client application.
4.  The first time the client initializes Neon's MCP server, it should trigger an **OAuth flow**:
    - Your browser will open a Neon page asking you to authorize the "Neon MCP Server" to access your Neon account.
    - Review the requested permissions and click **Authorize**.
    - You should see a success message, and you can close the browser tab.
5.  Your MCP client should now be connected to the Neon Remote MCP Server and ready to use.

### Local MCP Server

You can install Neon MCP server locally using `npm`.

#### Prerequisites

- **Node.js (>= v18.0.0):** Ensure Node.js version 18 or higher is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **Neon API Key:** You will need a Neon API key to authenticate the Neon MCP Server with your Neon account. You can create one from the [Neon Console](https://console.neon.tech/app/settings/api-keys) under your Profile settings. Refer to the [Neon documentation on API Keys](/docs/manage/api-keys#creating-api-keys) for detailed instructions.

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

<MCPTools />

## Usage examples

After setting up either the remote or local server and connecting your MCP client, you can start interacting with your Neon databases using natural language.

**Example interactions**

- **Search resources:** `"Can you search for 'production' across my Neon resources?"`
- **List projects:** `"List my Neon projects"`
- **Create a new project:** `"Create a Neon project named 'my-test-project'"`
- **List tables in a database:** `"What tables are in the database 'my-database' in project 'my-project'?"`
- **Add a column to a table:** `"Add a column 'email' of type VARCHAR to the 'users' table in database 'main' of project 'my-project'"`
- **Run a query:** `"Show me the first 10 rows from the 'users' table in database 'my-database'"`
- **Generate a schema diff:** `"Generate a schema diff for branch 'br-feature-auth' in project 'my-project'"`

<Video  
sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]}
width={960}
height={1080}
/>

## API key-based authentication

The Neon MCP Server supports API key-based authentication for remote access, in addition to OAuth. This allows for simpler authentication using your [Neon API key (personal or organization)](/docs/manage/api-keys) for programmatic access. API key configuration is shown below:

```json
{
  "mcpServers": {
    "Neon": {
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <$NEON_API_KEY>"
      }
    }
  }
}
```

> Currently, only [streamable HTTP](#streamable-http-support) responses are supported with API-key based authentication. Server-Sent Events (SSE) responses are not yet supported for this authentication method.

## Search across resources

The Neon MCP Server includes a `search` tool that lets you find resources across all your Neon organizations, projects, and branches with a single query. Ask your AI assistant:

```
Can you search for "production" across my Neon resources?
```

The assistant will search through all accessible resources and return structured results with direct links to the Neon Console. Results include the resource name, type (organization, project, or branch), and Console URL for easy navigation.

A companion `fetch` tool lets you retrieve detailed information about any resource using the ID returned by the search.

This is particularly useful when working with multiple organizations or large numbers of projects, making it easier to discover and navigate your Neon resources.

## Read-only mode

The Neon MCP Server supports read-only mode for safe operation in cloud and production environments. Enable it by adding the `x-read-only: true` header to your MCP configuration:

```json
{
  "mcpServers": {
    "Neon": {
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "x-read-only": "true"
      }
    }
  }
}
```

When enabled, the server restricts all operations to read-only tools. Only list and describe tools are available, and SQL queries automatically run in read-only transactions. This provides a safe method for querying and analyzing production databases without any risk of accidental modifications.

## Guided onboarding

The Neon MCP Server includes a `load_resource` tool that provides comprehensive getting-started guidance directly through your AI assistant. Ask your assistant:

```
Get started with Neon
```

The assistant will load detailed step-by-step instructions covering organization setup, project configuration, connection strings, schema creation, and migrations. This works in IDEs that don't fully support MCP resources and ensures onboarding guidance is explicitly loaded when you need it.

## MCP security guidance

The Neon MCP server provides access to powerful tools for interacting with your Neon database—such as `run_sql`, `create_table`, `update_row`, and `delete_table`. MCP tools are useful in development and testing, but **we do not recommend using MCP tools in production environments**.

### Recommended usage

- Use MCP only for **local development** or **IDE-based workflows**.
- Never connect MCP agents to production databases.
- Avoid exposing production data or PII data to MCP — only use anonymized data.
- Disable MCP tools capable of accessing or modifying data when they are not being used.
- Only grant MCP access to trusted users.

### Human oversight and access control

- **Always review and authorize actions** requested by the LLM before execution. The MCP server grants powerful database management capabilities through natural language requests, so human oversight is essential.
- **Restrict access** to ensure that only authorized users and applications have access to the Neon MCP Server and associated API keys.
- **Monitor usage** and regularly audit who has access to your MCP server configurations and Neon API keys.

By following these guidelines, you reduce the risk of accidental or unauthorized actions when working with Neon's MCP Server.

## Conclusion

The Neon MCP Server enables natural language interaction with Neon Postgres databases, offering a simplified way to perform database management tasks. You can perform actions such as creating new Neon projects and databases, managing branches, executing SQL queries, and making schema changes, all through conversational requests. Features like branch-based migrations contribute to safer schema modifications. By connecting your preferred MCP client to the Neon MCP Server, you can streamline database administration and development workflows, making it easier for users with varying technical backgrounds to interact with Neon databases.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
