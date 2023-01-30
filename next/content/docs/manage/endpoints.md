---
title: Manage endpoints
enableTableOfContents: true
isDraft: false
---

An endpoint is a Neon compute instance. A single read-write endpoint is created for your project's [root branch](../../reference/glossary#root-branch) (`main`) by default.

To connect to a database that resides in a branch, you must connect via an endpoint that is associated with the branch. The following diagram shows the project's root branch (`main`) and a child branch, both of which have an associated endpoint. Applications and clients connect to a branch via an endpoint.

```text
Project
    |----root branch (main) ---- endpoint (compute) <--- application/client
             |    |
             |    |---- database (neondb)
             |
             ---- child branch ---- endpoint (compute) <--- application/client
                            |
                            |---- database (mydb)  
```

Endpoints can be  managed independently of branches. For example, you can create and delete endpoints as necessary, assigning them to the branch you want to connect to. However, creating an endpoint is only permitted if you have a branch without an endpoint, as an endpoint must be assigned to a branch. Also, a branch can have only one endpoint. Attempting to create an endpoint for a branch that already has an endpoint results in an error.

Tier limits define the number of endpoints that you can create in a Neon project and the compute resources (vCPUs and RAM) available to an endpoint. The Neon [Free Tier](../../introduction/technical-preview-free-tier) allows up to 3 endpoints.

## Create an endpoint

To create an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Select **New endpoint**.
1. On the **Create endpoint** dialog, select a branch to assign the endpoint to. The branch you select must not have an associated endpoint.
1. Choose wether to enable connection pooling. Enabling connection pooling increases the number of connections that the endpoint can support. For more information, see [Connection pooling](../../connect/connection-pooling).
1. Click **Create endpoint**.

## View endpoints

To view the endpoints in your project, select **Endpoints** in the Neon Console.

The **Endpoints** page lists the endpoints that belong your Neon project.

Endpoint details include:

- **Host**: The endpoint name.
- **Branch**: The branch that the endpoint is associated with.
- **State**: The endpoint state (`Active`, `Idle`, or `Stopped`).
- **Last activity**: The last time the endpoint was active.
- **Created**: The date and time the endpoint was created.

## Edit an endpoint

You can edit an endpoint to modify the branch the endpoint is associated with or to enable connection pooling.

To edit an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Fnd the endpoint you want to edit, click the &#8942; menu, and select **Edit**.
1. Select a new branch for the endpoint or enable connection pooling and click **Save**. If you are selecting a new branch for the endpoint, the branch must not have an associated endpoint.

## Delete an endpoint

Deleting an endpoint is a permanent action.

To delete an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Find the endpoint you want to delete, click the &#8942; menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage endpoints with the Neon API

Endpoint actions performed in the Neon Console can also be performed using the [Neon API](https://neon.tech/api-reference/v2/). The following examples demonstrate how to create, view, update, and delete endpoints using the Neon API. For other endpoint-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/v2/).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all of the attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://neon.tech/api-reference/v2/).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](../../manage/api-keys#create-an-api-key). In the cURL examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create an endpoint with the API

The following Neon API method creates an endpoint. The [Neon Free Tier](../../introduction/technical-preview-free-tier/) permits three endpoints per account. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/createProjectEndpoint).

```text
POST /endpoints 
```

The API method appears as follows when specified in a cURL command. The branch that you specify cannot have an existing endpoint. An endpoint must be associated with a branch, and a branch can have only one endpoint. Neon currently supports read-write endpoints only.

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
You can enable connection pooling for an endpoint by adding the `"pooler_enabled": "true"` attribute to the request body. For more information about connection pooling support in Neon, see [Connection pooling](../../connect/connection-pooling).
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

### List endpoints with the API

The following Neon API method lists endpoints for the specified project. An endpoint belongs to a Neon project. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/listProjectEndpoints).

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

### Update an endpoint with the API

The following Neon API method updates the specified endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/updateProjectEndpoint).

```text
PATCH /projects/{project_id}/endpoints/{endpoint_id}
```

The API method appears as follows when specified in a cURL command. The example reassigns the endpoint to another branch by changing the `branch_id`. The branch that you specify cannot have an existing endpoint. An endpoint must be associated with a branch, and a branch can have only one endpoint.

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

### Delete an endpoint with the API

The following Neon API method deletes the specified endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://neon.tech/api-reference/v2/#/Endpoint/deleteProjectEndpoint).

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
