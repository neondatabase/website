[#id](#SPI-SPI-EXECUTE-PLAN-WITH-PARAMLIST)

## SPI_execute_plan_with_paramlist

SPI_execute_plan_with_paramlist — execute a statement prepared by `SPI_prepare`

## Synopsis

```
int SPI_execute_plan_with_paramlist(SPIPlanPtr plan,
                                    ParamListInfo params,
                                    bool read_only,
                                    long count)
```

[#id](#id-1.8.12.8.17.5)

## Description

`SPI_execute_plan_with_paramlist` executes a statement prepared by `SPI_prepare`. This function is equivalent to `SPI_execute_plan` except that information about the parameter values to be passed to the query is presented differently. The `ParamListInfo` representation can be convenient for passing down values that are already available in that format. It also supports use of dynamic parameter sets via hook functions specified in `ParamListInfo`.

This function is now deprecated in favor of `SPI_execute_plan_extended`.

[#id](#id-1.8.12.8.17.6)

## Arguments

- `SPIPlanPtr plan`

  prepared statement (returned by `SPI_prepare`)

- `ParamListInfo params`

  data structure containing parameter types and values; NULL if none

- `bool read_only`

  `true` for read-only execution

- `long count`

  maximum number of rows to return, or `0` for no limit

[#id](#id-1.8.12.8.17.7)

## Return Value

The return value is the same as for `SPI_execute_plan`.

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute_plan` if successful.
