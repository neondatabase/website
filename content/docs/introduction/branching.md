---
title: Branching
subtitle: Branch your data the same way you branch your code
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
  - /docs/conceptual-guides/branching
updatedOn: '2024-01-26T18:19:19.805Z'
---

<a id="branches-coming-soon/"></a>

With Neon, you can quickly and cost-effectively branch your data for development, testing, and various other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines.

## What is a branch?

A branch is a copy-on-write clone of your data. You can create a branch from a current or past state. For example, you can create a branch that includes all data up to the current time or an earlier time.

A branch is isolated from its originating data, so you are free to play around with it, modify it, or delete it when it's no longer needed. Changes to a branch are independent. A branch and its parent can share the same history (within the defined [point-in-time restore](/docs/reference/glossary#point-in-time-restore) window) but diverge at the point of branch creation. Writes to a branch are saved as a delta.

Creating a branch does not increase load on the parent branch or affect it in any way, which means you can create a branch without impacting the performance of your production system.

Each Neon project is created with a root branch called `main`. The first branch that you create is branched from the project's root branch. Subsequent branches can be branched from the root branch or from a previously created branch.

## Branching workflows

You can use Neon's branching feature in variety workflows.

### Development

You can create a branch of your production database that developers are free to play with and modify. By default, branches are created with all of the data that existed in the parent branch, eliminating the setup time required to deploy and maintain a development database.

![development environment branch](/docs/introduction/branching_dev_env.png)

The following video shows how to create a branch in the Neon Console. For step-by-step instructions, see [Create a branch](/docs/manage/branches#create-a-branch).

<video autoPlay playsInline muted loop width="800" height="600">
  <source type="video/mp4" src="/docs/introduction/create_branch.mp4"/>
</video>

You can integrate branching into your development workflows and toolchains using the Neon CLI, API, or GitHub Actions. If you use Vercel, you can use the Neon Postgres Previews Integration to create a branch for each preview deployment.

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

### Data recovery

If you lose data due to an unintended deletion or some other event, you can restore a branch to any point in its history retention period to recover lost data. You can also create a new point-in-time branch for historical analysis or any other reason.

![data recovery branch](/docs/introduction/branching_data_loss.png)

Refer to the following guides for instructions.

<DetailIconCards>

<a href="/docs/guides/branch-restore" description="Restore a branch to its history with Branch Restore" icon="invert">Branch Restore with Time Travel</a>

<a href="/docs/guides/branching-pitr" description="Learn how to create a branch from historical data" icon="screen">Create a branch from the past</a>

</DetailIconCards>
