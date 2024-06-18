[#id](#SPI-SPI-UNREGISTER-RELATION)

## SPI_unregister_relation

SPI_unregister_relation — remove an ephemeral named relation from the registry

## Synopsis

```
int SPI_unregister_relation(const char * name)
```

[#id](#id-1.8.12.8.32.6)

## Description

`SPI_unregister_relation` removes an ephemeral named relation from the registry for the current connection.

[#id](#id-1.8.12.8.32.7)

## Arguments

- `const char * name`

  the relation registry entry name

[#id](#id-1.8.12.8.32.8)

## Return Value

If the execution of the command was successful then the following (nonnegative) value will be returned:

- `SPI_OK_REL_UNREGISTER`

  if the tuplestore has been successfully removed from the registry

On error, one of the following negative values is returned:

- `SPI_ERROR_ARGUMENT`

  if _`name`_ is `NULL`

- `SPI_ERROR_UNCONNECTED`

  if called from an unconnected C function

- `SPI_ERROR_REL_NOT_FOUND`

  if _`name`_ is not found in the registry for the current connection
