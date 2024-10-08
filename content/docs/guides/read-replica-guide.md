---
title: Working with Neon read replicas
subtitle: Learn how to create and and manage read replicas in Neon
enableTableOfContents: true
updatedOn: '2024-10-08T10:58:34.745Z'
---

[Read replicas](/docs/introduction/read-replicas) are supported with all Neon plans. This guide will lead you through the process of creating and managing read replicas.

The general methodology of using read replicas to segregate read-only work from your production database operations can be applied to a variety of uses cases, such as:

- Offloading analytics or reporting queries
- Distributing read requests to achieve higher throughput
- Providing read-only data access to specific users or applications who do not need to modify data
- Configuring different CPU and memory resources for each read replica for different users and applications

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can create one or more read replicas for any branch in your Neon project and configure the vCPU and memory allocated to each. Neon's _Autoscaling_ and _Autosuspend_ features are also supported, providing you with control over compute usage.

## Prerequisites

- A Neon paid plan account
- A [Neon project](/docs/manage/projects#create-a-project)

## Create a read replica

Creating a read replica involves adding a read replica compute to a branch. You can add a read replica compute to any branch in your Neon project using the Neon Console, [Neon CLI](/docs/reference/cli-branches#create), or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint).

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
To create a read replica from the Neon Console:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add Read Replica**.
4. On the **Add new compute** dialog, select **Read replica** as the **Compute type**.
5. Specify the **Compute size settings**. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable autoscaling by configuring a minimum and maximum compute size. You can also configure the **Suspend compute after inactivity** setting, which is the amount of idle time after which your compute is automatically suspended. The default setting is 5 minutes.
   <Admonition type="note">
   The compute size configuration determines the processing power of your database.
   </Admonition>
6. When you finish making your selections, click **Create**.

In a few seconds, your read replica is provisioned and appears on the **Computes** tab on the **Branches** page. The following section describes how to connect to your read replica.
</TabItem>

<TabItem>

To create a read replica using the Neon CLI, use the [branches](/docs/reference/cli-branches) command, specifying the `add-compute` subcommand with `--type read_only`. If you have more than one Neon project, also include the `--project-id` option.

```bash
neon branches add-compute mybranch --type read_only
```

</TabItem>

<TabItem>

To create a read replica compute using the Neon API, use the [Create endpoint](https://api-docs.neon.tech/reference/createprojectendpoint) method. The `type` attribute in the following example specifies `read_only`, which creates a read replica compute. For information about obtaining the required `project_id` and `branch_id` parameters, refer to [Create an endpoint](https://api-docs.neon.tech/reference/createprojectendpoint), in the _Neon API reference_.

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/<project_id>/endpoints \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
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

Connecting to a read replica is the same as connecting to any branch, except you connect via a read replica compute instead of your primary read-write compute. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select a **Replica**.
1. Select a connection string or a code example from the drop-down menu and copy it. This is the information you need to connect to the read replica from you client or application.

   A **psql** connection string appears similar to the following:

   ```bash
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

   If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string or example.

   No write operations are permitted on a connection to a read replica.

## View read replicas

You can view read replicas using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint).

<Tabs labels={["Console", "API"]}>

<TabItem>
To view read replicas for a branch, select **Branches** in the Neon Console, and select a branch. Under the **Computes** heading, the **Type** field identifies your read replicas. Read replicas have a `R/O` value instead of `R/W`.

![View read replicas](/docs/guides/view_read_replica.png)
</TabItem>

<TabItem>
To view read replica computes with the [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint), use the [Get endpoints](https://api-docs.neon.tech/reference/listprojectendpoints) method.

```bash
curl -X 'GET' \
  'https://console.neon.tech/api/v2/projects/<project_id>/endpoints' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

For information about obtaining the required `project_id` parameter for this command, refer to [Get endpoints](https://api-docs.neon.tech/reference/listprojectendpoints), in the _Neon API reference_. For information about obtaining an Neon API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

In the response body for this method, read replica computes are identified by the `type` value, which is `read_only`.
</TabItem>

</Tabs>

## Edit a read replica

You can edit a read replica using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) to change the [Compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) or [Autosuspend](/docs/manage/endpoints#auto-suspend-configuration) configuration.

<Tabs labels={["Console", "API"]}>

<TabItem>
To edit a read replica compute using the Neon Console:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, identify the read replica compute you want to modify, and click **Edit**.
1. Specify your settings click **Save**.

</TabItem>

<TabItem>
To edit a read replica compute with the Neon API, use the [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint) method.

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/<project_id>/endpoints/<endpoint_id> \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
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

Computes are identified by their `project_id` and `endpoint_id`. For information about obtaining the required `project_id` and `endpoint_id` parameters, refer to [Update endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint), in the _Neon API reference_. For information about obtaining an Neon API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

</TabItem>

</Tabs>

## Delete a read replica

You can delete a read replica using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Deleting a read replica is a permanent action, but you can quickly create a new read replica if you need one.

<Tabs labels={["Console", "API"]}>

<TabItem>
To delete a read replica using the Neon Console:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. On the **Computes** tab, find the read replica you want to delete.
1. Click **Edit** &#8594; **Delete**.

</TabItem>

<TabItem>
To delete a read replica compute with the Neon API, use the [Delete endpoint](https://api-docs.neon.tech/reference/deleteprojectendpoint) method.

```bash
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/<project_id>/endpoints/<endpoint_id> \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY"
```

Computes are identified by their `project_id` and `endpoint_id`. For information about obtaining the required `project_id` and `endpoint_id` parameters, refer to [Delete endpoint](https://api-docs.neon.tech/reference/deleteprojectendpoint), in the _Neon API reference_. For information about obtaining an Neon API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

</TabItem>

</Tabs>

## Default and read replica compute setting synchronization

In a Postgres primary-standby configuration, certain settings should be no smaller on a standby than on the primary in order to ensure that the standby does not run out of shared memory during recovery, as described in the [PostgreSQL hot standby documentation](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN). For Neon [read replicas](/docs/introduction/read-replicas), it's no different. The same settings should be no smaller on a read replica compute (the "standby") than on your primary read-write compute (the "primary"). For this reason, the following settings on read replica computes are synchronized with the settings on the primary read-write compute when the read replica compute is started:

- `max_connections`
- `max_prepared_transactions`
- `max_locks_per_transaction`
- `max_wal_senders`
- `max_worker_processes`

<NeedHelp/>
