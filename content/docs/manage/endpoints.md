---
title: Manage compute endpoints
enableTableOfContents: true
isDraft: false
---

A single read-write compute endpoint is created for your project's [primary branch](/docs/reference/glossary#primary-branch) by default.

To connect to a database that resides in a branch, you must connect via a compute endpoint associated with the branch. The following diagram shows the project's primary branch (`main`) and a child branch, both of which have an associated compute endpoint.

```text
Project
    |----primary branch (main) ---- compute endpoint <--- application/client
             |    |
             |    |---- database (neondb)
             |
             ---- child branch ---- compute endpoint <--- application/client
                            |
                            |---- database (mydb)
```

Tier limits define resources (vCPUs and RAM) available to a compute endpoint. The Neon [Free Tier](/docs/introduction/technical-preview-free-tier) provides a shared vCPU and up to 1 GB of RAM per compute endpoint.

## View a compute endpoint

A compute endpoint is associated with a branch. To view a compute endpoint, select **Branches** in the Neon Console, and select a branch. If the branch has a compute endpoint, it is shown on the branch page.

Compute endpoint details shown on the branch page include:

- **Host**: The compute endpoint hostname.
- **Region**: The region where the compute endpoint resides.
- **Type**: The type of compute endpoint. Currently, only `read_write` compute endpoints are supported.
- **State**: The compute endpoint state (`Active`, `Idle`, or `Stopped`).

## Create a compute endpoint

You can only create a compute endpoint for a branch that does not have one.

To create an endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch that does not have an endpoint
1. Click **Add new compute endpoint**.
1. On the **Create compute endpoint** dialog, choose whether to enable connection pooling and click **Create**.

For more information connection pooling in Neon, see [Connection pooling](/docs/connect/connection-pooling).

## Edit a compute endpoint

You can edit a compute endpoint to change the branch that it is associated with. The branch you want to associated the endpoint with cannot have an existing compute endpoint.

<Admonition type="note">
Enabling connection pooling for a compute endpoint is deprecated. You can enable connection pooling for individual connections instead. For more information, see [Enable connection pooling](https://neon.tech/docs/connect/connection-pooling#enable-connection-pooling).
</Admonition>

To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
1. Select a new branch and click **Save**.

## Delete a compute endpoint

Deleting a compute endpoint is a permanent action.

To delete a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage compute endpoints with the Neon API

Compute endpoint actions performed in the Neon Console can also be performed using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). The following examples demonstrate how to create, view, update, and delete compute endpoints using the Neon API. For other compute endpoint API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a compute endpoint with the API

The following Neon API method creates a compute endpoint.

```text
POST /projects/{project_id}/endpoints
```

The API method appears as follows when specified in a cURL command. The branch you specify cannot have an existing compute endpoint. A compute endpoint must be associated with a branch, and a branch can have only one compute endpoint. Neon currently supports read-write compute endpoints only.

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

The following Neon API method lists compute endpoints for the specified project. A compute endpoint belongs to a Neon project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojectendpoints).

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

The following Neon API method updates the specified compute endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateprojectendpoint).

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

The following Neon API method deletes the specified compute endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectendpoint).

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
