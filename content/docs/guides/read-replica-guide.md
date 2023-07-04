---
title: Working with Neon read replicas 
subtitle: Learn how to create and and manage read replicas in Neon
enableTableOfContents: true
---

Read replicas are supported with the [Neon Pro plan](/docs/introduction/pro-plan). This guide will lead you through the process of creating and managing read replicas. 

The general methodology of using read replicas to segregate read-only work from your production database operations can be applied to a variety of uses cases such as:

- Offloading analytics or reporting queries
- Distributing read requests to to achieve higher throughput
- Providing read-only data access to specific users or applications who do not need to modify data
- Configuring right-sized read-only compute resources for different users and applications

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can create one or more read-replicas for any branch in your Neon project, and you can configure the vCPU and memory allocated to each. Neon's Autoscaling and Auto-suspend features are also supported with read replicas, providing you with control over how read replicas use compute resources.

Neon also supports managing read replicas programmatically using the Neon API, which is covered toward the end of this guide.

## Prerequisites

- A Pro plan account. The read replica feature is a Neon Pro plan feature.
- A Neon project.

## Create a read replica

Creating a read replica is a simple process that involves adding a read-only compute endpoint to a branch. You can add a read-only compute endpoint to any branch in your Neon project following these steps:

1. In the Neon Console, select **Branches**.
1. Select the branch where your database resides.
1. Click **Add compute**.
1. On the **Create compute endpoint** dialog, select **Read-only** as the **Compute type**.
1. Specify the compute size options for your read-only compute endpoint. You can configure a **Fixed size** compute with a specific amount of vCPU and RAM (the default) or enable **Autoscaling** and configure a minimum and maximum compute size. Additionally, you can configure the **Auto-suspend delay** period, which is the amount of idle time after which your compute is transitioned to an idle state. The default setting is 300 seconds (5 minutes).
  <Admonition type="note">
  Your compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
  </Admonition>
1. When you have finished making your selections, click **Create**.

In a few moments, your read-only compute is provisioned. This is your read replica. The next section describes how to connect to your read replica.

## Connect to a read replica

Connecting to a read replica is the same as connecting to any branch, except you are connecting via a read-only compute endpoint instead of a read-write compute endpoint. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. In the Neon Console, select a project.
1. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
1. Under **Compute**, select a read-only endpoint for the branch. If there are none, see [Create a read replica](#create-a-read-replica).
1. Select a connection string or a code example from the drop-down menu. The connection string or code example contains your role name, password, hostname, and database name. A basic connection string appears similar to the following:

  <CodeBlock shouldWrap>

  ```bash
  postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

The information in your connection string corresponds to the following connection details:

- role: `daniel`
- password:`<pasword>`
- hostname: `ep-mute-rain-952417.us-east-2.aws.neon.tech`
- database name: `neondb`

If you require a port number to configure your client or application connection, Neon uses the default PostgreSQL port number, `5432`.

<Admonition type="tip">
A compute endpoint hostname, whether read-only or read-write, starts with an `ep-` prefix.
</Admonition>

When using this connection string, you are connected to your read replica. No write operations are permitted on this connection.

## Viewing read replicas

To view the read replicas for a branch, select **Branches** in the Neon Console, and select a branch. The read-only compute endpoints are your read replicas. Under the **Compute endpoint** heading, your read-only compute endpoints are identified by the **Type** field. They have a `R/O` value instead of `R/W`.

## Edit a read replica

You can edit your read replica to change the [compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) or [Auto-suspend](/docs/manage/endpoints#auto-suspend-configuration) configuration.

To edit a read-only compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Identify the read-only compute endpoint you want to modify, click the compute endpoint kebab menu, and select **Edit**.
1. Specify your compute size or Auto-suspend changes and click **Save**.

## Delete a read replica

Deleting a read replica is a permanent action, but you can easily create a new read replica if you need one again in the future.

To delete a read replica:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Find the read-only compute endpoint you want to delete.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage read replicas using the Neon API

The following examples demonstrate how to create and delete a read-only compute endpoints using the Neon API. The Neon API also supports get, list, edit, start, and suspend API methods for compute endpoints. For information about those methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

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

The API method appears as follows when specified in a cURL command. A compute endpoint must be associated with a branch. A branch can have multiple read-only compute endpoints. The `type` attribute in the following example specifies `read_only`, which creates a read-only compute endpoint:

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

For information about obtaining the required `project_id` and `branch_id` parameters, refer to [Create an endpoint](https://api-docs.neon.tech/reference/createprojectendpoint), in the _Neon API reference_.

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

For information about obtaining the required `project_id` and `endpoint_id` parameters, refer to [Delete an endpoint](https://api-docs.neon.tech/reference/deleteprojectendpoint), in the _Neon API reference_.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
