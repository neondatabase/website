

|               SPI\_repalloc               |                                                 |                         |                                                       |                                         |
| :---------------------------------------: | :---------------------------------------------- | :---------------------: | ----------------------------------------------------: | --------------------------------------: |
| [Prev](spi-spi-palloc.html "SPI_palloc")  | [Up](spi-memory.html "47.3. Memory Management") | 47.3. Memory Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-pfree.html "SPI_pfree") |

***

## SPI\_repalloc

SPI\_repalloc — reallocate memory in the upper executor context

## Synopsis

```

void * SPI_repalloc(void * pointer, Size size)
```

## Description

`SPI_repalloc` changes the size of a memory segment previously allocated using `SPI_palloc`.

This function is no longer different from plain `repalloc`. It's kept just for backward compatibility of existing code.

## Arguments

* `void * pointer`

    pointer to existing storage to change

* `Size size`

    size in bytes of storage to allocate

## Return Value

pointer to new storage space of specified size with the contents copied from the existing area

***

|                                           |                                                       |                                         |
| :---------------------------------------- | :---------------------------------------------------: | --------------------------------------: |
| [Prev](spi-spi-palloc.html "SPI_palloc")  |    [Up](spi-memory.html "47.3. Memory Management")    |  [Next](spi-spi-pfree.html "SPI_pfree") |
| SPI\_palloc                               | [Home](index.html "PostgreSQL 17devel Documentation") |                              SPI\_pfree |
