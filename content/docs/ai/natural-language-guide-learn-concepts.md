---
title: Learn Neon concepts
subtitle: Ask your AI assistant about core Neon features—answers from our documentation
summary: >-
  Use natural language to learn Neon's core concepts. The summaries and prompts
  below are grounded in Neon documentation; your assistant can answer from our
  docs when the Neon MCP Server is connected.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

You can learn Neon's core concepts by asking your AI assistant. With the [Neon MCP Server](/docs/ai/neon-mcp-server) connected, the assistant can load Neon documentation (for example, using the `load_resource` tool with the "neon-get-started" guide) and answer from it, so explanations stay grounded in our docs. The brief summaries below are drawn from Neon documentation; use the suggested prompts to go deeper.

If you haven't already, run this in your **terminal** once so your assistant can use the Neon MCP Server:

```bash
npx neonctl@latest init
```

Then open your **AI chat** (Cursor or Claude Code) and try the prompts below. You can say "Load Neon's getting started or concept documentation" first if you want the assistant to base answers on loaded docs.

## Neon and serverless Postgres

Neon delivers Postgres as a serverless platform by separating storage and compute. That allows instant provisioning, automatic scaling (up and down, including to zero when idle), and usage-based pricing. You don't manage servers; Neon handles provisioning, maintenance, and scaling so you can focus on your application. See [Serverless](/docs/introduction/serverless).

**Ask your assistant:**

```text
Using Neon's documentation, what does "serverless" mean for Neon and what are the main benefits?
```

## Branching

A branch in Neon is a copy-on-write clone of your data. You can create a branch from the current state or from a past point in time. Branches are isolated from the parent: you can develop, test, or run destructive queries without affecting production. Changes on a branch are stored as deltas; creating a branch does not increase load on the parent. Each project has a root branch (often named `main` or `production`); you can branch from the root or from other branches. See [Branching](/docs/introduction/branching).

**Ask your assistant:**

```text
Using Neon's documentation, explain what a Neon branch is and how it's useful for development and testing.
```

## Scale to zero

Scale to zero automatically suspends the compute that runs your Postgres database after a period of inactivity (5 minutes by default on Neon). That reduces costs for databases that aren't always active, such as development or preview environments. When you query the database again, it reactivates automatically. On paid plans you can disable scale to zero to keep a compute always active. See [Scale to Zero](/docs/introduction/scale-to-zero).

**Ask your assistant:**

```text
Using Neon's documentation, how does scale to zero work and when should I use it?
```

## Autoscaling

Autoscaling dynamically adjusts the amount of compute (CPU and memory) allocated to your database based on current load. You set a minimum and maximum compute size; Neon scales within that range without manual intervention or restarts. That helps with variable workloads and avoids over-provisioning for peaks. See [Autoscaling](/docs/introduction/autoscaling).

**Ask your assistant:**

```text
Using Neon's documentation, what is Neon autoscaling and how do I configure it?
```

## Restore window

The restore window is how far back Neon keeps a history of changes for your branches. That history powers instant restore (point-in-time recovery), Time Travel queries, and creating branches from past states. A longer window gives more recovery options but increases instant restore storage cost; a shorter window reduces cost but limits how far back you can restore. The window is configurable per project and varies by plan. See [Restore window](/docs/introduction/restore-window).

**Ask your assistant:**

```text
Using Neon's documentation, what is the restore window and how does it affect cost and recovery?
```

## Instant restore and Time Travel

Instant restore (point-in-time restore) lets you restore a root branch to an earlier state within the restore window, for example right before a data loss. Time Travel lets you run read-only queries against your data as it was at a specific point in time, without restoring—useful for debugging or auditing. Both use the same WAL history retained in your restore window. See [Instant restore](/docs/introduction/branch-restore) and [Time Travel](/docs/guides/time-travel-assist).

**Ask your assistant:**

```text
Using Neon's documentation, what is instant restore and how is it different from Time Travel?
```

## Projects, branches, and compute

A Neon **project** is the top-level container; it has a default root branch and can have multiple branches. A **branch** holds databases and is backed by copy-on-write storage. A **compute** is the Postgres instance (CPU and memory) for a branch; you connect to a branch through its compute. You can have multiple branches per project and configure each branch's compute size, autoscaling, and scale-to-zero behavior. See [Branching](/docs/introduction/branching) and [Manage computes](/docs/manage/computes).

**Ask your assistant:**

```text
Using Neon's documentation, how do projects, branches, and computes relate to each other?
```

## Go further

After loading or referencing Neon documentation, you can ask open-ended questions such as:

- "What Neon features help with CI/CD or preview environments?"
- "How does Neon billing work for compute and storage?"
- "What's the difference between a root branch and a child branch?"

The assistant should answer from the loaded or cited Neon docs. For the full written guides, use the links in each section above.

## See also

- [Neon MCP Server](/docs/ai/neon-mcp-server) for setup and tools (including `load_resource`)
- [Branching](/docs/introduction/branching), [Scale to Zero](/docs/introduction/scale-to-zero), [Autoscaling](/docs/introduction/autoscaling)
- [Restore window](/docs/introduction/restore-window), [Instant restore](/docs/introduction/branch-restore), [Time Travel](/docs/guides/time-travel-assist)
- [Serverless](/docs/introduction/serverless), [Architecture overview](/docs/introduction/architecture-overview)

<NeedHelp/>
