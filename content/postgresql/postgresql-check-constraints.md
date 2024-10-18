---
title: 'PostgreSQL CHECK Constraints'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-check-constraint/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL `CHECK` constraints and how to use them to constrain values in columns of a table based on a boolean expression.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CHECK constraints

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a `CHECK` constraint ensures that values in a column or a group of columns meet a specific condition.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A check constraint allows you to enforce data integrity rules at the database level. A check constraint uses a boolean expression to evaluate the values, ensuring that only valid data is [inserted](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) or [updated](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) in a table.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Creating CHECK constraints

<!-- /wp:heading -->

<!-- wp:paragraph -->

Typically, you create a check constraint when creating a table using the `CREATE TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE table_name(
   column1 datatype,
   ...,
   CONSTRAINT constraint_name CHECK(condition)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the constraint name after the `CONSTRAINT` keyword. This is optional. If you omit it, PostgreSQL will automatically generate a name for the `CHECK` constraint.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, define a condition that must be satisfied for the constraint to be valid.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

If the `CHECK` constraint involves only one column, you can define it as a column constraint like this:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE table_name(
   column1 datatype,
   column1 datatype CHECK(condition),
   ...,
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

By default, PostgreSQL assigns a name to a `CHECK` constraint using the following format:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
{table}_{column}_check
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Adding CHECK constraints to tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

To add a `CHECK` constraint to an existing table, you use the `ALTER TABLE ... ADD CONSTRAINT` statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE table_name
ADD CONSTRAINT constraint_name CHECK (condition);
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Removing CHECK constraints

<!-- /wp:heading -->

<!-- wp:paragraph -->

To drop a `CHECK` constraint, you use the `ALTER TABLE ... DROP CONSTRAINT` statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL CHECK constraint examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `CHECK` constraints.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Defining PostgreSQL CHECK constraint for a new table

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new table called `employees` with some `CHECK` constraints:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  birth_date DATE NOT NULL,
  joined_date DATE NOT NULL,
  salary numeric CHECK(salary > 0)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement, the `employees` table has one `CHECK` constraint that enforces the values in the salary column greater than zero.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, attempt to [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) a new row with a negative salary into the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO employees (first_name, last_name, birth_date, joined_date, salary)
VALUES ('John', 'Doe', '1972-01-01', '2015-07-01', -100000);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  new row for relation "employees" violates check constraint "employees_salary_check"
DETAIL:  Failing row contains (1, John, Doe, 1972-01-01, 2015-07-01, -100000).
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The insert fails because the `CHECK` constraint on the `salary` column accepts only positive values.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Adding PostgreSQL CHECK constraints for existing tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, use the `ALTER TABLE ... ADD CONSTRAINT` statement to add a `CHECK` constraint to the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE employees
ADD CONSTRAINT joined_date_check
CHECK ( joined_date >  birth_date );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `CHECK` constraint ensures that the joined date is later than the birthdate.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, attempt to insert a new row into the `employees` table with the joined date is earlier than the birth date:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INSERT INTO employees (first_name, last_name, birth_date, joined_date, salary)
VALUES ('John', 'Doe', '1990-01-01', '1989-01-01', 100000);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ERROR:  new row for relation "employees" violates check constraint "joined_date_check"
DETAIL:  Failing row contains (2, John, Doe, 1990-01-01, 1989-01-01, 100000).
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the data violates the check constraint "joined_date_check".

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using functions in CHECK constraints

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example adds a `CHECK` constraint to ensure that the first name has at least 3 characters:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE employees
ADD CONSTRAINT first_name_check
CHECK ( LENGTH(TRIM(first_name)) >= 3);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we define a condition using the `TRIM()` and `LENGTH()` functions:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, the `TRIM()` function removes leading and trailing whitespaces from the first_name.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, the `LENGTH()` function returns the character length of the result of the `TRIM()` function.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The whole expression `LENGTH(TRIM(first_name)) >= 3` ensures the first name contains three or more characters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement will fail because it attempts to insert a row into the `employees` table with the first name that has 2 characters:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INSERT INTO employees (first_name, last_name, birth_date, joined_date, salary)
VALUES ('Ab', 'Doe', '1990-01-01', '2008-01-01', 100000);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ERROR:  new row for relation "employees" violates check constraint "first_name_check"
DETAIL:  Failing row contains (4, Ab, Doe, 1990-01-01, 2008-01-01, 100000).
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Removing a CHECK constraint example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement removes the `CHECK` constraint `joined_date_check` from the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE employees
DROP CONSTRAINT joined_date_check;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use PostgreSQL `CHECK` constraint to check the values of columns based on a boolean expression.
- <!-- /wp:list-item -->

<!-- /wp:list -->
