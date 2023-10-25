<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                          Chapter 7. Queries                          |                                            |                           |                                                       |                                                |
| :------------------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](dml-returning.html "6.4. Returning Data from Modified Rows")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](queries-overview.html "7.1. Overview") |

***

## Chapter 7. Queries

**Table of Contents**

  * *   [7.1. Overview](queries-overview.html)
  * [7.2. Table Expressions](queries-table-expressions.html)

    <!---->

  * *   [7.2.1. The `FROM` Clause](queries-table-expressions.html#QUERIES-FROM)
    * [7.2.2. The `WHERE` Clause](queries-table-expressions.html#QUERIES-WHERE)
    * [7.2.3. The `GROUP BY` and `HAVING` Clauses](queries-table-expressions.html#QUERIES-GROUP)
    * [7.2.4. `GROUPING SETS`, `CUBE`, and `ROLLUP`](queries-table-expressions.html#QUERIES-GROUPING-SETS)
    * [7.2.5. Window Function Processing](queries-table-expressions.html#QUERIES-WINDOW)

* [7.3. Select Lists](queries-select-lists.html)

  * *   [7.3.1. Select-List Items](queries-select-lists.html#QUERIES-SELECT-LIST-ITEMS)
    * [7.3.2. Column Labels](queries-select-lists.html#QUERIES-COLUMN-LABELS)
    * [7.3.3. `DISTINCT`](queries-select-lists.html#QUERIES-DISTINCT)

  * *   [7.4. Combining Queries (`UNION`, `INTERSECT`, `EXCEPT`)](queries-union.html)
  * [7.5. Sorting Rows (`ORDER BY`)](queries-order.html)
  * [7.6. `LIMIT` and `OFFSET`](queries-limit.html)
  * [7.7. `VALUES` Lists](queries-values.html)
  * [7.8. `WITH` Queries (Common Table Expressions)](queries-with.html)

    <!---->

  * *   [7.8.1. `SELECT` in `WITH`](queries-with.html#QUERIES-WITH-SELECT)
    * [7.8.2. Recursive Queries](queries-with.html#QUERIES-WITH-RECURSIVE)
    * [7.8.3. Common Table Expression Materialization](queries-with.html#QUERIES-WITH-CTE-MATERIALIZATION)
    * [7.8.4. Data-Modifying Statements in `WITH`](queries-with.html#QUERIES-WITH-MODIFYING)

The previous chapters explained how to create tables, how to fill them with data, and how to manipulate that data. Now we finally discuss how to retrieve the data from the database.

***

|                                                                      |                                                       |                                                |
| :------------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](dml-returning.html "6.4. Returning Data from Modified Rows")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](queries-overview.html "7.1. Overview") |
| 6.4. Returning Data from Modified Rows                               | [Home](index.html "PostgreSQL 17devel Documentation") |                                  7.1. Overview |
