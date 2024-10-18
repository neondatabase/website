---
title: 'PostgreSQL ISNULL'
redirectFrom: 
            - /docs/postgresql/postgresql-isnull
tableOfContents: true
---


SQL Server supports `ISNULL` function that replaces `NULL` with a specified replacement value:





```
ISNULL(expression, replacement)
```





If the `expression` is NULL, then the `ISNULL` function returns the `replacement`. Otherwise, it returns the result of the `expression`.





PostgreSQL does not have the `ISNULL` function. However, you can use the `COALESCE` function which provides similar functionality.





Note that the `COALESCE` function returns the first non-null argument, so the following syntax has a similar effect as the `ISNULL` function above:





```
COALESCE(expression,replacement)
```





For the `COALESCE` example, check out the `COALESCE` function tutorial.





In addition to `COALESCE` function, you can use the `CASE` expression:





```
SELECT
    CASE WHEN expression IS NULL
            THEN replacement
            ELSE expression
    END AS column_alias;
```





Check out the `CASE` expression tutorial for more information.


