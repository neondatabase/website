---
title: 'PostgreSQL TRIM() Function'
redirectFrom:
            - /docs/postgresql/postgresql-trim 
            - /docs/postgresql/postgresql-string-functions/postgresql-trim-function/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TRIM()` function to remove specified prefixes or suffixes (or both) from a string.





## Introduction to PostgreSQL TRIM() function





The `TRIM()` function allows you to remove specified prefixes or suffixes (or both) from a string.





Here's the basic syntax of the `TRIM()` function:





```
TRIM([LEADING | TRAILING | BOTH] trim_character
FROM source_string)
```





In this syntax:





- `source_string`: Specify the string that you want to remove specified characters.
-
- `trim_character`: Specify the trim characters.
-
- `LEADING`: This option instructs the function to remove the leading occurrences of the specified trim character.
-
- `TRAILING`: This option instructs the function to remove trailing occurrences of the specified trim character.
-
- `BOTH`: This option instructs the function to remove both leading and trailing occurrences of the specified trim character.





The `TRIM()` function can be very useful when you want to clean up strings.





To remove specific characters from the beginning of a string, you use the [LTRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-ltrim/) function. To remove specific characters from the end of a string, you can use the [RTRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-rtrim/) function.





## PostgreSQL TRIM() function examples





Let's explore some examples of using the `TRIM()` function.





### 1) Basic PostgreSQL TRIM() function example





The following example uses the `TRIM()` function to remove leading and trailing spaces from the string `' PostgreSQL '`:





```
SELECT TRIM('   PostgreSQL   ') AS trimmed_string;
```





Output:





```
 trimmed_string
----------------
 PostgreSQL
(1 row)
```





The output is a string without leading and trailing spaces.





### 2) Using the PostgreSQL TRIM() function to remove specific characters





The following example uses the `TRIM()` function to remove leading and trailing hash symbols (`#`) from the string `'##PostgreSQL##'`:





```
SELECT TRIM('#' FROM '##PostgreSQL##') AS trimmed_string;
```





Output:





```
 trimmed_string
----------------
 PostgreSQL
(1 row)
```





### 3) Using the TRIM() function to remove specific characters by specifying the trim location





The following example uses the PostgreSQL `TRIM()` function to remove leading, trailing, and both leading and trailing zeros from the string `'0000123450'`:





```
SELECT TRIM(LEADING '0' FROM '000123450') AS trimmed_string_leading,
       TRIM(TRAILING '0' FROM '000123450') AS trimmed_string_trailing,
       TRIM(BOTH '0' FROM '000123450') AS trimmed_string_both;
```





Output:





```
 trimmed_string_leading | trimmed_string_trailing | trimmed_string_both
------------------------+-------------------------+---------------------
 123450                 | 00012345                | 12345
(1 row)
```





### 4) Using the TRIM() function with table data





First, [create a table](/docs/postgresql/postgresql-create-table/) called `todo` and [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert) some sample data:





```
CREATE TABLE todo(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOL NOT NULL DEFAULT false
);

INSERT INTO todo(title)
VALUES
  ('   Learn PostgreSQL   '),
  ('Build an App   ')
RETURNING *;
```





Output:





```
 id |         title          | completed
----+------------------------+-----------
  1 |    Learn PostgreSQL    | f
  2 | Build an App           | f
(2 rows)
```





Second, remove the leading and trailing spaces from the `title` column using the `TRIM()` function:





```
UPDATE todo
SET title = TRIM(title);
```





Output:





```
UPDATE 2
```





Third, verify the updates:





```
SELECT * FROM todo;
```





Output:





```
 id |      title       | completed
----+------------------+-----------
  1 | Learn PostgreSQL | f
  2 | Build an App     | f
(2 rows)
```





## Summary





- Use the PostgreSQL `TRIM()` function to remove a specified leading, trailing, or both leading and trailing characters from a string.


