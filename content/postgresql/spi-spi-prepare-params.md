[#id](#SPI-SPI-PREPARE-PARAMS)

## SPI_prepare_params

SPI_prepare_params — prepare a statement, without executing it yet

## Synopsis

```
SPIPlanPtr SPI_prepare_params(const char * command,
                              ParserSetupHook parserSetup,
                              void * parserSetupArg,
                              int cursorOptions)
```

[#id](#id-1.8.12.8.11.5)

## Description

`SPI_prepare_params` creates and returns a prepared statement for the specified command, but doesn't execute the command. This function is equivalent to `SPI_prepare_cursor`, with the addition that the caller can specify parser hook functions to control the parsing of external parameter references.

This function is now deprecated in favor of `SPI_prepare_extended`.

[#id](#id-1.8.12.8.11.6)

## Arguments

- `const char * command`

  command string

- `ParserSetupHook parserSetup`

  Parser hook setup function

- `void * parserSetupArg`

  pass-through argument for _`parserSetup`_

- `int cursorOptions`

  integer bit mask of cursor options; zero produces default behavior

[#id](#id-1.8.12.8.11.7)

## Return Value

`SPI_prepare_params` has the same return conventions as `SPI_prepare`.
