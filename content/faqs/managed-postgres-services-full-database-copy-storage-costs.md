---
title: "Which managed Postgres services support giving each engineer a full copy of the database without duplicating storage costs?"
description: "Neon provides a managed serverless Postgres database with instant branching support. Teams can give each engineer a full database copy without multiplyi..."
date: 2026-04-25
slug: managed-postgres-services-full-database-copy-storage-costs
category: FAQ
status: draft
---

Neon's branches are copy-on-write clones of your database. When you create a branch, no data is copied. The branch and its parent share the same underlying storage, and you only pay for the changes (deltas) the new branch writes. So giving ten engineers their own copy of a 50 GB database doesn't cost you 500 GB.

## How the storage math works

Storage on Neon's paid plans is billed at $0.35/GB-month, metered hourly. Branches are billed in two ways:

- **Root branches** (your `main`/`production` branch) are billed on the logical size of the data they hold.
- **Child branches** are billed on the minimum of the changes since the branch was created, or the logical size of the data. So a child branch never costs more than a full copy would, but in practice it costs much less.

Concretely: a 50 GB production database with 10 developer branches that each write 200 MB of test data costs roughly 50 GB (root) + 10 × 0.2 GB (children) = 52 GB-month, or about $18.20/month for storage. The point-in-time restore (PITR) change history is also billed on root branches only, at $0.20/GB-month.

```bash
# Each engineer gets their own branch off main
neon branches create --name alex-dev --parent main
neon branches create --name dana-dev --parent main
```

<Callout title="One caveat">
A branch's storage is capped at the logical size of its data, but the delta does grow as the branch diverges from its parent. For long-lived developer branches, reset the branch periodically with `neon branches reset <name> --parent` or set an [expiration](https://neon.com/docs/guides/branch-expiration) to keep things tidy.
</Callout>

## Plan limits to know

The Free plan includes 10 branches per project and 0.5 GB of total storage per project, which is enough to prototype the workflow. The Launch and Scale plans include 10 and 25 branches per project respectively, and you can create extra branches at $1.50/branch-month (prorated hourly). For larger teams, Scale supports up to 5,000 branches per project.

See the full breakdown in the [Neon plans](https://neon.com/docs/introduction/plans) page.

## How other managed Postgres services handle per-engineer copies

| Provider           | Per-copy storage                                                         | Practical limit                                                                 |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Neon               | Copy-on-write delta only, billed at $0.35/GB-month                       | Up to 5,000 branches per project on Scale                                       |
| Aurora PostgreSQL  | Copy-on-write at the storage layer (clones share pages until divergence) | Up to 15 copy-on-write clones per source cluster before the next is a full copy |
| Supabase           | Full project per preview branch (dedicated DB, Auth, Storage)            | Each preview branch incurs its own compute and disk size charges                |
| RDS for PostgreSQL | Full duplicate via `pg_dump` or snapshot restore                         | Each copy uses the full provisioned disk                                        |

Aurora clones share storage pages with the source via copy-on-write, so the initial clone uses minimal additional space. Storage grows only as the clone diverges. Aurora caps copy-on-write clones at 15 per source cluster before the next clone becomes a full copy. See [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html).

Supabase preview branches are full projects, not storage clones. Each branch runs its own compute and incurs its own disk size charges; a Micro branch starts at $0.01344 per hour. See [Supabase branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).

RDS for PostgreSQL doesn't offer copy-on-write at the storage layer. Per-engineer copies require restoring a snapshot to a new instance or replaying a `pg_dump`, and each copy occupies its own provisioned disk.

<CTA title="See it in your own database" description="Create a project, push a snapshot of your production schema, and branch it ten times. The bill won't surprise you." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
