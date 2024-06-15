[#id](#SPI-SPI-PREPARE-CURSOR)

## SPI_prepare_cursor

SPI_prepare_cursor — prepare a statement, without executing it yet

## Synopsis

```
SPIPlanPtr SPI_prepare_cursor(const char * command, int nargs,
                              Oid * argtypes, int cursorOptions)
```

[#id](#id-1.8.12.8.9.5)

## Description

`SPI_prepare_cursor` is identical to `SPI_prepare`, except that it also allows specification of the planner's “cursor options” parameter. This is a bit mask having the values shown in `nodes/parsenodes.h` for the `options` field of `DeclareCursorStmt`. `SPI_prepare` always takes the cursor options as zero.

This function is now deprecated in favor of `SPI_prepare_extended`.

[#id](#id-1.8.12.8.9.6)

## Arguments

- `const char * command`

  command string

- `int nargs`

  number of input parameters (`$1`, `$2`, etc.)

- `Oid * argtypes`

  pointer to an array containing the OIDs of the data types of the parameters

- `int cursorOptions`

  integer bit mask of cursor options; zero produces default behavior

[#id](#id-1.8.12.8.9.7)

## Return Value

`SPI_prepare_cursor` has the same return conventions as `SPI_prepare`.

[#id](#id-1.8.12.8.9.8)

## Notes

Useful bits to set in _`cursorOptions`_ include `CURSOR_OPT_SCROLL`, `CURSOR_OPT_NO_SCROLL`, `CURSOR_OPT_FAST_PLAN`, `CURSOR_OPT_GENERIC_PLAN`, and `CURSOR_OPT_CUSTOM_PLAN`. Note in particular that `CURSOR_OPT_HOLD` is ignored.
