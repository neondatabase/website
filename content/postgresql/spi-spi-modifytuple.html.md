<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   SPI\_modifytuple                  |                                                 |                         |                                                       |                                                 |
| :-------------------------------------------------: | :---------------------------------------------- | :---------------------: | ----------------------------------------------------: | ----------------------------------------------: |
| [Prev](spi-spi-returntuple.html "SPI_returntuple")  | [Up](spi-memory.html "47.3. Memory Management") | 47.3. Memory Management | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-freetuple.html "SPI_freetuple") |

***

## SPI\_modifytuple

SPI\_modifytuple — create a row by replacing selected fields of a given row

## Synopsis

    HeapTuple SPI_modifytuple(Relation rel, HeapTuple row, int ncols,
                              int * colnum, Datum * values, const char * nulls)

## Description

`SPI_modifytuple` creates a new row by substituting new values for selected columns, copying the original row's columns at other positions. The input row is not modified. The new row is returned in the upper executor context.

This function can only be used while connected to SPI. Otherwise, it returns NULL and sets `SPI_result` to `SPI_ERROR_UNCONNECTED`.

## Arguments

* `Relation rel`

    Used only as the source of the row descriptor for the row. (Passing a relation rather than a row descriptor is a misfeature.)

* `HeapTuple row`

    row to be modified

* `int ncols`

    number of columns to be changed

* `int * colnum`

    an array of length *`ncols`*, containing the numbers of the columns that are to be changed (column numbers start at 1)

* `Datum * values`

    an array of length *`ncols`*, containing the new values for the specified columns

* `const char * nulls`

    an array of length *`ncols`*, describing which new values are null

    If *`nulls`* is `NULL` then `SPI_modifytuple` assumes that no new values are null. Otherwise, each entry of the *`nulls`* array should be `' '` if the corresponding new value is non-null, or `'n'` if the corresponding new value is null. (In the latter case, the actual value in the corresponding *`values`* entry doesn't matter.) Note that *`nulls`* is not a text string, just an array: it does not need a `'\0'` terminator.

## Return Value

new row with modifications, allocated in the upper executor context, or `NULL` on error (see `SPI_result` for an error indication)

On error, `SPI_result` is set as follows:

* `SPI_ERROR_ARGUMENT`

    if *`rel`* is `NULL`, or if *`row`* is `NULL`, or if *`ncols`* is less than or equal to 0, or if *`colnum`* is `NULL`, or if *`values`* is `NULL`.

* `SPI_ERROR_NOATTRIBUTE`

    if *`colnum`* contains an invalid column number (less than or equal to 0 or greater than the number of columns in *`row`*)

* `SPI_ERROR_UNCONNECTED`

    if SPI is not active

***

|                                                     |                                                       |                                                 |
| :-------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------: |
| [Prev](spi-spi-returntuple.html "SPI_returntuple")  |    [Up](spi-memory.html "47.3. Memory Management")    |  [Next](spi-spi-freetuple.html "SPI_freetuple") |
| SPI\_returntuple                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                  SPI\_freetuple |
