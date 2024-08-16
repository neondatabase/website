[#id](#SPI-SPI-KEEPPLAN)

## SPI_keepplan

SPI_keepplan — save a prepared statement

## Synopsis

```
int SPI_keepplan(SPIPlanPtr plan)
```

[#id](#id-1.8.12.8.29.5)

## Description

`SPI_keepplan` saves a passed statement (prepared by `SPI_prepare`) so that it will not be freed by `SPI_finish` nor by the transaction manager. This gives you the ability to reuse prepared statements in the subsequent invocations of your C function in the current session.

[#id](#id-1.8.12.8.29.6)

## Arguments

- `SPIPlanPtr plan`

  the prepared statement to be saved

[#id](#id-1.8.12.8.29.7)

## Return Value

0 on success; `SPI_ERROR_ARGUMENT` if _`plan`_ is `NULL` or invalid

[#id](#id-1.8.12.8.29.8)

## Notes

The passed-in statement is relocated to permanent storage by means of pointer adjustment (no data copying is required). If you later wish to delete it, use `SPI_freeplan` on it.
