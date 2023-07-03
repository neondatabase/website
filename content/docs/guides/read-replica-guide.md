---
title: Working with Neon read replicas 
subtitle: Learn how to create and and manage read replicas in Neon
enableTableOfContents: true
---

Read replicas are supported with the [Neon Pro plan](/docs/introduction/pro-plan). This guide will lead you through the process of creating and managing read replicas. The general methodology of using read replicas to segregate read-only work from your production database operations can be applied to a variety of uses cases such as:

- Offloading analytics or reporting queries
- Distributing read requests to to achieve higher throughput
- Providing read-only data access to specific users or applications who do not need to modify data
- Configuring right-sized read-only compute resources for different users and applications

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can follow the steps below to create one or more read replicas. You can create as many read-replicas as you need for any branch in your Neon project, and you can configure each with the required vCPU and memory. You also have the option of configuring autoscaling and auto-suspend for your read replicas, in the same way that you configure those resources for your read-write computes.

Neon also supports managing read replicas programmatically using the Neon API, which is covered toward the end of this guide.

## Prerequisites

- A Pro plan account. The read replica feature is a Neon Pro plan feature.
- A Neon project.

## Create a read replica

Creating a read replica is a simple process that involves adding a read-only compute endpoint to a branch. You can add a read-only compute endpoint to any branch in your Neon project.

1. In the Neon Console, select **Branches**.
1. Select the branch where your database resides.
1. Click **Add compute**.
1. On the **Create compute endpoint** dialog, select **Read-only** as the **Compute type**.
1. Specify the compute size options for your read-only compute endpoint. You can set a fixed size (the default) or enable **Autoscaling** and specify your minimum and maximum compute size. Additionally, you can configure the **Auto-suspend delay** period, which is the amount of idle time after which your compute is transitioned to an idle state. The default setting is 300 seconds (5 minutes).
1. When you have finished making your selections, click **Create**.

In a few moments, your read-only compute is provisioned. This is your read replica. In the next section, you will learn how to connect to it.

## Connect to a read replica

Connecting to a read replica is the same as connecting to any branch, except you are connecting via a read-only compute endpoint instead of a read-write compute endpoint. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. In the Neon Console, select a project.
1. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
1. Under **Compute**, select a read-only endpoint for the branch. If there are none, see [Create a read replica](#create-a-read-replica).
1. Copy the connection string or a code example with the connection details by selecting from the drop-down. A connection string or code example includes your role name, password, hostname, and database name. A basic connection string appears similar to the following:

  <CodeBlock shouldWrap>

  ```bash
  postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

where:

- role: `daniel`
- password:<pasword>
- hostname: `ep-mute-rain-952417.us-east-2.aws.neon.tech`
- database name: `neondb`

If you require a port number to configure your connection, Neon uses the default port number, `5432`.

<Admonition type="tip">
A compute endpoint hostname, whether read-only or read-write, starts with an `ep-` prefix.
</Admonition>

When you connect to the read-only endpoint, you are connected to a read replica for the branch. No write operations are permitted on this connection.

## Viewing read replicas

To view the read replicas (read-only compute endpoints) for a branch, select **Branches** in the Neon Console, and select a branch. If the branch has read-only compute endpoints, they are shown on the branch page under the **Compute endpoint** heading. Read-only compute endpoints are identified by the **Type** field. They have a `R/O` value instead of `R/W`.

## Edit a read replica

You can edit your read replica read-only compute endpoint to change the [compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) or [Auto-suspend](/docs/manage/endpoints#auto-suspend-configuration) configuration.

To edit a read-only compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
1. Specify your compute size or Auto-suspend changes and click **Save**.

## Delete a read replica

Deleting a read replica is a permanent action.

To delete a read replica:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Find the read-only compute endpoint you want to delete.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage read replicas using the Neon API

The following examples demonstrate how to create and delete a read-only compute endpoints using the Neon API. For other compute endpoint API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a read-only compute endpoint with the API

The following Neon API method creates a read-only compute endpoint.

```text
POST /projects/{project_id}/endpoints
```

The API method appears as follows when specified in a cURL command. A compute endpoint must be associated with a branch. A branch can have multiple read-only compute endpoints. The `type` attribute in the following example creates a read-only compute endpoint:

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "branch_id": "br-blue-tooth-671580",
    "type": "read_only"
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

### Delete a read-only compute endpoint with the API

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
    "type": "read_only",
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
