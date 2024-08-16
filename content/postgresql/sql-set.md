[#id](#SQL-SET)

## SET

SET — change a run-time parameter

## Synopsis

```
SET [ SESSION | LOCAL ] configuration_parameter { TO | = } { value | 'value' | DEFAULT }
SET [ SESSION | LOCAL ] TIME ZONE { value | 'value' | LOCAL | DEFAULT }
```

[#id](#id-1.9.3.174.5)

## Description

The `SET` command changes run-time configuration parameters. Many of the run-time parameters listed in [Chapter 20](runtime-config) can be changed on-the-fly with `SET`. (Some parameters can only be changed by superusers and users who have been granted `SET` privilege on that parameter. There are also parameters that cannot be changed after server or session start.) `SET` only affects the value used by the current session.

If `SET` (or equivalently `SET SESSION`) is issued within a transaction that is later aborted, the effects of the `SET` command disappear when the transaction is rolled back. Once the surrounding transaction is committed, the effects will persist until the end of the session, unless overridden by another `SET`.

The effects of `SET LOCAL` last only till the end of the current transaction, whether committed or not. A special case is `SET` followed by `SET LOCAL` within a single transaction: the `SET LOCAL` value will be seen until the end of the transaction, but afterwards (if the transaction is committed) the `SET` value will take effect.

The effects of `SET` or `SET LOCAL` are also canceled by rolling back to a savepoint that is earlier than the command.

If `SET LOCAL` is used within a function that has a `SET` option for the same variable (see [CREATE FUNCTION](sql-createfunction)), the effects of the `SET LOCAL` command disappear at function exit; that is, the value in effect when the function was called is restored anyway. This allows `SET LOCAL` to be used for dynamic or repeated changes of a parameter within a function, while still having the convenience of using the `SET` option to save and restore the caller's value. However, a regular `SET` command overrides any surrounding function's `SET` option; its effects will persist unless rolled back.

### Note

In PostgreSQL versions 8.0 through 8.2, the effects of a `SET LOCAL` would be canceled by releasing an earlier savepoint, or by successful exit from a PL/pgSQL exception block. This behavior has been changed because it was deemed unintuitive.

[#id](#id-1.9.3.174.6)

## Parameters

- `SESSION`

  Specifies that the command takes effect for the current session. (This is the default if neither `SESSION` nor `LOCAL` appears.)

- `LOCAL`

  Specifies that the command takes effect for only the current transaction. After `COMMIT` or `ROLLBACK`, the session-level setting takes effect again. Issuing this outside of a transaction block emits a warning and otherwise has no effect.

- _`configuration_parameter`_

  Name of a settable run-time parameter. Available parameters are documented in [Chapter 20](runtime-config) and below.

- _`value`_

  New value of parameter. Values can be specified as string constants, identifiers, numbers, or comma-separated lists of these, as appropriate for the particular parameter. `DEFAULT` can be written to specify resetting the parameter to its default value (that is, whatever value it would have had if no `SET` had been executed in the current session).

Besides the configuration parameters documented in [Chapter 20](runtime-config), there are a few that can only be adjusted using the `SET` command or that have a special syntax:

- `SCHEMA`

  `SET SCHEMA 'value'` is an alias for `SET search_path TO value`. Only one schema can be specified using this syntax.

- `NAMES`

  `SET NAMES value` is an alias for `SET client_encoding TO value`.

- `SEED`

  Sets the internal seed for the random number generator (the function `random`). Allowed values are floating-point numbers between -1 and 1 inclusive.

  The seed can also be set by invoking the function `setseed`:

  ```
  SELECT setseed(value);
  ```

- `TIME ZONE`

  `SET TIME ZONE 'value'` is an alias for `SET timezone TO 'value'`. The syntax `SET TIME ZONE` allows special syntax for the time zone specification. Here are examples of valid values:

  - `'PST8PDT'`

    The time zone for Berkeley, California.

  - `'Europe/Rome'`

    The time zone for Italy.

  - `-7`

    The time zone 7 hours west from UTC (equivalent to PDT). Positive values are east from UTC.

  - `INTERVAL '-08:00' HOUR TO MINUTE`

    The time zone 8 hours west from UTC (equivalent to PST).

  - `LOCAL``DEFAULT`

    Set the time zone to your local time zone (that is, the server's default value of `timezone`).

  Timezone settings given as numbers or intervals are internally translated to POSIX timezone syntax. For example, after `SET TIME ZONE -7`, `SHOW TIME ZONE` would report `<-07>+07`.

  Time zone abbreviations are not supported by `SET`; see [Section 8.5.3](datatype-datetime#DATATYPE-TIMEZONES) for more information about time zones.

[#id](#id-1.9.3.174.7)

## Notes

The function `set_config` provides equivalent functionality; see [Section 9.27.1](functions-admin#FUNCTIONS-ADMIN-SET). Also, it is possible to UPDATE the [`pg_settings`](view-pg-settings) system view to perform the equivalent of `SET`.

[#id](#id-1.9.3.174.8)

## Examples

Set the schema search path:

```
SET search_path TO my_schema, public;
```

Set the style of date to traditional POSTGRES with “day before month” input convention:

```
SET datestyle TO postgres, dmy;
```

Set the time zone for Berkeley, California:

```
SET TIME ZONE 'PST8PDT';
```

Set the time zone for Italy:

```
SET TIME ZONE 'Europe/Rome';
```

[#id](#id-1.9.3.174.9)

## Compatibility

`SET TIME ZONE` extends syntax defined in the SQL standard. The standard allows only numeric time zone offsets while PostgreSQL allows more flexible time-zone specifications. All other `SET` features are PostgreSQL extensions.

[#id](#id-1.9.3.174.10)

## See Also

[RESET](sql-reset), [SHOW](sql-show)
