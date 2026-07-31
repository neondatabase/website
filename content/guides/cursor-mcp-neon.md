---
title: 'Get started with Cursor and Neon Postgres MCP Server'
subtitle: 'Make schema changes with natural language using Cursor and Neon MCP Server'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-20T00:00:00.000Z'
updatedOn: '2026-06-19T23:17:10.824Z'
---

This guide shows how to use [Cursor](https://cursor.com) with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon) to manage your Neon databases.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. Always review and authorize actions requested by the LLM before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Setting up Neon MCP Server in Cursor

### Prerequisites

Make sure you have:

1. **Cursor Editor:** Download and install Cursor from [cursor.com](https://cursor.com).
2. **A Neon Account and Project:** You'll need a Neon account and a project. You can create a new Neon project in the [Neon Console](https://console.neon.tech)
3. **Neon API Key (for Local MCP server):** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/api-keys). This API key is needed to authenticate your application with Neon. For instructions, see [Manage API keys](/docs/manage/api-keys).

   <Admonition type="important" title="Neon API Key Security">
   Keep your Neon API key secure, and never share it publicly. It provides access to your Neon projects.
   </Admonition>

4. **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Quick Setup (Recommended)

The fastest way to get started is with the [`neon init`](/docs/cli/init) command, which automates OAuth authentication, API key creation, and Cursor configuration:

```bash
npx neon@latest init
```

This command authenticates via OAuth, creates an API key, and configures Cursor to connect to Neon's remote MCP server. API key authentication means **fewer approval prompts** when using MCP tools. Once complete, ask your AI assistant **"Get started with Neon"**.

<Admonition type="tip" title="Cursor Users: One-Click Alternative">
Cursor offers a deep link for quick OAuth setup:

<a href="cursor://anysphere.cursor-deeplink/mcp/install?name=Neon&config=eyJ1cmwiOiJodHRwczovL21jcC5uZW9uLnRlY2gvbWNwIn0%3D"><img src="/docs/local/mcp-install-dark.svg" alt="Add Neon MCP server to Cursor" height="32" /></a>

Note: This uses OAuth (not API key), so you'll need to approve each MCP action. For fewer prompts, use Quick Setup above.
</Admonition>

### Option 1: Setting up the Remote Hosted Neon MCP Server (OAuth)

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#config-generator).
</Admonition>

1. Open Cursor.
2. Create a `.cursor` directory in your project's root directory. This is where Cursor will look for the MCP server configuration.
3. Paste the following JSON configuration into a file named `mcp.json` in the
   `.cursor` directory:

   ```json
   {
     "mcpServers": {
       "Neon": {
         "url": "https://mcp.neon.tech/mcp",
         "headers": {}
       }
     }
   }
   ```

   If you have other MCP servers configured, you can copy just the `Neon` part.

   Save the `mcp.json` file after pasting the configuration.

4. **Restart Cursor** or reload the window (`Developer: Reload Window` from the Command Palette). If Cursor prompts you to Enable the MCP server, click **Enable**.

5. An OAuth window will open in your browser. Follow the prompts to authorize Cursor to access your Neon account.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)

6. You can verify that the connection is successful by checking the **Tools & MCP** section in Cursor settings.
   ![Cursor with Neon MCP Tools](/docs/guides/cursor-with-neon-mcp-tools.png)

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API key for authentication.

1. Open Cursor.
2. Create a `.cursor` directory in your project's root directory. This is where Cursor will look for the MCP server configuration.
3. Paste the following JSON configuration into a file named `mcp.json` in the `.cursor` directory. Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section:

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

   If you have other MCP servers configured, you can copy just the `Neon` part.

   ![Cursor Local MCP JSON](/docs/guides/cursor-local-mcp-server-json.png)

4. Save the `mcp.json` file after pasting the configuration.

5. **Restart Cursor** or reload the window (`Developer: Reload Window` from the Command Palette).

6. Check the **MCP Servers** section in Cursor settings to verify the connection.

   ![Cursor with Neon MCP Tools](/docs/guides/cursor-with-neon-mcp-tools.png)

### Verification

Verify the connection:

1. Open a Cursor **Chat** using the keyboard shortcut **Command + I** (on Mac) or **Control + I** (on Windows) and select the **Agent** option from the drop-down menu.

   ![Cursor Composer view](/docs/guides/cursor_chat_view.png)

2. Type `List your available MCP tools` in the Composer text field, select the **agent** option in the corner of the field, and click **Submit**.

   <Admonition type="tip">The agent option is small and easy to miss.</Admonition>

   ![Cursor list available tools](/docs/guides/cursor_list_tools.png)

3. Try out an Neon MCP Server tool by typing `Tell me about my Neon project <project_id>`. **You'll need to provide your Neon project ID.**

   ![Cursor list project details](/docs/guides/cursor_project_details.png)

   Cursor uses the Neon MCP Server `describe_project` tool to retrieve your project's details.

### Global MCP Server in Cursor

You can also set up a global MCP server in Cursor. To set this up:

1. Open Cursor.
2. Go to the **Settings**.
3. In the **Tools & MCP** section, click on **+ Add Custom MCP**.
4. Paste the same JSON configuration either for the **Remote Hosted** or **Local MCP Server** (as shown in the previous sections) into the configuration field.
5. Save the configuration.
6. Restart Cursor or reload the window (`Developer: Reload Window` from the Command Palette).

### Troubleshooting

If you are on a version of Cursor that does not support JSON configuration for MCP servers, you can use the following command when prompted:

```bash
npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
```

For a full list of available tools, see [available tools](/docs/ai/neon-mcp-server#available-tools) in the Neon MCP Server overview.

## Development Workflow: Adding a Column with Cursor and Neon MCP

<Admonition type="tip">
Use `⌘I` to open Cursor's Composer and `⌘N` to create a new Composer.
</Admonition>

Here's an example interaction adding a `created_at` column to a table:

```text shouldWrap
User: In my neon project id: round-salad-44063611 list all the tables
Cursor: I'll help you list all the tables in your Neon project. I'll use the default database name 'neondb' since none was specified.
> Called MCP Tool (get_database_tables)
> I found one table in your database:
> playing_with_neon (in the public schema)
> Would you like to see more details about this table's structure or perform any other operations with it?

User: Can you show me first 5 rows?
Cursor: I'll query the first 5 rows from the playing_with_neon table.
> Called MCP Tool (run_sql)
> Here are the first 5 rows from the table. The table has three columns:
> id (sequential numbers)
> name (string values)
> value (decimal numbers)
> Would you like to perform any other operations with this data?

User: can you add a created_at column?
Cursor: I'll help you add a created_at column to the playing_with_neon table. I'll set it up with a timestamp data type and set it to automatically record the creation time of new rows.
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
Cursor: I'll complete the migration and apply the changes to the production branch.
> Called MCP Tool (complete_database_migration)
> The migration has been successfully completed! The created_at column has been added to your table in the production branch, and the temporary branch has been cleaned up.
```

You can verify the changes in your Neon Console or by querying the database directly.

![Neon Console with added column](/docs/guides/neon-cursor-mcp-added-column.png)

<Admonition type="note">
While the Neon MCP server gives you access to all of Neon's features, you can also use a [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Adding an MCP Server to Cursor](https://docs.cursor.com/context/model-context-protocol)
- [Neon Docs](/docs)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
