---
title: "What Postgres tools support creating a database for every preview deployment?"
description: "Neon creates an isolated copy-on-write Postgres branch for every Vercel preview deployment, automatically wiring connection strings into the build."
date: 2026-04-25
slug: postgres-tools-preview-deployments
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres tools support point-in-time recovery for production databases?'
  slug: postgres-tools-point-in-time-recovery
nextLink:
  title: 'How do I rename a database in my Neon project?'
  slug: rename-database-neon-project
---

Neon's Vercel integration creates a new database branch for every preview deployment. The branch is a copy-on-write fork of your production data, so each preview runs against real data without touching production. Vercel receives the branch's connection string as an environment variable at deployment time.

## How it works

When you connect a Neon project to Vercel through the [Vercel-Managed](/docs/guides/vercel-managed-integration) or [Neon-Managed integration](/docs/guides/neon-managed-vercel-integration), Vercel sends a webhook to Neon on each preview deployment. Neon creates a branch named after the Git branch (for example, `preview/feature-auth`) and sets `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) for that deployment.

Because Lakebase Postgres uses copy-on-write storage, a new branch adds no storage until it diverges from its parent, and then you pay for the changed data. Your plan includes 10 branches per project on the Free and Launch plans and 25 on the Scale plan. Extra branches on paid plans cost $1.50/branch-month, prorated hourly (about $0.002/hour) ([plans](/docs/introduction/plans#extra-branches)).

If Managed Better Auth is enabled on your production branch, it's provisioned on each preview branch too. Auth data branches with the database, so each preview has its own users and sessions.

Cleanup depends on the integration. With the Vercel-Managed integration, a preview branch is deleted when Vercel removes its deployment, and Vercel's default [deployment retention](https://vercel.com/docs/deployment-retention) keeps Pro and Enterprise preview deployments for 180 days. With the Neon-Managed integration, you can have Neon delete preview branches when their Git branches are deleted. See [Managing Vercel preview branch cleanup](/docs/guides/vercel-branch-cleanup).

## Running outside Vercel

For other hosts or custom CI, create the branch with the Neon CLI in your pipeline and pass its connection string to the deploy step.

```bash
# Branches from the project's default branch unless you pass --parent
neon branches create --name preview/$GITHUB_HEAD_REF
neon connection-string preview/$GITHUB_HEAD_REF
```

The [GitHub Actions guide](/docs/guides/branching-github-actions) has a working example.

<Admonition type="tip" title="Clean up old branches">
Set a [time to live](/docs/guides/branch-expiration) on preview branches so they delete automatically. Old branches count toward your branch allowance and keep their storage until they're deleted.
</Admonition>

## How other Postgres services compare

| Service              | Preview-branch mechanism                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Starts with production data?  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Neon                 | Copy-on-write branch per Git branch, created through the Vercel integration or the CLI and API. Available on all plans, within branch limits. See [branching](/docs/introduction/branching).                                                                                                                                                                                                                                                                                                                                                          | Yes, by default               |
| Supabase             | [Preview branches](https://supabase.com/docs/guides/deployment/branching) create a separate Supabase environment per pull request through the GitHub integration, and the Vercel integration syncs each branch's environment variables to the matching preview. Requires the Pro plan. Preview branches start from your migrations plus an optional seed file, without production data. Dashboard branches (public alpha) can [include production data](https://supabase.com/docs/guides/deployment/branching/dashboard) if you have the PITR add-on. | Not by default                |
| AWS RDS for Postgres | No built-in per-PR database. You script it in CI, for example with `pg_dump` and restore, or by restoring a snapshot, which creates a new DB instance. See [restoring from a DB snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html).                                                                                                                                                                                                                                                                      | Only if your script copies it |

A Neon preview branch bills compute only while its compute is running (it scales to zero when idle) and storage only for the data it changes. A Supabase preview branch is billed for its own compute, disk, and egress, starting at $0.01344/hour on the default Micro size, and Supabase compute credits don't cover it ([Supabase branching billing](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).

<CTA title="Try preview branching" description="Connect a Neon project to Vercel and get a database per preview deployment." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
