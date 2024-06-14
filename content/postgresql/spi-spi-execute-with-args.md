[#id](#SPI-SPI-EXECUTE-WITH-ARGS)

## SPI_execute_with_args

SPI_execute_with_args — execute a command with out-of-line parameters

## Synopsis

```
int SPI_execute_with_args(const char *command,
                          int nargs, Oid *argtypes,
                          Datum *values, const char *nulls,
                          bool read_only, long count)
```

[#id](#id-1.8.12.8.7.5)

## Description

`SPI_execute_with_args` executes a command that might include references to externally supplied parameters. The command text refers to a parameter as `$n`, and the call specifies data types and values for each such symbol. _`read_only`_ and _`count`_ have the same interpretation as in `SPI_execute`.

The main advantage of this routine compared to `SPI_execute` is that data values can be inserted into the command without tedious quoting/escaping, and thus with much less risk of SQL-injection attacks.

Similar results can be achieved with `SPI_prepare` followed by `SPI_execute_plan`; however, when using this function the query plan is always customized to the specific parameter values provided. For one-time query execution, this function should be preferred. If the same command is to be executed with many different parameters, either method might be faster, depending on the cost of re-planning versus the benefit of custom plans.

[#id](#id-1.8.12.8.7.6)

## Arguments

- `const char * command`

  command string

- `int nargs`

  number of input parameters (`$1`, `$2`, etc.)

- `Oid * argtypes`

  an array of length _`nargs`_, containing the OIDs of the data types of the parameters

- `Datum * values`

  an array of length _`nargs`_, containing the actual parameter values

- `const char * nulls`

  an array of length _`nargs`_, describing which parameters are null

  If _`nulls`_ is `NULL` then `SPI_execute_with_args` assumes that no parameters are null. Otherwise, each entry of the _`nulls`_ array should be `' '` if the corresponding parameter value is non-null, or `'n'` if the corresponding parameter value is null. (In the latter case, the actual value in the corresponding _`values`_ entry doesn't matter.) Note that _`nulls`_ is not a text string, just an array: it does not need a `'\0'` terminator.

- `bool read_only`

  `true` for read-only execution

- `long count`

  maximum number of rows to return, or `0` for no limit

[#id](#id-1.8.12.8.7.7)

## Return Value

The return value is the same as for `SPI_execute`.

`SPI_processed` and `SPI_tuptable` are set as in `SPI_execute` if successful.
