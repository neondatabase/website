---
title: Run ad-hoc queries with Read Replicas
subtitle: Leverage read replicas for running ad-hoc queries
enableTableOfContents: true
updatedOn: '2024-08-27T12:23:05.816Z'
---

In many situations, you may need to run quick, one-time queries to retrieve specific data or test an idea. These are known as **ad-hoc queries**. Ad-hoc queries are particularly useful for tasks like analytics, troubleshooting, or exploring your data without setting up complex reports. However, running resource-intensive queries on your production database can degrade performance, especially if they target heavily used tables.

This is where **Neon Read Replicas** come in handy. With read replicas, you can quickly create a replica that runs on dedicated read-only compute, allowing you to run ad-hoc queries without impacting your primary database’s performance. Once you're done, the read replica can automatically scale to zero, or you can delete it. The key advantages of using Neon Read Replicas for ad-hoc queries include the following:

- You can add a fully functional read replica in seconds.
- There's no additional storage cost or data replication, as the replica uses the same storage as your primary compute.
- The read replica compute automatically scales to zero based on your [autosuspend](/docs/introduction/auto-suspend) settings, so you're only billed for the compute used while you run your ad-hoc query. By default, a compute suspends due to inactivity after 5 minutes of inactivity.
- You can remove a read replica as quickly as you created it, or just leave it for the next time you need it. The compute will remain suspended until you run your next query.

## What is an ad-hoc query?

An ad-hoc query is an impromptu query used to retrieve specific data from your database. These queries are not part of routine reporting or pre-written scripts; they are created on the fly to answer immediate questions or perform temporary analysis. For example, if you want to quickly calculate the total sales for a product over the last month, you might write a simple SQL query like this:

```sql
SELECT product_id, SUM(sale_amount)
FROM sales
WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 month')
GROUP BY product_id;
```

## Why run ad-hoc queries on a read replica?

Running ad-hoc queries on a read replica can help you:

- **Avoid performance issues**: Heavy ad-hoc queries, such as large aggregations or joins, can slow down your production database. A read replica offloads that work.
- **Isolate query load**: Since ad-hoc queries may be exploratory and involve significant data scanning, running them on a replica prevents unplanned queries from affecting your production traffic.
- **Ensure data consistency**: With Neon, read replicas access the same data as your primary compute, ensuring your ad-hoc queries reflect up-to-date information.

## Setting up a read replica for ad-hoc queries

You can add a read replica compute to any branch in your Neon project by following these steps:

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

Alternatively, you can create read replicas using the [Neon CLI](/docs/reference/cli-branches#create) or [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint).

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

### Connect to the read replica

1. Once the read replica is created, go to your **Project Dashboard**.
2. Under **Connection Details**, select the replica compute.
3. Copy the connection string and use it to connect to the replica, either via `psql` or your application.

Your connection string will look something like this:

```bash
postgresql://user:password@ep-read-replica-123456.us-east-2.aws.neon.tech/dbname
```

### Running ad-hoc queries

Once connected to the read replica, you can run your ad-hoc queries without worrying about impacting your production database. For example, let’s say you need to run a quick analysis to get sales data for specific products over the past year:

```sql
SELECT product_id, SUM(sale_amount) AS total_sales
FROM sales
WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
GROUP BY product_id;
```

This query will execute on the read replica, leaving your primary database free to handle regular traffic and operations.

## Ad-hoc query scenarios

Here are a few common scenarios where ad-hoc queries on a read replica can be useful:

- **Sales Analysis**: Calculate total sales for a product or category without affecting your production system.
- **Data Exploration**: Explore data patterns, such as checking anomalies or trends in your dataset.
- **Custom Reporting**: Generate one-time reports for business meetings or audits without waiting for a prebuilt report.
- **Checking queries for write attempts**: Since read replicas are designed for read-only operations, any unintended write actions will result in an error. For example, if someone tries to insert data into the sales table on the read replica, they will get an error message like this:

  ```bash
  ERROR: cannot execute INSERT in a read-only transaction (SQLSTATE 25006)
  ```

  This ensures that the replica is used solely for reading data, preserving the integrity of your production system.

## Summary

In summary, ad-hoc queries provide flexibility when exploring or analyzing data. By using a Neon read replica, you can run these spontaneous, resource-intensive queries without impacting your primary production database. Whether you’re performing analytics, troubleshooting, or generating reports, Neon read replicas allow you to easily run ad-hoc queries while maintaining data integrity and protecting your production system from disruption.
