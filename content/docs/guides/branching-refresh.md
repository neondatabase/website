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

## Create a new up-to-date branch without a compute endpoint

A [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) request creates a branch without a compute endpoint by default. The only required parameter is the `project_id`.

```curl
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' | jq
```

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-blue-boat-85552220",
    "project_id": "purple-bar-16090093",
    "parent_id": "br-misty-disk-67154072",
    "parent_lsn": "0/1E78580",
    "name": "br-blue-boat-85552220",
    "current_state": "init",
    "pending_state": "ready",
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-08-14T19:13:05Z",
    "updated_at": "2023-08-14T19:13:05Z"
  },
  "endpoints": [],
  "operations": [
    {
      "id": "1a1cf0cd-6222-4a51-bf5e-b791f1cd0e78",
      "project_id": "purple-bar-16090093",
      "branch_id": "br-blue-boat-85552220",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-08-14T19:13:05Z",
      "updated_at": "2023-08-14T19:13:05Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-blue-boat-85552220",
      "name": "sally",
      "protected": false,
      "created_at": "2023-08-14T18:30:38Z",
      "updated_at": "2023-08-14T18:30:38Z"
    }
  ],
  "databases": [
    {
      "id": 5338661,
      "branch_id": "br-blue-boat-85552220",
      "name": "neondb",
      "owner_name": "sally",
      "created_at": "2023-08-14T18:30:38Z",
      "updated_at": "2023-08-14T18:30:38Z"
    }
  ]
}
```
</details>

## Move the compute endpoint from your current branch to the new branch

This [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) API call moves the endpoint from your current branch to the newly created branch. Required parameters are the `project_id` and `endpoint_id`.

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/%20purple-bar-16090093/endpoints/ep-jolly-tooth-67553439 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "branch_id": "br-blue-boat-85552220"
  }
}
'
```

<details>
<summary>Response body</summary>
```json
TBD
```
</details>

## Delete the old branch

This Delete branch API call deletes the old branch. Leaving it in your project would use up storage space. Require parameters are the `project_id` and `branch_id`.

```curl
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches/br-blue-boat-85552220 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body</summary>
```json
TBD
```
</details>
