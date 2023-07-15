---
title: Branching — Data analysis and reporting
subtitle: Learn how to create database branches for data-intensive analytics queries
enableTableOfContents: true
isDraft: true
---

Neon's database branching feature allows you to duplicate your database schema and data at a specific point in time, and then perform operations on this copy without impacting your database. You can run data-intensive analytics queries on this branch, avoiding disruption or performance issues on your production branch.

This guide walks you through creating a branch of your production database, running a data analysis query, and deleting the branch when you are finished.

## Create a branch

To create a branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch.
5. Select a parent branch. You can branch from your Neon project's [primary branch](/docs/manage/branches#primary-branch) or a [non-primary branch](/docs/manage/branches#non-primary-branch).
6. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time (the default).
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified [Log Sequence Number (LSN)](/docs/reference/glossary#lsn).
7. Select whether or not to create a compute endpoint, which is required to connect to the branch. If you are unsure, you can add a compute endpoint later.
8. Click **Create Branch** to create your branch.

You are directed to the **Branches** page where you are shown the details for your new branch.

## Connect to your branch

Connecting to a database in a branch requires connecting via a compute endpoint associated with the branch. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
3. Copy the connection string. A connection string includes your role name, the compute endpoint hostname, and database name.
4. Connect with `psql` as shown below.

  <CodeBlock shouldWrap>

  ```bash
  psql postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

## Run your analytics query

As an example, suppose you have a sales table with the columns `product_id`, `sale_date`, and `sale_amount`. You want to find the total sale amount for each product in the past year. This could be an expensive query if you have a large number of sales. Here's how you could write the query:

```sql
SELECT product_id, SUM(sale_amount) as total_sales
FROM sales
WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
GROUP BY product_id;
```

This will sum the sale_amount for each product_id where the sale_date is within the past year, grouped by the product_id.

## Delete the branch

If you're done with the analytics query and don't need the branch database anymore, you can delete to avoid taking up additional storage space:

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Select your branch from the table.
3. Click **Delete**.
4. On the confirmation dialog, click **Delete**.

Tip: It is a good practice to remove branches when you are finished with them. A branch starts taking up storage space when you make changes to data in the branch or when the branch falls out of your project's point-in-time restore (PITR) window.

## Automating branch creation and deletion

This guide showed how to create and delete branches using the Neon Console. Neon supports different methods of automating branch creation and deletion. See [Automating branch creation and deletion](/docs/guides/analytics).
