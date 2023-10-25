<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  F.46. tsm\_system\_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE`                 |                                                                             |                                                        |                                                       |                                                                                             |
| :------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------------------------: |
| [Prev](tsm-system-rows.html "F.45. tsm_system_rows —&#xA;   the SYSTEM_ROWS sampling method for TABLESAMPLE")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](unaccent.html "F.47. unaccent — a text search dictionary which removes diacritics") |

***

## F.46. tsm\_system\_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE` [#](#TSM-SYSTEM-TIME)

* [F.46.1. Examples](tsm-system-time.html#TSM-SYSTEM-TIME-EXAMPLES)

The `tsm_system_time` module provides the table sampling method `SYSTEM_TIME`, which can be used in the `TABLESAMPLE` clause of a [`SELECT`](sql-select.html "SELECT") command.

This table sampling method accepts a single floating-point argument that is the maximum number of milliseconds to spend reading the table. This gives you direct control over how long the query takes, at the price that the size of the sample becomes hard to predict. The resulting sample will contain as many rows as could be read in the specified time, unless the whole table has been read first.

Like the built-in `SYSTEM` sampling method, `SYSTEM_TIME` performs block-level sampling, so that the sample is not completely random but may be subject to clustering effects, especially if only a small number of rows are selected.

`SYSTEM_TIME` does not support the `REPEATABLE` clause.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

### F.46.1. Examples [#](#TSM-SYSTEM-TIME-EXAMPLES)

Here is an example of selecting a sample of a table with `SYSTEM_TIME`. First install the extension:

```

CREATE EXTENSION tsm_system_time;
```

Then you can use it in a `SELECT` command, for instance:

```

SELECT * FROM my_table TABLESAMPLE SYSTEM_TIME(1000);
```

This command will return as large a sample of `my_table` as it can read in 1 second (1000 milliseconds). Of course, if the whole table can be read in under 1 second, all its rows will be returned.

***

|                                                                                                                |                                                                             |                                                                                             |
| :------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------: |
| [Prev](tsm-system-rows.html "F.45. tsm_system_rows —&#xA;   the SYSTEM_ROWS sampling method for TABLESAMPLE")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](unaccent.html "F.47. unaccent — a text search dictionary which removes diacritics") |
| F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE`                                  |            [Home](index.html "PostgreSQL 17devel Documentation")            |                          F.47. unaccent — a text search dictionary which removes diacritics |
