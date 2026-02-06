---
title: Neon MCP Server overview
subtitle: Learn about managing your Neon projects using natural language with Neon MCP
  Server
summary: >-
  Covers the setup and management of Neon Postgres databases using the Neon MCP
  Server, enabling users to execute commands and make schema changes through
  natural language without coding.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.733Z'
---

The **Neon MCP Server** is an open-source tool that lets you interact with your Neon Postgres databases in **natural language**:

- Manage projects, branches, and databases with conversational commands
- Run SQL queries and make schema changes without writing code
- Use branch-based migrations for safer schema modifications

## Quick setup

The fastest way to set up Neon's MCP Server is with one command:

```bash
npx neonctl@latest init
```

This configures the Neon MCP Server for compatible MCP clients in your workspace (Cursor, VS Code, Claude Code, and others) using API key authentication. See the [neonctl init documentation](/docs/reference/cli-init).

**If you only want the MCP server and nothing else**, use:

```bash
npx add-mcp https://mcp.neon.tech/mcp
```

This command adds the required configuration to your editor's MCP config files; it does not open a browser by itself. Add `-g` for global (user-level) setup instead of project-level. Restart your editor (or enable the MCP server in your editor's settings). When you use the MCP connection, an OAuth window will open in your browser to authorize access to your Neon account. For more options (e.g., global vs project-level), see the [add-mcp repository](https://github.com/neondatabase/add-mcp).

**Other setup options:**

- **API key authentication (remote agents):** For remote agents or when OAuth isn't available:
  ```bash
  npx add-mcp https://mcp.neon.tech/mcp --header "Authorization: Bearer $NEON_API_KEY"
  ```
- **Manual configuration:** See [Connect MCP clients](/docs/ai/connect-mcp-clients-to-neon) for step-by-step instructions for any editor, including Windsurf, ChatGPT, Zed, and others.

After setup, restart your editor and ask your AI assistant to **"Get started with Neon"** to launch the interactive onboarding guide.

---

Imagine you want to create a new database. Instead of using the Neon Console or API, you could just type a request like, "Create a database named 'my-new-database'". Or, to see your projects, you might ask, "List all my Neon projects". The Neon MCP Server makes this possible.

It works by acting as a bridge between natural language requests and the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Built upon the [Model Context Protocol (MCP)](https://modelcontextprotocol.org), it translates your requests into the necessary Neon API calls, allowing you to manage everything from creating projects and branches to running queries and performing database migrations.

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.
</Admonition>

## Other setup options

<Tabs labels={["Remote (OAuth)", "Remote (API Key)", "Local"]}>

<TabItem>

Connect to Neon's managed MCP server using OAuth. No API key configuration needed.

```bash
npx add-mcp https://mcp.neon.tech/mcp
```

Or add this to your MCP config file:

```json
{
  "mcpServers": {
    "neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp"
    }
  }
}
```

<Admonition type="tip" title="One-click install for Cursor">
<a href="cursor://anysphere.cursor-deeplink/mcp/install?name=Neon&config=eyJ1cmwiOiJodHRwczovL21jcC5uZW9uLnRlY2gvbWNwIn0%3D"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add Neon MCP server to Cursor" height="32" /></a>
</Admonition>

After saving, restart your MCP client. When the OAuth window opens in your browser, review the requested permissions and click **Authorize** to complete the connection.

</TabItem>

<TabItem>

Connect using API key authentication. Useful for remote agents where OAuth isn't available.

**Requires:** [Neon API key](/docs/manage/api-keys)

```bash
npx add-mcp https://mcp.neon.tech/mcp --header "Authorization: Bearer <NEON_API_KEY>"
```

#### MCP-only setup (OAuth):

If you only want the MCP server and prefer OAuth, run:

```bash
npx add-mcp https://mcp.neon.tech/mcp
```

The command adds the config to your editor; restart your editor (or enable the MCP server) for it to take effect. When you use the MCP connection, an OAuth window will open in your browser—follow the prompts to authorize. For the recommended quick setup (API key + agent skills), use `npx neonctl@latest init` instead.

<Admonition type="tip" title="Install in a single click for Cursor users">
Click the button below to install the Neon MCP server in Cursor. When prompted, click **Install** within Cursor.

```json
{
  "mcpServers": {
    "neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <$NEON_API_KEY>"
      }
    }
  }
}
```

</Admonition>

<Admonition type="note">
Use an organization API key to limit access to organization projects only.
</Admonition>

#### Manual setup:

1.  Go to your MCP Client's settings where you configure MCP Servers (this varies by client)
2.  Register a new MCP Server. When prompted for the configuration, name the server "Neon" and add the following configuration:

    ```json
    {
      "mcpServers": {
        "Neon": {
          "type": "http",
          "url": "https://mcp.neon.tech/mcp"
        }
      }
    }
    ```

    > MCP supports two remote server transports: the deprecated Server-Sent Events (SSE) and the newer, recommended Streamable HTTP. If your LLM client doesn't support Streamable HTTP yet, you can switch the endpoint from `https://mcp.neon.tech/mcp` to `https://mcp.neon.tech/sse` to use SSE instead.

</TabItem>

<TabItem>

Run the MCP server locally on your machine.

**Requires:** Node.js >= v18, [Neon API key](/docs/manage/api-keys)

```bash
npx add-mcp "npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>" --name neon
```

Or add this to your MCP config file:

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

<Admonition type="note" title="Windows users">

Use `cmd` or `wsl` if you encounter issues:

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

</TabItem>

</Tabs>

### Read-only mode

The Neon MCP Server supports read-only mode for safe operation. Enable it by adding the `x-read-only: true` header:

```json
{
  "mcpServers": {
    "neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "x-read-only": "true"
      }
    }
  }
}
```

When enabled, the server restricts all operations to read-only tools and SQL queries automatically run in read-only transactions. This provides a safe method for querying and analyzing databases without risk of accidental modifications.

### Troubleshooting

If your client does not use JSON for configuration of MCP servers (such as older versions of Cursor), use this command when prompted:

```bash
npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
```

<Admonition type="note">
For clients that don't support Streamable HTTP, you can use the deprecated SSE endpoint: `https://mcp.neon.tech/sse`. SSE is not supported with API key authentication.
</Admonition>

<Admonition type="important" title="Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** The Neon MCP Server is intended for local development and IDE integrations only. For more information, see [MCP security guidance](#mcp-security-guidance).
</Admonition>

<MCPTools />

## Usage examples

After setup, interact with your Neon databases using natural language:

- `"Get started with Neon"` — Launch the interactive onboarding guide
- `"List my Neon projects"`
- `"Create a project named 'my-app'"`
- `"Show tables in database 'main'"`
- `"Search for 'production' across my Neon resources"`
- `"SELECT * FROM users LIMIT 10"`

<Video  
sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]}
width={960}
height={1080}
/>

## MCP security guidance

The Neon MCP server provides powerful database tools. We recommend MCP for **development and testing only**, not production environments.

- Use MCP only for local development or IDE-based workflows
- Never connect MCP agents to production databases
- Avoid exposing production or PII data—use anonymized data only
- Always review and authorize LLM-requested actions before execution
- Restrict MCP access to trusted users and regularly audit access

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
