---
title: 'PostgreSQL ALTER SCHEMA'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-schema/
ogImage: ./img/wp-content-uploads-2019-05-PostgreSQL-ALTER-SCHEMA-change-owner-example.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER SCHEMA` statement to modify the definition of a schema.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL ALTER SCHEMA statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ALTER SCHEMA` statement allows you to change the definition of a [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/). For example, you can rename a schema as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER SCHEMA schema_name
RENAME TO new_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the schema that you want to rename after the `ALTER SCHEMA` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the new name of the schema after the `RENAME TO` keywords.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Note that to execute this statement, you must be the owner of the schema and you must have the `CREATE` privilege for the database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides renaming a schema, the `ALTER SCHEMA` also allows you to change the owner of a schema to the new one as shown in the following statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER SCHEMA schema_name
OWNER TO { new_owner | CURRENT_USER | SESSION_USER};
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the schema to which you want to change the owner in the `ALTER SCHEMA` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the new owner in the `OWNER TO` clause.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## PostgreSQL ALTER SCHEMA statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `ALTER SCHEMA` statement to get a better understanding.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice that the examples in the following part are based on the schema created in the `CREATE SCHEMA` tutorial.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Using ALTER SCHEMA statement to rename a schema examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the `ALTER SCHEMA` statement to rename the schema `doe` to `finance`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER SCHEMA doe
RENAME TO finance;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Similarly, the following example renames the `john` schema to accounting:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER SCHEMA john
RENAME TO accounting;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using `ALTER SCHEMA` statement to change the owner of a schema example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `ALTER SCHEMA` statement to change the owner of the schema accounting from `john` to `postgres`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER SCHEMA finance
OWNER TO postgres;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the statement to query the user-created schema:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT *
FROM
    pg_catalog.pg_namespace
WHERE
    nspacl is NULL AND
    nspname NOT LIKE 'pg_%'
ORDER BY
    nspname;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3927} -->

![PostgreSQL ALTER SCHEMA - change owner example](./img/wp-content-uploads-2019-05-PostgreSQL-ALTER-SCHEMA-change-owner-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The output indicates that the `finance` schema now is owned by the owner with id 10, which is `postgres`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Likewise, this statement changes the owner of the accounting schema to `postgres`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER SCHEMA accounting
OWNER TO postgres;
```

<!-- /wp:code -->

<!-- wp:image {"id":3928} -->

![PostgreSQL ALTER SCHEMA - change owner example 2](./img/wp-content-uploads-2019-05-PostgreSQL-ALTER-SCHEMA-change-owner-example-2.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `ALTER SCHEMA` statement to rename a schema or change the owner of a schema to a new one.

<!-- /wp:paragraph -->
