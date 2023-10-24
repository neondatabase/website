<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        dblink\_get\_pkey                        |                                                                          |                                                      |                                                       |                                                                         |
| :-------------------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](contrib-dblink-cancel-query.html "dblink_cancel_query")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-build-sql-insert.html "dblink_build_sql_insert") |

***

[]()

## dblink\_get\_pkey

dblink\_get\_pkey — returns the positions and field names of a relation's primary key fields

## Synopsis

    dblink_get_pkey(text relname) returns setof dblink_pkey_results

## Description

`dblink_get_pkey` provides information about the primary key of a relation in the local database. This is sometimes useful in generating queries to be sent to remote databases.

## Arguments

*   *`relname`*

    Name of a local relation, for example `foo` or `myschema.mytab`. Include double quotes if the name is mixed-case or contains special characters, for example `"FooBar"`; without quotes, the string will be folded to lower case.

## Return Value

Returns one row for each primary key field, or no rows if the relation has no primary key. The result row type is defined as

    CREATE TYPE dblink_pkey_results AS (position int, colname text);

The `position` column simply runs from 1 to *`N`*; it is the number of the field within the primary key, not the number within the table's columns.

## Examples

    CREATE TABLE foobar (
        f1 int,
        f2 int,
        f3 int,
        PRIMARY KEY (f1, f2, f3)
    );
    CREATE TABLE

    SELECT * FROM dblink_get_pkey('foobar');
     position | colname
    ----------+---------
            1 | f1
            2 | f2
            3 | f3
    (3 rows)

***

|                                                                 |                                                                          |                                                                         |
| :-------------------------------------------------------------- | :----------------------------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](contrib-dblink-cancel-query.html "dblink_cancel_query")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-build-sql-insert.html "dblink_build_sql_insert") |
| dblink\_cancel\_query                                           |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                              dblink\_build\_sql\_insert |
