<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

| 7.4. Combining Queries (`UNION`, `INTERSECT`, `EXCEPT`) |                                         |                    |                                                       |                                                            |
| :-----------------------------------------------------: | :-------------------------------------- | :----------------: | ----------------------------------------------------: | ---------------------------------------------------------: |
|  [Prev](queries-select-lists.html "7.3. Select Lists")  | [Up](queries.html "Chapter 7. Queries") | Chapter 7. Queries | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](queries-order.html "7.5. Sorting Rows (ORDER BY)") |

***

## 7.4. Combining Queries (`UNION`, `INTERSECT`, `EXCEPT`) [#](#QUERIES-UNION)

[]()[]()[]()[]()[]()[]()[]()

The results of two queries can be combined using the set operations union, intersection, and difference. The syntax is

    query1 UNION [ALL] query2
    query1 INTERSECT [ALL] query2
    query1 EXCEPT [ALL] query2

where *`query1`* and *`query2`* are queries that can use any of the features discussed up to this point.

`UNION` effectively appends the result of *`query2`* to the result of *`query1`* (although there is no guarantee that this is the order in which the rows are actually returned). Furthermore, it eliminates duplicate rows from its result, in the same way as `DISTINCT`, unless `UNION ALL` is used.

`INTERSECT` returns all rows that are both in the result of *`query1`* and in the result of *`query2`*. Duplicate rows are eliminated unless `INTERSECT ALL` is used.

`EXCEPT` returns all rows that are in the result of *`query1`* but not in the result of *`query2`*. (This is sometimes called the *difference* between two queries.) Again, duplicates are eliminated unless `EXCEPT ALL` is used.

In order to calculate the union, intersection, or difference of two queries, the two queries must be “union compatible”, which means that they return the same number of columns and the corresponding columns have compatible data types, as described in [Section 10.5](typeconv-union-case.html "10.5. UNION, CASE, and Related Constructs").

Set operations can be combined, for example

    query1 UNION query2 EXCEPT query3

which is equivalent to

    (query1 UNION query2) EXCEPT query3

As shown here, you can use parentheses to control the order of evaluation. Without parentheses, `UNION` and `EXCEPT` associate left-to-right, but `INTERSECT` binds more tightly than those two operators. Thus

    query1 UNION query2 INTERSECT query3

means

    query1 UNION (query2 INTERSECT query3)

You can also surround an individual *`query`* with parentheses. This is important if the *`query`* needs to use any of the clauses discussed in following sections, such as `LIMIT`. Without parentheses, you'll get a syntax error, or else the clause will be understood as applying to the output of the set operation rather than one of its inputs. For example,

    SELECT a FROM b UNION SELECT x FROM y LIMIT 10

is accepted, but it means

    (SELECT a FROM b UNION SELECT x FROM y) LIMIT 10

not

    SELECT a FROM b UNION (SELECT x FROM y LIMIT 10)

***

|                                                        |                                                       |                                                            |
| :----------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](queries-select-lists.html "7.3. Select Lists")  |        [Up](queries.html "Chapter 7. Queries")        |  [Next](queries-order.html "7.5. Sorting Rows (ORDER BY)") |
| 7.3. Select Lists                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                             7.5. Sorting Rows (`ORDER BY`) |
