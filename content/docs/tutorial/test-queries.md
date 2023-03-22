---
title: Test queries with branching
subtitle: Create a Neon branch to test potentially destructive queries
enableTableOfContents: true
---

In the previous example, a `DELETE` query was executed on the `elements` table to remove duplicates, but the problematic query deleted most of your data.

Since a `DELETE` query is a potentially destructive operation, it is recommended that you test `DELETE` queries before you run them on your production database to make sure they work as intended. You can do this in Neon by creating a test branch.

## Create a test branch

Navigate to the **Branches** page and click on the **New Branch** button to create a new branch. Name the branch `test_branch`.

This time, create the branch from `Head`, which creates a branch with the most up-to-date state of your database. Specify the recovery branch you created previously as the parent branch.

![Neon test branch](/docs/tutorial/create_test_branch.png)

## Run your query

Navigate to the **SQL Editor**, select the test branch, and run your new `DELETE` query.

```sql
DELETE FROM elements
WHERE (id, elementName, atomicNumber, symbol) IN (
  SELECT id, elementName, atomicNumber, symbol
  FROM elements
  GROUP BY id, elementName, atomicNumber, symbol
  HAVING COUNT(*) > 1
);
```

Next, run the following query to verify that the query ran as intended:

```sql
SELECT * FROM elements ORDER BY id;
```

You should find that the query successfully removed duplicates from the `elements` table. You can now safely apply the query to your production branch, and the test branch can be deleted.

## Conclusion

Congratulations. You have completed the _Neon tutorial_. Here is a recap of what was covered:

- You learned how to set up a Neon project.
- You learned how to create a table and insert data using the Neon **SQL Editor**.
- You learned how to explore data using the **Tables** feature in the Neon Console.
- You learned about Neon's database branching feature and how you can use it to recover lost data.
- You learned how to use a branch to test a potentially destructive query before running it in production.
