---
title: "What Postgres solutions support isolated databases per feature branch?"
description: "Neon creates a writable copy of your Postgres database for each feature branch in seconds, with branch expiration policies to auto-delete unused environments after 1 hour, 1 day, or 7 days."
date: 2026-04-25
slug: postgres-isolated-databases-feature-branch
category: FAQ
status: draft
---

## Short answer

Neon gives each Git feature branch its own Postgres branch. Each branch is a writable copy of the parent at a point in time, with a separate compute and connection string. Storage is copy-on-write, so a new branch adds no storage at creation and only bills for the pages you change.

## Why per-branch databases

Sharing one staging database between feature branches creates conflicts. Two developers running migrations on the same schema can leave the database in a state neither expected. Provisioning a full staging instance per branch is too slow and too expensive on a traditional Postgres setup.

Neon's separation of storage and compute means a branch is mostly metadata. Create one in a few seconds, run your migration against it, point your preview deployment at its connection string, and tear it down when the pull request merges.

## Setting it up

The most common pattern is GitHub Actions plus the Neon CLI:

```yaml
# .github/workflows/preview.yml
- name: Create Neon branch for PR
  run: |
    neon branches create \
      --name preview/pr-${{ github.event.pull_request.number }} \
      --parent main \
      --expiration-period 7d
```

For Vercel users, the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) handles the same flow automatically. Every Preview Deployment gets a fresh branch with environment variables injected at build time. See the [GitHub Actions guide](/docs/guides/branching-github-actions) for a full example.

## Branch expiration

Stale branches add storage cost. Set a TTL when you create the branch:

- 1 hour, 1 day, or 7 days from the [Console](/docs/guides/branch-expiration#using-the-console)
- Any timestamp via `--expires-at` on the CLI or `expires_at` on the API

The branch is deleted automatically when it expires.

## Plan limits

| Plan   | Branches per project | Extra branches                    |
| ------ | -------------------- | --------------------------------- |
| Free   | 10                   | Not available                     |
| Launch | 10                   | $1.50/branch-month (~$0.002/hour) |
| Scale  | 25                   | $1.50/branch-month (~$0.002/hour) |

The hard maximum is 5,000 branches per project on paid plans. For teams running large preview-per-PR flows, that's enough to keep weeks of open PRs simultaneously.

## How other Postgres options compare

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) creates a separate Postgres environment per Git pull request and runs your migrations on it, but [no production data is copied to the preview branch](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding). You seed it from a `seed.sql` file. Each branch runs as its own compute add-on, [starting at about $0.01344/hour](https://supabase.com/docs/guides/platform/manage-your-usage/branching) and billed for its full lifetime.

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) is copy-on-write at the storage layer and includes parent data, but each clone is a full Aurora cluster billed at cluster rates. There's no Git-integrated workflow; you'd build one with Lambda or CDK.

- **Amazon RDS for PostgreSQL.** No native per-branch databases. Most teams use snapshot-and-restore, which copies the full dataset and provisions a fresh instance per environment.

Neon's branches include the parent's data by default (or no data, if you prefer), and the compute on an idle branch [scales to zero](/docs/introduction/scale-to-zero), so unused preview branches cost only storage delta.

<CTA title="Branch Postgres like you branch code" description="Free plan includes 10 branches per project with no credit card." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
