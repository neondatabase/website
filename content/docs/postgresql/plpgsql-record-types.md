---
title: 'PL/pgSQL Record Types'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/plpgsql-record-types
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PL/pgSQL record types, which enables you to define variables that can hold a single row from a result set.

## Introduction to PL/pgSQL record types

PostgreSQL provides a "type" called the `record` that is similar to the [row-type](/docs/postgresql/plpgsql-row-types).

It's important to note that a record isn't a true type but rather a placeholder. Furthermore, the structure of a record variable will change when you reassign it to another value.

To declare a `record` variable, you simply use a variable name followed by the `record` keyword like this:

```
variable_name record;
```

A `record` variable is similar to a [row-type variable](https://www.postgresqltutorial.com/plpgsql-row-types/), which can hold only one row of a result set.

Unlike a row-type variable, a `record` variable lacks a predefined structure. Instead, the structure of a `record` variable is determined when an actual row is assigned to it via the `select` or `for` statement.

To access a field in the record, you use the dot notation (`.`) syntax like this:

```
record_variable.field_name;
```

If you attempt to access a field in a record variable before it's assigned, you'll encounter an error.

## PL/pgSQL record examples

Let's take some examples of using the record variables.

### 1) Using record with the select into statement

The following example illustrates how to use the record variable with the `select into` statement:

```
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
-
- Second use the `select into` statement to select a row whose `film_id` is 200 into the `rec` variable
-
- Third, print out the information of the film via the record variable.

### 2) Using record variables in the for loop statement

The following shows how to use a record variable in a `for loop` statement:

```
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

Note that you will learn more about the `for loop` statement in the [for-loop tutorial](/docs/postgresql/postgresql-plpgsql/plpgsql-for-loop).

How it works:

- First, declare a variable named r with the type `record`.
-
- Second, use the `for loop` statement to fetch rows from the `film` table (in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/)). The `for loop` statement assigns the row that consists of `title` and `length` to the `rec` variable in each iteration.
-
- Third, show the contents of the fields of the record variable by using the dot notation (`rec.title` and `rec.length`)

## Summary

- A record is a placeholder that can hold a single row of a result set.
-
- A record does not have a predefined structure like a row variable. Its structure is determined when you assign a row to it.
