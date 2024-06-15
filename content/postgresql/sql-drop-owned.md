[#id](#SQL-DROP-OWNED)

## DROP OWNED

DROP OWNED — remove database objects owned by a database role

## Synopsis

```
DROP OWNED BY { name | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.122.5)

## Description

`DROP OWNED` drops all the objects within the current database that are owned by one of the specified roles. Any privileges granted to the given roles on objects in the current database or on shared objects (databases, tablespaces, configuration parameters) will also be revoked.

[#id](#id-1.9.3.122.6)

## Parameters

- _`name`_

  The name of a role whose objects will be dropped, and whose privileges will be revoked.

- `CASCADE`

  Automatically drop objects that depend on the affected objects, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the objects owned by a role if any other database objects depend on one of the affected objects. This is the default.

[#id](#id-1.9.3.122.7)

## Notes

`DROP OWNED` is often used to prepare for the removal of one or more roles. Because `DROP OWNED` only affects the objects in the current database, it is usually necessary to execute this command in each database that contains objects owned by a role that is to be removed.

Using the `CASCADE` option might make the command recurse to objects owned by other users.

The [`REASSIGN OWNED`](sql-reassign-owned) command is an alternative that reassigns the ownership of all the database objects owned by one or more roles. However, `REASSIGN OWNED` does not deal with privileges for other objects.

Databases and tablespaces owned by the role(s) will not be removed.

See [Section 22.4](role-removal) for more discussion.

[#id](#id-1.9.3.122.8)

## Compatibility

The `DROP OWNED` command is a PostgreSQL extension.

[#id](#id-1.9.3.122.9)

## See Also

[REASSIGN OWNED](sql-reassign-owned), [DROP ROLE](sql-droprole)
