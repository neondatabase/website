---
title: 'PostgreSQL MOD() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-mod/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: In this tutorial, you will learn how to use the PostgreSQL `MOD()` function performs the modulo operation, returning the remainder after dividing the first argument by the second one.





## Introduction to the PostgreSQL MOD() function





The MOD() function allows you to perform a modulo operation, returning the remainder after dividing the first argument by the second one.





Here's the basic syntax of the PostgreSQL `MOD()` function:





```
MOD(dividend,divisor)
```





In this syntax:





- 
- `dividend`: The `dividend` is a number that you want to divide.
- 
-
- 
- `divisor`: The `divisor` is the number by which you want to divide the dividend.
- 





The `divisor` must not be zero (0), otherwise, the function will issue the division by zero error.





The `MOD()` function returns a number whose [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/) is the same as the input argument. It returns NULL if either `dividend` or `divisor` is `NULL`.





## PostgreSQL MOD() function examples





Let's explore some examples of using the MOD() function.





### 1) Basic PostgreSQL MOD() function examples





The following example uses the `MOD()` function to get the remainder of two integers:





```
SELECT MOD(15,4);
```





Output:





```
 mod
-----
   3
(1 row)
```





The following statement uses the `MOD()` function to get the remainder of 15 and -5:





```
SELECT MOD(15,-4);
```





Output:





```
 mod
-----
   3
(1 row)
```





But the following statement returns a negative result:





```
SELECT MOD(-15,4);
```





The remainder is a negative number:





```
 mod
-----
  -3
(1 row)
```





Similarly, the following statement returns the same negative remainder number:





```
SELECT MOD(-15,-4);
```





Output:





```
 mod
-----
  -3
(1 row)
```





### 2) Using the MOD() function with decimal numbers





The following example uses the `MOD()` function to calculate the remainder when dividing 10.5 by 3, resulting in 1.5:





```
SELECT MOD(10.5, 3);
```





Output:





```
 mod
-----
 1.5
(1 row)
```





## Summary





- 
- Use the PostgreSQL `MOD()` function to find the remainder after dividing one number by another.
- 


