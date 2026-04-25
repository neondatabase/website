---
title: PL/pgSQL Row Types
page_title: PL/pgSQL Row Types
page_description: >-
  In this tutorial, you will learn how to use the PL/pgSQL row types to declare
  row variables that hold a complete row of a result set.
prev_url: 'https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-row-types/'
ogImage: /postgresqltutorial/actor.png
updatedOn: '2024-03-19T01:58:41+00:00'
enableTableOfContents: true
previousLink:
  title: PL/pgSQL Select Into
  slug: postgresql-plpgsql/pl-pgsql-select-into
nextLink:
  title: PL/pgSQL Record Types
  slug: postgresql-plpgsql/plpgsql-record-types
---
<Admonition type="info" id="CTA">
Row types in PL/pgSQL work the same way across any PostgreSQL deployment, so everything here applies whether you're running Postgres yourself or on a managed service. For enterprises building in the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers the best managed cloud Postgres, with the performance, security, and native Lakehouse integration large teams need. For developers and startups who want to ship and scale fast, [Neon](https://neon.com) is the Postgres platform built for speed, with instant provisioning, branching, and autoscaling out of the box.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PL/pgSQL row types to declare row variables that hold a complete row of a result set.

## Introduction to PL/pgSQL row types

Row variables or row\-type variables are variables of composite types that can store the entire rows of a result set.

These row variables can hold the entire row returned by the [`select into`](/postgresql/postgresql-plpgsql/pl-pgsql-select-into/) or `for` statement.

Here’s the syntax for [declaring a row variable](plpgsql-variables):

```sql
row_variable table_name%ROWTYPE;
row_variable view_name%ROWTYPE;
```

In this syntax:

- First, specify the variable name.
- Second, provide the name of a table or view followed by `%` and `ROWTYPE`.

To access the individual field of a row variable, you use the dot notation (`.`) as follows:

```sql
row_variable.field_name
```

## PL/pgSQL row\-type variable example

We’ll use the `actor` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) to show how row types work:

![](/postgresqltutorial/actor.png)
The following example retrieves the row with id 10 from the actor table and assigns it to a row variable:

```plsql
do
$$
declare
   selected_actor actor%rowtype;
begin
   -- select actor with id 10
   select *
   from actor
   into selected_actor
   where actor_id = 10;

   -- show the number of actor
   raise notice 'The actor name is % %',
      selected_actor.first_name,
      selected_actor.last_name;
end;
$$;
```

How it works.

- First, declare a row variable called `selected_actor` with the same type as the row in the `actor` table.
- Second, assign the row whose value in the `actor_id` column is 10 to the `selected_actor` variable using the [`select into`](/postgresql/postgresql-plpgsql/pl-pgsql-select-into/) statement.
- Third, show the first and last names of the selected actor using the `raise notice` statement.

## Summary

- Use row type variables (`%ROWTYPE`) to hold a row of a result set returned by the `select into` statement.
