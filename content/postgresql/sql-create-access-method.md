[#id](#SQL-CREATE-ACCESS-METHOD)

## CREATE ACCESS METHOD

CREATE ACCESS METHOD — define a new access method

## Synopsis

```
CREATE ACCESS METHOD name
    TYPE access_method_type
    HANDLER handler_function
```

[#id](#id-1.9.3.56.5)

## Description

`CREATE ACCESS METHOD` creates a new access method.

The access method name must be unique within the database.

Only superusers can define new access methods.

[#id](#id-1.9.3.56.6)

## Parameters

- _`name`_

  The name of the access method to be created.

- _`access_method_type`_

  This clause specifies the type of access method to define. Only `TABLE` and `INDEX` are supported at present.

- _`handler_function`_

  _`handler_function`_ is the name (possibly schema-qualified) of a previously registered function that represents the access method. The handler function must be declared to take a single argument of type `internal`, and its return type depends on the type of access method; for `TABLE` access methods, it must be `table_am_handler` and for `INDEX` access methods, it must be `index_am_handler`. The C-level API that the handler function must implement varies depending on the type of access method. The table access method API is described in [Chapter 63](tableam) and the index access method API is described in [Chapter 64](indexam).

[#id](#id-1.9.3.56.7)

## Examples

Create an index access method `heptree` with handler function `heptree_handler`:

```
CREATE ACCESS METHOD heptree TYPE INDEX HANDLER heptree_handler;
```

[#id](#id-1.9.3.56.8)

## Compatibility

`CREATE ACCESS METHOD` is a PostgreSQL extension.

[#id](#id-1.9.3.56.9)

## See Also

[DROP ACCESS METHOD](sql-drop-access-method), [CREATE OPERATOR CLASS](sql-createopclass), [CREATE OPERATOR FAMILY](sql-createopfamily)
