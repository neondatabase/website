---
title: "PostgreSQL CREATE TABLE AS"
page_title: "PostgreSQL CREATE TABLE AS Statement By Examples"
page_description: "In this tutorial, you will learn how to use the PostgreSQL CREATE TABLE AS statement to create a new table from the result set of a query."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table-as/"
ogImage: "/postgresqltutorial/film_and_film_category_tables.png"
updatedOn: "2024-02-13T13:42:10+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL SELECT INTO"
  slug: "postgresql-tutorial/postgresql-select-into"
nextLink: 
  title: "Using PostgreSQL SERIAL to Create Auto-increment Column"
  slug: "postgresql-tutorial/postgresql-serial"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE TABLE AS` statement to create a new table from the result set of a query.


## Introduction to the PostgreSQL CREATE TABLE statement

The `CREATE TABLE AS` statement [creates a new table](postgresql-create-table) and fills it with the data returned by a query. The following shows the syntax of the `CREATE TABLE AS` statement:


```sql
CREATE TABLE new_table_name
AS query;
```
In this syntax:

1. First, specify the new table name after the `CREATE TABLE` clause.
2. Second, provide a query whose result set is added to the new table after the `AS` keyword.

The `TEMPORARY` or `TEMP` keyword allows you to create a [temporary table](postgresql-temporary-table):


```sql
CREATE TEMP TABLE new_table_name 
AS query; 
```
The `UNLOGGED` keyword allows the new table to be created as an unlogged table:


```sql
CREATE UNLOGGED TABLE new_table_name
AS query;
```
The columns of the new table will have the names and data types associated with the output columns of the `SELECT` clause.

If you want the table columns to have different names, you can specify the new table columns after the new table name:


```sql
CREATE TABLE new_table_name ( column_name_list)
AS query;
```
If you want to avoid an error by creating a new table that already exists, you can use the `IF NOT EXISTS` option as follows:


```sql
CREATE TABLE IF NOT EXISTS new_table_name
AS query;
```

## PostgreSQL CREATE TABLE AS statement examples

We will use the `film` and `film_category` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration.

![film_and_film_category_tables](/postgresqltutorial/film_and_film_category_tables.png)The following example uses the CREATE TABLE AS statement to create a new table that contains the films whose category is 1:


```sql
CREATE TABLE action_film 
AS
SELECT
    film_id,
    title,
    release_year,
    length,
    rating
FROM
    film
INNER JOIN film_category USING (film_id)
WHERE
    category_id = 1;
```
To verify the table creation, you can query data from the `action_film` table:


```sql
SELECT * FROM action_film
ORDER BY title;
```

![PostgreSQL CREATE TABLE AS data verification](/postgresqltutorial/PostgreSQL-CREATE-TABLE-AS-data-verification.png)
To check the structure of the `action_film`, you can use the following command in the psql tool:


```sql
\d action_film;
```
It returns the following output:


![PostgreSQL CREATE TABLE AS example](/postgresqltutorial/PostgreSQL-CREATE-TABLE-AS-example.png)
As clearly shown in the output, the names and data types of the `action_film` table are derived from the columns of the `SELECT` clause.

If the `SELECT` clause contains expressions, it is a good practice to override the columns, for example:


```sql
CREATE TABLE IF NOT EXISTS film_rating (rating, film_count) 
AS 
SELECT
    rating,
    COUNT (film_id)
FROM
    film
GROUP BY
    rating;
```
This example statement created a new table `film_rating` and filled it with the summary data from the `film` table. It explicitly specified the column names for the new table instead of using the column names from the `SELECT` clause.

To check the structure of the `film_rating` table, you use the following command in psql tool:


```sql
\d film_rating
```
The following is the output:


![PostgreSQL CREATE TABLE AS with explicit column names](/postgresqltutorial/PostgreSQL-CREATE-TABLE-AS-with-explicit-column-names.png)
Note that the `CREATE TABLE AS` statement is similar to the [`SELECT INTO`](postgresql-select-into) statement, but the `CREATE TABLE AS` statement is preferred because it is not confused with other uses of the `SELECT INTO` syntax in [PL/pgSQL](../postgresql-plpgsql). In addition, the `CREATE TABLE AS` statement provides a superset of the functionality offered by the `SELECT INTO` statement.


## Summary

* Use the PostgreSQL `CREATE TABLE AS` statement to create a new table from the result of a query.

