[#id](#SPI-SPI-GETARGCOUNT)

## SPI_getargcount

SPI_getargcount — return the number of arguments needed by a statement prepared by `SPI_prepare`

## Synopsis

```
int SPI_getargcount(SPIPlanPtr plan)
```

[#id](#id-1.8.12.8.12.5)

## Description

`SPI_getargcount` returns the number of arguments needed to execute a statement prepared by `SPI_prepare`.

[#id](#id-1.8.12.8.12.6)

## Arguments

- `SPIPlanPtr plan`

  prepared statement (returned by `SPI_prepare`)

[#id](#id-1.8.12.8.12.7)

## Return Value

The count of expected arguments for the _`plan`_. If the _`plan`_ is `NULL` or invalid, `SPI_result` is set to `SPI_ERROR_ARGUMENT` and -1 is returned.
