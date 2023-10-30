## SPI\_keepplan

SPI\_keepplan — save a prepared statement

## Synopsis

```

int SPI_keepplan(SPIPlanPtr plan)
```

## Description

`SPI_keepplan` saves a passed statement (prepared by `SPI_prepare`) so that it will not be freed by `SPI_finish` nor by the transaction manager. This gives you the ability to reuse prepared statements in the subsequent invocations of your C function in the current session.

## Arguments

* `SPIPlanPtr plan`

    the prepared statement to be saved

## Return Value

0 on success; `SPI_ERROR_ARGUMENT` if *`plan`* is `NULL` or invalid

## Notes

The passed-in statement is relocated to permanent storage by means of pointer adjustment (no data copying is required). If you later wish to delete it, use `SPI_freeplan` on it.