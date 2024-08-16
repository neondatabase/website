[#id](#SPI-SPI-CURSOR-CLOSE)

## SPI_cursor_close

SPI_cursor_close — close a cursor

## Synopsis

```
void SPI_cursor_close(Portal portal)
```

[#id](#id-1.8.12.8.28.5)

## Description

`SPI_cursor_close` closes a previously created cursor and releases its portal storage.

All open cursors are closed automatically at the end of a transaction. `SPI_cursor_close` need only be invoked if it is desirable to release resources sooner.

[#id](#id-1.8.12.8.28.6)

## Arguments

- `Portal portal`

  portal containing the cursor
