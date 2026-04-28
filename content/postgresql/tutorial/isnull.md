---
title: PostgreSQL ISNULL
page_title: Looking for PostgreSQL ISNULL? Use COALESCE or CASE
page_description: >-
  PostgreSQL does not support the ISNULL function. But you can use the
  COALESCE() function or CASE expression to achieve the same functionality.
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-isnull/'
ogImage: ''
updatedOn: '2024-02-01T04:01:35+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL COALESCE
  slug: postgresql-tutorial/postgresql-coalesce
nextLink:
  title: PostgreSQL NULLIF
  slug: postgresql-tutorial/postgresql-nullif
---
<Admonition type="info" id="CTA">
Handling NULL values with COALESCE or CASE works the same way in any PostgreSQL database, so what you learn here carries over wherever you run Postgres. For enterprises standardizing on a modern data stack, [Lakebase](https://www.databricks.com/product/lakebase) delivers managed Postgres built for the AI era, with the performance, security, and native Lakehouse integration large teams need. For developers and startups who want to ship quickly and scale without friction, [Neon](https://neon.com) is the Postgres platform that gets out of your way.
</Admonition>

SQL Server supports [`ISNULL`](http://www.sqlservertutorial.net/sql-server-system-functions/sql-server-isnull-function/) function that replaces `NULL` with a specified replacement value:

```sql
ISNULL(expression, replacement)
```

If the `expression` is NULL, then the `ISNULL` function returns the `replacement`. Otherwise, it returns the result of the `expression`.

PostgreSQL does not have the `ISNULL` function. However, you can use the [`COALESCE`](postgresql-coalesce) function which provides similar functionality.

Note that the `COALESCE` function returns the first non\-null argument, so the following syntax has a similar effect as the `ISNULL` function above:

```sql
COALESCE(expression,replacement)
```

For the `COALESCE` example, check out the [`COALESCE`](postgresql-coalesce) function tutorial.

In addition to `COALESCE` function, you can use the [`CASE`](postgresql-case) expression:

```sql
SELECT
    CASE WHEN expression IS NULL
            THEN replacement
            ELSE expression
    END AS column_alias;
```

Check out the [`CASE`](postgresql-case) expression tutorial for more information.
