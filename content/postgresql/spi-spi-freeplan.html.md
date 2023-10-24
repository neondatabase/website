<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      SPI\_freeplan                      |                                                 |                         |                                                       |                                                              |
| :-----------------------------------------------------: | :---------------------------------------------- | :---------------------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](spi-spi-freetupletable.html "SPI_freetuptable")  | [Up](spi-memory.html "47.3. Memory Management") | 47.3. Memory Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-transaction.html "47.4. Transaction Management") |

***

## SPI\_freeplan

SPI\_freeplan — free a previously saved prepared statement

## Synopsis

    int SPI_freeplan(SPIPlanPtr plan)

## Description

`SPI_freeplan` releases a prepared statement previously returned by `SPI_prepare` or saved by `SPI_keepplan` or `SPI_saveplan`.

## Arguments

* `SPIPlanPtr plan`

    pointer to statement to free

## Return Value

0 on success; `SPI_ERROR_ARGUMENT` if *`plan`* is `NULL` or invalid

***

|                                                         |                                                       |                                                              |
| :------------------------------------------------------ | :---------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](spi-spi-freetupletable.html "SPI_freetuptable")  |    [Up](spi-memory.html "47.3. Memory Management")    |  [Next](spi-transaction.html "47.4. Transaction Management") |
| SPI\_freetuptable                                       | [Home](index.html "PostgreSQL 17devel Documentation") |                                 47.4. Transaction Management |
