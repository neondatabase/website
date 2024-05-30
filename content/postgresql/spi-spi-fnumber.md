[#id](#SPI-SPI-FNUMBER)

## SPI_fnumber

SPI_fnumber — determine the column number for the specified column name

## Synopsis

```
int SPI_fnumber(TupleDesc rowdesc, const char * colname)
```

[#id](#id-1.8.12.9.5.5)

## Description

`SPI_fnumber` returns the column number for the column with the specified name.

If _`colname`_ refers to a system column (e.g., `ctid`) then the appropriate negative column number will be returned. The caller should be careful to test the return value for exact equality to `SPI_ERROR_NOATTRIBUTE` to detect an error; testing the result for less than or equal to 0 is not correct unless system columns should be rejected.

[#id](#id-1.8.12.9.5.6)

## Arguments

- `TupleDesc rowdesc`

  input row description

- `const char * colname`

  column name

[#id](#id-1.8.12.9.5.7)

## Return Value

Column number (count starts at 1 for user-defined columns), or `SPI_ERROR_NOATTRIBUTE` if the named column was not found.
