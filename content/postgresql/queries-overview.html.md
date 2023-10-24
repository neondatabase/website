<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                7.1. Overview               |                                         |                    |                                                       |                                                                  |
| :----------------------------------------: | :-------------------------------------- | :----------------: | ----------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](queries.html "Chapter 7. Queries")  | [Up](queries.html "Chapter 7. Queries") | Chapter 7. Queries | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](queries-table-expressions.html "7.2. Table Expressions") |

***

## 7.1. Overview [#](#QUERIES-OVERVIEW)

The process of retrieving or the command to retrieve data from a database is called a *query*. In SQL the [`SELECT`](sql-select.html "SELECT") command is used to specify queries. The general syntax of the `SELECT` command is

    [WITH with_queries] SELECT select_list FROM table_expression [sort_specification]

The following sections describe the details of the select list, the table expression, and the sort specification. `WITH` queries are treated last since they are an advanced feature.

A simple kind of query has the form:

    SELECT * FROM table1;

Assuming that there is a table called `table1`, this command would retrieve all rows and all user-defined columns from `table1`. (The method of retrieval depends on the client application. For example, the psql program will display an ASCII-art table on the screen, while client libraries will offer functions to extract individual values from the query result.) The select list specification `*` means all columns that the table expression happens to provide. A select list can also select a subset of the available columns or make calculations using the columns. For example, if `table1` has columns named `a`, `b`, and `c` (and perhaps others) you can make the following query:

    SELECT a, b + c FROM table1;

(assuming that `b` and `c` are of a numerical data type). See [Section 7.3](queries-select-lists.html "7.3. Select Lists") for more details.

`FROM table1` is a simple kind of table expression: it reads just one table. In general, table expressions can be complex constructs of base tables, joins, and subqueries. But you can also omit the table expression entirely and use the `SELECT` command as a calculator:

    SELECT 3 * 4;

This is more useful if the expressions in the select list return varying results. For example, you could call a function this way:

    SELECT random();

***

|                                            |                                                       |                                                                  |
| :----------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](queries.html "Chapter 7. Queries")  |        [Up](queries.html "Chapter 7. Queries")        |  [Next](queries-table-expressions.html "7.2. Table Expressions") |
| Chapter 7. Queries                         | [Home](index.html "PostgreSQL 17devel Documentation") |                                           7.2. Table Expressions |
