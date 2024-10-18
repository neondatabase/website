---
title: 'PostgreSQL ALTER SCHEMA'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-alter-schema/
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ALTER-SCHEMA-change-owner-example.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER SCHEMA` statement to modify the definition of a schema.

## Introduction to PostgreSQL ALTER SCHEMA statement

The `ALTER SCHEMA` statement allows you to change the definition of a [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/). For example, you can rename a schema as follows:

```
ALTER SCHEMA schema_name
RENAME TO new_name;
```

In this syntax:

- First, specify the name of the schema that you want to rename after the `ALTER SCHEMA` keywords.
-
- Second, specify the new name of the schema after the `RENAME TO` keywords.

Note that to execute this statement, you must be the owner of the schema and you must have the `CREATE` privilege for the database.

Besides renaming a schema, the `ALTER SCHEMA` also allows you to change the owner of a schema to the new one as shown in the following statement:

```
ALTER SCHEMA schema_name
OWNER TO { new_owner | CURRENT_USER | SESSION_USER};
```

In this statement:

- First, specify the name of the schema to which you want to change the owner in the `ALTER SCHEMA` clause.
-
- Second, specify the new owner in the `OWNER TO` clause.

## PostgreSQL ALTER SCHEMA statement examples

Let's take some examples of using the `ALTER SCHEMA` statement to get a better understanding.

Notice that the examples in the following part are based on the schema created in the `CREATE SCHEMA` tutorial.

### 1) Using ALTER SCHEMA statement to rename a schema examples

This example uses the `ALTER SCHEMA` statement to rename the schema `doe` to `finance`:

```
ALTER SCHEMA doe
RENAME TO finance;
```

Similarly, the following example renames the `john` schema to accounting:

```
ALTER SCHEMA john
RENAME TO accounting;
```

### 2) Using `ALTER SCHEMA` statement to change the owner of a schema example

The following example uses the `ALTER SCHEMA` statement to change the owner of the schema accounting from `john` to `postgres`:

```
ALTER SCHEMA finance
OWNER TO postgres;
```

Here is the statement to query the user-created schema:

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

The output is:

![PostgreSQL ALTER SCHEMA - change owner example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ALTER-SCHEMA-change-owner-example.png)

The output indicates that the `finance` schema now is owned by the owner with id 10, which is `postgres`.

Likewise, this statement changes the owner of the accounting schema to `postgres`:

```
ALTER SCHEMA accounting
OWNER TO postgres;
```

![PostgreSQL ALTER SCHEMA - change owner example 2](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ALTER-SCHEMA-change-owner-example-2.png)

In this tutorial, you have learned how to use the PostgreSQL `ALTER SCHEMA` statement to rename a schema or change the owner of a schema to a new one.
