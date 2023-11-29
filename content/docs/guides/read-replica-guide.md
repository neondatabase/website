---
title: Working with Neon read replicas
subtitle: Learn how to create and and manage read replicas in Neon
enableTableOfContents: true
updatedOn: '2023-11-10T15:52:25.418Z'
---

[Read replicas](/docs/introduction/read-replicas) are supported with the [Neon Pro Plan](/docs/introduction/pro-plan). This guide will lead you through the process of creating and managing read replicas.

The general methodology of using read replicas to segregate read-only work from your production database operations can be applied to a variety of uses cases, such as:

- Offloading analytics or reporting queries
- Distributing read requests to achieve higher throughput
- Providing read-only data access to specific users or applications who do not need to modify data
- Configuring different CPU and memory resources for each read replica for different users and applications

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can create one or more read replicas for any branch in your Neon project and configure the vCPU and memory allocated to each. Neon's _Autoscaling_ and _Auto-suspend_ features are also supported, providing you with control over compute usage.

## Prerequisites

- A [Neon Pro Plan](/docs/introduction/pro-plan) account.
- A [Neon project](/docs/manage/projects#create-a-project).

## Create a read replica

Creating a read replica involves adding a read-only compute endpoint to a branch. You can add a read-only compute endpoint to any branch in your Neon project using the Neon Console, [Neon CLI](/docs/reference/cli-branches#create), or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint).

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
To create a read replica from the Neon Console:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add compute**.
4. On the **Create Compute Endpoint** dialog, select **Read-only** as the **Compute type**.
5. Specify the **Compute size** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable **Autoscaling** and configure a minimum and maximum compute size. You can also configure the **Suspend compute after a period of inactivity** setting, which is the amount of idle time after which your read-only compute is automatically suspended. The default setting is 5 minutes. You can set this value up 7 days.
    <Admonition type="note">
    The compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
    </Admonition>
6. When you have finished making your selections, click **Create**.

In a few moments, your read-only compute is provisioned and appears in the **Computes** section of the **Branches** page. This is your read replica. The following section describes how to connect to your read replica.
</TabItem>

<TabItem>

To create a read replica using the Neon CLI, use the [branches](/docs/reference/cli-branches) command, specifying the `add-compute` and `-type read_only` options. If you have more than one Neon project, also  include the `--project-id` option.  


```bash
neonctl branches add-compute mybranch --type read_only
```

</TabItem>

<TabItem>

In Neon, a read replica is implemented as a read-only compute endpoint. To create a read-only compute endpoint using the Neon API,  use the [Create endpoint](https://api-docs.neon.tech/reference/createprojectendpoint) method. The `type` attribute in the following example specifies `read_only`, which creates a read-only compute endpoint. For information about obtaining the required `project_id` and `branch_id` parameters, refer to [Create an endpoint](https://api-docs.neon.tech/reference/createprojectendpoint), in the _Neon API reference_.

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/<project_id>/endpoints \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "type": "read_only",
    "branch_id": "<branch_id>"
  }
}
' | jq
```

</TabItem>

</Tabs>

## Connect to a read replica

Connecting to a read replica is the same as connecting to any branch, except you connect via a read-only compute endpoint instead of a read-write compute endpoint. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select a **Read-only** compute endpoint.
1. Select a connection string or a code example from the drop-down menu and copy it. This is the information you need to connect to the read replica from you client or application.

    A **psql** connection string appears similar to the following:

    ```bash
    postgres://[user]:[password]@[neon_hostname]/[dbname]
    ```

    If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string or example.

    When you use a read-only connection string, you are connecting to a read replica. No write operations are permitted on this connection.

## Viewing read replicas

You can view read replicas using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint).

<Tabs labels={["Console", "API"]}>

<TabItem>
To view read replicas for a branch, select **Branches** in the Neon Console, and select a branch. Under the **Computes** heading, the **Type** field identifies your read replicas. Read replicas have a `R/O` value instead of `R/W`.
</TabItem>

<TabItem>
In Neon, a read replica is implemented as a read-only compute endpoint.  To view read-only compute endpoints with the [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint), use the [Get endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method. In the response body, read replica compute endpoints are identified by the `type` value, which is `read_only`. 

For information about obtaining the required `project_id` parameter for this command, refer to [Get endpoints](https://api-docs.neon.tech/reference/listprojectendpoints), in the _Neon API reference_.

```bash
curl -X 'GET' \
  'https://console.neon.tech/api/v2/projects/<project_id>/endpoints' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

</TabItem>

</Tabs>


## Edit a read replica

You can edit a read replica using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) to change the [Compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) or [Auto-suspend](/docs/manage/endpoints#auto-suspend-configuration) configuration.

<Tabs labels={["Console", "API"]}>

<TabItem>
To edit a read-only compute endpoint using the Neon Console:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, identify the read-only compute endpoint you want to modify, click the compute endpoint menu, and select **Edit**.
1. Specify your **Compute size** or **Suspend compute after a period of inactivity** changes and click **Save**.
</TabItem>

<TabItem>
In Neon, a read replica is implemented as a read-only compute endpoint. To edit a read-only compute endpoint with the Neon API, use the [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) method. 

Compute endpoints are identified by their `project_id` and `endpoint_id`. For information about obtaining the required `project_id` and `endpoint_id` parameters, refer to [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint), in the _Neon API reference_.

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/project_id/endpoints/endpoint_id \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY` \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "autoscaling_limit_min_cu": 25,
    "autoscaling_limit_max_cu": 3,
    "suspend_timeout_seconds": 604800,
    "provisioner": "k8s-neonvm"
  }
}
'
```

</TabItem>

</Tabs>


## Delete a read replica

You can delete a read replica using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Deleting a read replica is a permanent action, but you can quickly create a new read replica if you need one.

<Tabs labels={["Console", "API"]}>

<TabItem>
To delete a read replica using the Neon Console:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, find the read-only compute endpoint you want to delete. Read replicas have a `R/O` type.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.
</TabItem>

<TabItem>
In Neon, a read replica is implemented as a read-only compute endpoint. To delete a read-only compute endpoint with the Neon API, use the [Delete endpoint](https://api-docs.neon.tech/reference/deleteprojectendpoint) method. 

Compute endpoints are identified by their `project_id` and `endpoint_id`, regardless of whether they are read-write or read-only. For information about obtaining the required `project_id` and `endpoint_id` parameters, refer to [Delete endpoint](https://api-docs.neon.tech/reference/deleteprojectendpoint), in the _Neon API reference_.

```bash
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/<project_id>/endpoints/endpoint_id \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY’
```

</TabItem>

</Tabs>

<NeedHelp/>
