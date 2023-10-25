<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  SPI\_exec                  |                                                      |                           |                                                       |                                                               |
| :-----------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](spi-spi-execute.html "SPI_execute")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-execute-extended.html "SPI_execute_extended") |

***

[]()

## SPI\_exec

SPI\_exec — execute a read/write command

## Synopsis

```

int SPI_exec(const char * command, long count)
```

## Description

`SPI_exec` is the same as `SPI_execute`, with the latter's *`read_only`* parameter always taken as `false`.

## Arguments

*   `const char * command`

    string containing command to execute

*   `long count`

    maximum number of rows to return, or `0` for no limit

## Return Value

See `SPI_execute`.

***

|                                             |                                                       |                                                               |
| :------------------------------------------ | :---------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](spi-spi-execute.html "SPI_execute")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-execute-extended.html "SPI_execute_extended") |
| SPI\_execute                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                        SPI\_execute\_extended |
