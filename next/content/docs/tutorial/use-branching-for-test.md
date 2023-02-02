---
title: Use Neon branching for testing
enableTableOfContents: true
---

We previously ran a `DELETE` query on the `shoes` table to remove duplicates. However the query was wrong because it didn’t specify all the criteria. Here how the query should have been written:

```sql
DELETE FROM shoes a USING shoes b
WHERE a.id > b.id
AND a.brand = b.brand
AND a.model = b.model
AND a.description = b.description
AND a.color = b.color
```

Since a `DELETE` is a potentially destructive operation, it is recommended to test the query first to make sure it works as intended. You can easily do this on a new branch before trying it on your `backup` branch.

Navigate to the `Branches` page and click on the `New Branch` button to create a new branch.

This time, create a test branch from `Head` with the most up-to-date state of the database and specify `backup` as parent.

<Admonition type="note">
If you skipped the [Data recovery with branching](/docs/tutorial/data-recover-with-branching) part of this tutorial, you should use `main` as the parent branch.
</Admonition>

## Run remove duplicates query on backup branch

Navigate to the SQL Editor, select the `test` branch and run the query to remove duplicates.

```sql
DELETE FROM shoes a USING shoes b
WHERE a.id > b.id
AND a.brand = b.brand
AND a.model = b.model
AND a.description = b.description
AND a.color = b.color
```

Next, run a `SELECT model, color FROM shoes` query to verify the result.

```text
| # |         model        | color                                          |
|---|----------------------|------------------------------------------------|
| 1 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
| 2 | Air Zoom Alphafly    | Total Orange/Bright Crimson/Ghost Green/Black  |
| 3 | ZoomX Vaporfly       | Scream Green/Bright Crimson/Honeydew/Black     |
```

You managed to remove duplicates from the `shoes` table. You can now safely apply the same query to the parent branch.

## Conclusion

Congratulations. You completed the _Neon Tutorial_. Here is a recap of what was covered:

- You created a Neon project.
- You create a table and inserted data using the Neon **SQL Editor**.
- You learned about Neon's database branching feature and how you can use it to recover lost data and test potentially destructive queries before before running them in production.
