[#id](#LIBPQ-ASYNC)

## 34.4. Asynchronous Command Processing [#](#LIBPQ-ASYNC)

The [`PQexec`](libpq-exec#LIBPQ-PQEXEC) function is adequate for submitting commands in normal, synchronous applications. It has a few deficiencies, however, that can be of importance to some users:

- [`PQexec`](libpq-exec#LIBPQ-PQEXEC) waits for the command to be completed. The application might have other work to do (such as maintaining a user interface), in which case it won't want to block waiting for the response.

- Since the execution of the client application is suspended while it waits for the result, it is hard for the application to decide that it would like to try to cancel the ongoing command. (It can be done from a signal handler, but not otherwise.)

- [`PQexec`](libpq-exec#LIBPQ-PQEXEC) can return only one `PGresult` structure. If the submitted command string contains multiple SQL commands, all but the last `PGresult` are discarded by [`PQexec`](libpq-exec#LIBPQ-PQEXEC).

- [`PQexec`](libpq-exec#LIBPQ-PQEXEC) always collects the command's entire result, buffering it in a single `PGresult`. While this simplifies error-handling logic for the application, it can be impractical for results containing many rows.

Applications that do not like these limitations can instead use the underlying functions that [`PQexec`](libpq-exec#LIBPQ-PQEXEC) is built from: [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY) and [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT). There are also [`PQsendQueryParams`](libpq-async#LIBPQ-PQSENDQUERYPARAMS), [`PQsendPrepare`](libpq-async#LIBPQ-PQSENDPREPARE), [`PQsendQueryPrepared`](libpq-async#LIBPQ-PQSENDQUERYPREPARED), [`PQsendDescribePrepared`](libpq-async#LIBPQ-PQSENDDESCRIBEPREPARED), and [`PQsendDescribePortal`](libpq-async#LIBPQ-PQSENDDESCRIBEPORTAL), which can be used with [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) to duplicate the functionality of [`PQexecParams`](libpq-exec#LIBPQ-PQEXECPARAMS), [`PQprepare`](libpq-exec#LIBPQ-PQPREPARE), [`PQexecPrepared`](libpq-exec#LIBPQ-PQEXECPREPARED), [`PQdescribePrepared`](libpq-exec#LIBPQ-PQDESCRIBEPREPARED), and [`PQdescribePortal`](libpq-exec#LIBPQ-PQDESCRIBEPORTAL) respectively.

- `PQsendQuery` [#](#LIBPQ-PQSENDQUERY)

  Submits a command to the server without waiting for the result(s). 1 is returned if the command was successfully dispatched and 0 if not (in which case, use [`PQerrorMessage`](libpq-status#LIBPQ-PQERRORMESSAGE) to get more information about the failure).

  ```
  int PQsendQuery(PGconn *conn, const char *command);
  ```

  After successfully calling [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY), call [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) one or more times to obtain the results. [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY) cannot be called again (on the same connection) until [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) has returned a null pointer, indicating that the command is done.

  In pipeline mode, this function is disallowed.

- `PQsendQueryParams` [#](#LIBPQ-PQSENDQUERYPARAMS)

  Submits a command and separate parameters to the server without waiting for the result(s).

  ```
  int PQsendQueryParams(PGconn *conn,
                        const char *command,
                        int nParams,
                        const Oid *paramTypes,
                        const char * const *paramValues,
                        const int *paramLengths,
                        const int *paramFormats,
                        int resultFormat);
  ```

  This is equivalent to [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY) except that query parameters can be specified separately from the query string. The function's parameters are handled identically to [`PQexecParams`](libpq-exec#LIBPQ-PQEXECPARAMS). Like [`PQexecParams`](libpq-exec#LIBPQ-PQEXECPARAMS), it allows only one command in the query string.

- `PQsendPrepare` [#](#LIBPQ-PQSENDPREPARE)

  Sends a request to create a prepared statement with the given parameters, without waiting for completion.

  ```
  int PQsendPrepare(PGconn *conn,
                    const char *stmtName,
                    const char *query,
                    int nParams,
                    const Oid *paramTypes);
  ```

  This is an asynchronous version of [`PQprepare`](libpq-exec#LIBPQ-PQPREPARE): it returns 1 if it was able to dispatch the request, and 0 if not. After a successful call, call [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) to determine whether the server successfully created the prepared statement. The function's parameters are handled identically to [`PQprepare`](libpq-exec#LIBPQ-PQPREPARE).

- `PQsendQueryPrepared` [#](#LIBPQ-PQSENDQUERYPREPARED)

  Sends a request to execute a prepared statement with given parameters, without waiting for the result(s).

  ```
  int PQsendQueryPrepared(PGconn *conn,
                          const char *stmtName,
                          int nParams,
                          const char * const *paramValues,
                          const int *paramLengths,
                          const int *paramFormats,
                          int resultFormat);
  ```

  This is similar to [`PQsendQueryParams`](libpq-async#LIBPQ-PQSENDQUERYPARAMS), but the command to be executed is specified by naming a previously-prepared statement, instead of giving a query string. The function's parameters are handled identically to [`PQexecPrepared`](libpq-exec#LIBPQ-PQEXECPREPARED).

- `PQsendDescribePrepared` [#](#LIBPQ-PQSENDDESCRIBEPREPARED)

  Submits a request to obtain information about the specified prepared statement, without waiting for completion.

  ```
  int PQsendDescribePrepared(PGconn *conn, const char *stmtName);
  ```

  This is an asynchronous version of [`PQdescribePrepared`](libpq-exec#LIBPQ-PQDESCRIBEPREPARED): it returns 1 if it was able to dispatch the request, and 0 if not. After a successful call, call [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) to obtain the results. The function's parameters are handled identically to [`PQdescribePrepared`](libpq-exec#LIBPQ-PQDESCRIBEPREPARED).

- `PQsendDescribePortal` [#](#LIBPQ-PQSENDDESCRIBEPORTAL)

  Submits a request to obtain information about the specified portal, without waiting for completion.

  ```
  int PQsendDescribePortal(PGconn *conn, const char *portalName);
  ```

  This is an asynchronous version of [`PQdescribePortal`](libpq-exec#LIBPQ-PQDESCRIBEPORTAL): it returns 1 if it was able to dispatch the request, and 0 if not. After a successful call, call [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) to obtain the results. The function's parameters are handled identically to [`PQdescribePortal`](libpq-exec#LIBPQ-PQDESCRIBEPORTAL).

- `PQgetResult` [#](#LIBPQ-PQGETRESULT)

  Waits for the next result from a prior [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY), [`PQsendQueryParams`](libpq-async#LIBPQ-PQSENDQUERYPARAMS), [`PQsendPrepare`](libpq-async#LIBPQ-PQSENDPREPARE), [`PQsendQueryPrepared`](libpq-async#LIBPQ-PQSENDQUERYPREPARED), [`PQsendDescribePrepared`](libpq-async#LIBPQ-PQSENDDESCRIBEPREPARED), [`PQsendDescribePortal`](libpq-async#LIBPQ-PQSENDDESCRIBEPORTAL), or [`PQpipelineSync`](libpq-pipeline-mode#LIBPQ-PQPIPELINESYNC) call, and returns it. A null pointer is returned when the command is complete and there will be no more results.

  ```
  PGresult *PQgetResult(PGconn *conn);
  ```

  [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) must be called repeatedly until it returns a null pointer, indicating that the command is done. (If called when no command is active, [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) will just return a null pointer at once.) Each non-null result from [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) should be processed using the same `PGresult` accessor functions previously described. Don't forget to free each result object with [`PQclear`](libpq-exec#LIBPQ-PQCLEAR) when done with it. Note that [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) will block only if a command is active and the necessary response data has not yet been read by [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT).

  In pipeline mode, `PQgetResult` will return normally unless an error occurs; for any subsequent query sent after the one that caused the error until (and excluding) the next synchronization point, a special result of type `PGRES_PIPELINE_ABORTED` will be returned, and a null pointer will be returned after it. When the pipeline synchronization point is reached, a result of type `PGRES_PIPELINE_SYNC` will be returned. The result of the next query after the synchronization point follows immediately (that is, no null pointer is returned after the synchronization point.)

  ### Note

  Even when [`PQresultStatus`](libpq-exec#LIBPQ-PQRESULTSTATUS) indicates a fatal error, [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) should be called until it returns a null pointer, to allow libpq to process the error information completely.

Using [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY) and [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) solves one of [`PQexec`](libpq-exec#LIBPQ-PQEXEC)'s problems: If a command string contains multiple SQL commands, the results of those commands can be obtained individually. (This allows a simple form of overlapped processing, by the way: the client can be handling the results of one command while the server is still working on later queries in the same command string.)

Another frequently-desired feature that can be obtained with [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY) and [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) is retrieving large query results a row at a time. This is discussed in [Section 34.6](libpq-single-row-mode).

By itself, calling [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) will still cause the client to block until the server completes the next SQL command. This can be avoided by proper use of two more functions:

- `PQconsumeInput` [#](#LIBPQ-PQCONSUMEINPUT)

  If input is available from the server, consume it.

  ```
  int PQconsumeInput(PGconn *conn);
  ```

  [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT)normally returns 1 indicating “no error”, but returns 0 if there was some kind of trouble (in which case [`PQerrorMessage`](libpq-status#LIBPQ-PQERRORMESSAGE) can be consulted). Note that the result does not say whether any input data was actually collected. After calling [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT), the application can check [`PQisBusy`](libpq-async#LIBPQ-PQISBUSY) and/or `PQnotifies` to see if their state has changed.

  [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT)can be called even if the application is not prepared to deal with a result or notification just yet. The function will read available data and save it in a buffer, thereby causing a `select()` read-ready indication to go away. The application can thus use [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT)to clear the `select()` condition immediately, and then examine the results at leisure.

- `PQisBusy` [#](#LIBPQ-PQISBUSY)

  Returns 1 if a command is busy, that is, [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) would block waiting for input. A 0 return indicates that [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) can be called with assurance of not blocking.

  ```
  int PQisBusy(PGconn *conn);
  ```

  [`PQisBusy`](libpq-async#LIBPQ-PQISBUSY) will not itself attempt to read data from the server; therefore [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT)must be invoked first, or the busy state will never end.

A typical application using these functions will have a main loop that uses `select()` or `poll()` to wait for all the conditions that it must respond to. One of the conditions will be input available from the server, which in terms of `select()` means readable data on the file descriptor identified by [`PQsocket`](libpq-status#LIBPQ-PQSOCKET). When the main loop detects input ready, it should call [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT)to read the input. It can then call [`PQisBusy`](libpq-async#LIBPQ-PQISBUSY), followed by [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) if [`PQisBusy`](libpq-async#LIBPQ-PQISBUSY) returns false (0). It can also call `PQnotifies` to detect `NOTIFY` messages (see [Section 34.9](libpq-notify)).

A client that uses [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY)/[`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) can also attempt to cancel a command that is still being processed by the server; see [Section 34.7](libpq-cancel). But regardless of the return value of [`PQcancel`](libpq-cancel#LIBPQ-PQCANCEL), the application must continue with the normal result-reading sequence using [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT). A successful cancellation will simply cause the command to terminate sooner than it would have otherwise.

By using the functions described above, it is possible to avoid blocking while waiting for input from the database server. However, it is still possible that the application will block waiting to send output to the server. This is relatively uncommon but can happen if very long SQL commands or data values are sent. (It is much more probable if the application sends data via `COPY IN`, however.) To prevent this possibility and achieve completely nonblocking database operation, the following additional functions can be used.

- `PQsetnonblocking` [#](#LIBPQ-PQSETNONBLOCKING)

  Sets the nonblocking status of the connection.

  ```
  int PQsetnonblocking(PGconn *conn, int arg);
  ```

  Sets the state of the connection to nonblocking if _`arg`_ is 1, or blocking if _`arg`_ is 0. Returns 0 if OK, -1 if error.

  In the nonblocking state, calls to [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY), [`PQputline`](libpq-copy#LIBPQ-PQPUTLINE), [`PQputnbytes`](libpq-copy#LIBPQ-PQPUTNBYTES), [`PQputCopyData`](libpq-copy#LIBPQ-PQPUTCOPYDATA), and [`PQendcopy`](libpq-copy#LIBPQ-PQENDCOPY) will not block but instead return an error if they need to be called again.

  Note that [`PQexec`](libpq-exec#LIBPQ-PQEXEC) does not honor nonblocking mode; if it is called, it will act in blocking fashion anyway.

- `PQisnonblocking` [#](#LIBPQ-PQISNONBLOCKING)

  Returns the blocking status of the database connection.

  ```
  int PQisnonblocking(const PGconn *conn);
  ```

  Returns 1 if the connection is set to nonblocking mode and 0 if blocking.

- `PQflush` [#](#LIBPQ-PQFLUSH)

  Attempts to flush any queued output data to the server. Returns 0 if successful (or if the send queue is empty), -1 if it failed for some reason, or 1 if it was unable to send all the data in the send queue yet (this case can only occur if the connection is nonblocking).

  ```
  int PQflush(PGconn *conn);
  ```

After sending any command or data on a nonblocking connection, call [`PQflush`](libpq-async#LIBPQ-PQFLUSH). If it returns 1, wait for the socket to become read- or write-ready. If it becomes write-ready, call [`PQflush`](libpq-async#LIBPQ-PQFLUSH) again. If it becomes read-ready, call [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT), then call [`PQflush`](libpq-async#LIBPQ-PQFLUSH) again. Repeat until [`PQflush`](libpq-async#LIBPQ-PQFLUSH) returns 0. (It is necessary to check for read-ready and drain the input with [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT), because the server can block trying to send us data, e.g., NOTICE messages, and won't read our data until we read its.) Once [`PQflush`](libpq-async#LIBPQ-PQFLUSH) returns 0, wait for the socket to be read-ready and then read the response as described above.
