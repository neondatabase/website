---
title: Refresh a branch
subtitle: Learn how to refresh a Neon branch using the Neon API
enableTableOfContents: true
updatedOn: '2024-07-25T12:53:42.438Z'
---

When you create a branch in Neon, you create a copy-on-write clone that reflects the current state of the parent branch, but what do you do if your branch becomes stale? For example, changes are made to the data or schema on the parent branch that you would like reflected in your development branch, or your branch has aged out of the point-in-time restore window (the history shared with the parent branch) and is now taking up storage space. Ideally, you want to refresh your branch but keep the same compute, whose connection details may already be configured in your application or toolchain.

There isn't a single command that refreshes a branch, but you can do so using a combination of Neon API calls. The procedure described below refreshes a branch by performing the following steps:

1. [Creating a new up-to-date branch without a compute](#create-a-new-up-to-date-branch-without-a-compute)
2. [Moving the compute from your current branch to the new branch](#move-the-compute-from-your-current-branch-to-the-new-branch)
3. [Deleting the old branch](#delete-the-old-branch)
4. [Renaming the new branch to the name of the old branch](#rename-the-new-branch-to-the-name-of-the-old-branch)

<Admonition type="important">
The branch refresh procedure does not preserve data or schema changes on your current branch. Do not perform this procedure if you need to maintain changes made to your branch. The procedure is best suited to branches used in a read-only capacity.
</Admonition>

## Prerequisites

The following information is required to perform the procedure:

- A Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- The `project_id` for your Neon project. You can obtain a `project_id` using the [List projects](https://api-docs.neon.tech/reference/listprojects) method, or you can find it on your project's **Project settings** page in the Neon Console.
- The `branch_id` of the current branch. You can obtain a `branch_id` using the [List branches](https://api-docs.neon.tech/reference/listprojectbranches) method, or you can find it on your project's **Branches** page in the Neon Console. A `branch_id` has a `br-` prefix.
- The `endpoint_id` of the compute associated with the current branch. You can obtain an `endpoint_id` using the [List endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method, or you can find it on the **Branches** page in the Neon Console. An `endpoint_id` has an `ep-` prefix.

## Create a new up-to-date branch without a compute

The [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) request shown below creates a branch without a compute. The only required parameter is your Neon `project_id`. The `project_id` value used in the example below is `dark-cell-12604300`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/dark-cell-12604300/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "branch": {
    "name": "dev_branch_2"
  }
}
'
```

The response body includes the `id` of your new branch. You will need this value (`br-falling-flower-15986510`) to move the compute in the next step.

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-falling-flower-15986510",
    "project_id": "dark-cell-12604300",
    "parent_id": "br-bold-grass-13759798",
    "parent_lsn": "0/1EAB620",
    "name": "dev_branch_2",
    "current_state": "init",
    "pending_state": "ready",
    "creation_source": "console",
    "default": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-09-05T17:02:37Z",
    "updated_at": "2023-09-05T17:02:37Z"
  },
  "endpoints": [],
  "operations": [
    {
      "id": "d67c531b-1b00-44e0-b3d7-4bf306b030c0",
      "project_id": "dark-cell-12604300",
      "branch_id": "br-falling-flower-15986510",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-09-05T17:02:37Z",
      "updated_at": "2023-09-05T17:02:37Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-falling-flower-15986510",
      "name": "daniel",
      "protected": false,
      "created_at": "2023-09-05T16:25:57Z",
      "updated_at": "2023-09-05T16:25:57Z"
    }
  ],
  "databases": [
    {
      "id": 5840511,
      "branch_id": "br-falling-flower-15986510",
      "name": "neondb",
      "owner_name": "daniel",
      "created_at": "2023-09-05T16:25:57Z",
      "updated_at": "2023-09-05T16:25:57Z"
    }
  ]
}
```
</details>

## Move the compute from your current branch to the new branch

The [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) API request shown below moves the compute from your current branch to the new branch. The required parameters are the `project_id` and `endpoint_id` of your current branch, and the `branch_id` of your new branch. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

```bash shouldWrap
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/%20dark-cell-12604300/endpoints/ep-divine-violet-55990977 \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "endpoint": {
    "branch_id": "br-falling-flower-15986510"
  }
}
' | jq
```

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

```bash shouldWrap
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/dark-cell-12604300/branches/br-wandering-forest-45768684 \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

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
    "default": false,
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

```bash shouldWrap
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/dark-cell-12604300/branches/br-falling-flower-15986510 \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "branch": {
    "name": "dev_branch_1"
  }
}
'
```

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
    "default": false,
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
