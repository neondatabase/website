---
title: Branching — Data analysis and reporting
subtitle: Leverage database branches for running data-intensive queries
enableTableOfContents: true
---

Neon's database branching feature allows you to instantly create an isolated database branch with its own compute resources for running data-intensive analytics and reporting queries, thereby avoiding any disruption or performance degradation on your production database.

As an example, suppose you have a sales table in your production database. The table and data might look something like this:

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

You want to find the total sale amount for each product in the past year, but due to the large number of products and sales, you know it's a costly query that could impact normal operations on your production system.

This guide walks you through creating a branch of your production data which you can use to run data-intensive queries without affecting your production system.

## Create a branch of your production database

Creating a branch is a near-instant operation. Neon's database branching feature uses a copy-on-write technique, which means there is no copying or transfer of data when creating a branch. This technique provides your branch with full read access to your dataset. Data copying only occurs if you modify data on the branch.

To create a branch of your production data:

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Click **Create branch** to open the branch creation dialog.
![Create branch dialog](/docs/guides/data_analysis_create_branch.png)
4. Enter a name for the branch. You can call it `sales_query`, for example.
5. For the **Parent branch**, select the branch that contains your production database. In most cases this will be your primary branch, which is named `main` by default.
6. Select the **Head** option to create a branch with the latest data.
7. Leave the **Create compute endpoint** option selected. A compute endpoint is required to connect to the new branch.
<Admonition type="note">
Pro plan users can configure the amount of vCPU and RAM for a compute endpoint to provide extra processing power. For more information, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
</Admonition>
8. Click **Create a branch** to create your branch.

## Connect to your new branch

To run queries on your new branch, you will need to connect to it. Connecting to a branch requires connecting via the branch's compute endpoint. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="note">
You can also run queries on a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

To connect to your branch:

1. In the Neon Console, select your project.
2. On the project **Dashboard**, under **Connection Details**, select the `sales_query` branch, the database, and the role you want to connect with.
![Connection details widget](/docs/guides/data_analysis_connection_details.png)
3. Copy the connection string. A connection string includes your role name, password, compute endpoint hostname, and database name.
4. Connect with `psql`. Your connection string will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   psql postgres://daniel:<password>@ep-silent-snow-51168527.us-east-2.aws.neon.tech/neondb
   ```

   </CodeBlock>

## Run the analytics query on your branch

An analytics query on your `sales` table might look something like this:

```sql
SELECT product_id, SUM(sale_amount) as total_sales
FROM sales
WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
GROUP BY product_id;
```

If you have a lot of products and sales, this query would likely impact performance on your production system, but running the query on your `sales_query` branch, which is isolated from your production database and has its own compute resources, causes no disruption.

## Delete the branch

When you are finished running analytics queries and no longer require the branch, you can delete it to avoid taking up storage space.

To delete the `sales_query` branch:

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Select the `sales_query` branch from the table.
3. From the **More** menu, select **Delete**.
4. On the confirmation dialog, click **Delete**.

That's it. The branch is removed. If you need to run analytics queries again, you can quickly create a new branch with the latest data.

<Admonition type="note">
We recommend removing branches when you are finished with them. A branch starts taking up storage space when you change data in the branch or when the branch falls out of your project's point-in-time restore (PITR) window, which is 7 days by default. When a branch falls out of the PITR window, it no longer shares data with the parent branch.
</Admonition>
