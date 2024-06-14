[#id](#SPI-SPI-FREEPLAN)

## SPI_freeplan

SPI_freeplan — free a previously saved prepared statement

## Synopsis

```
int SPI_freeplan(SPIPlanPtr plan)
```

[#id](#id-1.8.12.10.14.5)

## Description

`SPI_freeplan` releases a prepared statement previously returned by `SPI_prepare` or saved by `SPI_keepplan` or `SPI_saveplan`.

[#id](#id-1.8.12.10.14.6)

## Arguments

- `SPIPlanPtr plan`

  pointer to statement to free

[#id](#id-1.8.12.10.14.7)

## Return Value

0 on success; `SPI_ERROR_ARGUMENT` if _`plan`_ is `NULL` or invalid
