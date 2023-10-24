<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  SPI\_getnspname                  |                                                                      |                                   |                                                       |                                                                   |
| :-----------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](spi-spi-getrelname.html "SPI_getrelname")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") | 47.2. Interface Support Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-result-code-string.html "SPI_result_code_string") |

***

[]()

## SPI\_getnspname

SPI\_getnspname — return the namespace of the specified relation

## Synopsis

    char * SPI_getnspname(Relation rel)

## Description

`SPI_getnspname` returns a copy of the name of the namespace that the specified `Relation` belongs to. This is equivalent to the relation's schema. You should `pfree` the return value of this function when you are finished with it.

## Arguments

*   `Relation rel`

    input relation

## Return Value

The name of the specified relation's namespace.

***

|                                                   |                                                                      |                                                                   |
| :------------------------------------------------ | :------------------------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](spi-spi-getrelname.html "SPI_getrelname")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") |  [Next](spi-spi-result-code-string.html "SPI_result_code_string") |
| SPI\_getrelname                                   |         [Home](index.html "PostgreSQL 17devel Documentation")        |                                         SPI\_result\_code\_string |
