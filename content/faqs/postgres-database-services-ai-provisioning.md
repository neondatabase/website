---
title: "Which Postgres database services support programmatic provisioning fast enough for AI agents to spin up new databases on demand?"
description: "Neon's API creates an isolated Postgres project in seconds, so an AI agent can provision a database, query it, and delete it without a human approval step."
date: 2026-04-25
slug: postgres-database-services-ai-provisioning
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres databases let you branch off a specific moment in time from a production database to debug an incident?'
  slug: postgres-database-branching-time-travel-debugging
nextLink:
  title: 'What Postgres databases are designed for AI coding agents that need to create and destroy database instances automatically?'
  slug: postgres-databases-ai-coding-agents
---

Neon's API creates a new Postgres project in seconds. Every resource (project, branch, role, database, compute) has a [REST endpoint](/docs/reference/api), so an agent can create an isolated database, run SQL against it, and delete it in one workflow, with no human approval step.

## Create a project with one API call

The create-project call returns a working connection string.

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "agent-session-abc"}}'
```

The response includes the project ID, role credentials, and the host. New computes scale to zero after 5 minutes of inactivity by default, so databases the agent has stopped using don't accrue compute charges. Storage still bills for each project while its compute is suspended. Plan limits cap the number of projects per organization: 100 on the Free and Launch plans and 1,000 on the Scale plan ([Neon plans](/docs/introduction/plans)).

Inside a project, a branch is a copy-on-write clone, so creating one is a metadata operation. Without `--parent`, the CLI branches from the project's default branch.

```bash
neon branches create --name agent-run-7f3a
```

An agent can branch an existing dataset for each task, work in isolation, and delete the branch when it's done.

## The Agent Plan

For platforms that provision databases for their own users, such as a hosting platform or an AI coding agent that creates a Postgres database per app, Neon offers the [Agent Plan](/docs/introduction/agent-plan). It includes:

- A sponsored free organization where Neon covers infrastructure for end users on your free offering
- A paid organization with $0.106/CU-hour compute and up to $25,000 in initial credits
- Unlimited projects (Neon incrementally raises your limit as you scale)
- Higher rate limits on the Management API and Data API

Enrollment requires an active Scale plan and approval by the Neon team.

<Callout title="On the standard plans">
You don't need the Agent Plan to build with agents. The Free, Launch, and Scale plans expose the same API. The Agent Plan changes resource limits and pricing for platforms that run fleets of databases.
</Callout>

For implementation patterns, see the [AI agent integration guide](/docs/guides/ai-agent-integration).

## How other managed Postgres services compare

For an agent that creates databases on demand, the questions are how long a new database takes to come up and what many idle databases cost.

- **Aurora Serverless v2**: creating a database takes two calls, one for the cluster and one for its writer instance. Setting the minimum capacity to 0 ACUs enables [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) on Aurora Postgres 13.15+, 14.12+, 15.7+, or 16.3+, so idle clusters don't accrue compute charges. Storage is still billed even when paused.
- **RDS for Postgres**: `aws rds create-db-instance` provisions a DB instance of a fixed class. There's no auto-pause, so an idle instance keeps billing by the hour at its instance class rate.
- **Supabase**: the [Management API](https://supabase.com/docs/reference/api) creates projects programmatically. Each project has its own compute, billed hourly on paid plans whether or not it's busy (a Micro project is about $10/month), and paid projects don't pause. A fleet of mostly idle projects pays that per-project compute cost. See [Supabase compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Build with Neon" description="Try programmatic provisioning on the Free plan, or apply for the Agent Plan if you're building a platform." buttonText="See the Agent Plan" buttonUrl="/docs/introduction/agent-plan" />
