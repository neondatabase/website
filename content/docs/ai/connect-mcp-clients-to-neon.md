---
title: Connect MCP Clients to Neon
subtitle: Learn how to connect MCP clients such as Cursor, Claude Desktop, Cline, and
  Windsurf to your Neon Postgres database.
enableTableOfContents: true
updatedOn: '2025-03-07T21:52:34.652Z'
---

The **Neon MCP Server** allows you to connect various [**Model Context Protocol (MCP)**](https://modelcontextprotocol.org) compatible AI tools to your Neon Postgres databases. This guide provides instructions for connecting popular MCP clients to the Neon MCP Server, enabling natural language interaction with your Neon projects.

You can connect to Neon MCP Server in two ways:

1.  **Remote MCP Server (Preview):** Connect to Neon's managed MCP server using OAuth.
2.  **Local Server:** Install and run the server locally, using a Neon API key.

This guide covers the setup for the following MCP Clients:

- [Claude Desktop](#claude-desktop)
- [Cursor](#cursor)
- [Windsurf (Codeium)](#windsurf-codeium)
- [Cline (VS Code extension)](#cline-vs-code-extension)

By connecting these tools to the Neon MCP Server, you can manage your Neon projects, databases, and schemas using natural language commands within the MCP client interface.

## Prerequisites

- An MCP Client application.
- A Neon account (for OAuth authorization).
- **Node.js (>= v18.0.0) and npm:** Download from [nodejs.org](https://nodejs.org).

For Local MCP Server setup, you also need a Neon API key. See [Neon API Keys documentation](/docs/manage/api-keys#creating-api-keys).

<Admonition type="note">
Ensure you are using the latest version of your chosen MCP client as MCP integration may not be available in older versions. If you are using an older version, update your MCP client to the latest version.
</Admonition>

## Claude Desktop

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>

<TabItem>

1.  Open Claude desktop and navigate to **Settings**.
2.  Under the **Developer** tab, click **Edit Config** (On Windows, its under File -> Settings -> Developer -> Edit Config) to open the configuration file (`claude_desktop_config.json`).
3.  Add the "Neon" server entry within the `mcpServers` object:
    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": [
            "-y",
            "mcp-remote",
            "https://mcp.neon.tech/sse"
          ]
        }
      }
    }
    ```
4.  Save the configuration file and **restart** Claude Desktop.
5.  The first time it connects, follow the on-screen OAuth prompts in your browser to authorize Neon.

</TabItem>

<TabItem>

1.  Open your terminal.
2.  Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

    ```bash
    npx -y @smithery/cli install neon --client claude --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
    ```

4. Restart Claude Desktop.

</TabItem>
</Tabs>

For more, see [Get started with Neon MCP server with Claude Desktop](/guides/neon-mcp-server).

## Cursor

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1.  Open Cursor. Create a `.cursor` directory in your project root if needed.
2.  Create or open the `.cursor/mcp.json` file.
3.  Add the "Neon" server entry within the `mcpServers` object:
    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": [
            "-y",
            "mcp-remote",
            "https://mcp.neon.tech/sse"
          ]
        }
      }
    }
    ```
4.  Save the configuration file. Cursor may detect the change or require a restart.
5.  The first time it connects, follow the on-screen OAuth prompts in your browser.

</TabItem>
<TabItem>

1. Open Cursor.
2. Open your terminal.
3. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

   ```bash
   npx -y @smithery/cli@latest install neon --client cursor --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
   ```

4. Restart Cursor if necessary.

</TabItem>
</Tabs>

For more, see [Get started with Cursor and Neon Postgres MCP Server](/guides/cursor-mcp-neon).

## Windsurf (Codeium)

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1.  Open Windsurf and navigate to the Cascade assistant sidebar.
2.  Click the hammer (MCP) icon, then **Configure** to open the configuration file (e.g., `.config/mcp_config.json`).
3.  Add the "Neon" server entry within the `mcpServers` object:
    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": [
            "-y",
            "mcp-remote",
            "https://mcp.neon.tech/sse"
          ]
        }
      }
    }
    ```
4.  Save the file.
5.  Click the **Refresh** button in the Cascade sidebar next to "available MCP servers".
6.  Follow the on-screen OAuth prompts in your browser.

</TabItem>
<TabItem>

1. Open your terminal.
2. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

   ```bash
   npx -y @smithery/cli@latest install neon --client windsurf --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
   ```

4. Click the **Refresh** button in Windsurf Cascade to load the new MCP server.

</TabItem>
</Tabs>

For more, see [Get started with Windsurf and Neon Postgres MCP Server](/guides/windsurf-mcp-neon).

## Cline (VS Code Extension)

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1. Open Cline in VS Code (Sidebar -> Cline icon).
2.  Click **MCP Servers** Icon -> **Installed** -> **Configure MCP Servers** to open the configuration file.
3.  Add the "Neon" server entry within the `mcpServers` object:
    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": [
            "-y",
            "mcp-remote",
            "https://mcp.neon.tech/sse"
          ]
        }
      }
    }
    ```
4.  Save the file. Cline should reload the configuration automatically.
5.  The first time it connects, follow the on-screen OAuth prompts in your browser.

</TabItem>
<TabItem>

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Open your terminal.
3. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

    ```bash
    npx -y @smithery/cli@latest install neon --client cline --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
    ```

</TabItem>
</Tabs>

For more, see [Get started with Cline and Neon Postgres MCP Server](/guides/cline-mcp-neon).

## Other MCP Clients

Adapt the instructions above for other clients like `witsy` or `enconvo`.

-   **For Remote Setup:** Manually add the remote server JSON block to the client's configuration file.
-   **For Local Setup:** Use the Smithery command:
    ```bash
    npx -y @smithery/cli@latest install neon --client <client_name> --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
    ```
    Replace `<client_name>` and `YOUR_NEON_API_KEY`.

## Manual Configuration

If your client requires manual setup:

#### Remote Hosted Server

Add this OS-independent configuration to your client's `mcpServers`:

```json
"neon": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
}
```
Then follow the OAuth flow on first connection.

#### Local Server

If your MCP client is not listed here, you can manually add the Neon MCP Server details to your client's `mcp_config` file.  The specific configuration varies slightly depending on your operating system.

<Tabs labels={["MacOS/Linux", "Windows", "Windows (WSL)"]}>

<TabItem>

For **MacOS and Linux**, add the following JSON configuration within the `mcpServers` section of your client's `mcp_config` file, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key:

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
}
```

</TabItem>

<TabItem>

For **Windows**, add the following JSON configuration within the `mcpServers` section of your client's `mcp_config` file, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key:

```json
"neon": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
}
```

</TabItem>

<TabItem>

For **Windows Subsystem for Linux (WSL)**, add the following JSON configuration within the `mcpServers` section of your client's `mcp_config` file, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key:

```json
"neon": {
  "command": "wsl",
  "args": ["npx", "-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
}
```

</TabItem>

</Tabs>

Replace `<YOUR_NEON_API_KEY>` with your Neon API key.

<Admonition type="note">
After successful configuration, you should see the Neon MCP Server listed as active in your MCP client's settings or tool list. You can enter "List my Neon projects" in the MCP client to see your Neon projects and verify the connection.
</Admonition>

## Next Steps

Once connected, you can start interacting with your Neon Postgres databases using natural language commands within your chosen MCP client. Explore the [Supported Actions (Tools)](/docs/ai/neon-mcp-server#supported-actions-tools) of the Neon MCP Server to understand the available functionalities.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
