[#id](#SPI-SPI-CONNECT)

## SPI_connect

SPI_connect, SPI_connect_ext — connect a C function to the SPI manager

## Synopsis

```
int SPI_connect(void)
```

```
int SPI_connect_ext(int options)
```

[#id](#id-1.8.12.8.2.6)

## Description

`SPI_connect` opens a connection from a C function invocation to the SPI manager. You must call this function if you want to execute commands through SPI. Some utility SPI functions can be called from unconnected C functions.

`SPI_connect_ext` does the same but has an argument that allows passing option flags. Currently, the following option values are available:

- `SPI_OPT_NONATOMIC`

  Sets the SPI connection to be _nonatomic_, which means that transaction control calls (`SPI_commit`, `SPI_rollback`) are allowed. Otherwise, calling those functions will result in an immediate error.

`SPI_connect()` is equivalent to `SPI_connect_ext(0)`.

[#id](#id-1.8.12.8.2.7)

## Return Value

- `SPI_OK_CONNECT`

  on success

- `SPI_ERROR_CONNECT`

  on error
