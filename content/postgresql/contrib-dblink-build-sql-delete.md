[#id](#CONTRIB-DBLINK-BUILD-SQL-DELETE)

## dblink_build_sql_delete

dblink_build_sql_delete — builds a DELETE statement using supplied values for primary key field values

## Synopsis

```

dblink_build_sql_delete(text relname,
                        int2vector primary_key_attnums,
                        integer num_primary_key_atts,
                        text[] tgt_pk_att_vals_array) returns text
```

[#id](#id-1.11.7.22.22.5)

## Description

`dblink_build_sql_delete` can be useful in doing selective replication of a local table to a remote database. It builds an SQL `DELETE` command that will delete the row with the given primary key values.

[#id](#id-1.11.7.22.22.6)

## Arguments

- _`relname`_

  Name of a local relation, for example `foo` or `myschema.mytab`. Include double quotes if the name is mixed-case or contains special characters, for example `"FooBar"`; without quotes, the string will be folded to lower case.

- _`primary_key_attnums`_

  Attribute numbers (1-based) of the primary key fields, for example `1 2`.

- _`num_primary_key_atts`_

  The number of primary key fields.

- _`tgt_pk_att_vals_array`_

  Values of the primary key fields to be used in the resulting `DELETE` command. Each field is represented in text form.

[#id](#id-1.11.7.22.22.7)

## Return Value

Returns the requested SQL statement as text.

[#id](#id-1.11.7.22.22.8)

## Notes

As of PostgreSQL 9.0, the attribute numbers in _`primary_key_attnums`_ are interpreted as logical column numbers, corresponding to the column's position in `SELECT * FROM relname`. Previous versions interpreted the numbers as physical column positions. There is a difference if any column(s) to the left of the indicated column have been dropped during the lifetime of the table.

[#id](#id-1.11.7.22.22.9)

## Examples

```

SELECT dblink_build_sql_delete('"MyFoo"', '1 2', 2, '{"1", "b"}');
           dblink_build_sql_delete
---------------------------------------------
 DELETE FROM "MyFoo" WHERE f1='1' AND f2='b'
(1 row)
```
