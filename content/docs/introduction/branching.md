---
title: Branching
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
  - /docs/conceptual-guides/branching
---

<a id="branches-coming-soon/"></a>

Neon allows you to instantly branch your data in the same way that you branch your code. You can quickly and cost-effectively branch your data for development, testing, and various other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines. See [Branching workflows](#branching-workflows) for a discussion of different ways you can integrate branching into your development workflows.

## What is a branch?

A branch is a copy-on-write clone of your data. You can create a branch from a current or past state. For example, you can create a branch that includes all data up to the current point in time or an earlier point in time.

A branch is isolated from its originating data, so you are free to play around with it, modify it, or delete it when it's no longer needed. Changes to a branch are independent. A branch and its parent share the same history but diverge at the point of branch creation. Writes to a branch are saved as a delta.

Creating a branch does not increase load on the parent branch or affect it in any way, which means you can create a branch at any time without impacting the performance of your production system.

Each Neon project is created with a [primary branch](/docs/reference/glossary#primary-branch) called `main`. The first branch that you create is branched from the project's primary branch. Subsequent branches can be branched from the primary branch or from a previously created branch.

## Branch compute endpoints

When creating a new branch, you have the option to create a compute endpoint for the branch.

A compute endpoint allows you to connect to the branch from a client or application. Neon supports both read-write and read-only compute endpoints. Read-only compute endpoints are also referred to as [Read replicas](/docs/introduction/read-replicas). A branch can have a single read-write compute endpoint but supports multiple read-only compute endpoints.

Your Neon project's primary branch has a compute endpoint, by default.

To connect to a database in a branch from a client or application, you must connect to the branch's compute endpoint. For more information connecting to a branch, see [Connect to a branch](/docs/manage/branches#connect-to-a-branch).

If a branch does not have a compute endpoint, you can add one. See [Create a compute endpoint](/docs/manage/endpoints#create-a-compute-endpoint).

## Branching workflows

You can use Neon's branching feature in variety development workflows, a few of which are discussed below.

### Development

Create a branch of your production database that developers are free to play with and modify. You can quickly create a branch with all of the data that existed in the parent branch, eliminating the setup time required to deploy and maintain a development database.

![development environment branch](/docs/introduction/branching_dev_env.png)

Branching is so easy and cost-effective that you can create a branch for each developer. For example, you can create branches from a primary development branch to assign tasks to be worked on in parallel.

![branch for each developer](/docs/introduction/branching_each_dev.png)

### Preview deployments

With Neon's branching capabilities, you can create a branch for each preview deployment. You can automate branch creation for every pull request using the Neon API or, if you use Vercel, you can use the Neon Vercel Integration, which automates this task for you. For more information, see [Connect with the Neon Vercel Integration](/docs/guides/vercel).

### Testing

Branching enables testers to use the most recent production data. Testers can create branches for testing schema changes, validating new queries, or testing potentially destructive queries before deploying them to production. A branch is isolated from its parent branch but has all of the parent branch's data up to the point of branch creation, which eliminates the effort involved in hydrating a database. Tests can also run on separate branches in parallel, with each branch having dedicated compute resources.

![test environment branches](/docs/introduction/branching_test.png)

For a simple example showing how you can use a branch to test queries, refer to [Test queries with branching](/docs/tutorial/test-queries), in the _Neon tutorial_.

Another testing scenario enabled by branching is tracking down corruption or data quality issues. For example, you can create and dispose of multiple point-in-time branches to determine when a corruption or data quality issue first appeared.

![data quality issue branch](/docs/introduction/branching_issue.png)

### Data recovery

If you lose data due to an unintended deletion or some other event, you can create a branch with data as it existed before the event occurred, allowing you to recover the lost data.

![data recovery branch](/docs/introduction/branching_data_loss.png)

For a simple example showing how you can use a branch to recover lost data, refer to [Recover lost data with branching](/docs/tutorial/data-recovery), in the _Neon tutorial_.

For another data recovery example using Neon's branching feature, refer to [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres). This example uses a bisect script and the Neon API to recover to the last known good.

### Analytics

You can run costly, long-running queries on an isolated branch of your production data, each with its own compute resources. With automation scripts, you can create and dispose of branches on a defined schedule to ensure that queries always run on an up-to-date copy of your production data.

![analytics branches](/docs/introduction/branching_analytics.png)

## Get started with branching

To start using branches, refer to the instructions in [Manage branches](/docs/manage/branches).
