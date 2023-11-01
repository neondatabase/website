## SPI\_fname

SPI\_fname — determine the column name for the specified column number

## Synopsis

```

char * SPI_fname(TupleDesc rowdesc, int colnumber)
```

## Description

`SPI_fname` returns a copy of the column name of the specified column. (You can use `pfree` to release the copy of the name when you don't need it anymore.)

## Arguments

* `TupleDesc rowdesc`

    input row description

* `int colnumber`

    column number (count starts at 1)

## Return Value

The column name; `NULL` if *`colnumber`* is out of range. `SPI_result` set to `SPI_ERROR_NOATTRIBUTE` on error.