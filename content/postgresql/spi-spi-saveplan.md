[#id](#SPI-SPI-SAVEPLAN)

## SPI_saveplan

SPI_saveplan — save a prepared statement

## Synopsis

```
SPIPlanPtr SPI_saveplan(SPIPlanPtr plan)
```

[#id](#id-1.8.12.8.30.5)

## Description

`SPI_saveplan` copies a passed statement (prepared by `SPI_prepare`) into memory that will not be freed by `SPI_finish` nor by the transaction manager, and returns a pointer to the copied statement. This gives you the ability to reuse prepared statements in the subsequent invocations of your C function in the current session.

[#id](#id-1.8.12.8.30.6)

## Arguments

- `SPIPlanPtr plan`

  the prepared statement to be saved

[#id](#id-1.8.12.8.30.7)

## Return Value

Pointer to the copied statement; or `NULL` if unsuccessful. On error, `SPI_result` is set thus:

- `SPI_ERROR_ARGUMENT`

  if _`plan`_ is `NULL` or invalid

- `SPI_ERROR_UNCONNECTED`

  if called from an unconnected C function

[#id](#id-1.8.12.8.30.8)

## Notes

The originally passed-in statement is not freed, so you might wish to do `SPI_freeplan` on it to avoid leaking memory until `SPI_finish`.

In most cases, `SPI_keepplan` is preferred to this function, since it accomplishes largely the same result without needing to physically copy the prepared statement's data structures.
