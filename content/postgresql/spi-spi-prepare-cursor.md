<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             SPI\_prepare\_cursor            |                                                      |                           |                                                       |                                                               |
| :-----------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](spi-spi-prepare.html "SPI_prepare")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-prepare-extended.html "SPI_prepare_extended") |

***

[]()

## SPI\_prepare\_cursor

SPI\_prepare\_cursor — prepare a statement, without executing it yet

## Synopsis

```

SPIPlanPtr SPI_prepare_cursor(const char * command, int nargs,
                              Oid * argtypes, int cursorOptions)
```

## Description

`SPI_prepare_cursor` is identical to `SPI_prepare`, except that it also allows specification of the planner's “cursor options” parameter. This is a bit mask having the values shown in `nodes/parsenodes.h` for the `options` field of `DeclareCursorStmt`. `SPI_prepare` always takes the cursor options as zero.

This function is now deprecated in favor of `SPI_prepare_extended`.

## Arguments

*   `const char * command`

    command string

*   `int nargs`

    number of input parameters (`$1`, `$2`, etc.)

*   `Oid * argtypes`

    pointer to an array containing the OIDs of the data types of the parameters

*   `int cursorOptions`

    integer bit mask of cursor options; zero produces default behavior

## Return Value

`SPI_prepare_cursor` has the same return conventions as `SPI_prepare`.

## Notes

Useful bits to set in *`cursorOptions`* include `CURSOR_OPT_SCROLL`, `CURSOR_OPT_NO_SCROLL`, `CURSOR_OPT_FAST_PLAN`, `CURSOR_OPT_GENERIC_PLAN`, and `CURSOR_OPT_CUSTOM_PLAN`. Note in particular that `CURSOR_OPT_HOLD` is ignored.

***

|                                             |                                                       |                                                               |
| :------------------------------------------ | :---------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](spi-spi-prepare.html "SPI_prepare")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-prepare-extended.html "SPI_prepare_extended") |
| SPI\_prepare                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                        SPI\_prepare\_extended |
