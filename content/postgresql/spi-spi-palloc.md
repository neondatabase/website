<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                     SPI\_palloc                    |                                                 |                         |                                                       |                                          |
| :------------------------------------------------: | :---------------------------------------------- | :---------------------: | ----------------------------------------------------: | ---------------------------------------: |
| [Prev](spi-memory.html "47.3. Memory Management")  | [Up](spi-memory.html "47.3. Memory Management") | 47.3. Memory Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-realloc.html "SPI_repalloc") |

***

[]()

## SPI\_palloc

SPI\_palloc — allocate memory in the upper executor context

## Synopsis

```

void * SPI_palloc(Size size)
```

## Description

`SPI_palloc` allocates memory in the upper executor context.

This function can only be used while connected to SPI. Otherwise, it throws an error.

## Arguments

*   `Size size`

    size in bytes of storage to allocate

## Return Value

pointer to new storage space of the specified size

***

|                                                    |                                                       |                                          |
| :------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------: |
| [Prev](spi-memory.html "47.3. Memory Management")  |    [Up](spi-memory.html "47.3. Memory Management")    |  [Next](spi-realloc.html "SPI_repalloc") |
| 47.3. Memory Management                            | [Home](index.html "PostgreSQL 17devel Documentation") |                            SPI\_repalloc |
