[#id](#SQL-CREATEGROUP)

## CREATE GROUP

CREATE GROUP — define a new database role

## Synopsis

```
CREATE GROUP name [ [ WITH ] option [ ... ] ]

where option can be:

      SUPERUSER | NOSUPERUSER
    | CREATEDB | NOCREATEDB
    | CREATEROLE | NOCREATEROLE
    | INHERIT | NOINHERIT
    | LOGIN | NOLOGIN
    | REPLICATION | NOREPLICATION
    | BYPASSRLS | NOBYPASSRLS
    | CONNECTION LIMIT connlimit
    | [ ENCRYPTED ] PASSWORD 'password' | PASSWORD NULL
    | VALID UNTIL 'timestamp'
    | IN ROLE role_name [, ...]
    | IN GROUP role_name [, ...]
    | ROLE role_name [, ...]
    | ADMIN role_name [, ...]
    | USER role_name [, ...]
    | SYSID uid
```

[#id](#id-1.9.3.68.5)

## Description

`CREATE GROUP` is now an alias for [CREATE ROLE](sql-createrole).

[#id](#id-1.9.3.68.6)

## Compatibility

There is no `CREATE GROUP` statement in the SQL standard.

[#id](#id-1.9.3.68.7)

## See Also

[CREATE ROLE](sql-createrole)
