<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             SPI\_result\_code\_string             |                                                                      |                                   |                                                       |                                                    |
| :-----------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](spi-spi-getnspname.html "SPI_getnspname")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") | 47.2. Interface Support Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-memory.html "47.3. Memory Management") |

***

[]()

## SPI\_result\_code\_string

SPI\_result\_code\_string — return error code as string

## Synopsis

    const char * SPI_result_code_string(int code);

## Description

`SPI_result_code_string` returns a string representation of the result code returned by various SPI functions or stored in `SPI_result`.

## Arguments

*   `int code`

    result code

## Return Value

A string representation of the result code.

***

|                                                   |                                                                      |                                                    |
| :------------------------------------------------ | :------------------------------------------------------------------: | -------------------------------------------------: |
| [Prev](spi-spi-getnspname.html "SPI_getnspname")  | [Up](spi-interface-support.html "47.2. Interface Support Functions") |  [Next](spi-memory.html "47.3. Memory Management") |
| SPI\_getnspname                                   |         [Home](index.html "PostgreSQL 17devel Documentation")        |                            47.3. Memory Management |
