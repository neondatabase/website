<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        DROP TRANSFORM                        |                                        |              |                                                       |                                              |
| :----------------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-droptstemplate.html "DROP TEXT SEARCH TEMPLATE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-droptrigger.html "DROP TRIGGER") |

***

[]()

## DROP TRANSFORM

DROP TRANSFORM — remove a transform

## Synopsis

```

DROP TRANSFORM [ IF EXISTS ] FOR type_name LANGUAGE lang_name [ CASCADE | RESTRICT ]
```

## Description

`DROP TRANSFORM` removes a previously defined transform.

To be able to drop a transform, you must own the type and the language. These are the same privileges that are required to create a transform.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the transform does not exist. A notice is issued in this case.

*   *`type_name`*

    The name of the data type of the transform.

*   *`lang_name`*

    The name of the language of the transform.

*   `CASCADE`

    Automatically drop objects that depend on the transform, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the transform if any objects depend on it. This is the default.

## Examples

To drop the transform for type `hstore` and language `plpython3u`:

```

DROP TRANSFORM FOR hstore LANGUAGE plpython3u;
```

## Compatibility

This form of `DROP TRANSFORM` is a PostgreSQL extension. See [CREATE TRANSFORM](sql-createtransform.html "CREATE TRANSFORM") for details.

## See Also

[CREATE TRANSFORM](sql-createtransform.html "CREATE TRANSFORM")

***

|                                                              |                                                       |                                              |
| :----------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-droptstemplate.html "DROP TEXT SEARCH TEMPLATE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-droptrigger.html "DROP TRIGGER") |
| DROP TEXT SEARCH TEMPLATE                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                 DROP TRIGGER |
