---
title: "PostgreSQL LOWER() Function"
page_title: "PostgreSQL LOWER() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL LOWER() function to convert the string to all lower case."
prev_url: "https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-lower/"
ogImage: "/postgresqltutorial/customer.png"
updatedOn: "2024-01-28T09:51:45+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL LTRIM() Function"
  slug: "postgresql-string-functions/postgresql-ltrim"
nextLink: 
  title: "PostgreSQL UPPER() Function"
  slug: "postgresql-string-functions/postgresql-upper"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOWER()` function to convert the string to all lowercase.


## Introduction to the PostgreSQL LOWER() function

The `LOWER()` function converts a string to lowercase based on the rules of the database’s locale.

Here’s the syntax of the `LOWER()` function:


```sql
LOWER(text)
```
In this syntax, text is the input string that you want to convert. Its type can be `CHAR`, [`VARCHAR`](../postgresql-tutorial/postgresql-char-varchar-text), or `TEXT`.

The `LOWER()` function returns a new string with all letters converted to lowercase.

If the text is `NULL`, the `LOWER()` function returns `NULL`.


## PostgreSQL LOWER() function examples

Let’s explore some examples of using the `LOWER()` function.


### 1\) Basic PostgreSQL LOWER() function example

The following example uses the `LOWER()` function to convert the string PostgreSQL to lowercase:


```sql
SELECT LOWER('PostgreSQL');
```
Output:


```sql
   lower
------------
 postgresql
(1 row)
```

### 2\) Using PostgreSQL LOWER() function with table data

We’ll use the `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![PostgreSQL LOWER() Function - Sample Table ](/postgresqltutorial/customer.png)The following example uses the `LOWER()` function to convert the first names of customers to lowercase:


```sql
SELECT 
  LOWER(first_name) 
FROM 
  customer 
ORDER BY 
  first_name;
```
Output:


```sql
    lower
-------------
 aaron
 adam
 adrian
 agnes
 alan
...
```

### 3\) Using PostgreSQL LOWER() function in the WHERE clause

The following example uses the `LOWER()` function in the [`WHERE`](../postgresql-tutorial/postgresql-where) clause to find customers by last names, comparing them with the input string in lowercase:


```sql
SELECT 
  first_name, 
  last_name 
FROM 
  customer 
WHERE 
  LOWER(last_name) = 'barnett';
```
Output:


```sql
 first_name | last_name
------------+-----------
 Carole     | Barnett
(1 row)
```

## Summary

* Use the `LOWER()` function to return a new string with all the characters of the input string converted to lowercase.

