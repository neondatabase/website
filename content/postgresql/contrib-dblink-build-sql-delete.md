<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        dblink\_build\_sql\_delete                       |                                                                          |                                                      |                                                       |                                                                         |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](contrib-dblink-build-sql-insert.html "dblink_build_sql_insert")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-build-sql-update.html "dblink_build_sql_update") |

***



## dblink\_build\_sql\_delete

dblink\_build\_sql\_delete — builds a DELETE statement using supplied values for primary key field values

## Synopsis

```

dblink_build_sql_delete(text relname,
                        int2vector primary_key_attnums,
                        integer num_primary_key_atts,
                        text[] tgt_pk_att_vals_array) returns text
```

## Description

`dblink_build_sql_delete` can be useful in doing selective replication of a local table to a remote database. It builds an SQL `DELETE` command that will delete the row with the given primary key values.

## Arguments

*   *`relname`*

    Name of a local relation, for example `foo` or `myschema.mytab`. Include double quotes if the name is mixed-case or contains special characters, for example `"FooBar"`; without quotes, the string will be folded to lower case.

*   *`primary_key_attnums`*

    Attribute numbers (1-based) of the primary key fields, for example `1 2`.

*   *`num_primary_key_atts`*

    The number of primary key fields.

*   *`tgt_pk_att_vals_array`*

    Values of the primary key fields to be used in the resulting `DELETE` command. Each field is represented in text form.

## Return Value

Returns the requested SQL statement as text.

## Notes

As of PostgreSQL 9.0, the attribute numbers in *`primary_key_attnums`* are interpreted as logical column numbers, corresponding to the column's position in `SELECT * FROM relname`. Previous versions interpreted the numbers as physical column positions. There is a difference if any column(s) to the left of the indicated column have been dropped during the lifetime of the table.

## Examples

```

SELECT dblink_build_sql_delete('"MyFoo"', '1 2', 2, '{"1", "b"}');
           dblink_build_sql_delete
---------------------------------------------
 DELETE FROM "MyFoo" WHERE f1='1' AND f2='b'
(1 row)
```

***

|                                                                         |                                                                          |                                                                         |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](contrib-dblink-build-sql-insert.html "dblink_build_sql_insert")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-build-sql-update.html "dblink_build_sql_update") |
| dblink\_build\_sql\_insert                                              |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                              dblink\_build\_sql\_update |
