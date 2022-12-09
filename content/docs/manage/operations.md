---
title: Operations
enableTableOfContents: true
isDraft: false
---

An operation is an action performed on a Neon project resource. Operations can be user-initiated or initiated by the Neon Control Plane. User-initiated operations result from actions such as creating a branch or deleting a database. Operations initiated by the Neon Control Plane include suspending a compute instance after a defined period of inactivity or periodically checking the availability of a compute instance, for example.

Operations include:

- `apply_config`

  Applies a new configuration to a Neon object or resource. 

- `check_availability`

  Checks the availability of an endpoint compute resource. Initiated by the [availability checker](../../glossary/#availability-checker).

- `create_branch`

  Creates a branch.

- `create_timeline`

  Creates a database.

- `delete_tenant`

  Deletes a project.

- `delete_timeline`

  Deletes a database.

- `replace_safekeeper`

  Replaces the safekeeper.

- `start_compute`

  Starts an endpoint compute resource.

- `stop_compute`

  Stops an endpoint compute resource.

- `suspend_compute`

  Suspends an endpoint compute resource.

## Viewing operations in the Neon Console

Project operations are displayed in the **Operations** widget on the Neon **Dashboard**. You can also view project operations in **Settings** > **Operations**. The **Operations** page provides more details than the **Dashboard** widget.

Operation details include:

- **Action/ID**: The operation ID.
- **Branch**: The branch that the operation was performed on.
- **Status**: The status of the operation. 
- **Duration**: The amount of time it took the operation to complete.
- **Date**: The date and time the operation occurred.

## Viewing operations with the Neon API

You can use the Neon API to view project operations. The following methods are provided:

### List operations

Lists operation for the specified project. This method supports response pagination. For more information, see [List operations with pagination](#list-operations-with-pagination).

```text
/projects/{project_id}/operations/{operation_id}
```

cURL command:

```curl
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "operations": [
    {
      "id": "97c7a650-e4ff-43d7-8c58-4c67f5050167",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-wispy-dew-591433",
      "endpoint_id": "ep-orange-art-714542",
      "action": "check_availability",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2022-12-09T08:47:52Z",
      "updated_at": "2022-12-09T08:47:56Z"
    },
    {
      "id": "0f3daf10-2544-425c-86d3-9a9932ab25b9",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-wispy-dew-591433",
      "endpoint_id": "ep-orange-art-714542",
      "action": "check_availability",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2022-12-09T04:47:39Z",
      "updated_at": "2022-12-09T04:47:44Z"
    },
    {
      "id": "fb8484df-51b4-4a40-b0fc-97b73998892b",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-wispy-dew-591433",
      "endpoint_id": "ep-orange-art-714542",
      "action": "check_availability",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2022-12-09T02:47:05Z",
      "updated_at": "2022-12-09T02:47:09Z"
    }
  ],
  "pagination": {
    "cursor": "2022-12-07T00:45:05.262011Z"
  }
}

```

### List operations with pagination

Pagination allows you to limit the number of operations displayed, as the number of operations for project can be extensive. To paginate responses, issue an initial request with a response limit. For brevity, the limit is set to 1 in this example.

cURL command:

```curl
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations?limit=1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "operations": [
    {
      "id": "97c7a650-e4ff-43d7-8c58-4c67f5050167",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-wispy-dew-591433",
      "endpoint_id": "ep-orange-art-714542",
      "action": "check_availability",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2022-12-09T08:47:52Z",
      "updated_at": "2022-12-09T08:47:56Z"
    }
  ],
  "pagination": {
    "cursor": "2022-12-09T08:47:52.20417Z"
  }
}
```

To list the next page of operations, enter a limit _and_ the `cursor` value returned in the response body of the initial or previous request.

```curl
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations?cursor=2022-12-09T08%3A47%3A52.20417Z&limit=1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "operations": [
    {
      "id": "0f3daf10-2544-425c-86d3-9a9932ab25b9",
      "project_id": "autumn-disk-484331",
      "branch_id": "br-wispy-dew-591433",
      "endpoint_id": "ep-orange-art-714542",
      "action": "check_availability",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2022-12-09T04:47:39Z",
      "updated_at": "2022-12-09T04:47:44Z"
    }
  ],
  "pagination": {
    "cursor": "2022-12-09T04:47:39.797163Z"
  }
}
```

### List operation

This method shows only the details for the specified operation ID.

```text
/projects/{project_id}/operations/{operation_id}
```

cURL command:

```curl
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations/97c7a650-e4ff-43d7-8c58-4c67f5050167' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "operation": {
    "id": "97c7a650-e4ff-43d7-8c58-4c67f5050167",
    "project_id": "autumn-disk-484331",
    "branch_id": "br-wispy-dew-591433",
    "endpoint_id": "ep-orange-art-714542",
    "action": "check_availability",
    "status": "finished",
    "failures_count": 0,
    "created_at": "2022-12-09T08:47:52Z",
    "updated_at": "2022-12-09T08:47:56Z"
  }
}
```
