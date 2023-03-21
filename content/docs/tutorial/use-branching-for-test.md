---
title: Test queries with a database branch
enableTableOfContents: true
---

In the previous example, a `DELETE` query was executed on the `elements` table to remove duplicates, but the problematic query deleted most of your data.

Since a `DELETE` query is a potentially destructive operation, it is recommended that you test `DELETE` queries before you run them on your production database to make sure they work as intended. You can do this easily in Neon by creating a test branch.

Navigate to the **Branches** page and click on the **New Branch** button to create a new branch. Name the branch `test_branch`.

This time, create the branch from `Head`, which creates a branch with the most up-to-date state of your database. Specify the recovery branch you created previously as the parent branch.

![Neon test branch](/docs/get-started-with-neon/create_test_branch.png)

## Test your query

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

You find that the query successfully removed duplicates from the `elements` table. You can now safely apply the query to your production branch, and the test branch can be deleted.

## Conclusion

Congratulations. You completed the _Neon tutorial_. Here is a recap of what was covered:

- You learned how to create a Neon project.
- You created a table and inserted data using the Neon **SQL Editor**.
- You learned about Neon's database branching feature and how you can use it to recover lost data
- You learned how you can use branches to test potentially destructive queries before before running them in production.
