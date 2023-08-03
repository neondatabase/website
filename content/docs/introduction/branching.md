---
title: Branching
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
  - /docs/conceptual-guides/branching
---

<a id="branches-coming-soon/"></a>

Neon allows you to instantly branch your data in the same way that you branch your code. You can quickly and cost-effectively branch your data for development, testing, and various other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines. See [Branching workflows](#branching-workflows) for a discussion of different ways to integrate branching into your development workflows.

## What is a branch?

A branch is a copy-on-write clone of your data. You can create a branch from a current or past state. For example, you can create a branch that includes all data up to the current time or an earlier time.

A branch is isolated from its originating data, so you are free to play around with it, modify it, or delete it when it's no longer needed. Changes to a branch are independent. A branch and its parent can share the same history (within the defined [point-in-time restore](/docs/reference/glossary#point-in-time-restore) window) but diverge at the point of branch creation. Writes to a branch are saved as a delta.

Creating a branch does not increase load on the parent branch or affect it in any way, which means you can create a branch without impacting the performance of your production system.

Each Neon project is created with a root called `main`. The first branch that you create is branched from the project's root branch. Subsequent branches can be branched from root or from a previously created branch.

## Branch compute endpoints

When creating a new branch, you have the option to create a compute endpoint for the branch.

A compute endpoint allows you to connect to the branch from a client or application. Neon supports both read-write and read-only compute endpoints. Read-only compute endpoints are also referred to as [Read replicas](/docs/introduction/read-replicas). A branch can have a single read-write compute endpoint but supports multiple read-only compute endpoints.

Your Neon project's root branch is created with a read-write compute endpoint, by default.

To connect to a database in a branch from a client or application, you must connect to the branch's compute endpoint. For more information connecting to a branch, see [Connect to a branch](/docs/manage/branches#connect-to-a-branch).

## Branching workflows

You can use Neon's branching feature in variety workflows, some of which are described below.

### Development

You can create a branch of your production database that developers are free to play with and modify. By default, branches are created with all of the data that existed in the parent branch, eliminating the setup time required to deploy and maintain a development database.

![development environment branch](/docs/introduction/branching_dev_env.png)

For branch creation instructions, see [Create a branch](/docs/manage/branches#create-a-branch).

You can integrate branching into your development workflows and toolchains using the Neon CLI, API, or GitHub Actions. If you use Vercel, you can use the Neon Vercel Integration to create a branch for each preview deployment.

Refer to the following guides for instructions:

- [Branching with the Neon CLI](/docs/guides/branching-neon-cli)
- [Branching with the Neon API](/docs/guides/branching-neon-api)
- [Branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Connect with the Neon Vercel Integration](/docs/guides/vercel)

### Testing

Testers can create branches for testing schema changes, validating new queries, or testing potentially destructive queries before deploying them to production. A branch is isolated from its parent branch but has all of the parent branch's data up to the point of branch creation, which eliminates the effort involved in hydrating a database. Tests can also run on separate branches in parallel, with each branch having dedicated compute resources.

![test environment branches](/docs/introduction/branching_test.png)

For a simple example showing how you can use a branch to test queries, refer to [Test queries with branching](/docs/tutorial/test-queries), in the _Neon tutorial_.

### Data recovery

If you lose data due to an unintended deletion or some other event, you can create a branch with data as it existed before the event occurred, allowing you to recover the lost data.

![data recovery branch](/docs/introduction/branching_data_loss.png)

Refer to the following guide for instructions: [Branching — Point-in-time restore (PITR)](/docs/guides/branching-pitr).

For another data recovery example using Neon's branching feature, refer to [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres). This example uses a bisect script and the Neon API to recover data to the last known good.
