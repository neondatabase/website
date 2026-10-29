---
title: "Which Postgres platforms support branching a database like Git?"
description: "Neon, Supabase, and Xata all offer Git-style Postgres branching. Lakebase Postgres branches are copy-on-write, instant to create, and ship with auto-expiration policies (1 hour, 1 day, 7 days)."
date: 2026-04-25
slug: postgres-platforms-database-branching-git
category: FAQ
status: draft
previousLink:
  title: 'What Postgres should I use for a Next.js app deployed on Vercel?'
  slug: postgres-nextjs-vercel-integration
nextLink:
  title: 'What Postgres platforms provide safe testing for risky migrations?'
  slug: postgres-platforms-safe-testing-migrations
---

Neon, Supabase, and Xata all support Git-style Postgres branching. Lakebase Postgres branches are copy-on-write at the storage layer: a new branch starts as a pointer to the parent's state and stores only the pages it changes. Creating a branch takes seconds regardless of database size, and it adds no storage until you write to it.

## How Lakebase Postgres branching works

A branch on Neon is a writable copy of your database at a point in time. Behind the scenes:

1. Storage is versioned at the page level. Creating a branch records a new pointer to the parent's state.
2. The branch gets its own compute and connection string, and that compute scales to zero independently of the parent.
3. As you write to the branch, only changed pages are stored. Child branch storage is billed at the smaller of the changes since creation or the logical data size ([pricing](/docs/introduction/plans#storage)).

A branch also carries the other services enabled on the parent, such as Managed Better Auth and Object Storage ([Branch your backend](/docs/concepts/branch-your-backend)).

Create one from the CLI:

```bash
neon branches create --name dev/migration-test --parent production
```

Use your default branch name as the parent: `production` for projects created in the Console, `main` for projects created with the CLI or API.

Or branch from a past timestamp:

```bash
neon branches create --name pre-incident \
  --parent 2026-04-25T14:00:00Z
```

## Branches per plan

- **Free plan**: 10 branches per project
- **Launch plan**: 10 included, then $1.50/branch-month
- **Scale plan**: 25 included, then $1.50/branch-month

Paid plans allow up to 5,000 branches per project.

## Auto-expiration

Stale branches accumulate storage cost. Set a [branch expiration](/docs/guides/branch-expiration) when you create one:

- 1 hour, 1 day, or 7 days from the Console
- Any RFC 3339 timestamp on the CLI (`--expires-at`) or API (`expires_at`), up to 30 days ahead

Neon deletes the branch when it expires. For preview-per-PR workflows, that removes branches even if your cleanup job never runs.

## How others compare

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) creates a separate environment per Git pull request and runs your migrations on it. Branches from the GitHub integration [start without production data](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding) and seed from `seed.sql`; dashboard branches (public alpha) can [include a copy of production data](https://supabase.com/docs/guides/deployment/branching/dashboard) when the project has the PITR add-on. Each branch is billed for its own compute, [from $0.01344/hour](https://supabase.com/docs/guides/platform/manage-your-usage/branching) on Micro. Preview branches auto-pause after inactivity, and [paused projects don't count toward compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

- **Xata.** [Xata branches](https://xata.io/docs/core-concepts/branching) use copy-on-write storage snapshots and include the parent's schema and data. Each running branch has its own compute instance, billed hourly, and can hibernate after 15 minutes to 3 hours of inactivity.

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) uses copy-on-write over the same storage volume and includes the source data. Each clone is a new DB cluster in the same AWS Region with at least one DB instance. After 15 copy-on-write clones of a source, the next one is a full copy. There's no built-in PR integration.

- **Amazon RDS for Postgres.** There's no native branching. The closest workflow is restoring a snapshot to a new instance per environment, which materializes the full dataset.

Lakebase Postgres branches include parent data by default and ship with [auto-expiration](/docs/guides/branch-expiration). Idle branch compute stops accruing CU-hours; the branch's storage delta still bills.

<CTA title="Branch your Postgres database in seconds" description="Free plan includes 10 branches per project." buttonText="Try it free" buttonUrl="https://console.neon.tech/signup" />
