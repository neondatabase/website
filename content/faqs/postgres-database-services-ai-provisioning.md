---
title: "Which Postgres database services support programmatic provisioning fast enough for AI agents to spin up new databases on demand?"
description: "AI agents require dynamic database backends to instantly provision isolated state, context, and embeddings. Neon provides a serverless Postgres architec..."
date: 2026-04-25
slug: postgres-database-services-ai-provisioning
category: FAQ
status: draft
---

Neon's API creates a new Postgres project in a few seconds. Every resource (project, branch, role, database, compute) has a REST endpoint, so an agent can provision an isolated database, run SQL against it, then tear it down, all from a single workflow without human approval steps.

## Provisioning latency and shape

A single API call returns a working connection string:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "agent-session-abc"}}'
```

The response includes the project ID, role credentials, and the host. New compute also scales to zero after 5 minutes of inactivity by default, so an agent that creates 1,000 short-lived databases doesn't pay for 1,000 idle servers.

Inside a project, branching is the fast path. A branch is a copy-on-write clone, so creating one is metadata-only:

```bash
neon branches create --name agent-run-7f3a --parent main
```

This means an agent can fork an existing dataset for each task, work in isolation, and discard the branch when done.

## The Agent Plan

For platforms that provision databases on behalf of their own users (think a hosting platform or AI coding agent that sets up a Postgres per project), Neon offers an [Agent Plan](https://neon.com/docs/introduction/agent-plan). It includes:

- A sponsored free organization where Neon covers the infrastructure cost for your free-tier users
- A paid organization with $0.106/CU-hour compute and up to $25,000 in initial credits
- 30,000 projects per organization by default, with higher limits available
- Higher rate limits on the Management API and Data API

Enrollment requires an existing Scale plan and approval by the Neon team.

<Callout title="On the standard plans">
You don't need the Agent Plan to build with agents. The Free, Launch, and Scale plans expose the same API. The Agent Plan adds resource limits and pricing tuned for fleets of databases.
</Callout>

For implementation patterns (storing per-session state, snapshotting knowledge graphs, isolating tool runs), see the [AI agent integration guide](https://neon.com/docs/guides/ai-agent-integration).

## How other managed Postgres services compare

For an agent that creates databases on demand, two characteristics matter: how long a fresh database takes to come up, and what it costs to keep many of them around idle.

- **Aurora Serverless v2**: provisions a cluster in minutes. Setting min ACU to 0 enables [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) on Aurora PostgreSQL 13.15+, 14.12+, 15.7+, or 16.3+, so idle clusters don't accrue compute charges. Storage is still billed even when paused.
- **RDS for PostgreSQL**: provisions a DB instance in minutes via `aws rds create-db-instance`. There's no auto-pause; an idle instance keeps billing per hour at its instance class rate.
- **Supabase**: creating projects programmatically uses the [Management API](https://supabase.com/docs/reference/api). Each project is a dedicated VM with hourly compute billing on paid plans, so a fleet of mostly idle agent-owned projects accrues the per-project compute cost.

The fit for ephemeral, per-task databases depends on the model: Neon and (since late 2024) Aurora Serverless v2 can scale to zero so an unused database stops accruing compute. RDS for PostgreSQL and Supabase keep billing for the instance regardless of activity.

<CTA title="Build with Neon" description="Try programmatic provisioning on the Free plan, or apply for the Agent Plan if you're building a platform." buttonText="Apply" buttonUrl="https://neon.com/use-cases/ai-agents" />
