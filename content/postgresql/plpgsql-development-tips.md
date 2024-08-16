[#id](#PLPGSQL-DEVELOPMENT-TIPS)

## 43.12. Tips for Developing in PL/pgSQL [#](#PLPGSQL-DEVELOPMENT-TIPS)

- [43.12.1. Handling of Quotation Marks](plpgsql-development-tips#PLPGSQL-QUOTE-TIPS)
- [43.12.2. Additional Compile-Time and Run-Time Checks](plpgsql-development-tips#PLPGSQL-EXTRA-CHECKS)

One good way to develop in PL/pgSQL is to use the text editor of your choice to create your functions, and in another window, use psql to load and test those functions. If you are doing it this way, it is a good idea to write the function using `CREATE OR REPLACE FUNCTION`. That way you can just reload the file to update the function definition. For example:

```
CREATE OR REPLACE FUNCTION testfunc(integer) RETURNS integer AS $$
          ....
$$ LANGUAGE plpgsql;
```

While running psql, you can load or reload such a function definition file with:

```
\i filename.sql
```

and then immediately issue SQL commands to test the function.

Another good way to develop in PL/pgSQL is with a GUI database access tool that facilitates development in a procedural language. One example of such a tool is pgAdmin, although others exist. These tools often provide convenient features such as escaping single quotes and making it easier to recreate and debug functions.

[#id](#PLPGSQL-QUOTE-TIPS)

### 43.12.1. Handling of Quotation Marks [#](#PLPGSQL-QUOTE-TIPS)

The code of a PL/pgSQL function is specified in `CREATE FUNCTION` as a string literal. If you write the string literal in the ordinary way with surrounding single quotes, then any single quotes inside the function body must be doubled; likewise any backslashes must be doubled (assuming escape string syntax is used). Doubling quotes is at best tedious, and in more complicated cases the code can become downright incomprehensible, because you can easily find yourself needing half a dozen or more adjacent quote marks. It's recommended that you instead write the function body as a “dollar-quoted” string literal (see [Section 4.1.2.4](sql-syntax-lexical#SQL-SYNTAX-DOLLAR-QUOTING)). In the dollar-quoting approach, you never double any quote marks, but instead take care to choose a different dollar-quoting delimiter for each level of nesting you need. For example, you might write the `CREATE FUNCTION` command as:

```
CREATE OR REPLACE FUNCTION testfunc(integer) RETURNS integer AS $PROC$
          ....
$PROC$ LANGUAGE plpgsql;
```

Within this, you might use quote marks for simple literal strings in SQL commands and `$$` to delimit fragments of SQL commands that you are assembling as strings. If you need to quote text that includes `$$`, you could use `$Q$`, and so on.

The following chart shows what you have to do when writing quote marks without dollar quoting. It might be useful when translating pre-dollar quoting code into something more comprehensible.

- 1 quotation mark [#](#PLPGSQL-QUOTE-TIPS-1-QUOT)

  To begin and end the function body, for example:

  ```
  CREATE FUNCTION foo() RETURNS integer AS '
            ....
  ' LANGUAGE plpgsql;
  ```

  Anywhere within a single-quoted function body, quote marks _must_ appear in pairs.

- 2 quotation marks [#](#PLPGSQL-QUOTE-TIPS-2-QUOT)

  For string literals inside the function body, for example:

  ```
  a_output := ''Blah'';
  SELECT * FROM users WHERE f_name=''foobar'';
  ```

  In the dollar-quoting approach, you'd just write:

  ```
  a_output := 'Blah';
  SELECT * FROM users WHERE f_name='foobar';
  ```

  which is exactly what the PL/pgSQL parser would see in either case.

- 4 quotation marks [#](#PLPGSQL-QUOTE-TIPS-4-QUOT)

  When you need a single quotation mark in a string constant inside the function body, for example:

  ```
  a_output := a_output || '' AND name LIKE ''''foobar'''' AND xyz''
  ```

  The value actually appended to `a_output` would be: `AND name LIKE 'foobar' AND xyz`.

  In the dollar-quoting approach, you'd write:

  ```
  a_output := a_output || $$ AND name LIKE 'foobar' AND xyz$$
  ```

  being careful that any dollar-quote delimiters around this are not just `$$`.

- 6 quotation marks [#](#PLPGSQL-QUOTE-TIPS-6-QUOT)

  When a single quotation mark in a string inside the function body is adjacent to the end of that string constant, for example:

  ```
  a_output := a_output || '' AND name LIKE ''''foobar''''''
  ```

  The value appended to `a_output` would then be: `AND name LIKE 'foobar'`.

  In the dollar-quoting approach, this becomes:

  ```
  a_output := a_output || $$ AND name LIKE 'foobar'$$
  ```

- 10 quotation marks [#](#PLPGSQL-QUOTE-TIPS-10-QUOT)

  When you want two single quotation marks in a string constant (which accounts for 8 quotation marks) and this is adjacent to the end of that string constant (2 more). You will probably only need that if you are writing a function that generates other functions, as in [Example 43.10](plpgsql-porting#PLPGSQL-PORTING-EX2). For example:

  ```
  a_output := a_output || '' if v_'' ||
      referrer_keys.kind || '' like ''''''''''
      || referrer_keys.key_string || ''''''''''
      then return ''''''  || referrer_keys.referrer_type
      || ''''''; end if;'';
  ```

  The value of `a_output` would then be:

  ```
  if v_... like ''...'' then return ''...''; end if;
  ```

  In the dollar-quoting approach, this becomes:

  ```
  a_output := a_output || $$ if v_$$ || referrer_keys.kind || $$ like '$$
      || referrer_keys.key_string || $$'
      then return '$$  || referrer_keys.referrer_type
      || $$'; end if;$$;
  ```

  where we assume we only need to put single quote marks into `a_output`, because it will be re-quoted before use.

[#id](#PLPGSQL-EXTRA-CHECKS)

### 43.12.2. Additional Compile-Time and Run-Time Checks [#](#PLPGSQL-EXTRA-CHECKS)

To aid the user in finding instances of simple but common problems before they cause harm, PL/pgSQL provides additional _`checks`_. When enabled, depending on the configuration, they can be used to emit either a `WARNING` or an `ERROR` during the compilation of a function. A function which has received a `WARNING` can be executed without producing further messages, so you are advised to test in a separate development environment.

Setting `plpgsql.extra_warnings`, or `plpgsql.extra_errors`, as appropriate, to `"all"` is encouraged in development and/or testing environments.

These additional checks are enabled through the configuration variables `plpgsql.extra_warnings` for warnings and `plpgsql.extra_errors` for errors. Both can be set either to a comma-separated list of checks, `"none"` or `"all"`. The default is `"none"`. Currently the list of available checks includes:

- `shadowed_variables` [#](#PLPGSQL-EXTRA-CHECKS-SHADOWED-VARIABLES)

  Checks if a declaration shadows a previously defined variable.

- `strict_multi_assignment` [#](#PLPGSQL-EXTRA-CHECKS-STRICT-MULTI-ASSIGNMENT)

  Some PL/pgSQL commands allow assigning values to more than one variable at a time, such as `SELECT INTO`. Typically, the number of target variables and the number of source variables should match, though PL/pgSQL will use `NULL` for missing values and extra variables are ignored. Enabling this check will cause PL/pgSQL to throw a `WARNING` or `ERROR` whenever the number of target variables and the number of source variables are different.

- `too_many_rows` [#](#PLPGSQL-EXTRA-CHECKS-TOO-MANY-ROWS)

  Enabling this check will cause PL/pgSQL to check if a given query returns more than one row when an `INTO` clause is used. As an `INTO` statement will only ever use one row, having a query return multiple rows is generally either inefficient and/or nondeterministic and therefore is likely an error.

The following example shows the effect of `plpgsql.extra_warnings` set to `shadowed_variables`:

```
SET plpgsql.extra_warnings TO 'shadowed_variables';

CREATE FUNCTION foo(f1 int) RETURNS int AS $$
DECLARE
f1 int;
BEGIN
RETURN f1;
END;
$$ LANGUAGE plpgsql;
WARNING:  variable "f1" shadows a previously defined variable
LINE 3: f1 int;
        ^
CREATE FUNCTION
```

The below example shows the effects of setting `plpgsql.extra_warnings` to `strict_multi_assignment`:

```
SET plpgsql.extra_warnings TO 'strict_multi_assignment';

CREATE OR REPLACE FUNCTION public.foo()
 RETURNS void
 LANGUAGE plpgsql
AS $$
DECLARE
  x int;
  y int;
BEGIN
  SELECT 1 INTO x, y;
  SELECT 1, 2 INTO x, y;
  SELECT 1, 2, 3 INTO x, y;
END;
$$;

SELECT foo();
WARNING:  number of source and target fields in assignment does not match
DETAIL:  strict_multi_assignment check of extra_warnings is active.
HINT:  Make sure the query returns the exact list of columns.
WARNING:  number of source and target fields in assignment does not match
DETAIL:  strict_multi_assignment check of extra_warnings is active.
HINT:  Make sure the query returns the exact list of columns.

 foo
-----

(1 row)
```
