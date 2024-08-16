[#id](#SPI-SPI-CURSOR-FIND)

## SPI_cursor_find

SPI_cursor_find — find an existing cursor by name

## Synopsis

```
Portal SPI_cursor_find(const char * name)
```

[#id](#id-1.8.12.8.23.5)

## Description

`SPI_cursor_find` finds an existing portal by name. This is primarily useful to resolve a cursor name returned as text by some other function.

[#id](#id-1.8.12.8.23.6)

## Arguments

- `const char * name`

  name of the portal

[#id](#id-1.8.12.8.23.7)

## Return Value

pointer to the portal with the specified name, or `NULL` if none was found
