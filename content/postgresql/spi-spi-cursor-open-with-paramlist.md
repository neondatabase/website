[#id](#SPI-SPI-CURSOR-OPEN-WITH-PARAMLIST)

## SPI_cursor_open_with_paramlist

SPI_cursor_open_with_paramlist — set up a cursor using parameters

## Synopsis

```
Portal SPI_cursor_open_with_paramlist(const char *name,
                                      SPIPlanPtr plan,
                                      ParamListInfo params,
                                      bool read_only)
```

[#id](#id-1.8.12.8.21.5)

## Description

`SPI_cursor_open_with_paramlist` sets up a cursor (internally, a portal) that will execute a statement prepared by `SPI_prepare`. This function is equivalent to `SPI_cursor_open` except that information about the parameter values to be passed to the query is presented differently. The `ParamListInfo` representation can be convenient for passing down values that are already available in that format. It also supports use of dynamic parameter sets via hook functions specified in `ParamListInfo`.

The passed-in parameter data will be copied into the cursor's portal, so it can be freed while the cursor still exists.

[#id](#id-1.8.12.8.21.6)

## Arguments

- `const char * name`

  name for portal, or `NULL` to let the system select a name

- `SPIPlanPtr plan`

  prepared statement (returned by `SPI_prepare`)

- `ParamListInfo params`

  data structure containing parameter types and values; NULL if none

- `bool read_only`

  `true` for read-only execution

[#id](#id-1.8.12.8.21.7)

## Return Value

Pointer to portal containing the cursor. Note there is no error return convention; any error will be reported via `elog`.
