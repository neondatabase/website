---
title: 'PostgreSQL DATE Data Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: This tutorial discusses PostgreSQL `DATE` data type and shows how to use some handy date functions to handle date values.





## Introduction to the PostgreSQL DATE data type





PostgreSQL offers the `DATE` data type that allows you to store date data.





PostgreSQL uses 4 bytes to store a date value. The lowest and highest values of the `DATE` data type are 4713 BC and 5874897 AD, respectively.





When storing a date value, PostgreSQL uses the `yyyy-mm-dd` format such as 2000-12-31. It also uses the same format for [inserting data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into a `DATE` column.





If you [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) that has a `DATE` column and want to use the current date of the PostgreSQL server as the default value, you can use the `CURRENT_DATE` as the default value of the column using a [DEFAULT constraint](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-default-value/)





For example, the following statement creates the `documents` table that has the `posting_date` column with the `DATE` data type.





```
CREATE TABLE documents (
  document_id SERIAL PRIMARY KEY,
  header_text VARCHAR (255) NOT NULL,
  posting_date DATE NOT NULL DEFAULT CURRENT_DATE
);
```





The `posting_date` column accepts the current date as the default value. It means that if you don't provide a value when inserting a new row into the `documents` table, PostgreSQL will insert the current date into the `posting_date` column. For example:





```
INSERT INTO documents (header_text)
VALUES ('Billing to customer XYZ')
RETURNING *;
```





Output:





```
 document_id |       header_text       | posting_date
-------------+-------------------------+--------------
           1 | Billing to customer XYZ | 2024-02-01
(1 row)
```





Note that you may get a different posting date value based on the current date of your database server.





## PostgreSQL DATE functions





For the demonstration, we will [create a new `employees` table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) that consists of `employee_id`, `first_name`, `last_name`, `birth_date`, and `hire_date` columns, where the data types of the `birth_date` and `hire_date` columns are `DATE`.





```
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  birth_date DATE NOT NULL,
  hire_date DATE NOT NULL
);

INSERT INTO employees (first_name, last_name, birth_date, hire_date)
VALUES ('Shannon','Freeman','1980-01-01','2005-01-01'),
       ('Sheila','Wells','1978-02-05','2003-01-01'),
       ('Ethel','Webb','1975-01-01','2001-01-01')
RETURNING *;
```





Output:





```
 employee_id | first_name | last_name | birth_date | hire_date
-------------+------------+-----------+------------+------------
           1 | Shannon    | Freeman   | 1980-01-01 | 2005-01-01
           2 | Sheila     | Wells     | 1978-02-05 | 2003-01-01
           3 | Ethel      | Webb      | 1975-01-01 | 2001-01-01
(3 rows)


INSERT 0 3
```





### 1) Get the current date





To get the current date and time, you use the built-in `NOW()` function:





```
SELECT NOW();
```





Output:





```
              now
-------------------------------
 2024-02-01 08:48:09.599933+07
(1 row)
```





To get the date part only (without the time part), you use the cast operator (::) to cast a `DATETIME` value to a `DATE` value:





```
SELECT NOW()::date;
```





Output:





```
    now
------------
 2024-02-01
(1 row)
```





A quick way to get the current date is to use the `CURRENT_DATE` function:





```
SELECT CURRENT_DATE;
```





Output:





```
 current_date
--------------
 2024-02-01
(1 row)
```





The result is in the format `yyyy-mm-dd`. However, you can use a different format by formatting the date value using the `TO_CHAR()` function.





### 2) Output a PostgreSQL date value in a specific format





To output a date value in a specific format, you use the `TO_CHAR()` function.





The `TO_CHAR()` function accepts two parameters. The first parameter is the value you want to format, and the second is the template that defines the output format.





For example, to display the current date in `dd/mm/yyyy` format, you use the following statement:





```
SELECT TO_CHAR(CURRENT_DATE, 'dd/mm/yyyy');
```





```
  to_char
------------
 01/02/2024
(1 row)
```





To display a date in a format like `Feb 01, 2024`, you use the following statement:





```
SELECT TO_CHAR(CURRENT_DATE, 'Mon dd, yyyy');
```





```
   to_char
--------------
 Feb 01, 2024
(1 row)
```





### 3) Get the interval between two dates





To get the [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/) between two dates, you use the minus (`-`) operator.





The following example retrieves the service days of employees by subtracting the values in the `hire_date` column from today's date:





```
SELECT
  first_name,
  last_name,
  now() - hire_date as diff
FROM
  employees;
```





Output:





```
 first_name | last_name |           diff
------------+-----------+---------------------------
 Shannon    | Freeman   | 6970 days 08:51:20.824847
 Sheila     | Wells     | 7701 days 08:51:20.824847
 Ethel      | Webb      | 8431 days 08:51:20.824847
(3 rows)
```





### 4) Calculate ages in years, months, and days





To calculate age at the current date in years, months, and days, you use the `AGE()` function.





The following statement uses the `AGE()` function to calculate the ages of employees in the `employees` table.





```
SELECT
	employee_id,
	first_name,
	last_name,
	AGE(birth_date)
FROM
	employees;
```





Output:





```
 employee_id | first_name | last_name |           age
-------------+------------+-----------+--------------------------
           1 | Shannon    | Freeman   | 44 years 1 mon
           2 | Sheila     | Wells     | 45 years 11 mons 24 days
           3 | Ethel      | Webb      | 49 years 1 mon
(3 rows)
```





If you pass a date value to the `AGE()` function, it will subtract the date value from the current date.





If you pass two arguments to the `AGE()` function, it will subtract the second argument from the first argument.





For example, to get the age of employees on `01/01/2015`, you use the following statement:





```
SELECT
  employee_id,
  first_name,
  last_name,
  age('2015-01-01', birth_date)
FROM
  employees;
```





Output:





```
 employee_id | first_name | last_name |           age
-------------+------------+-----------+--------------------------
           1 | Shannon    | Freeman   | 35 years
           2 | Sheila     | Wells     | 36 years 10 mons 24 days
           3 | Ethel      | Webb      | 40 years
(3 rows)
```





### 5) Extract year, quarter, month, week, and day from a date value





To get the year, quarter, month, week, and day from a date value, you use the `EXTRACT()` function.





The following statement extracts the year, month, and day from the birth dates of employees:





```
SELECT
	employee_id,
	first_name,
	last_name,
	EXTRACT (YEAR FROM birth_date) AS YEAR,
	EXTRACT (MONTH FROM birth_date) AS MONTH,
	EXTRACT (DAY FROM birth_date) AS DAY
FROM
	employees;
```





Output:





```
 employee_id | first_name | last_name | year | month | day
-------------+------------+-----------+------+-------+-----
           1 | Shannon    | Freeman   | 1980 |     1 |   1
           2 | Sheila     | Wells     | 1978 |     2 |   5
           3 | Ethel      | Webb      | 1975 |     1 |   1
(3 rows)
```





In this tutorial, you have learned about the PostgreSQL `DATE` data type and some handy functions to handle date data.


