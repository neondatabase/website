---
title: Manage branches
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/get-started-with-neon/get-started-branching
updatedOn: '2024-12-13T21:17:10.765Z'
---

Data resides in a branch. Each Neon project is created with a [root branch](#root-branch) called `main`, which is also designated as your [default branch](#default-branch). You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and roles. Plan limits define the number of branches you can create in a project and the amount of data you can store in a branch.

A child branch is a copy-on-write clone of the parent branch. You can modify the data in a branch without affecting the data in the parent branch.
For more information about branches and how you can use them in your development workflows, see [Branching](/docs/introduction/branching).

You can create and manage branches using the Neon Console, [Neon CLI](/docs/reference/neon-cli), or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="important">
When working with branches, it is important to remove old and unused branches. Branches hold a lock on the data they contain, preventing disk space from being reallocated. Neon retains a data history by default. You can configure the retention period. See [Point-in-time restore](/docs/introduction/point-in-time-restore). To keep data storage to a minimum, remove branches before they age out of the history retention window.
</Admonition>

## Default branch

Each Neon project has a default branch. In the Neon Console, your default branch is identified by a `DEFAULT` tag. You can designate any branch as the default branch for your project.

The default branch has a larger compute hour allowance that non-default branches on the Free Plan. For users on paid plans, the compute associated with the default branch is exempt from the limit on simultaneously active computes, ensuring that it is always available.

## Non-default branch

Any branch not designated as the default branch is considered a non-default branch. You can rename or delete non-default branches.

- For Neon Free Plan users, computes associated with **non-default branches** are suspended if you exceed the Neon Free Plan 5 hours per month for **non-default branches**.
- For users on paid plans, default limits prevent more than 20 concurrently active computes. Beyond that limit, a compute associated with a non-default branch remains suspended.

## Protected branch

Neon's protected branches feature implements a series of protections:

- Protected branches cannot be deleted.
- Protected branches cannot be [reset](/docs/manage/branches#reset-a-branch-from-parent).
- Projects with protected branches cannot be deleted.
- Computes associated with a protected branch cannot be deleted.
- New passwords are automatically generated for Postgres roles on branches created from protected branches. [See below](#new-passwords-generated-for-postgres-roles-on-child-branches).
- With additional configuration steps, you can apply IP Allow restrictions to protected branches only. The [IP Allow](/docs/introduction/ip-allow) feature is available on the Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans. See [below](#how-to-apply-ip-restrictions-to-protected-branches).
- Protected branches are not [archived](/docs/guides/branch-archiving) due to inactivity.

Typically, a protected status is given to a branch or branches that hold production data or sensitive data. The protected branch feature is only supported on Neon's paid plans. See [Set a branch as protected](#set-a-branch-as-protected).

## Create a branch

To create a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Click **Create branch** to open the branch creation dialog.
   ![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch.
5. Select a parent branch. You can branch from your Neon project's [default branch](#default-branch) or a [non-default branch](#non-default-branch).
6. Select an **Include data up to** option to specify the data to be included in your branch.

<Admonition type="note">
The **Specific date and time** and the **Specific Log Sequence Number Data** options do not include data changes that occurred after the specified date and time or LSN, which means the branch contains data as it existed previously, allowing for point-in-time restore. You can only specify a date and time or LSN value that falls within your history retention window. See [Configure history retention](/docs/manage/projects#configure-history-retention).
</Admonition>

7. Click **Create new branch** to create your branch.

You are directed to the **Branch** overview page where you are shown the details for your new branch.

<Admonition type="note" title="Postgres role passwords on branches">
When creating a new branch, the branch will have the same Postgres role passwords as the parent branch. If you want your branch created with new Postgres role passwords, you can enable [branch protection](/docs/guides/protected-branches).
</Admonition>

## View branches

To view the branches in a Neon project:

1. In the Neon Console, select a project.
1. Select **Branches** to view all current branches in the project.

   ![all branches](/docs/manage/branches_all_list.png)

   Branch details in this table view include:

   - **Branch**: The branch name, which is a generated name if no name was specified when created.
   - **Parent**: Indicates the parent from which this branch was created, helping you track your branch hierarchy.
   - **Compute hours**: Number of hours the branch's compute was active so far in the current billing period.
   - **Primary compute**: Shows the current compute size and status for the branch's compute.
   - **Data size**: Indicates the logical data size of each branch, helping you monitor your plan's storage limit. Data size does not include history.
   - **Last active**: Shows when the branch's compute was last active.

1. Select a branch from the table to view details about the branch.

   ![View branch details](/docs/manage/branch_details.png)

   Branch details shown on the branch page include:

   - **Archive status**: When the branch was archived. For more, see [Branch archiving](/docs/guides/branch-archiving).
   - **ID**: The branch ID. Branch IDs have a `br-` prefix.
   - **Created**: The date and time the branch was created.
   - **Compute hours**: The compute hours used by the branch in the current billing period.
   - **Data size**: The logical data size of the branch. Data size does not include history.
   - **Parent branch**: The branch from which this branch was created (only applicable to child branches).
   - **Branching point**: The point in time, in terms of data, from which the branch was created (only applicable to child branches).
   - **Last data reset**: The last time the branch was reset from the parent branch (only applicable to child branches). For information about the **Reset from parent** option, see [Reset from parent](/docs/guides/reset-from-parent).
   - **Compare to parent**: For information about the **Open schema diff** option, see [Schema diff](/docs/guides/schema-diff).

The branch details page also includes details about the **Computes**, **Roles & Databases**, and **Child branches** that belong to the branch. In Neon, all of these objects are associated with a particular branch. For information about these objects, see:

- [Manage computes](/docs/manage/endpoints#view-a-compute).
- [Manage roles](/docs/manage/roles)
- [Manage databases](/docs/manage/databases)
- [View branches](#view-branches)

## Branch archiving

On the Free Plan, Neon automatically archives inactive branches to cost-efficient archive storage after a defined threshold. For more, see [Branch archiving](/docs/guides/branch-archiving).

## Rename a branch

Neon permits renaming a branch, including your project's default branch. To rename a branch:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table.
4. On the branch overview page, click the **Actions** drop-down menu and select **Rename**.
5. Specify a new name for the branch and click **Save**.

## Set a branch as default

Each Neon project is created with a default branch called `main`, but you can designate any branch as your project's default branch. The advantage of the default branch is that it has a larger compute hour allowance on the Free Plan. For users on paid plans, the compute associated with the default branch is exempt from the limit on simultaneously active computes, ensuring that it is always available. For more information, see [Default branch](#default-branch).

To set a branch as the default branch:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table.
4. On the branch overview page, click the **Actions** drop-down menu and select **Set as default**.
5. In the **Set as default** confirmation dialog, click **Set as default** to confirm your selection.

## Set a branch as protected

This feature is available on all Neon's paid plans, which supports up to five protected branches.

To set a branch as protected:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table.
4. On the branch overview page, click the **Actions** drop-down menu and select **Set as protected**.
5. In the **Set as protected** confirmation dialog, click **Set as protected** to confirm your selection.

For details and configuration instructions, refer to our [Protected branches guide](/docs/guides/protected-branches).

## Connect to a branch

Connecting to a database in a branch requires connecting via a compute associated with the branch. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
   ![Connection details widget](/docs/connect/connection_details.png)
3. Copy the connection string. A connection string includes your role name, the compute hostname, and database name.
4. Connect with `psql` as shown below.

```bash shouldWrap
psql postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

<Admonition type="tip">
A compute hostname starts with an `ep-` prefix. You can also find a compute hostname on the **Branches** page in the Neon Console. See [View branches](#view-branches).
</Admonition>

If you want to connect from an application, the **Connection Details** widget on the project **Dashboard** and the [Frameworks](/docs/get-started-with-neon/frameworks) and [Languages](/docs/get-started-with-neon/languages) sections in the documentation provide various connection examples.

## Reset a branch from parent

Use Neon's **Reset from parent** feature to instantly update a branch with the latest schema and data from its parent. This feature can be an integral part of your CI/CD automation.

You can use the Neon Console, CLI, or API. For more details, see [Reset from parent](/docs/guides/reset-from-parent).

## Restore a branch to its own or another branch's history

There are several restore operations available using Neon's Branch Restore feature:

- Restore a branch to its own history
- Restore a branch to the head of another branch
- Restore a branch to the history of another branch

You can use the Neon Console, CLI, or API. For more details, see [Branch Restore](/docs/guides/branch-restore).

## Delete a branch

Deleting a branch is a permanent action. Deleting a branch also deletes the databases and roles that belong to the branch as well as the compute associated with the branch. You cannot delete a branch that has child branches. The child branches must be deleted first.

To delete a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Select a branch from the table.
4. On the branch overview page, click the **Actions** drop-down menu and select **Delete**.
5. On the confirmation dialog, click **Delete**.

## Check the data size

You can check the logical data size for the databases on a branch by viewing the **Data size** value on the **Branches** page or page in the Neon Console. Alternatively, you can run the following query on your branch from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client connected to your database:

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

Data size does not include [history](/docs/reference/glossary#history).

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

<LinkAPIKey />
### Create a branch with the API

The following Neon API method creates a branch. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranch).

```http
POST /projects/{project_id}/branches
```

The API method appears as follows when specified in a cURL command. The `endpoints` attribute creates a compute, which is required to connect to the branch. A branch can be created with or without a compute. The `branch` attribute specifies the parent branch.

<Admonition type="note">
This method does not require a request body. Without a request body, the method creates a branch from the project's default branch, and a compute is not created.
</Admonition>

```bash
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/branches' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
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
- The `parent_id` can be obtained by listing the branches for your project. See [List branches](#list-branches-with-the-api). The `<parent_id>` is the `id` of the branch you are branching from. A branch `id` has a `br-` prefix. You can branch from your Neon project's default branch or a previously created branch.

The response body includes information about the branch, the branch's compute, and the `create_branch` and `start_compute` operations that were initiated.

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

```http
GET /projects/{project_id}/branches
```

The API method appears as follows when specified in a cURL command:

```bash
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/branches' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

The `project_id` for a Neon project is found on the **Settings** page in the Neon Console, or you can find it by listing the projects for your Neon account using the Neon API.

The response body lists the project's default branch and any child branches. The name of the default branch in this example is `main`.

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

```http
DELETE /projects/{project_id}/branches/{branch_id}
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/autumn-disk-484331/branches/br-dawn-scene-747675' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
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
