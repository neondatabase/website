[#id](#SQL-RESET)

## RESET

RESET — restore the value of a run-time parameter to the default value

## Synopsis

```
RESET configuration_parameter
RESET ALL
```

[#id](#id-1.9.3.165.5)

## Description

`RESET` restores run-time parameters to their default values. `RESET` is an alternative spelling for

```
SET configuration_parameter TO DEFAULT
```

Refer to [SET](sql-set) for details.

The default value is defined as the value that the parameter would have had, if no `SET` had ever been issued for it in the current session. The actual source of this value might be a compiled-in default, the configuration file, command-line options, or per-database or per-user default settings. This is subtly different from defining it as “the value that the parameter had at session start”, because if the value came from the configuration file, it will be reset to whatever is specified by the configuration file now. See [Chapter 20](runtime-config) for details.

The transactional behavior of `RESET` is the same as `SET`: its effects will be undone by transaction rollback.

[#id](#id-1.9.3.165.6)

## Parameters

- _`configuration_parameter`_

  Name of a settable run-time parameter. Available parameters are documented in [Chapter 20](runtime-config) and on the [SET](sql-set) reference page.

- `ALL`

  Resets all settable run-time parameters to default values.

[#id](#id-1.9.3.165.7)

## Examples

Set the `timezone` configuration variable to its default value:

```
RESET timezone;
```

[#id](#id-1.9.3.165.8)

## Compatibility

`RESET` is a PostgreSQL extension.

[#id](#id-1.9.3.165.9)

## See Also

[SET](sql-set), [SHOW](sql-show)
