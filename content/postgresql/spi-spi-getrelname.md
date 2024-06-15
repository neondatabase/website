[#id](#SPI-SPI-GETRELNAME)

## SPI_getrelname

SPI_getrelname — return the name of the specified relation

## Synopsis

```
char * SPI_getrelname(Relation rel)
```

[#id](#id-1.8.12.9.10.5)

## Description

`SPI_getrelname` returns a copy of the name of the specified relation. (You can use `pfree` to release the copy of the name when you don't need it anymore.)

[#id](#id-1.8.12.9.10.6)

## Arguments

- `Relation rel`

  input relation

[#id](#id-1.8.12.9.10.7)

## Return Value

The name of the specified relation.
