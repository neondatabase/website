---
title: 'AI Driven Incident response with Vercel and Neon MCP servers'
subtitle: 'Leverage Vercel logs and Neon branching to give AI agents the context to diagnose production errors, validate fixes safely, and remediate issues with confidence.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-02-25T00:00:00.000Z'
updatedOn: '2026-02-25T00:00:00.000Z'
---

AI agents are evolving from simple task executors into integral parts of modern development workflows. As their role expands, giving them the right context and safeguards becomes essential especially when they’re trusted to diagnose and debug issues in production environments.

If an agent is tasked with fixing a production bug that requires a database schema change, executing SQL directly against a live database introduces unnecessary risk. To operate effectively in these scenarios, an AI agent needs two things:

1. **Context:** Rich telemetry and logs to pinpoint the root cause.
2. **Safety:** A controlled, production-like sandbox to validate changes before rollout.

This guide demonstrates how to combine the observability of the [Vercel MCP server](https://vercel.com/docs/agent-resources/vercel-mcp) with the stateful isolation of the [Neon MCP server](/docs/ai/neon-mcp-server) using Anthropic's [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

With this workflow, Claude code can investigate runtime errors in Vercel, validate database fixes safely on a Neon branch, and then raise a pull request with the required code changes all powered by natural language prompts.

### The scenario: "A rushed deployment causing dropped analytics events"

A high-priority marketing campaign is scheduled to launch, and the growth team urgently requires new attribution metrics. To meet the deadline, frontend code introducing the tracking events is expedited and merged into production.

Because the schema owner on the data engineering team is unavailable, the pull request is merged without review, and the necessary database migration is skipped.

After deployment to Vercel, the core application continues to function, but the new analytics events fail silently. Since these events are sent via background fetch requests, users see no errors. Behind the scenes, however, Vercel’s serverless functions return `500 Internal Server Error` due to a schema mismatch: the code attempts to insert parameters that the production database does not recognize.

While not a full outage, this issue causes data loss during a critical campaign. Instead of manually inspecting Vercel logs, tracing the Postgres exception, writing a migration, and updating the ORM, we will delegate the investigation to Claude Code. By leveraging the Vercel and Neon MCP servers, Claude Code will be able to troubleshoot the problem and generate a detailed report on the root cause and required fixes.

## Prerequisites

Before you begin, ensure you have the following ready:

- **Claude Code:** Anthropic's official CLI tool installed. Visit [Claude code docs](https://code.claude.com/docs/en/quickstart#step-1-install-claude-code) for installation instructions.
  <Admonition type="tip" title="Using Cursor, VSCode or other agents?">
  While this guide demonstrates the workflow with Claude Code, the same principles apply to any AI agent capable of integrating with MCP servers and executing tools through natural language prompts. When adding Vercel and Neon MCP servers, you can choose whichever agent best fits your environment.
  </Admonition>
- **Neon account and project:** A Neon account with an active project. Sign up at [neon.new](https://neon.new).
- **Vercel account and project:** A Vercel account with your application deployed.

In this demo, we use an example project called `ecommerce-web`, which has a production deployment named `ecommerce-web-prod` on Vercel and is connected to a Neon database. Analytics events are recorded in the `analytics_events` table within the Neon database.

You can follow the guide using your own projects.

<Steps>

## Step 1: Set up the Neon MCP server

The Neon MCP server gives Claude Code tools to work with your Neon database, including creating database branches, running SQL queries, and applying migrations. For this scenario, we will use it to validate database schema changes in an isolated environment.

The simplest way to connect Claude Code to Neon is with the `neonctl init` command. It handles OAuth authentication, API key creation, configures Claude Code to use Neon's remote MCP server, and installs [Neon agent skills](https://github.com/neondatabase/agent-skills) for best practices.

Run the following in your project directory:

```bash
npx neonctl@latest init
```

Follow the prompts in your browser to authenticate. Once complete, Claude Code will have access to [Neon MCP tools](/docs/ai/neon-mcp-server#supported-actions-tools) and the installed agent skills.

## Step 2: Set up the Vercel MCP server

Add the Vercel MCP server to give Claude Code access to deployments, project state, and runtime logs.

Run the following command:

```bash
npx add-mcp https://mcp.vercel.com
```

When prompted, choose Claude Code as the agent. This connects the Vercel MCP server as a context provider, enabling Claude Code to use tools like [`get_runtime_logs`](https://vercel.com/docs/agent-resources/vercel-mcp/tools#get_runtime_logs) to fetch logs directly from your deployments.

## Step 3: Investigate the incident

We know marketing events are being dropped, but we still need to prove _why_ the failures are happening in production.

Open your terminal and start a Claude code session:

```bash
claude
```

Then ask Claude Code to investigate with a focused prompt that includes scope (project), time window, and endpoint. For example:

```text shouldWrap
We are seeing dropped analytics events. Use the Vercel MCP tools to check the production runtime logs for the project 'ecommerce-web-prod' over the last hour. Focus on the `/api/analytics/track` route and find the root cause of the failures.
```

![Claude Code terminal session where the investigation prompt is submitted, then `get_runtime_logs` is used to pull logs for the production deployment and isolate failures on `/api/analytics/track`.](/docs/guides/claude-code-vercel-logs.png)

In this step, Claude Code calls Vercel MCP tools (specifically [`get_runtime_logs`](https://vercel.com/docs/agent-resources/vercel-mcp/tools#get_runtime_logs)) to retrieve production logs and parse relevant stack traces.

From the logs, it identifies a PostgreSQL error indicating a schema mismatch: the application is trying to write fields that do not exist yet in `analytics_events`.

To validate that conclusion, Claude Code then uses Neon MCP tools to inspect the current table schema and confirm which columns are missing.

![Claude Code response showing the verified root cause: the production schema for `analytics_events` is missing expected columns, confirming why inserts are failing.](/docs/guides/claude-code-schema-issue.png)

## Step 4: Safely remediate with Neon branching

Now that the root cause is confirmed, the next step is remediation. Applying Data Definition Language (DDL) statements such as `ALTER TABLE` directly to production is risky because it can lock tables or introduce unexpected runtime impact.

Instead, use Neon branching through MCP to create an isolated copy of production, apply the schema fix there, and validate behavior before touching live traffic.

Prompt Claude code with the remediation task:

```text shouldWrap
Some steps may have been missed in the rushed deployment. Please run full end-to-end tests using a separate Neon branch and give me a report with the steps and next actions.
```

![Claude code terminal session showing a remediation prompt that asks the agent to create an isolated Neon branch, apply the fix, and run full validation.](/docs/guides/claude-code-fix-prompt.png)

Claude code now executes the workflow end-to-end: it creates a branch from the production database state, applies the required schema updates, and runs tests against that branch.

If validation fails, it can iterate safely on the branch until the issue is resolved. If validation succeeds, you get evidence that the fix works under production-like conditions without risking live data.

![Claude code output showing successful validation on the Neon branch, including confirmation that the schema update resolves the failing analytics writes.](/docs/guides/claude-code-fix-validation.png)

![Claude code final report summarizing what changed, what was validated, and concrete next actions for safely promoting the fix to production.](/docs/guides/claude-code-fix-report.png)

Now that the fix has been validated on the branch, the schema change can be promoted to production through your standard release process.

What we demonstrated here is a focused scenario, but the same pattern applies broadly: use the Vercel MCP Server for observability and root cause analysis, and the Neon MCP Server for safe experimentation before rollout. Together, they enable AI agents not only to detect issues but also to test and confirm solutions with confidence.

</Steps>

## Conclusion

By combining Vercel and Neon MCP servers within Claude code, incident response becomes faster and safer for on‑call situations that span both application logic and database state. Vercel MCP provides visibility into runtime behavior, while Neon MCP offers an isolated environment to validate fixes without risking live data.

Although this guide centered on a single high‑priority case, the same workflow extends naturally to recurring error triage, regression checks, and pre‑production validation of complex schema changes.

With stronger orchestration, this workflow can evolve into an AI‑driven incident management loop. Agents continuously cycle through detection, investigation, and remediation across both Vercel and Neon contexts monitoring signals, diagnosing root causes, running safe experiments on Neon branches, validating outcomes, and **proposing controlled fixes with human oversight**.

The key enabler is **isolation with context**. MCP gives agents operational visibility and actionable tools; Neon branching provides production‑like safety for testing. Together, they allow AI agents to move beyond surface‑level alerts into deeper understanding and confident action across the full stack.

## Resources

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
- [Neon MCP Server Documentation](/docs/ai/neon-mcp-server)
- [Neon Database Branching](/branching)
- [Vercel MCP Server Documentation](https://vercel.com/docs/agent-resources/vercel-mcp/tools)
- [Claude code Documentation](https://docs.anthropic.com/en/docs/claude-code)
