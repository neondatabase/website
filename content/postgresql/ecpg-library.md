

|                       36.11. Library Functions                       |                                                        |                                      |                                                       |                                              |
| :------------------------------------------------------------------: | :----------------------------------------------------- | :----------------------------------: | ----------------------------------------------------: | -------------------------------------------: |
| [Prev](ecpg-process.html "36.10. Processing Embedded SQL Programs")  | [Up](ecpg.html "Chapter 36. ECPG — Embedded SQL in C") | Chapter 36. ECPG — Embedded SQL in C | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-lo.html "36.12. Large Objects") |

***

## 36.11. Library Functions [#](#ECPG-LIBRARY)

The `libecpg` library primarily contains “hidden” functions that are used to implement the functionality expressed by the embedded SQL commands. But there are some functions that can usefully be called directly. Note that this makes your code unportable.

* `ECPGdebug(int on, FILE *stream)` turns on debug logging if called with the first argument non-zero. Debug logging is done on *`stream`*. The log contains all SQL statements with all the input variables inserted, and the results from the PostgreSQL server. This can be very useful when searching for errors in your SQL statements.

### Note

    On Windows, if the ecpg libraries and an application are compiled with different flags, this function call will crash the application because the internal representation of the `FILE` pointers differ. Specifically, multithreaded/single-threaded, release/debug, and static/dynamic flags should be the same for the library and all applications using that library.

* `ECPGget_PGconn(const char *connection_name)`returns the library database connection handle identified by the given name. If *`connection_name`* is set to `NULL`, the current connection handle is returned. If no connection handle can be identified, the function returns `NULL`. The returned connection handle can be used to call any other functions from libpq, if necessary.

### Note

    It is a bad idea to manipulate database connection handles made from ecpg directly with libpq routines.

* `ECPGtransactionStatus(const char *connection_name)` returns the current transaction status of the given connection identified by *`connection_name`*. See [Section 34.2](libpq-status.html "34.2. Connection Status Functions") and libpq's [`PQtransactionStatus`](libpq-status.html#LIBPQ-PQTRANSACTIONSTATUS) for details about the returned status codes.

* `ECPGstatus(int lineno, const char* connection_name)` returns true if you are connected to a database and false if not. *`connection_name`* can be `NULL` if a single connection is being used.

***

|                                                                      |                                                        |                                              |
| :------------------------------------------------------------------- | :----------------------------------------------------: | -------------------------------------------: |
| [Prev](ecpg-process.html "36.10. Processing Embedded SQL Programs")  | [Up](ecpg.html "Chapter 36. ECPG — Embedded SQL in C") |  [Next](ecpg-lo.html "36.12. Large Objects") |
| 36.10. Processing Embedded SQL Programs                              |  [Home](index.html "PostgreSQL 17devel Documentation") |                         36.12. Large Objects |
