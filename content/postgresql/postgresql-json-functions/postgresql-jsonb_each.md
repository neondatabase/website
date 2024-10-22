---
title: "PostgreSQL jsonb_each() Function"
page_title: "PostgreSQL jsonb_each() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL jsonb_each() function to expand a JSON object into a set of key/value pairs."
prev_url: "https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_each/"
ogImage: ""
updatedOn: "2024-02-24T08:46:16+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL jsonb_array_elements_text() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_array_elements_text"
next_page: 
  title: "PostgreSQL jsonb_each_text() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_each_text"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_each()` function to expand a JSON object into a set of key/value pairs.


## Introduction to the PostgreSQL jsonb\_each() function

The `jsonb_each()` function allows you to expand a top\-level [JSON](../postgresql-tutorial/postgresql-json) object of a JSONB value into a set of key/value pairs. The keys are text and values are JSON values.

Here’s the syntax of the `jsonb_each()` function:


```sql
jsonb_each(json_object)
```
In this syntax:

* `json_object` is the JSON object that you want to expand the key/value pairs.

The function returns a set of records where each record consists of two fields key of type `text` and value of the `JSONB`.

If the `json_object` is not a JSON object, the function will issue an error. In case the `json_object` is null, the function returns an empty set.


## PostgreSQL jsonb\_each() function examples

Let’s explore some examples of using the `jsonb_each()` function.


### 1\) Basic PostgreSQL jsonb\_each() function example

The following example uses the `jsonb_each` function to expand the key/value pair of a JSON object:


```sql
SELECT 
  * 
FROM 
  jsonb_each(
    '{"name": "John", "age": 30, "city": "New York"}'
  );
```
Output:


```sql
 key  |   value
------+------------
 age  | 30
 city | "New York"
 name | "John"
(3 rows)
```
If you want to retrieve a particular key, you can filter the key in the `WHERE` clause.

For example, the following statement returns the name and age of the object:


```sql
SELECT 
  * 
FROM 
  jsonb_each(
    '{"name": "John", "age": 30, "city": "New York"}'
  ) 
WHERE 
  key in ('name', 'age');
```
Output:


```sql
 key  | value
------+--------
 age  | 30
 name | "John"
(2 rows)
```

### 2\) Using the jsonb\_each() function with table data

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `links`:


```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    href TEXT NOT NULL,
    attributes JSONB
);
```
In the `links` table, the `attributes` column has the type of `JSONB` that stores various attributes of a link.

Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `links` table:


```sql
INSERT INTO links (href, attributes) 
VALUES
    ('https://example.com', '{"rel": "stylesheet", "type": "text/css", "media": "screen"}'),
    ('https://example.org', '{"rel": "icon", "type": "image/x-icon"}'),
    ('https://example.net', '{"rel": "alternate", "type": "application/rss+xml", "title": "RSS Feed"}');
```
Third, expand the key/value pairs of the objects in `attributes` column into a set of key/value pairs using the `jsonb_each()` function:


```sql
SELECT
  href, 
  key, 
  value 
FROM
  links, 
  jsonb_each(attributes);
```
Output:


```sql
        href         |  key  |         value
---------------------+-------+-----------------------
 https://example.com | rel   | "stylesheet"
 https://example.com | type  | "text/css"
 https://example.com | media | "screen"
 https://example.org | rel   | "icon"
 https://example.org | type  | "image/x-icon"
 https://example.net | rel   | "alternate"
 https://example.net | type  | "application/rss+xml"
 https://example.net | title | "RSS Feed"
(8 rows)
```

## Summary

* Use the `jsonb_each()` function to expand a JSON object into a set of key/value pairs.

