[#id](#SPI-SPI-FREETUPLE)

## SPI_freetuple

SPI_freetuple — free a row allocated in the upper executor context

## Synopsis

```
void SPI_freetuple(HeapTuple row)
```

[#id](#id-1.8.12.10.12.5)

## Description

`SPI_freetuple` frees a row previously allocated in the upper executor context.

This function is no longer different from plain `heap_freetuple`. It's kept just for backward compatibility of existing code.

[#id](#id-1.8.12.10.12.6)

## Arguments

- `HeapTuple row`

  row to free
