[#id](#SPI-SPI-GETNSPNAME)

## SPI_getnspname

SPI_getnspname — return the namespace of the specified relation

## Synopsis

```
char * SPI_getnspname(Relation rel)
```

[#id](#id-1.8.12.9.11.5)

## Description

`SPI_getnspname` returns a copy of the name of the namespace that the specified `Relation` belongs to. This is equivalent to the relation's schema. You should `pfree` the return value of this function when you are finished with it.

[#id](#id-1.8.12.9.11.6)

## Arguments

- `Relation rel`

  input relation

[#id](#id-1.8.12.9.11.7)

## Return Value

The name of the specified relation's namespace.
