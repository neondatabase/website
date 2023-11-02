## ALTER LARGE OBJECT

ALTER LARGE OBJECT — change the definition of a large object

## Synopsis

```

ALTER LARGE OBJECT large_object_oid OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description

`ALTER LARGE OBJECT` changes the definition of a large object.

You must own the large object to use `ALTER LARGE OBJECT`. To alter the owner, you must also be able to `SET ROLE` to the new owning role. (However, a superuser can alter any large object anyway.) Currently, the only functionality is to assign a new owner, so both restrictions always apply.

## Parameters

* *`large_object_oid`*

    OID of the large object to be altered

* *`new_owner`*

    The new owner of the large object

## Compatibility

There is no `ALTER LARGE OBJECT` statement in the SQL standard.

## See Also

[Chapter 35](largeobjects "Chapter 35. Large Objects")