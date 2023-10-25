<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    47.2. Interface Support Functions                    |                                                           |                                          |                                                       |                                         |
| :---------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | --------------------------------------: |
| [Prev](spi-spi-register-trigger-data.html "SPI_register_trigger_data")  | [Up](spi.html "Chapter 47. Server Programming Interface") | Chapter 47. Server Programming Interface | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-fname.html "SPI_fname") |

***

## 47.2. Interface Support Functions [#](#SPI-INTERFACE-SUPPORT)

  * *   [SPI\_fname](spi-spi-fname.html) — determine the column name for the specified column number
  * [SPI\_fnumber](spi-spi-fnumber.html) — determine the column number for the specified column name
  * [SPI\_getvalue](spi-spi-getvalue.html) — return the string value of the specified column
  * [SPI\_getbinval](spi-spi-getbinval.html) — return the binary value of the specified column
  * [SPI\_gettype](spi-spi-gettype.html) — return the data type name of the specified column
  * [SPI\_gettypeid](spi-spi-gettypeid.html) — return the data type OID of the specified column
  * [SPI\_getrelname](spi-spi-getrelname.html) — return the name of the specified relation
  * [SPI\_getnspname](spi-spi-getnspname.html) — return the namespace of the specified relation
  * [SPI\_result\_code\_string](spi-spi-result-code-string.html) — return error code as string

The functions described here provide an interface for extracting information from result sets returned by `SPI_execute` and other SPI functions.

All functions described in this section can be used by both connected and unconnected C functions.

***

|                                                                         |                                                           |                                         |
| :---------------------------------------------------------------------- | :-------------------------------------------------------: | --------------------------------------: |
| [Prev](spi-spi-register-trigger-data.html "SPI_register_trigger_data")  | [Up](spi.html "Chapter 47. Server Programming Interface") |  [Next](spi-spi-fname.html "SPI_fname") |
| SPI\_register\_trigger\_data                                            |   [Home](index.html "PostgreSQL 17devel Documentation")   |                              SPI\_fname |
