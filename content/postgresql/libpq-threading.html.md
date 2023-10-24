<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|     34.20. Behavior in Threaded Programs     |                                                  |                               |                                                       |                                                            |
| :------------------------------------------: | :----------------------------------------------- | :---------------------------: | ----------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](libpq-ssl.html "34.19. SSL Support")  | [Up](libpq.html "Chapter 34. libpq — C Library") | Chapter 34. libpq — C Library | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](libpq-build.html "34.21. Building libpq Programs") |

***

## 34.20. Behavior in Threaded Programs [#](#LIBPQ-THREADING)

[]()

As of version 17, libpq is always reentrant and thread-safe. However, one restriction is that no two threads attempt to manipulate the same `PGconn` object at the same time. In particular, you cannot issue concurrent commands from different threads through the same connection object. (If you need to run concurrent commands, use multiple connections.)

`PGresult` objects are normally read-only after creation, and so can be passed around freely between threads. However, if you use any of the `PGresult`-modifying functions described in [Section 34.12](libpq-misc.html "34.12. Miscellaneous Functions") or [Section 34.14](libpq-events.html "34.14. Event System"), it's up to you to avoid concurrent operations on the same `PGresult`, too.

In earlier versions, libpq could be compiled with or without thread support, depending on compiler options. This function allows the querying of libpq's thread-safe status:

*   `PQisthreadsafe`[]() [#](#LIBPQ-PQISTHREADSAFE)

    Returns the thread safety status of the libpq library.

        int PQisthreadsafe();

    Returns 1 if the libpq is thread-safe and 0 if it is not. Always returns 1 on version 17 and above.

The deprecated functions [`PQrequestCancel`](libpq-cancel.html#LIBPQ-PQREQUESTCANCEL) and [`PQoidStatus`](libpq-exec.html#LIBPQ-PQOIDSTATUS) are not thread-safe and should not be used in multithread programs. [`PQrequestCancel`](libpq-cancel.html#LIBPQ-PQREQUESTCANCEL) can be replaced by [`PQcancel`](libpq-cancel.html#LIBPQ-PQCANCEL). [`PQoidStatus`](libpq-exec.html#LIBPQ-PQOIDSTATUS) can be replaced by [`PQoidValue`](libpq-exec.html#LIBPQ-PQOIDVALUE).

If you are using Kerberos inside your application (in addition to inside libpq), you will need to do locking around Kerberos calls because Kerberos functions are not thread-safe. See function `PQregisterThreadLock` in the libpq source code for a way to do cooperative locking between libpq and your application.

***

|                                              |                                                       |                                                            |
| :------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](libpq-ssl.html "34.19. SSL Support")  |    [Up](libpq.html "Chapter 34. libpq — C Library")   |  [Next](libpq-build.html "34.21. Building libpq Programs") |
| 34.19. SSL Support                           | [Home](index.html "PostgreSQL 17devel Documentation") |                             34.21. Building libpq Programs |
