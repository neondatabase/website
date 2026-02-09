---
title: Assess cost optimization
subtitle: Use natural language to check compute, branches, storage, and settings
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to assess whether your Neon
  projects are optimized for cost—compute size, autoscaling, scale to zero,
  branches, restore window, and more.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

This guide is a companion to [Cost optimization](/docs/introduction/cost-optimization). Use the prompts below with the [Neon MCP Server](/docs/ai/neon-mcp-server) in your **AI chat** (Cursor or Claude Code) to assess your setup. Run the install command in your **terminal** once (`npx neonctl@latest init`), then paste the prompts. Replace `[project-name]` with your project name or ID. The assistant uses MCP tools (and may use the Neon API where needed) to gather information and suggest improvements.

## Assess your cost optimization

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server and agent skills. Restart your editor, then open your AI assistant. Learn more: [neonctl init](/docs/reference/cli-init).

## List projects and pick one to assess

Get an overview of your projects so you have context:

```text
List my Neon projects
```

Then describe a specific project to see its branches and high-level settings:

```text
Describe my project [project-name]
```

**Verify:** You see project details, branches, and databases in the chat. Use this project for the steps below.

## Check computes: size, autoscaling, scale to zero, last active

See compute size, whether autoscaling is enabled, whether scale to zero is enabled, and when each compute was last active. Branches that are never used but have no scale-to-zero may be costing you.

```text
List the computes for my project [project-name] and show their size, autoscaling settings, scale-to-zero setting, and last active time
```

The assistant uses `list_branch_computes`. **Verify:** For each branch compute you see size (or min–max CU if autoscaling), suspend timeout (scale to zero), and last active. Consider enabling [scale to zero](/docs/guides/scale-to-zero-guide) for non-production branches and [autoscaling](/docs/guides/autoscaling-guide) where appropriate.

## Check branches: count, age, and expiration

See how many branches you have, when they were created, and whether any have expiration set. Extra branches beyond your plan’s allowance are billed; old branches without expiration may be unnecessary.

```text
List all branches in my project [project-name] and show their names, when they were created, and whether they have an expiration set
```

**Verify:** You see branch count and creation/expiration info. Delete branches you no longer need and set [branch expiration](/docs/guides/branch-expiration) on temporary branches. See [Cost optimization — Extra branches](/docs/introduction/cost-optimization#extra-branches).

## Check database size

See how much data you have on a branch. Large databases increase storage cost; cleaning up old data or running `VACUUM FULL` on bloated tables can help.

```text
In my project [project-name] on the default branch, run: SELECT pg_size_pretty(pg_database_size(current_database())) AS database_size;
```

For a breakdown by table (optional):

```text
In my project [project-name] on the default branch, run: SELECT relname AS table_name, pg_size_pretty(pg_total_relation_size(relid)) AS size FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 20;
```

**Verify:** You see total database size and optionally the largest tables. See [Cost optimization — Storage](/docs/introduction/cost-optimization#storage-root-and-child-branches).

## Check restore window (history retention)

A longer restore window increases instant restore storage cost. See what your project uses and whether you can reduce it.

```text
What is the restore window (history retention) for my project [project-name]?
```

The assistant may use project details or the Neon API. **Verify:** You see the current restore window (e.g. in seconds or days). If you don’t need long recovery, consider reducing it. See [Restore window](/docs/introduction/restore-window) and [Cost optimization — Instant restore storage](/docs/introduction/cost-optimization#instant-restore-storage).

## Check active connections (optional)

Persistent connections can prevent scale to zero. See how many connections are active on a branch.

```text
In my project [project-name] on the default branch, run: SELECT count(*) AS active_connections FROM pg_stat_activity WHERE state = 'active' OR (state = 'idle' AND query_start < now() - interval '5 minutes');
```

Or simply:

```text
In my project [project-name] on the default branch, run: SELECT count(*) FROM pg_stat_activity;
```

**Verify:** You see connection count. Long-lived or idle connections may keep compute active; see [Cost optimization — Manage persistent connections](/docs/introduction/cost-optimization#compute-cu-hours).

## Get consumption for the current month (optional)

To see actual usage and costs for the current month, ask the assistant to fetch consumption metrics. If the assistant has access to the Neon API, it can call the [Consumption API](/docs/guides/consumption-metrics); otherwise use the **Billing** page in the [Neon Console](https://console.neon.tech).

```text
Get consumption metrics for my project [project-name] for the current month
```

**Verify:** You see compute, storage, and other usage for the period, or a link to the Console. See [Querying consumption metrics](/docs/guides/consumption-metrics) for API details.

## Logical replication and read replicas (Console)

Computes with [logical replication](/docs/guides/logical-replication-neon) subscribers do not scale to zero. [Read replicas](/docs/introduction/read-replicas) add separate compute endpoints. The MCP server may not expose these settings; check the **Branches** and compute settings in the [Neon Console](https://console.neon.tech) to see which branches use logical replication or read replicas and whether you can reduce or consolidate them. See [Cost optimization — Logical replication](/docs/introduction/cost-optimization#compute-cu-hours) and read replica costs.

</Steps>

<Admonition type="tip" title="Act on what you find">
Use the [Cost optimization](/docs/introduction/cost-optimization) guide to act on what you discover: right-size computes, enable autoscaling and scale to zero where appropriate, trim branches and restore window, and clean up storage. The **Billing** page in the Neon Console shows charges by metric.
</Admonition>

## See also

- [Cost optimization](/docs/introduction/cost-optimization) for strategies and FAQs
- [Querying consumption metrics](/docs/guides/consumption-metrics) for the Consumption API
- [Restore window](/docs/introduction/restore-window) for configuring history retention
- [Scale to zero](/docs/guides/scale-to-zero-guide) and [Autoscaling](/docs/guides/autoscaling-guide) for compute settings
- [Branch expiration](/docs/guides/branch-expiration) for automatic branch cleanup

<NeedHelp/>
