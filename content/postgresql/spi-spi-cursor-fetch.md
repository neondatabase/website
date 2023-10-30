## SPI\_cursor\_fetch

SPI\_cursor\_fetch — fetch some rows from a cursor

## Synopsis

```

void SPI_cursor_fetch(Portal portal, bool forward, long count)
```

## Description

`SPI_cursor_fetch` fetches some rows from a cursor. This is equivalent to a subset of the SQL command `FETCH` (see `SPI_scroll_cursor_fetch` for more functionality).

## Arguments

* `Portal portal`

    portal containing the cursor

* `bool forward`

    true for fetch forward, false for fetch backward

* `long count`

    maximum number of rows to fetch

## Return Value

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute` if successful.

## Notes

Fetching backward may fail if the cursor's plan was not created with the `CURSOR_OPT_SCROLL` option.