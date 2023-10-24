<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      SPI\_getargcount                     |                                                      |                           |                                                       |                                                       |
| :-------------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](spi-spi-prepare-params.html "SPI_prepare_params")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-getargtypeid.html "SPI_getargtypeid") |

***

[]()

## SPI\_getargcount

SPI\_getargcount — return the number of arguments needed by a statement prepared by `SPI_prepare`

## Synopsis

    int SPI_getargcount(SPIPlanPtr plan)

## Description

`SPI_getargcount` returns the number of arguments needed to execute a statement prepared by `SPI_prepare`.

## Arguments

*   `SPIPlanPtr plan`

    prepared statement (returned by `SPI_prepare`)

## Return Value

The count of expected arguments for the *`plan`*. If the *`plan`* is `NULL` or invalid, `SPI_result` is set to `SPI_ERROR_ARGUMENT` and -1 is returned.

***

|                                                           |                                                       |                                                       |
| :-------------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](spi-spi-prepare-params.html "SPI_prepare_params")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-getargtypeid.html "SPI_getargtypeid") |
| SPI\_prepare\_params                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                                     SPI\_getargtypeid |
