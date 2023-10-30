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