---
title: "PostgreSQL RIGHT JOIN"
page_title: "PostgreSQL RIGHT JOIN"
page_description: "You will how to use PostgreSQL RIGHT JOIN to join two tables and return rows from the right table that may or may not have matching rows in the left table."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-right-join/"
ogImage: "/postgresqltutorial/PostgreSQL-Join-Right-Join.png"
updatedOn: "2024-01-18T03:45:01+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL LEFT JOIN"
  slug: "postgresql-tutorial/postgresql-left-join"
nextLink: 
  title: "PostgreSQL Self-Join"
  slug: "postgresql-tutorial/postgresql-self-join"
---




**Summary**: in this tutorial, you will how to use PostgreSQL `RIGHT JOIN` to join two tables and return rows from the right table that may or may not have matching rows in the left table.


## Introduction to PostgreSQL RIGHT JOIN clause

The `RIGHT JOIN` clause joins a right table with a left table and returns the rows from the right table that may or may not have matching rows in the left table.

The `RIGHT JOIN` can be useful when you want to find rows in the right table that do not have matching rows in the left table.

Here’s the basic syntax of the `RIGHT JOIN` clause:


```sqlsql
SELECT 
  select_list 
FROM 
  table1
RIGHT JOIN table2 
  ON table1.column_name = table2.column_name;
```
In this syntax:

* First, specify the columns from both tables in the `select_list` in the `SELECT` clause.
* Second, provide the left table (`table1`) from which you want to select data in the `FROM` clause.
* Third, specify the right table (`table2`) that you want to join with the left table in the `RIGHT JOIN` clause.
* Finally, define a condition for joining two tables (`table1.column_name = table2.column_name`), which indicates the `column_name` in each table should have matching rows.


### How the RIGHT JOIN works

The `RIGHT JOIN` starts retrieving data from the right table (`table2`).

For each row in the right table (`table2`), the `RIGHT JOIN` checks if the value in the `column_name` is equal to the value of the corresponding column in every row of the left table (`table1`).

When these values are equal, the `RIGHT JOIN` creates a new row that includes columns specified in the `select_list` and appends it to the result set.

If these values are not equal, the `RIGHT JOIN` generates a new row that includes columns specified in the `select_list`, populates the columns on the left with `NULL`, and appends the new row to the result set.

In other words, the `RIGHT JOIN` returns all rows from the right table whether or not they have corresponding rows in the left table.

The following Venn diagram illustrates how the `RIGHT JOIN` works:

![PostgreSQL Join - Right Join](/postgresqltutorial/PostgreSQL-Join-Right-Join.png)Note that the `RIGHT OUTER JOIN` is the same as `RIGHT JOIN`. The `OUTER` keyword is optional


### The USING syntax

When the columns for joining have the same name, you can use the `USING` syntax:


```sql
SELECT 
  select_list 
FROM 
  table1
RIGHT JOIN table2 USING (column_name);
```

## PostgreSQL RIGHT JOIN examples

We’ll use the `film` and `inventory` tables from the [sample database](../postgresql-getting-started/postgresql-sample-database).


### 1\) Basic PostgreSQL RIGHT JOIN examples

The following example uses the `RIGHT JOIN` clause to retrieve all rows from the film table that may or may not have corresponding rows in the inventory table:


```sql
SELECT 
  film.film_id, 
  film.title, 
  inventory.inventory_id 
FROM 
  inventory 
RIGHT JOIN film 
  ON film.film_id = inventory.film_id 
ORDER BY 
  film.title;
```
Output:


![PostgreSQL RIGHT JOIN example](/postgresqltutorial/PostgreSQL-RIGHT-JOIN-example.png)
You can rewrite the above query using table aliases:


```
SELECT 
  f.film_id, 
  f.title, 
  i.inventory_id 
FROM 
  inventory i
RIGHT JOIN film f
  ON f.film_id = i.film_id 
ORDER BY 
  f.title;
```
Since the film and inventory table has the film\_id column, you can use the USING syntax:


```sql
SELECT 
  f.film_id, 
  f.title, 
  i.inventory_id 
FROM 
  inventory i
RIGHT JOIN film f USING(film_id)
ORDER BY 
  f.title;
```

### 2\) PostgreSQL RIGHT JOIN with a WHERE clause

The following query uses a `RIGHT JOIN` clause with a `WHERE` clause to retrieve the films that have no inventory:


```sql
SELECT 
  f.film_id, 
  f.title, 
  i.inventory_id 
FROM 
  inventory i
RIGHT JOIN film f USING(film_id)
WHERE i.inventory_id IS NULL
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

* Use the PostgreSQL `RIGHT JOIN` clause to join a right table with a left table and return rows from the right table that may or may not have corresponding rows in the left table.
* The `RIGHT JOIN` is also known as `RIGHT OUTER JOIN`.

