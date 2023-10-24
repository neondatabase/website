<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            SPI\_start\_transaction            |                                                           |                              |                                                       |                                                                 |
| :-------------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](spi-spi-rollback.html "SPI_rollback")  | [Up](spi-transaction.html "47.4. Transaction Management") | 47.4. Transaction Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-visibility.html "47.5. Visibility of Data Changes") |

***

[]()

## SPI\_start\_transaction

SPI\_start\_transaction — obsolete function

## Synopsis

    void SPI_start_transaction(void)

## Description

`SPI_start_transaction` does nothing, and exists only for code compatibility with earlier PostgreSQL releases. It used to be required after calling `SPI_commit` or `SPI_rollback`, but now those functions start a new transaction automatically.

***

|                                               |                                                           |                                                                 |
| :-------------------------------------------- | :-------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](spi-spi-rollback.html "SPI_rollback")  | [Up](spi-transaction.html "47.4. Transaction Management") |  [Next](spi-visibility.html "47.5. Visibility of Data Changes") |
| SPI\_rollback                                 |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                47.5. Visibility of Data Changes |
