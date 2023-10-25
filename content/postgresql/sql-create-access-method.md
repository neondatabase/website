<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|      CREATE ACCESS METHOD     |                                        |              |                                                       |                                                      |
| :---------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](sql-copy.html "COPY")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createaggregate.html "CREATE AGGREGATE") |

***

## CREATE ACCESS METHOD

CREATE ACCESS METHOD — define a new access method

## Synopsis

```

CREATE ACCESS METHOD name
    TYPE access_method_type
    HANDLER handler_function
```

## Description

`CREATE ACCESS METHOD` creates a new access method.

The access method name must be unique within the database.

Only superusers can define new access methods.

## Parameters

* *`name`*

    The name of the access method to be created.

* *`access_method_type`*

    This clause specifies the type of access method to define. Only `TABLE` and `INDEX` are supported at present.

* *`handler_function`*

    *`handler_function`* is the name (possibly schema-qualified) of a previously registered function that represents the access method. The handler function must be declared to take a single argument of type `internal`, and its return type depends on the type of access method; for `TABLE` access methods, it must be `table_am_handler` and for `INDEX` access methods, it must be `index_am_handler`. The C-level API that the handler function must implement varies depending on the type of access method. The table access method API is described in [Chapter 63](tableam.html "Chapter 63. Table Access Method Interface Definition") and the index access method API is described in [Chapter 64](indexam.html "Chapter 64. Index Access Method Interface Definition").

## Examples

Create an index access method `heptree` with handler function `heptree_handler`:

```

CREATE ACCESS METHOD heptree TYPE INDEX HANDLER heptree_handler;
```

## Compatibility

`CREATE ACCESS METHOD` is a PostgreSQL extension.

## See Also

[DROP ACCESS METHOD](sql-drop-access-method.html "DROP ACCESS METHOD"), [CREATE OPERATOR CLASS](sql-createopclass.html "CREATE OPERATOR CLASS"), [CREATE OPERATOR FAMILY](sql-createopfamily.html "CREATE OPERATOR FAMILY")

***

|                               |                                                       |                                                      |
| :---------------------------- | :---------------------------------------------------: | ---------------------------------------------------: |
| [Prev](sql-copy.html "COPY")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createaggregate.html "CREATE AGGREGATE") |
| COPY                          | [Home](index.html "PostgreSQL 17devel Documentation") |                                     CREATE AGGREGATE |
