---
title: Branching — Data analysis and reporting
subtitle: Learn how to create database branches for data-intensive analytics queries
enableTableOfContents: true
isDraft: true
---

Neon's database branching feature allows you to instantly create a database branch for running data analysis and reporting queries, thereby avoiding any disruption or performance degradation on your production database.

As an example, suppose you have a sales table on your production system. The table and data might look something like this:

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
```

You want to find the total sale amount for each product in the past year but due to the large number of products and sales, you know it's a costly query that could disrupt normal operations.

This guide walks you through creating a branch of your production database where you can run a data-intensive query without affecting your production system.

## Create a branch of your production database

Creating a branch is a near-instant operation. Neon's database branching feature uses a copy-on-write technique, which means there is no copying of data when creating a branch.

To create a branch of your production data:

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch. You might call it `sales_query`, for example.
5. Select the branch that contains your production database.
6. Select the **Head** option to create a branch with the latest data.
7. Leave the **Create compute endpoint** option selected. A compute endpoint is required to connect to the new branch.
8. Click **Create a branch** to create your branch.

## Connect to your new branch

Connecting to your newly created branch requires connecting via the branch's compute endpoint. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

To connect:

1. In the Neon Console, select your project.
2. On the project **Dashboard**, under **Connection Details**, select the `sales-query` branch you, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
3. Copy the connection string. A connection string includes your role name, password, the compute endpoint hostname, and database name.
4. Connect with `psql`. Your connection string will look something like this:

  <CodeBlock shouldWrap>

  ```bash
  psql postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
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

Depending on the number of products and sales, this query would likely impact performance if run on your production database. Since you are running the query on your production branch, which is isolated from your production database and has a its own vCPU and RAM, it will have no effect on your production system.

## Delete the branch

When you're done running queries and don't need the branch anymore, you can delete it to avoid taking up storage space:

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Select the `sales_query` branch from the table.
3. From the **More** menu, select **Delete**.
4. On the confirmation dialog, click **Delete**.

<Admonition type="tip">
It is a good practice to remove branches when you are finished with them. A branch starts taking up storage space when you make changes to data in the branch or when the branch falls out of your project's point-in-time restore (PITR) window, which is 7 days by default. When a branch falls out of the PITR window, it not longer shares data with the parent branch.
</Admonition>
