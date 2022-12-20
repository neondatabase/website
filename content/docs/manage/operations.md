---
title: Operations
enableTableOfContents: true
isDraft: false
---

An operation is an action performed on a Neon resource. Operations can be user-initiated or initiated by the Neon Control Plane. User-initiated operations result from actions such as creating a branch or deleting a database. Operations initiated by the Neon Control Plane may include suspending a compute instance after a period of inactivity or checking the availability of a compute instance, for example. You can monitor operations to keep an eye on the overall health of your Neon project or to check if an individual operation completed successfully.

Operations include:

- `apply_config`: Applies a new configuration to a Neon object or resource
- `check_availability`: Checks the availability of an endpoint compute resource
- `create_timeline`: Creates a project
- `delete_tenant`: Deletes the storage data
- `delete_timeline`: Deletes a branch
- `pageserver_tenant_detach`: Detaches the storage data from the old Pageserver
- `replace_safekeeper`: Replaces the Safekeeper
- `start_compute`: Starts an endpoint compute resource
- `stop_compute`: Stops an endpoint compute resource
- `suspend_compute`: Suspends an endpoint compute resource

## View operations in the Neon Console

The **Operations** widget on the Neon **Dashboard** displays operations. You can also view operations in **Settings** > **Operations**. The **Operations** page provides additional details.

Operation details include:

- **Action/ID**: The operation ID
- **Branch**: The branch on which the operation was performed
- **Status**: The status of the operation
- **Duration**: The amount of time it took the operation to complete
- **Date**: The date and time the operation occurred

## View operations with the Neon API

You can use the [Neon API](https://neon.tech/api-reference/v2/) to view operations. The following methods are provided:

### List operations

Lists operations for the specified project. This method supports response pagination. For more information, see [List operations with pagination](#list-operations-with-pagination).

```text
/projects/{project_id}/operations/{operation_id}
```

cURL command:

```bash
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations' \
  -H 'Accept: application/json' \
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

Pagination allows you to limit the number of operations displayed, as the number of operations for project can be large. To paginate responses, issue an initial request with a `limit` value. For brevity, the limit is set to 1 in the following example.

cURL command:

```bash
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations?limit=1' \
  -H 'Accept: application/json' \
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

To list the next page of operations, add the `cursor` value returned in the response body of the initial or previous request and a `limit` value for the next page.

```bash
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations?cursor=2022-12-09T08%3A47%3A52.20417Z&limit=1' \
  -H 'Accept: application/json' \
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

```bash
curl 'https://console.neon.tech/api/v2/projects/autumn-disk-484331/operations/97c7a650-e4ff-43d7-8c58-4c67f5050167' \
  -H 'Accept: application/json' \
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
