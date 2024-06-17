[#id](#SQL-SHOW)

## SHOW

SHOW — show the value of a run-time parameter

## Synopsis

```
SHOW name
SHOW ALL
```

[#id](#id-1.9.3.179.5)

## Description

`SHOW` will display the current setting of run-time parameters. These variables can be set using the `SET` statement, by editing the `postgresql.conf` configuration file, through the `PGOPTIONS` environmental variable (when using libpq or a libpq-based application), or through command-line flags when starting the `postgres` server. See [Chapter 20](runtime-config) for details.

[#id](#id-1.9.3.179.6)

## Parameters

- _`name`_

  The name of a run-time parameter. Available parameters are documented in [Chapter 20](runtime-config) and on the [SET](sql-set) reference page. In addition, there are a few parameters that can be shown but not set:

  - `SERVER_VERSION`

    Shows the server's version number.

  - `SERVER_ENCODING`

    Shows the server-side character set encoding. At present, this parameter can be shown but not set, because the encoding is determined at database creation time.

  - `LC_COLLATE`

    Shows the database's locale setting for collation (text ordering). At present, this parameter can be shown but not set, because the setting is determined at database creation time.

  - `LC_CTYPE`

    Shows the database's locale setting for character classification. At present, this parameter can be shown but not set, because the setting is determined at database creation time.

  - `IS_SUPERUSER`

    True if the current role has superuser privileges.

- `ALL`

  Show the values of all configuration parameters, with descriptions.

[#id](#id-1.9.3.179.7)

## Notes

The function `current_setting` produces equivalent output; see [Section 9.27.1](functions-admin#FUNCTIONS-ADMIN-SET). Also, the [`pg_settings`](view-pg-settings) system view produces the same information.

[#id](#id-1.9.3.179.8)

## Examples

Show the current setting of the parameter `DateStyle`:

```
SHOW DateStyle;
 DateStyle
-----------
 ISO, MDY
(1 row)
```

Show the current setting of the parameter `geqo`:

```
SHOW geqo;
 geqo
------
 on
(1 row)
```

Show all settings:

```
SHOW ALL;
            name         | setting |                description
-------------------------+---------+-------------------------------------------------
 allow_system_table_mods | off     | Allows modifications of the structure of ...
    .
    .
    .
 xmloption               | content | Sets whether XML data in implicit parsing ...
 zero_damaged_pages      | off     | Continues processing past damaged page headers.
(196 rows)
```

[#id](#id-1.9.3.179.9)

## Compatibility

The `SHOW` command is a PostgreSQL extension.

[#id](#id-1.9.3.179.10)

## See Also

[SET](sql-set), [RESET](sql-reset)
