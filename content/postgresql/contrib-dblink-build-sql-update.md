

|                        dblink\_build\_sql\_update                       |                                                                          |                                                      |                                                       |                                                                                                   |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------------------------------: |
| [Prev](contrib-dblink-build-sql-delete.html "dblink_build_sql_delete")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](dict-int.html "F.13. dict_int —&#xA;   example full-text search dictionary for integers") |

***

## dblink\_build\_sql\_update

dblink\_build\_sql\_update — builds an UPDATE statement using a local tuple, replacing the primary key field values with alternative supplied values

## Synopsis

```

dblink_build_sql_update(text relname,
                        int2vector primary_key_attnums,
                        integer num_primary_key_atts,
                        text[] src_pk_att_vals_array,
                        text[] tgt_pk_att_vals_array) returns text
```

## Description

`dblink_build_sql_update` can be useful in doing selective replication of a local table to a remote database. It selects a row from the local table based on primary key, and then builds an SQL `UPDATE` command that will duplicate that row, but with the primary key values replaced by the values in the last argument. (To make an exact copy of the row, just specify the same values for the last two arguments.) The `UPDATE` command always assigns all fields of the row — the main difference between this and `dblink_build_sql_insert` is that it's assumed that the target row already exists in the remote table.

## Arguments

* *`relname`*

    Name of a local relation, for example `foo` or `myschema.mytab`. Include double quotes if the name is mixed-case or contains special characters, for example `"FooBar"`; without quotes, the string will be folded to lower case.

* *`primary_key_attnums`*

    Attribute numbers (1-based) of the primary key fields, for example `1 2`.

* *`num_primary_key_atts`*

    The number of primary key fields.

* *`src_pk_att_vals_array`*

    Values of the primary key fields to be used to look up the local tuple. Each field is represented in text form. An error is thrown if there is no local row with these primary key values.

* *`tgt_pk_att_vals_array`*

    Values of the primary key fields to be placed in the resulting `UPDATE` command. Each field is represented in text form.

## Return Value

Returns the requested SQL statement as text.

## Notes

As of PostgreSQL 9.0, the attribute numbers in *`primary_key_attnums`* are interpreted as logical column numbers, corresponding to the column's position in `SELECT * FROM relname`. Previous versions interpreted the numbers as physical column positions. There is a difference if any column(s) to the left of the indicated column have been dropped during the lifetime of the table.

## Examples

```

SELECT dblink_build_sql_update('foo', '1 2', 2, '{"1", "a"}', '{"1", "b"}');
                   dblink_build_sql_update
-------------------------------------------------------------
 UPDATE foo SET f1='1',f2='b',f3='1' WHERE f1='1' AND f2='b'
(1 row)
```

***

|                                                                         |                                                                          |                                                                                                   |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------: |
| [Prev](contrib-dblink-build-sql-delete.html "dblink_build_sql_delete")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](dict-int.html "F.13. dict_int —&#xA;   example full-text search dictionary for integers") |
| dblink\_build\_sql\_delete                                              |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                F.13. dict\_int — example full-text search dictionary for integers |
