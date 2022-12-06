---
title: Branches
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/get-started-with-neon/get-started-branching
---

Data resides in a branch. Each Neon project has a root branch called `main`. You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and users. Tier limits define the number of branches you can create in a project and the amount of data you can store in each branch.

A child branch is a copy-on-write clone the data in the parent branch. You can modify the data in a branch without affecting the data in the parent branch.
For more information about branches and how you can use them in your development workflows, see [Branching](../../conceptual-guides/branching).

You can create and manage branches using the Neon Console or [Neon API](https://neon.tech/api-reference). This topic covers both methods.

Before you can create a branch, you must have a Neon project. If you do not have a Neon project, see [Projects](../projects/#create-a-project).

## Create a branch

To create a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](./images/create_branch.png)
4. Enter a name for the branch.
5. Select a parent branch. You can branch from your Neon project's [root branch](../../reference/glossary/#root-branch) (`main`) or a previously created branch.
6. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time (the default).
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified [Log Sequence Number (LSN)](../../reference/glossary/#lsn).
7. Click **Create Branch** to create your branch.

You are directed to the **Branches** page where you are shown the details for your new branch.

## View branches

To view the branches in a Neon project:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table to view details about the branch.

![Branch details](./images/branch_details.png)

<Admonition type="note">
Each branch is created with a read-write endpoint, which is the compute instance associated with the branch. To connect to a database in a branch, you must connect via an endpoint. For instructions, see [Connect to a branch database](#connect-to-a-branch-database). 
</Admonition>

The **Branches** widget on the project **Dashboard** also lists the branches in a Neon project. Selecting **Manage** from the **Branches** widget directs you to the **Branches** page, where you can view and manage branches.

## Connect to a branch

Connecting to a database in a branch requires connecting via an endpoint, which is the compute instance associated with a branch. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../query-with-neon-sql-editor).
</Admonition>

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the user you want to connect with.
![Connection details widget](./images/connection_details.png)
3. Copy the connection string. A connection string includes your user name, the endpoint hostname, and database name. The endpoint is the compute instance associated with the branch.
5. Add your password to the connection string as shown below, and connect with `psql`. You can connect using the same user and password that you use to connect to the parent branch.

  ```bash
  psql postgres://casey:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/neondb
  ```

<Admonition type="tip">
A endpoint hostname starts with an `ep-` prefix. You can also find an endpoint hostname on the **Branches** page in the Neon Console. See [View branches](#view-branches).
</Admonition>

If you want to connect from an application, the **Connection Details** widget on the project **Dashboard** and the _Guides_ section in the documentation provide connection examples for various languages and frameworks. For more information about connecting, see [Connect from any application](../../connect/connect-from-any-app).

## Delete a branch

Deleting a branch is a permanent action. Deleting a branch also deletes the databases and users that belong to the branch as well as the branch endpoint, which is the compute instance associated with the branch. You cannot delete a branch that has child branches. The child branches must be deleted first.

To delete a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Select a branch from the table.
3. Click **Delete**.
4. On the confirmation dialog, click **Delete**.

## Check the data size

Tier limits define the amount of data you can store in a branch. Neon's free tier permits 3GB per branch. When creating a new branch, the child branch includes the data from the parent branch. For example, if you have a branch with 1GB of data, the child branch is created with the same 1GB of data.

You can check the data size for a branch by viewing the `Database size` value on the **Branches** page (see [View branchings](#view-branches)). Alternatively, you can run the following query from the Neon SQL Editor:

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

<Admonition type="info">
Neon stores data in its own internal format.
</Admonition>

## Branching using the Neon API

Branch actions performed in the Neon Console can be performed using the [Neon API](https://neon.tech/api-reference/v2/). The following examples demonstrate how to create, view, and delete branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/v2/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [API Keys](../api-keys).

### Create a branch

The following Neon API method creates a branch. Adding the `endpoints` attribute to the call creates a compute endpoint, which is required to connect to the branch. A branch can be created with or without an endpoint.

```bash
POST /projects/{project_id}/branches 
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/<project_id>/branches' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoints": [
    {
      "type": "read_write"
    }
  ],
  "branch": {
    "parent_id": "<parent_id>"
  }
}'
```

- The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**.
- The `<parent_id>` can be obtained by listing the branches for your project. See [List branches](#list-branches). The `<parent_id>` is the `id` of the branch you are branching from. A branch `id` has a `br-` prefix. You can branch from your Neon project's root branch (`main`) or a previously created branch.

The response includes information about the branch, the branch's endpoint, and the `create_branch` and `start_compute` operations that have been initiated.

```bash
{
  "branch": {
    "id": "br-flat-darkness-194551",
    "project_id": "sparkling-king-781971",
    "parent_id": "br-shy-meadow-151383",
    "parent_lsn": "0/1953508",
    "name": "br-flat-darkness-194551",
    "current_state": "init",
    "pending_state": "ready",
    "created_at": "2022-12-06T01:10:45Z",
    "updated_at": "2022-12-06T01:10:45Z"
  },
  "endpoints": [
    {
      "host": "ep-restless-grass-543725.cloud.neon.tech",
      "id": "ep-restless-grass-543725",
      "project_id": "sparkling-king-781971",
      "branch_id": "br-flat-darkness-194551",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-west-2",
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
      "created_at": "2022-12-06T01:10:45Z",
      "updated_at": "2022-12-06T01:10:45Z",
      "proxy_host": "cloud.neon.tech"
    }
  ],
  "operations": [
    {
      "id": "c80f6e98-7595-412b-b0d3-8c4ce77a3103",
      "project_id": "sparkling-king-781971",
      "branch_id": "br-flat-darkness-194551",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2022-12-06T01:10:45Z",
      "updated_at": "2022-12-06T01:10:45Z"
    },
    {
      "id": "67ca339c-a861-48c7-8fed-13723b4868bb",
      "project_id": "sparkling-king-781971",
      "branch_id": "br-flat-darkness-194551",
      "endpoint_id": "ep-restless-grass-543725",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2022-12-06T01:10:45Z",
      "updated_at": "2022-12-06T01:10:45Z"
    }
  ]
}
```

### List branches

The following Neon API method lists branches for the specified project.

```bash
GET /projects/{project_id}/branches
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'GET' \
  'https://console.neon.tech/api/v2/projects/sparkling-king-781971/branches' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**.

The response lists the project's root branch and any child branches.

Response:

```bash
{
  "branches": [
    {
      "id": "br-flat-darkness-194551",
      "project_id": "sparkling-king-781971",
      "parent_id": "br-shy-meadow-151383",
      "parent_lsn": "0/1953508",
      "name": "br-flat-darkness-194551",
      "current_state": "ready",
      "logical_size": 28,
      "created_at": "2022-12-06T01:10:45Z",
      "updated_at": "2022-12-06T01:10:45Z"
    },
    {
      "id": "br-shy-meadow-151383",
      "project_id": "sparkling-king-781971",
      "name": "main",
      "current_state": "ready",
      "logical_size": 28,
      "physical_size": 29,
      "created_at": "2022-12-05T18:32:13Z",
      "updated_at": "2022-12-05T18:32:14Z"
    }
  ]
}
```

### Delete a branch

The following Neon API method deletes the specified branch.

```bash
DELETE /branches/{branch_id}
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

The `<branch_id>` can be found by listing the branches for your project. The `<branch_id>` is the `id` of a branch. A branch `id` has a `br-` prefix. See [List branches](#list-branches).

The response shows information about the branch being deleted and the `suspend_compute` and `delete_timeline` operations that were initiated.

```bash
{
  "branch": {
    "id": "br-flat-darkness-194551",
    "project_id": "sparkling-king-781971",
    "parent_id": "br-shy-meadow-151383",
    "parent_lsn": "0/1953508",
    "name": "br-flat-darkness-194551",
    "current_state": "ready",
    "created_at": "2022-12-06T01:10:45Z",
    "updated_at": "2022-12-06T01:12:10Z"
  },
  "operations": [
    {
      "id": "c7ee9bea-c984-41ac-8672-9848714104bc",
      "project_id": "sparkling-king-781971",
      "branch_id": "br-flat-darkness-194551",
      "endpoint_id": "ep-restless-grass-543725",
      "action": "suspend_compute",
      "status": "running",
      "failures_count": 0,
      "created_at": "2022-12-06T01:12:10Z",
      "updated_at": "2022-12-06T01:12:10Z"
    },
    {
      "id": "41646f65-c692-4621-9538-32265f74ffe5",
      "project_id": "sparkling-king-781971",
      "branch_id": "br-flat-darkness-194551",
      "action": "delete_timeline",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2022-12-06T01:12:10Z",
      "updated_at": "2022-12-06T01:12:10Z"
    }
  ]
}
```

You can verify that a branch is deleted by listing the branches for your project. See [List branches](#list-branches). The deleted branch should no longer be listed.
