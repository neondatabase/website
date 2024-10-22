---
title: "Dollar-Quoted String Constants"
page_title: "PostgreSQL Dollar-quoted String Constants"
page_description: "In this tutorial, you will learn about PostgreSQL Dollar-quoted String Constants ($$) and how to use them in anonymous blocks."
prev_url: "https://www.postgresqltutorial.com/postgresql-plpgsql/dollar-quoted-string-constants/"
ogImage: ""
updatedOn: "2024-03-18T14:51:14+00:00"
enableTableOfContents: true
prev_page: 
  title: "Introduction to PostgreSQL PL/pgSQL"
  slug: "postgresql-plpgsql/introduction-to-postgresql-stored-procedures"
next_page: 
  title: "PL/pgSQL Block Structure"
  slug: "postgresql-plpgsql/plpgsql-block-structure"
---




**Summary**: in this tutorial, you will learn how to use the dollar\-quoted string constants (`$$`) in user\-defined functions and stored procedures.


## Introduction the dollar\-quoted string constant syntax

In PostgreSQL, dollar\-quoted string constants allow you to construct strings that contain single quotes without a need to escape them.

For example, you can surround a string constant using single quotes like this:


```pgsqlsql
select 'String constant';
```
But when a string constant contains a single quote (`'`), you need to escape it by doubling up the single quote:


```pgsql
select 'I''m a string constant';
```
To make the code more readable, PostgreSQL offers a better syntax called dollar\-quoted string constant or dollar quoting:


```php
select $$I'm a string constant$$;
```
In this example, we don’t have to double up the single quote.

Here’s the basic syntax of the dollar\-quoted string constants:


```pgsql
$tag$<string_constant>$tag$
```
In this syntax, the `tag` is optional. It follows the same rules as unquoted identifiers:

* Must begin with a letter (a\-z, A\-Z) or underscore.
* Can include letters (case\-insensitive), digits, and underscores.
* Limited to 63 characters (longer ones are truncated).
* Cannot contain whitespaces, or reserved keywords without quotes.

Between the `$tag$`, you can place any string including single quotes (`'`). For example:


```pgsql
select $$I'm a string constant$$ as message;
```
Output:


```pgsql
        message
-----------------------
 I'm a string constant
(1 row)
```
In this example, we do not specify the `tag` between the two dollar signs(`$`).

The following example uses the dollar\-quoted string constant syntax with a tag:


```
SELECT $message$I'm a string constant$message$ s;
```
Output:


```pgsql
           s
-----------------------
 I'm a string constant

```
In this example, we use the string `message` as a tag between the two dollar signs (`$` ).


## Using dollar\-quoted string constants in anonymous blocks

The following shows the anonymous block in PL/pgSQL:


```
do 
'declare
   film_count integer;
begin 
   select count(*) into film_count
   from film;

   raise notice ''The number of films: %'', film_count;
end;'
;
```
Note that you will learn about the anonymous block in the [PL/pgSQL block structure](plpgsql-block-structure) tutorial. In this tutorial, you can copy and paste the code in any PostgreSQL client tool like pgAdmin or psql to execute it.

Output:


```php
NOTICE:  The number of films: 1000
DO
```
The code in a block must be surrounded by single quotes. If it has any single quote, you need to escape it by doubling it like this:


```pgsql
 raise notice ''The number of films: %'', film_count;
```
To avoid escaping every single quotes and backslashes, you can use the dollar\-quoted string as follows:


```
do 
$$
declare
   film_count integer;
begin 
   select count(*) into film_count
   from film;
   raise notice 'The number of films: %', film_count;
end;
$$;
```

## Using dollar\-quoted string constants in functions

The following shows the syntax of the [`CREATE FUNCTION`](postgresql-create-function) statement that allows you to create a user\-defined function:


```pgsql
create function function_name(param_list) 
    returns datatype
language lang_name
as 
 'function_body'
```
Note that you will learn about the syntax of `CREATE FUNCTION` statement in the [creating function tutorial](postgresql-create-function).

In this syntax, the `function_body` is a string constant. For example, the following function finds a film by its id:


```pgsql
create function find_film_by_id(
   id int
) returns film 
language sql
as 
  'select * from film 
   where film_id = id';
```
In this example, the body of the `find_film_by_id()` function is surrounded by single quotes.

If the function has many statements, it becomes more difficult to read. In this case, you can use dollar\-quoted string constant syntax:


```pgsql
create function find_film_by_id(
   id int
) returns film 
language sql
as 
$$
  select * from film 
  where film_id = id;  
$$; 
```
Now, you can place any piece of code between the `$$` and `$$` without using the need to escape single quotes.


## Using dollar\-quoted string constants in stored procedures

Similarly, you can use the dollar\-quoted string constant syntax in [stored procedures](postgresql-create-procedure) like this:


```pgsql
create procedure proc_name(param_list)
language lang_name
as $$
  -- stored procedure body
$$
```

## Summary

* Use quoted\-dollar string constant syntax to construct string constants without the need to escape single quotes.
* Do use quoted\-dollar string constants in anonymous blocks, user\-defined functions, and stored procedures.

