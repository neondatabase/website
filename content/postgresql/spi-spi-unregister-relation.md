## SPI\_unregister\_relation

SPI\_unregister\_relation — remove an ephemeral named relation from the registry

## Synopsis

```

int SPI_unregister_relation(const char * name)
```

## Description

`SPI_unregister_relation` removes an ephemeral named relation from the registry for the current connection.

## Arguments

* `const char * name`

    the relation registry entry name

## Return Value

If the execution of the command was successful then the following (nonnegative) value will be returned:

* `SPI_OK_REL_UNREGISTER`

    if the tuplestore has been successfully removed from the registry

On error, one of the following negative values is returned:

* `SPI_ERROR_ARGUMENT`

    if *`name`* is `NULL`

* `SPI_ERROR_UNCONNECTED`

    if called from an unconnected C function

* `SPI_ERROR_REL_NOT_FOUND`

    if *`name`* is not found in the registry for the current connection