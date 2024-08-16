[#id](#QUERIES)

## Chapter 7. Queries

**Table of Contents**

- [7.1. Overview](queries-overview)
- [7.2. Table Expressions](queries-table-expressions)

  - [7.2.1. The `FROM` Clause](queries-table-expressions#QUERIES-FROM)
  - [7.2.2. The `WHERE` Clause](queries-table-expressions#QUERIES-WHERE)
  - [7.2.3. The `GROUP BY` and `HAVING` Clauses](queries-table-expressions#QUERIES-GROUP)
  - [7.2.4. `GROUPING SETS`, `CUBE`, and `ROLLUP`](queries-table-expressions#QUERIES-GROUPING-SETS)
  - [7.2.5. Window Function Processing](queries-table-expressions#QUERIES-WINDOW)

- [7.3. Select Lists](queries-select-lists)

  - [7.3.1. Select-List Items](queries-select-lists#QUERIES-SELECT-LIST-ITEMS)
  - [7.3.2. Column Labels](queries-select-lists#QUERIES-COLUMN-LABELS)
  - [7.3.3. `DISTINCT`](queries-select-lists#QUERIES-DISTINCT)

  - [7.4. Combining Queries (`UNION`, `INTERSECT`, `EXCEPT`)](queries-union)
  - [7.5. Sorting Rows (`ORDER BY`)](queries-order)
  - [7.6. `LIMIT` and `OFFSET`](queries-limit)
  - [7.7. `VALUES` Lists](queries-values)
  - [7.8. `WITH` Queries (Common Table Expressions)](queries-with)

    - [7.8.1. `SELECT` in `WITH`](queries-with#QUERIES-WITH-SELECT)
    - [7.8.2. Recursive Queries](queries-with#QUERIES-WITH-RECURSIVE)
    - [7.8.3. Common Table Expression Materialization](queries-with#QUERIES-WITH-CTE-MATERIALIZATION)
    - [7.8.4. Data-Modifying Statements in `WITH`](queries-with#QUERIES-WITH-MODIFYING)

The previous chapters explained how to create tables, how to fill them with data, and how to manipulate that data. Now we finally discuss how to retrieve the data from the database.
