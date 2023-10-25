<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               6.3. Deleting Data              |                                               |                              |                                                       |                                                                      |
| :-------------------------------------------: | :-------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](dml-update.html "6.2. Updating Data")  | [Up](dml.html "Chapter 6. Data Manipulation") | Chapter 6. Data Manipulation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](dml-returning.html "6.4. Returning Data from Modified Rows") |

***

## 6.3. Deleting Data [#](#DML-DELETE)

So far we have explained how to add data to tables and how to change data. What remains is to discuss how to remove data that is no longer needed. Just as adding data is only possible in whole rows, you can only remove entire rows from a table. In the previous section we explained that SQL does not provide a way to directly address individual rows. Therefore, removing rows can only be done by specifying conditions that the rows to be removed have to match. If you have a primary key in the table then you can specify the exact row. But you can also remove groups of rows matching a condition, or you can remove all rows in the table at once.

You use the [DELETE](sql-delete.html "DELETE") command to remove rows; the syntax is very similar to the [UPDATE](sql-update.html "UPDATE") command. For instance, to remove all rows from the products table that have a price of 10, use:

```

DELETE FROM products WHERE price = 10;
```

If you simply write:

```

DELETE FROM products;
```

then all rows in the table will be deleted! Caveat programmer.

***

|                                               |                                                       |                                                                      |
| :-------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](dml-update.html "6.2. Updating Data")  |     [Up](dml.html "Chapter 6. Data Manipulation")     |  [Next](dml-returning.html "6.4. Returning Data from Modified Rows") |
| 6.2. Updating Data                            | [Home](index.html "PostgreSQL 17devel Documentation") |                               6.4. Returning Data from Modified Rows |
