---
title: Getting started
summary: Set up and make your first request using the Neon REST API, TypeScript SDK, CLI, or MCP server.
enableTableOfContents: true
updatedOn: '2026-06-23T15:47:09.519Z'
---

Every operation available in the Neon Console can be performed programmatically. Choose the interface that fits your workflow.

## Quick start

`npx neonctl@latest init` authenticates, creates a project if you don't have one, writes a `.neon` context file for CLI use, and configures supported AI tools for MCP access:

```bash
npx neonctl@latest init
```

## Interfaces

<InterfaceStrip />

<InterfaceTabPanel id="api">

### Get an API key

Get one from [Console → Settings → API Keys](https://console.neon.tech/app/settings/api-keys). Neon supports three key types:

| Scope          | Access                                               |
| -------------- | ---------------------------------------------------- |
| Personal       | All projects you're a member of across organizations |
| Organization   | All projects in an org (admin-level)                 |
| Project-scoped | A single project                                     |

For a full guide on creating and managing keys, including security best practices, see [Manage API keys](/docs/manage/api-keys).

### Make your first request

List your projects to confirm everything works:

```bash shouldWrap
curl https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY"
```

```json
{
  "projects": [
    {
      "id": "autumn-disk-123456",
      "name": "my-project",
      "region_id": "aws-us-east-2",
      "pg_version": 17,
      "org_id": "org-morning-bread-12345678",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": { "cursor": "eyJsaW1pdCI6MX0" }
}
```

### Explore the reference

Each operation page in this reference includes copyable examples for the REST API, CLI, SDK, and MCP. Browse by resource using the navigation on the left.

</InterfaceTabPanel>

<InterfaceTabPanel id="sdk">

### Install

```bash
npm install @neondatabase/api-client
```

### Make your first request

```typescript
import { createApiClient } from '@neondatabase/api-client';

const api = createApiClient({ apiKey: process.env.NEON_API_KEY });

const { data } = await api.listProjects({});
console.log(data.projects);
```

```js
[
  {
    id: 'autumn-disk-123456',
    name: 'my-project',
    region_id: 'aws-us-east-2',
    pg_version: 17,
    org_id: 'org-morning-bread-12345678',
    created_at: '2025-01-15T10:30:00Z'
  },
  // ...
]
```

If you belong to multiple organizations, pass `org_id` to scope results to one. Your org ID is on your [organization settings](https://console.neon.tech/app/settings) page.

### Explore the reference

Every REST endpoint has a matching typed method. Method names follow the `operationId` from the OpenAPI spec, and each operation page shows the exact SDK call. Types are generated directly from the spec.

</InterfaceTabPanel>

<InterfaceTabPanel id="cli">

### Install

Install the CLI globally:

```bash
npm install -g neonctl
```

### Authenticate

Log in with your Neon account:

```bash
neon auth
```

### Make your first request

List your projects to confirm everything works:

```bash
neon projects list
```

```
┌────────────────────────┬────────────────┬───────────────┬──────────────────────┐
│ Id                     │ Name           │ Region Id     │ Created At           │
├────────────────────────┼────────────────┼───────────────┼──────────────────────┤
│ autumn-disk-123456     │ my-project     │ aws-us-east-2 │ 2025-01-15T10:30:00Z │
└────────────────────────┴────────────────┴───────────────┴──────────────────────┘
```

### Explore the reference

Each operation page shows the equivalent CLI command and flags. For the full CLI reference, see [Neon CLI](/docs/cli).

</InterfaceTabPanel>

<InterfaceTabPanel id="mcp">

The Neon MCP server lets AI assistants (Claude, Cursor, Windsurf, and others) interact with your Neon databases through natural language.

### Install

Add to a specific tool using OAuth (no API key needed):

```bash
npx add-mcp https://mcp.neon.tech/mcp
```

Append `--agent <name>` to target a specific tool: `cursor`, `claude-desktop`, `claude-code`, `vscode`, `windsurf`, `zed`. Run `npx add-mcp list-agents` for the full list.

### Explore the reference

Each operation page shows the equivalent MCP tool. For full per-client setup instructions, see [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon).

<Admonition type="important" title="Security">
The Neon MCP server is intended for development and testing only. Always review LLM-requested actions before execution.
</Admonition>

</InterfaceTabPanel>
