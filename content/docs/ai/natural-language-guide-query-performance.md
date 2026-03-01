---
title: Query performance
subtitle: Find slow queries, explain plans, and tune with natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to list slow queries, inspect
  execution plans, and apply query tuning on a branch with the Neon MCP Server.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

This guide uses the [Neon MCP Server](/docs/ai/neon-mcp-server) in Cursor or Claude Code. Run the install command in your **terminal**; then run the prompts below in your **AI chat**. The assistant uses MCP query tools to find slow queries, explain execution plans, and suggest or apply optimizations (for example, indexes) on a temporary branch so you can test before applying to production.

<Admonition type="note" title="pg_stat_statements and statistics collection">
Listing slow queries requires the `pg_stat_statements` extension. Unless the MCP tool uses Neon's system-installed extension for your project, you need to [enable pg_stat_statements](/docs/extensions/pg_stat_statements) on your database (see step below). After the extension is enabled, statistics are collected only as queries run. Allow time for workload to accumulate—you may need to return after a period (for example, after your app or tests have run) to see meaningful slow-query data. Statistics are not retained when your compute suspends or restarts (for example, after scale-to-zero). See [Monitor query performance](/docs/introduction/monitor-query-performance) for more detail.
</Admonition>

## Find and analyze slow queries

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor so your assistant can manage Neon from the chat. Restart your editor, then open your AI assistant. Learn more: [neonctl init](/docs/reference/cli-init).

## Enable pg_stat_statements (if needed)

If slow-query listing fails or returns no data, enable the extension on your database. Replace `[project-name]` and `[dbname]` (often `neondb`) with your project and database:

```text
In my project [project-name] database [dbname], run: CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

After enabling, run queries against your database so statistics can accumulate. Return to this guide after some time (for example, after your app or tests have run) to list slow queries. **Verify:** The assistant confirms the extension was created. See [The pg_stat_statements extension](/docs/extensions/pg_stat_statements) for details.

## List the 10 slowest queries

Replace `[project-name]` and `[dbname]` (often `neondb`) with your project and database:

```text
List the 10 slowest queries in my project [project-name] database [dbname]
```

The assistant uses the MCP `list_slow_queries` tool and returns up to 10 slowest queries to prioritize tuning. **Verify:** The list appears in the chat. You can also use the [Neon Console](https://console.neon.tech) **Monitoring** or **SQL Editor** to inspect query activity.

## Explain a query's execution plan

To see how the database executes a specific query:

```text
Explain the execution plan for SELECT * FROM users WHERE email = 'x' in my project [project-name]
```

The assistant uses `explain_sql_statement` and returns the plan (for example, sequential scan vs index scan) so you can spot bottlenecks. **Verify:** The execution plan is shown in the chat.

</Steps>

## Suggest and apply optimizations on a branch

MCP can run tuning on a **temporary branch** so your production branch is unchanged until you are satisfied. In Neon, the default branch created with a project is typically named **production** (that's your main production branch).

<Steps>

## Ask for tuning suggestions on a branch

```text
Suggest index improvements for slow queries in my project [project-name]; use a branch so I can test before applying
```

The assistant uses `prepare_query_tuning`: it creates a temporary branch, analyzes slow queries, and suggests optimizations (such as new indexes). You can run queries against the branch to verify. **Verify:** The assistant will describe the tuning branch and suggested changes in the chat. You can run a follow-up prompt to run a query on that branch, or check **Branches** in the [Neon Console](https://console.neon.tech) for the temporary branch.

## Apply or discard tuning

When you are happy with the result:

```text
Complete the query tuning and apply the optimizations to my production branch
```

The assistant uses `complete_query_tuning` to merge the tuning branch into your production branch (in Neon, the default branch is typically named **production**) and clean up. To discard the tuning instead, ask to complete without applying (the assistant will use the tool to discard and clean up). **Verify:** The assistant confirms whether optimizations were applied or discarded. You can run "List the 10 slowest queries" again or check **Monitoring** in the [Neon Console](https://console.neon.tech) to see the impact.

</Steps>

<Admonition type="tip" title="Tip">
Always use "use a branch" or "on a branch" when asking for tuning so the assistant uses the prepare/complete flow. That way you can test impact before changing production.
</Admonition>

## See also

- [Neon MCP Server](/docs/ai/neon-mcp-server) for supported tools
- [Explore projects and run SQL](/docs/ai/natural-language-guide-explore-sql) for running ad-hoc SQL
- [Branches and schema changes](/docs/ai/natural-language-guide-branches-schema) for branch-based schema workflows

<NeedHelp/>
