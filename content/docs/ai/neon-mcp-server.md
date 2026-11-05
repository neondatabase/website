---
title: Neon MCP Server overview
subtitle: Connect your AI assistant to Neon to manage projects, run queries, and make schema changes
summary: >-
  The Neon MCP Server implements the Model Context Protocol (MCP), letting AI
  assistants interact with your Neon projects on your behalf. Set up with
  `npx neon@latest mcp` or use the config generator. Supports OAuth and API key auth.
enableTableOfContents: true
redirectFrom:
  - /docs/ai/mcp
updatedOn: '2026-11-05T13:53:34.719Z'
---

The Neon MCP Server implements the Model Context Protocol (MCP), letting AI assistants interact with your Neon projects on your behalf. Your AI agent can interact with Neon via MCP tools or by running [Neon CLI](/docs/cli) commands directly.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. **Always review and authorize actions requested by the LLM before execution.** Restrict access to trusted users only. See [MCP security guidance](#mcp-security-guidance).
</Admonition>

## Quick setup

To set up the Neon MCP Server in your agent, follow [Set up your AI agent](/docs/ai/agent-setup). For most coding agents, the Neon plugin installs the MCP Server together with Neon's agent skills. To install only the MCP Server, run [`neon mcp`](/docs/cli/mcp):

```bash
npx neon@latest mcp
```

It prompts for where to write the config, which agents to install into, and how to authenticate, then writes it for you. For CI or headless agents, run `neon mcp -y --agent <agent> --api-key <key>`. The CLI signs in with that key and mints a new one for the MCP Server. Or use the API key option in the [config generator](#config-generator).

## Config generator

Use the generator to build an MCP config for your editor and auth method, including the `Authorization` header for API key or remote agent setups.

<McpSetupConfigurator />

If you'd rather write the config by hand, most clients accept this format. With OAuth, your client opens a browser to authorize on first use:

<CodeTabs labels={["OAuth", "API key"]}>

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

```json
{
  "mcpServers": {
    "Neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <NEON_API_KEY>"
      }
    }
  }
}
```

</CodeTabs>

Add [access control](#access-control) parameters to the `url` as needed.

## Claude connector

The Neon MCP Server is an official Claude connector for Claude.ai and Claude Desktop. See [Set up Neon in Claude.ai and Claude Desktop](/docs/ai/agent-setup/claude-ai).

## Access control

The Neon MCP Server supports URL parameters to restrict scope and permissions. Append them to the MCP URL (`https://mcp.neon.tech/mcp`).

### Read-only mode

Append `?readonly=true` to restrict the server to read operations:

```
https://mcp.neon.tech/mcp?readonly=true
```

`SELECT` queries and schema inspection remain available. Write operations (creating branches, running migrations, modifying auth config) are disabled. `run_sql_transaction` and `get_connection_string` aren't available in read-only mode; use `run_sql` for read queries.

With OAuth, you can also choose read-only scope during the authorization flow instead of using the URL parameter.

### Project-scoped mode

Scope all operations to a single project:

```
https://mcp.neon.tech/mcp?projectId=<your-project-id>
```

Cross-project search and navigation are disabled in this mode, and project management tools such as `list_projects` and `create_project` are hidden.

### Category filtering

Restrict active tools to specific categories using `?category=<name>` (repeatable):

```
https://mcp.neon.tech/mcp?category=querying&category=schema
```

See [Available tools](#available-tools) for the full category list. To verify which tools are active for a given config without authenticating:

```bash
curl "https://mcp.neon.tech/api/list-tools?readonly=true&category=querying"
```

### Postgres role

By default, SQL tools connect as the database owner. Set `?roleName=<role>` to make every SQL tool log in as that Postgres role instead, so the role's grants decide what the agent can read and change:

```
https://mcp.neon.tech/mcp?readonly=true&roleName=app_reader
```

The role must exist on each branch you query and be able to log in. For example, a role that can only read one table:

```sql
CREATE ROLE app_reader LOGIN PASSWORD '<password>';
GRANT SELECT ON public.orders TO app_reader;
```

Create the role with SQL, as shown above, or create a read-only or read-write role with [`neon roles create --access`](/docs/cli/roles#create). Roles created in the Neon Console or API, and roles created with the CLI or MCP Server without an access level, are members of [`neon_superuser`](/docs/manage/roles#the-neonsuperuser-role), which can read all data, so pinning one of those roles doesn't limit what the agent can read. See [Manage database access](/docs/manage/database-access) for least-privilege role examples.

- `role_name` arguments that name a different role are rejected, and a role that cannot log in fails the call without falling back to the owner.
- `get_connection_string` is not available on a pinned connection.
- The role applies to SQL only. Combine it with `readonly=true` and `category` to limit Management API tools too.
- With OAuth, `roleName` on the URL is fixed when you authorize. With the plain `https://mcp.neon.tech/mcp` URL, enter the role in the optional **Postgres role** field on the authorization page instead.

## MCP security guidance

We recommend MCP for **development and testing only**, not production environments.

- Use MCP only for local development or IDE-based workflows
- Never connect MCP agents to production databases
- Avoid exposing production or PII data; use anonymized data only
- Always review and authorize LLM-requested actions before execution
- Restrict MCP access to trusted users and regularly audit access

To limit what an agent can do, combine [read-only mode](#read-only-mode), a [Postgres role](#postgres-role) with limited grants, and [category filtering](#category-filtering).

### Allowlist IP addresses

The hosted Neon MCP Server (`mcp.neon.tech`) connects to your Neon databases from the following static IP addresses:

- `34.192.103.46`
- `23.22.233.166`

If [IP Allow](/docs/introduction/ip-allow) is enabled on your project, add these addresses to your allowlist so the MCP server can connect.

## Database diagnostics

When you ask why a branch is slow, large, or behind, the MCP server can run `inspect_database` instead of inventing catalog SQL. It exposes the same 15 read-only checks as [`neon inspect db`](/docs/cli/inspect): table and index sizes, unused indexes, sequential scans, long-running and stalled queries and locks, heavy and frequent statements, cache hit rate and working set, autovacuum and bloat, and replication state. The `stalled-queries` check reports active queries running longer than 30 seconds, with their waits, blockers, parallel workers, query IDs, and query text.

Pick a check with the `check` parameter (for example `table-sizes` or `unused-indexes`). The tool runs inside a read-only transaction, so it works with [`?readonly=true`](#read-only-mode). It belongs to the `querying` category, not `observability`. Some checks need [`pg_stat_statements`](/docs/extensions/pg_stat_statements) or the [`neon`](/docs/extensions/neon) extension; the tool reports that and asks before suggesting installation.

<MCPTools />

## Legacy transports

### Deprecated local stdio (#deprecated-stdio)

<Admonition type="important">
The local stdio package (`@neondatabase/mcp-server-neon`) is deprecated. Use the hosted server at `https://mcp.neon.tech/mcp`.

If your client only supports local stdio servers, put one of these in the client config so [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridges to Streamable HTTP.

**OAuth:**

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

**API key:**

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

</Admonition>

### Retired HTTP+SSE transport (#retired-sse)

<Admonition type="important">
The hosted Neon MCP Server uses Streamable HTTP at `https://mcp.neon.tech/mcp`. The older HTTP+SSE endpoints (`https://mcp.neon.tech/sse` and `/message`) are retired and return `410 Gone`.

If your client still points at `/sse`, change the URL to `https://mcp.neon.tech/mcp`. If your client only supports local stdio servers, bridge to Streamable HTTP with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

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

</Admonition>

## Troubleshooting

### Client still points at the SSE endpoint

The HTTP+SSE endpoints (`https://mcp.neon.tech/sse` and `/message`) are retired and return `410 Gone`. Point your client at `https://mcp.neon.tech/mcp` instead. See [Retired HTTP+SSE transport](#retired-sse).

### Client doesn't support remote servers

If your client only supports local (stdio) servers, bridge to the hosted server with `mcp-remote`. See [Deprecated local stdio](#deprecated-stdio).

### OAuth error: invalid redirect uri

When you use OAuth with the hosted server, you might see this error:

```json
{"code":"invalid_request","error":"invalid redirect uri"}
```

This typically means the cached OAuth credentials are stale. To fix it:

1. Remove the MCP authentication cache directory:
   ```bash
   rm -rf ~/.mcp-auth
   ```
2. Restart your MCP client.
3. Sign in again when the OAuth flow starts.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](/docs/reference/api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
