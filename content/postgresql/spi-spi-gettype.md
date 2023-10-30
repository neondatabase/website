## SPI\_gettype

SPI\_gettype — return the data type name of the specified column

## Synopsis

```

char * SPI_gettype(TupleDesc rowdesc, int colnumber)
```

## Description

`SPI_gettype` returns a copy of the data type name of the specified column. (You can use `pfree` to release the copy of the name when you don't need it anymore.)

## Arguments

* `TupleDesc rowdesc`

    input row description

* `int colnumber`

    column number (count starts at 1)

## Return Value

The data type name of the specified column, or `NULL` on error. `SPI_result` is set to `SPI_ERROR_NOATTRIBUTE` on error.