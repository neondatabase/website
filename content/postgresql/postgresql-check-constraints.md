---
prevPost: postgresql-delete-cascade
nextPost: postgresql-unique-constraint
createdAt: 2015-08-31T05:05:07.000Z
title: 'PostgreSQL CHECK Constraints'
redirectFrom: 
            - /postgresql/postgresql-tutorial/postgresql-check-constraint
            - /postgresql/postgresql-check-constraint
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL `CHECK` constraints and how to use them to constrain values in columns of a table based on a boolean expression.

## Introduction to PostgreSQL CHECK constraints

In PostgreSQL, a `CHECK` constraint ensures that values in a column or a group of columns meet a specific condition.

A check constraint allows you to enforce data integrity rules at the database level. A check constraint uses a boolean expression to evaluate the values, ensuring that only valid data is [inserted](/postgresql/postgresql-insert) or [updated](/postgresql/postgresql-tutorial/postgresql-update) in a table.

### Creating CHECK constraints

Typically, you create a check constraint when creating a table using the `CREATE TABLE` statement:

```sql
CREATE TABLE table_name(
   column1 datatype,
   ...,
   CONSTRAINT constraint_name CHECK(condition)
);
```

In this syntax:

- First, specify the constraint name after the `CONSTRAINT` keyword. This is optional. If you omit it, PostgreSQL will automatically generate a name for the `CHECK` constraint.
-
- Second, define a condition that must be satisfied for the constraint to be valid.

If the `CHECK` constraint involves only one column, you can define it as a column constraint like this:

```sql
CREATE TABLE table_name(
   column1 datatype,
   column1 datatype CHECK(condition),
   ...,
);
```

By default, PostgreSQL assigns a name to a `CHECK` constraint using the following format:

```
{table}_{column}_check
```

### Adding CHECK constraints to tables

To add a `CHECK` constraint to an existing table, you use the `ALTER TABLE ... ADD CONSTRAINT` statement:

```sql
ALTER TABLE table_name
ADD CONSTRAINT constraint_name CHECK (condition);
```

### Removing CHECK constraints

To drop a `CHECK` constraint, you use the `ALTER TABLE ... DROP CONSTRAINT` statement:

```sql
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```

## PostgreSQL CHECK constraint examples

Let's explore some examples of using the `CHECK` constraints.

### 1) Defining PostgreSQL CHECK constraint for a new table

First, create a new table called `employees` with some `CHECK` constraints:

```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  birth_date DATE NOT NULL,
  joined_date DATE NOT NULL,
  salary numeric CHECK(salary > 0)
);
```

In this statement, the `employees` table has one `CHECK` constraint that enforces the values in the salary column greater than zero.

Second, attempt to [insert](/postgresql/postgresql-insert) a new row with a negative salary into the `employees` table:

```sql
INSERT INTO employees (first_name, last_name, birth_date, joined_date, salary)
VALUES ('John', 'Doe', '1972-01-01', '2015-07-01', -100000);
```

Error:

```sql
ERROR:  new row for relation "employees" violates check constraint "employees_salary_check"
DETAIL:  Failing row contains (1, John, Doe, 1972-01-01, 2015-07-01, -100000).
```

The insert fails because the `CHECK` constraint on the `salary` column accepts only positive values.

### 2) Adding PostgreSQL CHECK constraints for existing tables

First, use the `ALTER TABLE ... ADD CONSTRAINT` statement to add a `CHECK` constraint to the `employees` table:

```sql
ALTER TABLE employees
ADD CONSTRAINT joined_date_check
CHECK ( joined_date >  birth_date );
```

The `CHECK` constraint ensures that the joined date is later than the birthdate.

Second, attempt to insert a new row into the `employees` table with the joined date is earlier than the birth date:

```sql
INSERT INTO employees (first_name, last_name, birth_date, joined_date, salary)
VALUES ('John', 'Doe', '1990-01-01', '1989-01-01', 100000);
```

Output:

```sql
ERROR:  new row for relation "employees" violates check constraint "joined_date_check"
DETAIL:  Failing row contains (2, John, Doe, 1990-01-01, 1989-01-01, 100000).
```

The output indicates that the data violates the check constraint "joined_date_check".

### 3) Using functions in CHECK constraints

The following example adds a `CHECK` constraint to ensure that the first name has at least 3 characters:

```sql
ALTER TABLE employees
ADD CONSTRAINT first_name_check
CHECK ( LENGTH(TRIM(first_name)) >= 3);
```

In this example, we define a condition using the `TRIM()` and `LENGTH()` functions:

- First, the `TRIM()` function removes leading and trailing whitespaces from the first_name.
-
- Second, the `LENGTH()` function returns the character length of the result of the `TRIM()` function.

The whole expression `LENGTH(TRIM(first_name)) >= 3` ensures the first name contains three or more characters.

The following statement will fail because it attempts to insert a row into the `employees` table with the first name that has 2 characters:

```sql
INSERT INTO employees (first_name, last_name, birth_date, joined_date, salary)
VALUES ('Ab', 'Doe', '1990-01-01', '2008-01-01', 100000);
```

Error:

```sql
ERROR:  new row for relation "employees" violates check constraint "first_name_check"
DETAIL:  Failing row contains (4, Ab, Doe, 1990-01-01, 2008-01-01, 100000).
```

### 4) Removing a CHECK constraint example

The following statement removes the `CHECK` constraint `joined_date_check` from the `employees` table:

```sql
ALTER TABLE employees
DROP CONSTRAINT joined_date_check;
```

## Summary

- Use PostgreSQL `CHECK` constraint to check the values of columns based on a boolean expression.
