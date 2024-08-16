[#id](#SPI-INTERFACE)

## 47.1. Interface Functions [#](#SPI-INTERFACE)

- [SPI_connect](spi-spi-connect) — connect a C function to the SPI manager
- [SPI_finish](spi-spi-finish) — disconnect a C function from the SPI manager
- [SPI_execute](spi-spi-execute) — execute a command
- [SPI_exec](spi-spi-exec) — execute a read/write command
- [SPI_execute_extended](spi-spi-execute-extended) — execute a command with out-of-line parameters
- [SPI_execute_with_args](spi-spi-execute-with-args) — execute a command with out-of-line parameters
- [SPI_prepare](spi-spi-prepare) — prepare a statement, without executing it yet
- [SPI_prepare_cursor](spi-spi-prepare-cursor) — prepare a statement, without executing it yet
- [SPI_prepare_extended](spi-spi-prepare-extended) — prepare a statement, without executing it yet
- [SPI_prepare_params](spi-spi-prepare-params) — prepare a statement, without executing it yet
- [SPI_getargcount](spi-spi-getargcount) — return the number of arguments needed by a statement prepared by `SPI_prepare`
- [SPI_getargtypeid](spi-spi-getargtypeid) — return the data type OID for an argument of a statement prepared by `SPI_prepare`
- [SPI_is_cursor_plan](spi-spi-is-cursor-plan) — return `true` if a statement prepared by `SPI_prepare` can be used with `SPI_cursor_open`
- [SPI_execute_plan](spi-spi-execute-plan) — execute a statement prepared by `SPI_prepare`
- [SPI_execute_plan_extended](spi-spi-execute-plan-extended) — execute a statement prepared by `SPI_prepare`
- [SPI_execute_plan_with_paramlist](spi-spi-execute-plan-with-paramlist) — execute a statement prepared by `SPI_prepare`
- [SPI_execp](spi-spi-execp) — execute a statement in read/write mode
- [SPI_cursor_open](spi-spi-cursor-open) — set up a cursor using a statement created with `SPI_prepare`
- [SPI_cursor_open_with_args](spi-spi-cursor-open-with-args) — set up a cursor using a query and parameters
- [SPI_cursor_open_with_paramlist](spi-spi-cursor-open-with-paramlist) — set up a cursor using parameters
- [SPI_cursor_parse_open](spi-spi-cursor-parse-open) — set up a cursor using a query string and parameters
- [SPI_cursor_find](spi-spi-cursor-find) — find an existing cursor by name
- [SPI_cursor_fetch](spi-spi-cursor-fetch) — fetch some rows from a cursor
- [SPI_cursor_move](spi-spi-cursor-move) — move a cursor
- [SPI_scroll_cursor_fetch](spi-spi-scroll-cursor-fetch) — fetch some rows from a cursor
- [SPI_scroll_cursor_move](spi-spi-scroll-cursor-move) — move a cursor
- [SPI_cursor_close](spi-spi-cursor-close) — close a cursor
- [SPI_keepplan](spi-spi-keepplan) — save a prepared statement
- [SPI_saveplan](spi-spi-saveplan) — save a prepared statement
- [SPI_register_relation](spi-spi-register-relation) — make an ephemeral named relation available by name in SPI queries
- [SPI_unregister_relation](spi-spi-unregister-relation) — remove an ephemeral named relation from the registry
- [SPI_register_trigger_data](spi-spi-register-trigger-data) — make ephemeral trigger data available in SPI queries
