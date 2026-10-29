---
title: 'Get started with Claude Desktop and Neon MCP Server'
subtitle: 'Connect Claude Desktop to Neon to manage projects, run queries, and make schema changes'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-06T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

This guide shows how to connect Claude Desktop to the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon) so you can manage your Neon databases.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. Always review and authorize actions requested by the LLM before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Set up the Neon MCP Server

### Prerequisites

- **Node.js (>= v18):** Install from [nodejs.org](https://nodejs.org/).
- **Claude Desktop:** Install Anthropic's [Claude Desktop](https://claude.ai/download).
- **Neon account:** Sign up for a free Neon account at [neon.com](https://console.neon.tech/signup).
- **Neon API key (for API key authentication):** Get your [Neon API key](/docs/manage/api-keys#creating-api-keys).

### Option 1: Set up the remote hosted Neon MCP Server

<Admonition type="note">
By default, the remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#config-generator). Claude connectors currently don't support API key authentication.
</Admonition>

Choose one of the following methods to set up the remote Neon MCP Server in Claude Desktop:

<Tabs labels={['Using Claude Connectors', 'By modifying config file']}>

<TabItem label="Using Claude Connectors">

The Neon MCP Server is an official Claude connector, so you don't need to enter a custom connector URL.

1. In Claude Desktop, open **Settings** from the profile menu.
2. Select **Connectors** (sometimes shown under **Customize** > **Connectors**).
3. Click **Browse connectors**, find **Neon**, and add it.
4. An OAuth window opens in your browser. Follow the prompts to authorize Claude to access your Neon account.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)
5. After authorization, you can start using the Neon MCP Server with Claude.

</TabItem>

<TabItem label="By modifying config file">

1. Open Claude Desktop and navigate to **Settings**.
   ![Claude settings](/guides/images/claude_mcp/claude_settings.png)
2. Under the **Developer** tab, click **Edit Config** (On Windows, it's under File -> Settings -> Developer -> Edit Config) to open the location of the configuration file (`claude_desktop_config.json`).
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
6. An OAuth window opens in your browser. Follow the prompts to authorize Claude to access your Neon account.
   ![Neon OAuth window](/docs/guides/neon-oauth-window.png)
7. After authorization, you can start using the Neon MCP Server with Claude.

</TabItem>
</Tabs>

### Option 2: API key authentication

This method uses the hosted Neon MCP Server with a Neon API key.

1.  Open `claude_desktop_config.json` (Claude Desktop → **Settings** → **Developer** → **Edit Config**).
2.  Add the "Neon" server entry within the `mcpServers` object. Replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys#creating-api-keys):

    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": [
            "-y",
            "mcp-remote@latest",
            "https://mcp.neon.tech/mcp",
            "--header",
            "Authorization:${NEON_AUTH_HEADER}"
          ],
          "env": {
            "NEON_AUTH_HEADER": "Bearer <YOUR_NEON_API_KEY>"
          }
        }
      }
    }
    ```

3.  Restart Claude Desktop.

### Verify the connection

1. In Claude, click the search and tools icon to see the available tools.
   ![Claude available tools](/guides/images/claude_mcp/claude_available_tools.png)
2. The Neon MCP Server's tools are listed. Click the **neon** entry to see the tools in detail.
   ![Claude list available tools](/guides/images/claude_mcp/claude_list_available_tools.png)
   Ask Claude `"List my Neon projects"` to verify the connection. For example, you might see output similar to this:

![Claude output](/guides/images/claude_mcp/claude_list_project.png)

## Resources

- [Model Context Protocol](https://modelcontextprotocol.org)
- [Neon MCP Server overview](/docs/ai/neon-mcp-server)
- [Neon docs](/docs)
- [Neon API reference](/docs/reference/api)
- [Neon API keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
