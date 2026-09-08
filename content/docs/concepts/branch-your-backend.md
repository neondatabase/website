---
title: Branch your backend
subtitle: How branching works across the backend
summary: >-
  A branch is an isolated copy of your whole Neon backend that starts from its
  parent's state when you create it. It includes the parent's enabled services:
  Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and the AI
  Gateway. Most later changes stay on the branch. The exceptions to know: a
  restore rolls back Postgres and Auth only (not buckets or functions), the AI
  Gateway model catalog is global, and logical replication is not copied.
enableTableOfContents: true
redirectFrom:
  - /docs/guides/branching-intro
updatedOn: '2026-09-05T00:00:00.000Z'
---

A **branch** is an isolated copy of your whole Neon backend. Like a Git branch, you create it from an existing branch and make changes freely on that child branch, without affecting the original.

A branch includes any services already enabled on its parent: Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway. When you create a branch, the exact handling depends on each service: some copy state, some share underlying storage until you write, and some create branch-specific endpoints and credentials with no data to copy.

![Three branch lanes over time (main, dev, and a feature branch). Each fork carries along the services enabled on the parent, and the branches then diverge independently.](/docs/concepts/branch-your-backend.png 'no-border')

## When to branch

A branch gives you a full backend to work against, so you can make changes without affecting its parent, for example your production or staging branch.

- **Preview environments.** Create one branch for each pull request or preview deployment, so reviewers see the change running against its own data, users, and buckets.
- **Testing against production-like data.** Test migrations, destructive queries, and schema changes on a branch that starts from production-like data, then delete the branch.
- **Isolated development.** Use one branch per developer or feature instead of sharing one staging backend.
- **Temporary environments for CI and agents.** Create a branch for each CI run or AI-agent task, then delete it when the work is done.

## What a branch includes

When you create a branch, it starts with the services enabled on its parent. Here is how each one branches.

### Postgres branching

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    A Postgres branch starts with the parent's data as of the point of branch creation. Your writes stay on the branch, and the parent is unchanged. Nothing is copied up front: the branch stores its own copy of a data page only when it changes one. The [Data API](/docs/data-api/overview) serves the same database over HTTP, and each branch has its own Data API endpoint.

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Copy-on-write: the child branch shares the parent's data pages and stores its own copy only for the pages it changes. The parent is unchanged.](/docs/concepts/branch-postgres.png 'no-border')

  </div>
</div>

### Auth branching

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    Managed Better Auth needs no separate setup on a branch. Users, sessions, and organizations are stored in the `neon_auth` schema inside the branch's database, so they are included when the database branches. See [Branching authentication](/docs/auth/branching-authentication).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Managed Better Auth data is stored in the neon_auth schema inside Postgres, so it branches with the database.](/docs/concepts/branch-auth.png 'no-border')

  </div>
</div>

### Object Storage branching

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    A branch inherits the parent's buckets and objects without copying them up front. You can overwrite or delete an inherited object right away, and that change is local to the branch. The parent's objects are unchanged. See [Bucket branching](/docs/storage/buckets#bucket-branching).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![The child branch inherits the parent's objects and stores its own version only for the objects it overwrites. The parent is unchanged.](/docs/concepts/branch-object-storage.png 'no-border')

  </div>
</div>

### Functions branching

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    A branch inherits the parent's deployed functions and can run them immediately, at the branch's own invocation URL and against the branch's data, with no deploy. The first time you deploy a function on the branch, the branch gets its own version. The parent's version stays as it was.

  </div>
  <div style={{ flex: '1 1 50%' }}>

![The child branch runs the parent's functions with no deploy, and gets its own version after its first deploy. The parent stays on the previous version.](/docs/concepts/branch-functions.png 'no-border')

  </div>
</div>

### AI Gateway branching

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    Each branch gets its own AI Gateway endpoint and credentials, and its usage is metered separately, so there is no branch data to copy. Configuration stays shared across your project: the [model catalog](/docs/ai-gateway/models), routing, and rate limits are set for the account, not the branch, and you choose a model per request. So a branch is isolated in how it connects and how its usage is counted, but every branch draws on the same models and shares the same limits.

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Each branch has its own AI Gateway endpoint and credentials, but shares one global model catalog.](/docs/concepts/branch-ai-gateway.png 'no-border')

  </div>
</div>

Branching does not change the shape of your account or project. For what contains what, see [The Neon object model](/docs/concepts/the-object-model).

## Why branching is instant

Branch creation is fast and does not grow with the size of your data, because no service copies its data up front. Each one branches by sharing or inheriting from its parent instead of duplicating it, so the whole backend forks in seconds no matter how much it holds. Lakebase Postgres is the clearest example: with copy-on-write, the branch shares the parent's data until it changes something, then stores only what changed. The other services follow the same principle, inheriting their state or simply getting their own branch-scoped endpoints. Because of this:

- Branch creation time does not depend on how much data you have.
- A Postgres branch adds storage primarily for what it changes, not a second full copy.
- Your changes stay on the branch and do not affect the parent or sibling branches.

You can create a branch from the parent's current state, or from an earlier point within the project's [history window](/docs/introduction/history-window). To pick up later changes from the parent, [reset the branch from its parent](/docs/guides/reset-from-parent).

This works because storage is separate from compute: durable data can start a new branch without being copied first, and each branch runs its own compute against that data. See [The lakebase architecture](/docs/introduction/architecture-overview).

## Limits and caveats

- **A restore rolls back Postgres and Auth only.** Restoring a branch rolls back its Postgres timeline, including Managed Better Auth data stored in the `neon_auth` schema. It does not roll back Object Storage buckets or objects, and it does not roll back deployed functions. See [Backup & restore](/docs/guides/backup-restore).
- **AI Gateway configuration is global.** Branches get their own AI Gateway endpoint, credentials, and usage metering, but the model catalog, routing, and rate limits are shared. A branch can call a different model by sending a different `model` value in the request; it cannot have its own model catalog.
- **Logical replication is not copied.** A branch does not inherit logical replication slots or subscriptions. Set up replication again on the branch if it needs to publish or subscribe.
- **Some services are still maturing.** Managed Better Auth, Object Storage, Functions, and the AI Gateway are in preview or beta and are not available in every region. See [Product availability](/docs/introduction/regions#product-availability).

## Where to go next

<DetailIconCards>

<a href="/docs/introduction/branching" description="How branching works in Lakebase Postgres, and the workflows it's for" icon="postgres">Branching</a>

<a href="/docs/auth/branching-authentication" description="Test sign-in, OAuth, and permissions on a branch of your own" icon="lock-landscape">Branching authentication</a>

<a href="/docs/storage/buckets#bucket-branching" description="How buckets and objects reach a child branch, and what diverges" icon="data">Bucket branching</a>

<a href="/docs/compute/functions/overview" description="Your backend code on a branch, at the branch's own URL" icon="code">Functions</a>

<a href="/docs/ai-gateway/overview" description="A per-branch endpoint and credentials over one shared model catalog" icon="sparkle">The AI Gateway</a>

<a href="/docs/concepts/the-object-model" description="How organizations, projects, and branches contain the backend" icon="cards">The Neon object model</a>

</DetailIconCards>

<NeedHelp/>
