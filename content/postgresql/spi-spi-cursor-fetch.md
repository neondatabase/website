[#id](#SPI-SPI-CURSOR-FETCH)

## SPI_cursor_fetch

SPI_cursor_fetch — fetch some rows from a cursor

## Synopsis

```
void SPI_cursor_fetch(Portal portal, bool forward, long count)
```

[#id](#id-1.8.12.8.24.5)

## Description

`SPI_cursor_fetch` fetches some rows from a cursor. This is equivalent to a subset of the SQL command `FETCH` (see `SPI_scroll_cursor_fetch` for more functionality).

[#id](#id-1.8.12.8.24.6)

## Arguments

- `Portal portal`

  portal containing the cursor

- `bool forward`

  true for fetch forward, false for fetch backward

- `long count`

  maximum number of rows to fetch

[#id](#id-1.8.12.8.24.7)

## Return Value

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute` if successful.

[#id](#id-1.8.12.8.24.8)

## Notes

Fetching backward may fail if the cursor's plan was not created with the `CURSOR_OPT_SCROLL` option.
