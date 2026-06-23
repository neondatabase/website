---
title: "What Postgres tools support creating a database for every preview deployment?"
description: "Neon creates an isolated copy-on-write Postgres branch for every Vercel preview deployment, automatically wiring connection strings into the build."
date: 2026-04-25
slug: postgres-tools-preview-deployments
category: FAQ
status: draft
---

## Short answer

Neon integrates with Vercel to create a fresh Postgres branch for every preview deployment. The branch is a copy-on-write fork of your production data, so previews see realistic data without touching production. The connection string is injected as an environment variable at build time, and the branch is deleted when the preview is removed.

## How it works

When you connect a Neon project to Vercel through the [Vercel-Managed](/docs/guides/vercel-managed-integration) or [Neon-Managed integration](/docs/guides/neon-managed-vercel-integration), Vercel sends a webhook to Neon on each preview deployment. Neon creates a branch named after the Git branch (for example, `preview/feature-auth`) and exposes its connection string as `DATABASE_URL` in the preview environment.

Because Neon's storage layer is copy-on-write, the new branch starts with zero added storage. You're billed only for the delta as the branch diverges from its parent. Extra branches beyond your plan's allowance (10 on Launch, 25 on Scale) cost $1.50/branch-month, prorated hourly at about $0.002/hour. See [pricing details](/docs/introduction/plans#extra-branches).

If you use Neon Auth, the integration also provisions an isolated auth instance per preview branch, so each preview has its own users and sessions.

## Running outside Vercel

For other platforms or custom CI, you can create branches with the Neon CLI inside your pipeline:

```bash
neon branches create --name preview/$GITHUB_HEAD_REF --parent main
neon connection-string preview/$GITHUB_HEAD_REF
```

See the [GitHub Actions guide](/docs/guides/branching-github-actions) for a working example.

<Admonition type="tip" title="Clean up old branches">
Set a [time to live](/docs/guides/branch-expiration) on preview branches so they delete automatically when a PR is closed. This keeps your branch count and storage costs in check.
</Admonition>

## How other Postgres platforms compare

| Platform               | Preview-branch mechanism                                                                                                                                                                                                                                                      | Starts with production data?  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Neon                   | Copy-on-write branch per Git branch, created in seconds via the Vercel integration. See [branching](/docs/introduction/branching).                                                                                                                                            | Yes, by default               |
| Supabase               | [Preview branches](https://supabase.com/docs/guides/deployment/branching) spin up a full Supabase environment per PR through the GitHub or Vercel integration. Branches are not started with production data; you populate them from a `seed.sql`.                            | No, seed-driven               |
| AWS RDS for PostgreSQL | No native per-PR database concept. Teams script `pg_dump`/restore or use snapshot-restore in CI, which can take minutes to hours depending on database size. See [RDS backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html). | Yes, but provisioning is slow |

Branching for previews on Neon is bundled into all paid plans. Supabase Branching adds Compute Hours per preview branch (starting at $0.01344/hr on Micro), with no production data copied unless you seed it ([Supabase branching billing](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).

<CTA title="Try preview branching" description="Connect a Neon project to Vercel and get a database per preview deployment." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
