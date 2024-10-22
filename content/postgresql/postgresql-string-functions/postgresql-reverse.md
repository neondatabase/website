---
title: "PostgreSQL REVERSE() Function"
page_title: "PostgreSQL REVERSE() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL REVERSE() function to reverse the characters within a string."
prev_url: "https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-reverse/"
ogImage: "/postgresqltutorial/customer.png"
updatedOn: "2024-01-28T10:36:42+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL REGEXP_MATCHES() Function"
  slug: "postgresql-string-functions/postgresql-regexp_matches"
next_page: 
  title: "PostgreSQL REPEAT() Function"
  slug: "postgresql-string-functions/postgresql-repeat"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REVERSE()` function to reverse the characters within a string.


## Introduction to PostgreSQL REVERSE() function

The `REVERSE()` function accepts a string and returns a new string with the order of all characters reversed.

Here’s the syntax of the `REVERSE()` function:


```sql
REVERSE(text)
```
In this syntax:

* `text`: The input string that you want to reverse.

The `REVERSE()` function returns a string with the order of all the characters reversed.

The `REVERSE()` function returns `NULL` if the `text` is `NULL`.


## MySQL REVERSE() function examples

Let’s explore some examples of using the `REVERSE()` function.


### 1\) Basic PostgreSQL REVERSE() function example

The following example uses the `REVERSE()` function to reverse the string `"SQL"`:


```sql
SELECT REVERSE('SQL');
```
Output:


```sql
 reverse
---------
 LQS
(1 row)
```

### 2\) Using the PostgreSQL REVERSE() function with table data

We’ll use the `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial/customer.png)The following example uses the `REVERSE()` function to reverse the first names of customers:


```sql
SELECT 
  first_name, 
  REVERSE(first_name) 
FROM 
  customer 
ORDER BY 
  first_name;
```
Output:


```sql
 first_name  |   reverse
-------------+-------------
 Aaron       | noraA
 Adam        | madA
 Adrian      | nairdA
 Agnes       | sengA
```

### 3\) Using REVERSE() function to detect palindromes

A palindrome is a string that reads the same forward and backward such as `"radar"`.

You can use the `REVERSE()` function to reverse a string and then compare the reversed string with the original string to determine if it is a palindrome. For example:

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `words` to store the words:


```sql
CREATE TABLE words(
  id SERIAL PRIMARY KEY,
  word VARCHAR(255) NOT NULL
);
```
Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `words` table:


```sql
INSERT INTO words(word)
VALUES('radar'), ('level'),('civic'),('man'),('12321'),('madam')
RETURNING *;
```
Output:


```sql
 id | word
----+-------
  1 | radar
  2 | level
  3 | civic
  4 | man
  5 | 12321
  6 | madam
(6 rows)
```
Third, determine if a value in the `word` column is a palindrome using the `REVERSE()` function:


```
SELECT 
  word, 
  REVERSE(word), 
  (
    word = REVERSE(word)
  ) palindrome 
FROM 
  words;
```
Output:


```sql
 word  | reverse | palindrome
-------+---------+------------
 radar | radar   | t
 level | level   | t
 civic | civic   | t
 man   | nam     | f
 12321 | 12321   | t
 madam | madam   | t
(6 rows)
```

## Summary

* Use the PostgreSQL `REVERSE()` function to reverse the order of characters within a string.

