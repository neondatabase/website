---
title: 'PL/pgSQL Assert Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-assert/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL assert statement and how to use it for debugging purposes.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Notice that PostgreSQL introduces the `assert` statement in version 9.5 or later. Check your PostgreSQL version before using it.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the assert statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `assert` statement is a useful shorthand for inserting debugging checks into PL/pgSQL code.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `assert` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
assert condition [, message];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) condition

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `condition` is a Boolean expression that is expected to always return `true`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `condition` evaluates to `true`, the `assert` statement does nothing.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In case the `condition` evaluates to `false` or `null`, PostgreSQL raises an `assert_failure` exception.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) message

<!-- /wp:heading -->

<!-- wp:paragraph -->

The message is optional.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you don't pass the `message`, PostgreSQL uses the "`assertion failed`" message by default. In case you pass the `message` to the `assert` statement, PostgreSQL will use it instead of the default message.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that you should use the `assert` statement solely for detecting bugs, not for reporting. To report a message or an error, you use the `raise` statement instead.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Enable / Disable Assertions

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides the `plpgsql.check_asserts` configuration parameter to enable or disable assertion testing. If you set this parameter to `off`, the assert statement will do nothing.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL assert statement example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `assert` statement to check if the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) has data:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$
declare
   film_count integer;
begin
   select count(*)
   into film_count
   from film;

   assert film_count > 0, 'Film not found, check the film table';
end$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because the `film` table has data, the block did not issue any message.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example issues an error because the number of films from the film table is not greater than `1,000`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$
declare
   film_count integer;
begin
   select count(*)
   into film_count
   from film;

   assert film_count > 1000, '1000 Film found, check the film table';
end$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  1000 Film found, check the film table
CONTEXT:  PL/pgSQL function inline_code_block line 9 at ASSERT
SQL state: P0004
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `assert` statement to add debugging checks to the PL/pgSQL code.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `assert` statement evaluates a `condition` that is expected to be `true` and issues an error in case the condition is `false` or `null`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `assert` statement for detecting bugs only. For reporting messages and errors, use the `raise` statement instead.
- <!-- /wp:list-item -->

<!-- /wp:list -->
