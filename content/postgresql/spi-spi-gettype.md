[#id](#SPI-SPI-GETTYPE)

## SPI_gettype

SPI_gettype — return the data type name of the specified column

## Synopsis

```
char * SPI_gettype(TupleDesc rowdesc, int colnumber)
```

[#id](#id-1.8.12.9.8.5)

## Description

`SPI_gettype` returns a copy of the data type name of the specified column. (You can use `pfree` to release the copy of the name when you don't need it anymore.)

[#id](#id-1.8.12.9.8.6)

## Arguments

- `TupleDesc rowdesc`

  input row description

- `int colnumber`

  column number (count starts at 1)

[#id](#id-1.8.12.9.8.7)

## Return Value

The data type name of the specified column, or `NULL` on error. `SPI_result` is set to `SPI_ERROR_NOATTRIBUTE` on error.
