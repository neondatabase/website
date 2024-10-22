---
title: "PostgreSQL CREATE VIEW"
page_title: "PosgreSQL CREATE VIEW"
page_description: "This tutorial shows you how to use the CREATE VIEW statement to create a new view in your database."
prev_url: "https://www.postgresqltutorial.com/postgresql-views/managing-postgresql-views/"
ogImage: "/postgresqltutorial/customer.png"
updatedOn: "2024-03-16T04:07:27+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Views"
  slug: "postgresql-views/"
next_page: 
  title: "PostgreSQL Drop View"
  slug: "postgresql-views/postgresql-drop-view"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE VIEW` statement to create a new view in your database.


## PostgreSQL CREATE VIEW statement

In PostgreSQL, a view is a named query stored in the database server. To create a new view, you can use the `CREATE VIEW` statement.

Here’s the basic syntax of the `CREATE VIEW` statement:


```phpsql
CREATE VIEW view_name 
AS 
  query;
```
In this syntax:

* First, specify the name of the view after the `CREATE VIEW` keywords.
* Second, specify a `SELECT` statement (`query`) that defines the view. The query is often referred to as the **defining query** of the view.


## PostgreSQL CREATE VIEW statement examples

Let’s take some examples of using the `CREATE VIEW` statement.

We’ll use the `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial/customer.png)
### 1\) Basic CREATE VIEW statement example

The following example uses the `CREATE VIEW` statement to create a view based on the `customer` table:


```sql
CREATE VIEW contact AS 
SELECT 
  first_name, 
  last_name, 
  email 
FROM 
  customer;
```
Output:


```sql
CREATE VIEW
```
The following query data from the `contact` view:


```
SELECT * FROM contact;
```
Output:


```sql
 first_name  |  last_name   |                  email
-------------+--------------+------------------------------------------
 Jared       | Ely          | [[email protected]](../cdn-cgi/l/email-protection.html)
 Mary        | Smith        | [[email protected]](../cdn-cgi/l/email-protection.html)
 Patricia    | Johnson      | [[email protected]](../cdn-cgi/l/email-protection.html)
...
```

### 2\) Using the CREATE VIEW statement to create a view based on a complex query

The following example creates a view based on the tables `customer`, `address`, `city`, and `country`:


```
CREATE VIEW customer_info AS 
SELECT 
  first_name, 
  last_name, 
  email, 
  phone, 
  city, 
  postal_code,
  country
FROM 
  customer 
  INNER JOIN address USING (address_id) 
  INNER JOIN city USING (city_id) 
  INNER JOIN country USING (country_id);
```
The following query retrieves data from the `customer_info` view:


```sql
SELECT * FROM customer_info;
```
Output:


```
 first_name  |  last_name   |                  email                   |    phone     |            city            | postal_code |                country
-------------+--------------+------------------------------------------+--------------+----------------------------+-------------+---------------------------------------
 Jared       | Ely          | [[email protected]](../cdn-cgi/l/email-protection.html)             | 35533115997  | Purwakarta                 | 25972       | Indonesia
 Mary        | Smith        | [[email protected]](../cdn-cgi/l/email-protection.html)            | 28303384290  | Sasebo                     | 35200       | Japan
 Patricia    | Johnson      | [[email protected]](../cdn-cgi/l/email-protection.html)      | 838635286649 | San Bernardino             | 17886       | United States
...
```

### 3\) Creating a view based on another view

The following statement creates a view called `customer_usa` based on the `customer_info` view. The `customer_usa` returns the customers who are in the `United States`:


```
CREATE VIEW customer_usa 
AS 
SELECT 
  * 
FROM 
  customer_info 
WHERE 
  country = 'United States';
```
Here’s the query that retrieves data from the customer\_usa view:


```sql
SELECT * FROM customer_usa;
```
Output:


```
 first_name | last_name  |                email                 |    phone     |          city           | postal_code |    country
------------+------------+--------------------------------------+--------------+-------------------------+-------------+---------------
 Zachary    | Hite       | [[email protected]](../cdn-cgi/l/email-protection.html)      | 191958435142 | Akron                   | 88749       | United States
 Richard    | Mccrary    | [[email protected]](../cdn-cgi/l/email-protection.html)   | 262088367001 | Arlington               | 42141       | United States
 Diana      | Alexander  | [[email protected]](../cdn-cgi/l/email-protection.html)   | 6171054059   | Augusta-Richmond County | 30695       | United States
...
```

## Replacing a view

To change the defining query of a view, you use the `CREATE OR REPLACE VIEW` statement:


```
CREATE OR REPLACE VIEW view_name 
AS 
  query;
```
In this syntax, you add the `OR REPLACE` between the `CREATE` and `VIEW` keywords. If the view already exists, the statement replaces the existing view; otherwise, it creates a new view.

For example, the following statement changes the defining query of the `contact` view to include the `phone` information from the `address` table:


```sql
CREATE OR REPLACE VIEW contact AS 
SELECT 
  first_name, 
  last_name, 
  email,
  phone
FROM 
  customer
INNER JOIN address USING (address_id);
```

## Display a view on psql

To display a view on `psql`, you follow these steps:

First, open the Command Prompt on Windows or Terminal on Unix\-like systems and connect to the PostgreSQL server:


```
psql -U postgres
```
Second, change the current database to `dvdrental`:


```
\c dvdrental
```
Third, display the view information using the `\d+ view_name` command. For example, the following shows the `contact` view:


```
\d+ contact
```
Output:


```
                                    View "public.contact"
   Column   |         Type          | Collation | Nullable | Default | Storage  | Description
------------+-----------------------+-----------+----------+---------+----------+-------------
 first_name | character varying(45) |           |          |         | extended |
 last_name  | character varying(45) |           |          |         | extended |
 email      | character varying(50) |           |          |         | extended |
 phone      | character varying(20) |           |          |         | extended |
View definition:
 SELECT customer.first_name,
    customer.last_name,
    customer.email,
    address.phone
   FROM customer
     JOIN address USING (address_id);

```

## Summary

* Use the PostgreSQL `CREATE VIEW` statement to create a new view in your database.
* Use the `\d+` command in psql to display the information of a view.

