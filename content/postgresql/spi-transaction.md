

|          47.4. Transaction Management         |                                                           |                                          |                                                       |                                           |
| :-------------------------------------------: | :-------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | ----------------------------------------: |
| [Prev](spi-spi-freeplan.html "SPI_freeplan")  | [Up](spi.html "Chapter 47. Server Programming Interface") | Chapter 47. Server Programming Interface | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-commit.html "SPI_commit") |

***

## 47.4. Transaction Management [#](#SPI-TRANSACTION)

  * *   [SPI\_commit](spi-spi-commit.html) — commit the current transaction
  * [SPI\_rollback](spi-spi-rollback.html) — abort the current transaction
  * [SPI\_start\_transaction](spi-spi-start-transaction.html) — obsolete function

It is not possible to run transaction control commands such as `COMMIT` and `ROLLBACK` through SPI functions such as `SPI_execute`. There are, however, separate interface functions that allow transaction control through SPI.

It is not generally safe and sensible to start and end transactions in arbitrary user-defined SQL-callable functions without taking into account the context in which they are called. For example, a transaction boundary in the middle of a function that is part of a complex SQL expression that is part of some SQL command will probably result in obscure internal errors or crashes. The interface functions presented here are primarily intended to be used by procedural language implementations to support transaction management in SQL-level procedures that are invoked by the `CALL` command, taking the context of the `CALL` invocation into account. SPI-using procedures implemented in C can implement the same logic, but the details of that are beyond the scope of this documentation.

***

|                                               |                                                           |                                           |
| :-------------------------------------------- | :-------------------------------------------------------: | ----------------------------------------: |
| [Prev](spi-spi-freeplan.html "SPI_freeplan")  | [Up](spi.html "Chapter 47. Server Programming Interface") |  [Next](spi-spi-commit.html "SPI_commit") |
| SPI\_freeplan                                 |   [Home](index.html "PostgreSQL 17devel Documentation")   |                               SPI\_commit |
