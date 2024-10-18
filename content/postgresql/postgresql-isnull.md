---
title: 'PostgreSQL ISNULL'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-isnull/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

SQL Server supports `ISNULL` function that replaces `NULL` with a specified replacement value:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ISNULL(expression, replacement)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If the `expression` is NULL, then the `ISNULL` function returns the `replacement`. Otherwise, it returns the result of the `expression`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL does not have the `ISNULL` function. However, you can use the `COALESCE` function which provides similar functionality.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that the `COALESCE` function returns the first non-null argument, so the following syntax has a similar effect as the `ISNULL` function above:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
COALESCE(expression,replacement)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For the `COALESCE` example, check out the `COALESCE` function tutorial.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In addition to `COALESCE` function, you can use the `CASE` expression:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    CASE WHEN expression IS NULL
            THEN replacement
            ELSE expression
    END AS column_alias;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Check out the `CASE` expression tutorial for more information.

<!-- /wp:paragraph -->
