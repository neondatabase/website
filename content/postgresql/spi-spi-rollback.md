<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               SPI\_rollback               |                                                           |                              |                                                       |                                                                 |
| :---------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](spi-spi-commit.html "SPI_commit")  | [Up](spi-transaction.html "47.4. Transaction Management") | 47.4. Transaction Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-start-transaction.html "SPI_start_transaction") |

***



## SPI\_rollback

SPI\_rollback, SPI\_rollback\_and\_chain — abort the current transaction

## Synopsis

```

void SPI_rollback(void)
```

```

void SPI_rollback_and_chain(void)
```

## Description

`SPI_rollback` rolls back the current transaction. It is approximately equivalent to running the SQL command `ROLLBACK`. After the transaction is rolled back, a new transaction is automatically started using default transaction characteristics, so that the caller can continue using SPI facilities.

`SPI_rollback_and_chain` is the same, but the new transaction is started with the same transaction characteristics as the just finished one, like with the SQL command `ROLLBACK AND CHAIN`.

These functions can only be executed if the SPI connection has been set as nonatomic in the call to `SPI_connect_ext`.

***

|                                           |                                                           |                                                                 |
| :---------------------------------------- | :-------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](spi-spi-commit.html "SPI_commit")  | [Up](spi-transaction.html "47.4. Transaction Management") |  [Next](spi-spi-start-transaction.html "SPI_start_transaction") |
| SPI\_commit                               |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                         SPI\_start\_transaction |
