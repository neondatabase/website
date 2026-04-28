---
title: PL/pgSQL Record Types
page_title: PL/pgSQL Record Types Explained Clearly By Examples
page_description: >-
  You will learn about the PL/pgSQL record types that allow you to define
  variables that can hold a sinle row of a result set.
prev_url: 'https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-record-types/'
ogImage: ''
updatedOn: '2024-03-19T02:14:47+00:00'
enableTableOfContents: true
previousLink:
  title: PL/pgSQL Row Types
  slug: postgresql-plpgsql/pl-pgsql-row-types
nextLink:
  title: PL/pgSQL Constants
  slug: postgresql-plpgsql/plpgsql-constants
---
<Admonition type="info" id="CTA">
PL/pgSQL record types work the same across any PostgreSQL deployment, so everything here applies whether you're running Postgres yourself or on a managed service. If you're an enterprise looking for managed Postgres built for the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers high performance, strong security, and deep integration with the Lakehouse. If you're a developer or startup who needs to ship and scale quickly, [Neon](https://neon.com) gives you the fastest path to a production-ready Postgres platform.
</Admonition>

**Summary**: in this tutorial, you will learn about the PL/pgSQL record types, which enables you to define variables that can hold a single row from a result set.

## Introduction to PL/pgSQL record types

PostgreSQL provides a “type” called the `record` that is similar to the [row\-type](/postgresql/postgresql-plpgsql/pl-pgsql-row-types).

It’s important to note that a record isn’t a true type but rather a placeholder. Furthermore, the structure of a record variable will change when you reassign it to another value.

To declare a `record` variable, you simply use a variable name followed by the `record` keyword like this:

```plsql
variable_name record;
```

A `record` variable is similar to a [row\-type variable](/postgresql/postgresql-plpgsql/pl-pgsql-row-types), which can hold only one row of a result set.

Unlike a row\-type variable, a `record` variable lacks a predefined structure. Instead, the structure of a `record` variable is determined when an actual row is assigned to it via the [`select`](/postgresql/postgresql-plpgsql/pl-pgsql-select-into/) or [`for`](plpgsql-for-loop) statement.

To access a field in the record, you use the dot notation (`.`) syntax like this:

```plsql
record_variable.field_name;
```

If you attempt to access a field in a record variable before it’s assigned, you’ll encounter an error.

## PL/pgSQL record examples

Let’s take some examples of using the record variables.

### 1\) Using record with the select into statement

The following example illustrates how to use the record variable with the `select into` statement:

```plsql
do
$$
declare
	rec record;
begin
	-- select the film
	select film_id, title, length
	into rec
	from film
	where film_id = 200;

	raise notice '% % %', rec.film_id, rec.title, rec.length;

end;
$$
language plpgsql;
```

How it works.

- First, declare a record variable called `rec` in the declaration section.
- Second use the `select into` statement to select a row whose `film_id` is 200 into the `rec` variable
- Third, print out the information of the film via the record variable.

### 2\) Using record variables in the for loop statement

The following shows how to use a record variable in a `for loop` statement:

```plsql
do
$$
declare
	rec record;
begin
	for rec in select title, length
			from film
			where length > 50
			order by length
	loop
		raise notice '% (%)', rec.title, rec.length;
	end loop;
end;
$$;
```

Here is the partial output:

```
NOTICE:  Hall Cassidy (51)
NOTICE:  Champion Flatliners (51)
NOTICE:  Deep Crusade (51)
NOTICE:  Simon North (51)
NOTICE:  English Bulworth (51)
...
```

Note that you will learn more about the [`for loop`](plpgsql-for-loop) statement in the [for\-loop tutorial](plpgsql-for-loop).

How it works:

- First, declare a variable named r with the type `record`.
- Second, use the `for loop` statement to fetch rows from the `film` table (in the [sample database](../postgresql-getting-started/postgresql-sample-database)). The `for loop` statement assigns the row that consists of `title` and `length` to the `rec` variable in each iteration.
- Third, show the contents of the fields of the record variable by using the dot notation (`rec.title` and `rec.length`)

## Summary

- A record is a placeholder that can hold a single row of a result set.
- A record does not have a predefined structure like a row variable. Its structure is determined when you assign a row to it.
