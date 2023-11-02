## 47.1. Interface Functions [#](#SPI-INTERFACE)

  * *   [SPI\_connect](spi-spi-connect) — connect a C function to the SPI manager
  * [SPI\_finish](spi-spi-finish) — disconnect a C function from the SPI manager
  * [SPI\_execute](spi-spi-execute) — execute a command
  * [SPI\_exec](spi-spi-exec) — execute a read/write command
  * [SPI\_execute\_extended](spi-spi-execute-extended) — execute a command with out-of-line parameters
  * [SPI\_execute\_with\_args](spi-spi-execute-with-args) — execute a command with out-of-line parameters
  * [SPI\_prepare](spi-spi-prepare) — prepare a statement, without executing it yet
  * [SPI\_prepare\_cursor](spi-spi-prepare-cursor) — prepare a statement, without executing it yet
  * [SPI\_prepare\_extended](spi-spi-prepare-extended) — prepare a statement, without executing it yet
  * [SPI\_prepare\_params](spi-spi-prepare-params) — prepare a statement, without executing it yet
  * [SPI\_getargcount](spi-spi-getargcount) — return the number of arguments needed by a statement prepared by `SPI_prepare`
  * [SPI\_getargtypeid](spi-spi-getargtypeid) — return the data type OID for an argument of a statement prepared by `SPI_prepare`
  * [SPI\_is\_cursor\_plan](spi-spi-is-cursor-plan) — return `true` if a statement prepared by `SPI_prepare` can be used with `SPI_cursor_open`
  * [SPI\_execute\_plan](spi-spi-execute-plan) — execute a statement prepared by `SPI_prepare`
  * [SPI\_execute\_plan\_extended](spi-spi-execute-plan-extended) — execute a statement prepared by `SPI_prepare`
  * [SPI\_execute\_plan\_with\_paramlist](spi-spi-execute-plan-with-paramlist) — execute a statement prepared by `SPI_prepare`
  * [SPI\_execp](spi-spi-execp) — execute a statement in read/write mode
  * [SPI\_cursor\_open](spi-spi-cursor-open) — set up a cursor using a statement created with `SPI_prepare`
  * [SPI\_cursor\_open\_with\_args](spi-spi-cursor-open-with-args) — set up a cursor using a query and parameters
  * [SPI\_cursor\_open\_with\_paramlist](spi-spi-cursor-open-with-paramlist) — set up a cursor using parameters
  * [SPI\_cursor\_parse\_open](spi-spi-cursor-parse-open) — set up a cursor using a query string and parameters
  * [SPI\_cursor\_find](spi-spi-cursor-find) — find an existing cursor by name
  * [SPI\_cursor\_fetch](spi-spi-cursor-fetch) — fetch some rows from a cursor
  * [SPI\_cursor\_move](spi-spi-cursor-move) — move a cursor
  * [SPI\_scroll\_cursor\_fetch](spi-spi-scroll-cursor-fetch) — fetch some rows from a cursor
  * [SPI\_scroll\_cursor\_move](spi-spi-scroll-cursor-move) — move a cursor
  * [SPI\_cursor\_close](spi-spi-cursor-close) — close a cursor
  * [SPI\_keepplan](spi-spi-keepplan) — save a prepared statement
  * [SPI\_saveplan](spi-spi-saveplan) — save a prepared statement
  * [SPI\_register\_relation](spi-spi-register-relation) — make an ephemeral named relation available by name in SPI queries
  * [SPI\_unregister\_relation](spi-spi-unregister-relation) — remove an ephemeral named relation from the registry
  * [SPI\_register\_trigger\_data](spi-spi-register-trigger-data) — make ephemeral trigger data available in SPI queries