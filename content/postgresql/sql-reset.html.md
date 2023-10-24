<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                          RESET                          |                                        |              |                                                       |                                   |
| :-----------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------: |
| [Prev](sql-release-savepoint.html "RELEASE SAVEPOINT")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-revoke.html "REVOKE") |

***

[]()

## RESET

RESET — restore the value of a run-time parameter to the default value

## Synopsis

    RESET configuration_parameter
    RESET ALL

## Description

`RESET` restores run-time parameters to their default values. `RESET` is an alternative spelling for

    SET configuration_parameter TO DEFAULT

Refer to [SET](sql-set.html "SET") for details.

The default value is defined as the value that the parameter would have had, if no `SET` had ever been issued for it in the current session. The actual source of this value might be a compiled-in default, the configuration file, command-line options, or per-database or per-user default settings. This is subtly different from defining it as “the value that the parameter had at session start”, because if the value came from the configuration file, it will be reset to whatever is specified by the configuration file now. See [Chapter 20](runtime-config.html "Chapter 20. Server Configuration") for details.

The transactional behavior of `RESET` is the same as `SET`: its effects will be undone by transaction rollback.

## Parameters

*   *`configuration_parameter`*

    Name of a settable run-time parameter. Available parameters are documented in [Chapter 20](runtime-config.html "Chapter 20. Server Configuration") and on the [SET](sql-set.html "SET") reference page.

*   `ALL`

    Resets all settable run-time parameters to default values.

## Examples

Set the `timezone` configuration variable to its default value:

    RESET timezone;

## Compatibility

`RESET` is a PostgreSQL extension.

## See Also

[SET](sql-set.html "SET"), [SHOW](sql-show.html "SHOW")

***

|                                                         |                                                       |                                   |
| :------------------------------------------------------ | :---------------------------------------------------: | --------------------------------: |
| [Prev](sql-release-savepoint.html "RELEASE SAVEPOINT")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-revoke.html "REVOKE") |
| RELEASE SAVEPOINT                                       | [Home](index.html "PostgreSQL 17devel Documentation") |                            REVOKE |
