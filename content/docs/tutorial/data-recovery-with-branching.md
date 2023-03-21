---
title: Data recovery with branching
enableTableOfContents: true
---

The instructions that follow demonstrate how to use Neon's branching feature to recover lost data.

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

You decide to write a query to remove the duplicate rows, but an error in your `DELETE` statement causes most of your data to be deleted. There is an `=` where there should have been a `>` in the last line of the query.

```sql
DELETE FROM elements
WHERE (id, elementName, atomicNumber, symbol) IN (
  SELECT id, elementName, atomicNumber, symbol
  FROM elements
  GROUP BY id, elementName, atomicNumber, symbol
  HAVING COUNT(*) = 1
);
```

Upon inspecting the data in your table, you find that the `DELETE` query left you with only the duplicate rows:

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

## Recover lost data

You can use Neon branching to recover lost data in seconds. The only requirement is that you know the point in time to recover to. Since you ran the `DELETE` query from the Neon **SQL Editor**, you can check the  **History** for the date and time you ran the problematic query.

![Find query time](/docs/get-started-with-neon/delete_query_time.png)

Now that you know when the data loss occurred, you can restore your data to a point in time just before that by creating a database branch.

1. Navigate to the **Branches** page in the Neon Console.
![Branches page](/docs/get-started-with-neon/branches_page.png)
1. Click **New Branch** to open the branch creation dialog.
1. Enter a name for the branch.
1. Select the parent branch. The data loss occurred on your project's [primary branch](/docs/reference/glossary/#primary-branch) (`main`), so select that branch as the parent.
1. Select the **Time** option to create a branch with data up to a specific date and time. You determined that the data loss occurred on March 20, 2023 at 8:58am, so you set it to 8:57am, just before you ran the `DELETE` query.
![Create a point in time branch](/docs/get-started-with-neon/create_branch_time.png)
1. Click **Create Branch** to create your branch. You should see a dialog similar to the following with the connection details for your new branch.
![New branch connection details](/docs/get-started-with-neon/new_branch_connection_details.png)

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

To recover the data, you used Neon's database branching feature to create a branch from a past point in time. Neon keeps a 7-day history by default, which makes recovery scenarios like this very easy. But this was a simple example. More serious data loss scenarios can be addressed just as easily, as was the case for this Neon user:

![Branches page](/docs/get-started-with-neon/data_recovery_twitter.png)

Neon also supports creating branches from **Head** (the most up-to-date state of the database) or from an **LSN** (Log Sequence Number), which is a unique identifier that is assigned to each transaction in the database.

To learn more about Neon's branching feature and the workflows it supports, see [Branching](/docs/introduction/branching).
