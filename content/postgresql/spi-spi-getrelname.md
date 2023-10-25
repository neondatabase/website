<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 SPI\_getrelname                 |                                                                      |                                   |                                                       |                                                   |
| :---------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](spi-spi-gettypeid.html "SPI_gettypeid")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") | 47.2. Interface Support Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-getnspname.html "SPI_getnspname") |

***



## SPI\_getrelname

SPI\_getrelname — return the name of the specified relation

## Synopsis

```

char * SPI_getrelname(Relation rel)
```

## Description

`SPI_getrelname` returns a copy of the name of the specified relation. (You can use `pfree` to release the copy of the name when you don't need it anymore.)

## Arguments

*   `Relation rel`

    input relation

## Return Value

The name of the specified relation.

***

|                                                 |                                                                      |                                                   |
| :---------------------------------------------- | :------------------------------------------------------------------: | ------------------------------------------------: |
| [Prev](spi-spi-gettypeid.html "SPI_gettypeid")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") |  [Next](spi-spi-getnspname.html "SPI_getnspname") |
| SPI\_gettypeid                                  |         [Home](index.html "PostgreSQL 17devel Documentation")        |                                   SPI\_getnspname |
