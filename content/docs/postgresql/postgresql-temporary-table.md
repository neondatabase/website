---
title: 'PostgreSQL Temporary Table'
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-02-PostgreSQL-Temporary-Table-300x254.png
tableOfContents: true
---


![PostgreSQL Temporary Table](/postgresqltutorial_data/wp-content-uploads-2017-02-PostgreSQL-Temporary-Table-300x254.png)





**Summary**: in this tutorial, you will learn about the PostgreSQL temporary table and how to manage it effectively.





## Introduction to the PostgreSQL temporary tables





In PostgreSQL, a temporary table is a table that exists only during a database session. It is created and used within a single database session and is automatically dropped at the end of the session.





### Creating a temporary table





To create a temporary table, you use the `CREATE TEMPORARY TABLE` statement:





```
CREATE TEMPORARY TABLE table_name(
   column1 datatype(size) constraint,
   column1 datatype(size) constraint,
   ...,
   table_constraints
);
```





In this syntax:





- First, specify the name of the temporary table that you want to create after the `CREATE TEMPORARY TABLE` keywords.
-
- Second, define a list of columns for the table.





The `TEMP` and `TEMPORARY` keywords are equivalent so you can use them interchangeably:





```
CREATE TEMP TABLE table_name(
   ...
);
```





The following example uses the `CREATE TEMP TABLE` to create a new temporary table `mytemp`:





```
CREATE TEMP TABLE mytemp(id INT);

INSERT INTO mytemp(id) VALUES(1), (2), (3)
RETURNING *;
```





Output:





```
 id
----
  1
  2
  3
(3 rows)
```





If you open a second database session and query data from the `mytemp` table, you'll get an error





```
SELECT * FROM mytemp;
```





Error:





```
ERROR:  relation "mytemp" does not exist
LINE 1: SELECT * FROM mytemp;
```





The output indicates that the second session could not see the `mytemp` table.





If you terminate the current database session and attempt to query data from the `mytemp` table, you'll encounter an error. This is because the temporary table was dropped when the session that created it ended.





### PostgreSQL temporary table names





A temporary table can have the same name as a permanent table, even though it is not recommended.





When you create a temporary table that shares the same name as a permanent table, you cannot access the permanent table until the temporary table is removed. Consider the following example:





First, [create a table](/docs/postgresql/postgresql-create-table) named `customers`:





```
CREATE TABLE customers(
   id SERIAL PRIMARY KEY,
   name VARCHAR NOT NULL
);
```





Second, create a temporary table with the same name: `customers`





```
CREATE TEMP TABLE customers(
    customer_id INT
);
```





Now, query data from the `customers` table:





```
SELECT * FROM customers;
```





Output:





```
 customer_id
-------------
(0 rows)
```





This time PostgreSQL accessed the temporary table `customers` instead of the permanent one.





Note that PostgreSQL creates temporary tables in a special [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/), therefore, you cannot specify the schema in the `CREATE TEMP TABLE` statement.





If you [list the tables](https://www.postgresqltutorial.com/postgresql-administration/postgresql-show-tables/) in psql, you will see the temporary table `customers` only, not the permanent one:





```
\dt+
```





Output:





```
  Schema   |   Name    | Type  |  Owner   | Persistence | Access method |    Size    | Description
-----------+-----------+-------+----------+-------------+---------------+------------+-------------
 pg_temp_3 | customers | table | postgres | temporary   | heap          | 0 bytes    |
 pg_temp_3 | mytemp    | table | postgres | temporary   | heap          | 8192 bytes |
(2 rows)
```





The output shows the schema of the `customers` temporary table is `pg_temp_3`.





In this case, access to the permanent table requires qualifying the table name with its schema. For example:





```
SELECT * FROM public.customers;
```





### Removing a PostgreSQL temporary table





To drop a temporary table, you use the [`DROP TABLE`](/docs/postgresql/postgresql-drop-table) statement. The following statement uses the `DROP TABLE` statement to drop a temporary table:





```
DROP TABLE temp_table_name;
```





Unlike the `CREATE TABLE` statement, the `DROP TABLE` statement does not have the `TEMP` or `TEMPORARY` keyword created specifically for temporary tables.





For example, the following statement drops the temporary table `customers` that we have created in the above example:





```
DROP TABLE customers;
```





## When to use temporary tables





**Isolation of data**: Since the temporary tables are session-specific, different sessions or transactions can use the same table name for temporary tables without causing a conflict. This allows you to isolate data for a specific task or session.





**Intermediate storage**: Temporary tables can be useful for storing the intermediate results of a complex query. For example, you can break down a complex query into multiple simple ones and use temporary tables as the intermediate storage for storing the partial results.





**Transaction scope**: Temporary tables can be also useful if you want to store intermediate results within a transaction. In this case, the temporary tables will be visible only to that transaction





## Summary





- A temporary table is a short-lived table that exists during a database session or a transaction.
-
- Use `the CREATE TEMP TABLE` statement to create a temporary table.
-
- Use the `DROP TABLE` statement to drop a temporary table.


