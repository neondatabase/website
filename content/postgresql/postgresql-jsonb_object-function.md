---
title: 'PostgreSQL jsonb_object() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_object/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_object()` function to create a JSON object from a text array.





## Introduction to the PostgreSQL jsonb_object() function





The `jsonb_object()` function allows you to build a JSON object from a [text](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/) [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/).





Here's the syntax of the `jsonb_object()` function:





```
jsonb_object(text[]) → jsonb
```





In this syntax, `text[]` array can be:





- 
- A one-dimensional array that contains an even number of elements. The elements are the alternating key/value pairs.
- 
-
- 
- A two-dimensional array. Each inner array has exactly two elements representing the key/value pair.
- 





The `jsonb_object()` function returns a JSON object constructed from the text array with the type of JSONB.





The `jsonb_object()` function has another syntax that takes keys and values pairwise from separate text arrays:





```
jsonb_object ( keys text[], values text[] ) → jsonb
```





In this syntax, the keys and values arrays in this syntax have the same number of elements. The `keys` array contains the keys of the JSON object whereas the `values` array contains the corresponding values of the `keys`.





## PostgreSQL jsonb_object() function examples





Let's explore some examples of using the `jsonb_object()` function.





### 1) Basic PostgreSQL jsonb_object function examples





The following example uses the `jsonb_object()` function to create a JSON object from a text array:





```
SELECT
  jsonb_object('{"name","John", "age", 22}');
```





Output:





```
         jsonb_object
-------------------------------
 {"age": "22", "name": "John"}
(1 row)
```





Alternatively, you can use a two-dimensional arrays to create the JSON object:





```
SELECT
  jsonb_object(
    '{{"name","age"},{"John", 22}}'
  );
```





Output:





```
         jsonb_object
-------------------------------
 {"John": "22", "name": "age"}
(1 row)
```





Additionally, you can use two arrays including `keys` and `values` to create the JSON object:





```
SELECT
  jsonb_object(
    '{"name","age"}', '{"John", 22}'
  );
```





Output:





```
         jsonb_object
-------------------------------
 {"age": "22", "name": "John"}
(1 row)
```





### 2) Using the jsonb_object() function with table data





We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).





![](./img/wp-content-uploads-2019-05-film.png)





The following example uses the `jsonb_object` function to create an object from the `title` and `release_year` from the `film` table:





```
SELECT
  jsonb_object(
    array[title], array[release_year]::text[]
  )
FROM
  film
ORDER BY
  title;
```





Output:





```
         jsonb_object
------------------------------
 {"Academy Dinosaur": "2006"}
 {"Ace Goldfinger": "2006"}
 {"Adaptation Holes": "2006"}
 {"Affair Prejudice": "2006"}
 {"African Egg": "2006"}
...
```





## Summary





- 
- Use the PostgreSQL `jsonb_object()` function to create a JSON object from a text array.
- 


