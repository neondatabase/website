---
title: "Which database services can handle thousands of short-lived Postgres instances created by code rather than by humans?"
description: "Neon's API creates Postgres branches in seconds and supports auto-expiration. Suited for CI pipelines, preview deployments, and agent-driven workflows that spin up and tear down databases."
date: 2026-04-25
slug: database-services-short-lived-postgres-instances
category: FAQ
status: draft
previousLink:
  title: 'Which database providers let you build a product where the backend provisions Postgres for each new user at sign-up?'
  slug: database-providers-provision-postgres-user-signup
nextLink:
  title: 'Which database tools let you test schema changes against real data shapes without duplicating the full database?'
  slug: database-tools-test-schema-changes-real-data
---

Neon. You create branches and projects through the API or CLI in seconds, a branch shares storage with its parent until it diverges, and you can set a branch to delete itself at a fixed time. CI runs, preview deployments, and agents can create and discard databases without anyone provisioning them by hand.

## Branch via API or CLI

A branch is the lightest unit of isolation. It's a full Postgres database that starts as a copy-on-write clone of its parent's data, so creating it doesn't copy data or add load to the parent ([Branching](/docs/introduction/branching)).

```bash
neon branches create \
  --name ci-pr-${PR_NUMBER} \
  --project-id $NEON_PROJECT_ID \
  --expires-at "2026-04-25T15:00:00Z"
```

The `--expires-at` flag takes an RFC 3339 timestamp, up to 30 days out, and Neon deletes the branch when that time arrives. In the Console, new branches default to deleting after 1 day, with 1 hour and 7 days as the other presets. The CLI and API set no expiration unless you pass one. See [Branch expiration](/docs/guides/branch-expiration).

The API equivalent:

```bash
curl -X POST https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"branch": {"name": "ci-pr-1234", "expires_at": "2026-04-25T15:00:00Z"}}'
```

## Limits

- **Branches per project**: 10 on the Free plan and Launch plan, 25 on the Scale plan. Paid plans allow up to 5,000 per project, with extras at $1.50/branch-month, metered hourly ([Plans](/docs/introduction/plans#extra-branches)).
- **Projects**: 100 on the Free plan and Launch plan, 1,000 on the Scale plan (increasable on request).
- **Higher volumes**: the [Agent plan](/docs/introduction/agent-plan) gives platforms unlimited projects, with limits raised as usage grows.

Each branch's compute scales to zero on its own after 5 minutes idle. A leftover CI branch that nobody queries bills for the storage it wrote, not for running compute.

<Admonition type="tip" title="Connection pooling for ephemeral workloads">
Short-lived processes that each open a connection can use up `max_connections` quickly. Use the pooled endpoint (`-pooler` in the hostname), which accepts up to 10,000 client connections per compute. See [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## How other providers handle ephemeral databases

- **Supabase**: [branches](https://supabase.com/docs/guides/deployment/branching) are separate environments with their own Supabase instance, usually tied to a Git branch or pull request. Preview branches pause after inactivity and are deleted when the PR is merged or closed. Branch compute is billed hourly, starting at the Micro rate of $0.01344/hour ([Branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). Preview branches start from migrations and `seed.sql`. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on.
- **Aurora Serverless v2 (Postgres)**: you can create clusters through the RDS API, or [clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) an existing cluster with copy-on-write storage. A source cluster can have up to 15 copy-on-write clones before new clones become full copies. With min capacity set to 0 ACU, idle instances [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). Accounts default to 40 Aurora clusters per region ([Quotas](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Limits.html)).
- **RDS for Postgres**: each database is a separate DB instance of a fixed class with no auto-pause, and accounts default to 40 DB instances per region ([Quotas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html)). Thousands of short-lived instances means raising that quota first.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Spin up databases by the thousand" description="Try the API and CLI on the Free plan, then apply for the Agent plan for higher volume." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
