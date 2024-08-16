[#id](#ECPG-SQL-SET-AUTOCOMMIT)

## SET AUTOCOMMIT

SET AUTOCOMMIT — set the autocommit behavior of the current session

## Synopsis

```

SET AUTOCOMMIT { = | TO } { ON | OFF }
```

[#id](#id-1.7.5.20.14.3)

## Description

`SET AUTOCOMMIT` sets the autocommit behavior of the current database session. By default, embedded SQL programs are _not_ in autocommit mode, so `COMMIT` needs to be issued explicitly when desired. This command can change the session to autocommit mode, where each individual statement is committed implicitly.

[#id](#id-1.7.5.20.14.4)

## Compatibility

`SET AUTOCOMMIT` is an extension of PostgreSQL ECPG.
