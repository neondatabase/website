[#id](#SQL-ALTERLANGUAGE)

## ALTER LANGUAGE

ALTER LANGUAGE — change the definition of a procedural language

## Synopsis

```
ALTER [ PROCEDURAL ] LANGUAGE name RENAME TO new_name
ALTER [ PROCEDURAL ] LANGUAGE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

[#id](#id-1.9.3.17.5)

## Description

`ALTER LANGUAGE` changes the definition of a procedural language. The only functionality is to rename the language or assign a new owner. You must be superuser or owner of the language to use `ALTER LANGUAGE`.

[#id](#id-1.9.3.17.6)

## Parameters

- _`name`_

  Name of a language

- _`new_name`_

  The new name of the language

- _`new_owner`_

  The new owner of the language

[#id](#id-1.9.3.17.7)

## Compatibility

There is no `ALTER LANGUAGE` statement in the SQL standard.

[#id](#id-1.9.3.17.8)

## See Also

[CREATE LANGUAGE](sql-createlanguage), [DROP LANGUAGE](sql-droplanguage)
