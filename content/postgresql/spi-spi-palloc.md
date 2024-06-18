[#id](#SPI-SPI-PALLOC)

## SPI_palloc

SPI_palloc — allocate memory in the upper executor context

## Synopsis

```
void * SPI_palloc(Size size)
```

[#id](#id-1.8.12.10.6.5)

## Description

`SPI_palloc` allocates memory in the upper executor context.

This function can only be used while connected to SPI. Otherwise, it throws an error.

[#id](#id-1.8.12.10.6.6)

## Arguments

- `Size size`

  size in bytes of storage to allocate

[#id](#id-1.8.12.10.6.7)

## Return Value

pointer to new storage space of the specified size
