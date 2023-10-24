<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE`               |                                                                             |                                                        |                                                       |                                                                                                                |
| :--------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------------------------------------------------: |
| [Prev](test-decoding.html "F.44. test_decoding — SQL-based test/example module for WAL logical decoding")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](tsm-system-time.html "F.46. tsm_system_time —&#xA;   the SYSTEM_TIME sampling method for TABLESAMPLE") |

***

## F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE` [#](#TSM-SYSTEM-ROWS)

* [F.45.1. Examples](tsm-system-rows.html#TSM-SYSTEM-ROWS-EXAMPLES)

The `tsm_system_rows` module provides the table sampling method `SYSTEM_ROWS`, which can be used in the `TABLESAMPLE` clause of a [`SELECT`](sql-select.html "SELECT") command.

This table sampling method accepts a single integer argument that is the maximum number of rows to read. The resulting sample will always contain exactly that many rows, unless the table does not contain enough rows, in which case the whole table is selected.

Like the built-in `SYSTEM` sampling method, `SYSTEM_ROWS` performs block-level sampling, so that the sample is not completely random but may be subject to clustering effects, especially if only a small number of rows are requested.

`SYSTEM_ROWS` does not support the `REPEATABLE` clause.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

### F.45.1. Examples [#](#TSM-SYSTEM-ROWS-EXAMPLES)

Here is an example of selecting a sample of a table with `SYSTEM_ROWS`. First install the extension:

    CREATE EXTENSION tsm_system_rows;

Then you can use it in a `SELECT` command, for instance:

    SELECT * FROM my_table TABLESAMPLE SYSTEM_ROWS(100);

This command will return a sample of 100 rows from the table `my_table` (unless the table does not have 100 visible rows, in which case all its rows are returned).

***

|                                                                                                            |                                                                             |                                                                                                                |
| :--------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------: |
| [Prev](test-decoding.html "F.44. test_decoding — SQL-based test/example module for WAL logical decoding")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](tsm-system-time.html "F.46. tsm_system_time —&#xA;   the SYSTEM_TIME sampling method for TABLESAMPLE") |
| F.44. test\_decoding — SQL-based test/example module for WAL logical decoding                              |            [Home](index.html "PostgreSQL 17devel Documentation")            |                                  F.46. tsm\_system\_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE` |
