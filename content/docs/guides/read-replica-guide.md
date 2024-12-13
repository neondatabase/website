---
title: Create and manage Read Replicas
subtitle: Learn how to create and manage read replicas in Neon
enableTableOfContents: true
updatedOn: '2024-10-23T14:34:44.515Z'
---

[Read replicas](/docs/introduction/read-replicas) are supported with all Neon plans. This guide steps you through the process of creating and managing read replicas.

The general purpose of read replicas is to segregate read-only work from your production database operations. This can be applied to different uses cases, such as:

- **Horizontal scaling**: Distributing read requests across replicas to improve performance and increase throughput
- **Analytics queries**: Offloading resource-intensive analytics and reporting workloads to reduce load on the primary compute
- **Read-only access**: Granting read-only access to users or applications that don't require write permissions

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can create one or more read replicas for any branch in your Neon project and configure the vCPU and memory allocated to each. Neon's _Autoscaling_ and _Scale to Zero_ features are also supported, providing you with control over read replica compute usage.

## Prerequisites

- A Neon account
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
1. Select a connection string or a code example from the drop-down menu and copy it. This is the information you need to connect to the read replica from your client or application.

   A **psql** connection string appears similar to the following:

   ```bash
   postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
   ```

   If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string or example.

   <Admonition type="note">
   Write operations are not permitted on a read replica connection.
   </Admonition>

## View read replicas

You can view read replicas using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint).

<Tabs labels={["Console", "API"]}>

<TabItem>
To view read replicas for a branch, select **Branches** in the Neon Console, and select a branch. Read replicas are listed on the **Computes** tab.

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

You can edit a read replica using the Neon Console or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) to change the [Compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) or [Scale to Zero](/docs/manage/endpoints#scale-to-zero-configuration) configuration.

<Tabs labels={["Console", "API"]}>

<TabItem>
To edit a read replica compute using the Neon Console:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, identify the read replica compute you want to modify, and click **Edit**.
1. Make the changes to your compute settings, and click **Save**.

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

## Monitoring read replicas

You can monitor replication delay between the primary compute and your read replica computes from the **Monitoring** page in the Neon Console. Two graphs are provided:

**Replication delay bytes**

![Replication delay bytes](/docs/introduction/rep_delay_bytes.png)

The **Replication delay bytes** graph shows the total size, in bytes, of the data that has been sent from the primary compute but has not yet been applied on the replica. A larger value indicates a higher backlog of data waiting to be replicated, which may suggest issues with replication throughput or resource availability on the replica. This graph is only visible when selecting a **Replica** compute from the **Compute** drop-down menu.

**Replication delay seconds**

![Replication delay seconds](/docs/introduction/rep_delay_seconds.png)

The **Replication delay seconds** graph shows the time delay, in seconds, between the last transaction committed on the primary compute and the application of that transaction on the replica. A higher value suggests that the replica is behind the primary, potentially due to network latency, high replication load, or resource constraints on the replica. This graph is only visible when selecting a **Replica** compute from the **Compute** drop-down menu.

## Read replica compute setting synchronization

For Neon [read replicas](/docs/introduction/read-replicas), certain Postgres settings should not have lower values than your primary read-write compute. For this reason, the following settings on read replica computes are synchronized with the settings on the primary read-write compute when the read replica compute is started:

- `max_connections`
- `max_prepared_transactions`
- `max_locks_per_transaction`
- `max_wal_senders`
- `max_worker_processes`

No users action is required. The settings are synchronized automatically when you create a read replica. However, if you change the compute size configuration on the primary read-write compute, you will need to restart your read replica computes to ensure that settings remain synchronized, as described in the next section.

### Replication delay issues

If your read replicas are falling behind, follow these steps to diagnose and resolve the issue:

1. **Check Your Replication Lag Metrics**  
   Refer to [Monitoring Read Replicas](https://neon.tech/docs/guides/read-replica) for detailed instructions on how to monitor replication lag.

2. **Verify Configuration Alignment**  
   If replication lag is detected, ensure that the configurations for the primary and read-replica computes are aligned. Specifically, confirm that the following parameters match between your primary compute and read-replica compute:  
   - `max_connections`  
   - `max_prepared_transactions`  
   - `max_locks_per_transaction`  
   - `max_wal_senders`  
   - `max_worker_processes`

3. **Restart Read-Replica Computes if Configurations are Misaligned**  
   If the configurations are not aligned, restart your read-replica computes to automatically update their settings. For instructions, see [Restart a Compute](https://neon.tech/docs/manage/endpoints#restart-a-compute).

   <Admonition type="tip">
   When increasing the size of your primary read-write compute, always restart associated read replicas to ensure their configurations remain aligned.
   </Admonition>

<NeedHelp/>
