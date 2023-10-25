

|                   SPI\_gettype                  |                                                                      |                                   |                                                       |                                                 |
| :---------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ----------------------------------------------: |
| [Prev](spi-spi-getbinval.html "SPI_getbinval")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") | 47.2. Interface Support Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-gettypeid.html "SPI_gettypeid") |

***

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

***

|                                                 |                                                                      |                                                 |
| :---------------------------------------------- | :------------------------------------------------------------------: | ----------------------------------------------: |
| [Prev](spi-spi-getbinval.html "SPI_getbinval")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") |  [Next](spi-spi-gettypeid.html "SPI_gettypeid") |
| SPI\_getbinval                                  |         [Home](index.html "PostgreSQL 17devel Documentation")        |                                  SPI\_gettypeid |
