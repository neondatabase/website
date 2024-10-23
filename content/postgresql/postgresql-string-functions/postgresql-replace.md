---
title: 'PostgreSQL REPLACE() Function'
page_title: 'PostgreSQL REPLACE() Function'
page_description: 'This tutorial shows how to use the PostgreSQL REPLACE() function to replace all occurrences of a substring in a string with a new substring.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-replace/'
ogImage: ''
updatedOn: '2024-01-29T01:38:44+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL SPLIT_PART() Function'
  slug: 'postgresql-string-functions/postgresql-split_part'
nextLink:
  title: 'PostgreSQL REGEXP_REPLACE() Function'
  slug: 'postgresql-string-functions/regexp_replace'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REPLACE()` function to replace a substring with a new one.

## Introduction to PostgreSQL REPLACE() function

The `REPLACE()` function replaces all occurrences of a substring with a new one in a string.

Here’s the syntax of the PostgreSQL `REPLACE()` function:

```phpsqlsql
REPLACE(source, from_text, to_text);
```

The `REPLACE()` function accepts three arguments:

- `source`: This is an input string that you want to replace.
- `from_text`: This is the substring that you want to search and replace. If the `from_text` appears multiple times in the `source` string, the function will replace all the occurrences.
- `to_text`: This is the new substring that you want to replace the `from_text`.

## PostgreSQL REPLACE() function examples

Let’s explore some examples of using the `REPLACE()` function.

### 1\) Basic PostgreSQL REPLACE() function example

The following example uses the `REPLACE()` function to replace the string `'A'` in the string `'ABC AA'` with the string `'Z'`:

```sql
SELECT REPLACE ('ABC AA', 'A', 'Z');
```

Output:

```sql
 replace
---------
 ZBC ZZ
(1 row)
```

In this example, the `REPLACE()` function replaces all the characters `'A'` with the character `'Z'` in a string.

### 2\) Using the PostgreSQL REPLACE() function with table data

If you want to search and replace a substring in a table column, you use the following syntax:

```
UPDATE
  table_name
SET
  column_name = REPLACE(column, old_text, new_text)
WHERE
  condition;
```

Let’s see the following example.

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `posts` that has three columns `id`, `title`, and `url`:

```sql
CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);

INSERT INTO posts(title, url)
VALUES
('PostgreSQL Tutorial', 'http://neon.tech/postgresql'),
('PL/pgSQL', 'http://neon.tech/postgresql/postgresql-plpgsql/'),
('PostgreSQL Administration
', 'http://neon.tech/postgresql/postgresql-administration/')
RETURNING *;
```

Output:

```
 id |           title           |                             url
----+---------------------------+--------------------------------------------------------------
  1 | PostgreSQL Tutorial       | http://neon.tech/postgresql
  2 | PL/pgSQL                  | http://neon.tech/postgresql/postgresql-plpgsql/
  3 | PostgreSQL Administration+| http://neon.tech/postgresql/postgresql-administration/
    |                           |
(3 rows)


INSERT 0 3
```

Second, replace the `http` in the `url` column with the `https` using the `REPLACE()` function:

```sql
UPDATE posts
SET url = REPLACE(url, 'http','https');
```

Output:

```sql
UPDATE 3
```

The output indicates that three rows were updated.

Third, verify the update by retrieving data from the `customer` table:

```
SELECT * FROM posts;
```

Output:

```
 id |           title           |                              url
----+---------------------------+---------------------------------------------------------------
  1 | PostgreSQL Tutorial       | https://neon.tech/postgresql
  2 | PL/pgSQL                  | https://neon.tech/postgresql/postgresql-plpgsql/
  3 | PostgreSQL Administration+| https://neon.tech/postgresql/postgresql-administration/
    |                           |
(3 rows)
```

The output indicates that the `http` in the `url` column were replaced by the `https`.

## Summary

- Use the PostgreSQL `REPLACE()` function to replace all occurrences of a substring in a string with another a new substring.
