---
title: 'PostgreSQL Change Column Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-change-column-type/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: this tutorial shows you step-by-step how to change the data type of a column by using the `ALTER TABLE... ALTER COLUMN` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL change column type statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To change the [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/) of a column, you use the [`ALTER TABLE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/) statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name
[SET DATA] TYPE new_data_type;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table to which the column you want to change after the `ALTER TABLE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide the name of the column that you want to change the data type after the `ALTER COLUMN` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, supply the new data type for the column after the `TYPE` keyword. The `SET DATA TYPE` and `TYPE` are equivalent.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

To change the data types of multiple columns in a single statement, you use multiple `ALTER COLUMN` clauses like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name1 [SET DATA] TYPE new_data_type,
ALTER COLUMN column_name2 [SET DATA] TYPE new_data_type,
...;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, you add a comma (`,`) after each `ALTER COLUMN` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL allows you to convert the values of a column to the new ones while changing its data type by adding a `USING` clause as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name TYPE new_data_type USING expression;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `USING` clause specifies an expression that allows you to convert the old values to the new ones.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you omit the `USING` clause, PostgreSQL will cast the values to the new ones implicitly. If the cast fails, PostgreSQL will issue an error and recommend you provide the `USING` clause with an expression for the data conversion.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The expression after the `USING` keyword can be as simple as `column_name::new_data_type` such as `price::numeric` or as complex as a custom function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL change column type examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of changing column type.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Setting up a sample table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following [creates a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `assets` and [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) some rows into the table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE assets (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    asset_no VARCHAR NOT NULL,
    description TEXT,
    location TEXT,
    acquired_date DATE NOT NULL
);

INSERT INTO assets(name,asset_no,location,acquired_date)
VALUES('Server','10001','Server room','2017-01-01'),
      ('UPS','10002','Server room','2017-01-01')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |  name  | asset_no | description |  location   | acquired_date
----+--------+----------+-------------+-------------+---------------
  1 | Server | 10001    | null        | Server room | 2017-01-01
  2 | UPS    | 10002    | null        | Server room | 2017-01-01
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Changing one column example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `ALTER TABLE ... ALTER COLUMN` statement to change the data type of the `name` column to [`VARCHAR`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE assets
ALTER COLUMN name TYPE VARCHAR(255);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the statement successfully changed the type of the column.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Changing multiple columns example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement changes the data types of `description` and `location` columns from [`TEXT`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/) to `VARCHAR`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE assets
    ALTER COLUMN location TYPE VARCHAR(255),
    ALTER COLUMN description TYPE VARCHAR(255);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Changing a column from VARCHAR to INT example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `ALTER TABLE ... ALTER COLUMN` statement to change the data type of the `asset_no` column to [integer](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE assets
ALTER COLUMN asset_no TYPE INT;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issued an error and a helpful hint:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  column "asset_no" cannot be cast automatically to type integer
HINT:  You might need to specify "USING asset_no::integer".
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To both change the type of a column and cast data from `VARCHAR` to `INT`, you can use the `USING` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE assets
ALTER COLUMN asset_no TYPE INT
USING asset_no::integer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER TABLE ... ALTER COLUMN` statement to change the data type of a column.
- <!-- /wp:list-item -->

<!-- /wp:list -->
