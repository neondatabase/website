---
title: Connect MCP clients to Neon
subtitle: Learn how to connect MCP clients such as Cursor, Claude Code, VS Code,
  ChatGPT, and other tools to your Neon Postgres database.
summary: >-
  Covers the setup of connecting MCP clients like Cursor, Claude Code, and VS
  Code to the Neon Postgres database, including quick setup, OAuth
  authentication, and local server options.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.729Z'
---

This guide covers connecting MCP clients to the Neon MCP Server for natural language interaction with your Neon Postgres databases.

<Admonition type="important" title="Security">
The Neon MCP Server is intended for **development and testing only**. Always review LLM-requested actions before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Quick setup (Cursor, VS Code, Claude Code)

The fastest way to get started:

```bash
npx neonctl@latest init
```

This installs the MCP server for all your projects with API key-based authentication so you can skip OAuth windows. It also adds the VS Code extension for editors that support it and adds Neon's [agent skills](https://github.com/neondatabase/agent-skills) to help agents use Neon the right way. Then restart and ask your AI assistant **"Get started with Neon"**.

If you only want the MCP server and nothing else, use:

```bash
npx add-mcp https://mcp.neon.tech/mcp
```

This adds the MCP config to your editor's configuration files. Add `-g` for global (user-level) setup instead of project-level. Restart your editor (or enable the MCP server in your editor's settings); when you use the connection, an OAuth window will open to authorize. For API key authentication, add `--header "Authorization: Bearer $NEON_API_KEY"`. For more options, see the [add-mcp repository](https://github.com/neondatabase/add-mcp).

## Setup options

- **Quick Setup:** Cursor, Claude Code, and VS Code support automatic setup with `npx neonctl@latest init` (MCP server with API key auth, VS Code extension where supported, and agent skills)
- **OAuth:** Connect to Neon's remote MCP server (no local installation needed)
- **Local:** Run the MCP server locally with your API key (requires Node.js >= v18)

For Local setup, you'll need a [Neon API key](/docs/manage/api-keys#creating-api-keys).

## Cursor

<Tabs labels={["Quick Setup", "OAuth", "Local"]}>
<TabItem>

Run the [init](/docs/reference/cli-init) command:

```bash
npx neonctl@latest init
```

Authenticates via OAuth, creates an API key, installs the [Neon extension](/docs/local/vscode-extension) (which includes the MCP Server), and installs [agent skills](https://github.com/neondatabase/agent-skills). Then ask your AI assistant **"Get started with Neon"**.

</TabItem>
<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a cursor
```

Restart Cursor (or enable the MCP server in settings). When the OAuth window opens, click **Authorize** to complete the connection.

</TabItem>
<TabItem>

1.  Open Cursor. Create a `.cursor` directory in your project root if needed.
2.  Create or open the `mcp.json` file in the `.cursor` directory.
3.  Add the "Neon" server entry within the `mcpServers` object. Replace `<YOUR_NEON_API_KEY>` with your Neon API key:

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

4.  Save the configuration file. Cursor may detect the change or require a restart.

</TabItem>
</Tabs>

For more, see [Get started with Cursor and Neon Postgres MCP Server](/guides/cursor-mcp-neon).

## Claude Code

<Tabs labels={["Quick Setup", "OAuth", "Local"]}>
<TabItem>

Run the [init](/docs/reference/cli-init) command:

```bash
npx neonctl@latest init
```

Authenticates via OAuth, creates an API key, configures the MCP Server in `~/.claude.json`, and installs [agent skills](https://github.com/neondatabase/agent-skills). Then ask your AI assistant **"Get started with Neon"**.

</TabItem>

<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a claude-code
```

Restart Claude Code (or enable the MCP server in settings). When the OAuth window opens, click **Authorize** to complete the connection.

</TabItem>

<TabItem>

```bash
claude mcp add neon -- npx -y @neondatabase/mcp-server-neon start "<YOUR_NEON_API_KEY>"
```

Replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys).

</TabItem>
</Tabs>

For more, see [Get started with Claude Code and Neon Postgres MCP Server](/guides/claude-code-mcp-neon).

## VS Code (with GitHub Copilot)

<Admonition type="note">
To use MCP servers with VS Code, you need [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions installed
</Admonition>

<Tabs labels={["Quick Setup", "OAuth", "Local"]}>
<TabItem>

Run the [init](/docs/reference/cli-init) command:

```bash
npx neonctl@latest init
```

Authenticates via OAuth, creates an API key, installs the [Neon extension](/docs/local/vscode-extension) (which includes the MCP Server), and installs [agent skills](https://github.com/neondatabase/agent-skills). Then ask your AI assistant **"Get started with Neon"**.

</TabItem>

<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a vscode
```

Restart VS Code (or enable the MCP server in settings). When the OAuth window opens, click **Authorize** to complete the connection. Then open GitHub Copilot Chat and [switch to Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

</TabItem>

<TabItem>

Add the Neon MCP server to your [User Settings (JSON)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server-to-your-user-settings):

```json
{
  "mcp": {
    "servers": {
      "neon": {
        "command": "npx",
        "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
      }
    }
  }
}
```

Replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys). Then open GitHub Copilot Chat and [switch to Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

</TabItem>

</Tabs>

For a detailed guide including an Azure Function REST API example, see [Using Neon MCP Server with GitHub Copilot in VS Code](/guides/neon-mcp-server-github-copilot-vs-code).

## ChatGPT

Connect ChatGPT to Neon using custom MCP connectors. Enable Developer mode, add the Neon connector, then enable it per chat.

![ChatGPT with Neon MCP Server](/docs/changelog/chatgpt_mcp.png)

1. **Add MCP server to ChatGPT**

   In your ChatGPT account settings, go to **Settings** → **Connectors** → **Advanced Settings** and enable **Developer mode**.

   Still on the Connectors tab, you can then **create** a Neon connection from the **Browse connectors** section. Use the following URL:

   ```bash
   https://mcp.neon.tech/mcp
   ```

   Make sure you choose **OAuth** for authentication and check "I trust this application", then complete the authorization flow when prompted.

   <div style={{display: 'flex', gap: '0.5rem', margin: '1rem 0'}}>
     <div style={{flex: 1}}>
       ![ChatGPT connector configuration](/docs/ai/chatgpt_mcp_add_connector.png)
     </div>
     <div style={{flex: 1}}>
       ![ChatGPT with Neon MCP tools enabled](/docs/ai/chatgpt_mcp_tools.png)
     </div>
   </div>

2. **Enable Neon per chat**

   In each chat where you want to use Neon, click the **+** button and enable Developer Mode for that chat. Under **Add sources**, you can then enable the Neon connector you just created.

   Once connected, you can use natural language to manage your Neon databases directly in ChatGPT.

## Claude Desktop

<Tabs labels={["OAuth", "Local"]}>

<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a claude-desktop
```

Restart Claude Desktop. When the OAuth window opens, click **Authorize** to complete the connection.

</TabItem>

<TabItem>

```bash
npx @neondatabase/mcp-server-neon init <YOUR_NEON_API_KEY>
```

Replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys), then restart Claude Desktop.

</TabItem>
</Tabs>

For more, see [Get started with Neon MCP server with Claude Desktop](/guides/neon-mcp-server).

## Cline (VS Code Extension)

<Tabs labels={["OAuth", "Local"]}>
<TabItem>

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Click **MCP Servers** Icon -> **Installed** -> **Configure MCP Servers** to open the configuration file.
3. Add the "Neon" server entry within the `mcpServers` object:

   ```json
   {
     "mcpServers": {
       "neon": {
         "command": "npx",
         "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
       }
     }
   }
   ```

4. Save the file. Cline should reload the configuration automatically.
5. When the OAuth window opens in your browser, review the requested permissions and click **Authorize** to complete the connection.

</TabItem>
<TabItem>

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Click **MCP Servers** Icon -> **Installed** -> **Configure MCP Servers** to open the configuration file.
3. Add the "Neon" server entry within the `mcpServers` object:

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

   > Replace `<YOUR_NEON_API_KEY>` with your Neon API key.

4. Save the file. Cline should reload the configuration automatically.

</TabItem>
</Tabs>

For more, see [Get started with Cline and Neon Postgres MCP Server](/guides/cline-mcp-neon).

## Windsurf (Codeium)

<Tabs labels={["OAuth", "Local"]}>
<TabItem>

1.  Open Windsurf and navigate to the Cascade assistant sidebar.
2.  Click the hammer (MCP) icon, then **Configure** which opens up the "Manage MCPs" configuration file.
3.  Click on "View raw config" to open the raw configuration file in Windsurf.
4.  Add the "Neon" server entry within the `mcpServers` object:

    ```json
    {
      "mcpServers": {
        "neon": {
          "command": "npx",
          "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
        }
      }
    }
    ```

5.  Save the file.
6.  Click the **Refresh** button in the Cascade sidebar next to "available MCP servers".
7.  When the OAuth window opens in your browser, review the requested permissions and click **Authorize** to complete the connection.

</TabItem>
<TabItem>

1.  Open Windsurf and navigate to the Cascade assistant sidebar.
2.  Click the hammer (MCP) icon, then **Configure** which opens up the "Manage MCPs" configuration file.
3.  Click on "View raw config" to open the raw configuration file in Windsurf.
4.  Add the "Neon" server entry within the `mcpServers` object:

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

    > Replace `<YOUR_NEON_API_KEY>` with your Neon API key.

5.  Save the file.
6.  Click the **Refresh** button in the Cascade sidebar next to "available MCP servers".

</TabItem>
</Tabs>

For more, see [Get started with Windsurf and Neon Postgres MCP Server](/guides/windsurf-mcp-neon).

## Zed

<Admonition type="note">
MCP support in Zed is currently in **preview**. Ensure you're using the Preview version of Zed to add MCP servers (called **Context Servers** in Zed). Download the preview version from [zed.dev/releases/preview](https://zed.dev/releases/preview).
</Admonition>

<Tabs labels={["OAuth", "Local"]}>
<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a zed
```

Restart Zed (or enable the MCP server in settings). When the OAuth window opens, click **Authorize** to complete the connection.

</TabItem>

<TabItem>

1. Open the Zed Preview application.
2. Click the Assistant (✨) icon, then **Settings** > **Context Servers** > **+ Add Context Server**.
3. Enter **neon** as the name and this command:

   ```bash
   npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
   ```

4. Replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys) and click **Add Server**.

</TabItem>
</Tabs>

For more details, including workflow examples and troubleshooting, see [Get started with Zed and Neon Postgres MCP Server](/guides/zed-mcp-neon).

## Other MCP clients

For Cursor, VS Code, and Claude Code, use `npx neonctl@latest init` as the preferred setup (see [Quick setup](#quick-setup-cursor-vs-code-claude-code) above). For other clients, or if you only want the MCP server, use **add-mcp**:

```bash
npx add-mcp https://mcp.neon.tech/mcp
```

This tool auto-detects supported clients and configures them. Use `-a <agent>` to target a specific agent (e.g., `-a cursor`). Add `-g` for global (user-level) setup instead of project-level. For more options (including global vs project-level), see the [add-mcp repository](https://github.com/neondatabase/add-mcp). For manual configuration, add one of these to your client's `mcpServers` section:

**OAuth (remote server):**

```json
"neon": {
  "command": "npx",
  "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
}
```

**Local setup:**

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
}
```

For Windows-specific configurations, see [Local MCP Server](/docs/ai/neon-mcp-server#other-setup-options).

## Troubleshooting

### Configuration Issues

If your client does not use `JSON` for configuration of MCP servers (such as older versions of Cursor), you can use the following command when prompted:

```bash
# For OAuth (remote server)
npx -y mcp-remote https://mcp.neon.tech/mcp

# For Local setup
npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
```

<Admonition type="note">
For clients that don't support Streamable HTTP, you can use the deprecated SSE endpoint: `https://mcp.neon.tech/sse`. SSE is not supported with API key authentication.
</Admonition>

### OAuth Authentication Errors

When using the remote MCP server with OAuth authentication, you might encounter the following error:

```
{"code":"invalid_request","error":"invalid redirect uri"}
```

This typically occurs when there are issues with cached OAuth credentials. To resolve this:

1. Remove the MCP authentication cache directory:
   ```bash
   rm -rf ~/.mcp-auth
   ```
2. Restart your MCP client application
3. The OAuth flow will start fresh, allowing you to properly authenticate

This error is most common when using OAuth authentication and can occur after OAuth configuration changes or when cached credentials become invalid.

## Next steps

Once connected, explore the [available MCP tools](/docs/ai/neon-mcp-server#supported-actions-tools) to see what you can do with natural language.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)
- [VS Code MCP Server Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

<NeedHelp/>
