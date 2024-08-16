[#id](#TSM-SYSTEM-TIME)

## F.47. tsm_system_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE` [#](#TSM-SYSTEM-TIME)

- [F.47.1. Examples](tsm-system-time#TSM-SYSTEM-TIME-EXAMPLES)

The `tsm_system_time` module provides the table sampling method `SYSTEM_TIME`, which can be used in the `TABLESAMPLE` clause of a [`SELECT`](sql-select) command.

This table sampling method accepts a single floating-point argument that is the maximum number of milliseconds to spend reading the table. This gives you direct control over how long the query takes, at the price that the size of the sample becomes hard to predict. The resulting sample will contain as many rows as could be read in the specified time, unless the whole table has been read first.

Like the built-in `SYSTEM` sampling method, `SYSTEM_TIME` performs block-level sampling, so that the sample is not completely random but may be subject to clustering effects, especially if only a small number of rows are selected.

`SYSTEM_TIME` does not support the `REPEATABLE` clause.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

[#id](#TSM-SYSTEM-TIME-EXAMPLES)

### F.47.1. Examples [#](#TSM-SYSTEM-TIME-EXAMPLES)

Here is an example of selecting a sample of a table with `SYSTEM_TIME`. First install the extension:

```
CREATE EXTENSION tsm_system_time;
```

Then you can use it in a `SELECT` command, for instance:

```
SELECT * FROM my_table TABLESAMPLE SYSTEM_TIME(1000);
```

This command will return as large a sample of `my_table` as it can read in 1 second (1000 milliseconds). Of course, if the whole table can be read in under 1 second, all its rows will be returned.
