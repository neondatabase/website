---
title: Working with Neon read replicas 
subtitle: Learn how to create and and manage read replicas in Neon
enableTableOfContents: true
---

Read replicas are supported with the [Neon Pro plan](/docs/introduction/pro-plan). This guide will lead you through the process of creating and managing read replicas.

The general methodology of using read replicas to segregate read-only work from your production database operations can be applied to a variety of uses cases, such as:

- Offloading analytics or reporting queries
- Distributing read requests to achieve higher throughput
- Providing read-only data access to specific users or applications who do not need to modify data
- Configuring different CPU and memory resources for each read replica for different users and applications

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can create one or more read replicas for any branch in your Neon project and can configure the vCPU and memory allocated to each. Neon's _Autoscaling_ and _Auto-suspend_ features are also supported, providing you with control over compute usage.

<Admonition type="note">
Neon supports managing read replicas programmatically using the Neon API. See [Manage read replicas using the Neon API](#manage-read-replicas-using-the-neon-api).
</Admonition>

## Prerequisites

- A Pro plan account. The read replica feature is a Neon Pro plan feature.
- A Neon project.

## Create a read replica

Creating a read replica involves adding a read-only compute endpoint to a branch. You can add a read-only compute endpoint to any branch in your Neon project by following these steps:

1. In the Neon Console, select **Branches**.
1. Select the branch where your database resides.
1. Click **Add compute**.
1. On the **Create Compute Endpoint** dialog, select **Read-only** as the **Compute type**.
1. Specify the **Compute size** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable **Autoscaling** and configure a minimum and maximum compute size. You can configure the **Auto-suspend delay** period, which is the amount of idle time after which your read-only compute is transitioned to an idle state. The default setting is 300 seconds (5 minutes). You can set this value up to 604800 seconds (7 days).
  <Admonition type="note">
  The compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
  </Admonition>
1. When you have finished making your selections, click **Create**.

In a few moments, your read-only compute is provisioned and appears in the **Computes** section of the **Branches** page. This is your read replica. The following section describes how to connect to your read replica.

## Connect to a read replica

Connecting to a read replica is the same as connecting to any branch, except you connect via a read-only compute endpoint instead of a read-write compute endpoint. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select a **Read-only** compute endpoint. If there are none, see [Create a read replica](#create-a-read-replica).
1. Select a connection string or a code example from the drop-down menu and copy it. This is the information you need to connect to the read replica from you client or application.

The example contains your role name, password, hostname, and database name. A **psql** connection string appears similar to the following:

  <CodeBlock shouldWrap>

  ```bash
  postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

If you expect a high number of connections, select **Enable pooling** to add the `-pooler` flag to the connection string or example.

The information in your connection string corresponds to the following connection details:

- role: `daniel`
- password:`<pasword>`
- hostname: `ep-mute-rain-952417.us-east-2.aws.neon.tech`
- database name: `neondb`

When you use this connection string or code example, you are connecting to the read replica. No write operations are permitted on this connection.

## Viewing read replicas

To view read replicas for a branch, select **Branches** in the Neon Console, and select a branch. Under the **Computes** heading, the **Type** field identifies your read-only compute endpoints. Read replicas have a `R/O` value instead of `R/W`.

## Edit a read replica

You can edit your read replica to change the [Compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) or [Auto-suspend](/docs/manage/endpoints#auto-suspend-configuration) configuration.

To edit a read-only compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, identify the read-only compute endpoint you want to modify, click the compute endpoint kebab menu, and select **Edit**.
1. Specify your **Compute size** or **Auto-suspend delay** changes and click **Save**.

## Delete a read replica

Deleting a read replica is a permanent action, but you can quickly create a new read replica if you need it again. 
To delete a read replica:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, find the read-only compute endpoint you want to delete. Read replicas have a `R/O` type.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage read replicas using the Neon API

The following examples demonstrate creating and deleting read-only compute endpoints using the Neon API. The Neon API also supports get, list, edit, start, and suspend API methods. For information about those methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow only show some of the user-configurable request body attributes that are available to you. To view all attributes, refer to the method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key. You must replace this value with an actual API key when making a Neon API request.

### Create a read replica with the API

In Neon, a read replica is implemented as a read-only compute endpoint. The following Neon API method creates a read-only compute endpoint.

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

### Delete a read replica with the API

n Neon, a read replica is implemented as a read-only compute endpoint. The following Neon API method deletes the specified compute endpoint. Compute endpoints are identified by their `branch_id` and `endpoint_id`, regardless of whether they are read-write or read-only. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectendpoint).

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
