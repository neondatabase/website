---
title: 'Connect MCP Clients to Neon'
subtitle: 'Learn how to connect MCP clients such as Cursor, Claude Desktop, Cline, and Windsurf to your Neon Postgres database.'
enableTableOfContents: true
updatedOn: '2025-03-06T00:00:00.000Z'
---

The **Neon MCP Server** allows you to connect various Model Context Protocol (MCP) compatible AI tools to your Neon Postgres databases. This guide provides instructions for connecting popular MCP clients to the Neon MCP Server, enabling natural language interaction with your Neon projects.

This guide covers the setup for the following MCP Clients:

- [Claude Desktop](https://claude.ai/download)
- [Cursor](https://cursor.com/)
- [Windsurf (Codeium)](https://codeium.com/windsurf)
- [Cline (VS Code extension)](https://cline.bot)

By connecting these tools to the Neon MCP Server, you can manage your Neon projects, databases, and schemas using natural language commands within the MCP client interface.

## Prerequisites

Before you begin, ensure you have:

- **Neon Account and API Key:** You need a Neon account and a Neon API key. Create an API key in your [Neon Console](https://console.neon.tech/app/settings/api-keys). See [Neon API Keys documentation](/docs/manage/api-keys#creating-api-keys) for details.
- **Node.js (>= v18.0.0) and npm:** Ensure Node.js version 18 or later and npm are installed. Download them from [nodejs.org](https://nodejs.org).
- **MCP Client Application:** Download and install your preferred MCP client application from the links provided above.

<Admonition type="note" title="Generic Postgres MCP Server">
If you only require basic database operations (like running SQL queries) through natural language, you can also use the [generic Postgres MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) with Neon. We strongly recommend using the Neon MCP Server for full Neon integration, including managing Neon projects, schemas, migrations, and more.
</Admonition>

## Connecting MCP Clients

The following sections detail the steps to connect each MCP client to the Neon MCP Server.

### Claude Desktop

1.  Open your terminal.
2.  Run the following command:

    ```bash
    npx -y @smithery/cli install neon --client claude
    ```
    Enter your Neon API key when prompted.

3.  Restart Claude Desktop.

Here's an example of using Neon MCP Server with Claude Desktop:

<video autoPlay playsInline muted loop width="800" height="600" controls>
    <source type="video/mp4" src="/videos/pages/doc/neon-mcp.mp4"/>
</video>

### Cursor

1. Open Cursor and go to Cursor Settings. (Navbar -> Cursor Settings)
2. Navigate to Features -> MCP Servers.
3. Click "+ Add new MCP server".
4. In the "Add MCP Server" modal:
    - **Name:** `Neon` (or any descriptive name)
    - Chose `command` for type
    - **Command:** 
        ```bash
        npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>` 
        ```
        (Replace `<YOUR_NEON_API_KEY>` with your Neon API key)
    - Click **Add**.

Here's an example of using Neon MCP Server with Cursor:
<video autoPlay playsInline muted loop width="800" height="600" controls>
    <source type="video/mp4" src="/videos/pages/doc/cursor-neon-mcp.mp4"/>
</video>

### Windsurf (Codeium)

1. Open your terminal.
2. Run the following command:

    ```bash
    npx -y @smithery/cli install neon --client windsurf
    ```
    Enter your Neon API key when prompted.

3.  You can also manually configure Windsurf by editing the `mcp_config.json` file by adding the following within the `mcpServers` section at `~/.codeium/windsurf/mcp_config.json`:

    ```json
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
    }
    ```
    Replace `<YOUR_NEON_API_KEY>` with your Neon API key.

4. Click on Refresh button in Cascade to load the new MCP server.

Here's an example of using Neon MCP Server with Windsurf:
<video autoPlay playsInline muted loop width="800" height="600" controls>
    <source type="video/mp4" src="/videos/pages/doc/windsurf-neon-mcp.mp4"/>
</video>

### Cline (VS Code Extension)

1.  **Open Cline in VS Code.** (Sidebar -> Cline icon)
2.  **Click "Configure MCP Servers"** in the Cline panel. This opens `cline_mcp_settings.json`.
3.  **Edit `cline_mcp_settings.json`:** Add the following within the `mcpServers` section, replacing `<YOUR_NEON_API_KEY>` with your Neon API Key:

    ```json
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
    }
    ```

4.  **Save `cline_mcp_settings.json`.**

Here's an example of using Neon MCP Server with Cline:
<video autoPlay playsInline muted loop width="800" height="600" controls>
    <source type="video/mp4" src="/videos/pages/doc/cline-neon-mcp.mp4"/>
</video>

### Any other MCP client

You can connect other MCP clients to the Neon MCP Server by running the following command in your terminal:

```bash
npx -y @smithery/cli install neon --client <client_name>
```

Replace `<client_name>` with the name of your MCP client application. Supported client names include:

- `roo-cline` for [Roo Cline VS Code extension](https://github.com/RooVetGit/Roo-Code)
- `witsy` for [Witsy](https://witsyai.com/)
- `enconvo` for [Enconvo](https://www.enconvo.com/)


For MCP clients not listed here, you can manually configure them by adding the following Neon MCP Server configuration to their respective `mcp_config` file within the mcpServers section:

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
}
```
Replace `<YOUR_NEON_API_KEY>` with your Neon API key.

<Admonition type="note">
After successful configuration, you should see the Neon MCP Server listed as active in your MCP client's settings or tool list. You can enter "List my Neon projects" in the MCP client to see your Neon projects and verify the connection.
</Admonition>

## Next Steps

Once connected, you can start interacting with your Neon Postgres databases using natural language commands within your chosen MCP client. Explore the [Supported Actions (Tools)](/docs/ai/neon-mcp-server#supported-actions-tools) of the Neon MCP Server to understand the available functionalities.

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