<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             DROP FOREIGN DATA WRAPPER            |                                        |              |                                                       |                                                         |
| :----------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](sql-dropextension.html "DROP EXTENSION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropforeigntable.html "DROP FOREIGN TABLE") |

***



## DROP FOREIGN DATA WRAPPER

DROP FOREIGN DATA WRAPPER — remove a foreign-data wrapper

## Synopsis

```

DROP FOREIGN DATA WRAPPER [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP FOREIGN DATA WRAPPER` removes an existing foreign-data wrapper. To execute this command, the current user must be the owner of the foreign-data wrapper.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the foreign-data wrapper does not exist. A notice is issued in this case.

*   *`name`*

    The name of an existing foreign-data wrapper.

*   `CASCADE`

    Automatically drop objects that depend on the foreign-data wrapper (such as foreign tables and servers), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the foreign-data wrapper if any objects depend on it. This is the default.

## Examples

Drop the foreign-data wrapper `dbi`:

```

DROP FOREIGN DATA WRAPPER dbi;
```

## Compatibility

`DROP FOREIGN DATA WRAPPER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a PostgreSQL extension.

## See Also

[CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper.html "CREATE FOREIGN DATA WRAPPER"), [ALTER FOREIGN DATA WRAPPER](sql-alterforeigndatawrapper.html "ALTER FOREIGN DATA WRAPPER")

***

|                                                  |                                                       |                                                         |
| :----------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------: |
| [Prev](sql-dropextension.html "DROP EXTENSION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropforeigntable.html "DROP FOREIGN TABLE") |
| DROP EXTENSION                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                      DROP FOREIGN TABLE |
