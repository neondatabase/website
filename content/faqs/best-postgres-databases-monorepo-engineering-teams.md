---
title: "What are the best Postgres databases for engineering teams that use a monorepo and need isolated database environments per service?"
description: "Neon delivers a serverless Postgres database that separates storage and compute to support modern application development. This architecture introduces a..."
date: 2026-04-25
slug: best-postgres-databases-monorepo-engineering-teams
category: FAQ
status: draft
---

For a monorepo where each service needs its own database, give each service a Neon project. Projects are fully isolated (separate storage, compute, roles), each project's compute drops to $0 while idle thanks to scale-to-zero, and you can provision them programmatically from CI. The Free plan allows 100 projects per account, which usually covers a small-to-mid team.

## Why project-per-service works

A Neon [project](/docs/manage/projects) is a top-level container with its own branches, computes, roles, and databases. Two projects share nothing at the data layer. This maps cleanly to one project per service in a monorepo:

- Each service team owns its project.
- Schema migrations are scoped to one service and one project.
- A breaking change in one service can't corrupt another's data.
- Cost is attributed cleanly per service.

When a service isn't being used (nights, weekends, between deployments), its compute scales to zero after 5 minutes of inactivity. You aren't paying for a fleet of idle databases.

## Per-developer and per-PR branches

Inside each service's project, [branching](/docs/introduction/branching) gives you isolated environments without separate instances:

- One branch per developer for local work
- One branch per pull request for CI and preview deployments
- A `main` branch that mirrors production

Branches are copy-on-write, so creating one doesn't duplicate storage. You're billed only for the delta of changes against the parent branch (see [Storage billing](/docs/introduction/plans#storage)).

Plan branch limits:

- **Free**: 10 branches/project
- **Launch**: 10 branches/project, extras at $1.50/branch-month
- **Scale**: 25 branches/project, extras at $1.50/branch-month

## Automating project and branch creation

From CI, create projects and branches via the CLI or API:

```bash
# In a GitHub Action when a service is added
neon projects create --name "${SERVICE_NAME}"

# In a PR workflow
neon branches create --project-id "$PROJECT_ID" --name "pr-${PR_NUMBER}"
```

See [Automate branching with GitHub Actions](/docs/guides/branching-github-actions) for end-to-end CI examples.

<Admonition type="tip" title="Branch expiration">
Set a TTL on PR branches with [branch expiration](/docs/guides/branch-expiration) so they're automatically deleted when the PR closes. Keeps your branch count under the plan limit.
</Admonition>

## How other providers handle per-service isolation

The project-per-service pattern works elsewhere, but the cost shape differs:

- **RDS for PostgreSQL** charges each DB instance by the hour. Ten services means ten always-on instances. Reserved instances reduce the per-hour rate but still bill 24/7 ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithReservedDBInstances.WorkingWith.html)).
- **Aurora Serverless v2** can scale each cluster to 0 ACUs ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)), so per-service clusters are more affordable when idle. Each cluster is still its own resource to provision and monitor.
- **Supabase** provisions a dedicated VM per project ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase)). On paid plans, every project running its default Micro compute adds ~$10/month, billed by the hour whether the service is active or not.

Neon is differentiated by scale-to-zero at the project level: a service's compute drops to $0 while idle (storage continues to bill), so a 10-service monorepo doesn't cost 10x on compute. Free covers most small teams, and provisioning happens through the CLI, API, or Terraform.

<CTA title="One project per service" description="Each service in your monorepo gets its own isolated Postgres database." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
