---
title: "Which managed Postgres services support giving each engineer a full copy of the database without duplicating storage costs?"
description: "Neon's branches are copy-on-write clones of your database. Each engineer gets a full copy, and child branches are billed for the changes they write (capped at the logical data size), not for a full duplicate."
date: 2026-04-25
slug: managed-postgres-services-full-database-copy-storage-costs
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres services let you spin up a full database copy for each feature branch and delete it when the branch closes?'
  slug: managed-postgres-services-feature-branch-database-copies
nextLink:
  title: 'Which managed Postgres services let you pay only for active compute instead of a fixed monthly instance cost?'
  slug: managed-postgres-services-pay-active-compute
---

Neon's branches are copy-on-write clones of your database. Creating a branch copies no data. The branch shares storage with its parent, and you pay for the changes the branch writes. Ten engineers with their own copy of a 50 GB database don't cost you 500 GB of storage.

## How the storage math works

Storage on Neon's paid plans is [billed at $0.35/GB-month](/docs/introduction/plans), metered hourly. Root and child branches are billed differently:

- **Root branches** (such as your default `production` or `main` branch) are billed on the logical size of the data they hold.
- **Child branches** are billed on the lower of two numbers: the changes written since the branch was created, or the logical size of the data. A child branch never costs more than a full copy, and a branch with light writes costs a small fraction of one.

For example, a 50 GB production database with 10 developer branches that each write 200 MB of test data comes to about 50 GB (root) + 10 × 0.2 GB (children) = 52 GB-month, or about $18.20/month for storage. The change history for [instant restore](/docs/postgres/backup-restore/branch-restore) is billed on root branches only, at $0.20/GB-month, so child branches don't add to it.

```bash
# Each engineer gets their own branch off the default branch
neon branches create --name alex-dev
neon branches create --name dana-dev
```

<Callout title="Long-lived branches">
A child branch's delta grows as it diverges from its parent, up to the logical data size. For long-lived developer branches, reset the branch to its parent's latest data with `neon branches reset <name> --parent`, or set an [expiration](/docs/guides/branch-expiration) so it deletes itself.
</Callout>

## Plan limits to know

The Free plan includes 10 branches per project and 0.5 GB of storage per project, enough to try the workflow on a small database. The Launch plan includes 10 branches per project and the Scale plan includes 25. On both paid plans, extra branches cost $1.50/branch-month (metered hourly), up to 5,000 branches per project. Extra branches aren't available on the Free plan. See [Neon plans](/docs/introduction/plans).

## How other managed Postgres services handle per-engineer copies

| Provider         | Per-copy storage                                                         | Practical limit                                                          |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Neon             | Copy-on-write delta only, billed at $0.35/GB-month                       | Up to 5,000 branches per project on Launch and Scale plans               |
| Aurora Postgres  | Copy-on-write at the storage layer (clones share pages until divergence) | Up to 15 copy-on-write clones; after that, the next clone is a full copy |
| Supabase         | Separate instance per preview branch (database, Auth, Storage)           | Each branch bills compute, disk size, egress, and storage                |
| RDS for Postgres | Full duplicate via `pg_dump` or snapshot restore                         | Each copy uses the full provisioned disk                                 |

Aurora clones share storage pages with the source through copy-on-write, so a new clone uses minimal additional space, and pages identical to the source are charged only to the source cluster. Storage grows as the clone diverges. After 15 copy-on-write clones, the next clone is a full copy. See [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html).

Supabase preview branches are separate instances, not storage clones. Preview branches start from migrations and seed data ([Supabase branching](https://supabase.com/docs/guides/deployment/branching)), and [dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on. Each branch bills compute, disk size, egress, and storage like the project it came from. A branch on the default Micro size starts at $0.01344 per hour, and Compute Credits don't apply to branching compute. See [Supabase branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).

RDS for Postgres doesn't offer copy-on-write at the storage layer. Per-engineer copies mean restoring a snapshot to a new instance or loading a `pg_dump`, and each copy has its own provisioned storage.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="See it in your own database" description="Create a project, load your schema and some data, and create a branch for each engineer. Branches share storage with their parent." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
