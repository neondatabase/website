[#id](#SPI-SPI-MODIFYTUPLE)

## SPI_modifytuple

SPI_modifytuple — create a row by replacing selected fields of a given row

## Synopsis

```
HeapTuple SPI_modifytuple(Relation rel, HeapTuple row, int ncols,
                          int * colnum, Datum * values, const char * nulls)
```

[#id](#id-1.8.12.10.11.5)

## Description

`SPI_modifytuple` creates a new row by substituting new values for selected columns, copying the original row's columns at other positions. The input row is not modified. The new row is returned in the upper executor context.

This function can only be used while connected to SPI. Otherwise, it returns NULL and sets `SPI_result` to `SPI_ERROR_UNCONNECTED`.

[#id](#id-1.8.12.10.11.6)

## Arguments

- `Relation rel`

  Used only as the source of the row descriptor for the row. (Passing a relation rather than a row descriptor is a misfeature.)

- `HeapTuple row`

  row to be modified

- `int ncols`

  number of columns to be changed

- `int * colnum`

  an array of length _`ncols`_, containing the numbers of the columns that are to be changed (column numbers start at 1)

- `Datum * values`

  an array of length _`ncols`_, containing the new values for the specified columns

- `const char * nulls`

  an array of length _`ncols`_, describing which new values are null

  If _`nulls`_ is `NULL` then `SPI_modifytuple` assumes that no new values are null. Otherwise, each entry of the _`nulls`_ array should be `' '` if the corresponding new value is non-null, or `'n'` if the corresponding new value is null. (In the latter case, the actual value in the corresponding _`values`_ entry doesn't matter.) Note that _`nulls`_ is not a text string, just an array: it does not need a `'\0'` terminator.

[#id](#id-1.8.12.10.11.7)

## Return Value

new row with modifications, allocated in the upper executor context, or `NULL` on error (see `SPI_result` for an error indication)

On error, `SPI_result` is set as follows:

- `SPI_ERROR_ARGUMENT`

  if _`rel`_ is `NULL`, or if _`row`_ is `NULL`, or if _`ncols`_ is less than or equal to 0, or if _`colnum`_ is `NULL`, or if _`values`_ is `NULL`.

- `SPI_ERROR_NOATTRIBUTE`

  if _`colnum`_ contains an invalid column number (less than or equal to 0 or greater than the number of columns in _`row`_)

- `SPI_ERROR_UNCONNECTED`

  if SPI is not active
