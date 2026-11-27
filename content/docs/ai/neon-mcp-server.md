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
updatedOn: '2026-11-25T05:19:14.187Z'
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

This page covers the hosted Neon MCP Server, which manages your Neon resources. To give your own application an MCP server that customers connect to, see [Build an MCP server with Managed Better Auth](/docs/compute/functions/mcp-server).

## Access control

The Neon MCP Server supports URL parameters to restrict scope and permissions. Append them to the MCP URL (`https://mcp.neon.tech/mcp`).

### Read-only mode

Append `?readonly=true` to restrict the server to read operations:

```
https://mcp.neon.tech/mcp?readonly=true
```

`SELECT` queries and schema inspection remain available. Write operations (creating branches, running migrations, modifying auth config) are disabled. `run_sql_transaction`, `get_connection_string`, and `call_api` aren't available in read-only mode; use `run_sql` for read queries.

With OAuth, you can also choose read-only scope during the authorization flow instead of using the URL parameter.

### Project-scoped mode

Scope all operations to a single project:

```
https://mcp.neon.tech/mcp?projectId=<your-project-id>
```

Cross-project search and navigation are disabled in this mode, and project management tools such as `list_projects` and `create_project` are hidden.

Project scoping limits what the agent can reach, but it hides only a few tools. To also shorten the tool list, combine it with [category filtering](#category-filtering).

### Category filtering

Restrict active tools to specific categories using `?category=<name>` (repeatable):

```
https://mcp.neon.tech/mcp?category=querying&category=schema
```

See [Available tools](#available-tools) for the full category list. To verify which tools are active for a given config without authenticating:

```bash
curl "https://mcp.neon.tech/api/list-tools?readonly=true&category=querying"
```

Category filtering also saves context. Each tool the server exposes adds its name, description, and input and output schemas to your agent's context, and with every category enabled the server exposes well over a hundred tools. That leaves less room for your conversation and code, and gives the agent more tools to choose between. Enable only the categories your work needs:

| Task                                  | Categories                          |
| ------------------------------------- | ----------------------------------- |
| Write and run SQL, inspect the schema | `querying`, `schema`                |
| Develop on branches                   | `branches`, `endpoints`, `querying` |
| Set up Neon Auth                      | `neon_auth`                         |
| Look up Neon docs                     | `docs`                              |

`neon_auth` has the most tools, so leave it out unless you're working on authentication. Some clients load tool definitions only when the agent needs them. Filtering matters most for clients that load every tool at startup.

### SQL results

`run_sql` and `run_sql_transaction` return up to 100 rows per statement by default. When a result is cut off, the response says how many rows the query returned in total. Set `max_rows` (up to 10,000) to see more. When a query fails, the error includes the Postgres SQLSTATE code, position, detail, and hint, so the assistant can fix the query and try again.

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

### Secrets in tool results

Set `?secrets=<mode>` to choose which secrets tool results show. Hidden values read `***redacted***`.

| Mode              | Tool results show                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setup` (default) | Credentials Neon issues: connection strings, Postgres role passwords, credential tokens, presigned URLs, and the Neon Auth server key, OAuth client and Realtime secrets |
| `all`             | Setup credentials, plus the secrets you stored in Neon Auth: OAuth provider client secrets and the SMTP password                                                         |
| `none`            | No secrets. Tools whose result is only a secret, such as `get_connection_string`, `get_realtime_secret`, and `rotate_credential`, are hidden                             |

```
https://mcp.neon.tech/mcp?secrets=none
```

Secrets a tool returns reach your AI client's model provider and its transcript. Use `none` when the agent doesn't need them, for example when your app already reads its connection string from an environment variable.

- Read-only connections show no secrets.
- A [pinned Postgres role](#postgres-role) hides the passwords in `list_postgres_roles` and `get_postgres_role`.
- With API key auth, the `X-Neon-Secrets` header can tighten the URL's mode, never loosen it.
- With OAuth, `secrets` on the URL is fixed when you authorize. With the plain `https://mcp.neon.tech/mcp` URL, choose under **Secrets in tool results** on the authorization page instead.
- Under `none`, a create that returns its secret only once still runs, for example `create_auth_oauth_client`, and that secret can't be read again.

## MCP security guidance

We recommend MCP for **development and testing only**, not production environments.

- Use MCP only for local development or IDE-based workflows
- Never connect MCP agents to production databases
- Avoid exposing production or PII data; use anonymized data only
- Always review and authorize LLM-requested actions before execution
- Restrict MCP access to trusted users and regularly audit access

To limit what an agent can do, combine [read-only mode](#read-only-mode), a [Postgres role](#postgres-role) with limited grants, [category filtering](#category-filtering), and [`secrets=none`](#secrets-in-tool-results).

### Agents that call tools from code

Some setups don't show you each tool call. An MCP gateway that puts several servers behind one endpoint, or a client that lets the model write code that calls tools (sometimes called code mode or programmatic tool calling), can run many Neon tools in a single step. Approval prompts based on tool annotations such as `destructiveHint` may never appear.

In these setups, limit the connection itself instead of relying on approvals:

- `readonly=true`: write tools are hidden, and SQL runs in a `READ ONLY` transaction, so Postgres rejects writes even if a script attempts them. Read-only connections also show no secrets.
- `projectId=<project_id>`: keeps the agent inside one project.
- `roleName=<role>`: runs SQL as a role that has only the grants the agent needs.
- `secrets=none`: if the agent needs write access, keeps credentials out of tool results, and so out of script output and transcripts.

Neon applies these limits on the server, so they hold no matter which client or gateway sends the request.

### Check the authorization page

When you connect with OAuth, the authorization page shows where the sign-in returns before you click **Approve**, for example "Returns to claude.ai". Approve only when that matches the client you're connecting:

- **Returns to an app on this computer:** The sign-in returns to a `localhost` or `127.0.0.1` address. Continue only if you started the sign-in from an app on your computer.
- **App identity published at a host:** Clients such as Claude, ChatGPT, Codex, VS Code, Zed, GitHub Copilot CLI, and Antigravity identify themselves with a [Client ID Metadata Document](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration), an `https` URL that describes the client. The page names the host that published that document, such as `claude.ai`. This confirms who controls the client ID, not which app is behind it.

Clients that don't support metadata documents register through dynamic client registration and don't show an app identity line. Select **App details** to see the client's website and every registered redirect URI.

### Allowlist IP addresses

The hosted Neon MCP Server (`mcp.neon.tech`) connects to your Neon databases from the following static IP addresses:

- `34.192.103.46`
- `23.22.233.166`

If [IP Allow](/docs/introduction/ip-allow) is enabled on your project, add these addresses to your allowlist so the MCP server can connect.

## Database diagnostics

When you ask why a branch is slow, large, or behind, the MCP server can run `inspect_database` instead of inventing catalog SQL. It exposes the same 15 read-only checks as [`neon inspect db`](/docs/cli/inspect): table and index sizes, unused indexes, sequential scans, long-running and stalled queries and locks, heavy and frequent statements, cache hit rate and working set, autovacuum and bloat, and replication state. The `stalled-queries` check reports active queries running longer than 30 seconds, with their waits, blockers, parallel workers, query IDs, and query text.

Pick a check with the `check` parameter (for example `table-sizes` or `unused-indexes`). The tool runs inside a read-only transaction, so it works with [`?readonly=true`](#read-only-mode). It belongs to the `querying` category, not `observability`. Some checks need [`pg_stat_statements`](/docs/extensions/pg_stat_statements) or the [`neon`](/docs/extensions/neon) extension; the tool reports that and asks before suggesting installation.

## Questions that span many projects

Each tool call returns its full result to the agent. A question like "which branches across all my projects haven't changed in 30 days?" takes one call per project, and every response lands in the agent's context, even when the answer is a short list.

For questions like this, ask the agent to write a short script instead. The script does the looping and filtering, and the agent reads only the answer:

- With the [Neon Management SDK](/docs/reference/typescript-sdk#scripts-that-span-many-resources), a few lines of TypeScript cover every project and branch.
- With the [`neon api`](/docs/cli/api#find-an-endpoint) command, an agent with a shell can find any Neon API route, read its fields, and call it, including routes that aren't MCP tools.

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
- [Get started with Claude Code and Neon MCP Server](/guides/claude-code-mcp-neon)
- [Get started with Cursor and the Neon MCP Server](/guides/cursor-mcp-neon)
- [Get started with Claude Desktop and Neon MCP Server](/guides/neon-mcp-server)

<NeedHelp/>
