[#id](#SQL-DROPLANGUAGE)

## DROP LANGUAGE

DROP LANGUAGE — remove a procedural language

## Synopsis

```
DROP [ PROCEDURAL ] LANGUAGE [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.117.5)

## Description

`DROP LANGUAGE` removes the definition of a previously registered procedural language. You must be a superuser or the owner of the language to use `DROP LANGUAGE`.

### Note

As of PostgreSQL 9.1, most procedural languages have been made into “extensions”, and should therefore be removed with [`DROP EXTENSION`](sql-dropextension) not `DROP LANGUAGE`.

[#id](#id-1.9.3.117.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the language does not exist. A notice is issued in this case.

- _`name`_

  The name of an existing procedural language.

- `CASCADE`

  Automatically drop objects that depend on the language (such as functions in the language), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the language if any objects depend on it. This is the default.

[#id](#id-1.9.3.117.7)

## Examples

This command removes the procedural language `plsample`:

```
DROP LANGUAGE plsample;
```

[#id](#id-1.9.3.117.8)

## Compatibility

There is no `DROP LANGUAGE` statement in the SQL standard.

[#id](#id-1.9.3.117.9)

## See Also

[ALTER LANGUAGE](sql-alterlanguage), [CREATE LANGUAGE](sql-createlanguage)
