<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                     SPI\_execute\_plan                    |                                                      |                           |                                                       |                                                                         |
| :-------------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](spi-spi-is-cursor-plan.html "SPI_is_cursor_plan")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-execute-plan-extended.html "SPI_execute_plan_extended") |

***



## SPI\_execute\_plan

SPI\_execute\_plan — execute a statement prepared by `SPI_prepare`

## Synopsis

```

int SPI_execute_plan(SPIPlanPtr plan, Datum * values, const char * nulls,
                     bool read_only, long count)
```

## Description

`SPI_execute_plan` executes a statement prepared by `SPI_prepare` or one of its siblings. *`read_only`* and *`count`* have the same interpretation as in `SPI_execute`.

## Arguments

*   `SPIPlanPtr plan`

    prepared statement (returned by `SPI_prepare`)

*   `Datum * values`

    An array of actual parameter values. Must have same length as the statement's number of arguments.

*   `const char * nulls`

    An array describing which parameters are null. Must have same length as the statement's number of arguments.

    If *`nulls`* is `NULL` then `SPI_execute_plan` assumes that no parameters are null. Otherwise, each entry of the *`nulls`* array should be `' '` if the corresponding parameter value is non-null, or `'n'` if the corresponding parameter value is null. (In the latter case, the actual value in the corresponding *`values`* entry doesn't matter.) Note that *`nulls`* is not a text string, just an array: it does not need a `'\0'` terminator.

*   `bool read_only`

    `true` for read-only execution

*   `long count`

    maximum number of rows to return, or `0` for no limit

## Return Value

The return value is the same as for `SPI_execute`, with the following additional possible error (negative) results:

*   `SPI_ERROR_ARGUMENT`

    if *`plan`* is `NULL` or invalid, or *`count`* is less than 0

*   `SPI_ERROR_PARAM`

    if *`values`* is `NULL` and *`plan`* was prepared with some parameters

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute` if successful.

***

|                                                           |                                                       |                                                                         |
| :-------------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](spi-spi-is-cursor-plan.html "SPI_is_cursor_plan")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-execute-plan-extended.html "SPI_execute_plan_extended") |
| SPI\_is\_cursor\_plan                                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                            SPI\_execute\_plan\_extended |
