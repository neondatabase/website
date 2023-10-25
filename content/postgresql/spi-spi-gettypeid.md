<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                SPI\_gettypeid               |                                                                      |                                   |                                                       |                                                   |
| :-----------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](spi-spi-gettype.html "SPI_gettype")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") | 47.2. Interface Support Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-getrelname.html "SPI_getrelname") |

***

[]()

## SPI\_gettypeid

SPI\_gettypeid — return the data type OID of the specified column

## Synopsis

```

Oid SPI_gettypeid(TupleDesc rowdesc, int colnumber)
```

## Description

`SPI_gettypeid` returns the OID of the data type of the specified column.

## Arguments

*   `TupleDesc rowdesc`

    input row description

*   `int colnumber`

    column number (count starts at 1)

## Return Value

The OID of the data type of the specified column or `InvalidOid` on error. On error, `SPI_result` is set to `SPI_ERROR_NOATTRIBUTE`.

***

|                                             |                                                                      |                                                   |
| :------------------------------------------ | :------------------------------------------------------------------: | ------------------------------------------------: |
| [Prev](spi-spi-gettype.html "SPI_gettype")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") |  [Next](spi-spi-getrelname.html "SPI_getrelname") |
| SPI\_gettype                                |         [Home](index.html "PostgreSQL 17devel Documentation")        |                                   SPI\_getrelname |
