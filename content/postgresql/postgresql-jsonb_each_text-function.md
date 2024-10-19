---
prevPost: /postgresql/postgresql-row-level-security
nextPost: /postgresql/postgresql-isfinite-function
createdAt: 2024-02-24T08:55:25.000Z
title: 'PostgreSQL jsonb_each_text() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_each_text 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_each_text
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_each_text()` function to expand a JSON object into a set of key/value pairs of type text.

## Introduction to the PostgreSQL jsonb_each_text() function

The `jsonb_each_text()` function allows you to expand a top-level [JSON](/postgresql/postgresql-json) object into a set of keyvalue pairs. Both keys and values are text strings.

The following shows the basic syntax of the `jsonb_each_text()` function:

```
jsonb_each_text(json_object)
```

In this syntax:

- `json_object` is the JSON object that you want to expand the key/value pairs.

The function returns a set of records where each record consists of two fields key and value, both have the type `text`.

If the `json_object` is null, the function returns an empty set. in case the `json_object` is not a JSON object, the function will issue an error.

## PostgreSQL jsonb_each_text() function examples

Let's take some examples of using the `jsonb_each_text()` function.

### 1) Basic PostgreSQL jsonb_each_text() function example

The following example uses the `jsonb_each_text` function to expand the key/value pair of a JSON object:

```sql
SELECT
  *
FROM
  jsonb_each_text(
    '{"name": "Jane", "age": 22, "city": "San Francisco"}'
  );
```

Output:

```
 key  |     value
------+---------------
 age  | 22
 city | San Francisco
 name | Jane
(3 rows)
```

Notice that all values in the value column are text strings including the value 22.

To retrieve a particular key/value pair, you can filter keys in the `WHERE` clause. For example, the following statement returns the name and city of the object:

```sql
SELECT
  *
FROM
  jsonb_each_text(
    '{"name": "Jane", "age": 22, "city": "San Francisco"}'
  )
WHERE key IN ('name','city');
```

Output:

```
 key  |     value
------+---------------
 city | San Francisco
 name | Jane
(2 rows)
```

### 2) Using the jsonb_each_text() function with table data

First, [create a new table](/postgresql/postgresql-create-table) called `links`:

```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    href TEXT NOT NULL,
    attributes JSONB
);
```

In the `links` table, the `attributes` column has the type of `JSONB` that stores various attributes of a link.

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `links` table:

```sql
INSERT INTO links (href, attributes)
VALUES
    ('https://example.com', '{"rel": "stylesheet", "type": "text/css", "media": "screen"}'),
    ('https://example.org', '{"rel": "icon", "type": "image/x-icon"}'),
    ('https://example.net', '{"rel": "alternate", "type": "application/rss+xml", "title": "RSS Feed"}');
```

Third, expand the key/value pairs of the objects in `attributes` column into a set of key/value pairs using the `jsonb_each_text()` function:

```sql
SELECT
  href,
  key,
  value
FROM
  links,
  jsonb_each_text(attributes);
```

Output:

```
        href         |  key  |        value
---------------------+-------+---------------------
 https://example.com | rel   | stylesheet
 https://example.com | type  | text/css
 https://example.com | media | screen
 https://example.org | rel   | icon
 https://example.org | type  | image/x-icon
 https://example.net | rel   | alternate
 https://example.net | type  | application/rss+xml
 https://example.net | title | RSS Feed
(8 rows)
```

## Summary

- Use the `jsonb_each_text()` function to expand a JSON object into a set of key/value pairs of type `text`.
