---
title: 'PL/pgSQL Errors and Messages'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-errors-messages/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to report messages and raise errors using the `raise` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Reporting messages

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PL/pgSQL, you use the `raise` statement to issue a message. Here's the syntax of the `raise` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
raise level format;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Level

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `level` option determines the error severity with the following values:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `debug`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `log`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `notice`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `info`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `warning`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `exception`
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

If you don't specify the `level`, the `raise` statement will use `exception` level that raises an error and stops the current transaction by default. We'll discuss the `raise exception` shortly.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Format

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `format` is a string that specifies the message. The `format` uses percentage ( `%`) placeholders that will be substituted by the arguments.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The number of placeholders must be the same as the number of arguments. Otherwise, PostgreSQL will issue an error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
[Err] ERROR:  too many parameters specified for raise
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example illustrates the `raise` statement that reports different messages at the current time.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
do $$
begin
  raise info 'information message %', now() ;
  raise log 'log message %', now();
  raise debug 'debug message %', now();
  raise warning 'warning message %', now();
  raise notice 'notice message %', now();
end $$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
info:  information message 2015-09-10 21:17:39.398+07
warning:  warning message 2015-09-10 21:17:39.398+07
notice:  notice message 2015-09-10 21:17:39.398+07
```

<!-- /wp:code -->

<!-- wp:paragraph {"className":"note"} -->

Notice that not all messages are reported back to the client. PostgreSQL only reports the `info`, `warning`, and `notice` level messages back to the client. This is controlled by `client_min_messages` and `log_min_messages` configuration parameters.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Raising errors

<!-- /wp:heading -->

<!-- wp:paragraph -->

To raise an error, you use the `exception` level after the `raise` statement. The `raise` statement uses the `exception` level by default.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides raising an error, you can add more information by using the following additional clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
using option = expression
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `option` can be:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `hint`: provide the hint message so that the root cause of the error is easier to discover.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `detail`: give detailed information about the error.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `errcode`: identify the error code, which can be either by condition name or an `SQLSTATE` code. Please refer to the [table of error codes and condition names](https://www.postgresql.org/docs/current/static/errcodes-appendix.html).
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `expression` is a string-valued expression.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example raises a duplicate email error message:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
do $$
declare
  email varchar(255) := 'info@postgresqltutorial.com';
begin
  -- check email for duplicate
  -- ...
  -- report duplicate email
  raise exception 'duplicate email: %', email
		using hint = 'check the email again';
end $$;
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  duplicate email: info@postgresqltutorial.com
HINT:  check the email again
CONTEXT:  PL/pgSQL function inline_code_block line 8 at RAISE
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following examples illustrate how to raise an `SQLSTATE` and its corresponding condition:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
do $$
begin
	--...
	raise sqlstate '77777';
end $$;
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
do $$
begin
	--...
	raise invalid_regular_expression;
end $$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Now you can use `raise` statement to either raise a message or report an error.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `raise` statement to issue a message in PL/pgSQL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Utilize the `using` clause to provide a hint for the error message.
- <!-- /wp:list-item -->

<!-- /wp:list -->
