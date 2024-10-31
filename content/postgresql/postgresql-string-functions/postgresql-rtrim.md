---
title: 'PostgreSQL RTRIM() Function'
page_title: 'PostgreSQL RTRIM() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL RTRIM() function to remove specified characters from the end of a string.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-rtrim/'
ogImage: ''
updatedOn: '2024-01-27T13:44:30+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL UPPER() Function'
  slug: 'postgresql-string-functions/postgresql-upper'
nextLink:
  title: 'PostgreSQL FORMAT() Function'
  slug: 'postgresql-string-functions/postgresql-format'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RTRIM()` function to remove specified characters from the end of a string.

## Introduction to PostgreSQL RTRIM() function

The `RTRIM()` function allows you to remove specified characters from the end of a string.

Here’s the syntax of the `RTRIM()` function:

```sql
RTRIM(string, character)
```

In this syntax:

- `string` is the input string that you want to remove characters
- `character` specifies the character you want to remove from the end of the string. The `character` parameter is optional and defaults to space.

The `RTRIM()` function returns the string with all trailing characters removed.

To remove both leading and trailing characters from a string, you use the [TRIM()](postgresql-trim-function) function.

To remove all the leading characters from a string, you use the [LTRIM()](postgresql-ltrim) function.

## PostgreSQL RTRIM() function examples

Let’s explore some examples of using the `RTRIM()` function.

### 1\) Basic PostgreSQL RTRIM() function example

The following example uses the `RTRIM()` function to remove the character `!` from the end of the string `postgres!!!`:

```sql
SELECT RTRIM('postgres!!!', '!');
```

Output:

```sql
  rtrim
----------
 postgres
(1 row)
```

### 2\) Using the PostgreSQL RTRIM() function to remove leading spaces

The following example uses the `RTRIM()` function to remove all the spaces from the end of the string `'PostgreSQL '`:

```sql
SELECT RTRIM('PostgreSQL   ');
```

Output:

```sql
   rtrim
------------
 PostgreSQL
(1 row)

```

Because the default of the second argument of the `RTRIM()` function is space, you don’t need to explicitly specify it.

### 3\) Using the RTRIM() function with table data example

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `tweets` and [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into it:

```sql
CREATE TABLE tweets(
   id SERIAL PRIMARY KEY,
   tweet VARCHAR(120) NOT NULL
);

INSERT INTO tweets(tweet)
VALUES
   ('PostgreSQL tutorial   '),
   ('PostgreSQL RTRIM() function   ')
RETURNING *;
```

Output:

```sql
 id |             tweet
----+--------------------------------
  1 | PostgreSQL tutorial
  2 | PostgreSQL RTRIM() function
(2 rows)


INSERT 0 2
```

Second, [update](../postgresql-tutorial/postgresql-update) the tweets by removing the trailing spaces using the `RTRIM()` function:

```sql
UPDATE tweets
SET tweet = RTRIM(tweet);
```

Output:

```sql
UPDATE 2
```

The output indicates that two rows were updated.

Third, verify the updates:

```sql
SELECT * FROM tweets;
```

Output:

```sql
 id |            tweet
----+-----------------------------
  1 | PostgreSQL tutorial
  2 | PostgreSQL RTRIM() function
(2 rows)
```

## Summary

- Use `RTRIM()` function to remove all specified characters from the end of a string.
