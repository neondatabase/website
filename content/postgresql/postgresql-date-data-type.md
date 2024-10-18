---
title: 'PostgreSQL DATE Data Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: This tutorial discusses PostgreSQL `DATE` data type and shows how to use some handy date functions to handle date values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL DATE data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL offers the `DATE` data type that allows you to store date data.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL uses 4 bytes to store a date value. The lowest and highest values of the `DATE` data type are 4713 BC and 5874897 AD, respectively.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When storing a date value, PostgreSQL uses the `yyyy-mm-dd` format such as 2000-12-31. It also uses the same format for [inserting data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into a `DATE` column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) that has a `DATE` column and want to use the current date of the PostgreSQL server as the default value, you can use the `CURRENT_DATE` as the default value of the column using a [DEFAULT constraint](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-default-value/)

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement creates the `documents` table that has the `posting_date` column with the `DATE` data type.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE documents (
  document_id SERIAL PRIMARY KEY,
  header_text VARCHAR (255) NOT NULL,
  posting_date DATE NOT NULL DEFAULT CURRENT_DATE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `posting_date` column accepts the current date as the default value. It means that if you don't provide a value when inserting a new row into the `documents` table, PostgreSQL will insert the current date into the `posting_date` column. For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INSERT INTO documents (header_text)
VALUES ('Billing to customer XYZ')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 document_id |       header_text       | posting_date
-------------+-------------------------+--------------
           1 | Billing to customer XYZ | 2024-02-01
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that you may get a different posting date value based on the current date of your database server.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DATE functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

For the demonstration, we will [create a new `employees` table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) that consists of `employee_id`, `first_name`, `last_name`, `birth_date`, and `hire_date` columns, where the data types of the `birth_date` and `hire_date` columns are `DATE`.

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 employee_id | first_name | last_name | birth_date | hire_date
-------------+------------+-----------+------------+------------
           1 | Shannon    | Freeman   | 1980-01-01 | 2005-01-01
           2 | Sheila     | Wells     | 1978-02-05 | 2003-01-01
           3 | Ethel      | Webb      | 1975-01-01 | 2001-01-01
(3 rows)


INSERT 0 3
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Get the current date

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the current date and time, you use the built-in `NOW()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT NOW();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
              now
-------------------------------
 2024-02-01 08:48:09.599933+07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get the date part only (without the time part), you use the cast operator (::) to cast a `DATETIME` value to a `DATE` value:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT NOW()::date;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
    now
------------
 2024-02-01
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

A quick way to get the current date is to use the `CURRENT_DATE` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CURRENT_DATE;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 current_date
--------------
 2024-02-01
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is in the format `yyyy-mm-dd`. However, you can use a different format by formatting the date value using the `TO_CHAR()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Output a PostgreSQL date value in a specific format

<!-- /wp:heading -->

<!-- wp:paragraph -->

To output a date value in a specific format, you use the `TO_CHAR()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `TO_CHAR()` function accepts two parameters. The first parameter is the value you want to format, and the second is the template that defines the output format.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, to display the current date in `dd/mm/yyyy` format, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TO_CHAR(CURRENT_DATE, 'dd/mm/yyyy');
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
  to_char
------------
 01/02/2024
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To display a date in a format like `Feb 01, 2024`, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TO_CHAR(CURRENT_DATE, 'Mon dd, yyyy');
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
   to_char
--------------
 Feb 01, 2024
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Get the interval between two dates

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/) between two dates, you use the minus (`-`) operator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example retrieves the service days of employees by subtracting the values in the `hire_date` column from today's date:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name,
  now() - hire_date as diff
FROM
  employees;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 first_name | last_name |           diff
------------+-----------+---------------------------
 Shannon    | Freeman   | 6970 days 08:51:20.824847
 Sheila     | Wells     | 7701 days 08:51:20.824847
 Ethel      | Webb      | 8431 days 08:51:20.824847
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Calculate ages in years, months, and days

<!-- /wp:heading -->

<!-- wp:paragraph -->

To calculate age at the current date in years, months, and days, you use the `AGE()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement uses the `AGE()` function to calculate the ages of employees in the `employees` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	employee_id,
	first_name,
	last_name,
	AGE(birth_date)
FROM
	employees;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 employee_id | first_name | last_name |           age
-------------+------------+-----------+--------------------------
           1 | Shannon    | Freeman   | 44 years 1 mon
           2 | Sheila     | Wells     | 45 years 11 mons 24 days
           3 | Ethel      | Webb      | 49 years 1 mon
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you pass a date value to the `AGE()` function, it will subtract the date value from the current date.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you pass two arguments to the `AGE()` function, it will subtract the second argument from the first argument.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, to get the age of employees on `01/01/2015`, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  employee_id,
  first_name,
  last_name,
  age('2015-01-01', birth_date)
FROM
  employees;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 employee_id | first_name | last_name |           age
-------------+------------+-----------+--------------------------
           1 | Shannon    | Freeman   | 35 years
           2 | Sheila     | Wells     | 36 years 10 mons 24 days
           3 | Ethel      | Webb      | 40 years
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Extract year, quarter, month, week, and day from a date value

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the year, quarter, month, week, and day from a date value, you use the `EXTRACT()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement extracts the year, month, and day from the birth dates of employees:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 employee_id | first_name | last_name | year | month | day
-------------+------------+-----------+------+-------+-----
           1 | Shannon    | Freeman   | 1980 |     1 |   1
           2 | Sheila     | Wells     | 1978 |     2 |   5
           3 | Ethel      | Webb      | 1975 |     1 |   1
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned about the PostgreSQL `DATE` data type and some handy functions to handle date data.

<!-- /wp:paragraph -->
