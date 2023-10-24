<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      SPI\_scroll\_cursor\_move                      |                                                      |                           |                                                       |                                                       |
| :-----------------------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](spi-spi-scroll-cursor-fetch.html "SPI_scroll_cursor_fetch")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-cursor-close.html "SPI_cursor_close") |

***

[]()

## SPI\_scroll\_cursor\_move

SPI\_scroll\_cursor\_move — move a cursor

## Synopsis

    void SPI_scroll_cursor_move(Portal portal, FetchDirection direction,
                                long count)

## Description

`SPI_scroll_cursor_move` skips over some number of rows in a cursor. This is equivalent to the SQL command `MOVE`.

## Arguments

*   `Portal portal`

    portal containing the cursor

*   `FetchDirection direction`

    one of `FETCH_FORWARD`, `FETCH_BACKWARD`, `FETCH_ABSOLUTE` or `FETCH_RELATIVE`

*   `long count`

    number of rows to move for `FETCH_FORWARD` or `FETCH_BACKWARD`; absolute row number to move to for `FETCH_ABSOLUTE`; or relative row number to move to for `FETCH_RELATIVE`

## Return Value

`SPI_processed` is set as in `SPI_execute` if successful. `SPI_tuptable` is set to `NULL`, since no rows are returned by this function.

## Notes

See the SQL [FETCH](sql-fetch.html "FETCH") command for details of the interpretation of the *`direction`* and *`count`* parameters.

Direction values other than `FETCH_FORWARD` may fail if the cursor's plan was not created with the `CURSOR_OPT_SCROLL` option.

***

|                                                                     |                                                       |                                                       |
| :------------------------------------------------------------------ | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](spi-spi-scroll-cursor-fetch.html "SPI_scroll_cursor_fetch")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-cursor-close.html "SPI_cursor_close") |
| SPI\_scroll\_cursor\_fetch                                          | [Home](index.html "PostgreSQL 17devel Documentation") |                                    SPI\_cursor\_close |
