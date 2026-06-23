---
title: 'Get started with Zed and Neon Postgres MCP Server'
subtitle: 'Make schema changes with natural language using Zed and Neon MCP Server'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-04-10T00:00:00.000Z'
updatedOn: '2026-06-19T23:17:10.824Z'
---

This guide shows how to use [Zed](https://zed.dev) with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon) to manage your Neon databases.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. Always review and authorize actions requested by the LLM before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Setting up Neon MCP Server in Zed

### Prerequisites

Make sure you have:

1.  **Zed editor:** Download and install Zed from [zed.dev](https://zed.dev/download).
2.  **A Neon account and project:** You'll need a Neon account and a project. You can create a new Neon project in the [Neon Console](https://console.neon.tech)
3.  **Neon API Key (for Local MCP server):** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/api-keys). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](/docs/manage/api-keys).

    <Admonition type="warning" title="Neon API Key Security">
    Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
    </Admonition>

4.  **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Option 1: Setting up the Remote Hosted Neon MCP Server

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#config-generator).
</Admonition>

1.  Open Zed.
2.  Click the Assistant (✨) icon in the bottom right corner of Zed.
    ![Zed Assistant icon](/docs/guides/zed/assistant-icon.png)
3.  Click **Add custom server** in the top right panel of the Assistant.
    ![Zed add custom server](/docs/guides/zed/add-custom-server.png)
4.  Enter the following configuration for the Neon MCP server in the JSON input field.
    ```json
    {
      "Neon": {
        "command": "npx",
        "args": ["-y", "mcp-remote", "https://mcp.neon.tech/mcp"],
        "env": {}
      }
    }
    ```
    ![Zed add Neon Remote MCP server](/docs/guides/zed/add-neon-remote-mcp-server.png)
5.  Click **Add Server**.
6.  An OAuth window will open. Follow the prompts to authorize Zed to access your Neon account
    ![Neon OAuth window](/docs/guides/neon-oauth-window.png)

7.  Check the **Model Context Protocol (MCP) Servers** section in Zed **Settings** to ensure the connection is successful. Neon should be listed as an MCP server.
    ![Zed with Neon MCP](/docs/guides/zed/with-neon-mcp.png)

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API key for authentication.

1.  Open Zed.
2.  Click the Assistant (✨) icon in the bottom right corner of Zed.
    ![Zed Assistant icon](/docs/guides/zed/assistant-icon.png)
3.  Click **Add custom server** in the top right panel of the Assistant.
    ![Zed add custom server](/docs/guides/zed/add-custom-server.png)
4.  Enter the following configuration for the Neon MCP server in the JSON input field.
    ```json
    {
      "Neon": {
        "command": "npx",
        "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"],
        "env": {}
      }
    }
    ```
    ![Zed add Neon Local MCP server](/docs/guides/zed/add-neon-local-mcp-server.png)
5.  Click **Add Server**.
6.  Check the **Model Context Protocol (MCP) Servers** section in Zed **Settings** to ensure the connection is successful. Neon should be listed as an MCP server.
    ![Zed with Neon MCP](/docs/guides/zed/with-neon-mcp.png)

### Verification

Verify the connection:

1.  Open Zed Assistant.

2.  Type `List my Neon projects` in the Assistant text field.
    ![Zed list neon projects](/docs/guides/zed/list_neon_projects.png)

3.  When prompted, click **Allow** to authorize the tool to access your Neon project.
    ![Zed allow tool access](/docs/guides/zed/allow_tool_access.png)

4.  Zed will use the `list_projects` MCP tool to retrieve and display your Neon projects, including project ID, name, and other details.
    ![Zed list projects](/docs/guides/zed/list_projects.png)

### Troubleshooting

If you experience issues adding an MCP server from the Assistant panel, you can also do so through the **Settings**. Follow these steps:

1.  Open the `~/.config/zed/settings.json` file. You can access this file by clicking on **Settings** in the Zed menu bar.
2.  Add the following `context_servers` section to the file.

<CodeTabs labels={["Remote MCP server", "Local MCP server"]}>

```json
"context_servers": {
    "Neon": {
      "source": "custom",
      "enabled": true,
      "command": "npx",
      "args": [ "-y", "mcp-remote", "https://mcp.neon.tech/mcp" ],
      "env": {}
    }
}
```

```json
"context_servers": {
    "Neon": {
      "source": "custom",
      "enabled": true,
      "command": "npx",
      "args": [ "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>" ],
      "env": {}
    }
}
```

</CodeTabs>

#### Troubleshooting on Windows

If you are using Windows, and you encounter issues with the command line, you may need to adjust the command to use `cmd` or `wsl` to run the MCP server. For example, here's how you can set it up:

<CodeTabs labels={["Windows", "Windows (WSL)"]}>

```json
"context_servers": {
   "neon": {
      "command": {
         "path": "cmd",
         "args": ["/c", "npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"],
         "env": null
      },
      "settings": {}
   }
}
```

```json
"context_servers": {
   "neon": {
      "command": {
         "path": "wsl",
         "args": ["npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"],
         "env": null
      },
      "settings": {}
   }
}
```

</CodeTabs>

For a full list of available tools, see [available tools](/docs/ai/neon-mcp-server#available-tools) in the Neon MCP Server overview.

## Development Workflow: Adding a Column with Zed and Neon MCP

Here's an example interaction adding a `created_at` column to a table:

![Zed listing projects](/docs/guides/zed/mcp-neon-adding-column-1.png)

```text shouldWrap
User: List my neon projects
Zed: I'll use the list_projects tool to show your Neon projects.
> Run MCP tool `list_projects`
> You have one Neon project:
> Name: mcp
> Project ID: red-math-82356803
> Region: aws-ap-southeast-1
> ...other details...

User: what tables are present in it?
Zed: I'll use the `get_database_tables` tool to list the tables in your project. I'll use the project ID we just found.
> Run MCP tool `get_database_tables`
> There is one table in your project's database:
> Schema: public
> Table Name: `playing_with_neon`
> Type: Base Table
> Let me fetch the details of this table's schema so you can see its structure:
> Run MCP tool `describe_table_schema`
> The "playing_with_neon" table has three columns:
> 1. id: An auto-incrementing integer (primary key)
> 2. value: A real (floating-point) number that can be null
> 3. name: A text field that cannot be null

Would you like to see the data in this table or perform any operations on it?
```

![Zed showing table schema](/docs/guides/zed/mcp-neon-adding-column-2.png)

```text
User: Can you show me first 5 rows in it?
Zed: I'll query the first 5 rows from the playing_with_neon table:
> Run MCP tool `run_sql`
> xxx (table rows are returned by Zed)

User: can you add a created_at column to the table?
Zed: I'll use the prepare_database_migration tool to add a created_at column to the playing_with_neon table:
> Run MCP tool `prepare_database_migration`
> I've added the `created_at` column in a temporary branch. Let me verify the change by checking the table structure:
> Run MCP tool `run_sql`
> I've verified that the created_at column has been successfully added in the temporary branch.
> Migration Details:
> - Migration ID: a78e2a3b-8498-48a0-9c7a-2dec30da84bc
> - Temporary Branch Name: br-royal-mode-a1nfvzag
> - Temporary Branch ID: br-royal-mode-a1nfvzag
> - Migration Result: Success
> Would you like to commit this migration to the production branch?

User: yes do it
Zed: I'll complete the migration using the provided migration ID:
> Run MCP tool `complete_database_migration`
> The migration has been successfully completed. The `created_at` column has been added to the `playing_with_neon` table in the production branch, and the temporary branch has been deleted.
```

![Zed completing migration](/docs/guides/zed/mcp-neon-adding-column-3.png)

You can verify the changes in your Neon Console or by querying the database directly.

![Neon Console with added column](/docs/guides/neon-cursor-mcp-added-column.png)

<Admonition type="note">
While the Neon MCP server allows you to use all of Neon's functionalities, you can also use a [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Zed MCP Docs](https://zed.dev/docs/ai/mcp)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
