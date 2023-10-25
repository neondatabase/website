<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    SPI\_freetuple                   |                                                 |                         |                                                       |                                                         |
| :-------------------------------------------------: | :---------------------------------------------- | :---------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](spi-spi-modifytuple.html "SPI_modifytuple")  | [Up](spi-memory.html "47.3. Memory Management") | 47.3. Memory Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-freetupletable.html "SPI_freetuptable") |

***

## SPI\_freetuple

SPI\_freetuple — free a row allocated in the upper executor context

## Synopsis

```

void SPI_freetuple(HeapTuple row)
```

## Description

`SPI_freetuple` frees a row previously allocated in the upper executor context.

This function is no longer different from plain `heap_freetuple`. It's kept just for backward compatibility of existing code.

## Arguments

* `HeapTuple row`

    row to free

***

|                                                     |                                                       |                                                         |
| :-------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------: |
| [Prev](spi-spi-modifytuple.html "SPI_modifytuple")  |    [Up](spi-memory.html "47.3. Memory Management")    |  [Next](spi-spi-freetupletable.html "SPI_freetuptable") |
| SPI\_modifytuple                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                       SPI\_freetuptable |
