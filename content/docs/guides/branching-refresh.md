---
title: Refresh a branch
subtitle: Refresh a branch using the Neon API
enableTableOfContents: true
---

This guide describes how to refresh a Neon branch using the Neon API.

When you create a branch in Neon, you get a copy-on-write clone of your data that reflects the current state of the parent branch, but what can you do if your branch becomes stale? For example, changes are made to the parent branch that you would like reflected in your development branch, or your branch is about to age out of the point-in-time restore window (the history that is shared with the parent branch), which will take up additional storage. Ideally, you want to refresh your branch but not the branch's compute endpoint, whose connection details are already configured in your application or workflow.

Currently, there isn't a single command that refreshes branch, but you can do so using a combination of Neon API calls. The procedure outline below does the following:

1. Creates a new up-to-date branch without a compute endpoint
2. Moves the compute endpoint from your current branch to the new branch
3. Deletes the old branch

The API calls that perform these steps can be combined into a single script, which is provided at the end of the guide.

<Admonition type="important">
This method does not preserve or merge data or schema changes on your current branch to the new branch. This type of merge is not supported, although you can migrate schema changes from one branch to another manually or using a third part tool that supports migrations, but this is outside the scope of this guide.
</Admonition>

## Before you begin

You require the following:

- A Neon API key. For information about obtaining one, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- The `project_id` for your Neon project. You can obtain a `project_id` using the [List projects](https://api-docs.neon.tech/reference/listprojects) method, or you can find it in the Neon Console, on the your project's **Settings** page.
- The `branch_id` for the branch you want to refresh. You can obtain a `branch_id` using the [List branches](https://api-docs.neon.tech/reference/listprojectbranches) method, or you can find it in the Neon Console, on the your project's **Branches** page.
- The `endpoint_id` of the compute endpoint associated with your current branch. You can obtain an `endpoint_id` using the [List endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method, or you can find it in the Neon Console, on the **Branches** page. An `endpoint_id` has an `ep-` prefix.

## Create a new up-to-date branch without a compute endpoint

A [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) request creates a branch without a compute endpoint by default. The only required parameter is your Neon `project_id`. The `project_id` value used in the example below is `purple-bar-16090093`. Your `project_id` will differ but have a similar format. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual key.

```curl
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "name": "branch2"
  }
}
' |jq
```

Make note of the `branch_id` of your new branch. You will need it in the next step.

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-snowy-rice-16173643",
    "project_id": "purple-bar-16090093",
    "parent_id": "br-misty-disk-67154072",
    "parent_lsn": "0/2832A78",
    "name": "branch2",
    "current_state": "init",
    "pending_state": "ready",
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-08-16T19:43:32Z",
    "updated_at": "2023-08-16T19:43:32Z"
  },
  "endpoints": [],
  "operations": [
    {
      "id": "7ff25ea5-9f59-4e5f-a6f2-41bd26c8278f",
      "project_id": "purple-bar-16090093",
      "branch_id": "br-snowy-rice-16173643",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-08-16T19:43:32Z",
      "updated_at": "2023-08-16T19:43:32Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-snowy-rice-16173643",
      "name": "sally",
      "protected": false,
      "created_at": "2023-08-14T18:30:38Z",
      "updated_at": "2023-08-14T18:30:38Z"
    }
  ],
  "databases": [
    {
      "id": 5379825,
      "branch_id": "br-snowy-rice-16173643",
      "name": "neondb",
      "owner_name": "sally",
      "created_at": "2023-08-14T18:30:38Z",
      "updated_at": "2023-08-14T18:30:38Z"
    },
    {
      "id": 5379826,
      "branch_id": "br-snowy-rice-16173643",
      "name": "testdb",
      "owner_name": "sally",
      "created_at": "2023-08-16T09:15:53Z",
      "updated_at": "2023-08-16T09:15:53Z"
    }
  ]
}
```
</details>

## Move the compute endpoint from your current branch to the new branch

This [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) API call moves the endpoint from your current branch to the newly created branch. Required parameters are the `project_id` and `endpoint_id` of your current branch, and the `branch_id` of your new branch. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual key.

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/%20purple-bar-16090093/endpoints/ep-cold-sunset-20859660 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "branch_id": "br-snowy-rice-16173643"
  }
}
' |jq
```

<details>
<summary>Response body</summary>
```json
{
  "endpoint": {
    "host": "ep-cold-sunset-20859660.ap-southeast-1.aws.neon.tech",
    "id": "ep-cold-sunset-20859660",
    "project_id": "purple-bar-16090093",
    "branch_id": "br-snowy-rice-16173643",
    "autoscaling_limit_min_cu": 0.25,
    "autoscaling_limit_max_cu": 0.25,
    "region_id": "aws-ap-southeast-1",
    "type": "read_write",
    "current_state": "idle",
    "settings": {},
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "last_active": "2000-01-01T00:00:00Z",
    "creation_source": "console",
    "created_at": "2023-08-16T19:34:31Z",
    "updated_at": "2023-08-16T19:59:58Z",
    "proxy_host": "ap-southeast-1.aws.neon.tech",
    "suspend_timeout_seconds": 300,
    "provisioner": "k8s-pod"
  },
  "operations": []
}
```
</details>

## Delete the old branch

This [Delete branch](https://api-docs.neon.tech/reference/deleteprojectbranch) API call deletes the old branch. Leaving it in your project would use up storage space. Require parameters are the `project_id` and `branch_id`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual Neon API.

```curl
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches/br-polished-brook-07480976 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' |jq
```

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-polished-brook-07480976",
    "project_id": "purple-bar-16090093",
    "parent_id": "br-misty-disk-67154072",
    "parent_lsn": "0/2832A78",
    "name": "branch1",
    "current_state": "ready",
    "logical_size": 36831232,
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 78,
    "compute_time_seconds": 78,
    "active_time_seconds": 312,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-08-16T19:34:31Z",
    "updated_at": "2023-08-16T20:02:32Z"
  },
  "operations": [
    {
      "id": "2d9a3a9c-628a-4a2f-a0f4-655253d7fc3b",
      "project_id": "purple-bar-16090093",
      "branch_id": "br-polished-brook-07480976",
      "action": "delete_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-08-16T20:02:32Z",
      "updated_at": "2023-08-16T20:02:32Z",
      "total_duration_ms": 0
    }
  ]
}
```
</details>
