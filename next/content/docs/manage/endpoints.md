---
title: Manage computes
enableTableOfContents: true
isDraft: false
---

A single read-write compute endpoint is created for your project's [root branch](/docs/reference/glossary#root-branch) (`main`) by default.

To connect to a database that resides in a branch, you must connect via a compute endpoint that is associated with the branch. The following diagram shows the project's root branch (`main`) and a child branch, both of which have an associated compute endpoint. Applications and clients connect to a branch via a compute endpoint.

```text
Project
    |----root branch (main) ---- compute endpoint <--- application/client
             |    |
             |    |---- database (neondb)
             |
             ---- child branch ---- compute endpoint <--- application/client
                            |
                            |---- database (mydb)  
```

You can assign a compute endpoint to the branch you want to connect to or remove an compute endpoint from a branch by deleting it.

Tier limits define resources (vCPUs and RAM) available to a compute endpoint. The Neon [Free Tier](/docs/introduction/technical-preview-free-tier) allows up to 1vCPU and 4GB of RAM per compute endpoint.

## View a compute endpoint

A compute endpoint is always associated with a branch. To view a compute endpoint, select **Branches** in the Neon Console, and select a branch. If the branch has a compute endpoint, it is shown on the branch page.

Compute endpoint details shown on the branch page include:

- **Host**: The compute endpoint name.
- **Region**: The region where the compute endpoint resides.
- **Type**: The type of compute endpoint. Currently, only `read_write` compute endpoints are supported.
- **State**: The compute endpoint state (`Active`, `Idle`, or `Stopped`).

## Edit a compute endpoint

You can edit a compute endpoint to modify the branch that it is associated with or to enable connection pooling.

To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
1. Select a new branch for the compute endpoint or enable connection pooling and click **Save**. If you are selecting a new branch for the compute endpoint, the branch must not have an associated compute endpoint.

## Delete a compute endpoint

Deleting a compute endpoint is a permanent action.

To delete a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage compute endpoints with the Neon API

Compute endpoint actions performed in the Neon Console can also be performed using the [Neon API](https://neon.tech/api-reference/v2/). The following examples demonstrate how to create, view, update, and delete compute endpoints using the Neon API. For other compute endpoint API methods, refer to the [Neon API reference](https://neon.tech/api-reference/v2/).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all of the attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://neon.tech/api-reference/v2/).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a compute endpoint with the API

The following Neon API method creates a compute endpoint. 

```text
POST /endpoints 
```

The API method appears as follows when specified in a cURL command. The branch that you specify cannot have an existing compute endpoint. A compute endpoint must be associated with a branch, and a branch can have only one compute endpoint. Neon currently supports read-write compute endpoints only.

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "branch_id": "br-blue-tooth-671580",
    "type": "read_write"
  }
}'
```

<Admonition type="note">
You can enable connection pooling for a compute endpoint by adding the `"pooler_enabled": "true"` attribute to the request body. For more information about connection pooling support in Neon, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

Response:

```json
{
  "endpoint": {
    "host": "ep-aged-math-668285.us-east-2.aws.neon.tech",
    "id": "ep-aged-math-668285",
    "project_id": "hidden-cell-763301",
    "branch_id": "br-blue-tooth-671580",
    "autoscaling_limit_min_cu": 1,
    "autoscaling_limit_max_cu": 1,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "init",
    "pending_state": "active",
    "settings": {
      "pg_settings": {}
    },
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "created_at": "2023-01-04T18:39:41Z",
    "updated_at": "2023-01-04T18:39:41Z",
    "proxy_host": "us-east-2.aws.neon.tech"
  },
  "operations": [
    {
      "id": "e0e4da91-8576-4348-913b-aaf61a46d314",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "start_compute",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T18:39:41Z",
      "updated_at": "2023-01-04T18:39:41Z"
    }
  ]
}
```

### List compute endpoints with the API

The following Neon API method lists compute endpoints for the specified project. A compute endpoint belongs to a Neon project. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/listProjectEndpoints).

```text
GET /projects/{project_id}/endpoints
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'GET' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "endpoints": [
    {
      "host": "ep-young-art-646685.us-east-2.aws.neon.tech",
      "id": "ep-young-art-646685",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-shy-credit-899131",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-2",
      "type": "read_write",
      "current_state": "idle",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "last_active": "2023-01-04T18:38:25Z",
      "created_at": "2023-01-04T18:38:23Z",
      "updated_at": "2023-01-04T18:43:36Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    },
    {
      "host": "ep-aged-math-668285.us-east-2.aws.neon.tech",
      "id": "ep-aged-math-668285",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-2",
      "type": "read_write",
      "current_state": "idle",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "last_active": "2023-01-04T18:39:42Z",
      "created_at": "2023-01-04T18:39:41Z",
      "updated_at": "2023-01-04T18:44:48Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    }
  ]
}
```

### Update a compute endpoint with the API

The following Neon API method updates the specified compute endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/updateProjectEndpoint).

```text
PATCH /projects/{project_id}/endpoints/{endpoint_id}
```

The API method appears as follows when specified in a cURL command. The example reassigns the compute endpoint to another branch by changing the `branch_id`. The branch that you specify cannot have an existing compute endpoint. A compute endpoint must be associated with a branch, and a branch can have only one compute endpoint.

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints/ep-young-art-646685' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "branch_id": "br-green-lab-617946"
  }
}'
```

Response:

```json
{
  "endpoint": {
    "host": "ep-young-art-646685.us-east-2.aws.neon.tech",
    "id": "ep-young-art-646685",
    "project_id": "hidden-cell-763301",
    "branch_id": "br-green-lab-617946",
    "autoscaling_limit_min_cu": 1,
    "autoscaling_limit_max_cu": 1,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "idle",
    "pending_state": "idle",
    "settings": {
      "pg_settings": {}
    },
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "last_active": "2023-01-04T18:38:25Z",
    "created_at": "2023-01-04T18:38:23Z",
    "updated_at": "2023-01-04T18:47:36Z",
    "proxy_host": "us-east-2.aws.neon.tech"
  },
  "operations": [
    {
      "id": "03bf0bbc-cc46-4863-a5c4-f31fc1881228",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-green-lab-617946",
      "endpoint_id": "ep-young-art-646685",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T18:47:36Z",
      "updated_at": "2023-01-04T18:47:36Z"
    },
    {
      "id": "c96be00c-6340-4fb2-b80a-5ae96f469969",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-green-lab-617946",
      "endpoint_id": "ep-young-art-646685",
      "action": "suspend_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2023-01-04T18:47:36Z",
      "updated_at": "2023-01-04T18:47:36Z"
    }
  ]
}
```

### Delete a compute endpoint with the API

The following Neon API method deletes the specified compute endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/deleteProjectEndpoint).

```text
DELETE /projects/{project_id}/endpoints/{endpoint_id}
```

The API method appears as follows when specified in a cURL command.

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints/ep-young-art-646685' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "endpoint": {
    "host": "ep-young-art-646685.us-east-2.aws.neon.tech",
    "id": "ep-young-art-646685",
    "project_id": "hidden-cell-763301",
    "branch_id": "br-green-lab-617946",
    "autoscaling_limit_min_cu": 1,
    "autoscaling_limit_max_cu": 1,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "idle",
    "settings": {
      "pg_settings": {}
    },
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "last_active": "2023-01-04T18:38:25Z",
    "created_at": "2023-01-04T18:38:23Z",
    "updated_at": "2023-01-04T18:47:45Z",
    "proxy_host": "us-east-2.aws.neon.tech"
  },
  "operations": []
}
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
