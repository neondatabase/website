<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              SPI\_copytuple             |                                                 |                         |                                                       |                                                     |
| :-------------------------------------: | :---------------------------------------------- | :---------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](spi-spi-pfree.html "SPI_pfree")  | [Up](spi-memory.html "47.3. Memory Management") | 47.3. Memory Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-returntuple.html "SPI_returntuple") |

***

[]()

## SPI\_copytuple

SPI\_copytuple — make a copy of a row in the upper executor context

## Synopsis

    HeapTuple SPI_copytuple(HeapTuple row)

## Description

`SPI_copytuple` makes a copy of a row in the upper executor context. This is normally used to return a modified row from a trigger. In a function declared to return a composite type, use `SPI_returntuple` instead.

This function can only be used while connected to SPI. Otherwise, it returns NULL and sets `SPI_result` to `SPI_ERROR_UNCONNECTED`.

## Arguments

*   `HeapTuple row`

    row to be copied

## Return Value

the copied row, or `NULL` on error (see `SPI_result` for an error indication)

***

|                                         |                                                       |                                                     |
| :-------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](spi-spi-pfree.html "SPI_pfree")  |    [Up](spi-memory.html "47.3. Memory Management")    |  [Next](spi-spi-returntuple.html "SPI_returntuple") |
| SPI\_pfree                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                    SPI\_returntuple |
