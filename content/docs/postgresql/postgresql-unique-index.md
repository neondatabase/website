---
title: 'PostgreSQL UNIQUE Index'
redirectFrom: 
            - /docs/postgresql/postgresql-indexes/postgresql-unique-index
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to create a PostgreSQL unique index to ensure the uniqueness of values in one or more columns.

## Introduction to PostgreSQL UNIQUE index

The PostgreSQL unique index enforces the uniqueness of values in one or multiple columns.

To create a unique index, you use the following `CREATE UNIQUE INDEX` statement:

```sql
CREATE UNIQUE INDEX index_name
ON table_name (column [, ...])
[ NULLS [ NOT ] DISTINCT ];
```

In this syntax:

- First, specify the index name in the `CREATE UNIQUE INDEX` statement.
- Second, provide the name of the table along with a list of indexed columns in the ON clause.
- Third, the `NULL NOT DISTINCT` option treats nulls as equal, whereas `NULLS DISTINCT` treats nulls as distinct values. By default, the statement uses `NULLS DISTINCT`, meaning that the indexed column may contain multiple nulls.

PostgreSQL offers [multiple index types](/docs/postgresql/postgresql-indexes/postgresql-index-types), but only the B-tree index type supports unique indexes.

When you define a unique index for a column, the column cannot store multiple rows with the same values.

If you define a unique index for two or more columns, the combined values in these columns cannot be duplicated in multiple rows.

When you define a [primary key](/docs/postgresql/postgresql-primary-key) or a [unique constraint](/docs/postgresql/postgresql-tutorial/postgresql-unique-constraint) for a table, PostgreSQL automatically creates a corresponding unique index.

## PostgreSQL UNIQUE index examples

Let's explore some examples of using the PostgreSQL unique indexes.

### 1) Unique indexes for a primary key column and a column with a unique constraint

First, [create a table](/docs/postgresql/postgresql-create-table) called `employees` :

```sql
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);
```

In this statement, the `employee_id` is the [primary key](/docs/postgresql/postgresql-primary-key) column and `email` column has a [unique constraint](/docs/postgresql/postgresql-tutorial/postgresql-unique-constraint), therefore, PostgreSQL creates two `UNIQUE` indexes, one for each column.

Second, show the indexes of the `employees` table:

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename = 'employees';
```

Here is the output:

```
 tablename |      indexname      |                                     indexdef
-----------+---------------------+----------------------------------------------------------------------------------
 employees | employees_pkey      | CREATE UNIQUE INDEX employees_pkey ON public.employees USING btree (employee_id)
 employees | employees_email_key | CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email)
(2 rows)
```

### 2) Using PostgreSQL UNIQUE index for single column example

First, [add a column](/docs/postgresql/postgresql-add-column) named `mobile_phone` to the `employees` table:

```sql
ALTER TABLE employees
ADD mobile_phone VARCHAR(20);
```

To ensure that the mobile phone numbers are distinct for all employees, you can define a unique index for the `mobile_phone` column using the `CREATE INDEX` statement.

Second, create a unique index on the `mobile_phone` column of the `employees` table:

```sql
CREATE UNIQUE INDEX idx_employees_mobile_phone
ON employees(mobile_phone);
```

Third, [insert a new row](/docs/postgresql/postgresql-insert) into the `employees` table:

```sql
INSERT INTO employees(first_name, last_name, email, mobile_phone)
VALUES ('John','Doe','john.doe@postgresqltutorial.com', '(408)-555-1234');
```

Fourth, attempt to insert another row with the same phone number:

```sql
INSERT INTO employees(first_name, last_name, email, mobile_phone)
VALUES ('Jane','Doe','jane.doe@postgresqltutorial.com', '(408)-555-1234');
```

PostgreSQL issues the following error due to the duplicate mobile phone number:

```sql
ERROR:  duplicate key value violates unique constraint "idx_employees_mobile_phone"
DETAIL:  Key (mobile_phone)=((408)-555-1234) already exists.
```

### 3) Using PostgreSQL UNIQUE index for multiple columns

First, [add two new columns](/docs/postgresql/postgresql-add-column) called `work_phone` and `extension` to the `employees` table:

```sql
ALTER TABLE employees
ADD work_phone VARCHAR(20),
ADD extension VARCHAR(5);
```

Multiple employees can share the same work phone number. However, they cannot have the same extension number.

To enforce this rule, you can define a unique index on both `work_phone` and `extension` columns.

Next, create a unique index that includes both `work_phone` and `extension` columns:

```sql
CREATE UNIQUE INDEX idx_employees_workphone
ON employees(work_phone, extension);
```

Then, insert a row into the `employees` table:

```sql
INSERT INTO employees(first_name, last_name, work_phone, extension)
VALUES('Lily', 'Bush', '(408)-333-1234','1212');
```

After that, insert another employee with the same work phone number but a different extension:

```sql
INSERT INTO employees(first_name, last_name, work_phone, extension)
VALUES('Joan', 'Doe', '(408)-333-1234','1211');
```

The statement works because the combination of values in the `work_phone` and `extension` column is unique.

Finally, attempt to insert a row with the same values in both `work_phone` and `extension` columns that already exist in the `employees` table:

```sql
INSERT INTO employees(first_name, last_name, work_phone, extension)
VALUES('Tommy', 'Stark', '(408)-333-1234','1211');
```

PostgreSQL issued the following error:

```sql
ERROR:  duplicate key value violates unique constraint "idx_employees_workphone"
DETAIL:  Key (work_phone, extension)=((408)-333-1234, 1211) already exists.
```

## Summary

- Use a PostgreSQL unique index to enforce the uniqueness of values in a column or a set of columns.
- PostgreSQL automatically creates a unique index for a primary key column or a column with a unique constraint.
