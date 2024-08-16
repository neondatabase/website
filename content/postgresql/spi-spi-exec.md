[#id](#SPI-SPI-EXEC)

## SPI_exec

SPI_exec — execute a read/write command

## Synopsis

```
int SPI_exec(const char * command, long count)
```

[#id](#id-1.8.12.8.5.5)

## Description

`SPI_exec` is the same as `SPI_execute`, with the latter's _`read_only`_ parameter always taken as `false`.

[#id](#id-1.8.12.8.5.6)

## Arguments

- `const char * command`

  string containing command to execute

- `long count`

  maximum number of rows to return, or `0` for no limit

[#id](#id-1.8.12.8.5.7)

## Return Value

See `SPI_execute`.
