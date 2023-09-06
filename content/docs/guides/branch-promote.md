---
title: Promote a branch to primary
subtitle: Learn how to promote a branch to the primary branch of your Neon project using the Neon API
enableTableOfContents: true
---

This guide describes how to create a new branch and promote it to the primary branch of your Neon project using the Neon API.

## What is a primary branch?

Each Neon project has a primary branch. In the Neon Console, your primary branch is identified on the **Branches** page by a `PRIMARY` tag. You can designate any branch as the primary branch. The advantage of the primary branch is that its compute endpoint remains accessible if you exceed your project's limits, ensuring uninterrupted access to data that resides on the primary branch.

- For [Free Tier](/docs/introduction/free-tier) users, the compute endpoint associated with the primary branch remains accessible if you exceed the _Active time_ limit of 100 hours per month.
- For [Pro plan](/docs/introduction/pro-plan) users, the compute endpoint associated with the primary branch is exempt from the limit on simultaneously active computes, ensuring that it is always available. Neon has a default limit of 20 simultaneously active computes.

## Why promote a branch to primary?

A common usage scenario involving promoting a branch to primary is data recovery. For example, a data loss occurs on the current primary branch. To recover the lost data, you create a point-in-time branch with data that existed before the data loss occurred. To avoid modifying your application's database connection configuration, you move the compute endpoint from the current primary branch to the new branch and make that branch your primary.

The procedure described below creates a new branch and promotes it to the primary branch of your project by performing the following steps:

1. [Creating a new point-in-time branch without a compute endpoint](#creating-a-new-point-in-time-branch-without-a-compute-endpoint)
2. [Moving the compute endpoint from your current primary branch to the new branch](#move-the-compute-endpoint-from-your-current-primary-branch-to-the-new-branch)
3. [Renaming the old primary branch](#rename-the-old-primary-branch)
4. [Renaming the new branch to the name of the old primary branch](#rename-the-new-branch-to-the-name-of-the-old-primary-branch)
5. [Promoting the new branch to primary](#promote-the-new-branch-to-primary)

## Prerequisites

The following information is required to perform the procedure:

- A Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- The `project_id` for your Neon project. You can obtain a `project_id` using the [List projects](https://api-docs.neon.tech/reference/listprojects) method, or you can find it on your project's **Settings** page in the Neon Console.
- The `branch_id` of the current primary branch. You can obtain a `branch_id` using the [List branches](https://api-docs.neon.tech/reference/listprojectbranches) method, or you can find it on the your project's **Branches** page in the Neon Console. A `branch_id` has a `br-` prefix.
- The `endpoint_id` of the compute endpoint associated with the current primary branch. You can obtain an `endpoint_id` using the [List endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method, or you can find it on the **Branches** page in the Neon Console. An `endpoint_id` has an `ep-` prefix.

## Creating a new point-in-time branch without a compute endpoint

The [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) request shown below creates a point-in-time branch without a compute endpoint. The `project_id` is a required parameter. To create a point-in-time branch, specify a `parent_timestamp` value in the `branch` object. The `parent_timestamp` value must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/). For more information about point-in-time restore, see [Branching — Point-in-time restore (PITR)](/docs/guides/branching-pitr).

The `project_id` value used in the example below is `young-silence-08999984`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key. The branch is given the  name `recovery_branch`. You will change the name in a later step.

```curl
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/young-silence-08999984/branches \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "parent_timestamp": "2023-09-02T10:00:00Z",
    "name": "recovery_branch"
  }
}
'
```

The response body includes the `id` of your new branch. You will need this value (`br-solitary-hat-85369851`) to move the compute endpoint in the next step.

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-solitary-hat-85369851",
    "project_id": "young-silence-08999984",
    "parent_id": "br-twilight-field-06246553",
    "parent_lsn": "0/1EC5378",
    "parent_timestamp": "2023-09-02T10:00:00Z",
    "name": "recovery_branch",
    "current_state": "init",
    "pending_state": "ready",
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-09-05T19:44:51Z",
    "updated_at": "2023-09-05T19:44:51Z"
  },
  "endpoints": [],
  "operations": [
    {
      "id": "192e9d28-1f82-4afc-8a2e-b8147ec0ff7b",
      "project_id": "young-silence-08999984",
      "branch_id": "br-solitary-hat-85369851",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-09-05T19:44:51Z",
      "updated_at": "2023-09-05T19:44:51Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-solitary-hat-85369851",
      "name": "daniel",
      "protected": false,
      "created_at": "2023-08-29T10:26:27Z",
      "updated_at": "2023-08-29T10:26:27Z"
    }
  ],
  "databases": [
    {
      "id": 5841198,
      "branch_id": "br-solitary-hat-85369851",
      "name": "neondb",
      "owner_name": "daniel",
      "created_at": "2023-09-05T19:40:09Z",
      "updated_at": "2023-09-05T19:40:09Z"
    }
  ]
}
```
</details>

## Move the compute endpoint from your current primary branch to the new branch

The [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) API request shown below moves the compute endpoint from your current primary branch to the new branch. The required parameters are the `project_id` and `endpoint_id` of your current primary branch, and the `branch_id` of the new branch. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

<CodeBlock shouldWrap>

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/young-silence-08999984/endpoints/ep-curly-term-54009904 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "branch_id": "br-solitary-hat-85369851"
  }
}
'
```

</CodeBlock>

<details>
<summary>Response body</summary>
```json
{
  "endpoint": {
    "host": "ep-curly-term-54009904.us-east-2.aws.neon.tech",
    "id": "ep-curly-term-54009904",
    "project_id": "young-silence-08999984",
    "branch_id": "br-solitary-hat-85369851",
    "autoscaling_limit_min_cu": 0.25,
    "autoscaling_limit_max_cu": 0.25,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "idle",
    "settings": {},
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "last_active": "2023-09-02T12:22:44Z",
    "creation_source": "console",
    "created_at": "2023-08-29T10:26:27Z",
    "updated_at": "2023-09-05T20:29:09Z",
    "proxy_host": "us-east-2.aws.neon.tech",
    "suspend_timeout_seconds": 0,
    "provisioner": "k8s-neonvm"
  },
  "operations": []
}
```
</details>

## Rename the old primary branch

The [Update branch](https://api-docs.neon.tech/reference/updateprojectbranch) API request shown below renames the old primary branch to `old_main`. You may want to delete this branch later to reduce storage usage, but just rename it for now. The required parameters are the `project_id` and `branch_id`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

<CodeBlock shouldWrap>

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/young-silence-08999984/branches/br-twilight-field-06246553 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "name": "old_main "
  }
}
'
```

</CodeBlock>

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-twilight-field-06246553",
    "project_id": "young-silence-08999984",
    "name": "old_main",
    "current_state": "ready",
    "logical_size": 29589504,
    "creation_source": "console",
    "primary": true,
    "cpu_used_sec": 969,
    "compute_time_seconds": 969,
    "active_time_seconds": 3816,
    "written_data_bytes": 4809458540,
    "data_transfer_bytes": 412826,
    "created_at": "2023-08-29T10:26:27Z",
    "updated_at": "2023-09-05T20:32:50Z"
  },
  "operations": []
}
```
</details>

## Rename the new branch to the name of the old primary branch

Rename the new branch to the name of the old branch, which was `main`. The [Update branch](https://api-docs.neon.tech/reference/updateprojectbranch) API request shown below renames the new branch from `recovery_branch` to `main`.

<CodeBlock shouldWrap>

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/young-silence-08999984/branches/br-solitary-hat-85369851 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "name": "main"
  }
}
'
```

</CodeBlock>

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-solitary-hat-85369851",
    "project_id": "young-silence-08999984",
    "parent_id": "br-twilight-field-06246553",
    "parent_lsn": "0/1EC5378",
    "parent_timestamp": "2023-09-02T10:00:00Z",
    "name": "main",
    "current_state": "ready",
    "logical_size": 29605888,
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-09-05T19:44:51Z",
    "updated_at": "2023-09-05T20:34:42Z"
  },
  "operations": []
}
```
</details>

## Promote the new branch to primary

The [Set primary branch](https://api-docs.neon.tech/reference/setprimaryprojectbranch) API request sets the new branch as the primary branch for the project.

<CodeBlock shouldWrap>

```curl
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/young-silence-08999984/branches/br-solitary-hat-85369851/set_as_primary \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

</CodeBlock>

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-solitary-hat-85369851",
    "project_id": "young-silence-08999984",
    "parent_id": "br-twilight-field-06246553",
    "parent_lsn": "0/1EC5378",
    "parent_timestamp": "2023-09-02T10:00:00Z",
    "name": "main",
    "current_state": "ready",
    "logical_size": 29605888,
    "creation_source": "console",
    "primary": true,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-09-05T19:44:51Z",
    "updated_at": "2023-09-05T20:37:08Z"
  },
  "operations": []
}
```
</details>

You should now have a new primary branch, and because you moved the compute endpoint from your old primary branch to the new one, you do not need to change the connection details in your applications. Once you have validated the change, consider deleting your old primary branch to save storage space. See [Delete a branch with the AP](/docs/manage/branches#delete-a-branch-with-the-api).
