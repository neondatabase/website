<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   47.1. Interface Functions                  |                                                           |                                          |                                                       |                                             |
| :----------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | ------------------------------------------: |
| [Prev](spi.html "Chapter 47. Server Programming Interface")  | [Up](spi.html "Chapter 47. Server Programming Interface") | Chapter 47. Server Programming Interface | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-connect.html "SPI_connect") |

***

## 47.1. Interface Functions [#](#SPI-INTERFACE)

*   *   [SPI\_connect](spi-spi-connect.html) — connect a C function to the SPI manager
    *   [SPI\_finish](spi-spi-finish.html) — disconnect a C function from the SPI manager
    *   [SPI\_execute](spi-spi-execute.html) — execute a command
    *   [SPI\_exec](spi-spi-exec.html) — execute a read/write command
    *   [SPI\_execute\_extended](spi-spi-execute-extended.html) — execute a command with out-of-line parameters
    *   [SPI\_execute\_with\_args](spi-spi-execute-with-args.html) — execute a command with out-of-line parameters
    *   [SPI\_prepare](spi-spi-prepare.html) — prepare a statement, without executing it yet
    *   [SPI\_prepare\_cursor](spi-spi-prepare-cursor.html) — prepare a statement, without executing it yet
    *   [SPI\_prepare\_extended](spi-spi-prepare-extended.html) — prepare a statement, without executing it yet
    *   [SPI\_prepare\_params](spi-spi-prepare-params.html) — prepare a statement, without executing it yet
    *   [SPI\_getargcount](spi-spi-getargcount.html) — return the number of arguments needed by a statement prepared by `SPI_prepare`
    *   [SPI\_getargtypeid](spi-spi-getargtypeid.html) — return the data type OID for an argument of a statement prepared by `SPI_prepare`
    *   [SPI\_is\_cursor\_plan](spi-spi-is-cursor-plan.html) — return `true` if a statement prepared by `SPI_prepare` can be used with `SPI_cursor_open`
    *   [SPI\_execute\_plan](spi-spi-execute-plan.html) — execute a statement prepared by `SPI_prepare`
    *   [SPI\_execute\_plan\_extended](spi-spi-execute-plan-extended.html) — execute a statement prepared by `SPI_prepare`
    *   [SPI\_execute\_plan\_with\_paramlist](spi-spi-execute-plan-with-paramlist.html) — execute a statement prepared by `SPI_prepare`
    *   [SPI\_execp](spi-spi-execp.html) — execute a statement in read/write mode
    *   [SPI\_cursor\_open](spi-spi-cursor-open.html) — set up a cursor using a statement created with `SPI_prepare`
    *   [SPI\_cursor\_open\_with\_args](spi-spi-cursor-open-with-args.html) — set up a cursor using a query and parameters
    *   [SPI\_cursor\_open\_with\_paramlist](spi-spi-cursor-open-with-paramlist.html) — set up a cursor using parameters
    *   [SPI\_cursor\_parse\_open](spi-spi-cursor-parse-open.html) — set up a cursor using a query string and parameters
    *   [SPI\_cursor\_find](spi-spi-cursor-find.html) — find an existing cursor by name
    *   [SPI\_cursor\_fetch](spi-spi-cursor-fetch.html) — fetch some rows from a cursor
    *   [SPI\_cursor\_move](spi-spi-cursor-move.html) — move a cursor
    *   [SPI\_scroll\_cursor\_fetch](spi-spi-scroll-cursor-fetch.html) — fetch some rows from a cursor
    *   [SPI\_scroll\_cursor\_move](spi-spi-scroll-cursor-move.html) — move a cursor
    *   [SPI\_cursor\_close](spi-spi-cursor-close.html) — close a cursor
    *   [SPI\_keepplan](spi-spi-keepplan.html) — save a prepared statement
    *   [SPI\_saveplan](spi-spi-saveplan.html) — save a prepared statement
    *   [SPI\_register\_relation](spi-spi-register-relation.html) — make an ephemeral named relation available by name in SPI queries
    *   [SPI\_unregister\_relation](spi-spi-unregister-relation.html) — remove an ephemeral named relation from the registry
    *   [SPI\_register\_trigger\_data](spi-spi-register-trigger-data.html) — make ephemeral trigger data available in SPI queries

***

|                                                              |                                                           |                                             |
| :----------------------------------------------------------- | :-------------------------------------------------------: | ------------------------------------------: |
| [Prev](spi.html "Chapter 47. Server Programming Interface")  | [Up](spi.html "Chapter 47. Server Programming Interface") |  [Next](spi-spi-connect.html "SPI_connect") |
| Chapter 47. Server Programming Interface                     |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                SPI\_connect |
