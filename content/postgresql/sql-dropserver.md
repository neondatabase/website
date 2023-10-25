<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   DROP SERVER                  |                                        |              |                                                       |                                                    |
| :--------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-dropsequence.html "DROP SEQUENCE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropstatistics.html "DROP STATISTICS") |

***

[]()

## DROP SERVER

DROP SERVER — remove a foreign server descriptor

## Synopsis

```

DROP SERVER [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP SERVER` removes an existing foreign server descriptor. To execute this command, the current user must be the owner of the server.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the server does not exist. A notice is issued in this case.

*   *`name`*

    The name of an existing server.

*   `CASCADE`

    Automatically drop objects that depend on the server (such as user mappings), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the server if any objects depend on it. This is the default.

## Examples

Drop a server `foo` if it exists:

```

DROP SERVER IF EXISTS foo;
```

## Compatibility

`DROP SERVER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a PostgreSQL extension.

## See Also

[CREATE SERVER](sql-createserver.html "CREATE SERVER"), [ALTER SERVER](sql-alterserver.html "ALTER SERVER")

***

|                                                |                                                       |                                                    |
| :--------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-dropsequence.html "DROP SEQUENCE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropstatistics.html "DROP STATISTICS") |
| DROP SEQUENCE                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                    DROP STATISTICS |
