---
title: Operations
enableTableOfContents: true
isDraft: false
---

An operation is an action performed on a Neon resource. Operations can be user-initiated or initiated by the Neon Control Plane. User-initiated operations result from actions such as creating a branch or deleting a database. Operations initiated by the Neon Control Plane may include suspending a compute instance after a period of inactivity or checking the availability of a compute instance, for example. You can monitor operations to keep an eye on the overall health of your Neon project or to check the status of specific operations.

Operations include:

- `apply_config`: Applies a new configuration to a Neon object or resource
- `check_availability`: Checks the availability of an endpoint compute resource
- `create_timeline`: Creates a project
- `delete_tenant`: Deletes the storage data
- `delete_timeline`: Deletes a branch
- `pageserver_tenant_detach`: Detaches the storage data from the old Pageserver
- `pageserver_tenant_migrate`: Attaches the storage data to the new Pageserver
- `replace_safekeeper`: Replaces the Safekeeper
- `start_compute`: Starts an endpoint compute resource
- `stop_compute`: Stops an endpoint compute resource
- `suspend_compute`: Suspends an endpoint compute resource

## View operations

The **Operations** widget on the Neon **Dashboard** displays operations. You can also view operations in **Settings** > **Operations**.

Operation details include:

- **Action/ID**: The operation ID
- **Branch**: The branch on which the operation was performed
- **Status**: The status of the operation
- **Duration**: The amount of time it took the operation to complete
- **Date**: The date and time the operation occurred

## View operations with the Neon API

You can also view operations data using the [Neon API](https://neon.tech/api-reference/v2/), which provides additional operation details. For example:

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

For information about using the Neon API, see [Neon API](../../reference/api-reference/).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
