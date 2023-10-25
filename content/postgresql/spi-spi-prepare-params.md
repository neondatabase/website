<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      SPI\_prepare\_params                     |                                                      |                           |                                                       |                                                     |
| :-----------------------------------------------------------: | :--------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](spi-spi-prepare-extended.html "SPI_prepare_extended")  | [Up](spi-interface.html "47.1. Interface Functions") | 47.1. Interface Functions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-getargcount.html "SPI_getargcount") |

***

[]()

## SPI\_prepare\_params

SPI\_prepare\_params — prepare a statement, without executing it yet

## Synopsis

```

SPIPlanPtr SPI_prepare_params(const char * command,
                              ParserSetupHook parserSetup,
                              void * parserSetupArg,
                              int cursorOptions)
```

## Description

`SPI_prepare_params` creates and returns a prepared statement for the specified command, but doesn't execute the command. This function is equivalent to `SPI_prepare_cursor`, with the addition that the caller can specify parser hook functions to control the parsing of external parameter references.

This function is now deprecated in favor of `SPI_prepare_extended`.

## Arguments

*   `const char * command`

    command string

*   `ParserSetupHook parserSetup`

    Parser hook setup function

*   `void * parserSetupArg`

    pass-through argument for *`parserSetup`*

*   `int cursorOptions`

    integer bit mask of cursor options; zero produces default behavior

## Return Value

`SPI_prepare_params` has the same return conventions as `SPI_prepare`.

***

|                                                               |                                                       |                                                     |
| :------------------------------------------------------------ | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](spi-spi-prepare-extended.html "SPI_prepare_extended")  |  [Up](spi-interface.html "47.1. Interface Functions") |  [Next](spi-spi-getargcount.html "SPI_getargcount") |
| SPI\_prepare\_extended                                        | [Home](index.html "PostgreSQL 17devel Documentation") |                                    SPI\_getargcount |
