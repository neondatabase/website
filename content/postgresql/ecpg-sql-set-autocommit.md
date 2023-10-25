

|              SET AUTOCOMMIT              |                                                             |                              |                                                       |                                                        |
| :--------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](ecpg-sql-prepare.html "PREPARE")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-set-connection.html "SET CONNECTION") |

***

## SET AUTOCOMMIT

SET AUTOCOMMIT — set the autocommit behavior of the current session

## Synopsis

```

SET AUTOCOMMIT { = | TO } { ON | OFF }
```

## Description

`SET AUTOCOMMIT` sets the autocommit behavior of the current database session. By default, embedded SQL programs are *not* in autocommit mode, so `COMMIT` needs to be issued explicitly when desired. This command can change the session to autocommit mode, where each individual statement is committed implicitly.

## Compatibility

`SET AUTOCOMMIT` is an extension of PostgreSQL ECPG.

***

|                                          |                                                             |                                                        |
| :--------------------------------------- | :---------------------------------------------------------: | -----------------------------------------------------: |
| [Prev](ecpg-sql-prepare.html "PREPARE")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-set-connection.html "SET CONNECTION") |
| PREPARE                                  |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                         SET CONNECTION |
