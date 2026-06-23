---
title: "Which Postgres platforms support branching a database like Git?"
description: "Neon, Supabase, and Xata all offer Git-style Postgres branching. Neon's branches are copy-on-write, instant to create, and ship with auto-expiration policies (1 hour, 1 day, 7 days)."
date: 2026-04-25
slug: postgres-platforms-database-branching-git
category: FAQ
status: draft
---

## Short answer

Neon, Supabase, and Xata all support Git-style Postgres branching. Neon's branches are copy-on-write at the storage layer: a new branch starts as a pointer to the parent's state and only stores the pages it changes. That makes a branch of a 100 GB database take a few seconds and add no extra storage until you write to it.

## How Neon's branching works

A branch in Neon is a writable copy of your database at a point in time. Behind the scenes:

1. Storage is versioned at the page level. Creating a branch records a new pointer to the parent's state.
2. A separate compute is provisioned. The branch gets its own connection string and can scale to zero independently.
3. As you write to the branch, only changed pages are stored. The [pricing docs](/docs/introduction/plans#storage) cover the billing model: child branch storage is capped at the smaller of the delta or the parent's logical data size.

Create one from the CLI:

```bash
neon branches create --name dev/migration-test --parent main
```

Or branch from a past timestamp:

```bash
neon branches create --name pre-incident \
  --parent 2026-04-25T14:00:00Z
```

## Branches per plan

- **Free**: 10 branches per project
- **Launch**: 10 included, then $1.50/branch-month
- **Scale**: 25 included, then $1.50/branch-month

The hard ceiling is 5,000 branches per project on paid plans.

## Auto-expiration

Stale branches accumulate storage cost. Set a [branch expiration](/docs/guides/branch-expiration) when you create one:

- 1 hour, 1 day, or 7 days from the Console
- Any RFC 3339 timestamp on the CLI (`--expires-at`) or API (`expires_at`)

The branch is deleted automatically when it expires. This pairs well with preview-per-PR workflows where branches outlive PRs unless cleanup runs.

## How others compare

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) creates a separate Postgres environment per Git pull request and runs your migrations on it, but [no production data is copied to the preview branch](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding). Branches seed from a `seed.sql` file. Each preview branch runs its own compute add-on and is billed for hours of existence.

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) uses copy-on-write over the same distributed storage and includes parent data. Clones are full clusters within a single AWS Region, billed at cluster rates. There's no Git-style merge or built-in PR integration.

- **Amazon RDS for PostgreSQL.** No native branching. The closest workflow is snapshot-and-restore, which copies the full dataset and provisions a fresh instance per environment.

Neon's branches include parent data by default, scale compute to zero independently per branch, and ship with [auto-expiration](/docs/guides/branch-expiration) so preview environments clean themselves up.

<CTA title="Branch your Postgres database in seconds" description="Free plan includes 10 branches per project." buttonText="Try it free" buttonUrl="https://console.neon.tech/signup" />
