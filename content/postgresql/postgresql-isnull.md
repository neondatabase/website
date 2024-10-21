---
modifiedAt: 2024-01-31 21:01:35
prevPost: postgresql-coalesce
nextPost: postgresql-nullif
createdAt: 2019-01-02T13:03:39.000Z
title: 'PostgreSQL ISNULL'
redirectFrom:
    - /postgresql/postgresql-tutorial/postgresql-isnull
tableOfContents: true
---


SQL Server supports `ISNULL` function that replaces `NULL` with a specified replacement value:

```sql
ISNULL(expression, replacement)
```

If the `expression` is NULL, then the `ISNULL` function returns the `replacement`. Otherwise, it returns the result of the `expression`.

PostgreSQL does not have the `ISNULL` function. However, you can use the `COALESCE` function which provides similar functionality.

Note that the `COALESCE` function returns the first non-null argument, so the following syntax has a similar effect as the `ISNULL` function above:

```sql
COALESCE(expression,replacement)
```

For the `COALESCE` example, check out the `COALESCE` function tutorial.

In addition to `COALESCE` function, you can use the `CASE` expression:

```sql
SELECT
    CASE WHEN expression IS NULL
            THEN replacement
            ELSE expression
    END AS column_alias;
```

Check out the `CASE` expression tutorial for more information.
