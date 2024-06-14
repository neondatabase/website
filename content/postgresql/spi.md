[#id](#SPI)

## Chapter 47. Server Programming Interface

**Table of Contents**

- [47.1. Interface Functions](spi-interface)

  - [SPI_connect](spi-spi-connect) — connect a C function to the SPI manager
  - [SPI_finish](spi-spi-finish) — disconnect a C function from the SPI manager
  - [SPI_execute](spi-spi-execute) — execute a command
  - [SPI_exec](spi-spi-exec) — execute a read/write command
  - [SPI_execute_extended](spi-spi-execute-extended) — execute a command with out-of-line parameters
  - [SPI_execute_with_args](spi-spi-execute-with-args) — execute a command with out-of-line parameters
  - [SPI_prepare](spi-spi-prepare) — prepare a statement, without executing it yet
  - [SPI_prepare_cursor](spi-spi-prepare-cursor) — prepare a statement, without executing it yet
  - [SPI_prepare_extended](spi-spi-prepare-extended) — prepare a statement, without executing it yet
  - [SPI_prepare_params](spi-spi-prepare-params) — prepare a statement, without executing it yet
  - [SPI_getargcount](spi-spi-getargcount) — return the number of arguments needed by a statement prepared by `SPI_prepare`
  - [SPI_getargtypeid](spi-spi-getargtypeid) — return the data type OID for an argument of a statement prepared by `SPI_prepare`
  - [SPI_is_cursor_plan](spi-spi-is-cursor-plan) — return `true` if a statement prepared by `SPI_prepare` can be used with `SPI_cursor_open`
  - [SPI_execute_plan](spi-spi-execute-plan) — execute a statement prepared by `SPI_prepare`
  - [SPI_execute_plan_extended](spi-spi-execute-plan-extended) — execute a statement prepared by `SPI_prepare`
  - [SPI_execute_plan_with_paramlist](spi-spi-execute-plan-with-paramlist) — execute a statement prepared by `SPI_prepare`
  - [SPI_execp](spi-spi-execp) — execute a statement in read/write mode
  - [SPI_cursor_open](spi-spi-cursor-open) — set up a cursor using a statement created with `SPI_prepare`
  - [SPI_cursor_open_with_args](spi-spi-cursor-open-with-args) — set up a cursor using a query and parameters
  - [SPI_cursor_open_with_paramlist](spi-spi-cursor-open-with-paramlist) — set up a cursor using parameters
  - [SPI_cursor_parse_open](spi-spi-cursor-parse-open) — set up a cursor using a query string and parameters
  - [SPI_cursor_find](spi-spi-cursor-find) — find an existing cursor by name
  - [SPI_cursor_fetch](spi-spi-cursor-fetch) — fetch some rows from a cursor
  - [SPI_cursor_move](spi-spi-cursor-move) — move a cursor
  - [SPI_scroll_cursor_fetch](spi-spi-scroll-cursor-fetch) — fetch some rows from a cursor
  - [SPI_scroll_cursor_move](spi-spi-scroll-cursor-move) — move a cursor
  - [SPI_cursor_close](spi-spi-cursor-close) — close a cursor
  - [SPI_keepplan](spi-spi-keepplan) — save a prepared statement
  - [SPI_saveplan](spi-spi-saveplan) — save a prepared statement
  - [SPI_register_relation](spi-spi-register-relation) — make an ephemeral named relation available by name in SPI queries
  - [SPI_unregister_relation](spi-spi-unregister-relation) — remove an ephemeral named relation from the registry
  - [SPI_register_trigger_data](spi-spi-register-trigger-data) — make ephemeral trigger data available in SPI queries

- [47.2. Interface Support Functions](spi-interface-support)

  - [SPI_fname](spi-spi-fname) — determine the column name for the specified column number
  - [SPI_fnumber](spi-spi-fnumber) — determine the column number for the specified column name
  - [SPI_getvalue](spi-spi-getvalue) — return the string value of the specified column
  - [SPI_getbinval](spi-spi-getbinval) — return the binary value of the specified column
  - [SPI_gettype](spi-spi-gettype) — return the data type name of the specified column
  - [SPI_gettypeid](spi-spi-gettypeid) — return the data type OID of the specified column
  - [SPI_getrelname](spi-spi-getrelname) — return the name of the specified relation
  - [SPI_getnspname](spi-spi-getnspname) — return the namespace of the specified relation
  - [SPI_result_code_string](spi-spi-result-code-string) — return error code as string

- [47.3. Memory Management](spi-memory)

  - [SPI_palloc](spi-spi-palloc) — allocate memory in the upper executor context
  - [SPI_repalloc](spi-realloc) — reallocate memory in the upper executor context
  - [SPI_pfree](spi-spi-pfree) — free memory in the upper executor context
  - [SPI_copytuple](spi-spi-copytuple) — make a copy of a row in the upper executor context
  - [SPI_returntuple](spi-spi-returntuple) — prepare to return a tuple as a Datum
  - [SPI_modifytuple](spi-spi-modifytuple) — create a row by replacing selected fields of a given row
  - [SPI_freetuple](spi-spi-freetuple) — free a row allocated in the upper executor context
  - [SPI_freetuptable](spi-spi-freetupletable) — free a row set created by `SPI_execute` or a similar function
  - [SPI_freeplan](spi-spi-freeplan) — free a previously saved prepared statement

- [47.4. Transaction Management](spi-transaction)

  - [SPI_commit](spi-spi-commit) — commit the current transaction
  - [SPI_rollback](spi-spi-rollback) — abort the current transaction
  - [SPI_start_transaction](spi-spi-start-transaction) — obsolete function

  - [47.5. Visibility of Data Changes](spi-visibility)
  - [47.6. Examples](spi-examples)

The _Server Programming Interface_ (SPI) gives writers of user-defined C functions the ability to run SQL commands inside their functions or procedures. SPI is a set of interface functions to simplify access to the parser, planner, and executor. SPI also does some memory management.

### Note

The available procedural languages provide various means to execute SQL commands from functions. Most of these facilities are based on SPI, so this documentation might be of use for users of those languages as well.

Note that if a command invoked via SPI fails, then control will not be returned to your C function. Rather, the transaction or subtransaction in which your C function executes will be rolled back. (This might seem surprising given that the SPI functions mostly have documented error-return conventions. Those conventions only apply for errors detected within the SPI functions themselves, however.) It is possible to recover control after an error by establishing your own subtransaction surrounding SPI calls that might fail.

SPI functions return a nonnegative result on success (either via a returned integer value or in the global variable `SPI_result`, as described below). On error, a negative result or `NULL` will be returned.

Source code files that use SPI must include the header file `executor/spi.h`.
