---
title: Neon MCP Server overview
subtitle: Connect your AI assistant to Neon to manage projects, run queries, and make schema changes
summary: >-
  The Neon MCP Server implements the Model Context Protocol (MCP), letting AI
  assistants interact with your Neon projects on your behalf. Set up with
  `npx neon@latest init` or use the config generator. Supports OAuth and
  API key auth. The older HTTP+SSE endpoints (`/sse`, `/message`) are retired
  and return 410.
enableTableOfContents: true
updatedOn: '2026-08-13T22:11:29.293Z'
---

The Neon MCP Server implements the Model Context Protocol (MCP), letting AI assistants interact with your Neon projects on your behalf. Your AI agent can interact with Neon via MCP tools or by running [Neon CLI](/docs/cli) commands directly.

<Admonition type="important" title="Security">
The Neon MCP Server grants broad database management capabilities. **Always review and authorize actions requested by the LLM before execution.** Restrict access to trusted users only. See [MCP security guidance](#mcp-security-guidance).
</Admonition>

## Quick setup

```bash
npx neon@latest init
```

Runs `neon init` via npx to configure MCP and other integrations for your editor. If you only want the MCP server, use the config generator below.

## Config generator

Use the generator to build an MCP config for your editor and auth method, including the `Authorization` header for API key or remote agent setups.

<McpSetupConfigurator />

## Access control

The Neon MCP Server supports URL parameters to restrict scope and permissions. Append them to the MCP URL (`https://mcp.neon.tech/mcp`).

### Read-only mode

Append `?readonly=true` to restrict the server to read operations:

```
https://mcp.neon.tech/mcp?readonly=true
```

`SELECT` queries and schema inspection remain available. Write operations (creating branches, running migrations, modifying auth config) are disabled.

With OAuth, you can also choose read-only scope during the authorization flow instead of using the URL parameter.

### Project-scoped mode

Scope all operations to a single project:

```
https://mcp.neon.tech/mcp?projectId=<your-project-id>
```

Cross-project search and navigation are disabled in this mode.

### Category filtering

Restrict active tools to specific categories using `?category=<name>` (repeatable):

```
https://mcp.neon.tech/mcp?category=querying&category=schema
```

See [Available tools](#available-tools) for the full category list. To verify which tools are active for a given config without authenticating:

```bash
curl "https://mcp.neon.tech/api/list-tools?readonly=true&category=querying"
```

## MCP security guidance

We recommend MCP for **development and testing only**, not production environments.

- Use MCP only for local development or IDE-based workflows
- Never connect MCP agents to production databases
- Avoid exposing production or PII data; use anonymized data only
- Always review and authorize LLM-requested actions before execution
- Restrict MCP access to trusted users and regularly audit access

### Allowlist IP addresses

The hosted Neon MCP Server (`mcp.neon.tech`) connects to your Neon databases from the following static IP addresses:

- `34.192.103.46`
- `23.22.233.166`

If [IP Allow](/docs/introduction/ip-allow) is enabled on your project, add these addresses to your allowlist so the MCP server can connect.

## Database diagnostics

When you ask why a branch is slow, large, or behind, the MCP server can run `inspect_database` instead of inventing catalog SQL. It exposes the same 14 read-only checks as [`neon inspect db`](/docs/cli/inspect): table and index sizes, unused indexes, sequential scans, long-running queries and locks, heavy and frequent statements, cache hit rate and working set, autovacuum and bloat, and replication state.

Pick a check with the `check` parameter (for example `table-sizes` or `unused-indexes`). The tool runs inside a read-only transaction, so it works with [`?readonly=true`](#read-only-mode). It belongs to the `querying` category, not `observability`. Some checks need [`pg_stat_statements`](/docs/extensions/pg_stat_statements) or the [`neon`](/docs/extensions/neon) extension; the tool reports that and asks before suggesting installation.

<MCPTools />

## Troubleshooting

If your client doesn't support JSON for MCP server configuration (such as older versions of Cursor), use this command when prompted:

```bash
npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
```

For per-client setup instructions, see [Connect MCP clients](/docs/ai/connect-mcp-clients-to-neon).

### Retired HTTP+SSE transport (#retired-sse)

<Admonition type="note">
The hosted Neon MCP Server uses Streamable HTTP at `https://mcp.neon.tech/mcp`. The older HTTP+SSE endpoints (`/sse` and `/message`) are retired and return `410 Gone`. If your client only supports local stdio servers, put this in the client config so [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridges to Streamable HTTP:

```json
{
  "mcpServers": {
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.neon.tech/mcp"]
    }
  }
}
```
</Admonition>

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Neon API Reference](/docs/reference/api)
- [Neon API Keys](/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
