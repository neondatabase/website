---
title: Get started with Branching
enableTableOfContents: true
isDraft: false
---

This topic describes how to get started with Neon's branching feature, which allows you to branch your data in the same way that you branch your code.

A branch is a clone of your data that you are free to play around with and modify without affecting the originating data.
For more information about what branches are and how to use them in your development workflows, see [Branching](../../conceptual-guides/branching).

_Neon Branching capabilities are not yet publicly available. If you would like to try this feature, reach out to [iwantbranching@neon.tech](mailto:iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching for your account._

You can create and manage branches using the Neon Console or Neon API. In this topic, we cover branching using the Neon Console.

Before you can create a branch, you must have a Neon project to branch from. If you do not have a Neon project, see [Setting up a project](../setting-up-a-project).

## Create a branch

To create a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](./images/create_branch.png)
4. Enter a name for the branch.
5. Select a parent branch. You can branch from your Neon project's `main` branch or a previously created branch. Every Neon project is created with a default branch called `main`.  
6. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time (the default).
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified [Log Sequence Number (LSN)](../../reference/glossary/#lsn).
7. Click **Create Branch** to create your branch.

You are directed to the **Branches** tab where you are shown the details for your new branch.

## View branches

To view the branches in a Neon project:

1. In the Neon Console, select a project.
2. Select the **Branches** tab to view the branches for the project.
3. Select a branch from the table to view details about the branch, including the branch's endpoint hostname.

The **Branches** widget on the project **Dashboard** also lists the branches in a Neon project. Selecting **Manage** from the **Branches** widget directs you to the **Branches** page, where you can view and manage branches.

## Connect to a branch

Now that you have created a branch, how do you connect to it? You can connect to a branch using a connection string, as you would when connecting to any Neon database. The following steps describe how to connect to a branch using `psql`.

_**Note:**_ You can also query a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../query-with-neon-sql-editor).

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the user you want to connect with.
![Connection details widget](./images/connection_details.png)
3. Copy the connection string. A connection string includes your user name, endpoint hostname, and database name. The endpoint is the compute instance associated with the branch.
5. Add your password to the connection string as shown below, and connect with `psql`. You can connect using the same user and password that you use to connect to the parent branch.

  ```bash
  psql postgres://casey:<password>@ep-patient-wildflower-627498.cloud.neon.tech/main
  ```

_**Note:**_ The endpoint hostname, which is `ep-patient-wildflower-627498.cloud.neon.tech` in the example above, can also be found on the **Branches** page. For instructions, see [View branches](#view-branches).

If you want to connect to a branch from an application, the **Connection Details** widget on the project **Dashboard** also provides connection examples for various languages and frameworks.

## Delete a branch

Deleting a branch is a permanent action. Deleting a branch also deletes the branch endpoint, which is the compute instance associated with the branch.

To delete a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
3. Select a branch from the table.
3. Click **Delete**.
4. On the **Delete the branch?** dialog, click **Delete**.

## Branching using the Neon API

Any branch action performed in the Neon Console can be performed using the [Neon API](https://neon.tech/api-reference/). The following examples demonstrate how to create, view, and delete branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Using API Keys](/docs/get-started-with-neon/using-api-keys). In the cURL examples below, `$NEON_API_KEY` represents the Neon API key. Replace `$NEON_API_KEY` with your API key when issuing a request.

### Create a branch

The following Neon API method creates a branch:

```bash
POST /projects/{project_id}/branches 
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/<project_id>/branches' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -d '{
  "branch": {
    "parent_id": "<parent_id>",
    "name": "<branch_name>"
  }
}
```

- The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**.
- The `<parent_id>` and `<branch_name>` values can be obtained by listing the branches for your project. See [List branches](#list-branches). The `<parent_id>` is the `id` of the branch you are branching from. You can branch from your Neon project's `main` branch or a previously created branch.

The response includes information about the branch, the branch's endpoint, and the `create_branch` and `start_compute` operations that have been initiated.

```bash
{
  "branch": {
    "id": "br-soft-term-199780",
    "project_id": "autumn-lake-518875",
    "parent_id": "br-steep-bonus-114258",
    "name": "staging_branch",
    "current_state": "init",
    "pending_state": "ready",
    "created_at": "2022-10-27T22:57:27Z",
    "updated_at": "2022-10-27T22:57:27Z"
  },
  "endpoints": [
    {
      "id": "ep-red-lake-259266",
      "project_id": "autumn-lake-518875",
      "branch_id": "br-soft-term-199780",
      "instance_type_id": "scalable",
      "region_id": "aws-us-east-1",
      "type": "read_write",
      "current_state": "init",
      "pending_state": "active",
      "settings": {},
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "allow_connections": true,
      "passwordless_access": true,
      "created_at": "2022-10-27T22:57:27Z",
      "updated_at": "2022-10-27T22:57:27Z",
      "proxy_host": "cloud.stage.neon.tech"
    }
  ],
  "operations": [
    {
      "id": "8bd2e83c-29fb-46ff-a989-4c2162748b2d",
      "project_id": "autumn-lake-518875",
      "branch_id": "br-soft-term-199780",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2022-10-27T22:57:27Z",
      "updated_at": "2022-10-27T22:57:27Z"
    },
    {
      "id": "12880f24-421c-4b63-a92f-d1c501bf89aa",
      "project_id": "autumn-lake-518875",
      "branch_id": "br-soft-term-199780",
      "endpoint_id": "ep-red-lake-259266",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2022-10-27T22:57:27Z",
      "updated_at": "2022-10-27T22:57:27Z"
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
curl -X GET -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/projects/<project_id>/branches |jq
```

The `<project_id>` for a Neon project is found in the Neon Console on the **Settings** tab, under **General Settings**.

Response:

```bash
   {
      "id": "br-steep-bonus-114258",
      "project_id": "autumn-lake-518875",
      "name": "main",
      "current_state": "ready",
      "created_at": "2022-10-24T19:12:18Z",
      "updated_at": "2022-10-24T19:12:19Z"
    },
    {
      "id": "br-snowy-flower-899793",
      "project_id": "autumn-lake-518875",
      "parent_id": "br-steep-bonus-114258",
      "parent_lsn": "0/2C01940",
      "name": "dev_branch",
      "current_state": "ready",
      "created_at": "2022-10-27T16:52:35Z",
      "updated_at": "2022-10-27T16:52:35Z"
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
curl -X DELETE -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/branches/<branch_id>
```

The `<branch_id>` can be found by listing the branches for your project. The `<branch_id>` is the `id` of a branch. See [List branches](#list-branches).

The response shows information about the branch being deleted and the `suspend_compute` and `delete_timeline` operations that were initiated.

```bash
  "branch": {
    "id": "br-snowy-flower-899793",
    "project_id": "autumn-lake-518875",
    "parent_id": "br-steep-bonus-114258",
    "parent_lsn": "0/2C01940",
    "name": "dev_branch",
    "current_state": "ready",
    "created_at": "2022-10-27T16:52:35Z",
    "updated_at": "2022-10-27T17:01:56Z"
  },
  "operations": [
    {
      "id": "bc2f34dc-72be-4efe-918a-30e46e4bd077",
      "project_id": "autumn-lake-518875",
      "branch_id": "br-snowy-flower-899793",
      "endpoint_id": "ep-empty-tooth-523438",
      "action": "suspend_compute",
      "status": "running",
      "failures_count": 0,
      "created_at": "2022-10-27T17:01:56Z",
      "updated_at": "2022-10-27T17:01:56Z"
    },
    {

      "id": "5c6d1ce9-793c-41e7-910e-1af424de4d36",
      "project_id": "autumn-lake-518875",
      "branch_id": "br-snowy-flower-899793",
      "action": "delete_timeline",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2022-10-27T17:01:56Z",
      "updated_at": "2022-10-27T17:01:56Z"
    }
  ]
}
```

You can verify that a branch is deleted by listing the branches for your project. See [List branches](#list-branches). The deleted branch should no longer be listed.

