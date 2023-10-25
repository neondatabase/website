<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                          SPI\_commit                         |                                                           |                              |                                                       |                                               |
| :----------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](spi-transaction.html "47.4. Transaction Management")  | [Up](spi-transaction.html "47.4. Transaction Management") | 47.4. Transaction Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-rollback.html "SPI_rollback") |

***

## SPI\_commit

SPI\_commit, SPI\_commit\_and\_chain — commit the current transaction

## Synopsis

```

void SPI_commit(void)
```

```

void SPI_commit_and_chain(void)
```

## Description

`SPI_commit` commits the current transaction. It is approximately equivalent to running the SQL command `COMMIT`. After the transaction is committed, a new transaction is automatically started using default transaction characteristics, so that the caller can continue using SPI facilities. If there is a failure during commit, the current transaction is instead rolled back and a new transaction is started, after which the error is thrown in the usual way.

`SPI_commit_and_chain` is the same, but the new transaction is started with the same transaction characteristics as the just finished one, like with the SQL command `COMMIT AND CHAIN`.

These functions can only be executed if the SPI connection has been set as nonatomic in the call to `SPI_connect_ext`.

***

|                                                              |                                                           |                                               |
| :----------------------------------------------------------- | :-------------------------------------------------------: | --------------------------------------------: |
| [Prev](spi-transaction.html "47.4. Transaction Management")  | [Up](spi-transaction.html "47.4. Transaction Management") |  [Next](spi-spi-rollback.html "SPI_rollback") |
| 47.4. Transaction Management                                 |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                 SPI\_rollback |
