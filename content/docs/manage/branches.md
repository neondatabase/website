---
title: Manage branches
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/get-started-with-neon/get-started-branching
---

Data resides in a branch. Each Neon project has a root branch called `main`. You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and users. Tier limits define the number of branches you can create in a project and the amount of data you can store in a branch.

A child branch is a copy-on-write clone the data in the parent branch. You can modify the data in a branch without affecting the data in the parent branch.
For more information about branches and how you can use them in your development workflows, see [Branching](../../conceptual-guides/branching).

You can create and manage branches using the Neon Console or [Neon API](https://neon.tech/api-reference/v2/). This topic covers both methods.

Before you can create a branch, you must have a Neon project. If you do not have a Neon project, see [Create a project](../projects/#create-a-project).

<Admonition type="important">
When working with branches, it is important to remove old and unused branches. Branches hold a lock on the data they contain, preventing disk space from being reallocated, which can lead to excessive disk space consumption. The Neon Free Tier limits the point-in-time restore window for a project to 7 days. To keep disk space usage to a minimum, it is recommended that you avoid allowing branches to age beyond the 7-day point-in-time restore window.
</Admonition>

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
7. Select whether or not to create an endpoint. An endpoint is a Neon compute instance, which is required to connect to the branch. If you are unsure, you can add an endpoint later.
8. Click **Create Branch** to create your branch.

You are directed to the **Branches** page where you are shown the details for your new branch.

## View branches

To view the branches in a Neon project:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table to view details about the branch.

![Branch details](./images/branch_details.png)

<Admonition type="tip">
The **Branches** widget on the project **Dashboard** also shows the branches in a Neon project.
</Admonition>

## Connect to a branch

Connecting to a database in a branch requires connecting via an endpoint, which is the compute instance associated with a branch. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../../get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the user you want to connect with.
![Connection details widget](./images/connection_details.png)
3. Copy the connection string. A connection string includes your user name, the endpoint hostname, and database name. The endpoint is the compute instance associated with the branch.
5. Add your password to the connection string as shown below, and connect with `psql`. You can connect using the same user and password that you use to connect to the parent branch.

  ```bash
  psql postgres://casey:<password>@ep-shrill-limit-432460.us-east-2.aws.neon.tech/neondb
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

## Branching with the Neon API

Branch actions performed in the Neon Console can be performed using the Neon API. The following examples demonstrate how to create, view, and delete branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/v2/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Manage API Keys](../api-keys).

### Create a branch with the API

The following Neon API method creates a branch. Adding the `endpoints` attribute to the call creates a compute endpoint, which is required to connect to the branch. A branch can be created with or without an endpoint.

<Admonition type="note">
The create branch API method does not require a request body. Without a request body, the method creates a branch from the project's `main` branch without an endpoint.
</Admonition>

```text
POST /projects/{project_id}/branches 
```

The API method appears as follows when specified in a cURL command:

```curl
curl 'https://console.neon.tech/api/v2/projects/<project_id>/branches' \
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
    "parent_id": "<parent_id>"
  }
}' | jq
```

- The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**, or you can find it by listing the projects for your Neon account using the Neon API.
- The `<parent_id>` can be obtained by listing the branches for your project. See [List branches](#list-branches-with-the-api). The `<parent_id>` is the `id` of the branch you are branching from. A branch `id` has a `br-` prefix. You can branch from your Neon project's root branch (`main`) or a previously created branch.

The response includes information about the branch, the branch's endpoint, and the `create_branch` and `start_compute` operations that have been initiated.

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

### List branches with the API

The following Neon API method lists branches for the specified project.

```text
GET /projects/{project_id}/branches
```

The API method appears as follows when specified in a cURL command:

```curl
curl 'https://console.neon.tech/api/v2/projects/<project_id>/branches' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**, or you can find it by listing the projects for your Neon account using the Neon API.

The response lists the project's root branch and any child branches.

Response:

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

### Delete a branch with the API

The following Neon API method deletes the specified branch.

```text
DELETE /branches/{branch_id}
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

- The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**, or you can find it by listing the projects for your Neon account using the Neon API.
- The `<branch_id>` can be found by listing the branches for your project. The `<branch_id>` is the `id` of a branch. A branch `id` has a `br-` prefix. See [List branches](#list-branches-with-the-api).

The response shows information about the branch being deleted and the `suspend_compute` and `delete_timeline` operations that were initiated.

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

You can verify that a branch is deleted by listing the branches for your project. See [List branches](#list-branches-with-the-api). The deleted branch should no longer be listed.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
