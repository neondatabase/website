---
title: 'PostgreSQL RIGHT() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-right/
ogImage: ./img/wp-content-uploads-2019-05-customer.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RIGHT()` function to return the last `n` characters in a string.



## Introduction to the PostgreSQL RIGHT() function



The `RIGHT()` function allows you to retrieve the last n characters of a string.



Here's the basic syntax of the `RIGHT()` function:



```
RIGHT(string, n)
```



The PostgreSQL `RIGHT()` function requires two arguments:



- - `string` is a string from which a number of the rightmost characters are returned.
- -
- - **`n`** is a positive integer that specifies the number of the rightmost characters in the string that should be returned.
- 


The `RIGHT()` function returns the last `n` characters in a string. If `n` is negative, the `RIGHT()` function returns all characters in the string but first `|n|` (absolute) characters.



If you want to return the `n` first characters of a string, you can use the `LEFT()` function.



## PostgreSQL RIGHT() function examples



Let's take some examples of using the PostgreSQL `RIGHT()` function.



### 1) Basic PostgreSQL RIGHT() function example



The following statement uses the `RIGHT()` function to get the last character in the string `'XYZ'`:



```
SELECT RIGHT('XYZ', 1);
```



Here is the result:



```
 right
-------
 Z
(1 row)
```



To get the last two characters, you pass the value `2` as the second argument as follows:



```
SELECT RIGHT('XYZ', 2);
```



Output:



```
 right
-------
 YZ
(1 row)
```



The following statement illustrates how to use a negative integer as the second argument:



```
SELECT RIGHT('XYZ', - 1);
```



In this example, the `RIGHT()` function returns all characters except for the first character.



```
 right
-------
 YZ
(1 row)
```



### 2) Using the RIGHT() function with table data example



See the following `customer` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):



![customer table](./img/wp-content-uploads-2019-05-customer.png)



The following statement uses the `RIGHT()` function in [`WHERE`](/docs/postgresql/postgresql-where) clause to get all customers whose last names end with `'son'`:



```
SELECT
  last_name
FROM
  customer
WHERE
  RIGHT(last_name, 3) = 'son';
```



Output:



```
  last_name
-------------
 Johnson
 Wilson
 Anderson
 Jackson
 Thompson
...
```



## Summary



- - Use the PostgreSQL `RIGHT()` function to get the n rightmost characters in a string.
- 
