---
title: Recover lost data with branching
subtitle: Use Neon branching to restore your data to past state
enableTableOfContents: true
---

The following instructions demonstrate how to use Neon's branching feature to recover lost data.

Suppose that you tried to populate the `elements` table with more data but you accidentally inserted several duplicate rows, which you discover when you run the following query:

```sql
SELECT id, elementName, atomicNumber, symbol, COUNT(*) as count
FROM elements
GROUP BY id, elementName, atomicNumber, symbol
HAVING COUNT(*) > 1;
```

```text
 id | elementname | atomicnumber | symbol | count
----+-------------+--------------+--------+-------
 9  | Fluorine    |            9 | F      |     2
 10 | Neon        |           10 | Ne     |     2
 11 | Sodium      |           11 | Na     |     2
 8  | Oxygen      |            8 | O      |     2
 7  | Nitrogen    |            7 | N      |     2
```

You decide to write a query to remove the duplicate rows, but an error in your `DELETE` statement deletes most of your data. There is an `=` where there should have been a `>` in the last line of your query:

```sql
DELETE FROM elements
WHERE (id, elementName, atomicNumber, symbol) IN (
  SELECT id, elementName, atomicNumber, symbol
  FROM elements
  GROUP BY id, elementName, atomicNumber, symbol
  HAVING COUNT(*) = 1
);
```

Upon inspecting the data in your table, you find that your `DELETE` query left you with only the duplicate rows:

```sql
SELECT * FROM elements ORDER BY id;
```

```text
 id | elementname | atomicnumber | symbol 
----+-------------+--------------+--------
 10 | Neon        |           10 | Ne
 10 | Neon        |           10 | Ne
 11 | Sodium      |           11 | Na
 11 | Sodium      |           11 | Na
 7  | Nitrogen    |            7 | N
 7  | Nitrogen    |            7 | N
 8  | Oxygen      |            8 | O
 8  | Oxygen      |            8 | O
 9  | Fluorine    |            9 | F
 9  | Fluorine    |            9 | F
```

With Neon, you can recover from data loss scenarios like this very easily.

## Create a branch to recover lost data

You can use the Neon branching feature to recover lost data in seconds. The only requirement is that you know the point in time to recover to. Since you ran the `DELETE` query from the Neon **SQL Editor**, you can check the **History** for the date and time you ran the problematic query.

![Find query time](/docs/tutorial/delete_query_time.png)

Now that you know when the data loss occurred, you can restore your data to a point in time just before that by creating a database branch.

1. Navigate to the **Branches** page in the Neon Console.
![Branches page](/docs/tutorial/branches_page.png)
1. Click **New Branch** to open the branch creation dialog.
1. Enter a name for the branch.
1. Select the parent branch. The data loss occurred on your project's [primary branch](/docs/reference/glossary/#primary-branch) (`main`), so select that branch as the parent.
1. Select the **Time** option to create a branch with data up to a specific date and time. You determined that the data loss occurred on March 20, 2023 at 8:58am, so you set it to 8:57am, just before you ran the `DELETE` query.
![Create a point in time branch](/docs/tutorial/create_branch_time.png)
1. Click **Create Branch** to create your branch. You should see a dialog similar to the following with the connection details for your new branch.
![New branch connection details](/docs/tutorial/new_branch_connection_details.png)

## Verify that data was recovered

To verify that the new branch includes the lost data:

1. Navigate to the SQL Editor.
1. Select the new branch.
1. Run the following query:

```sql
SELECT * FROM elements ORDER BY id;
```

You should see the data as it existed before you ran the problematic `DELETE` query. You can now run a revised `DELETE` statement to remove the duplicate rows, which you will do in the next part of the tutorial.

What have you seen in this example?

To recover the data, you can use Neon's branching feature to create a branch with data from a past point in time. Neon keeps a 7-day history, by default, to enable point-in-time restore.

Neon also supports creating branches from **Head** (the most up-to-date state of the database) or from an **LSN** (Log Sequence Number), which is a unique identifier assigned to each transaction in the database.

For another data recovery example using Neon's branching feature, refer to [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres). This example uses a bisect script and the Neon API to create branches to recover to the last known good.
