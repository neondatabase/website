---
title: 'PL/pgSQL Variables'
page_title: 'PL/pgSQL Variables'
page_description: 'In this tutorial, you will learn how to declare PL/pgSQL variables in blocks and how to use variables effectively.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables/'
ogImage: '/postgresqltutorial/film.png'
updatedOn: '2024-03-19T03:19:49+00:00'
enableTableOfContents: true
previousLink:
  title: 'PL/pgSQL Block Structure'
  slug: 'postgresql-plpgsql/plpgsql-block-structure'
nextLink:
  title: 'PL/pgSQL Select Into'
  slug: 'postgresql-plpgsql/pl-pgsql-select-into'
---

**Summary**: in this tutorial, you will learn about PL/pgSQL variables and various ways to declare them

## Introduction to PL/pgSQL variables

In PL/pgSQL, variables are placeholders for storing data within a [block](plpgsql-block-structure). These variables can hold values of various types such as integers, booleans, text, and more.

Variables allow you to hold values for calculations, store query results, and so on.

Before using variables, you must declare them in the declaration section of a block.

Variables are scoped to the block in which they’re declared. It means that variables are accessible only within the block and any nested blocks.

The following illustrates the syntax of declaring a variable.

```sqlsqlsql
variable_name data_type [= expression];
```

In this syntax:

- First, specify the name of the variable. It is a good practice to assign a meaningful name to a variable. For example, instead of naming a variable `i` you should use `index` or `counter`.
- Second, associate a specific [data type](../postgresql-tutorial/postgresql-data-types) with the variable. The data type can be any valid data type such as [integer](../postgresql-tutorial/postgresql-integer), [numeric](../postgresql-tutorial/postgresql-numeric), [varchar](../postgresql-tutorial/postgresql-char-varchar-text), and [char](../postgresql-tutorial/postgresql-char-varchar-text).
- Third, optionally assign a default value to the variable. If you don’t do so, the initial value of the variable is `NULL`.

Please note that you can use either `:=` or `=` assignment operator to set an initial value for a variable.

To assign a value to a variable, you can use the assignment operator (\=) as follows:

```sql
variable_name = value;
```

Alternatively, you can use the `:=` assignment operator:

```
variable_name := value;
```

## Basic PL/pgSQL variable example

### 1\) Declare variables

The following example shows how to declare and initialize variables:

```
do $$
declare
   counter    integer = 1;
   first_name varchar(50) = 'John';
   last_name  varchar(50) = 'Doe';
   payment    numeric(11,2) = 20.5;
begin
   raise notice '% % % has been paid % USD',
       counter,
	   first_name,
	   last_name,
	   payment;
end $$;
```

Output:

```css
notice: 1 John Doe has been paid 20.5 USD;
```

How it works.

First, declare four variables in the declaration part of the block:

- The `counter` variable is an integer with an initial value of 1\.
- The `first_name` and `last_name` are `varchar(50)` with the initial values of `'John'` and `'Doe'` respectively.
- The `payment` variable has the numeric type with the initial value `20.5`.

Second, display the values of the variables using the `raise notice` statement.

### 2\) Assign values to variables

The following example shows how to assign a value to a variable:

```php
do $$
declare
	first_name VARCHAR(50);
begin
	first_name = split_part('John Doe',' ', 1);
	raise notice 'The first name is %', first_name;
end;
$$;
```

Output:

```php
NOTICE:  The first name is John
DO
```

How it works.

First, declare a variable in the declaration block:

```sql
first_name VARCHAR(50);
```

Second, split a string literal into two parts using a space, return the first part, and assign it to the `first_name` variable:

```
first_name = split_part('John Doe',' ', 1);
```

Third, display the value of the `first_name` variable using the `raise notice` statement:

```sql
raise notice 'The first name is %', first_name;
```

## Variable initialization timing

PostgreSQL evaluates the initial value of a variable and assigns it when the block is entered. For example:

```
do $$
declare
   created_at time = clock_timestamp();
begin
   raise notice '%', created_at;
   perform pg_sleep(3);
   raise notice '%', created_at;
end $$;
```

Here is the output:

```shell
NOTICE:  14:23:33.064008
NOTICE:  14:23:33.064008
```

In this example:

- First, declare a variable `created_at` and initialize its value to the current time.
- Second, display the variable.
- Third, pause the execution for 3 seconds using the `pg_sleep()` function.
- Finally, display the value of the `created_at` variable again.

The output indicates that the value of the `created_at` variable is only initialized once when the block is entered.

## Copying data types

The `%type` provides the data type of a table column or another variable. Typically, you use the `%type` to declare a variable that holds a value from the database or another variable.

The following illustrates how to declare a variable with the data type of a table column:

```sql
variable_name table_name.column_name%type;
```

The following shows how to declare a variable with the data type of another variable:

```sql
variable_name variable%type;
```

We’ll use the following `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial/film.png)This example uses the type\-copying technique to declare variables that hold values that come from the `film` table:

```
do
$$
declare
   film_title film.title%type;
   featured_title film_title%type;
begin
   -- get title of the film id 100
   select title
   from film
   into film_title
   where film_id = 100;

   -- show the film title
   raise notice 'Film title id 100: %s', film_title;
end; $$;
```

Output:

```php
NOTICE:  Film title id 100: Brooklyn Deserts
DO
```

In this example, we declare two variables:

- The `film_title` variable has the same data type as the `title` column in the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database).
- The `featured_title` has the same data type as the data type of the `film_title` variable.

We use the [select into](pl-pgsql-select-into) statement to retrieve from the `film_title` column of the `film` table and assign it to the `film_title` variable.

Using the type\-copying feature offers the following advantages:

- First, you don’t need to know the type of column or reference being accessed.
- Second, if the data type of the referenced column name (or variable) changes, you don’t need to change the block.

## Variables in blocks and subblocks

When you declare a variable in a subblock with the same name as another variable in the outer block, the variable in the outer block is hidden within the subblock.

To access a variable in the outer block, you use the block label to qualify its name, as shown in the following example:

```sql
do
$$
<<outer_block>>
declare
  counter integer := 0;
begin
   counter := counter + 1;
   raise notice 'The current value of the counter is %', counter;

   declare
       counter integer := 0;
   begin
       counter := counter + 10;
       raise notice 'Counter in the subblock is %', counter;
       raise notice 'Counter in the outer block is %', outer_block.counter;
   end;

   raise notice 'Counter in the outer block is %', counter;

end outer_block $$;
```

```http
NOTICE:  The current value of the counter is 1
NOTICE:  Counter in the subblock is 10
NOTICE:  Counter in the outer block is 1
NOTICE:  Counter in the outer block is 1
```

In this example:

- First, declare a variable named `counter` in the `outer_block`.
- Next, declare a variable with the same name in the subblock.
- Then, before entering into the subblock, the value of `counter` is one. Within the subblock, we increase the value of the `counter` variable to ten and print it out. Note that this change only affects the `counter` variable within the subblock.
- After that, reference the `counter` variable in the outer block using the block label `outer_block.counter`.
- Finally, display the value of the `counter` variable in the outer block, its value remains unchanged.

## Summary

- A variable is a named storage location with a data type that can hold a value.
- PostgreSQL evaluates the default value of a variable and assigns it to the variable when it enters the block.
- Declare variables and optionally an initial value to it in the declaration section of the block.
