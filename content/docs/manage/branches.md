---
title: Manage branches
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/get-started-with-neon/get-started-branching
updatedOn: '2023-11-24T11:25:06.759Z'
---

Data resides in a branch. Each Neon project is created with a [primary branch](#primary-branch) called `main`. You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and roles. Tier limits define the number of branches you can create in a project and the amount of data you can store in a branch.

A child branch is a copy-on-write clone of the parent branch. You can modify the data in a branch without affecting the data in the parent branch.
For more information about branches and how you can use them in your development workflows, see [Branching](/docs/introduction/branching).

You can create and manage branches using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). This topic covers both methods.

<Admonition type="important">
When working with branches, it is important to remove old and unused branches. Branches hold a lock on the data they contain, preventing disk space from being reallocated. Neon retains a 7-day data history, by default. You can configure the retention period. See [Point-in-time restore](/docs/introduction/point-in-time-restore). To keep data storage to a minimum, remove branches before they age out of the history retention window.
</Admonition>

## Primary branch

Each Neon project has a primary branch. In the Neon Console, your primary branch is identified by a `PRIMARY` tag. You can designate any branch as the primary branch for your project. The advantage of the primary branch is that its compute endpoint remains accessible if you exceed your project's limits, ensuring uninterrupted access to data that resides on the primary branch, which is typically the branch used in production.

- For [Neon Free Tier](/docs/introduction/free-tier) users, the compute endpoint associated with the primary branch remains accessible if you exceed the _Active time_ limit of 100 hours per month.
- For [Neon Pro Plan](/docs/introduction/pro-plan) users, the compute endpoint associated with the primary branch is exempt from the limit on simultaneously active computes, ensuring that it is always available. Neon has a default limit of 20 simultaneously active computes to protect your account from unintended usage.

## Non-primary branch

Any branch not designated as the primary branch is considered a non-primary branch. You can rename or delete non-primary branches.

- For [Neon Free Tier](/docs/introduction/free-tier) users, compute endpoints associated with non-primary branches are suspended if you exceed the Neon Free Tier  _compute active time_ limit of 100 hours per month.
- For [Neon Pro Plan](/docs/introduction/pro-plan) users, default limits prevent more than 20 simultaneously active compute endpoints. Beyond that limit, a compute endpoint associated with a non-primary branch remains suspended.

## Create a branch

To create a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch.
5. Select a parent branch. You can branch from your Neon project's [primary branch](#primary-branch) or a [non-primary branch](#non-primary-branch).
6. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time (the default).
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified [Log Sequence Number (LSN)](/docs/reference/glossary#lsn).
7. Select whether or not to create a compute endpoint, which is required to connect to the branch. If you are unsure, you can add a compute endpoint later. Neon Pro Plan users can users click **Change** or **Settings** to override or modify the default compute settings, including the compute size, autoscaling, and auto-suspend settings.
8. Click **Create Branch** to create your branch.

You are directed to the **Branches** page where you are shown the details for your new branch.

## View branches

To view the branches in a Neon project:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table to view details about the branch.
![View branch details](/docs/manage/branch_details.png)

Branch details shown on the branch page include:

- **ID**: The branch ID. Branch IDs have a `br-` prefix.
- **Created**: The date and time the branch was created.
- **Current Data Size**: The current data size of the branch.
- **Active Time**: The total amount of time that your branch compute has been active within the current billing period, measured in hours.
- **Compute Time**: The computing capacity used by the branch within the current billing period, measured in Compute Unit (CU) hours.
- **Written Data**: The total volume of data written from your branch compute to storage within the current billing period, measured in gibibytes (GiB).
- **Data Transfer**: The total volume of data transferred out of Neon (known as "egress") within the current billing period, measured in (GiB).
- **Parent Branch**: The branch from which this branch was created (only visible for child branches).
- **Date**: The date the parent branch was created (only displayed for branches created with the **Time** option).
- **Time**: The time the parent branch was created (only displayed for branches created with the **Time** option).

For more information about **Active Time**, **Compute Time**, **Written Data**, and **Data Transfer** usage metrics, refer to our [Billing](/docs/introduction/billing) page.

The branch details page also includes details about the compute endpoint associated with the branch. For more information, see [View a compute endpoint](/docs/manage/endpoints#view-a-compute-endpoint).

## Rename a branch

Neon permits renaming a branch, including your project's primary branch. To rename a branch:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table.
4. On the branch page, click the **More** drop-down menu and select **Rename**.
5. Specify a new name for the branch and click **Save**.

## Set a branch as primary

Each Neon project is created with a primary branch called `main`, but you can designate any branch as your project's primary branch. The benefit of the primary branch is that the compute endpoint associated with the primary branch remains accessible if you exceed project limits, ensuring uninterrupted access to data on the primary branch. For more information, see [Primary branch](#primary-branch).

To set a branch as the primary branch:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table.
4. On the branch page, click the **More** drop-down menu and select **Set as primary**.
5. In the **Set as primary** confirmation dialog, click **Set as Primary** to confirm your selection.

## Connect to a branch

Connecting to a database in a branch requires connecting via a compute endpoint associated with the branch. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
3. Copy the connection string. A connection string includes your role name, the compute endpoint hostname, and database name.
4. Connect with `psql` as shown below.

  <CodeBlock shouldWrap>

  ```bash
  psql postgres://[user]:[password]@[neon_hostname]/[dbname]
  ```

  </CodeBlock>

<Admonition type="tip">
A compute endpoint hostname starts with an `ep-` prefix. You can also find a compute endpoint hostname on the **Branches** page in the Neon Console. See [View branches](#view-branches).
</Admonition>

If you want to connect from an application, the **Connection Details** widget on the project **Dashboard** and the [Guides](/docs/guides/guides-intro) section in the documentation provide connection examples for various languages and frameworks. For more information about connecting, see [Connect from any application](/docs/connect/connect-from-any-app).

## Reset a branch from parent

When working with database branches, you might find yourself in a situation where your working branch diverges too far from its parent. For example, let's say you have two child branches `staging` and `development` forked from your `main` production branch. You have been working on the `development` branch and find it is now too far out of date with production. You have no schema changes in `development` to consider or preserve; you just want a quick refresh of the data. With the **Reset from parent** feature, you can perform this clean reset to the latest data from the parent in a single operation, saving you the complication of manually creating and restoring branches.

Some key points:
* You can only reset a branch to the latest data from its parent. Point-in-time resets based on timestamp or LSN are not currently supported.
* This reset is a complete override, not a refresh or a merge. Any local changes made to the child branch are lost during this reset.
* Existing connections will be temporarily interupted during the reset. However, your connection details _do not change_. All connections are re-established as soon as the reset is done.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
On the **Branches** page in the Neon Console, select the branch that you want to reset.

The console opens to the details page your branch, giving you key information about the branch and its child status: its parent, the last time it was reset, and other relevent detail.

To reset the branch, select **Reset from parent** from either the **More** dropdown or the **Last Data Reset** panel.

![Reset from parent](/docs/manage/reset_from_parent.png)

<Admonition type="note">
If this branch has children of its own, resetting is blocked. The resulting error dialog lets you delete these child branches, after which you can continue with the reset.
</Admonition>

</TabItem>

<TabItem>
Using the CLI, you can reset a branch from parent using the following command:

``` bash
neonctl branches reset <branch name> --parent
```
In the `branch` field, specify the name of the child branch whose data you want to reset. The `--parent` parameter specifies the kind of reset action that Neon will perform. In the future, there may be other kinds of resets available. For example, rewinding a branch to an earlier period in time.

If you have multiple projects in your account, you'll also have to include the project-id in the command along with the branch.

``` bash
neonctl branches reset <branch name> --parent --project-id <project id>
```

Example:
``` bash
neonctl branches reset development --parent --project-id noisy-pond-12345678
```

</TabItem>

<TabItem>
Resetting from parent is not directly supported from the API. However, you can use the instructions on [Refreshing a branch](docs/guides/branch-refresh) to perform a similar operation. It involves using the API to create a new branch, transfer the compute endpoint, deleting the old branch, and (optionally) renaming the new branch.
</TabItem>

</Tabs>


## Delete a branch

Deleting a branch is a permanent action. Deleting a branch also deletes the databases and roles that belong to the branch as well as the compute endpoint associated with the branch. You cannot delete a branch that has child branches. The child branches must be deleted first.

To delete a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Select a branch from the table.
4. On the branch page, click the **More** drop-down menu and select **Delete**.
4. On the confirmation dialog, click **Delete**.

## Check the data size

Tier limits define the amount of data you can store in a branch. The [Neon Free Tier](/docs/introduction/free-tier) permits 3 GiB per branch. When creating a new branch, the child branch includes the data from the parent branch. For example, if you have a branch with 1 GiB of data, the child branch is created with the same 1 GiB of data.

You can check the data size for a branch by viewing the `Database size` value on the branch details page (see [View branches](#view-branches)). Alternatively, you can run the following query from the Neon SQL Editor:

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

<Admonition type="info">
Neon stores data in its own internal format.
</Admonition>

## Branching with the Neon CLI

The Neon CLI supports creating and managing branches. For instructions, see [Neon CLI commands — branches](/docs/reference/cli-branches). For a Neon CLI branching guide, see [Branching with the Neon CLI](/docs/reference/cli-branches).

## Branching with the Neon API

Branch actions performed in the Neon Console can also be performed using the Neon API. The following examples demonstrate how to create, view, and delete branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all of the attributes for a particular method, refer to the method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a branch with the API

The following Neon API method creates a branch. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranch).

```text
POST /projects/{project_id}/branches 
```

The API method appears as follows when specified in a cURL command. The `endpoints` attribute creates a compute endpoint, which is required to connect to the branch. A branch can be created with or without a compute endpoint. The `branch` attribute specifies the parent branch.

<Admonition type="note">
This method does not require a request body. Without a request body, the method creates a branch from the project's primary branch, and a compute endpoint is not created.
</Admonition>

```curl
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/branches' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoints": [
    {
      "type": "read_write"
    }
  ],
  "branch": {
    "parent_id": "br-wispy-dew-591433"
  }
}' | jq
```

- The `project_id` for a Neon project is found on the **Settings** page in the Neon Console, or you can find it by listing the projects for your Neon account using the Neon API.
- The `parent_id` can be obtained by listing the branches for your project. See [List branches](#list-branches-with-the-api). The `<parent_id>` is the `id` of the branch you are branching from. A branch `id` has a `br-` prefix. You can branch from your Neon project's primary branch or a previously created branch.

The response body includes information about the branch, the branch's compute endpoint, and the `create_branch` and `start_compute` operations that were initiated.

<details>
<summary>Response body</summary>

```json
{
  "branch": {
    "id": "br-dawn-scene-747675",
    "project_id": "autumn-disk-484331",
    "parent_id": "br-wispy-dew-591433",
    "parent_lsn": "0/1AA6408",
    "name": "br-dawn-scene-747675",
    "current_state": "init",
    "pending_state": "ready",
    "created_at": "2022-12-08T19:55:43Z",
    "updated_at": "2022-12-08T19:55:43Z"
  },

  "endpoints": [
    {
      "host": "ep-small-bush-675287.us-east-2.aws.neon.tech",
      "id": "ep-small-bush-675287",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-dawn-scene-747675",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-2",
      "type": "read_write",
      "current_state": "init",
      "pending_state": "active",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "created_at": "2022-12-08T19:55:43Z",
      "updated_at": "2022-12-08T19:55:43Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    }
  ],
  "operations": [
    {
      "id": "22acbb37-209b-4b90-a39c-8460090e1329",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-dawn-scene-747675",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2022-12-08T19:55:43Z",
      "updated_at": "2022-12-08T19:55:43Z"
    },
    {
      "id": "055b17e6-ffe3-47ab-b545-cfd7db6fd8b8",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-dawn-scene-747675",
      "endpoint_id": "ep-small-bush-675287",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2022-12-08T19:55:43Z",
      "updated_at": "2022-12-08T19:55:43Z"
    }
  ]
}
```

</details>

### List branches with the API

The following Neon API method lists branches for the specified project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojectbranches).

```text
GET /projects/{project_id}/branches
```

The API method appears as follows when specified in a cURL command:

```curl
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/branches' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

The `project_id` for a Neon project is found on the **Settings** page in the Neon Console, or you can find it by listing the projects for your Neon account using the Neon API.

The response body lists the project's primary branch and any child branches. The name of the primary branch in this example is `main`.

<details>
<summary>Response body</summary>

```json
{
  "branches": [
    {
      "id": "br-dawn-scene-747675",
      "project_id": "autumn-disk-484331",
      "parent_id": "br-wispy-dew-591433",
      "parent_lsn": "0/1AA6408",
      "name": "br-dawn-scene-747675",
      "current_state": "ready",
      "logical_size": 28,
      "created_at": "2022-12-08T19:55:43Z",
      "updated_at": "2022-12-08T19:55:43Z"
    },
    {
      "id": "br-wispy-dew-591433",
      "project_id": "autumn-disk-484331",
      "name": "main",
      "current_state": "ready",
      "logical_size": 28,
      "physical_size": 31,
      "created_at": "2022-12-07T00:45:05Z",
      "updated_at": "2022-12-07T00:45:05Z"
    }
  ]
}
```

</details>

### Delete a branch with the API

The following Neon API method deletes the specified branch. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectbranch).

```text
DELETE /projects/{project_id}/branches/{branch_id}
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/autumn-disk-484331/branches/br-dawn-scene-747675' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

- The `project_id` for a Neon project is found on the **Settings** page in the Neon Console, or you can find it by listing the projects for your Neon account using the Neon API.
- The `branch_id` can be found by listing the branches for your project. The `<branch_id>` is the `id` of a branch. A branch `id` has a `br-` prefix. See [List branches](#list-branches-with-the-api).

The response body shows information about the branch being deleted and the `suspend_compute` and `delete_timeline` operations that were initiated.

<details>
<summary>Response body</summary>

```json
{
  "branch": {
    "id": "br-dawn-scene-747675",
    "project_id": "autumn-disk-484331",
    "parent_id": "br-shy-meadow-151383",
    "parent_lsn": "0/1953508",
    "name": "br-flat-darkness-194551",
    "current_state": "ready",
    "created_at": "2022-12-08T20:01:31Z",
    "updated_at": "2022-12-08T20:01:31Z"
  },
  "operations": [
    {
      "id": "c7ee9bea-c984-41ac-8672-9848714104bc",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-dawn-scene-747675",
      "endpoint_id": "ep-small-bush-675287",
      "action": "suspend_compute",
      "status": "running",
      "failures_count": 0,
      "created_at": "2022-12-08T20:01:31Z",
      "updated_at": "2022-12-08T20:01:31Z"
    },
    {
      "id": "41646f65-c692-4621-9538-32265f74ffe5",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-dawn-scene-747675",
      "action": "delete_timeline",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2022-12-06T01:12:10Z",
      "updated_at": "2022-12-06T01:12:10Z"
    }
  ]
}
```

</details>

You can verify that a branch is deleted by listing the branches for your project. See [List branches](#list-branches-with-the-api). The deleted branch should no longer be listed.

<NeedHelp/>
