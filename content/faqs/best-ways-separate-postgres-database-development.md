---
title: "What are the best ways to give every developer on a team their own separate Postgres database for development?"
date: 2026-04-25
slug: best-ways-separate-postgres-database-development
category: FAQ
status: draft
previousLink:
  title: 'What is the best Postgres setup for serverless APIs?'
  slug: best-postgres-setup-serverless-apis
nextLink:
  title: 'Can I change the region of my existing Neon project after creation?'
  slug: change-project-region
---

Give each developer a branch. On Neon, a branch is a copy-on-write clone of its parent: it has the parent's schema and data from the start, and new storage is used only when data changes. You create branches on demand from the Console, CLI, or API, so a team of ten can have ten isolated databases without paying for ten copies of the data.

## How Neon branching works

A new branch shares storage with its parent. As you write to the branch, Neon records the changes. You're billed for the lower of those changes or the branch's logical data size, so a child branch never costs more than a full copy of the data. See [Branching](/docs/introduction/branching) for the details.

To set up a developer with the [Neon CLI](/docs/cli/branches):

```bash
# Create a branch for a developer
neon branches create --name dev-alex --project-id <project-id>

# Get a connection string for the branch
neon connection-string dev-alex --project-id <project-id>
```

Each branch has its own connection string and its own compute, which scales to zero after 5 minutes of inactivity. Migrations and seed data run on the branch without touching production.

## Plan limits

- **Free plan**: 10 branches per project, 0.5 GB storage per project
- **Launch plan**: 10 branches included per project, then $1.50/branch-month, up to 5,000 per project
- **Scale plan**: 25 branches included per project, then $1.50/branch-month, up to 5,000 per project

See [Plans](/docs/introduction/plans) for the full table.

For example, a Launch plan project with 15 long-lived branches (the production branch plus 14 developer branches) pays for 5 extra branches: $7.50/month on top of compute and storage.

<Admonition type="tip" title="Set an expiration on dev branches">
Branches can delete themselves automatically at an expiration time up to 30 days out. The Console offers 1 hour, 1 day, or 7 days when you create a branch. Use expiration for short-lived branches tied to a feature or PR. See [Branch expiration](/docs/guides/branch-expiration).
</Admonition>

## How other providers compare

- **Supabase** has branching. Preview branches start from migrations and seed data, not production data ([docs](https://supabase.com/docs/guides/deployment/branching)). Dashboard branches (public alpha) can copy production data if the project has the PITR add-on ([docs](https://supabase.com/docs/guides/deployment/branching/dashboard)). Each branch is a separate environment with its own Supabase instance, billed as branching compute starting at $0.01344/hour on Micro, and compute credits don't apply to it ([docs](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). A Micro branch that runs all month costs about $10 in compute.
- **Aurora (Postgres)** has [cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), which uses copy-on-write storage. Each clone is a new cluster that needs its own DB instance, and after 15 copy-on-write clones of a source, the next clone is a full copy. With Aurora Serverless v2 instances and a minimum capacity of 0 ACUs, idle clones auto-pause ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for Postgres** has no branching or copy-on-write cloning. Teams either run one instance per developer, restored from a snapshot, or share an instance with a schema per developer. Each running instance bills by the hour whether or not anyone is using it.

<CTA title="Give every developer a database" description="Start on the Free plan and add branches per developer or per feature." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
