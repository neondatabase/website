---
title: 'PL/pgSQL Block Structure'
page_title: 'PL/pgSQL Block Structure'
page_description: 'This tutorial explains you the block structure of PL/pgSQL and shows you step by step how to develop anonymous blocks.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-block-structure/'
ogImage: '/postgresqltutorial/plpgSQL-block-Structure.png'
updatedOn: '2024-04-19T08:08:48+00:00'
enableTableOfContents: true
previousLink:
  title: 'Dollar-Quoted String Constants'
  slug: 'postgresql-plpgsql/dollar-quoted-string-constants'
nextLink:
  title: 'PL/pgSQL Variables'
  slug: 'postgresql-plpgsql/plpgsql-variables'
---

**Summary**: in this tutorial, you will learn about the block structure of PL/pgSQL and how to write and execute your first PL/pgSQL block.

## Introduction to PL/pgSQL Block Structure

PL/pgSQL is a block\-structured language. Here’s the syntax of a block in PL/pgSQL:

```sql
[ <<label>> ]
[ declare
    declarations ]
begin
    statements;
	...
end [ label ];
```

Each block has two sections:

- Declaration
- Body

The declaration section is optional whereas the body section is required.

A block may have an optional `label` that is located at the beginning and end of the block. A block ends with a semicolon (`;`) after the `end` keyword.

Typically, you use the block label when you want to specify it in the [`EXIT`](plpgsql-exit) statement of the block body or to qualify the names of [variables](plpgsql-variables) declared in the block.

The declaration section is where you [declare all variables](plpgsql-variables) used within the body section. Each statement in the declaration section is terminated with a semicolon (`;`).

The syntax for declaring a variable is as follows:

```sql
variable_name type = initial_value;
```

For example, the following declares a variable called `counter` with the type `int` and has an initial value of zero:

```
counter int = 0;
```

Sometimes, you’ll see the :\= operator instead of \= operator. They are have the same meaning:

```
counter int := 0;
```

The initial value is optional. For example, you can declare a variable called `max` with the type `int` like this:

```
max int;
```

Please note that you’ll learn about variables in more detail in the upcoming [variable tutorial](plpgsql-variables).

The body section is where you place the code. Each statement in the body section is terminated with a semicolon (;).

## PL/pgSQL block structure example

The following example illustrates a simple block. Because the block has no name, it is called an anonymous block.

```
do $$
<<first_block>>
declare
  film_count integer := 0;
begin
   -- get the number of films
   select count(*)
   into film_count
   from film;

   -- display a message
   raise notice 'The number of films is %', film_count;
end first_block $$;
```

Output:

```php
NOTICE:  The number of films is 1000
DO
```

To execute a block from pgAdmin, you click the **Execute** button as shown in the following picture:

![](/postgresqltutorial/plpgSQL-block-Structure.png)Notice that the `DO` statement does not belong to the block. It is used to execute an anonymous block. PostgreSQL introduced the `DO` statement since version 9\.0\.

The anonymous block has to be surrounded by single quotes like this:

```sql
'<<first_block>>
declare
  film_count integer := 0;
begin
   -- get the number of films
   select count(*)
   into film_count
   from film;
   -- display a message
   raise notice ''The number of films is %'', film_count;
end first_block';
```

However, we use the [dollar\-quoted string constant syntax](dollar-quoted-string-constants) to make it more readable.

In the declaration section, we declare a [variable](plpgsql-variables) `film_count` and initialize its value to zero.

```sql
film_count integer = 0;
```

Inside the body section, we use a [`select into`](https://neon.tech/postgresql/plpgsql-select-into/) statement with the [`count()`](../postgresql-aggregate-functions/postgresql-count-function) function to retrieve the number of films from the `film` table and assign it to the `film_count` variable:

```sql
select count(*)
into film_count
from film;
```

After that, we show a message using [`raise notice`](plpgsql-errors-messages) statement:

```sql
raise notice 'The number of films is %', film_count;
```

The `%` is a placeholder that is replaced by the content of the `film_count` variable.

Note that the `first_block` label is just for demonstration purposes. It does nothing in this example.

## PL/pgSQL Subblocks

PL/pgSQL allows you to place a block inside the body of another block.

The block nested inside another block is called a **subblock**. The enclosing block, which contains the subblock, is often referred to as the outer block.

The following picture illustrates an outer block and subblocks:

![plpgsql block structure](/postgresqltutorial/plpgsql-block-structure.png)
Typically, you divide a large block into smaller, more logical subblocks. The following example illustrates how to use a subblock inside a block:

```php
do
$$
<<outer>>
declare
   x int = 0;
begin
   x = x + 1;
   <<inner>>
   declare
       y int = 2;
   begin
   	   y = y + x;
	   raise notice 'x=% y=%', x, y;
   end inner;
end outer;
$$
```

Output:

```php
NOTICE:  x=1 y=3
DO
```

In this example, the anonymous block (outer) has a subblock (inner).

In the outer block:

- Declare a variable x and initialize its value to zero.
- Increase the value of x by one in the body.

In the inner block (subblock or nested block):

- Declare a variable y and initialize its value to zero.
- Increase the value of y by x.
- Display the values of the variables x and y using the raise notice.

## Summary

- PL/pgSQL is a blocked\-structure language that organizes a program into blocks.
- A block contains two parts: declaration and body. The declaration part is optional whereas the body part is mandatory.
- Blocks can be nested. A nested block is a block placed inside the body of another block.
