---
title: Refresh a branch
subtitle: Learn how to refresh a Neon branch using the Neon API.
enableTableOfContents: true
---

When you create a branch in Neon, you get a copy-on-write clone of your data that reflects the current state of the parent branch, but what do you do if your branch becomes stale? For example, changes are made to the parent branch that you would like reflected in your development branch, or your branch has aged out of the point-in-time restore window (the history that is shared with the parent branch), using additional storage. Ideally, you want to refresh your branch but not the branch's compute endpoint, whose connection details are already configured in your application or toolchain.

Currently, there isn't a single command that refreshes branch, but you can do so using a combination of Neon API calls. The procedure described below performs the following steps:

1. Creates a new up-to-date branch without a compute endpoint
2. Moves the compute endpoint from your current branch to the new branch
3. Deletes the old branch

These steps can be combined into a single script, which is provided at the end of the guide.

<Admonition type="important">
This method does not preserve schema or data changes on your current branch.
</Admonition>

## Before you begin

You require the following:

- A Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- The `project_id` for your Neon project. You can obtain a `project_id` using the [List projects](https://api-docs.neon.tech/reference/listprojects) method, or you can find it in the Neon Console, on the your project's **Settings** page.
- The `branch_id` of the current branch. You can obtain a `branch_id` using the [List branches](https://api-docs.neon.tech/reference/listprojectbranches) method, or you can find it in the Neon Console, on the your project's **Branches** page.
- The `endpoint_id` of the compute endpoint associated with the current branch. You can obtain an `endpoint_id` using the [List endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method, or you can find it in the Neon Console, on the **Branches** page. An `endpoint_id` has an `ep-` prefix.

## Create a new up-to-date branch without a compute endpoint

A [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) request creates a branch without a compute endpoint by default. The only required parameter is your Neon `project_id`. The `project_id` value used in the example below is `purple-bar-16090093`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

```curl
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' |jq
```

The response body includes the `id` of your new branch. You will need it in the next step.

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-summer-water-09767623",
    "project_id": "purple-bar-16090093",
    "parent_id": "br-misty-disk-67154072",
    "parent_lsn": "0/2832A78",
    "name": "br-summer-water-09767623",
    "current_state": "init",
    "pending_state": "ready",
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-08-16T21:29:00Z",
    "updated_at": "2023-08-16T21:29:00Z"
  },
  "endpoints": [],
  "operations": [
    {
      "id": "df94dcdc-95e0-4343-9a7d-b4ea46a041f1",
      "project_id": "purple-bar-16090093",
      "branch_id": "br-summer-water-09767623",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-08-16T21:29:00Z",
      "updated_at": "2023-08-16T21:29:00Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-summer-water-09767623",
      "name": "sally",
      "protected": false,
      "created_at": "2023-08-14T18:30:38Z",
      "updated_at": "2023-08-14T18:30:38Z"
    }
  ],
  "databases": [
    {
      "id": 5381377,
      "branch_id": "br-summer-water-09767623",
      "name": "neondb",
      "owner_name": "sally",
      "created_at": "2023-08-14T18:30:38Z",
      "updated_at": "2023-08-14T18:30:38Z"
    },
    {
      "id": 5381378,
      "branch_id": "br-summer-water-09767623",
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

The [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) API call moves the compute endpoint from your current branch to the new branch. Required parameters are the `project_id` and `endpoint_id` of your current branch, and the `branch_id` of your new branch. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

```curl
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/%20purple-bar-16090093/endpoints/ep-silent-sun-55413049 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "branch_id": "br-summer-water-09767623"
  }
}
' |jq
```

<details>
<summary>Response body</summary>
```json
{
  "endpoint": {
    "host": "ep-silent-sun-55413049.ap-southeast-1.aws.neon.tech",
    "id": "ep-silent-sun-55413049",
    "project_id": "purple-bar-16090093",
    "branch_id": "br-summer-water-09767623",
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
    "created_at": "2023-08-16T21:24:31Z",
    "updated_at": "2023-08-16T21:34:01Z",
    "proxy_host": "ap-southeast-1.aws.neon.tech",
    "suspend_timeout_seconds": 300,
    "provisioner": "k8s-pod"
  },
  "operations": []
}
```
</details>

## Delete the old branch

The [Delete branch](https://api-docs.neon.tech/reference/deleteprojectbranch) API call deletes the old branch. Leaving the old branch in your project would use up storage space. Required parameters are the `project_id` and `branch_id`. You must also set the `$NEON_API_KEY` variable or replace `$NEON_API_KEY` with an actual API key.

```curl
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/purple-bar-16090093/branches/br-solitary-cake-99808753 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' |jq
```

<details>
<summary>Response body</summary>
```json
{
  "branch": {
    "id": "br-solitary-cake-99808753",
    "project_id": "purple-bar-16090093",
    "parent_id": "br-misty-disk-67154072",
    "parent_lsn": "0/2832A78",
    "name": "br-solitary-cake-99808753",
    "current_state": "ready",
    "logical_size": 36831232,
    "creation_source": "console",
    "primary": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-08-16T21:24:31Z",
    "updated_at": "2023-08-16T21:35:39Z"
  },
  "operations": [
    {
      "id": "88177cb2-4a66-4a23-9ed3-840f4b2791f2",
      "project_id": "purple-bar-16090093",
      "branch_id": "br-solitary-cake-99808753",
      "action": "delete_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-08-16T21:35:39Z",
      "updated_at": "2023-08-16T21:35:39Z",
      "total_duration_ms": 0
    }
  ]
}
```
</details>

## Branch refresh script

The following bash script performs the branch refresh steps described above.

<Admonition type="note">
The script includes 5 second sleeps between API calls to allow time for operations to complete. The sleeps could be replaced by API calls that poll for operation status. See [Poll operation status](/docs/manage/operations#poll-operation-status).
</Admonition>

1. Create a script named `refresh_neon_branch.sh``.

    ```bash
    #!/bin/bash

    # Check for the right number of arguments
    if [ "$#" -ne 4 ]; then
        echo "Usage: $0 <project_id> <old_branch_id> <endpoint_id> <NEON_API_KEY>"
        exit 1
    fi

    PROJECT_ID=$1
    OLD_BRANCH_ID=$2
    ENDPOINT_ID=$3
    NEON_API_KEY=$4

    # Create a new up-to-date branch without specifying a name
    NEW_BRANCH_ID=$(curl --request POST \
        --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
        --header 'accept: application/json' \
        --header "authorization: Bearer $NEON_API_KEY" \
        --header 'content-type: application/json' | jq -r '.branch.id')

    echo "Created new branch with ID: $NEW_BRANCH_ID"

    # Pause for 5 seconds to ensure the branch creation is complete
    sleep 5

    # Move the compute endpoint from the current branch to the new branch
    curl --request PATCH \
        --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID/endpoints/$ENDPOINT_ID" \
        --header 'accept: application/json' \
        --header "authorization: Bearer $NEON_API_KEY" \
        --header 'content-type: application/json' \
        --data "{ \"endpoint\": { \"branch_id\": \"$NEW_BRANCH_ID\" } }" | jq

    echo "Moved endpoint to new branch."

    # Pause for 5 seconds to ensure the move compute endpoint operation is complete
    sleep 5

    # Delete the old branch
    curl --request DELETE \
        --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$OLD_BRANCH_ID" \
        --header 'accept: application/json' \
        --header "authorization: Bearer $NEON_API_KEY" | jq

    echo "Deleted old branch."
    ```

2. Make the script executable:

    ```bash
    chmod +x refresh_neon_branch.sh
    ```

3. Run the script, proving the required input variables, which include the `project_id` of your Neon project, the `branch_id` of the current branch, the `endpoint_id` of the compute endpoint, and your Neon API key.

    ```bash
    ./refresh_neon_branch.sh <project_id> <old_branch_id> <endpoint_id> <NEON_API_KEY>
    ```

    For example:

    ```bash
    ./refresh_neon_branch.sh purple-bar-16090093 br-steep-dew-64219206 ep-green-limit-22926758 <NEON_API_KEY>
    ```

<details>
<summary>Command response</summary>
    ```bash
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100  1272  100  1272    0     0   1334      0 --:--:-- --:--:-- --:--:--  1334
    Created new branch with ID: br-delicate-salad-19388426
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100   744  100   683  100    61   2287    204 --:--:-- --:--:-- --:--:--  2488
    {
      "endpoint": {
        "host": "ep-green-limit-22926758.ap-southeast-1.aws.neon.tech",
        "id": "ep-green-limit-22926758",
        "project_id": "purple-bar-16090093",
        "branch_id": "br-delicate-salad-19388426",
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
        "created_at": "2023-08-16T22:06:19Z",
        "updated_at": "2023-08-16T22:16:58Z",
        "proxy_host": "ap-southeast-1.aws.neon.tech",
        "suspend_timeout_seconds": 300,
        "provisioner": "k8s-pod"
      },
      "operations": []
    }
    Moved endpoint to new branch.
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100   713  100   713    0     0   2254      0 --:--:-- --:--:-- --:--:--  2256
    {
      "branch": {
        "id": "br-steep-dew-64219206",
        "project_id": "purple-bar-16090093",
        "parent_id": "br-misty-disk-67154072",
        "parent_lsn": "0/2832A78",
        "name": "br-steep-dew-64219206",
        "current_state": "ready",
        "creation_source": "console",
        "primary": false,
        "cpu_used_sec": 0,
        "compute_time_seconds": 0,
        "active_time_seconds": 0,
        "written_data_bytes": 0,
        "data_transfer_bytes": 0,
        "created_at": "2023-08-16T22:15:56Z",
        "updated_at": "2023-08-16T22:17:03Z"
      },
      "operations": [
        {
          "id": "513af93b-b438-4706-99fb-4556dfa92da9",
          "project_id": "purple-bar-16090093",
          "branch_id": "br-steep-dew-64219206",
          "action": "delete_timeline",
          "status": "running",
          "failures_count": 0,
          "created_at": "2023-08-16T22:17:03Z",
          "updated_at": "2023-08-16T22:17:03Z",
          "total_duration_ms": 0
        }
      ]
    }
    Deleted old branch.
    ```
</details>
