<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  DROP CONVERSION                 |                                        |              |                                                       |                                                |
| :----------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](sql-dropcollation.html "DROP COLLATION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropdatabase.html "DROP DATABASE") |

***

## DROP CONVERSION

DROP CONVERSION — remove a conversion

## Synopsis

```

DROP CONVERSION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description

`DROP CONVERSION` removes a previously defined conversion. To be able to drop a conversion, you must own the conversion.

## Parameters

* `IF EXISTS`

    Do not throw an error if the conversion does not exist. A notice is issued in this case.

* *`name`*

    The name of the conversion. The conversion name can be schema-qualified.

* `CASCADE``RESTRICT`

    These key words do not have any effect, since there are no dependencies on conversions.

## Examples

To drop the conversion named `myname`:

```

DROP CONVERSION myname;
```

## Compatibility

There is no `DROP CONVERSION` statement in the SQL standard, but a `DROP TRANSLATION` statement that goes along with the `CREATE TRANSLATION` statement that is similar to the `CREATE CONVERSION` statement in PostgreSQL.

## See Also

[ALTER CONVERSION](sql-alterconversion.html "ALTER CONVERSION"), [CREATE CONVERSION](sql-createconversion.html "CREATE CONVERSION")

***

|                                                  |                                                       |                                                |
| :----------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](sql-dropcollation.html "DROP COLLATION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropdatabase.html "DROP DATABASE") |
| DROP COLLATION                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                  DROP DATABASE |
