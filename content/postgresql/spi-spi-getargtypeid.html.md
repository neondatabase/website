<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  SPI\_getargtypeid                  |                                                      |                           |                                                       |                                                           |
| :-------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](spi-spi-getargcount.html "SPI_getargcount")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-is-cursor-plan.html "SPI_is_cursor_plan") |

***

## SPI\_getargtypeid

SPI\_getargtypeid — return the data type OID for an argument of a statement prepared by `SPI_prepare`

## Synopsis

    Oid SPI_getargtypeid(SPIPlanPtr plan, int argIndex)

## Description

`SPI_getargtypeid` returns the OID representing the type for the *`argIndex`*'th argument of a statement prepared by `SPI_prepare`. First argument is at index zero.

## Arguments

* `SPIPlanPtr plan`

    prepared statement (returned by `SPI_prepare`)

* `int argIndex`

    zero based index of the argument

## Return Value

The type OID of the argument at the given index. If the *`plan`* is `NULL` or invalid, or *`argIndex`* is less than 0 or not less than the number of arguments declared for the *`plan`*, `SPI_result` is set to `SPI_ERROR_ARGUMENT` and `InvalidOid` is returned.

***

|                                                     |                                                       |                                                           |
| :-------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------: |
| [Prev](spi-spi-getargcount.html "SPI_getargcount")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-is-cursor-plan.html "SPI_is_cursor_plan") |
| SPI\_getargcount                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                     SPI\_is\_cursor\_plan |
