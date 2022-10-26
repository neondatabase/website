---
title: Branching
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

## About branching

Neon allows you to instantly branch your database in the same way you branch your code. You can quickly and cost-effectively branch a database for development, testing, staging, and a variety of other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines. For more information about the different ways branching can help improve your development workflows, see [Branching use cases](#branching-use-cases).

## What is a branch?

A branch is a copy-on-write clone of an existing Neon project branch. You can create a branch from a current or past state of a parent branch. For example, you can create a branch that includes all data up to the point of branch creation, or a branch that includes all data up to a particular time or a particular Log Sequence Number (LSN).

A branch is completely isolated from its parent Neon project, so you are free to play around with it, modify it, and remove it when it's no longer needed. When you create a branch, all of the data in the parent branch (in a current or past state according to your selection) is available to the branch, but changes to the branch are independent of the parent Neon branch and vice versa. A branch and its parent share the same history but diverge at the point of branch creation. Writes to a branch exist as an independent delta. Likewise, writes to a parent branch from the point of branch creation are independent of child branches.

Creating a branch does not increase load on the parent branch or affect it in any way, which means that you can create a branch at any time without impacting the performance of your production database.

A branch has the following characteristics:

- A branch is subject to the same technical preview limits as a Neon project:
  - Project data size is limited to 10GB.
  - The Point in Time Reset (PITR) window is limited to 7 days of reasonable usage.
  - The compute node is limited to 1 vCPU and 256MB of RAM.
- Branches are read-write.
- An endpoint is created for each branch when the branch is created, which permits connecting to the branch as you would connect to any Neon project from a PostgreSQL client, an application, or the Neon API.

## Creating a branch

Creating a branch requires that you have a Neon project. For information about creating a project, see [Setting up a project](/docs/getting-started-with-neon/setting-up-a-project).

To create a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
2. Click **New Branch**.
3. Enter a name for the branch or leave the field empty to have one generated for you.
4. Select a parent branch. You can branch from your project's `main` branch or from a previously created branch.
5. Select one of the following branching options:
    - **Head**: Branch the current state of the parent branch. The branch has access to all data up to the current point in time.
    - **Time**: Branch from a specific point in time. The branch is created with access to project data up to the specified date and time.
    - **LSN**: Branch from a specified Log Sequence Number (LSN). The branch is created with access to project data up to the specified LSN.
6. Click **Create Branch**.

AN endpoint is created with each branch, which you can use to connect to the branch from a PostgreSQL client, an application, or the Neon API.

## Viewing branches

To view the branches associated with a Neon project:

1. Select a project from the project drop-down list at the top of the Neon Console.
2. Select the **Branches** tab.
3. To view details for a particular branch, select the branch from the table.

Branch details include the branch name, parent branch, database size, storage size, and the time the branch was created.

The branches associated with a Neon project are also listed in the **Branches** widget on the project **Dashboard**. Selecting **Manage** from the **Branches** widget directs you to the **Branches** page, where you view and manage branches.

## Deleting a branch

Deleting a branch is a permanent action that cannot be undone. Deleting a branch also deletes the endpoint associated with the branch.

To delete a branch:

1. Select a project from the project drop-down list at the top of the Neon Console.
2. Select the **Branches** tab.
3. Select a branch from the table.
3. Click **Delete**.
4. In the **Delete the branch?** dialog, click **Delete**.

## Branching using the Neon API

Any branch action that you can perform in the Neon Console can also be performed using the Neon API. The following examples demonstrate how to create, view, and delete branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/).

### Prerequisites

- A Neon API request requires an API key. For information about obtaining an API key, see [Using API Keys](/docs/get-started-with-neon/using-api-keys). In the cURL examples below, the API key is represented by `$NEON_API_KEY`. Replace this value with your API key when issuing a request.
- The API examples in this section require a `<project_id>` or `<branch_id>` value. You can find these values in the Neon Console on the **Settings** tab, under **General Settings**. Project and branch IDs generated by Neon appear similar to these: `restless-sea-792742` and `branch-broken-paper-301953`.

### Creating a branch

The following Neon API method creates a branch:

```bash
POST /projects/{project_id}/branches
```

Specified in a cURL command, the API method appears as follows:

```bash
curl -X POST -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/projects/<project_id>/branches
```

### Listing branches

The following Neon API method lists branches for the specified project.

```bash
GET /projects/{project_id}/branches
```

Specified in a cURL command, the API method appears as follows:

```bash
curl -X GET -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/projects/<project_id>/branches
```

### Deleting a branch

The following Neon API method deletes the specified branch.

```bash
DELETE /branches/{branch_id}
```

Specified in a cURL command, the API method appears as follows:

```bash
curl -X DELETE -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/branches/<branch_id>
```

## Branching use cases

Branching has a variety of possible uses, some of which are described below:

### Development

You can quickly create an isolated branch of your production database that developers are free to play with and modify. Branches can be created instantly with full access to data that existed at the time the branch was created, eliminating the set-up time required to deploy and maintain a development database. Branching is so easy to create and cost-effective that you can create a separate branch for each developer to work on in parallel.

### Testing

Branching enables testers to use the most recent production data. Testers can quickly spin up new database branches for testing schema changes, running new queries, or running potentially destructive queries before they are deployed to production. A branch is completely isolated from its parent branch but has access to all of the parent branch's data up to the point of branch creation, which eliminates the effort involved in hydrating a test database. Testers can also run tests on separate branches in parallel, with each branch having its own dedicated compute resources.

Another potential testing scenario enabled by branching is creating a branch from a past point in time to track down and reproduce an issue. Neon permits creating a branch that includes data up to a user-specified time or Log Sequence Number (LSN).

### Staging

With Neon's branching capabilities, you can create a staging database by branching your production database. With the Neon API, you could automate the creation of a database branch for every pull request in your CI/CD pipeline.

### Analytics

You can run costly, long-running queries on an isolated branch of your production data, each with its own resources to avoid impacting your production system. With some automation, you could create and dispose of branches on a regular schedule to ensure that queries run on a recent copy of production data.

### Machine Learning

You can use branches for for ML model training. For example, you can create point-in-time branches to ensure ML model training repeatability.