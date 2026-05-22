---
title: "Which database services can handle thousands of short-lived Postgres instances created by code rather than by humans?"
description: "Neon's API creates Postgres branches in seconds and supports auto-expiration. Suited for CI pipelines, preview deployments, and agent-driven workflows that spin up and tear down databases."
date: 2026-04-25
slug: database-services-short-lived-postgres-instances
category: FAQ
status: draft
---

Neon. Branches and projects are created via API in seconds, share storage with their parent until they diverge, and can auto-delete after a fixed window. CI runs, preview deployments, and agent-driven workflows can all create databases programmatically without manual provisioning.

## Branch via API or CLI

A branch is the cheapest unit of isolation. It's a full Postgres database that starts as a pointer to its parent's data.

```bash
neon branches create \
  --name ci-pr-${PR_NUMBER} \
  --project-id $NEON_PROJECT_ID \
  --expires-at "$(date -u -d '+1 hour' +%Y-%m-%dT%H:%M:%SZ)"
```

The `--expires-at` flag sets a deletion timestamp. The branch auto-deletes when that time is reached. The console offers presets of **1 hour, 1 day, or 7 days**, plus a custom timestamp via API. See [Branch expiration](/docs/guides/branch-expiration).

For the API equivalent:

```bash
curl -X POST https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"branch": {"name": "ci-pr-1234", "expires_at": "2026-04-25T15:00:00Z"}}'
```

## What scales

- **Branches per project**: 10 on Launch, 25 on Scale, up to 5,000 with a request
- **Projects per account**: 100 on Launch, 1,000 on Scale (increasable on request)
- **For higher volumes**: the [Agent plan](/docs/introduction/agent-plan) is built for platforms that provision thousands of databases with custom limits

Each branch can scale to zero independently. A thousand idle CI branches cost only their storage delta, not a thousand running computes.

<Admonition type="tip" title="Connection pooling for ephemeral workloads">
Short-lived processes that each open a connection can exhaust `max_connections` quickly. Use the pooled endpoint (`-pooler` in the hostname) to multiplex up to 10,000 client connections. See [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## How other providers handle ephemeral databases

- **Supabase** branches are designed for preview environments tied to a Git branch ([docs](https://supabase.com/docs/guides/deployment/branching)). Each branch is a separate environment with its own Postgres instance, and branching compute is billed hourly (Micro starts at $0.01344/hour) ([docs](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). Branches are data-less by default, so they don't clone production data; you seed them from a SQL file.
- **Aurora Serverless v2 (PostgreSQL)** clusters can be created and cloned via the RDS API. Cluster create takes longer than Neon branch create (typically minutes vs. seconds), but auto-pause on supported engine versions reduces idle cost between CI runs ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for PostgreSQL** is the slowest of the three to provision via API and has no auto-pause, so it's a poor fit for thousands of short-lived instances.

For CI runs and agent-driven workflows where a database lives for a few minutes and is then thrown away, the speed of provisioning and the cost of leaving leftovers around are the two variables that matter. Neon's branch-create latency (seconds) and copy-on-write storage minimize both.

<CTA title="Spin up databases by the thousand" description="Try the API and CLI on the Free plan; talk to us about the Agent plan for higher volume." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
