---
title: PostgreSQL ISNULL
page_title: Looking for PostgreSQL ISNULL? Use COALESCE or CASE
page_description: >-
  PostgreSQL does not support the ISNULL function. But you can use the
  COALESCE() function or CASE expression to achieve the same functionality.
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-isnull/'
ogImage: ''
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL COALESCE
  slug: postgresql-tutorial/postgresql-coalesce
nextLink:
  title: PostgreSQL NULLIF
  slug: postgresql-tutorial/postgresql-nullif
---

<Admonition type="info" id="CTA">
Handling NULL values with COALESCE or CASE works the same way in any PostgreSQL database. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
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
