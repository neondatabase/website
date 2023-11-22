## SPI\_result\_code\_string

SPI\_result\_code\_string — return error code as string

## Synopsis

```

const char * SPI_result_code_string(int code);
```

## Description

`SPI_result_code_string` returns a string representation of the result code returned by various SPI functions or stored in `SPI_result`.

## Arguments

* `int code`

    result code

## Return Value

A string representation of the result code.