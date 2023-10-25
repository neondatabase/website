<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       46.9. Utility Functions                      |                                                                          |                                                    |                                                       |                                                                |
| :----------------------------------------------------------------: | :----------------------------------------------------------------------- | :------------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](plpython-transactions.html "46.8. Transaction Management")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") | Chapter 46. PL/Python — Python Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plpython-python23.html "46.10. Python 2 vs. Python 3") |

***

## 46.9. Utility Functions [#](#PLPYTHON-UTIL)

The `plpy` module also provides the functions

|                               |
| ----------------------------- |
| `plpy.debug(msg, **kwargs)`   |
| `plpy.log(msg, **kwargs)`     |
| `plpy.info(msg, **kwargs)`    |
| `plpy.notice(msg, **kwargs)`  |
| `plpy.warning(msg, **kwargs)` |
| `plpy.error(msg, **kwargs)`   |
| `plpy.fatal(msg, **kwargs)`   |

[]()`plpy.error` and `plpy.fatal` actually raise a Python exception which, if uncaught, propagates out to the calling query, causing the current transaction or subtransaction to be aborted. `raise plpy.Error(msg)` and `raise plpy.Fatal(msg)` are equivalent to calling `plpy.error(msg)` and `plpy.fatal(msg)`, respectively but the `raise` form does not allow passing keyword arguments. The other functions only generate messages of different priority levels. Whether messages of a particular priority are reported to the client, written to the server log, or both is controlled by the [log\_min\_messages](runtime-config-logging.html#GUC-LOG-MIN-MESSAGES) and [client\_min\_messages](runtime-config-client.html#GUC-CLIENT-MIN-MESSAGES) configuration variables. See [Chapter 20](runtime-config.html "Chapter 20. Server Configuration") for more information.

The *`msg`* argument is given as a positional argument. For backward compatibility, more than one positional argument can be given. In that case, the string representation of the tuple of positional arguments becomes the message reported to the client.

The following keyword-only arguments are accepted:

|                   |
| ----------------- |
| `detail`          |
| `hint`            |
| `sqlstate`        |
| `schema_name`     |
| `table_name`      |
| `column_name`     |
| `datatype_name`   |
| `constraint_name` |

The string representation of the objects passed as keyword-only arguments is used to enrich the messages reported to the client. For example:

```

CREATE FUNCTION raise_custom_exception() RETURNS void AS $$
plpy.error("custom exception message",
           detail="some info about exception",
           hint="hint for users")
$$ LANGUAGE plpython3u;

=# SELECT raise_custom_exception();
ERROR:  plpy.Error: custom exception message
DETAIL:  some info about exception
HINT:  hint for users
CONTEXT:  Traceback (most recent call last):
  PL/Python function "raise_custom_exception", line 4, in <module>
    hint="hint for users")
PL/Python function "raise_custom_exception"
```

Another set of utility functions are `plpy.quote_literal(string)`, `plpy.quote_nullable(string)`, and `plpy.quote_ident(string)`. They are equivalent to the built-in quoting functions described in [Section 9.4](functions-string.html "9.4. String Functions and Operators"). They are useful when constructing ad-hoc queries. A PL/Python equivalent of dynamic SQL from [Example 43.1](plpgsql-statements.html#PLPGSQL-QUOTE-LITERAL-EXAMPLE "Example 43.1. Quoting Values in Dynamic Queries") would be:

```

plpy.execute("UPDATE tbl SET %s = %s WHERE key = %s" % (
    plpy.quote_ident(colname),
    plpy.quote_nullable(newvalue),
    plpy.quote_literal(keyvalue)))
```

***

|                                                                    |                                                                          |                                                                |
| :----------------------------------------------------------------- | :----------------------------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](plpython-transactions.html "46.8. Transaction Management")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") |  [Next](plpython-python23.html "46.10. Python 2 vs. Python 3") |
| 46.8. Transaction Management                                       |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                   46.10. Python 2 vs. Python 3 |
