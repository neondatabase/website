[#id](#SPI-SPI-GETTYPEID)

## SPI_gettypeid

SPI_gettypeid — return the data type OID of the specified column

## Synopsis

```
Oid SPI_gettypeid(TupleDesc rowdesc, int colnumber)
```

[#id](#id-1.8.12.9.9.5)

## Description

`SPI_gettypeid` returns the OID of the data type of the specified column.

[#id](#id-1.8.12.9.9.6)

## Arguments

- `TupleDesc rowdesc`

  input row description

- `int colnumber`

  column number (count starts at 1)

[#id](#id-1.8.12.9.9.7)

## Return Value

The OID of the data type of the specified column or `InvalidOid` on error. On error, `SPI_result` is set to `SPI_ERROR_NOATTRIBUTE`.
