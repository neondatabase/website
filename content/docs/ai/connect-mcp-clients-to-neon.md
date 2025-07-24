---
title: Connect MCP Clients to Neon
subtitle: Learn how to connect MCP clients such as Cursor, Claude Desktop, Cline,
  Windsurf, Zed, and VS Code to your Neon Postgres database.
enableTableOfContents: true
updatedOn: '2025-07-22T14:31:49.925Z'
---

The **Neon MCP Server** allows you to connect various [**Model Context Protocol (MCP)**](https://modelcontextprotocol.org) compatible AI tools to your Neon Postgres databases. This guide provides instructions for connecting popular MCP clients to the Neon MCP Server, enabling natural language interaction with your Neon projects.

This guide covers the setup for the following MCP Clients:

- [Claude Desktop](#claude-desktop)
- [Claude Code](#claude-code)
- [Cursor](#cursor)
- [Windsurf (Codeium)](#windsurf-codeium)
- [Cline (VS Code extension)](#cline-vs-code-extension)
- [Zed](#zed)
- [VS Code (with GitHub Copilot)](#vs-code-with-github-copilot)

By connecting these tools to the Neon MCP Server, you can manage your Neon projects, databases, and schemas using natural language commands within the MCP client interface.

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.

The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.

For more information, see [MCP security guidance →](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Prerequisites

- An MCP Client application.
- A [Neon account](https://console.neon.tech/signup).
- **Node.js (>= v18.0.0) and npm:** Download from [nodejs.org](https://nodejs.org).

For Local MCP Server setup, you also need a Neon API key. See [Neon API Keys documentation](/docs/manage/api-keys#creating-api-keys).

<Admonition type="note">
Ensure you are using the latest version of your chosen MCP client as MCP integration may not be available in older versions. If you are using an older version, update your MCP client to the latest version.
</Admonition>

## Connect to Neon MCP Server

You can connect to Neon MCP Server in two ways:

1.  **Remote MCP Server (Preview):** Connect to Neon's managed remote MCP server using OAuth or a Neon API key.
2.  **Local MCP Server:** Install and run the Neon MCP server locally, using a Neon API key.

## Claude Desktop

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>

<TabItem>

1. Open Claude desktop and navigate to **Settings**.
2. Under the **Developer** tab, click **Edit Config** (On Windows, it's under File -> Settings -> Developer -> Edit Config) to open the configuration file (`claude_desktop_config.json`).
3. Add the "Neon" server entry within the `mcpServers` object:

   ```json
   {
     "mcpServers": {
       "Neon": {
         "command": "npx",
         "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/sse"]
       }
     }
   }
   ```

   > For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

4. Save the configuration file and **restart** Claude Desktop.
5. An OAuth window will open in your browser. Follow the prompts to authorize Claude Desktop to access your Neon account.

> If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

</TabItem>

<TabItem>

1.  Open your terminal.
2.  Run the following command, replacing `YOUR_NEON_API_KEY` with your actual Neon API key:

    ```bash
    npx @neondatabase/mcp-server-neon init YOUR_NEON_API_KEY
    ```

3.  Restart Claude Desktop.

</TabItem>
</Tabs>

For more, see [Get started with Neon MCP server with Claude Desktop](/guides/neon-mcp-server).

## Claude Code

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>

<TabItem>

1. Ensure you have Claude Code installed. Visit [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code) for installation instructions.
2. Open terminal and add Neon MCP with
   ```sh
   claude mcp add --transport http neon https://mcp.neon.tech/mcp
   ```
3. Start a new session of `claude` to trigger OAuth authentication flow
4. You can also trigger authentication with `/mcp` within Claude Code.

<br />

If you prefer to authenticate using a Neon API key, provide `Authorization` header to `mcp add` command:

```
claude mcp add --transport http neon https://mcp.neon.tech/mcp \
    --header "Authorization: Bearer <YOUR_NEON_API_KEY>"
```

> Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section

</TabItem>

<TabItem>

1. Ensure you have Claude Code installed. Visit [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code) for installation instructions.
2. Open terminal and add Neon MCP with

   ```sh
   claude mcp add neon -- npx -y @neondatabase/mcp-server-neon start "<YOUR_NEON_API_KEY"
   ```

   > Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section

3. Start new Claude Code session with `claude` command and start using Neon MCP

</TabItem>
</Tabs>

## Cursor

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

### Quick Install (Recommended)

Click the button below to install the Neon MCP server in Cursor. When prompted, click **Install** within Cursor.

<a href="cursor://anysphere.cursor-deeplink/mcp/install?name=Neon&config=eyJ1cmwiOiJodHRwczovL21jcC5uZW9uLnRlY2gvc3NlIn0%3D"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add Neon MCP server to Cursor" height="32" /></a>

### Manual Setup

1.  Open Cursor. Create a `.cursor` directory in your project root if needed.
2.  Create or open the `mcp.json` file in the `.cursor` directory.
3.  Add the "Neon" server entry within the `mcpServers` object:

    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/sse"]
        }
      }
    }
    ```

    > For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

4.  Save the configuration file. Cursor may detect the change or require a restart.
5.  An OAuth window will open in your browser. Follow the prompts to authorize Cursor to access your Neon account.

> If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

</TabItem>
<TabItem>

1.  Open Cursor. Create a `.cursor` directory in your project root if needed.
2.  Create or open the `mcp.json` file in the `.cursor` directory.
3.  Add the "Neon" server entry within the `mcpServers` object. Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section:
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
4.  Save the configuration file. Cursor may detect the change or require a restart.

</TabItem>
</Tabs>

For more, see [Get started with Cursor and Neon Postgres MCP Server](/guides/cursor-mcp-neon).

## Windsurf (Codeium)

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1.  Open Windsurf and navigate to the Cascade assistant sidebar.
2.  Click the hammer (MCP) icon, then **Configure** which opens up the "Manage MCPs" configuration file.
3.  Click on "View raw config" to open the raw configuration file in Windsurf.
4.  Add the "Neon" server entry within the `mcpServers` object:

    ```json
    {
      "mcpServers": {
        "Neon": {
          "command": "npx",
          "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/sse"]
        }
      }
    }
    ```

    > For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

4.  Save the file.
5.  Click the **Refresh** button in the Cascade sidebar next to "available MCP servers".
6.  An OAuth window will open in your browser. Follow the prompts to authorize Windsurf to access your Neon account.

> If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

</TabItem>
<TabItem>

1.  Open Windsurf and navigate to the Cascade assistant sidebar.
2.  Click the hammer (MCP) icon, then **Configure** which opens up the "Manage MCPs" configuration file.
3.  Click on "View raw config" to open the raw configuration file in Windsurf.
4.  Add the "Neon" server entry within the `mcpServers` object:

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

    > Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section.

4.  Save the file.
5.  Click the **Refresh** button in the Cascade sidebar next to "available MCP servers".

</TabItem>
</Tabs>

For more, see [Get started with Windsurf and Neon Postgres MCP Server](/guides/windsurf-mcp-neon).

## Cline (VS Code Extension)

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Click **MCP Servers** Icon -> **Installed** -> **Configure MCP Servers** to open the configuration file.
3. Add the "Neon" server entry within the `mcpServers` object:
   ```json
   {
     "mcpServers": {
       "Neon": {
         "command": "npx",
         "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/sse"]
       }
     }
   }
   ```

> For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

4. Save the file. Cline should reload the configuration automatically.
5. An OAuth window will open in your browser. Follow the prompts to authorize Cline to access your Neon account.

> If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

</TabItem>
<TabItem>

1. Open Cline in VS Code (Sidebar -> Cline icon).
2. Click **MCP Servers** Icon -> **Installed** -> **Configure MCP Servers** to open the configuration file.
3. Add the "Neon" server entry within the `mcpServers` object:
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

    > Replace `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained from the [prerequisites](#prerequisites) section.

4. Save the file. Cline should reload the configuration automatically.

</TabItem>
</Tabs>

For more, see [Get started with Cline and Neon Postgres MCP Server](/guides/cline-mcp-neon).

## Zed

<Admonition type="note">
MCP support in Zed is currently in **preview**. Ensure you're using the Preview version of Zed to add MCP servers (called **Context Servers** in Zed). Download the preview version from [zed.dev/releases/preview](https://zed.dev/releases/preview).
</Admonition>

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1. Open the Zed Preview application.
2. Click the Assistant (✨) icon in the bottom right corner.
3. Click **Settings** in the top right panel of the Assistant.
4. In the **Context Servers** section, click **+ Add Context Server**.
5. Configure the Neon Server:
   - Enter **Neon** in the **Name** field.
   - In the **Command** field, enter:
     ```bash
     npx -y mcp-remote https://mcp.neon.tech/sse
     ```
   - Click **Add Server**.

   > For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

6. An OAuth window will open in your browser. Follow the prompts to authorize Zed to access your Neon account.
7. Check the Context Servers section in Zed settings to ensure the connection is successful. "Neon" should be listed.

> If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

</TabItem>

<TabItem>

1. Open the Zed Preview application.
2. Click the Assistant (✨) icon in the bottom right corner.
3. Click **Settings** in the top right panel of the Assistant.
4. In the **Context Servers** section, click **+ Add Context Server**.
5. Configure the Neon Server:
   - Enter **Neon** in the **Name** field.
   - In the **Command** field, enter the following, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key obtained from the [prerequisites](#prerequisites) section:
     ```bash
     npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
     ```
   - Click **Add Server**.
6. Check the Context Servers section in Zed settings to ensure the connection is successful. "Neon" should be listed.

</TabItem>
</Tabs>

For more details, including workflow examples and troubleshooting, see [Get started with Zed and Neon Postgres MCP Server](/guides/zed-mcp-neon).

## VS Code (with GitHub Copilot)

<Admonition type="note">
To use MCP servers with VS Code, you need [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions installed
</Admonition>

<Tabs labels={["Remote MCP Server", "Local MCP Server"]}>
<TabItem>

1.  Open VS Code.
2.  Open your [User Settings (JSON) file](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server-to-your-user-settings): Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for "Preferences: Open User Settings (JSON)".
3.  Add the Neon MCP server configuration to your `settings.json` file. If the `"mcp.servers"` object doesn't exist, create it:

    ```json
    {
      // ... your other settings ...
      "mcp": {
        "servers": {
          "Neon": {
            "command": "npx",
            "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/sse"]
          }
        }
      }
      // ...
    }
    ```

    > For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

4.  Save the `settings.json` file.
5.  Click on Start on the MCP server.
6.  An OAuth window will open in your browser. Follow the prompts to authorize VS Code (GitHub Copilot) to access your Neon account.
7.  Once authorized, you can now open GitHub Copilot Chat in VS Code and [switch to Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode). You will see the Neon MCP Server listed among the available tools.

> If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

</TabItem>

<TabItem>

1.  Open VS Code.
2.  Open your [User Settings (JSON) file](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server-to-your-user-settings): Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for "Preferences: Open User Settings (JSON)".
3.  Add the Neon MCP server configuration to your `settings.json` file. If the `"mcp.servers"` object doesn't exist, create it:

    ```json
    {
      // ... your other settings ...
      "mcp": {
        "servers": {
          "Neon": {
            "command": "npx",
            "args": ["-y", "@neondatabase/mcp-server-neon", "start", "<YOUR_NEON_API_KEY>"]
          }
        }
      }
      // ...
    }
    ```

4.  Save the `settings.json` file.
5.  Click on Start on the MCP server.
6.  You can now open GitHub Copilot Chat in VS Code and [switch to Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode). You will see the Neon MCP Server listed among the available tools.

</TabItem>

</Tabs>

For detailed instructions on utilizing the Neon MCP server with GitHub Copilot in VS Code, including a step-by-step example on generating an Azure Function REST API, refer to [How to Use Neon MCP Server with GitHub Copilot in VS Code](/guides/neon-mcp-server-github-copilot-vs-code).

## Other MCP clients

Adapt the instructions above for other clients:

- **Remote MCP server:**
  Add the following JSON configuration within the `mcpServers` section of your client's `MCP` configuration file:

  ```json
  "neon": {
    "command": "npx",
    "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/sse"]
  }
  ```

  > For [streamable HTTP responses](#streamable-http-support) instead of SSE, you can specify the `https://mcp.neon.tech/mcp` endpoint instead of `https://mcp.neon.tech/sse`.

  Then follow the OAuth flow on first connection.

  > If you prefer to authenticate using a Neon API key, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).

- **Local MCP server:** 

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

## Troubleshooting

### Configuration Issues

If your client does not use `JSON` for configuration of MCP servers (such as older versions of Cursor), you can use the following command when prompted:

```bash
# For Remote MCP server
npx -y mcp-remote https://mcp.neon.tech/sse

# For Local MCP server
npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
```

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

This error is most common when using the remote MCP server option and can occur after OAuth configuration changes or when cached credentials become invalid.

## Next steps

Once connected, you can start interacting with your Neon Postgres databases using natural language commands within your chosen MCP client. Explore the [Supported Actions (Tools)](/docs/ai/neon-mcp-server#supported-actions-tools) of the Neon MCP Server to understand the available functionalities.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)
- [VS Code MCP Server Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

<NeedHelp/>
