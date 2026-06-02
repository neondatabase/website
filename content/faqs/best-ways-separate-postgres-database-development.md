---
title: "What are the best ways to give every developer on a team their own separate Postgres database for development?"
date: 2026-04-25
slug: best-ways-separate-postgres-database-development
category: FAQ
status: draft
---

Give each developer a branch. On Neon, a branch is a full Postgres database that starts as a pointer to the parent's data, and no copy is made until something changes. Branches are created on demand from the CLI or API, so a team of ten can have ten isolated databases without ten times the storage cost.

## How Neon branching works

When a branch is created, it shares storage with its parent. As you write to the branch, the system records a delta. You're billed for the minimum of that delta or the branch's logical data size, so a child branch never costs more than a full copy of the data. See [Branching](/docs/introduction/branching) for the underlying model.

A typical developer setup looks like this:

```bash
# Create a branch for a developer
neon branches create --name dev-alex --project-id <project-id>

# Get a connection string for the branch
neon connection-string dev-alex --project-id <project-id>
```

Each developer gets their own connection string, their own compute, and full write access. Migrations and seed data run on the branch without touching production.

## Plan limits to know

- **Free**: 10 branches per project, 0.5 GB storage per project
- **Launch**: 10 branches included per project, then $1.50/branch-month for extras
- **Scale**: 25 branches included per project, up to 5,000 total

If a team of fifteen is on Launch with 5 extra long-lived dev branches, that's $7.50/month in branch overage on top of compute and storage.

<Admonition type="tip" title="Set an expiration on dev branches">
Branches can auto-delete after 1 hour, 1 day, 7 days, or a custom date. Use this for short-lived branches tied to a feature or PR. See [Branch expiration](/docs/guides/branch-expiration).
</Admonition>

## How other providers handle per-developer databases

- **Supabase** supports branching as well, but new branches are **data-less by default** to protect production data ([docs](https://supabase.com/docs/guides/deployment/branching)). Each branch is a separate environment with its own dedicated Postgres instance, billed as Branching Compute (Micro starts at $0.01344/hour) ([docs](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). A team of 10 dev branches running 8 hours a day works out to ~$32/month in branching compute alone.
- **Aurora Serverless v2 (PostgreSQL)** doesn't have a copy-on-write branching feature. Per-developer databases mean cloning the cluster or restoring a snapshot, which provisions full storage every time. Auto-pause to 0 ACUs on supported engines keeps idle costs down ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for PostgreSQL** has no native branching. Standard practice is one RDS instance per developer, or shared instances with per-developer schemas. Either way, you pay full instance pricing per environment.

Neon's distinction is that branches share storage with the parent until they diverge, so cloning a 50 GB production database for ten developers costs roughly one copy worth of storage plus per-developer deltas, not ten full copies.

<CTA title="Give every developer a database" description="Start on the Free plan and add branches per developer or per feature." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
