---
title: Run analytics queries with Read Replicas
subtitle: Leverage read replicas for running data-intensive analytics queries
enableTableOfContents: true
updatedOn: '2024-08-27T12:23:05.816Z'
---

With Neon's read replica feature, you can instantly create a dedicated read replica for running data-intensive analytics or reporting queries. This allows you to avoid disruption or performance degradation on your production database.

A read replica reads data from the same source as your primary read-write compute. There's no data replication, so creating a read replica is a near-instant process. For more information about Neon's read replica architecture, see [Read replicas](/docs/introduction/read-replicas).

## Scenario

Suppose you have a `sales` table in your production database. The table and data might look something like this:

```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    sale_amount DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL
);

INSERT INTO sales (product_id, sale_amount, sale_date) VALUES
(1, 20.50, '2022-07-24'),
(2, 35.99, '2022-08-24'),
(1, 20.50, '2022-09-24'),
(3, 15.00, '2023-01-24'),
(1, 20.50, '2023-04-24');
...
```

You want to find the total sale amount for each product in the past year, but due to the large number of products and sales in your database, you know this is a costly query that could impact performance on your production system.

This guide walks you through creating a read replica, connecting to it, running your query, and optionally deleting the read replica when finished.

<Admonition type="tip" title="Metabase Analytics Use Case">
[Metabase](https://www.metabase.com/) is an open-source business intelligence (BI) company that provides a platform for visualizing and analyzing data. With Metabase and Neon, you can:
- Create a read replica in Neon
- Configure [Autoscaling](/docs/introduction/autoscaling) to define minimum and maximum limits for compute resources
- Configure [Autosuspend](/docs/introduction/auto-suspend) to define how soon the read replica scales to zero when not being used
- Configure a connection to the read replica from Metabase.

With this setup, your read replica only wakes up when Metabase connects, scales to sync job requirements without affecting your production database, and scales back to zero after the job sync is finished.
</Admonition>

## Create a read replica

Creating a read replica involves adding a read replica compute to a branch.

You can add a read replica compute- to any branch in your Neon project by following these steps:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add Read Replica**.
4. On the **Add new copmpute** dialog, select **Read replica** as the **Compute type**.
5. Specify the **Compute size settings**. You can configure a fixed size compute with a specific amount of vCPU and RAM (the default) or enable autoscaling by configuring a minimum and maximum compute size using the slider. You can also configure an **Autosuspend time** setting, which is the amount of idle time after which a compute suspends due to inactivity. The default setting is 5 minutes.
   <Admonition type="note">
   The compute size configuration determines the processing power of your database.
   </Admonition>
6. When you finish making your selections, click **Create**.

Your read replica is provisioned and appears on the **Computes** tab of the **Branches** page. The following section describes how to connect to your read replica.

Alternatively, you can create read replicas using the [Neon CLI](/docs/reference/cli-branches#create) or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint), providing the flexibility required to integrate read replicas into your workflows or CI/CD processes.

<CodeTabs labels={["CLI", "API"]}>

```bash
neon branches add-compute mybranch --type read_only
```

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/late-bar-27572981/endpoints \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "endpoint": {
    "type": "read_only",
    "branch_id": "br-young-fire-15282225"
  }
}
' | jq
```

</CodeTabs>

## Connect to the read replica

Connecting to a read replica is the same as connecting to any branch, except you connect via a read replica compute instead of your primary read-write compute. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select the **Replica** compute.
1. Select a **Database** and the **Role** you want to connect with.
1. Copy the connection string. This is the information you need to connect to the read replica from your client or application.

   The connection string appears similar to the following:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

   If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string.

   The information in your connection string corresponds to the following connection details:

   - role: `alex`
   - password:`AbC123dEf`
   - hostname: `ep-cool-darkness-123456.us-east-2.aws.neon.tech`
   - database name: `dbname`. Your database name may differ.

   When you connect to a read replica, no write operations are permitted on the connection.

1. Connect to your application from a client such as `psql` or add the connection details to your application. For example, to connect using `psql`, issue the following command:

   ```bash shouldWrap
   psql postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

## Run the analytics query on the read replica

An analytics query on your `sales` table might look something like this:

```sql
SELECT product_id, SUM(sale_amount) as total_sales
FROM sales
WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
GROUP BY product_id;
```

If you have a lot of products and sales, this query might impact performance on your production system, but running the query on your read replica, which has its own dedicated compute resources, causes no disruption.

## Delete the read replica

When you are finished running analytics queries, you can delete the read replica if it's no longer required. Deleting a read replica is a permanent action, but you can quickly create a new read replica when you need one.

<Admonition type="tip">
Alternatively, you can let the read replica scale to zero so that it's readily available the next time you need it. Neon's [Autosuspend](https://neon.tech/docs/introduction/auto-suspend) feature will suspend the compute until the next time you access it. The default autosuspend setting is 5 minutes, meaning that the read replica compute will automatically suspend after 5 minutes of inactivity.
</Admonition>

To delete a read replica:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. On the **Computes** tab, find the read replica you want to delete.
1. Click **Edit** &#8594; **Delete compute**.

<NeedHelp/>