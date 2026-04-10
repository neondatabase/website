---
title: 'Diagnosing and fixing production errors with Sentry and Neon MCP'
subtitle: 'How to use AI agents to fetch stack traces from Sentry and safely test query optimizations on isolated Neon database branches.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-04-06T00:00:00.000Z'
updatedOn: '2026-04-06T00:00:00.000Z'
---

Resolving stateful production bugs requires exact runtime context and a safe place to experiment. If an AI agent only has access to your local codebase, its ability to troubleshoot database bottlenecks is severely limited.

When dealing with slow queries or schema errors, an agent cannot rely on local mock data or shared staging servers to prove a fix works. It needs a closed-loop debugging environment providing:

1. **Context:** The exact stack trace and failing query from production.
2. **Safety:** An isolated, production-like environment where it can test schema changes without risking live traffic.

This guide shows how to set up a practical workflow by connecting an AI agent (such as Cursor) to the [Sentry](https://mcp.sentry.dev/) and [Neon MCP](/docs/ai/neon-mcp-server) servers.

In this guide, you will investigate a common production issue: a missing database index leading to a gateway timeout in an internal dashboard. By connecting Cursor to Sentry’s MCP server, you’ll retrieve the exact stack trace and SQL query responsible for the timeout. Then, with Neon’s MCP server, you’ll create a safe branch of the production database, apply the index fix, and validate the performance improvement before promoting the change.

### The scenario: "Optimizing a slow admin dashboard"

Imagine your customer support team is complaining that loading the internal user management dashboard occasionally results in a `504 Gateway Timeout`.

Because admin panels often lack proper database indexes initially, they tend to slow down over time as the application grows. While this isn't a customer-facing outage, it is a significant blocker for your internal team that needs to be addressed during the current sprint.

Rather than manually hunting down the slow query in your observability tools, cloning the database, and testing different indexes locally, you can use an AI agent to automate the workflow. Using the Sentry MCP server, Cursor will identify exactly which query is timing out. Then, with the Neon MCP server, it creates an isolated database branch to safely apply and test the missing index.

## Prerequisites

Before you begin, ensure you have the following ready.

This guide assumes your application already sends events to Sentry and uses Neon Postgres as its primary database.

- **Sentry account and project:** An active Sentry account with an application sending error and performance events. If Sentry is not yet added to your app, follow the [Sentry setup docs](https://docs.sentry.io/platforms/) first.
- **Neon account and project:** A Neon account with a project configured as the primary database for your application. If you haven’t set up Neon yet, you can create an account and follow [Connecting Neon to your stack](/docs/get-started/connect-neon) to get started.
- **Cursor:** Download [Cursor](https://cursor.com/download).
  <Admonition type="tip" title="Using Claude Code, Codex or other agents?">
  While this guide demonstrates the workflow with Cursor, the same principles apply to any AI agent (e.g., Claude Code, Codex, Windsurf etc.) that is capable of integrating with MCP servers and executing tools through natural language prompts.
  </Admonition>

<Steps>

## Set up the Neon MCP server

Set up the Neon MCP server to allow Cursor to create branches, run SQL commands, and inspect database schema directly from your IDE.

The simplest way to connect to Neon is using the Neon CLI. Open your terminal in the root of your project and run:

```bash
npx neonctl@latest init
```

You’ll be prompted to authenticate with Neon and choose the editor you want to integrate with. Select Cursor (or your preferred IDE). This command handles authentication, configures your local MCP connection to Neon’s remote server, and installs [Neon agent skills](https://github.com/neondatabase/agent-skills) for best-practice workflows.

## Set up the Sentry MCP server

The Sentry MCP server allows your AI agent to access stack traces, error details, and performance telemetry from your Sentry projects.

1. In the root of your project, create a new file named `.cursor/mcp.json` (if it doesn’t already exist).
2. Open the file and add the following configuration to connect to Sentry’s MCP server:
   ```json
   {
     "mcpServers": {
       "Sentry": {
         "url": "https://mcp.sentry.dev/mcp"
       }
     }
   }
   ```
3. Save the file.
4. In Cursor, go to **Settings > Tools & MCPs** and enable the Sentry MCP server. You may be asked to authenticate with Sentry to grant Cursor access to your projects. Complete the authentication flow.

## Investigate the production issue

With both MCP servers connected, open Cursor's Composer (or Chat) and ask it to find the latest issues affecting your application. Start with a prompt like this:

```text shouldWrap
Customer support mentioned the internal dashboard is timing out. Use Sentry to find the recent issues in my 'internal-dashboard' project.
```

Cursor typically starts with Sentry discovery calls (`whoami`, `find_organizations`, and `find_projects`) before querying issues:

![Cursor prompt to find recent issues in Sentry MCP](/docs/guides/sentry-mcp-find-issues-prompt.png)

Cursor uses `search_issues` tool in the Sentry MCP to retrieve a list of recent issues. It retrieves the exact error (`error: canceling statement due to statement timeout`) with a stack trace pointing to the user management endpoint.

To get the exact query and execution context, follow up with:

```text shouldWrap
Yes, Get the issue details. What exact database query is causing the bottleneck?
```

In this output, Cursor returns the unresolved issue, endpoint details, and maps the bottleneck query to `src/api/users.ts`, giving you direct code-level context from Sentry telemetry:

![Sentry MCP issue details and bottleneck SQL query in code](/docs/guides/sentry-mcp-issue-details-and-query.png)

Sentry provides the relevant file path (e.g., `src/api/users.ts:17-22`) and the offending SQL query. The agent identifies that a `SELECT` query used to populate the admin table is performing a sequential scan on the `users` table because it lacks a compound index on `organization_id` and `created_at`.

Cursor now understands the _exact_ root cause of the bug without you ever leaving your editor.

## Safely remediate with Neon branching

Now that the root cause is confirmed, the next step is remediation. Running `CREATE INDEX` directly against a live database can lock tables or degrade performance further for internal users.

Instead, use Neon branching through MCP to create an isolated copy of production, apply the index, and validate the query performance safely before merging the PR.

Prompt Cursor with the remediation task:

```text shouldWrap
Ok, please add indexes. Test if it solves the issue by using a seperate Neon Branch.
```

![Cursor transitions from Sentry findings to Neon branch remediation](/docs/guides/neon-mcp-remediation-request.png)

Cursor will execute the following workflow using Neon MCP tools:

1. **Isolation:** Cursor calls `create_branch` via Neon MCP. Because Neon is copy-on-write, a production-like replica is created instantly.
2. **Execution:** Cursor writes and executes the index statement against the isolated branch using `run_sql`.
3. **Validation:** Cursor runs `EXPLAIN ANALYZE` to confirm the query planner uses the new index and verifies that execution time has dropped.

The run output shows this branch workflow in action, with Cursor creating the branch, applying the index, and confirming the performance improvement through query plan analysis:

![Neon MCP branch execution showing schema inspect, SQL run, and explain plan](/docs/guides/neon-mcp-branch-index-execution.png)

After the index is created, Cursor compares before/after plan behavior and timing from `EXPLAIN ANALYZE`, confirming the query moved from a sequential scan to an index scan with substantially lower latency:

![Neon MCP explain analyze results before and after indexing](/docs/guides/neon-mcp-explain-analyze-results.png)

## Validate the fix

Because the schema change and query performance were tested against a production-like branch, you get concrete evidence that the fix works without relying on mock data or shared staging databases.

Ask Cursor to apply the fix to production and create a migration file:

```text shouldWrap
Yes please apply this migration to production branch and also create a migrations file noting it down.
```

![Cursor applying validated index to production branch and creating migration](/docs/guides/neon-mcp-apply-prod-and-create-migration.png)

Cursor will then apply the index to the production branch, ensuring the fix is live for users. It will also generate a migration file in your codebase with the necessary SQL commands and a description of the change for your version control history.

</Steps>

## Extending the workflow

This guide demonstrates a simple, single-agent happy path. For real-world production systems, you can expand this into a robust, automated debugging pipeline:

- **Multi-agent orchestration:** Instead of a single chat thread, use specialized subagents. A "Triage Agent" analyzes the Sentry stack trace, a "Database Agent" tests schema changes on Neon, and a "Review Agent" verifies safety before opening the PR.
- **Parallel experimentation:** Don't just test the first guess. Have the AI generate multiple hypotheses (e.g., three different indexing strategies), spin up three isolated Neon branches simultaneously, and automatically promote the one with the best result. Checkout [Git worktrees and Neon Branching: Running multiple AI coding agents in parallel](/guides/git-worktrees-neon-branching) for how to run multiple AI agents in parallel.

## Conclusion

By bridging the observability of **Sentry** with the stateful safety of **Neon database branching**, AI agents can now troubleshoot and resolve production issues that were previously out of reach.

Sentry’s MCP server prevents the AI from guessing _why_ an application is failing by feeding it exact stack traces and production context. Neon’s MCP server prevents the AI from breaking things while trying to fix them by providing instant, disposable production replicas for safe experimentation.

Together, they create a closed-loop debugging workflow: **Detect -> Investigate -> Branch -> Fix -> Validate -> Ship**, all executed through natural language inside your IDE.

## Resources

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
- [Neon MCP Server Documentation](/docs/ai/neon-mcp-server)
- [Neon Database Branching](/branching)
- [Sentry MCP Server Documentation](https://mcp.sentry.dev/)
- [Cursor IDE](https://cursor.com/)
