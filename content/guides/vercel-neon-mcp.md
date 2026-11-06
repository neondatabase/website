---
title: 'AI-driven incident response with the Vercel and Neon MCP servers'
subtitle: 'Use Vercel logs and Neon branching to give AI agents the context to diagnose production errors and validate fixes on an isolated branch before they reach production.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-02T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

If an agent is tasked with fixing a production bug that requires a database schema change, executing SQL directly against a live database is risky. The agent needs two things:

1. **Context:** Rich telemetry and logs to pinpoint the root cause.
2. **Safety:** A controlled, production-like sandbox to validate changes before rollout.

This guide shows how to combine the observability of the [Vercel MCP server](https://vercel.com/docs/agent-resources/vercel-mcp) with the stateful isolation of the [Neon MCP server](/docs/ai/neon-mcp-server) using Anthropic's [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

With this workflow, Claude Code investigates runtime errors in Vercel, validates database fixes on a Neon branch, and then raises a pull request with the required code changes, all from natural language prompts.

### The scenario: a rushed deployment drops analytics events

A high-priority marketing campaign is about to launch, and the growth team needs new attribution metrics. To meet the deadline, the frontend code that adds the tracking events is rushed into production.

Because the schema owner on the data engineering team is unavailable, the pull request is merged without review, and the necessary database migration is skipped.

After deployment to Vercel, the core application continues to function, but the new analytics events fail silently. Since these events are sent via background fetch requests, users see no errors. Behind the scenes, however, Vercel’s serverless functions return `500 Internal Server Error` due to a schema mismatch: the code attempts to insert parameters that the production database does not recognize.

It isn't a full outage, but the campaign is losing data. Instead of manually inspecting Vercel logs, tracing the Postgres exception, writing a migration, and updating the ORM, you'll hand the investigation to Claude Code. With the Vercel and Neon MCP servers, Claude Code can troubleshoot the problem and write a report on the root cause and required fixes.

## Prerequisites

Before you begin, make sure you have the following:

- **Claude Code:** Anthropic's CLI tool, installed. See the [Claude Code docs](https://code.claude.com/docs/en/quickstart#step-1-install-claude-code) for installation instructions.
  <Admonition type="tip" title="Using Cursor, VSCode or other agents?">
  This guide uses Claude Code, but the same workflow works with any AI agent that supports MCP servers. When you add the Vercel and Neon MCP servers, choose the agent you use.
  </Admonition>
- **Neon account and project:** A Neon account with at least one project. Create one in the [Neon Console](https://console.neon.tech) if needed.
- **Vercel account and project:** A Vercel account with your application deployed.

In this demo, we use an example project called `ecommerce-web`, which has a production deployment named `ecommerce-web-prod` on Vercel and is connected to a Neon database. Analytics events are recorded in the `analytics_events` table.

You can follow the guide using your own projects.

<Steps>

## Step 1: Set up the Neon MCP server

The Neon MCP server gives Claude Code tools to work with your Neon database, including creating branches, running SQL queries, and applying migrations. In this scenario, you'll use it to validate database schema changes in an isolated environment.

The simplest way to connect Claude Code to Neon is the [`neon init`](/docs/cli/init) command. Run it in a terminal. It installs agent tooling (either the Neon plugin, or [agent skills](https://github.com/neondatabase/agent-skills) and the MCP server) and links a Neon project.

Run the following in your project directory:

```bash
npx neon@latest init
```

Follow the prompts in your browser to authenticate. Once complete, Claude Code will have access to [Neon MCP tools](/docs/ai/neon-mcp-server#available-tools) and the installed agent skills.

## Step 2: Set up the Vercel MCP server

Add the Vercel MCP server to give Claude Code access to deployments, project state, and runtime logs.

Run the following command:

```bash
npx add-mcp https://mcp.vercel.com
```

When prompted, choose Claude Code as the agent. This connects the Vercel MCP server so Claude Code can use tools like [`get_runtime_logs`](https://vercel.com/docs/agent-resources/vercel-mcp/tools#get_runtime_logs) to fetch logs directly from your deployments.

## Step 3: Investigate the incident

We know marketing events are being dropped, but we still need to prove _why_ the failures are happening in production.

Open your terminal and start a Claude Code session:

```bash
claude
```

Then ask Claude Code to investigate with a focused prompt that includes scope (project), time window, and endpoint. For example:

```text shouldWrap
We are seeing dropped analytics events. Use the Vercel MCP tools to check the production runtime logs for the project 'ecommerce-web-prod' over the last hour. Focus on the `/api/analytics/track` route and find the root cause of the failures.
```

![Claude Code terminal session where the investigation prompt is submitted, then `get_runtime_logs` is used to pull logs for the production deployment and isolate failures on `/api/analytics/track`.](/docs/guides/claude-code-vercel-logs.png)

In this step, Claude Code calls Vercel MCP tools (specifically [`get_runtime_logs`](https://vercel.com/docs/agent-resources/vercel-mcp/tools#get_runtime_logs)) to retrieve production logs and parse relevant stack traces.

From the logs, it identifies a Postgres error indicating a schema mismatch: the application is trying to write fields that do not exist yet in `analytics_events`.

To validate that conclusion, Claude Code then uses Neon MCP tools to inspect the current table schema and confirm which columns are missing.

![Claude Code response showing the verified root cause: the production schema for `analytics_events` is missing expected columns, confirming why inserts are failing.](/docs/guides/claude-code-schema-issue.png)

## Step 4: Safely remediate with Neon branching

Now that the root cause is confirmed, the next step is remediation. Applying Data Definition Language (DDL) statements such as `ALTER TABLE` directly to production is risky because it can lock tables or introduce unexpected runtime impact.

Instead, use Neon branching through MCP to create an isolated copy of production, apply the schema fix there, and validate behavior before touching live traffic.

Prompt Claude Code with the remediation task:

```text shouldWrap
Some steps may have been missed in the rushed deployment. Please run full end-to-end tests using a separate Neon branch and give me a report with the steps and next actions.
```

![Claude Code terminal session showing a remediation prompt that asks the agent to create an isolated Neon branch, apply the fix, and run full validation.](/docs/guides/claude-code-fix-prompt.png)

Claude Code now runs the workflow end to end: it creates a branch from the production database state, applies the required schema updates, and runs tests against that branch.

If validation fails, it can iterate safely on the branch until the issue is resolved. If validation succeeds, you get evidence that the fix works under production-like conditions without risking live data.

![Claude Code output showing successful validation on the Neon branch, including confirmation that the schema update resolves the failing analytics writes.](/docs/guides/claude-code-fix-validation.png)

![Claude Code final report summarizing what changed, what was validated, and concrete next actions for safely promoting the fix to production.](/docs/guides/claude-code-fix-report.png)

Now that the fix has been validated on the branch, the schema change can be promoted to production through your standard release process.

The same pattern applies beyond this scenario: use the Vercel MCP server for observability and root cause analysis, and the Neon MCP server to test changes on a branch before rollout.

</Steps>

## Conclusion

In this guide, Claude Code used the Vercel MCP server to trace dropped analytics events to a missing migration, then used the Neon MCP server to apply and validate the fix on a branch before it reached production. You can apply the same workflow to recurring error triage, regression checks, and pre‑production validation of complex schema changes, with a human reviewing each proposed fix.

## Resources

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
- [Neon MCP server](/docs/ai/neon-mcp-server)
- [Neon branching](/docs/introduction/branching)
- [Vercel MCP server tools](https://vercel.com/docs/agent-resources/vercel-mcp/tools)
- [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)
