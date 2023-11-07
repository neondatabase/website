## SPI\_cursor\_find

SPI\_cursor\_find — find an existing cursor by name

## Synopsis

```

Portal SPI_cursor_find(const char * name)
```

## Description

`SPI_cursor_find` finds an existing portal by name. This is primarily useful to resolve a cursor name returned as text by some other function.

## Arguments

* `const char * name`

    name of the portal

## Return Value

pointer to the portal with the specified name, or `NULL` if none was found

## Notes

Beware that this function can return a `Portal` object that does not have cursor-like properties; for example it might not return tuples. If you simply pass the `Portal` pointer to other SPI functions, they can defend themselves against such cases, but caution is appropriate when directly inspecting the `Portal`.