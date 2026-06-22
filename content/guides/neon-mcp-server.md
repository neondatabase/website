---
title: 'Get started with Claude Desktop and Neon MCP Server'
subtitle: 'Connect Claude Desktop to Neon to manage projects, run queries, and make schema changes'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-06T00:00:00.000Z'
updatedOn: '2026-06-22T12:42:26.466Z'
---

This guide shows how to connect Claude Desktop to the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon) so you can manage your Neon Postgres databases.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. Always review and authorize actions requested by the LLM before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Setting up Neon MCP server

### Prerequisites

- **Node.js (>= v18):** Install from [nodejs.org](https://nodejs.org/).
- **Claude Desktop:** Install Anthropic's [Claude Desktop](https://claude.ai/download).
- **Neon Account:** Sign up for a free Neon account at [neon.tech](https://neon.tech).
- **Neon API Key (for Local MCP server):** Get your [Neon API Key](/docs/manage/api-keys#creating-api-keys).

### Option 1: Setting up the remote hosted Neon MCP Server

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#config-generator). Claude connectors currently don't support API key authentication.
</Admonition>

Choose one of the following methods to set up the Remote Neon MCP server in Claude Desktop:

<Tabs labels={['Using Claude Connectors', 'By modifying config file']}>

<TabItem label="Using Claude Connectors">

1. Launch Claude Desktop and open the **Search & Tools** panel, and select **Add Connector**.
   ![Claude search and tools button](/guides/images/claude_mcp/claude_add_connector.png)
2. Click on **Add a custom one** to open the custom connector modal.
   ![Claude custom connector button](/guides/images/claude_mcp/claude_custom_connector.png)
3. Enter **Neon** in the **Name** field and `https://mcp.neon.tech/mcp` in the **Remote MCP server URL** field, then click **Add**.
   ![Claude custom connector modal](/guides/images/claude_mcp/claude_custom_connector_modal.png)
4. An OAuth window will open in your browser. Follow the prompts to authorize Claude to access your Neon account.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)
5. After authorization, you can start using the Neon MCP server with Claude.

</TabItem>

<TabItem label="By modifying config file">

1. Open Claude desktop and navigate to **Settings**.
   ![Claude settings](/guides/images/claude_mcp/claude_settings.png)
2. Under the **Developer** tab, click **Edit Config** (On Windows, it's under File -> Settings -> Developer -> Edit Config) to open the location of configuration file (`claude_desktop_config.json`).
   ![Claude config](/guides/images/claude_mcp/claude_developer_config.png)
3. Open the `claude_desktop_config.json` file in a text editor of your choice.
4. Add the "Neon" server entry within the `mcpServers` object:

   ```json
   {
     "mcpServers": {
       "Neon": {
         "command": "npx",
         "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
       }
     }
   }
   ```

5. Save the configuration file and **restart** Claude Desktop.
6. An OAuth window will open in your browser. Follow the prompts to authorize Claude to access your Neon account.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)
7. After authorization, you can start using the Neon MCP server with Claude.

</TabItem>
</Tabs>

### Option 2: Setting up the Local Neon MCP Server

This method runs the Neon MCP server locally on your machine, using a Neon API key for authentication.

1.  Open your terminal.
2.  Run the following command to install the Local Neon MCP server for use with Claude Desktop:

    ```bash
    npx @neondatabase/mcp-server-neon init $NEON_API_KEY
    ```

    > Make sure to replace `$NEON_API_KEY` with your actual Neon API key. You can generate one through the Neon Console by following the instructions in [Creating API keys](/docs/manage/api-keys#creating-api-keys).

    You'll be prompted to install the required dependencies. Type `y` to proceed. You should see output similar to this:

    ```bash
    npx @neondatabase/mcp-server-neon init napi_xxxx
    Need to install the following packages:
    @neondatabase/mcp-server-neon@0.x.x
    Ok to proceed? (y) y

    Config written to: /Users/USERNAME/Library/Application Support/Claude/claude_desktop_config.json
    The Neon MCP server will start automatically the next time you open Claude.
    ```

3.  Restart Claude Desktop.

### Verifying the connection

Verify the connection:

1. In Claude click on the search and tools icon to see the available tools.
   ![Claude available tools](/guides/images/claude_mcp/claude_available_tools.png)
2. You should see the Neon MCP server's tools listed. Click on the **neon** tool to see the available tools in detail.
   ![Claude list available tools](/guides/images/claude_mcp/claude_list_available_tools.png)
   Ask Claude `"List my Neon projects"` to verify the connection. For example, you might see output similar to this:

![Claude output](/guides/images/claude_mcp/claude_list_project.png)

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon Docs](/docs)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
