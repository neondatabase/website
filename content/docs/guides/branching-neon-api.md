---
title: Branching with the Neon API
subtitle: Learn how to create and delete branches with the Neon API
enableTableOfContents: true
updatedOn: '2024-07-25T12:53:42.425Z'
---

The examples in this guide demonstrate creating, viewing, and deleting branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may only show some of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to the method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` program specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

## Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](../manage/api-keys#create-an-api-key). In the examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

## Create a branch with the API

The following Neon API method creates a branch. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranch).

```http
POST /projects/{project_id}/branches
```

The API method appears as follows when specified in a cURL command:

<Admonition type="note">
This method does not require a request body. Without a request body, the method creates a branch from the project's default branch, and a compute is not created.
</Admonition>

```bash
curl 'https://console.neon.tech/api/v2/projects/<project_id>/branches' \
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

- The `project_id` for a Neon project is found on the **Settings** page in the Neon Console, or you can find it by listing the projects for your Neon account using the Neon API. It is a generated value that looks something like this: `autumn-disk-484331`.
- The `endpoints` attribute creates a compute, which is required to connect to the branch. Neon supports `read_write` and `read_only` compute types. A branch can be created with or without a compute. You can specify `read_only` to create a [read replica](/docs/guides/read-replica-guide).
- The `branch` attribute specifies the parent branch.
- The `parent_id` can be obtained by listing the branches for your project. See [List branches](#list-branches-with-the-api). The `parent_id` is the `id` of the branch you are branching from. A branch `id` has a `br-` prefix. You can branch from your Neon project's default branch or a non-default branch.

The response includes information about the branch, the branch's compute, and the `create_branch` and `start_compute` operations that were initiated.

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

## List branches with the API

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

The response lists the project's default branch and any child branches. The name of the default branch in this example is `main`.

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

## Delete a branch with the API

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

## Restoring a branch using the API

To revert changes or recover lost data, you can use the branch restore endpoint in the Neon API.

```bash
POST /projects/{project_id}/branches/{branch_id_to_restore}/restore
```

For details on how to use this endpoint to restore a branch to its own or another branch's history, restore a branch to the head of its parent, and other restore options, see [Branch Restore using the API](/docs/guides/branch-restore#how-to-use-branch-restore).

<NeedHelp/>
