---
title: 'PostgreSQL RPAD() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-string-functions/postgresql-rpad/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RPAD()` function to extend a string to a length by filing characters.





## Introduction to the PostgreSQL RPAD() function





The `RPAD()` function allows you to extend a string to a length by appending specified characters.





Here's the basic syntax of the `RPAD()` function:





```
RPAD(string, length, fill)
```





In this syntax:





- 
- `string`: The input string that you want to extend.
- 
-
- 
- `length`: The desired length of the string after padding.
- 
-
- 
- `fill`: The character or string used for padding.
- 





The `RPAD()` function returns the string, right-padded with the string `fill` to a length of `length` characters.





If the length of the `string` is greater than the desired `length`, the `RPAD()` function truncates the `string` to the `length` characters.





If any argument `string`, `length`, or `fill` is `NULL`, the `RPAD()` function returns `NULL`.





The `RPAD()` function can be particularly useful when you need to format text with a consistent length, align text in columns, or prepare data for display.





To left-pad a string to a length with specified characters, you can use the `LPAD()` function.





## PostgreSQL RPAD() function examples





Let's explore some examples of using the PostgreSQL `RPAD()` function.





### 1) Basic PostgreSQL RPAD() function





The following example uses the `RPAD()` function to extend a string by filling zeros ('0') to make it six characters long:





```
SELECT RPAD('123', 6, '0');
```





Output:





```
  rpad
--------
 123000
(1 row)
```





### 2) Using the RPAD() function with the table data example





We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):





![](./img/wp-content-uploads-2019-05-film.png)





The following example uses the `RPAD()` function to right-pad the titles from the `film` table with the character '.' to make it 50 characters long:





```
SELECT
  RPAD(title, 50, '.')
FROM
  film;
```





Output:





```
                        rpad
----------------------------------------------------
 Chamber Italian...................................
 Grosse Wonderful..................................
 Airport Pollock...................................
 Bright Encounters.................................
 Academy Dinosaur..................................
...
```





### 3) Using the RPAD() function to truncate strings





The following example uses the `RPAD()` function to truncate the titles if their lengths are more than 10 characters:





```
SELECT
  title, RPAD(title, 10, '') result
FROM
  film;
```





Output:





```
            title            |   result
-----------------------------+------------
 Chamber Italian             | Chamber It
 Grosse Wonderful            | Grosse Won
 Airport Pollock             | Airport Po
 Bright Encounters           | Bright Enc
 Academy Dinosaur            | Academy Di
 Ace Goldfinger              | Ace Goldfi
...
```





## Summary





- 
- Use PostgreSQL `RPAD()` function to extend a string to a length by appending specified characters.
- 


