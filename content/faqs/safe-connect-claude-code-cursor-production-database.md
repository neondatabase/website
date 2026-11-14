---
title: "Is it safe to connect Claude Code or Cursor to my production database?"
subtitle: "Not directly. Neon recommends never connecting MCP agents to production. Give the agent a branch of production instead, with anonymized data if it holds PII, and limit the connection with read-only mode, a least-privilege Postgres role, and project scoping."
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T22:54:32.784Z'
isDraft: false
previousLink:
  title: 'How do I get S3-compatible storage without an AWS account?'
  slug: s3-compatible-storage-without-aws-account
nextLink:
  title: 'How do I safely query Postgres directly from the browser?'
  slug: safely-query-postgres-from-browser
---

Not directly. Neon recommends the [Neon MCP Server](/docs/ai/neon-mcp-server) for development and testing only: never connect MCP agents to production databases, and use anonymized data rather than production PII ([MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance)). The safe setup gives Claude Code or Cursor a branch that looks like production, and a connection that can only do what the task needs.

## Why production is the wrong target

Coding agents ask before running tools, but approvals get rushed. A misread request, a bad guess about which table is safe to drop, or instructions hidden in data the agent reads can turn into a destructive statement. Query results also go into the model's context, so any customer data the agent selects leaves your database. Read-only access stops writes, but not that.

## Give the agent a branch of production

A Neon [branch](/docs/introduction/branching) is a copy-on-write clone of your database, with the same schema and data, created in seconds. The agent can query, test migrations, or break things there without touching production:

- **Anonymized branches**: when production holds PII, create the branch with **Anonymized data** selected. PostgreSQL Anonymizer replaces sensitive values in the branch copy, and the parent stays unchanged ([data anonymization](/docs/workflows/data-anonymization)).
- **Separate credentials**: if production is a [protected branch](/docs/guides/protected-branches), Neon generates new Postgres role passwords on branches created from it, so a branch connection string doesn't open production. Protected branches are available on paid plans.
- **Expiring branches**: set an expiration time when you create the branch, up to 30 days out, so agent scratch copies delete themselves ([branch expiration](/docs/guides/branch-expiration)).

## Limit what the MCP connection can do

Combine these settings on the MCP server URL ([access control](/docs/ai/neon-mcp-server#access-control)):

- **Read-only mode** (`readonly=true`): `SELECT` and schema inspection stay available, while creating branches, running migrations, and changing auth config are disabled. With OAuth, you can pick read-only scope on the authorization page instead.
- **A least-privilege role** (`roleName=<role>`): every SQL tool logs in as that Postgres role, so its grants decide what the agent can read and change. Create it with `neon roles create --access read_only`. Roles created in the Console or API are members of `neon_superuser` and can read all data, so pinning one of those doesn't limit anything ([Postgres role](/docs/ai/neon-mcp-server#postgres-role)).
- **One project** (`projectId=<id>`): hides cross-project tools such as `list_projects` and `create_project`.
- **Fewer tools** (`category=<name>`): for example, only `querying` and `schema`.

`neon mcp` writes these settings into each agent's config for you ([`neon mcp`](/docs/cli/mcp)):

```bash
npx neon@latest mcp --read-only --project-id <project-id> --category querying --category schema
```

`--project-id` also limits a newly minted API key to that project. `--read-only` and `--category` change the server URL only, not the key's scope, so pass `--oauth` if you don't want a key on disk at all.

## Keep production credentials out of reach

Claude Code and Cursor can read files and run shell commands, so MCP settings don't help if a production connection string sits in your project's `.env`. Point local `DATABASE_URL` at a development branch: `neon env pull` writes `DATABASE_URL` for the current branch to `.env` ([`neon env pull`](/docs/cli/env#pull)). Agent setup steps are in the [Claude Code](/docs/ai/agent-setup/claude-code) and [Cursor](/docs/ai/agent-setup/cursor) guides.

## If you need answers about production

Let the agent work on a fresh branch of production: the data matches, and your users don't feel the load. For performance questions, the MCP server's `inspect_database` tool runs the same read-only checks as [`neon inspect db`](/docs/cli/inspect) inside a read-only transaction, so it works with `readonly=true` ([database diagnostics](/docs/ai/neon-mcp-server#database-diagnostics)). For schema changes, see [How do I let an AI agent change my database schema safely?](/faqs/let-ai-agent-change-database-schema-safely)

Details verified on 2026-11-13 against the linked pages.

<CTA title="Connect your agent to Neon" description="Set up the Neon MCP Server with read-only mode, a scoped role, and one project." buttonText="Neon MCP Server" buttonUrl="/docs/ai/neon-mcp-server" />
