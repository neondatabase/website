---
title: 'PostgreSQL POSITION() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-string-functions/postgresql-position/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


The PostgreSQL `POSITION()` function returns the location of the first instance of a substring within a string.





## Syntax





The following illustrates the syntax of the `POSITION()` function:





```
POSITION(substring in string)
```





## Arguments





The `POSITION()` function requires two arguments:





**1) `substring`**





The substring argument is the string that you want to locate.





**2) `string`**





The `string` argument is the string for which the substring is searched.





## Return Value





The `POSITION()` function returns an [integer](/docs/postgresql/postgresql-integer) representing the location of the first instance of the substring within the input string.





The `POSITION()` function returns zero (0) if the substring is not found in the string. It returns NULL if either `substring` or `string` argument is null.





## Examples





The following example returns the position of the `'Tutorial'` in the string `'PostgreSQL Tutorial'`:





```
SELECT POSITION('Tutorial' IN 'PostgreSQL Tutorial');
```





The result is as follows:





```
position
----------
       12
(1 row)
```





Note that the `POSITION()` function searches for the substring case-insensitively.





See the following example:





```
SELECT POSITION('tutorial' IN 'PostgreSQL Tutorial');
```





It returns zero (0), indicating that the string `tutorial` does not exist in the string `'PostgreSQL Tutorial'`.





The following example uses the `POSITION()` function to locate the first string `'fateful'` in the `description` column of the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):





```
SELECT
  POSITION('Fateful' in description ),
  description
FROM
  film
WHERE
  POSITION('Fateful' in description ) > 0;
```





Output:





```
 position |                                                   description
----------+-----------------------------------------------------------------------------------------------------------------
        3 | A Fateful Reflection of a Moose And a Husband who must Overcome a Monkey in Nigeria
        3 | A Fateful Yarn of a Lumberjack And a Feminist who must Conquer a Student in A Jet Boat
        3 | A Fateful Yarn of a Womanizer And a Feminist who must Succumb a Database Administrator in Ancient India
        3 | A Fateful Display of a Womanizer And a Mad Scientist who must Outgun a A Shark in Soviet Georgia
...
```





## Remarks





The `POSITION()` function returns the location of the first instance of the substring in the string.





For example:





```
SELECT POSITION('is' IN 'This is a cat');
```





Output:





```
 position
----------
        3
(1 row)
```





Even though the substring `'is'` appears twice in the string `'This is a cat'`, the `POSITION()` function returns the first match.





## Summary





- 
- Use the `POSITION()` function to locate the first instance of a substring within a string.
- 


