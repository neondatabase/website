---
title: Branching
subtitle: Branch your data the same way you branch your code
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
  - /docs/conceptual-guides/branching
  - /docs/concepts/branching
  - /docs/introduction/point-in-time-restore
updatedOn: '2025-01-31T16:41:54.394Z'
---

With Neon, you can quickly and cost-effectively branch your data for development, testing, and various other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines.

You can also rewind your data or create branches from the past to recover from mistakes or analyze historical states.

## What is a branch?

A branch is a copy-on-write clone of your data. You can create a branch from a current or past state. For example, you can create a branch that includes all data up to the current time or an earlier time.

<Admonition type="tip" title="working with sensitive data?">
Neon also supports schema-only branching. [Learn more](/docs/guides/branching-schema-only).
</Admonition>

A branch is isolated from its originating data, so you are free to play around with it, modify it, or delete it when it's no longer needed. Changes to a branch are independent. A branch and its parent can share the same data but diverge at the point of branch creation. Writes to a branch are saved as a delta.

Creating a branch does not increase load on the parent branch or affect it in any way, which means you can create a branch without impacting the performance of your production database.

Each Neon project is created with a [root branch](/docs/reference/glossary#root-branch) called `main`. The first branch that you create is branched from the project's root branch. Subsequent branches can be branched from the root branch or from a previously created branch.

## Branching workflows

You can use Neon's branching feature in variety workflows.

### Development

You can create a branch of your production database that developers are free to play with and modify. By default, branches are created with all of the data that existed in the parent branch, eliminating the setup time required to deploy and maintain a development database.

![development environment branch](/docs/introduction/branching_dev_env.png)

The following video demonstrates creating a branch in the Neon Console. For step-by-step instructions, see [Create a branch](/docs/manage/branches#create-a-branch).

<video autoPlay playsInline muted loop width="800" height="600">
  <source type="video/mp4" src="/docs/introduction/create_branch.mp4"/>
</video>

You can integrate branching into your development workflows and toolchains using the Neon CLI, API, or GitHub Actions. If you use Vercel, you can use the Neon [Postgres Previews Integration](/docs/guides/vercel-previews-integration) to create a branch for each preview deployment.

Refer to the following guides for instructions:

<DetailIconCards>

<a href="/docs/guides/branching-neon-api" description="Learn how to instantly create and manage branches with the Neon API" icon="transactions">Branching with the Neon API</a>

<a href="/docs/guides/branching-neon-cli" description="Learn how to instantly create and manage branches with the Neon CLI" icon="cli">Branching with the Neon CLI</a>

<a href="/docs/guides/branching-github-actions" description="Automate branching with Neon's GitHub Actions for branching" icon="split-branch">Branching with GitHub Actions</a>

<a href="/docs/guides/branching-neon-api" description="Connect your Vercel project and create a branch for each preview deployment" icon="split-branch">The Neon Postgres Previews Integration</a>

</DetailIconCards>

### Testing

Testers can create branches for testing schema changes, validating new queries, or testing potentially destructive queries before deploying them to production. A branch is isolated from its parent branch but has all of the parent branch's data up to the point of branch creation, which eliminates the effort involved in hydrating a database. Tests can also run on separate branches in parallel, with each branch having dedicated compute resources.

![test environment branches](/docs/introduction/branching_test.png)

Refer to the following guide for instructions.

<DetailIconCards>

<a href="/docs/guides/branching-test-queries" description="Instantly create a branch to test queries before running them in production" icon="queries">Branching — Testing queries</a>

</DetailIconCards>

## Restore and recover data

If you lose data due to an unintended deletion or some other event, you can restore a branch to any point in its restore window to recover lost data. You can also create a new restore branch for historical analysis or any other reason.

![Recover from data loss using restore branching](/docs/introduction/branching_data_loss.png)

### Restore window

Your **restore window** determines how far back Neon maintains a history of changes for each branch. By default, this is set to **1 day** to help you avoid unexpected storage costs. You can increase it up to:

- 24 hours on the [Free plan](/docs/introduction/plans#free-plan)  
- 7 days on [Launch](/docs/introduction/plans#launch)  
- 14 days on [Scale](/docs/introduction/plans#scale)  
- 30 days on [Business](/docs/introduction/plans#business)

You can configure your restore window in the Neon Console under **Settings** > **Storage** > **Instant restore**. See [Configure restore window](/docs/manage/projects#configure-restore-window).

<Admonition type="note">Increasing your restore window affects **all branches** in your project and increases [project storage](/docs/introduction/usage-metrics#storage). You can reduce it to zero to minimize cost.</Admonition>

History is retained in the form of Write-Ahead-Log (WAL) records. As WAL records age out of the retention period, they are evicted from storage and no longer count toward project storage.

Learn how to use these data recovery features:

<DetailIconCards>

<a href="/docs/guides/branch-restore" description="Restore a branch to an earlier point in its history" icon="invert">Instant restore</a>

<a href="/docs/guides/reset-from-parent" description="Reset a branch to match its parent" icon="split-branch">Reset from parent</a>

<a href="/docs/manage/history/time-travel" description="Run SQL queries against your database's past state" icon="queries">Time Travel queries</a>

</DetailIconCards>
