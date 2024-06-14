[#id](#SQL-ALTERLARGEOBJECT)

## ALTER LARGE OBJECT

ALTER LARGE OBJECT — change the definition of a large object

## Synopsis

```
ALTER LARGE OBJECT large_object_oid OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

[#id](#id-1.9.3.18.5)

## Description

`ALTER LARGE OBJECT` changes the definition of a large object.

You must own the large object to use `ALTER LARGE OBJECT`. To alter the owner, you must also be able to `SET ROLE` to the new owning role. (However, a superuser can alter any large object anyway.) Currently, the only functionality is to assign a new owner, so both restrictions always apply.

[#id](#id-1.9.3.18.6)

## Parameters

- _`large_object_oid`_

  OID of the large object to be altered

- _`new_owner`_

  The new owner of the large object

[#id](#id-1.9.3.18.7)

## Compatibility

There is no `ALTER LARGE OBJECT` statement in the SQL standard.

[#id](#id-1.9.3.18.8)

## See Also

[Chapter 35](largeobjects)
