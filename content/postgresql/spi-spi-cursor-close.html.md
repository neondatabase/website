<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         SPI\_cursor\_close                        |                                                      |                           |                                                       |                                               |
| :---------------------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](spi-spi-scroll-cursor-move.html "SPI_scroll_cursor_move")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-keepplan.html "SPI_keepplan") |

***

## SPI\_cursor\_close

SPI\_cursor\_close — close a cursor

## Synopsis

    void SPI_cursor_close(Portal portal)

## Description

`SPI_cursor_close` closes a previously created cursor and releases its portal storage.

All open cursors are closed automatically at the end of a transaction. `SPI_cursor_close` need only be invoked if it is desirable to release resources sooner.

## Arguments

* `Portal portal`

    portal containing the cursor

***

|                                                                   |                                                       |                                               |
| :---------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------: |
| [Prev](spi-spi-scroll-cursor-move.html "SPI_scroll_cursor_move")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-keepplan.html "SPI_keepplan") |
| SPI\_scroll\_cursor\_move                                         | [Home](index.html "PostgreSQL 17devel Documentation") |                                 SPI\_keepplan |
