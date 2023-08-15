---
title: Branching — Refresh a branch
subtitle: Refresh a branch using the Neon API
enableTableOfContents: true
---

This guide describes how you can refresh a Neon branch using the Neon API.

When you create a branch in Neon, you get a copy-on-write clone that reflects the current state of the parent branch, but what do you do if your branch has become stale? For example, changes have been made to the parent branch that you would like reflected in your working branch, or your branch is about to age out of the point-in-time restore window (the history that is shared with the parent branch), which will result in additional storage consumption. Ideally, you want to refresh your branch but not the compute endpoint, whose connection details are already configured in your application or workflow.

Currently, there is not a single command to update a branch, but you can refresh a branch using a combination of Neon API calls. The procedure outline below does the following:

1. Gets the compute endpoint details for your current branch
2. Creates a new up-to-date branch without a compute endpoint
3. Moves the compute endpoint from your current branch to the new branch
4. Deletes the old branch

The API calls that perform these steps can be combined into a single script, which is provided at the end of the guide.

<Admonition type="important">
This method does not preserve or merge data or schema changes on your current branch to the new branch. This type of merge is not supported, although you can migrate schema changes from one branch to another manually or using a third part tool that supports migrations, but this is outside the scope of this guide.
</Admonition>

## Get the compute endpoint details for your current branch

The [Get branch endpoints](https://api-docs.neon.tech/reference/getprojectendpoint) API request returns details about a branch;'s endpoints. Required parameters are the `project_id` and `branch_id`. The `id` of compute endpoint for your current branch is needed in order to move it to your new branch in a later step. An endpoint `id` has an `ep-` prefix. In the response body below, the endpoint_id is `ep-jolly-tooth-67553439`.

```curl
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches/br-blue-boat-85552220/endpoints \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body</summary>
```json
{
  "endpoints": [
    {
      "host": "ep-jolly-tooth-67553439.ap-southeast-1.aws.neon.tech",
      "id": "ep-jolly-tooth-67553439",
      "project_id": "purple-bar-16090093",
      "branch_id": "br-blue-boat-85552220",
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
      "created_at": "2023-08-14T19:07:21Z",
      "updated_at": "2023-08-15T16:54:52Z",
      "proxy_host": "ap-southeast-1.aws.neon.tech",
      "suspend_timeout_seconds": 300,
      "provisioner": "k8s-pod"
    }
  ]
}
```
</details>

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
