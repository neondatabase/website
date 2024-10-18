---
title: 'PostgreSQL TRIM() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-trim-function/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TRIM()` function to remove specified prefixes or suffixes (or both) from a string.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL TRIM() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `TRIM()` function allows you to remove specified prefixes or suffixes (or both) from a string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `TRIM()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
TRIM([LEADING | TRAILING | BOTH] trim_character
FROM source_string)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `source_string`: Specify the string that you want to remove specified characters.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `trim_character`: Specify the trim characters.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `LEADING`: This option instructs the function to remove the leading occurrences of the specified trim character.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `TRAILING`: This option instructs the function to remove trailing occurrences of the specified trim character.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `BOTH`: This option instructs the function to remove both leading and trailing occurrences of the specified trim character.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `TRIM()` function can be very useful when you want to clean up strings.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To remove specific characters from the beginning of a string, you use the [LTRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-ltrim/) function. To remove specific characters from the end of a string, you can use the [RTRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-rtrim/) function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL TRIM() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `TRIM()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL TRIM() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `TRIM()` function to remove leading and trailing spaces from the string `' PostgreSQL '`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT TRIM('   PostgreSQL   ') AS trimmed_string;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 trimmed_string
----------------
 PostgreSQL
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is a string without leading and trailing spaces.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL TRIM() function to remove specific characters

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `TRIM()` function to remove leading and trailing hash symbols (`#`) from the string `'##PostgreSQL##'`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT TRIM('#' FROM '##PostgreSQL##') AS trimmed_string;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 trimmed_string
----------------
 PostgreSQL
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the TRIM() function to remove specific characters by specifying the trim location

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the PostgreSQL `TRIM()` function to remove leading, trailing, and both leading and trailing zeros from the string `'0000123450'`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT TRIM(LEADING '0' FROM '000123450') AS trimmed_string_leading,
       TRIM(TRAILING '0' FROM '000123450') AS trimmed_string_trailing,
       TRIM(BOTH '0' FROM '000123450') AS trimmed_string_both;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 trimmed_string_leading | trimmed_string_trailing | trimmed_string_both
------------------------+-------------------------+---------------------
 123450                 | 00012345                | 12345
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Using the TRIM() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `todo` and [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) some sample data:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE todo(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOL NOT NULL DEFAULT false
);

INSERT INTO todo(title)
VALUES
  ('   Learn PostgreSQL   '),
  ('Build an App   ')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |         title          | completed
----+------------------------+-----------
  1 |    Learn PostgreSQL    | f
  2 | Build an App           | f
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, remove the leading and trailing spaces from the `title` column using the `TRIM()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
UPDATE todo
SET title = TRIM(title);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
UPDATE 2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, verify the updates:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM todo;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |      title       | completed
----+------------------+-----------
  1 | Learn PostgreSQL | f
  2 | Build an App     | f
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `TRIM()` function to remove a specified leading, trailing, or both leading and trailing characters from a string.
- <!-- /wp:list-item -->

<!-- /wp:list -->
