<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|      IMPORT FOREIGN SCHEMA      |                                        |              |                                                       |                                   |
| :-----------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------: |
| [Prev](sql-grant.html "GRANT")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-insert.html "INSERT") |

***

[]()

## IMPORT FOREIGN SCHEMA

IMPORT FOREIGN SCHEMA — import table definitions from a foreign server

## Synopsis

    IMPORT FOREIGN SCHEMA remote_schema
        [ { LIMIT TO | EXCEPT } ( table_name [, ...] ) ]
        FROM SERVER server_name
        INTO local_schema
        [ OPTIONS ( option 'value' [, ... ] ) ]

## Description

`IMPORT FOREIGN SCHEMA` creates foreign tables that represent tables existing on a foreign server. The new foreign tables will be owned by the user issuing the command and are created with the correct column definitions and options to match the remote tables.

By default, all tables and views existing in a particular schema on the foreign server are imported. Optionally, the list of tables can be limited to a specified subset, or specific tables can be excluded. The new foreign tables are all created in the target schema, which must already exist.

To use `IMPORT FOREIGN SCHEMA`, the user must have `USAGE` privilege on the foreign server, as well as `CREATE` privilege on the target schema.

## Parameters

*   *`remote_schema`*

    The remote schema to import from. The specific meaning of a remote schema depends on the foreign data wrapper in use.

*   `LIMIT TO ( table_name [, ...] )`

    Import only foreign tables matching one of the given table names. Other tables existing in the foreign schema will be ignored.

*   `EXCEPT ( table_name [, ...] )`

    Exclude specified foreign tables from the import. All tables existing in the foreign schema will be imported except the ones listed here.

*   *`server_name`*

    The foreign server to import from.

*   *`local_schema`*

    The schema in which the imported foreign tables will be created.

*   `OPTIONS ( option 'value' [, ...] )`

    Options to be used during the import. The allowed option names and values are specific to each foreign data wrapper.

## Examples

Import table definitions from a remote schema `foreign_films` on server `film_server`, creating the foreign tables in local schema `films`:

    IMPORT FOREIGN SCHEMA foreign_films
        FROM SERVER film_server INTO films;

As above, but import only the two tables `actors` and `directors` (if they exist):

    IMPORT FOREIGN SCHEMA foreign_films LIMIT TO (actors, directors)
        FROM SERVER film_server INTO films;

## Compatibility

The `IMPORT FOREIGN SCHEMA` command conforms to the SQL standard, except that the `OPTIONS` clause is a PostgreSQL extension.

## See Also

[CREATE FOREIGN TABLE](sql-createforeigntable.html "CREATE FOREIGN TABLE"), [CREATE SERVER](sql-createserver.html "CREATE SERVER")

***

|                                 |                                                       |                                   |
| :------------------------------ | :---------------------------------------------------: | --------------------------------: |
| [Prev](sql-grant.html "GRANT")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-insert.html "INSERT") |
| GRANT                           | [Home](index.html "PostgreSQL 17devel Documentation") |                            INSERT |
