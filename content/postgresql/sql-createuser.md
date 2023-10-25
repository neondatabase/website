

|                 CREATE USER                |                                        |              |                                                       |                                                           |
| :----------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](sql-createtype.html "CREATE TYPE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createusermapping.html "CREATE USER MAPPING") |

***

## CREATE USER

CREATE USER — define a new database role

## Synopsis

```

CREATE USER name [ [ WITH ] option [ ... ] ]

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

## Description

`CREATE USER` is now an alias for [`CREATE ROLE`](sql-createrole.html "CREATE ROLE"). The only difference is that when the command is spelled `CREATE USER`, `LOGIN` is assumed by default, whereas `NOLOGIN` is assumed when the command is spelled `CREATE ROLE`.

## Compatibility

The `CREATE USER` statement is a PostgreSQL extension. The SQL standard leaves the definition of users to the implementation.

## See Also

[CREATE ROLE](sql-createrole.html "CREATE ROLE")

***

|                                            |                                                       |                                                           |
| :----------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------: |
| [Prev](sql-createtype.html "CREATE TYPE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createusermapping.html "CREATE USER MAPPING") |
| CREATE TYPE                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                       CREATE USER MAPPING |
