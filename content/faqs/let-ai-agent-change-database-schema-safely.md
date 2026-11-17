---
title: "How do I let an AI agent change my database schema safely?"
subtitle: "Make the agent test every schema change on a temporary branch before it touches the real one. The Neon MCP Server's migration tools apply the SQL to a copy of your branch, let the agent check the result there, and apply it to the real branch only after you approve."
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T22:54:32.784Z'
isDraft: false
previousLink:
  title: 'How do I keep Postgres metadata in sync with files in a bucket?'
  slug: keep-postgres-metadata-in-sync-with-bucket
nextLink:
  title: 'How do I build a live dashboard on Postgres without polling the database?'
  slug: live-dashboard-postgres-without-polling
---

Make the agent prove the change on a copy first. The [Neon MCP Server](/docs/ai/neon-mcp-server) has two tools for this in its SQL (`querying`) category. `prepare_database_migration` applies schema changes on a temporary [branch](/docs/introduction/branching), and `complete_database_migration` applies them to your branch once you've approved ([available tools](/docs/ai/neon-mcp-server#available-tools)). Claude Code, Cursor, and other MCP clients call them when you ask for a schema change in plain language.

## How the flow works

Say you ask, "add a `created_at` column to `orders`":

1. **Prepare**: the agent calls `prepare_database_migration` with the SQL. Neon creates a temporary branch from your branch, a copy-on-write clone with the same schema and data, runs the SQL there, and returns a migration ID and the temporary branch ID.
2. **Verify**: the agent runs queries against the temporary branch with `run_sql`. It checks that the column exists, the default fills existing rows, and the queries your app runs still work against real data.
3. **Ask**: the agent shows you the result and asks whether to apply it. The tool's own instructions tell agents never to run the next step on their own.
4. **Complete**: on approval, `complete_database_migration` applies the same SQL to your branch and deletes the temporary branch. If you say no, it runs with `apply_changes: false`, which only deletes the temporary branch.

A failed migration fails on the copy, and your branch never sees it. The [Claude Code guide](/guides/claude-code-mcp-neon) shows a full session.

## Gotchas

- **Semicolons split the SQL**: `prepare_database_migration` splits its input on every semicolon, including one inside a string or a function body. Keep `CREATE FUNCTION` and trigger bodies out of agent-run migrations, and apply them with your migration tool instead.
- **Read-only mode turns it off**: with `readonly=true` on the MCP server URL, running migrations is disabled ([read-only mode](/docs/ai/neon-mcp-server#read-only-mode)). An agent that changes schema needs a write connection, so keep that connection on a development branch.
- **A copy doesn't remove locks**: the temporary branch shows the SQL succeeds against your data. A statement that rewrites a large table still takes its locks when it runs on the real branch.
- **Approve the right target**: the change lands on the branch the agent prepared it from. Check which branch that is before you approve, and keep the MCP server pointed at development ([is it safe to connect Claude Code or Cursor to production?](/faqs/safe-connect-claude-code-cursor-production-database)).

## Keep migrations in version control

If your app uses Drizzle, Prisma, Rails, or another migration tool, a change applied straight through MCP leaves your migration files behind. In that case, have the agent write the migration file and test it on a branch:

```bash
neon branches create --name agent/add-created-at --parent main
neon env pull --branch agent/add-created-at --file .env.agent
# run your migration tool against the branch connection string, then:
neon diff --branch agent/add-created-at main
```

`neon diff` prints a git-style schema diff between the two branches ([`neon diff`](/docs/cli/diff)). The MCP server's `compare_database_schema` tool returns the same kind of diff inside the agent session. Review it, merge the migration file, and let CI apply it to production the way it applies every other migration. See [What Postgres platforms provide safe testing for risky migrations?](/faqs/postgres-platforms-safe-testing-migrations) for the CI side.

Details verified on 2026-11-13 against the linked pages.

<CTA title="Connect your agent to Neon" description="Set up the Neon MCP Server and test schema changes on temporary branches." buttonText="Neon MCP Server" buttonUrl="/docs/ai/neon-mcp-server" />
