[#id](#SPI-SPI-PFREE)

## SPI_pfree

SPI_pfree — free memory in the upper executor context

## Synopsis

```
void SPI_pfree(void * pointer)
```

[#id](#id-1.8.12.10.8.5)

## Description

`SPI_pfree` frees memory previously allocated using `SPI_palloc` or `SPI_repalloc`.

This function is no longer different from plain `pfree`. It's kept just for backward compatibility of existing code.

[#id](#id-1.8.12.10.8.6)

## Arguments

- `void * pointer`

  pointer to existing storage to free
