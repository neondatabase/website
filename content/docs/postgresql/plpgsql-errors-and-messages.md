---
title: 'PL/pgSQL Errors and Messages'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/plpgsql-errors-messages/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to report messages and raise errors using the `raise` statement.





## Reporting messages





In PL/pgSQL, you use the `raise` statement to issue a message. Here's the syntax of the `raise` statement:





```
raise level format;
```





In this syntax:





### Level





The `level` option determines the error severity with the following values:





- `debug`
-
- `log`
-
- `notice`
-
- `info`
-
- `warning`
-
- `exception`





If you don't specify the `level`, the `raise` statement will use `exception` level that raises an error and stops the current transaction by default. We'll discuss the `raise exception` shortly.





### Format





The `format` is a string that specifies the message. The `format` uses percentage ( `%`) placeholders that will be substituted by the arguments.





The number of placeholders must be the same as the number of arguments. Otherwise, PostgreSQL will issue an error:





```
[Err] ERROR:  too many parameters specified for raise
```





The following example illustrates the `raise` statement that reports different messages at the current time.





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





Output:





```
info:  information message 2015-09-10 21:17:39.398+07
warning:  warning message 2015-09-10 21:17:39.398+07
notice:  notice message 2015-09-10 21:17:39.398+07
```





Notice that not all messages are reported back to the client. PostgreSQL only reports the `info`, `warning`, and `notice` level messages back to the client. This is controlled by `client_min_messages` and `log_min_messages` configuration parameters.





## Raising errors





To raise an error, you use the `exception` level after the `raise` statement. The `raise` statement uses the `exception` level by default.





Besides raising an error, you can add more information by using the following additional clause:





```
using option = expression
```





The `option` can be:





- `hint`: provide the hint message so that the root cause of the error is easier to discover.
-
- `detail`: give detailed information about the error.
-
- `errcode`: identify the error code, which can be either by condition name or an `SQLSTATE` code. Please refer to the [table of error codes and condition names](https://www.postgresql.org/docs/current/static/errcodes-appendix.html).





The `expression` is a string-valued expression.





The following example raises a duplicate email error message:





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





```
ERROR:  duplicate email: info@postgresqltutorial.com
HINT:  check the email again
CONTEXT:  PL/pgSQL function inline_code_block line 8 at RAISE
```





The following examples illustrate how to raise an `SQLSTATE` and its corresponding condition:





```
do $$
begin
	--...
	raise sqlstate '77777';
end $$;
```





```
do $$
begin
	--...
	raise invalid_regular_expression;
end $$;
```





Now you can use `raise` statement to either raise a message or report an error.





## Summary





- Use the `raise` statement to issue a message in PL/pgSQL.
-
- Utilize the `using` clause to provide a hint for the error message.


