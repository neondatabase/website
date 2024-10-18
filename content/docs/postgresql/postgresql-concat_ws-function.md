---
title: 'PostgreSQL CONCAT_WS() Function'
redirectFrom:
            - /docs/postgresql/postgresql-concat_ws 
            - /docs/postgresql/postgresql-string-functions/postgresql-concat_ws/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CONCAT_WS()` function to concatenate strings into a single string, separated by a specified separator.





## Introduction to PostgreSQL CONCAT_WS() function





The PostgreSQL `CONCAT_WS()` function allows you to concatenate multiple strings into a single string separated by a specified separator.





Here's the basic syntax of the `CONCAT_WS` function:





```
CONCAT_WS(separator, string1, string2, string3, ...)
```





In this syntax:





- `separator`: Specify the separator that you want to separate the strings. The `separator` should not be `NULL`.
-
- `string1`, `string2`, `string3`, ..: These are strings that you want to concatenate. If any string is NULL, it is ignored by the function.





The `CONCAT_WS` returns a single string that combines the `string1`, `string2`, `string3`... separated by the separator.





If the separator is `NULL`, the `CONCAT_WS` will return `NULL`.





In practice, you typically use the `CONCAT_WS` function to combine values from different columns with a custom separator.





## PostgreSQL CONCAT_WS() function examples





Let's take some examples of using the `CONCAT_WS()` function.





### 1) Basic PostgreSQL CONCAT_WS() function example





The following example uses the `CONCAT_WS()` function to concatenate two strings with a space:





```
SELECT CONCAT_WS(' ', 'PostgreSQL', 'Tutorial') title;
```





Output:





```
        title
---------------------
 PostgreSQL Tutorial
(1 row)
```





In this example, we use the `CONCAT_WS()` function to concatenate the strings `'PostgreSQL'` and `'Tutorial'` with a space separator. The result string is `'PostgreSQL Tutorial'`.





### 2) Using the CONCAT_WS() function with the table data





We'll use the `customer` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):





![customer table](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/customer.png)





The following example uses the `CONCAT_WS()` to concatenate values from the `first_name` and `last_name` columns of the `customer` table using a space as a separator:





```
SELECT
  CONCAT_WS(' ', first_name, last_name) full_name
FROM
  customer
ORDER BY
  first_name;
```





Output:





```
       full_name
-----------------------
 Aaron Selby
 Adam Gooch
 Adrian Clary
 Agnes Bishop
...
```





The query returns a result set with a single column `full_name` containing the full names of all customers.





## Summary





- Use the `CONCAT_WS` function to concatenate multiple strings into a single string separated by a specified separator.
-
- The `CONCAT_WS` function skips `NULL` values.


