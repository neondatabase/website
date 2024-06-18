[#id](#SPI-SPI-FNAME)

## SPI_fname

SPI_fname — determine the column name for the specified column number

## Synopsis

```
char * SPI_fname(TupleDesc rowdesc, int colnumber)
```

[#id](#id-1.8.12.9.4.5)

## Description

`SPI_fname` returns a copy of the column name of the specified column. (You can use `pfree` to release the copy of the name when you don't need it anymore.)

[#id](#id-1.8.12.9.4.6)

## Arguments

- `TupleDesc rowdesc`

  input row description

- `int colnumber`

  column number (count starts at 1)

[#id](#id-1.8.12.9.4.7)

## Return Value

The column name; `NULL` if _`colnumber`_ is out of range. `SPI_result` set to `SPI_ERROR_NOATTRIBUTE` on error.
