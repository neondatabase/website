<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                                      SPI\_execp                                     |                                                      |                           |                                                       |                                                     |
| :---------------------------------------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](spi-spi-execute-plan-with-paramlist.html "SPI_execute_plan_with_paramlist")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-cursor-open.html "SPI_cursor_open") |

***

[]()

## SPI\_execp

SPI\_execp — execute a statement in read/write mode

## Synopsis

```

int SPI_execp(SPIPlanPtr plan, Datum * values, const char * nulls, long count)
```

## Description

`SPI_execp` is the same as `SPI_execute_plan`, with the latter's *`read_only`* parameter always taken as `false`.

## Arguments

*   `SPIPlanPtr plan`

    prepared statement (returned by `SPI_prepare`)

*   `Datum * values`

    An array of actual parameter values. Must have same length as the statement's number of arguments.

*   `const char * nulls`

    An array describing which parameters are null. Must have same length as the statement's number of arguments.

    If *`nulls`* is `NULL` then `SPI_execp` assumes that no parameters are null. Otherwise, each entry of the *`nulls`* array should be `' '` if the corresponding parameter value is non-null, or `'n'` if the corresponding parameter value is null. (In the latter case, the actual value in the corresponding *`values`* entry doesn't matter.) Note that *`nulls`* is not a text string, just an array: it does not need a `'\0'` terminator.

*   `long count`

    maximum number of rows to return, or `0` for no limit

## Return Value

See `SPI_execute_plan`.

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute` if successful.

***

|                                                                                     |                                                       |                                                     |
| :---------------------------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](spi-spi-execute-plan-with-paramlist.html "SPI_execute_plan_with_paramlist")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-cursor-open.html "SPI_cursor_open") |
| SPI\_execute\_plan\_with\_paramlist                                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                   SPI\_cursor\_open |
