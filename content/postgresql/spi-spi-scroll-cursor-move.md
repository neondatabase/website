## SPI\_scroll\_cursor\_move

SPI\_scroll\_cursor\_move — move a cursor

## Synopsis

```

void SPI_scroll_cursor_move(Portal portal, FetchDirection direction,
                            long count)
```

## Description

`SPI_scroll_cursor_move` skips over some number of rows in a cursor. This is equivalent to the SQL command `MOVE`.

## Arguments

* `Portal portal`

    portal containing the cursor

* `FetchDirection direction`

    one of `FETCH_FORWARD`, `FETCH_BACKWARD`, `FETCH_ABSOLUTE` or `FETCH_RELATIVE`

* `long count`

    number of rows to move for `FETCH_FORWARD` or `FETCH_BACKWARD`; absolute row number to move to for `FETCH_ABSOLUTE`; or relative row number to move to for `FETCH_RELATIVE`

## Return Value

`SPI_processed` is set as in `SPI_execute` if successful. `SPI_tuptable` is set to `NULL`, since no rows are returned by this function.

## Notes

See the SQL [FETCH](sql-fetch.html "FETCH") command for details of the interpretation of the *`direction`* and *`count`* parameters.

Direction values other than `FETCH_FORWARD` may fail if the cursor's plan was not created with the `CURSOR_OPT_SCROLL` option.