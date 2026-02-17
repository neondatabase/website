---
title: 'Promote from dev to prod without conflict'
subtitle: 'Build a snapshot-based promotion workflow for Postgres: replace production with a known-good dev version using database branches, snapshots, and instant restores'
updatedOn: '2026-01-22T00:00:00.000Z'
---

## Snapshot-based promotion (dev → prod)

**This is a workflow built around a simple idea: replacing production with a known-good version of development.**

Neon intentionally does not support automatic merging of diverged branches, since database merges would be unsafe and ambiguous. This workflow embraces that constraint instead of fighting it.

Some of the largest Neon customers are running this workflow in production, e.g. platforms or codegen companies that manage many parallel versioned environments that eventually need to be promoted without conflict.

### Step 1: Creating isolated prod & dev root branches

![Diagram showing creation of isolated production and development root branches](/images/pages/branching/branch-per-developer-diagram.png)

The first step is to give production and development their own independent root branches.The setup looks like this:

- Start with your existing production branch
- Take a snapshot of production
- Restore that snapshot and name the restored branch `dev`

You now have two root branches

- `prod`: your live production environment
- `dev`: a fully isolated development environment

They start from the same schema and data, but they are no longer linked. Changes in one will never affect the other. From this point on, `dev` behaves like a standalone database, while still preserving a clean lineage back to production.

### Step 2: Working on changes on dev

![Diagram showing workflow for working on changes in the development branch](/images/pages/branching/promoting-to-prod-diagram.png)

Teams typically:

- Apply schema and data changes directly on `dev`
- Create short-lived child branches from `dev` for previews, PRs, or user-level environments
- Validate changes in those child branches
- Apply validated changes back to `dev` using migrations or scripts

At the end of this phase, the `dev` branch represents the next production candidate.

### Step 3: Promoting changes to prod

![Diagram showing snapshot-based promotion from development to production](/images/pages/branching/isolated-prod-dev-roots-diagram.png)

When time is right, promotion is done using snapshots. The process is:

1. Take a snapshot of `prod` (this becomes your rollback point)
2. Take a snapshot of `dev` (this is the version you want to publish)
3. Restore the `dev` snapshot onto `prod`

Restoring a snapshot instantly rewrites the production branch to match the state of `dev`, while keeping the same production endpoint. Active connections are briefly dropped during the restore, typically for milliseconds.

After the restore,

- `prod` reflects the new version
- Development continues on `dev` toward the next release
- A backup branch (`old prod`) is created automatically

### Step 4: Refreshing dev from production

![Diagram showing refresh workflow for development branch from production](/images/pages/branching/staging-no-pii-diagram.png)

After promotion, the `dev` branch will eventually become outdated. To refresh it:

1. Take a snapshot of the current `prod` branch
2. Restore that snapshot onto `dev`

This rewrites `dev` to match production while keeping the same branch identity and endpoint. A backup branch (`old dev`) is created automatically and can be deleted or kept briefly for verification.

### Rollbacks and operational considerations

If something goes wrong after promotion, rollback uses the same mechanism:

- Identify a previous production snapshot
- Restore it onto `prod`

As with promotion, restores are instant and preserve the production endpoint. A backup branch is created automatically after each restore.

There are important operational constraints to understand:

- **Production writes after the snapshot are lost**. Restoring a snapshot replaces the entire branch state. If production continues receiving writes after the snapshot is taken, those writes will not be present after restore. This workflow works best when production is read-only or when writes can be safely discarded or reconciled at the application level.
- **Restore operations briefly drop active connections.** Applications should retry queries automatically.
- **Cleanup matters.** Root branches and snapshots are billed based on logical size. Child branches are cheap, but snapshots should be retained intentionally and cleaned up when no longer needed.
