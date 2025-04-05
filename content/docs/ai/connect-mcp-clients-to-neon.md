---
title: Connect MCP Clients to Neon
subtitle: Learn how to connect MCP clients such as Cursor, Claude Desktop, Cline, and
  Windsurf to your Neon Postgres database.
enableTableOfContents: true
updatedOn: '2025-03-07T21:52:34.652Z'
---

The **Neon MCP Server** allows you to connect various [**Model Context Protocol (MCP)**](https://modelcontextprotocol.org) compatible AI tools to your Neon Postgres databases. This guide provides instructions for connecting popular MCP clients to the Neon MCP Server, enabling natural language interaction with your Neon projects.

Neon offers two options for using the MCP Server:

1. **Remote MCP Server (Preview)**: A hosted version that requires no API keys or local setup
2. **Local MCP Server**: A self-hosted version that runs on your machine

This guide covers the setup for the following MCP Clients:

- [Claude Desktop](#claude-desktop)
- [Cursor](#cursor)
- [Windsurf (Codeium)](#windsurf-codeium)
- [Cline (VS Code extension)](#cline-vs-code-extension)

By connecting these tools to the Neon MCP Server, you can manage your Neon projects, databases, and schemas using natural language commands within the MCP client interface.

## Remote MCP Server (Preview)

Neon offers a hosted MCP server in the cloud that makes it easier to integrate AI workflows into clients like Cursor, Windsurf, and Claude Desktop—no API keys or local setup required.

You can start using it today by pointing your client to:

```text
https://mcp.neon.tech
```

<Admonition type="note">
The remote MCP server is currently in **preview** while the MCP OAuth spec continues to evolve. Things might change, and we'd love your feedback as we improve.
</Admonition>

Each client has a slightly different configuration process for the remote MCP server. See the client-specific sections below for details.

## Local MCP Server Prerequisites

If you prefer to use the local MCP server, ensure you have:

- **Neon Account and API Key:** You need a Neon account and a Neon API key. Create an API key in your [Neon Console](https://console.neon.tech/app/settings/api-keys). See [Neon API Keys documentation](/docs/manage/api-keys#creating-api-keys) for details.
- **Node.js (>= v18.0.0) and npm:** Ensure Node.js version 18 or later and npm are installed. Download them from [nodejs.org](https://nodejs.org).

<Admonition type="note">
Ensure you are using the latest version of your chosen MCP client as MCP integration may not be available in older versions. If you are using an older version, update your MCP client to the latest version.
</Admonition>

## Claude Desktop

### Remote MCP Server (Preview)

Claude Desktop can connect to Neon's remote MCP server without requiring API keys or local setup:

1. Open Claude Desktop.
2. Go to Settings.
3. Under **MCP Servers**, add:

    ```ini
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
    }
    ```

4. Restart Claude Desktop.

### Local MCP Server

To use the local MCP server with Claude Desktop:

1. Open your terminal.
2. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

    ```bash
    npx -y @smithery/cli install neon --client claude --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
    ```

3. Restart Claude Desktop.

For more, see [Get started with Neon MCP server with Claude Desktop](/guides/neon-mcp-server).

## Cursor

### Remote MCP Server (Preview)

Cursor can connect to Neon's remote MCP server without requiring API keys or local setup:

1. Open Cursor Settings.
2. Under **MCP Servers**, add:

    ```ini
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
    }
    ```

That's it—you're connected to Neon's remote MCP Server.

### Local MCP Server

To use the local MCP server with Cursor:

1. Open Cursor.
2. Open your terminal.
3. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

   ```bash
   npx -y @smithery/cli@latest install neon --client cursor --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
   ```

4. Restart Cursor if necessary.

For more, see [Get started with Cursor and Neon Postgres MCP Server](/guides/cursor-mcp-neon).

## Windsurf (Codeium)

### Remote MCP Server (Preview)

Windsurf can connect to Neon's remote MCP server without requiring API keys or local setup:

1. Open Windsurf Settings.
2. Under **MCP Servers**, add:

    ```ini
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
    }
    ```

3. Click the **Refresh** button in Windsurf Cascade to load the new MCP server.

### Local MCP Server

To use the local MCP server with Windsurf:

1. Open your terminal.
2. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

   ```bash
   npx -y @smithery/cli@latest install neon --client windsurf --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
   ```

3. Click the **Refresh** button in Windsurf Cascade to load the new MCP server.

For more, see [Get started with Windsurf and Neon Postgres MCP Server](/guides/windsurf-mcp-neon).

## Cline (VS Code Extension)

### Remote MCP Server (Preview)

Cline can connect to Neon's remote MCP server without requiring API keys or local setup:

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Open Cline Settings.
3. Under **MCP Servers**, add:

    ```ini
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
    }
    ```

### Local MCP Server

To use the local MCP server with Cline:

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Open your terminal.
3. Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

    ```bash
    npx -y @smithery/cli@latest install neon --client cline --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
    ```

For more, see [Get started with Cline and Neon Postgres MCP Server](/guides/cline-mcp-neon).

## Other MCP Clients

You can connect other MCP clients to the Neon MCP Server by running the following command in your terminal:

```bash
npx -y @smithery/cli@latest install neon --client <client_name> --config "{\"neonApiKey\":\"YOUR_NEON_API_KEY\"}"
```

Replace `<client_name>` with the name of your MCP client application and `YOUR_NEON_API_KEY` with your Neon API key. Supported client names include:

- `witsy` for [Witsy](https://witsyai.com/)
- `enconvo` for [Enconvo](https://www.enconvo.com/)

## Manual configuration

If your MCP client is not listed here or you prefer manual configuration, you can manually add the Neon MCP Server details to your client's `mcp_config` file.  The specific configuration varies slightly depending on your operating system.

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
