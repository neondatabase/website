<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       34.7. Canceling Queries in Progress                       |                                                  |                               |                                                       |                                                              |
| :-----------------------------------------------------------------------------: | :----------------------------------------------- | :---------------------------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](libpq-single-row-mode.html "34.6. Retrieving Query Results Row-by-Row")  | [Up](libpq.html "Chapter 34. libpq — C Library") | Chapter 34. libpq — C Library | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](libpq-fastpath.html "34.8. The Fast-Path Interface") |

***

## 34.7. Canceling Queries in Progress [#](#LIBPQ-CANCEL)

[]()

A client application can request cancellation of a command that is still being processed by the server, using the functions described in this section.

*   `PQgetCancel`[]() [#](#LIBPQ-PQGETCANCEL)

    Creates a data structure containing the information needed to cancel a command issued through a particular database connection.

        PGcancel *PQgetCancel(PGconn *conn);

    [`PQgetCancel`](libpq-cancel.html#LIBPQ-PQGETCANCEL) creates a `PGcancel`[]() object given a `PGconn` connection object. It will return `NULL` if the given *`conn`* is `NULL` or an invalid connection. The `PGcancel` object is an opaque structure that is not meant to be accessed directly by the application; it can only be passed to [`PQcancel`](libpq-cancel.html#LIBPQ-PQCANCEL) or [`PQfreeCancel`](libpq-cancel.html#LIBPQ-PQFREECANCEL).

*   `PQfreeCancel`[]() [#](#LIBPQ-PQFREECANCEL)

    Frees a data structure created by [`PQgetCancel`](libpq-cancel.html#LIBPQ-PQGETCANCEL).

        void PQfreeCancel(PGcancel *cancel);

    [`PQfreeCancel`](libpq-cancel.html#LIBPQ-PQFREECANCEL) frees a data object previously created by [`PQgetCancel`](libpq-cancel.html#LIBPQ-PQGETCANCEL).

*   `PQcancel`[]() [#](#LIBPQ-PQCANCEL)

    Requests that the server abandon processing of the current command.

        int PQcancel(PGcancel *cancel, char *errbuf, int errbufsize);

    The return value is 1 if the cancel request was successfully dispatched and 0 if not. If not, *`errbuf`* is filled with an explanatory error message. *`errbuf`* must be a char array of size *`errbufsize`* (the recommended size is 256 bytes).

    Successful dispatch is no guarantee that the request will have any effect, however. If the cancellation is effective, the current command will terminate early and return an error result. If the cancellation fails (say, because the server was already done processing the command), then there will be no visible result at all.

    [`PQcancel`](libpq-cancel.html#LIBPQ-PQCANCEL) can safely be invoked from a signal handler, if the *`errbuf`* is a local variable in the signal handler. The `PGcancel` object is read-only as far as [`PQcancel`](libpq-cancel.html#LIBPQ-PQCANCEL) is concerned, so it can also be invoked from a thread that is separate from the one manipulating the `PGconn` object.

<!---->

*   `PQrequestCancel`[]() [#](#LIBPQ-PQREQUESTCANCEL)

    [`PQrequestCancel`](libpq-cancel.html#LIBPQ-PQREQUESTCANCEL) is a deprecated variant of [`PQcancel`](libpq-cancel.html#LIBPQ-PQCANCEL).

        int PQrequestCancel(PGconn *conn);

    Requests that the server abandon processing of the current command. It operates directly on the `PGconn` object, and in case of failure stores the error message in the `PGconn` object (whence it can be retrieved by [`PQerrorMessage`](libpq-status.html#LIBPQ-PQERRORMESSAGE)). Although the functionality is the same, this approach is not safe within multiple-thread programs or signal handlers, since it is possible that overwriting the `PGconn`'s error message will mess up the operation currently in progress on the connection.

***

|                                                                                 |                                                       |                                                              |
| :------------------------------------------------------------------------------ | :---------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](libpq-single-row-mode.html "34.6. Retrieving Query Results Row-by-Row")  |    [Up](libpq.html "Chapter 34. libpq — C Library")   |  [Next](libpq-fastpath.html "34.8. The Fast-Path Interface") |
| 34.6. Retrieving Query Results Row-by-Row                                       | [Home](index.html "PostgreSQL 17devel Documentation") |                                34.8. The Fast-Path Interface |
