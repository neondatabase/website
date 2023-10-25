

|                   SPI\_cursor\_move                   |                                                      |                           |                                                       |                                                                     |
| :---------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](spi-spi-cursor-fetch.html "SPI_cursor_fetch")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-scroll-cursor-fetch.html "SPI_scroll_cursor_fetch") |

***

## SPI\_cursor\_move

SPI\_cursor\_move — move a cursor

## Synopsis

```

void SPI_cursor_move(Portal portal, bool forward, long count)
```

## Description

`SPI_cursor_move` skips over some number of rows in a cursor. This is equivalent to a subset of the SQL command `MOVE` (see `SPI_scroll_cursor_move` for more functionality).

## Arguments

* `Portal portal`

    portal containing the cursor

* `bool forward`

    true for move forward, false for move backward

* `long count`

    maximum number of rows to move

## Notes

Moving backward may fail if the cursor's plan was not created with the `CURSOR_OPT_SCROLL` option.

***

|                                                       |                                                       |                                                                     |
| :---------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](spi-spi-cursor-fetch.html "SPI_cursor_fetch")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-scroll-cursor-fetch.html "SPI_scroll_cursor_fetch") |
| SPI\_cursor\_fetch                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                          SPI\_scroll\_cursor\_fetch |
