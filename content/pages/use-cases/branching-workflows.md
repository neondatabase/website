---
title: 'Branching Workflows on Neon'
subtitle: Give every developer, pull request, preview, and test run its own Postgres, without copying data
summary: >-
  Covers how teams use Lakebase Postgres branching as their development
  workflow: one branch per developer, per pull request, per preview, and per
  test run, plus restore, automation with GitHub Actions and Vercel, and how the
  same branch model now extends to the rest of the Neon backend.
enableTableOfContents: true
updatedOn: '2026-08-14T17:30:00.000Z'
image: '/images/social-previews/use-cases/branching-workflows.jpg'
---

![Timeline showing preview, test, and dev branches created from a production branch and deleted when work finishes](/use-cases/branching-workflows/branch-timeline.jpg)

<Admonition type="note" title="Summary">
Lakebase Postgres separates compute from storage, and that storage is copy-on-write. Creating a branch takes seconds and copies no data, so every developer, pull request, preview, and CI run can get its own database that starts from real production state.

- **Instant** - Branch creation takes seconds whether the parent holds 1 GB or several TB
- **Isolated** - Each branch gets its own compute endpoint and its own connection string
- **Cheap** - Branches share storage with their parent and only bill for what diverges
- **Disposable** - Idle branches scale to zero, and automation deletes them when the pull request closes

For the long-form version of the patterns below, see [Mastering database branching workflows](/branching).
</Admonition>

## Copying databases doesn't scale

Software development is built around parallel work. Engineers open pull requests, previews get generated for review, CI runs on every commit, and several versions of an application exist at the same time. Code handles all of this. Databases usually don't.

Most teams still run one production database, a shared staging database, and sometimes a shared development database. Getting an isolated environment means copying one of them: dump, restore, wait. That is expensive in every direction. Dumps and restores take minutes or hours. Every copy duplicates storage. Long restores fail partway or drift. And a copy is already stale by the time it finishes.

So teams compromise. They test migrations against partial or outdated data. They share environments and coordinate over Slack about who is running what. They avoid certain schema changes because the blast radius feels too wide. Past a few hundred gigabytes, copying stops being practical at all, and non-production databases stop resembling production.

<QuoteBlock quote="Getting realistic data into our verification environments was largely unfeasible, it was time-consuming, expensive, and a beast to maintain. You need to process hefty backups, transfer costs stack up, and there’s a lot of manual oversight required just to move that data." author="jonathan-reyes" role="Principal Engineer at Dispatch" link="/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora" />

Better scripts and faster restores only move the ceiling a little. The fix has to come from the database model itself.

## What a database branch is

A branch starts as a pointer. When you create one, Lakebase Postgres records a reference to the parent's data at a specific point in time and writes nothing. The child sees the exact schema and rows the parent had at that moment. When you run a migration, insert rows, or drop a table on the child, only those changes are written separately.

Two things follow from that. Branch creation takes seconds no matter how large the parent is, because the amount of data copied is zero. And a branch stays cheap until it diverges, because both branches read the same underlying pages until one of them writes.

None of this is possible on a standard Postgres instance, and the reason is architectural. In a conventional setup, the Postgres process and its disk live together on one machine. The database is a single mutable filesystem, so the only way to get a second environment is to stand up a second machine with a full copy of the data on it.

Lakebase Postgres splits those two halves apart. Compute is the stateless Postgres process where queries run. Storage is a separate, distributed engine that keeps data on shared object storage and writes copy-on-write, versioned by WAL, so every change creates a new version instead of overwriting the old one.

![Standard database architecture with compute and storage on one machine, next to the lakebase architecture with stateless compute over shared copy-on-write storage](/use-cases/branching-workflows/lakebase-architecture.jpg)

Once storage is shared and versioned, starting a new compute against an existing version of the data is cheap. That single property is what branches, instant restore, and fast restarts are all built on. A branch is just another compute pointed at a version of the storage that already exists.

The practical result is that branches stop being precious. They are cheap enough to create, use, and delete constantly, by developers, by CI, and by agents.

<Admonition type="info" title="Go deeper on the architecture">
- [Architecture overview](/docs/introduction/architecture-overview) - how compute, storage, and the WAL fit together
- [Instantly copy TB-size datasets: the magic of copy-on-write](/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) - why branch time doesn't grow with database size
- [Lakebase Postgres](/docs/postgres/overview) - autoscaling, scale to zero, and connection pooling on top of the same engine
</Admonition>

## Branching workflows

Most teams start with one of the patterns below and add others as they get comfortable creating branches on demand. They combine well, and they all rest on the same primitive.

![The Mastering Database Branching Workflows guide on neon.com](/use-cases/branching-workflows/branching-guide.jpg)

_A full walkthrough of every pattern below, with diagrams and setup steps: [Mastering database branching workflows](/branching)._

### One branch per developer

![Two developer branches created from the production branch, each isolated from the other](/use-cases/branching-workflows/branch-per-developer.jpg)

Each engineer gets their own branch, created from production or from an anonymized copy of production when PII is involved. Nobody steps on anyone else's schema changes, and every developer works against realistic data instead of a fixtures file.

Because branches don't duplicate storage and idle compute scales to zero, this stays affordable as the team grows. If production contains PII, derive developer branches from an [anonymized branch](/docs/reference/api/branches/create-project-branch-anonymized) instead, and the rest of the workflow is unchanged.

### One branch per pull request

![A staging branch created from production, with a pull request branch created from staging](/use-cases/branching-workflows/branch-per-pull-request.jpg)

A branch is created when the pull request opens and deleted when it merges or closes. Each change gets a database to run its migrations against, so migration bugs surface in review rather than in production. PR branches are usually derived from staging when a staging branch exists, and from production otherwise.

<QuoteBlock quote="Developers already face significant delays when working on a PR—running CI tests, ensuring everything is ready for preview, it all adds up. Time to launch is crucial for us: when we tried Neon and saw that spinning up a new branch takes seconds, we were blown away" author="alex-co" role="Head of Platform Engineering at Mindvalley" link="/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches" />

### One branch per preview

A preview environment is supposed to show what a change looks like before it ships. That only works if the data behind it is shaped like production data. Give each preview its own branch and the schema changes and test records stay contained, then delete the branch when the preview goes away. The [Vercel](/docs/guides/vercel-overview) and [Netlify](/docs/guides/netlify-functions) integrations wire this up so a branch is created and torn down with the deployment.

### One branch per test run

Instead of reusing a shared test database and running destructive cleanup between runs, create a branch at the start of the pipeline, run migrations and tests against it, and delete it at the end. Every run starts from the same baseline, so results are deterministic and no run inherits leftover rows or schema drift from the last one. Because branches are instant, this holds up when pipelines run frequently or in parallel.

<QuoteBlock quote="Branching saves us both money and developer time. We no longer have to set up an actual testing database instance and make sure the data is always synced with production. We now spin up an ephemeral branch when we need to and then tear it down via the create/delete Github Actions" author={{ name: 'Angelina Quach', company: 'Software Engineer at Shepherd' }} link="/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd" />

### Branches for restore and debugging

![A restored production branch created from a point in history before an incident on the production branch](/use-cases/branching-workflows/branch-per-restore.jpg)

The same mechanism works backwards. Lakebase Postgres retains history for each branch within a [history window](/docs/introduction/history-window), so you can create a branch from a moment in the past and get the exact schema and data as of then, without rolling production back.

That covers most of what teams need after something goes wrong:

- **Recover lost data** - Branch from just before a table was dropped, pull out the rows you need, and copy them back into production
- **Debug a migration** - Branch from before the migration ran and compare state, or re-run it in isolation
- **Audit a past state** - Inspect a historical point for an incident review or compliance check while production keeps serving traffic

Delete restored branches when you're done so they don't sit in storage.

<Admonition type="info" title="Restore workflows in detail">
- [Instant restore](/docs/introduction/branch-restore) - restore a branch to any point inside its history window
- [Use branches to restore instantly](/branching/recovery-workflows) - recovery, migration debugging, and audit patterns
- [I dropped a table in production, now what?](/blog/recover-production-database) - a worked example of the recovery flow
</Admonition>

## Automating branch creation and cleanup

Branching becomes a workflow once nobody has to think about it. Every operation is available through the [Neon API](/docs/reference/api) and the CLI, so branch lifecycle can follow the same events your pipeline already reacts to:

- **[GitHub integration](/docs/guides/neon-github-integration)** - Link a Neon project to a repository and create or delete branches from GitHub Actions
- **[Vercel integration](/docs/guides/vercel-overview)** - Create a branch for every preview deployment
- **[Branch expiration](/docs/guides/branch-expiration)** - Set a TTL so branches clean themselves up
- **[Scale to zero](/docs/introduction/scale-to-zero)** - Idle branch compute suspends automatically, so forgotten branches don't accumulate compute cost

Cleanup matters more than it sounds. Branches left running for weeks eventually fall outside the history window and start contributing to storage. Automating deletion keeps both the branch list and the bill predictable.

<QuoteBlock quote="Database branching is the best quality-of-life improvement to my tech stack that I can think of in recent years. Second to maybe only Copilot" author={{ name: 'Miguel Hernandez', company: 'Backend Tech Lead at Neo.Tax' }} link="/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle" />

## Teams using branching workflows

<QuoteBlock quote="Neon’s branching gave us the last missing piece in our RISE (Robust Isolated Staging Environment): true database isolation. The services that touched schema changes or write-heavy paths could never share a database safely. Now every sandbox gets its own isolated Postgres DB whenever required" author="joe-horsnell" role="Principal Platform Engineer at Bitso" link="/blog/bitso-branching-workflow" />

- **[Inside Bitso's branch-based workflow](/blog/bitso-branching-workflow)** - Hundreds of developers and microservices, with an isolated Postgres database behind every sandbox
- **[How Mindvalley minimizes time-to-launch with Neon branches](/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches)** - Cutting the wait between opening a pull request and having an environment to test it in
- **[Adopting Neon branching in CI/CD pipelines: a practical story by Shepherd](/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd)** - Ephemeral test branches created and torn down by GitHub Actions
- **[From days to minutes: how Neo.Tax accelerated their development lifecycle](/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle)** - A branch per ticket, linked to local development and end-to-end tests
- **[How Dispatch speeds up development with Neon while keeping workloads on Aurora](/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora)** - Development and verification environments on Neon with production still on Aurora
- **[How Proposales integrated Neon in their Postgres development workflow](/blog/frictionless-development-experience-with-neon-branching)** - Moving development infrastructure off RDS and reducing cost along the way
- **[ketteQ uses Neon branching for scenario analysis](/blog/database-branching-for-postgres-with-neon)** - Testing hundreds of scenarios against production data with no risk to it
- **[From Heroku to Neon: the dev.to story](/blog/dev-from-heroku-to-neon)** - Serverless Postgres behind a platform used by millions of developers

<Admonition type="info" title="More teams building this way">
- [Fast-moving teams](/case-studies#fast-moving-teams) - the full set of case studies behind these workflows
- [Practical guide to database branching](/blog/practical-guide-to-database-branching) - the common patterns collected in one place
</Admonition>

## Branching the rest of the backend

Everything above covers the database half of an environment. For a long time that was as far as branching went. Your Postgres could fork in seconds, while a preview branch still pointed at production file storage, production auth users, and whatever handlers happened to be deployed.

That's changing. The other Neon primitives are keyed to the same `branch_id`, so a branch now forks more than the database:

- **[Neon Object Storage](/docs/storage/overview)** - S3-compatible buckets that fork with the branch, so a preview can accept uploads without touching production objects
- **[Managed Better Auth](/docs/auth/overview)** - Users, sessions, and OAuth configuration live in your Postgres database, so a branch gets its own isolated sign-up and login flows
- **[Neon Functions](/docs/compute/functions/overview)** - Node.js handlers deployed onto a branch, each with its own URL and its own database state, deleted when the branch is

One API call forks the data, the files, the users, and the code that runs against them. Delete the branch and all of it goes away together. See [how the Neon backend fits together](/blog/neon-backend-is-beta) for where this is heading.

<CTA title="Start branching" description="Create a project on the Free plan and open your first branch in a few seconds. No credit card required." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" linkText="Read the branching guide" linkUrl="/branching" />
