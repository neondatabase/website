---
prevPost: postgresql-views
nextPost: postgresql-jdbc-updating-data
createdAt: 2015-09-26T01:13:03.000Z
title: 'PostgreSQL SUBSTRING() Function'
redirectFrom:
            - /postgresql/postgresql-substring 
            - /postgresql/postgresql-string-functions/postgresql-substring
ogImage: /postgresqltutorial_data/wp-content-uploads-2015-09-PostgreSQL-substring-function-example.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `SUBSTRING()` function to extract a substring from a string.

## Introduction to PostgreSQL SUBSTRING() function

The `SUBSTRING()` function allows you to extract a substring from a string and return the substring.

Here's the basic syntax of the `SUBSTRING()` function:

```sql
SUBSTRING(string, start_position, length)
```

In this syntax:

- `string`: This is an input string with the data type char, varchar, text, and so on.
- `start_position`: This is an integer that specifies where in the string you want to extract the substring. If `start_position` equals zero, the substring starts at the first character of the string. The `start_position` can be only positive. Note that in other database systems such as MySQL the [SUBSTRING() function](https://www.mysqltutorial.org/mysql-string-functions/mysql-substring/) can accept a negative `start_position`.
- `length`: This is a positive integer that determines the number of characters that you want to extract from the string beginning at `start_position`. If the sum of `start_position` and `length` is greater than the number of characters in the `string`, the substring function returns the whole string beginning at `start_position`. The `length` parameter is optional. If you omit it, the `SUBSTRING` function returns the whole string started at `start_position`.

PostgreSQL offers another syntax for the `SUBSTRING()` function as follows:

```sql
SUBSTRING(string FROM start_position FOR length);
```

PostgreSQL provides another function named `SUBSTR()` that has the same functionality as the `SUBSTRING()` function.

## PostgreSQL SUBSTRING() function examples

Let's explore some examples of using the `SUBSTRING()` function.

### 1) Basic SUBSTRING() function examples

The following example uses the `SUBSTRING()` function to extract the first 8 characters from the string PostgreSQL:

```sql
SELECT
  SUBSTRING ('PostgreSQL', 1, 8);
```

Output:

```
 substring
-----------
 PostgreS
(1 row)
```

In the example, we extract a substring that has a length of 8, starting at the first character of the `PostgreSQL` string. The result is et `PostgreS` as illustrated in the following picture:

![PostgreSQL substring function example](/postgresqltutorial_data/wp-content-uploads-2015-09-PostgreSQL-substring-function-example.jpg)

The following example uses the `SUBSTRING()` function to extract the first 8 characters from the PostgreSQL string:

```sql
SELECT
  SUBSTRING ('PostgreSQL', 8);
```

Output:

```
 substring
-----------
 SQL
(1 row)
```

In this example, we extract a substring started at position 8 and omit the `length` parameter. The resulting substring starts at the position 8 to the rest of the string.

The following examples use the alternative syntax of the `SUBSTRING()` function:

```sql
SELECT
  SUBSTRING ('PostgreSQL' FROM 1 FOR 8),
  SUBSTRING ('PostgreSQL' FROM 8);
```

Output:

```
 substring | substring
-----------+-----------
 PostgreS  | SQL
(1 row)
```

### 2) Using the PostgreSQL SUBSTRING() function with table data

We'll use the `customer` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial_data/wp-content-uploads-2019-05-customer.png)

The following example uses the `SUBSTRING()` function to retrieve the initial names of customers by extracting the first character of value in the `first_name` column:

```sql
SELECT
  first_name,
  SUBSTRING(first_name, 1, 1) AS initial
FROM
  customer;
```

Output:

```
 first_name  | initial
-------------+---------
 Jared       | J
 Mary        | M
 Patricia    | P
 Linda       | L
...
```

## Extracting substring matching POSIX regular expression

In addition to the SQL-standard substring function, PostgreSQL allows you to extract a substring that matches a [POSIX regular expression](https://en.wikipedia.org/wiki/Regular_expression#POSIX_basic_and_extended).

The following illustrates the syntax of the substring function with POSIX regular expression:

```sql
SUBSTRING(string, pattern);
```

Or you can use the following syntax:

```sql
SUBSTRING(string FROM pattern)
```

If the SUBSTRING() function finds no match, it returns NULL.

If the `pattern` contains any parentheses, the `SUBSTRING()` function returns the text that matches the first parenthesized subexpression.

The following example uses the `SUBSTRING()` to extract the house number with 1 to 4 digits, from a string:

```sql
SELECT
  SUBSTRING (
    'The house number is 9001', '([0-9]{1,4})'
  ) AS house_no
```

Output:

```
 house_no
----------
 9001
(1 row)
```

## Extracting substring matching a SQL regular expression

Besides the POSIX regular expression pattern, you can use the SQL regular expression pattern to extract a substring from a string using the following syntax:

```sql
SUBSTRING(string FROM pattern FOR escape-character)
```

In this syntax:

- `string`: is a string that you want to extract the substring.
- `escape-character`: the escape character.
- `pattern` is a regular expression wrapped inside escape characters followed by a double quote (`"`). For example, if the character `#` is the escape character, the pattern will be `#"pattern#"`. In addition, the `pattern` must match the entire `string`, otherwise, the function will fail and return `NULL`.

For example:

```sql
SELECT
  SUBSTRING ('PostgreSQL' FROM '%#"S_L#"%' FOR '#');
```

Output:

```
 substring
-----------
 SQL
(1 row)
```

## Summary

- Use the PostgreSQL `SUBSTRING()` functions to extract a substring from a string.
