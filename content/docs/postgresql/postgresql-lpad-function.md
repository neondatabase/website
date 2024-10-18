---
title: 'PostgreSQL LPAD() Function'
redirectFrom:
            - /docs/postgresql/postgresql-lpad 
            - /docs/postgresql/postgresql-string-functions/postgresql-lpad/
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-customer-and-payment-tables.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LPAD()` function to pad a string on the left to a specified length with a sequence of characters.





## Introduction to the PostgreSQL LPAD() function





The LPAD() function pad a string on the left to a specified length with a sequence of characters.





Here's the basic syntax of the `LPAD()` function:





```
LPAD(string, length[, fill])
```





The `LPAD()` function accepts 3 arguments:





**1) `string`**





is a string that should be padded on the left





**2) `length`**





is an positive integer that specifies the length of the result string after padding.





Note that if the string is longer than the length argument, the string will be truncated on the right.





**3) `fill`**





is a string used for padding.





The `fill` argument is optional. If you omit the `fill` argument, its default value is a space.





The PostgreSQL `LPAD()` function returns a string left-padded to `length` characters.





## PostgreSQL LPAD() function Examples





Let's see some examples of using the `LPAD()` function.





### 1) Basic PostgreSQL LPAD() function example





The following statement uses the `LPAD()` function to pad the '\*' on the left of the string 'PostgreSQL':





```
SELECT LPAD('PostgreSQL',15,'*');
```





The result is:





```
      lpad
----------------
 *****PostgreSQL
(1 row)
```





In this example, the length of the `PostgreSQL` string is 10, and the result string should have a length of 15. Therefore, the `LPAD()` function pads 5 asterisks (\*) on the left of the string.





### 2) Padding leading zeros





The following example uses the `LPAD()` function to pad zeros at the beginning of the string to a length of five characters:





```
SELECT LPAD('123',5,'0') result;
```





Output:





```
 result
--------
 00123
(1 row)
```





If you want to pad a number, you need to convert that number to a string before padding. For example:





```
SELECT LPAD(123::text,5,'0') result;
```





Output:





```
 result
--------
 00123
(1 row)
```





### 3) Using LPAD() function with table data





See the following `customer` and `payment` tables from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):





![customer and payment tables](/postgresqltutorial_data/wp-content-uploads-2013-05-customer-and-payment-tables.png)





The following statement illustrates how to use the `LPAD()` function to draw a chart based on the sum of payments per customer.





```
SELECT first_name || ' ' || last_name fullname,
    SUM(amount) total,
    LPAD('*', CAST(TRUNC(SUM(amount) / 10) AS INT), '*') chart
FROM payment
INNER JOIN customer using (customer_id)
GROUP BY customer_id
ORDER BY SUM(amount) DESC;
```





The following picture illustrates the result:





```
       fullname        | total  |         chart
-----------------------+--------+-----------------------
 Eleanor Hunt          | 211.55 | *********************
 Karl Seal             | 208.58 | ********************
 Marion Snyder         | 194.61 | *******************
 Rhonda Kennedy        | 191.62 | *******************
 Clara Shaw            | 189.60 | ******************
 Tommy Collazo         | 183.63 | ******************
 Ana Bradley           | 167.67 | ****************
 Curtis Irby           | 167.62 | ****************
...
```





In this example,





- 
- First, add up the payments for each customer using the [`SUM()`](https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-sum-function/) function and the `GROUP BY` clause,
- 
-
- 
- Second, calculate the length of the bar chart based on the sums of payments using various functions: `TRUNC()` to truncate the total payments, `CAST()` to convert the result of the `TRUNC()` to an integer. To make the bar chart more readable, we divided the sum of payments by 10.
- 
-
- 
- Third, apply the `LPAD()` function to pad the character (\*) based on the result of the second step above.
- 





## Summary





- 
- Use the PostgreSQL `LPAD()` function to pad characters on the left of a string to a certain length.
- 


