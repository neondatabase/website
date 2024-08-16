[#id](#LIBPQ-NOTIFY)

## 34.9. Asynchronous Notification [#](#LIBPQ-NOTIFY)

PostgreSQL offers asynchronous notification via the `LISTEN` and `NOTIFY` commands. A client session registers its interest in a particular notification channel with the `LISTEN` command (and can stop listening with the `UNLISTEN` command). All sessions listening on a particular channel will be notified asynchronously when a `NOTIFY` command with that channel name is executed by any session. A “payload” string can be passed to communicate additional data to the listeners.

libpq applications submit `LISTEN`, `UNLISTEN`, and `NOTIFY` commands as ordinary SQL commands. The arrival of `NOTIFY` messages can subsequently be detected by calling `PQnotifies`.

The function `PQnotifies` returns the next notification from a list of unhandled notification messages received from the server. It returns a null pointer if there are no pending notifications. Once a notification is returned from `PQnotifies`, it is considered handled and will be removed from the list of notifications.

```
PGnotify *PQnotifies(PGconn *conn);

typedef struct pgNotify
{
    char *relname;              /* notification channel name */
    int  be_pid;                /* process ID of notifying server process */
    char *extra;                /* notification payload string */
} PGnotify;
```

After processing a `PGnotify` object returned by `PQnotifies`, be sure to free it with [`PQfreemem`](libpq-misc#LIBPQ-PQFREEMEM). It is sufficient to free the `PGnotify` pointer; the `relname` and `extra` fields do not represent separate allocations. (The names of these fields are historical; in particular, channel names need not have anything to do with relation names.)

[Example 34.2](libpq-example#LIBPQ-EXAMPLE-2) gives a sample program that illustrates the use of asynchronous notification.

`PQnotifies` does not actually read data from the server; it just returns messages previously absorbed by another libpq function. In ancient releases of libpq, the only way to ensure timely receipt of `NOTIFY` messages was to constantly submit commands, even empty ones, and then check `PQnotifies` after each [`PQexec`](libpq-exec#LIBPQ-PQEXEC). While this still works, it is deprecated as a waste of processing power.

A better way to check for `NOTIFY` messages when you have no useful commands to execute is to call [`PQconsumeInput` ](libpq-async#LIBPQ-PQCONSUMEINPUT), then check `PQnotifies`. You can use `select()` to wait for data to arrive from the server, thereby using no CPU power unless there is something to do. (See [`PQsocket`](libpq-status#LIBPQ-PQSOCKET) to obtain the file descriptor number to use with `select()`.) Note that this will work OK whether you submit commands with [`PQsendQuery`](libpq-async#LIBPQ-PQSENDQUERY)/[`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) or simply use [`PQexec`](libpq-exec#LIBPQ-PQEXEC). You should, however, remember to check `PQnotifies` after each [`PQgetResult`](libpq-async#LIBPQ-PQGETRESULT) or [`PQexec`](libpq-exec#LIBPQ-PQEXEC), to see if any notifications came in during the processing of the command.
