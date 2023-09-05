---
title: Promote a branch to primary
subtitle: Learn how to promote a branch to the primary branch of your project without modifying your application configuration
enableTableOfContents: true
---

This procedure describes how to create a new branch and promote it to the primary branch of your Neon project using the Neon API.

## What is a primary branch?

Each Neon project has a primary branch. In the Neon Console, your primary branch is identified on the **Branches** page by a `PRIMARY` tag. You can designate any branch as the primary branch. The advantage of the primary branch is that its compute endpoint remains accessible if you exceed your project's limits, ensuring uninterrupted access to data that resides on the primary branch.

- For [Free Tier](/docs/introduction/free-tier) users, the compute endpoint associated with the primary branch remains accessible if you exceed the _Active time_ limit of 100 hours per month.
- For [Pro plan](/docs/introduction/pro-plan) users, the compute endpoint associated with the primary branch is exempt from the limit on simultaneously active computes, ensuring that it is always available. Neon has a default limit of 20 simultaneously active computes.

For these reasons, it's recommended that you define the branch that holds your production data as your primary branch.

## Why promote a branch to primary?

A common usage scenario that involves promoting branch to primary is data recovery. For example, a data loss occurs on the current primary branch. To recover the lost data, you create a point-in-time branch with data that existed before the data loss occurred. To avoid modifying your application's database connection configuration, you move your current compute endpoint from the old branch to the new branch.

The procedure described below creates a new branch and promotes it to the primary branch of your project by performing the following steps:

1. [Creating a new point-in-time branch without a compute endpoint](#creating-a-new-point-in-time-branch-without-a-compute-endpoint)
2. [Moving the compute endpoint from your current primary branch to the new branch](#move-the-compute-endpoint-from-your-current-branch-to-the-new-branch)
3. [Deleting the old branch](#delete-the-old-branch)
4. [Renaming the new branch to the name of the old branch](#rename-the-new-branch-to-the-name-of-the-old-branch)
5. [Promoting the new branch to primary](#promoting-the-new-branch-to-primary)

## Prerequisites

The following information is required to perform the procedure:

- A Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- The `project_id` for your Neon project. You can obtain a `project_id` using the [List projects](https://api-docs.neon.tech/reference/listprojects) method, or you can find it on your project's **Settings** page in the Neon Console.
- The `branch_id` of the current branch. You can obtain a `branch_id` using the [List branches](https://api-docs.neon.tech/reference/listprojectbranches) method, or you can find it on the your project's **Branches** page in the Neon Console. An `branch_id` has a `br-` prefix.
- The `endpoint_id` of the compute endpoint associated with the current branch. You can obtain an `endpoint_id` using the [List endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method, or you can find it on the **Branches** page in the Neon Console. An `endpoint_id` has an `ep-` prefix.

## Creating a new point-in-time branch without a compute endpoint

The [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) request shown below creates a point-in-time branch without a compute endpoint. Required parameters are your Neon `project_id`. To create a point-in-time branch, you must specify a `parent_timestamp` value in the branch object. The timestamp must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/). For more information about point-in-time restore, see [Branching — Point-in-time restore (PITR)](/docs/guides/branching-pitr).

The `project_id` value used in the example below is `young-silence-08999984`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

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

The response body includes the `id` of your new branch. You will need this value (`br-summer-water-09767623`) to move the compute endpoint in the next step.

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

## Move the compute endpoint from your current branch to the new branch

The [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) API request shown below moves the compute endpoint from your current branch to the new branch. The required parameters are the `project_id` and `endpoint_id` of your current branch, and the `branch_id` of your new branch. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

<CodeBlock shouldWrap>

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/%20dark-cell-12604300/endpoints/ep-divine-violet-55990977 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "branch_id": "br-falling-flower-15986510"
  }
}
' |jq
```

</CodeBlock>

<details>
<summary>Response body</summary>
```json
{
  "endpoint": {
    "host": "ep-divine-violet-55990977.us-east-2.aws.neon.tech",
    "id": "ep-divine-violet-55990977",
    "project_id": "dark-cell-12604300",
    "branch_id": "br-falling-flower-15986510",
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
    "last_active": "2000-01-01T00:00:00Z",
    "creation_source": "console",
    "created_at": "2023-09-05T16:53:14Z",
    "updated_at": "2023-09-05T17:07:26Z",
    "proxy_host": "us-east-2.aws.neon.tech",
    "suspend_timeout_seconds": 0,
    "provisioner": "k8s-pod"
  },
  "operations": []
}
```
</details>

## Delete the old branch

The [Delete branch](https://api-docs.neon.tech/reference/deleteprojectbranch) API request shown below deletes the old branch. The old branch will take up storage space, so it's recommended that you remove it. The required parameters are the `project_id` and `branch_id`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

<CodeBlock shouldWrap>

```curl
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/dark-cell-12604300/branches/br-wandering-forest-45768684 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' |jq
```

</CodeBlock>

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-wandering-forest-45768684",
    "project_id": "dark-cell-12604300",
    "parent_id": "br-bold-grass-13759798",
    "parent_lsn": "0/1EAB620",
    "name": "dev_branch_1",
    "current_state": "ready",
    "logical_size": 29679616,
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-09-05T16:53:14Z",
    "updated_at": "2023-09-05T17:09:19Z"
  },
  "operations": [
    {
      "id": "d5e39417-c35f-43df-b248-e2ee5c7f04e3",
      "project_id": "dark-cell-12604300",
      "branch_id": "br-wandering-forest-45768684",
      "action": "delete_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-09-05T17:09:19Z",
      "updated_at": "2023-09-05T17:09:19Z",
      "total_duration_ms": 0
    }
  ]
}
```
</details>

## Rename the new branch to the name of the old branch

Optionally, you can rename the new branch to the name of the old branch. The [Update branch](https://api-docs.neon.tech/reference/updateprojectbranch) API request shown below renames the new branch from `dev_branch_2` to `dev_branch_1`.

<CodeBlock shouldWrap>

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/dark-cell-12604300/branches/br-falling-flower-15986510 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "name": "dev_branch_1"
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
    "id": "br-falling-flower-15986510",
    "project_id": "dark-cell-12604300",
    "parent_id": "br-bold-grass-13759798",
    "parent_lsn": "0/1EAB620",
    "name": "dev_branch_1",
    "current_state": "ready",
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-09-05T17:02:37Z",
    "updated_at": "2023-09-05T17:14:47Z"
  },
  "operations": []
}
```
</details>

## Promoting the new branch to primary
