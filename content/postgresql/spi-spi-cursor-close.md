## SPI\_cursor\_close

SPI\_cursor\_close — close a cursor

## Synopsis

```

void SPI_cursor_close(Portal portal)
```

## Description

`SPI_cursor_close` closes a previously created cursor and releases its portal storage.

All open cursors are closed automatically at the end of a transaction. `SPI_cursor_close` need only be invoked if it is desirable to release resources sooner.

## Arguments

* `Portal portal`

    portal containing the cursor