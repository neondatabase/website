<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              CREATE MATERIALIZED VIEW              |                                        |              |                                                       |                                                    |
| :------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-createlanguage.html "CREATE LANGUAGE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createoperator.html "CREATE OPERATOR") |

***



## CREATE MATERIALIZED VIEW

CREATE MATERIALIZED VIEW — define a new materialized view

## Synopsis

```

CREATE MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

## Description

`CREATE MATERIALIZED VIEW` defines a materialized view of a query. The query is executed and used to populate the view at the time the command is issued (unless `WITH NO DATA` is used) and may be refreshed later using `REFRESH MATERIALIZED VIEW`.

`CREATE MATERIALIZED VIEW` is similar to `CREATE TABLE AS`, except that it also remembers the query used to initialize the view, so that it can be refreshed later upon demand. A materialized view has many of the same properties as a table, but there is no support for temporary materialized views.

`CREATE MATERIALIZED VIEW` requires `CREATE` privilege on the schema used for the materialized view.

## Parameters

*   `IF NOT EXISTS`

    Do not throw an error if a materialized view with the same name already exists. A notice is issued in this case. Note that there is no guarantee that the existing materialized view is anything like the one that would have been created.

*   *`table_name`*

    The name (optionally schema-qualified) of the materialized view to be created. The name must be distinct from the name of any other relation (table, sequence, index, view, materialized view, or foreign table) in the same schema.

*   *`column_name`*

    The name of a column in the new materialized view. If column names are not provided, they are taken from the output column names of the query.

*   `USING method`

    This optional clause specifies the table access method to use to store the contents for the new materialized view; the method needs be an access method of type `TABLE`. See [Chapter 63](tableam.html "Chapter 63. Table Access Method Interface Definition") for more information. If this option is not specified, the default table access method is chosen for the new materialized view. See [default\_table\_access\_method](runtime-config-client.html#GUC-DEFAULT-TABLE-ACCESS-METHOD) for more information.

*   `WITH ( storage_parameter [= value] [, ... ] )`

    This clause specifies optional storage parameters for the new materialized view; see [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS "Storage Parameters") in the [CREATE TABLE](sql-createtable.html "CREATE TABLE") documentation for more information. All parameters supported for `CREATE TABLE` are also supported for `CREATE MATERIALIZED VIEW`. See [CREATE TABLE](sql-createtable.html "CREATE TABLE") for more information.

*   `TABLESPACE tablespace_name`

    The *`tablespace_name`* is the name of the tablespace in which the new materialized view is to be created. If not specified, [default\_tablespace](runtime-config-client.html#GUC-DEFAULT-TABLESPACE) is consulted.

*   *`query`*

    A [`SELECT`](sql-select.html "SELECT"), [`TABLE`](sql-select.html#SQL-TABLE "TABLE Command"), or [`VALUES`](sql-values.html "VALUES") command. This query will run within a security-restricted operation; in particular, calls to functions that themselves create temporary tables will fail.

*   `WITH [ NO ] DATA`

    This clause specifies whether or not the materialized view should be populated at creation time. If not, the materialized view will be flagged as unscannable and cannot be queried until `REFRESH MATERIALIZED VIEW` is used.

## Compatibility

`CREATE MATERIALIZED VIEW` is a PostgreSQL extension.

## See Also

[ALTER MATERIALIZED VIEW](sql-altermaterializedview.html "ALTER MATERIALIZED VIEW"), [CREATE TABLE AS](sql-createtableas.html "CREATE TABLE AS"), [CREATE VIEW](sql-createview.html "CREATE VIEW"), [DROP MATERIALIZED VIEW](sql-dropmaterializedview.html "DROP MATERIALIZED VIEW"), [REFRESH MATERIALIZED VIEW](sql-refreshmaterializedview.html "REFRESH MATERIALIZED VIEW")

***

|                                                    |                                                       |                                                    |
| :------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-createlanguage.html "CREATE LANGUAGE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createoperator.html "CREATE OPERATOR") |
| CREATE LANGUAGE                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                    CREATE OPERATOR |
