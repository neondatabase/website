## SPI\_repalloc

SPI\_repalloc — reallocate memory in the upper executor context

## Synopsis

```

void * SPI_repalloc(void * pointer, Size size)
```

## Description

`SPI_repalloc` changes the size of a memory segment previously allocated using `SPI_palloc`.

This function is no longer different from plain `repalloc`. It's kept just for backward compatibility of existing code.

## Arguments

* `void * pointer`

    pointer to existing storage to change

* `Size size`

    size in bytes of storage to allocate

## Return Value

pointer to new storage space of specified size with the contents copied from the existing area