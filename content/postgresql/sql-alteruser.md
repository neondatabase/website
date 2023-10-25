<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                ALTER USER                |                                        |              |                                                       |                                                         |
| :--------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](sql-altertype.html "ALTER TYPE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-alterusermapping.html "ALTER USER MAPPING") |

***

## ALTER USER

ALTER USER — change a database role

## Synopsis

```

ALTER USER role_specification [ WITH ] option [ ... ]

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

ALTER USER name RENAME TO new_name

ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] SET configuration_parameter { TO | = } { value | DEFAULT }
ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] SET configuration_parameter FROM CURRENT
ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] RESET configuration_parameter
ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] RESET ALL

where role_specification can be:

    role_name
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER
```

## Description

`ALTER USER` is now an alias for [`ALTER ROLE`](sql-alterrole.html "ALTER ROLE").

## Compatibility

The `ALTER USER` statement is a PostgreSQL extension. The SQL standard leaves the definition of users to the implementation.

## See Also

[ALTER ROLE](sql-alterrole.html "ALTER ROLE")

***

|                                          |                                                       |                                                         |
| :--------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------: |
| [Prev](sql-altertype.html "ALTER TYPE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-alterusermapping.html "ALTER USER MAPPING") |
| ALTER TYPE                               | [Home](index.html "PostgreSQL 17devel Documentation") |                                      ALTER USER MAPPING |
