<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             WHENEVER             |                                                             |                              |                                                       |                                                                         |
| :------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](ecpg-sql-var.html "VAR")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-informix-compat.html "36.15. Informix Compatibility Mode") |

***

## WHENEVER

WHENEVER — specify the action to be taken when an SQL statement causes a specific class condition to be raised

## Synopsis

```

WHENEVER { NOT FOUND | SQLERROR | SQLWARNING } action
```

## Description

Define a behavior which is called on the special cases (Rows not found, SQL warnings or errors) in the result of SQL execution.

## Parameters

See [Section 36.8.1](ecpg-errors.html#ECPG-WHENEVER "36.8.1. Setting Callbacks") for a description of the parameters.

## Examples

```

EXEC SQL WHENEVER NOT FOUND CONTINUE;
EXEC SQL WHENEVER NOT FOUND DO BREAK;
EXEC SQL WHENEVER NOT FOUND DO CONTINUE;
EXEC SQL WHENEVER SQLWARNING SQLPRINT;
EXEC SQL WHENEVER SQLWARNING DO warn();
EXEC SQL WHENEVER SQLERROR sqlprint;
EXEC SQL WHENEVER SQLERROR CALL print2();
EXEC SQL WHENEVER SQLERROR DO handle_error("select");
EXEC SQL WHENEVER SQLERROR DO sqlnotice(NULL, NONO);
EXEC SQL WHENEVER SQLERROR DO sqlprint();
EXEC SQL WHENEVER SQLERROR GOTO error_label;
EXEC SQL WHENEVER SQLERROR STOP;
```

A typical application is the use of `WHENEVER NOT FOUND BREAK` to handle looping through result sets:

```

int
main(void)
{
    EXEC SQL CONNECT TO testdb AS con1;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;
    EXEC SQL ALLOCATE DESCRIPTOR d;
    EXEC SQL DECLARE cur CURSOR FOR SELECT current_database(), 'hoge', 256;
    EXEC SQL OPEN cur;

    /* when end of result set reached, break out of while loop */
    EXEC SQL WHENEVER NOT FOUND DO BREAK;

    while (1)
    {
        EXEC SQL FETCH NEXT FROM cur INTO SQL DESCRIPTOR d;
        ...
    }

    EXEC SQL CLOSE cur;
    EXEC SQL COMMIT;

    EXEC SQL DEALLOCATE DESCRIPTOR d;
    EXEC SQL DISCONNECT ALL;

    return 0;
}
```

## Compatibility

`WHENEVER` is specified in the SQL standard, but most of the actions are PostgreSQL extensions.

***

|                                  |                                                             |                                                                         |
| :------------------------------- | :---------------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](ecpg-sql-var.html "VAR")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-informix-compat.html "36.15. Informix Compatibility Mode") |
| VAR                              |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                      36.15. Informix Compatibility Mode |
