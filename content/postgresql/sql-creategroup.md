

|                    CREATE GROUP                    |                                        |              |                                                       |                                              |
| :------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-createfunction.html "CREATE FUNCTION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createindex.html "CREATE INDEX") |

***

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

## Description

`CREATE GROUP` is now an alias for [CREATE ROLE](sql-createrole.html "CREATE ROLE").

## Compatibility

There is no `CREATE GROUP` statement in the SQL standard.

## See Also

[CREATE ROLE](sql-createrole.html "CREATE ROLE")

***

|                                                    |                                                       |                                              |
| :------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-createfunction.html "CREATE FUNCTION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createindex.html "CREATE INDEX") |
| CREATE FUNCTION                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                 CREATE INDEX |
