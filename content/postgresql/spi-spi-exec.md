## SPI\_exec

SPI\_exec — execute a read/write command

## Synopsis

```

int SPI_exec(const char * command, long count)
```

## Description

`SPI_exec` is the same as `SPI_execute`, with the latter's *`read_only`* parameter always taken as `false`.

## Arguments

* `const char * command`

    string containing command to execute

* `long count`

    maximum number of rows to return, or `0` for no limit

## Return Value

See `SPI_execute`.