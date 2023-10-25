<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|           Chapter 47. Server Programming Interface          |                                                            |                            |                                                       |                                                         |
| :---------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](plpython-envar.html "46.11. Environment Variables")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-interface.html "47.1. Interface Functions") |

***

## Chapter 47. Server Programming Interface

**Table of Contents**

* [47.1. Interface Functions](spi-interface.html)

  * *   [SPI\_connect](spi-spi-connect.html) — connect a C function to the SPI manager
    * [SPI\_finish](spi-spi-finish.html) — disconnect a C function from the SPI manager
    * [SPI\_execute](spi-spi-execute.html) — execute a command
    * [SPI\_exec](spi-spi-exec.html) — execute a read/write command
    * [SPI\_execute\_extended](spi-spi-execute-extended.html) — execute a command with out-of-line parameters
    * [SPI\_execute\_with\_args](spi-spi-execute-with-args.html) — execute a command with out-of-line parameters
    * [SPI\_prepare](spi-spi-prepare.html) — prepare a statement, without executing it yet
    * [SPI\_prepare\_cursor](spi-spi-prepare-cursor.html) — prepare a statement, without executing it yet
    * [SPI\_prepare\_extended](spi-spi-prepare-extended.html) — prepare a statement, without executing it yet
    * [SPI\_prepare\_params](spi-spi-prepare-params.html) — prepare a statement, without executing it yet
    * [SPI\_getargcount](spi-spi-getargcount.html) — return the number of arguments needed by a statement prepared by `SPI_prepare`
    * [SPI\_getargtypeid](spi-spi-getargtypeid.html) — return the data type OID for an argument of a statement prepared by `SPI_prepare`
    * [SPI\_is\_cursor\_plan](spi-spi-is-cursor-plan.html) — return `true` if a statement prepared by `SPI_prepare` can be used with `SPI_cursor_open`
    * [SPI\_execute\_plan](spi-spi-execute-plan.html) — execute a statement prepared by `SPI_prepare`
    * [SPI\_execute\_plan\_extended](spi-spi-execute-plan-extended.html) — execute a statement prepared by `SPI_prepare`
    * [SPI\_execute\_plan\_with\_paramlist](spi-spi-execute-plan-with-paramlist.html) — execute a statement prepared by `SPI_prepare`
    * [SPI\_execp](spi-spi-execp.html) — execute a statement in read/write mode
    * [SPI\_cursor\_open](spi-spi-cursor-open.html) — set up a cursor using a statement created with `SPI_prepare`
    * [SPI\_cursor\_open\_with\_args](spi-spi-cursor-open-with-args.html) — set up a cursor using a query and parameters
    * [SPI\_cursor\_open\_with\_paramlist](spi-spi-cursor-open-with-paramlist.html) — set up a cursor using parameters
    * [SPI\_cursor\_parse\_open](spi-spi-cursor-parse-open.html) — set up a cursor using a query string and parameters
    * [SPI\_cursor\_find](spi-spi-cursor-find.html) — find an existing cursor by name
    * [SPI\_cursor\_fetch](spi-spi-cursor-fetch.html) — fetch some rows from a cursor
    * [SPI\_cursor\_move](spi-spi-cursor-move.html) — move a cursor
    * [SPI\_scroll\_cursor\_fetch](spi-spi-scroll-cursor-fetch.html) — fetch some rows from a cursor
    * [SPI\_scroll\_cursor\_move](spi-spi-scroll-cursor-move.html) — move a cursor
    * [SPI\_cursor\_close](spi-spi-cursor-close.html) — close a cursor
    * [SPI\_keepplan](spi-spi-keepplan.html) — save a prepared statement
    * [SPI\_saveplan](spi-spi-saveplan.html) — save a prepared statement
    * [SPI\_register\_relation](spi-spi-register-relation.html) — make an ephemeral named relation available by name in SPI queries
    * [SPI\_unregister\_relation](spi-spi-unregister-relation.html) — remove an ephemeral named relation from the registry
    * [SPI\_register\_trigger\_data](spi-spi-register-trigger-data.html) — make ephemeral trigger data available in SPI queries

* [47.2. Interface Support Functions](spi-interface-support.html)

  * *   [SPI\_fname](spi-spi-fname.html) — determine the column name for the specified column number
    * [SPI\_fnumber](spi-spi-fnumber.html) — determine the column number for the specified column name
    * [SPI\_getvalue](spi-spi-getvalue.html) — return the string value of the specified column
    * [SPI\_getbinval](spi-spi-getbinval.html) — return the binary value of the specified column
    * [SPI\_gettype](spi-spi-gettype.html) — return the data type name of the specified column
    * [SPI\_gettypeid](spi-spi-gettypeid.html) — return the data type OID of the specified column
    * [SPI\_getrelname](spi-spi-getrelname.html) — return the name of the specified relation
    * [SPI\_getnspname](spi-spi-getnspname.html) — return the namespace of the specified relation
    * [SPI\_result\_code\_string](spi-spi-result-code-string.html) — return error code as string

* [47.3. Memory Management](spi-memory.html)

  * *   [SPI\_palloc](spi-spi-palloc.html) — allocate memory in the upper executor context
    * [SPI\_repalloc](spi-realloc.html) — reallocate memory in the upper executor context
    * [SPI\_pfree](spi-spi-pfree.html) — free memory in the upper executor context
    * [SPI\_copytuple](spi-spi-copytuple.html) — make a copy of a row in the upper executor context
    * [SPI\_returntuple](spi-spi-returntuple.html) — prepare to return a tuple as a Datum
    * [SPI\_modifytuple](spi-spi-modifytuple.html) — create a row by replacing selected fields of a given row
    * [SPI\_freetuple](spi-spi-freetuple.html) — free a row allocated in the upper executor context
    * [SPI\_freetuptable](spi-spi-freetupletable.html) — free a row set created by `SPI_execute` or a similar function
    * [SPI\_freeplan](spi-spi-freeplan.html) — free a previously saved prepared statement

* [47.4. Transaction Management](spi-transaction.html)

  * *   [SPI\_commit](spi-spi-commit.html) — commit the current transaction
    * [SPI\_rollback](spi-spi-rollback.html) — abort the current transaction
    * [SPI\_start\_transaction](spi-spi-start-transaction.html) — obsolete function

  * *   [47.5. Visibility of Data Changes](spi-visibility.html)
  * [47.6. Examples](spi-examples.html)

The *Server Programming Interface* (SPI) gives writers of user-defined C functions the ability to run SQL commands inside their functions or procedures. SPI is a set of interface functions to simplify access to the parser, planner, and executor. SPI also does some memory management.

### Note

The available procedural languages provide various means to execute SQL commands from functions. Most of these facilities are based on SPI, so this documentation might be of use for users of those languages as well.

Note that if a command invoked via SPI fails, then control will not be returned to your C function. Rather, the transaction or subtransaction in which your C function executes will be rolled back. (This might seem surprising given that the SPI functions mostly have documented error-return conventions. Those conventions only apply for errors detected within the SPI functions themselves, however.) It is possible to recover control after an error by establishing your own subtransaction surrounding SPI calls that might fail.

SPI functions return a nonnegative result on success (either via a returned integer value or in the global variable `SPI_result`, as described below). On error, a negative result or `NULL` will be returned.

Source code files that use SPI must include the header file `executor/spi.h`.

***

|                                                             |                                                            |                                                         |
| :---------------------------------------------------------- | :--------------------------------------------------------: | ------------------------------------------------------: |
| [Prev](plpython-envar.html "46.11. Environment Variables")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](spi-interface.html "47.1. Interface Functions") |
| 46.11. Environment Variables                                |    [Home](index.html "PostgreSQL 17devel Documentation")   |                               47.1. Interface Functions |
