---
title: 'PostgreSQL LIKE'
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-customer.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LIKE` operators to query data based on patterns.



## Introduction to PostgreSQL LIKE operator



Suppose that you want to find customers, but you don't remember their names exactly. However, you can recall that their names begin with something like `Jen`.



How do you locate the exact customers from the database? You can identify customers in the `customer` table by examining the first name column to see if any values begin with `Jen`. However, this process can be time-consuming, especially when the `customer` table has a large number of rows.



Fortunately, you can use the PostgreSQL `LIKE` operator to match the first names of customers with a string using the following query:



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE 'Jen%';
```



Output:



```
 first_name | last_name
------------+-----------
 Jennifer   | Davis
 Jennie     | Terry
 Jenny      | Castro
(3 rows)
```



The `WHERE` clause in the query contains an expression:



```
first_name LIKE 'Jen%'
```



The expression consists of the `first_name`, the `LIKE` operator and a literal string that contains a percent sign `(%`). The string `'Jen%'` is called a pattern.



The query returns rows whose values in the `first_name` column begin with `Jen` and are followed by any sequence of characters. This technique is called pattern matching.



You construct a pattern by combining literal values with wildcard characters and using the `LIKE` or `NOT LIKE` operator to find the matches.



PostgreSQL offers two wildcards:



- Percent sign ( `%`) matches any sequence of zero or more characters.
- Underscore sign (`_`) matches any single character.


Here's the basic syntax of the `LIKE` operator:



```
value LIKE pattern
```



The `LIKE` operator returns `true` if the `value` matches the `pattern`. To negate the `LIKE` operator, you use the `NOT` operator as follows:



```
value NOT LIKE pattern
```



The `NOT LIKE` operator returns `true` when the `value` does not match the `pattern`.



If the pattern does not contain any wildcard character, the `LIKE` operator behaves like the equal (`=`) operator.



## PostgreSQL LIKE operator examples



Let's take some examples of using the `LIKE` operator



### 1) Basic LIKE operator examples



The following statement uses the `LIKE` operator with a pattern that doesn't have any wildcard characters:



```
SELECT 'Apple' LIKE 'Apple' AS result;
```



Output:



```
 result
--------
 t
(1 row)
```



In this example, the `LIKE` operator behaves like the equal to (`=`) operator. The query returns `true` because '`Apple' = 'Apple'` is `true`.



The following example uses the `LIKE` operator to match any string that starts with the letter `A`:



```
SELECT 'Apple' LIKE 'A%' AS result;
```



Output:



```
 result
--------
 t
(1 row)
```



The query returns true because the string `'Apple'` starts with the letter `'A'`.



### 2) Using the LIKE operator with table data



We'll use the `customer` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):



![customer table - PostgreSQL LIKE and ILIKE examples](/postgresqltutorial_data/wp-content-uploads-2019-05-customer.png)



The following example uses the `LIKE` operator to find customers whose first names contain the string `er` :



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE '%er%'
ORDER BY
  first_name;
```



Output:



```
first_name  |  last_name
-------------+-------------
 Albert      | Crouse
 Alberto     | Henning
 Alexander   | Fennell
 Amber       | Dixon
 Bernard     | Colby
...
```



### 3) Using the LIKE operator a pattern that contains both wildcards



The following example uses the `LIKE` operator with a pattern that contains both the percent ( `%`) and underscore (`_`) wildcards:



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE '_her%'
ORDER BY
  first_name;
```



Output:



```
 first_name | last_name
------------+-----------
 Cheryl     | Murphy
 Sherri     | Rhodes
 Sherry     | Marshall
 Theresa    | Watson
(4 rows)
```



The pattern `_her%` matches any strings that satisfy the following conditions:



- The first character can be anything.
- The following characters must be `'her'`.
- There can be any number (including zero) of characters after `'her'`.


### 4) PostgreSQL NOT LIKE examples



The following query uses the `NOT LIKE` operator to find customers whose first names do not begin with `Jen`:



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name NOT LIKE 'Jen%'
ORDER BY
  first_name;
```



Output:



```
 first_name  |  last_name
-------------+--------------
 Aaron       | Selby
 Adam        | Gooch
 Adrian      | Clary
 Agnes       | Bishop
...
```



## PostgreSQL extensions of the LIKE operator



PostgreSQL `ILIKE` operator, which is similar to the `LIKE` operator, but allows for **case-insensitive matching**. For example:



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name ILIKE 'BAR%';
```



Output:



```
 first_name | last_name
------------+-----------
 Barbara    | Jones
 Barry      | Lovelace
(2 rows)
```



In this example, the `BAR%` pattern matches any string that begins with `BAR`, `Bar`, `BaR`, and so on. If you use the `LIKE` operator instead, the query will return no row:



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE 'BAR%';
```



Output:



```
 first_name | last_name
------------+-----------
(0 rows)
```



PostgreSQL also provides some operators that mirror the functionality of `LIKE`, `NOT LIKE`, `ILIKE`, `NOT ILIKE`, as shown in the following table:



| Operator | Equivalent |
| -------- | ---------- |
| ~~       | LIKE       |
| ~~\*     | ILIKE      |
| !~~      | NOT LIKE   |
| !~~\*    | NOT ILIKE  |



For example, the following statement uses the `~~` operator to find a customer whose first names start with the string `Dar`:



```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name ~~ 'Dar%'
ORDER BY
  first_name;
```



Output:



```
 first_name | last_name
------------+-----------
 Darlene    | Rose
 Darrell    | Power
 Darren     | Windham
 Darryl     | Ashcraft
 Daryl      | Larue
(5 rows)
```



## PostgreSQL LIKE operator with ESCAPE option



Sometimes, the data, that you want to match, contains the wildcard characters `%` and `_`. For example:



```
The rents are now 10% higher than last month
The new film will have _ in the title
```



To instruct the `LIKE` operator to treat the wildcard characters `%` and `_` as regular literal characters, you can use the `ESCAPE` option in the `LIKE` operator:



```
string LIKE pattern ESCAPE escape_character;
```



Let's [create a simple table](/docs/postgresql/postgresql-create-table) for demonstration:



```
CREATE TABLE t(
   message text
);

INSERT INTO t(message)
VALUES('The rents are now 10% higher than last month'),
      ('The new film will have _ in the title');

SELECT message FROM t;
```



Note that you'll learn how to [create a table](/docs/postgresql/postgresql-create-table/) and [insert data into it](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows) in the upcoming tutorials.



Output:



```
                   message
----------------------------------------------
 The rents are now 10% higher than last month
 The new film will have _ in the title
(2 rows)
```



The following statement uses the `LIKE` operator with the `ESCAPE` option to treat the `%` followed by the number `10` as a regular character:



```
SELECT * FROM t
WHERE message LIKE '%10$%%' ESCAPE '$';
```



Output:



```
                   message
----------------------------------------------
 The rents are now 10% higher than last month
(1 row)
```



In the pattern `%10$%%`, the first and last `%` are the wildcard characters whereas the `%` appears after the escape character `$` is a regular character.



## Summary



- Use the `LIKE` operator to match data by patterns.
- Use the `NOT LIKE` operator to negate the `LIKE` operator.
- Use the `%` wildcard to match zero or more characters.
- Use the `_` wildcard to match a single character.
- Use the `ESCAPE` option to specify the escape character.
- Use the `ILIKE` operator to match data case-insensitively.
