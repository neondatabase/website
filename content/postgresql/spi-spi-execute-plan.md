[#id](#SPI-SPI-EXECUTE-PLAN)

## SPI_execute_plan

SPI_execute_plan — execute a statement prepared by `SPI_prepare`

## Synopsis

```
int SPI_execute_plan(SPIPlanPtr plan, Datum * values, const char * nulls,
                     bool read_only, long count)
```

[#id](#id-1.8.12.8.15.5)

## Description

`SPI_execute_plan` executes a statement prepared by `SPI_prepare` or one of its siblings. _`read_only`_ and _`count`_ have the same interpretation as in `SPI_execute`.

[#id](#id-1.8.12.8.15.6)

## Arguments

- `SPIPlanPtr plan`

  prepared statement (returned by `SPI_prepare`)

- `Datum * values`

  An array of actual parameter values. Must have same length as the statement's number of arguments.

- `const char * nulls`

  An array describing which parameters are null. Must have same length as the statement's number of arguments.

  If _`nulls`_ is `NULL` then `SPI_execute_plan` assumes that no parameters are null. Otherwise, each entry of the _`nulls`_ array should be `' '` if the corresponding parameter value is non-null, or `'n'` if the corresponding parameter value is null. (In the latter case, the actual value in the corresponding _`values`_ entry doesn't matter.) Note that _`nulls`_ is not a text string, just an array: it does not need a `'\0'` terminator.

- `bool read_only`

  `true` for read-only execution

- `long count`

  maximum number of rows to return, or `0` for no limit

[#id](#id-1.8.12.8.15.7)

## Return Value

The return value is the same as for `SPI_execute`, with the following additional possible error (negative) results:

- `SPI_ERROR_ARGUMENT`

  if _`plan`_ is `NULL` or invalid, or _`count`_ is less than 0

- `SPI_ERROR_PARAM`

  if _`values`_ is `NULL` and _`plan`_ was prepared with some parameters

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute` if successful.
