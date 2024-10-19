---
title: 'PostgreSQL NATURAL JOIN'
redirectFrom:
  - /postgresql/postgresql-tutorial/postgresql-natural-join
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-city.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `NATURAL JOIN` to query data from two tables.

## Introduction to PostgreSQL NATURAL JOIN clause

A natural join is a [join](/postgresql/postgresql-joins) that creates an implicit join based on the same column names in the joined tables.

The following shows the syntax of the PostgreSQL NATURAL JOIN clause:

```sql
SELECT select_list
FROM table1
NATURAL [INNER, LEFT, RIGHT] JOIN table2;
```

In this syntax:

- First, specify columns from the tables from which you want to retrieve data in the `select_list` in the `SELECT` clause.
- Second, provide the main table (`table1`) from which you want to retrieve data.
- Third, specify the table (`table2`) that you want to join with the main table, in the `NATURAL JOIN` clause.

A natural join can be an [inner join](/postgresql/postgresql-inner-join), [left join](/postgresql/postgresql-tutorial/postgresql-left-join), or [right join](/postgresql/postgresql-tutorial/postgresql-right-join). If you do not specify an explicit join, PostgreSQL will use the `INNER JOIN` by default.

The convenience of the `NATURAL JOIN` is that it does not require you to specify the condition in the join clause because it uses an implicit condition based on the equality of the common columns.

The equivalent of the `NATURAL JOIN` clause will be like this:

```sql
SELECT select_list
FROM table1
[INNER, LEFT, RIGHT] JOIN table2
   ON table1.column_name = table2.column;
```

### Inner Join

The following statements are equivalent:

```sql
SELECT select_list
FROM table1
NATURAL INNER JOIN table2;
```

And

```sql
SELECT select_list
FROM table1
INNER JOIN table2 USING (column_name);
```

### Left Join

The following statements are equivalent:

```sql
SELECT select_list
FROM table1
NATURAL LEFT JOIN table2;
```

And

```sql
SELECT select_list
FROM table1
LEFT JOIN table2 USING (column_name);
```

### Right join

The following statements are equivalent:

```sql
SELECT select_list
FROM table1
NATURAL RIGHT JOIN table2;
```

And

```sql
SELECT select_list
FROM table1
RIGHT JOIN table2 USING (column_name);
```

## Setting up sample tables

The following statements create `categories` and `products` tables, and insert sample data for the demonstration:

```sql
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR (255) NOT NULL
);

CREATE TABLE products (
  product_id serial PRIMARY KEY,
  product_name VARCHAR (255) NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

INSERT INTO categories (category_name)
VALUES
  ('Smartphone'),
  ('Laptop'),
  ('Tablet'),
  ('VR')
RETURNING *;

INSERT INTO products (product_name, category_id)
VALUES
  ('iPhone', 1),
  ('Samsung Galaxy', 1),
  ('HP Elite', 2),
  ('Lenovo Thinkpad', 2),
  ('iPad', 3),
  ('Kindle Fire', 3)
RETURNING *;
```

The `products` table has the following data:

```
 product_id |  product_name   | category_id
------------+-----------------+-------------
          1 | iPhone          |           1
          2 | Samsung Galaxy  |           1
          3 | HP Elite        |           2
          4 | Lenovo Thinkpad |           2
          5 | iPad            |           3
          6 | Kindle Fire     |           3
(6 rows)
```

The `categories` table has the following data:

```
 category_id | category_name
-------------+---------------
           1 | Smartphone
           2 | Laptop
           3 | Tablet
           4 | VR
(4 rows)
```

## PostgreSQL NATURAL JOIN examples

Let's explore some examples of using the `NATURAL JOIN` statement.

### 1) Basic PostgreSQL NATURAL JOIN example

The following statement uses the `NATURAL JOIN` clause to join the `products` table with the `categories` table:

```sql
SELECT *
FROM products
NATURAL JOIN categories;
```

This statement performs an inner join using the `category_id` column.

Output:

```
 category_id | product_id |  product_name   | category_name
-------------+------------+-----------------+---------------
           1 |          1 | iPhone          | Smartphone
           1 |          2 | Samsung Galaxy  | Smartphone
           2 |          3 | HP Elite        | Laptop
           2 |          4 | Lenovo Thinkpad | Laptop
           3 |          5 | iPad            | Tablet
           3 |          6 | Kindle Fire     | Tablet
(6 rows)
```

The statement is equivalent to the following statement that uses the `INNER JOIN` clause:

```sql
SELECT *
FROM products
INNER JOIN categories USING (category_id);
```

### 2) Using PostgreSQL NATURAL JOIN to perform a LEFT JOIN

The following example uses the `NATURAL JOIN` clause to perform a `LEFT JOIN` without specifying the matching column:

```sql
SELECT *
FROM categories
NATURAL LEFT JOIN products;
```

Output:

```
 category_id | category_name | product_id |  product_name
-------------+---------------+------------+-----------------
           1 | Smartphone    |          1 | iPhone
           1 | Smartphone    |          2 | Samsung Galaxy
           2 | Laptop        |          3 | HP Elite
           2 | Laptop        |          4 | Lenovo Thinkpad
           3 | Tablet        |          5 | iPad
           3 | Tablet        |          6 | Kindle Fire
           4 | VR            |       null | null
(7 rows)
```

### 3) Example of using NATURAL JOIN that causes an unexpected result

In practice, you should avoid using the `NATURAL JOIN` whenever possible because sometimes it may cause an unexpected result.

Consider the following `city` and `country` tables from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial_data/wp-content-uploads-2019-05-city.png)

![](/postgresqltutorial_data/wp-content-uploads-2019-05-country.png)

Both tables have the same `country_id` column so you can use the `NATURAL JOIN` to join these tables as follows:

```sql
SELECT *
FROM city
NATURAL JOIN country;
```

The query returns an empty result set.

The reason is that both tables have another common column called `last_update`. When the `NATURAL JOIN` clause uses the `last_update` column, it does not find any matches.

## Summary

- Use the PostgreSQL `NATURAL JOIN` clause to query data from two or more tables that have common columns.
