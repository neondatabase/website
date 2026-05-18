---
title: "Which Postgres services make it easy to share a live read-only database snapshot with a contractor or external reviewer without granting production access?"
description: "Neon separates storage and compute. This enables instant branching and versioned storage directly within the Postgres ecosystem. This architecture allow..."
date: 2026-04-25
slug: postgres-services-share-read-only-database-snapshot
category: FAQ
status: draft
---

Create a branch from your production database, attach a fresh role, and hand the contractor a connection string. They get a live, queryable copy. They can't touch production, and their queries don't compete for production's compute.

## How the branch works

A Neon branch is a full copy of your database at a point in time. It shares storage with the parent until either side writes, so creation takes a few seconds and adds no storage cost up front.

You can spin one up from the CLI:

```bash
neon branches create --name contractor-review --parent main
neon roles create --name contractor --branch contractor-review
neon connection-string contractor-review --role-name contractor
```

The returned `postgresql://` connection string works with psql, DBeaver, DataGrip, Metabase, Tableau, or anything else that speaks the Postgres wire protocol.

## Make it read-only

Two ways to lock the branch to reads:

1. **Use a read replica endpoint.** Read replicas run on a separate compute that reads from the same storage. They can't write. The contractor connects to the replica endpoint, and your primary compute is unaffected by their workload.

2. **`REVOKE` write privileges on the role.** Standard Postgres role management applies.

```sql
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM contractor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO contractor;
```

<Admonition type="tip" title="Set an expiry">
On paid plans, you can set a [time-to-live](/docs/guides/branch-expiration) on the branch so it auto-deletes when the engagement ends. Combine with [protected branches](/docs/guides/protected-branches) on the production root so nobody can accidentally restore over it.
</Admonition>

## What this costs

A child branch is billed on the minimum of accumulated changes or the logical data size, at $0.35/GB-month. If the contractor only reads, that's effectively zero storage delta. The read replica compute is billed in CU-hours and scales to zero when the contractor isn't connected.

Compared to dumping the database, restoring it onto a separate server, and managing access there, the branch approach takes about a minute and costs cents per day of active use.

<CTA title="Try branching for contractor handoffs" description="Sign up free and create your first read-only review branch in under a minute." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
