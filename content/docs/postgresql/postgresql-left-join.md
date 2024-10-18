---
title: 'PostgreSQL LEFT JOIN'
redirectFrom: 
            - /docs/postgresql/postgresql-left-join
ogImage: ./img/wp-content-uploads-2018-12-PostgreSQL-Join-Left-Join.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LEFT JOIN` clause to select data from multiple tables.



## Introduction to PostgreSQL LEFT JOIN clause



The `LEFT JOIN` clause [joins](/docs/postgresql/postgresql-joins) a left table with the right table and returns the rows from the left table that may or may not have corresponding rows in the right table.



The `LEFT JOIN` can be useful for selecting rows from one table that do not have matching rows in another.



Here's the basic syntax of the `LEFT JOIN` clause:



```
SELECT
  select_list
FROM
  table1
LEFT JOIN table2
  ON table1.column_name = table2.column_name;
```



In this syntax:



- - First, specify the columns from both tables in the select list (`select_list`) of the `SELECT` clause.
- -
- - Second, specify the left table (`table1`) from which you want to select data in the `FROM` clause.
- -
- - Third, specify the right table (`table2`) you want to join using the `LEFT JOIN` keyword.
- -
- - Finally, define a condition for the join (`table1.column_name = table2.column_name`), which indicates the column (`column_name`) in each table should have matching values.
- 


### How the LEFT JOIN works



The `LEFT JOIN` clause starts selecting data from the left table (`table1`). For each row in the left table, it compares the value in the `column_name` with the value of the corresponding column from every row in the right table.



When these values are equal, the left join clause generates a new row including the columns that appear in the `select_list` and appends it to the result set.



If these values are not equal, the `LEFT JOIN` clause creates a new row that includes the columns specified in the `SELECT` clause. Additionally, it populates the columns that come from the right table with NULL.



Note that `LEFT JOIN` is also referred to as `LEFT OUTER JOIN`.



If the columns for joining two tables have the same name, you can use the `USING` syntax:



```
SELECT
  select_list
FROM
  table1
  LEFT JOIN table2 USING (column_name);
```



The following Venn diagram illustrates how the `LEFT JOIN` clause works:



![PostgreSQL Join - Left Join](./img/wp-content-uploads-2018-12-PostgreSQL-Join-Left-Join.png)



## PostgreSQL LEFT JOIN examples



Let's look at the following `film` and `inventory` tables from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).



![Film and Inventory tables](./img/wp-content-uploads-2013-05-film-and-inventory-tables.png)



Each row in the `film` table may correspond to zero or multiple rows in the `inventory` table.



Conversely, each row in the `inventory` table has one and only one row in the `film` table.



The linkage between the `film` and `inventory` tables is established through the `film_id` column.



### 1) Basic PostgreSQL LEFT JOIN examples



The following statement uses the `LEFT JOIN` clause to join `film` table with the `inventory` table:



```
SELECT
  film.film_id,
  film.title,
  inventory.inventory_id
FROM
  film
  LEFT JOIN inventory ON inventory.film_id = film.film_id
ORDER BY
  film.title;
```



![PostgreSQL LEFT JOIN example](./img/wp-content-uploads-2020-07-PostgreSQL-LEFT-JOIN-join-two-tables-example.png)



When a row from the `film` table does not have a matching row in the `inventory` table, the value of the `inventory_id` column of this row is `NULL`.



The following statement uses table aliases and `LEFT JOIN` clause to join the `film` and `inventory` tables:



```
SELECT
  f.film_id,
  f.title,
  i.inventory_id
FROM
  film f
  LEFT JOIN inventory i ON i.film_id = f.film_id
ORDER BY
  i.inventory_id;
```



Because the `film` and `inventory` tables share the same `film_id` column, you can use the `USING` syntax:



```
SELECT
  f.film_id,
  f.title,
  i.inventory_id
FROM
  film f
  LEFT JOIN inventory i USING (film_id)
ORDER BY
  i.inventory_id;
```



### 2) Using PostgreSQL LEFT JOIN with WHERE clause



The following uses the `LEFT JOIN` clause to join the `inventory` and `film` tables. It includes a `WHERE` clause that identifies the films that are not present in the inventory:



```
SELECT
  f.film_id,
  f.title,
  i.inventory_id
FROM
  film f
  LEFT JOIN inventory i USING (film_id)
WHERE
  i.film_id IS NULL
ORDER BY
  f.title;
```



Output:



```
 film_id |         title          | inventory_id
---------+------------------------+--------------
      14 | Alice Fantasia         |         null
      33 | Apollo Teen            |         null
      36 | Argonauts Town         |         null
      38 | Ark Ridgemont          |         null
      41 | Arsenic Independence   |         null
...
```



## Summary



- - Use the PostgreSQL `LEFT JOIN` clause to select rows from one table that may or may not have corresponding rows in other tables.
- 
