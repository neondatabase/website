

|            SPI\_cursor\_open\_with\_args            |                                                      |                           |                                                       |                                                                                   |
| :-------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](spi-spi-cursor-open.html "SPI_cursor_open")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-cursor-open-with-paramlist.html "SPI_cursor_open_with_paramlist") |

***

## SPI\_cursor\_open\_with\_args

SPI\_cursor\_open\_with\_args — set up a cursor using a query and parameters

## Synopsis

```

Portal SPI_cursor_open_with_args(const char *name,
                                 const char *command,
                                 int nargs, Oid *argtypes,
                                 Datum *values, const char *nulls,
                                 bool read_only, int cursorOptions)
```

## Description

`SPI_cursor_open_with_args` sets up a cursor (internally, a portal) that will execute the specified query. Most of the parameters have the same meanings as the corresponding parameters to `SPI_prepare_cursor` and `SPI_cursor_open`.

For one-time query execution, this function should be preferred over `SPI_prepare_cursor` followed by `SPI_cursor_open`. If the same command is to be executed with many different parameters, either method might be faster, depending on the cost of re-planning versus the benefit of custom plans.

The passed-in parameter data will be copied into the cursor's portal, so it can be freed while the cursor still exists.

This function is now deprecated in favor of `SPI_cursor_parse_open`, which provides equivalent functionality using a more modern API for handling query parameters.

## Arguments

* `const char * name`

    name for portal, or `NULL` to let the system select a name

* `const char * command`

    command string

* `int nargs`

    number of input parameters (`$1`, `$2`, etc.)

* `Oid * argtypes`

    an array of length *`nargs`*, containing the OIDs of the data types of the parameters

* `Datum * values`

    an array of length *`nargs`*, containing the actual parameter values

* `const char * nulls`

    an array of length *`nargs`*, describing which parameters are null

    If *`nulls`* is `NULL` then `SPI_cursor_open_with_args` assumes that no parameters are null. Otherwise, each entry of the *`nulls`* array should be `' '` if the corresponding parameter value is non-null, or `'n'` if the corresponding parameter value is null. (In the latter case, the actual value in the corresponding *`values`* entry doesn't matter.) Note that *`nulls`* is not a text string, just an array: it does not need a `'\0'` terminator.

* `bool read_only`

    `true` for read-only execution

* `int cursorOptions`

    integer bit mask of cursor options; zero produces default behavior

## Return Value

Pointer to portal containing the cursor. Note there is no error return convention; any error will be reported via `elog`.

***

|                                                     |                                                       |                                                                                   |
| :-------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](spi-spi-cursor-open.html "SPI_cursor_open")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-cursor-open-with-paramlist.html "SPI_cursor_open_with_paramlist") |
| SPI\_cursor\_open                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                                SPI\_cursor\_open\_with\_paramlist |
