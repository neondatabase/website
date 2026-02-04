---
title: Neon MCP Server overview
subtitle: Learn about managing your Neon projects using natural language with Neon MCP
  Server
enableTableOfContents: true
updatedOn: '2026-02-04T14:57:09.216Z'
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

This command will:

- Authenticate via OAuth (opens your browser)
- Create a Neon API key automatically
- For **VS Code and Cursor**: Install the [Neon extension](/docs/local/vscode-extension), which includes the Neon MCP Server
- For **Claude Code**: Configure the Neon MCP Server in `~/.claude.json`
- Install [Neon agent skills](https://github.com/neondatabase/agent-skills) for your selected editor(s)

After running the command, restart your editor and ask your AI assistant to **"Get started with Neon"** to launch the interactive onboarding guide. For more details, see the [neonctl init documentation](/docs/reference/cli-init).

**Need instructions for other editors?** See [Connect MCP clients](/docs/ai/connect-mcp-clients-to-neon) for step-by-step instructions for Windsurf, ChatGPT, Zed, and others.

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

Or add this to your MCP config file:

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

<Admonition type="note">
Use an organization API key to limit access to organization projects only.
</Admonition>

</TabItem>

<TabItem>

Run the MCP server locally on your machine.

**Requires:** Node.js >= v18, [Neon API key](/docs/manage/api-keys)

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
