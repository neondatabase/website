[#id](#SPI-SPI-FINISH)

## SPI_finish

SPI_finish — disconnect a C function from the SPI manager

## Synopsis

```
int SPI_finish(void)
```

[#id](#id-1.8.12.8.3.5)

## Description

`SPI_finish` closes an existing connection to the SPI manager. You must call this function after completing the SPI operations needed during your C function's current invocation. You do not need to worry about making this happen, however, if you abort the transaction via `elog(ERROR)`. In that case SPI will clean itself up automatically.

[#id](#id-1.8.12.8.3.6)

## Return Value

- `SPI_OK_FINISH`

  if properly disconnected

- `SPI_ERROR_UNCONNECTED`

  if called from an unconnected C function
