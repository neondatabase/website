## SPI\_pfree

SPI\_pfree — free memory in the upper executor context

## Synopsis

```

void SPI_pfree(void * pointer)
```

## Description

`SPI_pfree` frees memory previously allocated using `SPI_palloc` or `SPI_repalloc`.

This function is no longer different from plain `pfree`. It's kept just for backward compatibility of existing code.

## Arguments

* `void * pointer`

    pointer to existing storage to free