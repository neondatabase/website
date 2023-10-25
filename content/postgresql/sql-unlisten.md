<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                UNLISTEN               |                                        |              |                                                       |                                   |
| :-----------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------: |
| [Prev](sql-truncate.html "TRUNCATE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-update.html "UPDATE") |

***



## UNLISTEN

UNLISTEN — stop listening for a notification

## Synopsis

```

UNLISTEN { channel | * }
```

## Description

`UNLISTEN` is used to remove an existing registration for `NOTIFY` events. `UNLISTEN` cancels any existing registration of the current PostgreSQL session as a listener on the notification channel named *`channel`*. The special wildcard `*` cancels all listener registrations for the current session.

[NOTIFY](sql-notify.html "NOTIFY") contains a more extensive discussion of the use of `LISTEN` and `NOTIFY`.

## Parameters

*   *`channel`*

    Name of a notification channel (any identifier).

*   `*`

    All current listen registrations for this session are cleared.

## Notes

You can unlisten something you were not listening for; no warning or error will appear.

At the end of each session, `UNLISTEN *` is automatically executed.

A transaction that has executed `UNLISTEN` cannot be prepared for two-phase commit.

## Examples

To make a registration:

```

LISTEN virtual;
NOTIFY virtual;
Asynchronous notification "virtual" received from server process with PID 8448.
```

Once `UNLISTEN` has been executed, further `NOTIFY` messages will be ignored:

```

UNLISTEN virtual;
NOTIFY virtual;
-- no NOTIFY event is received
```

## Compatibility

There is no `UNLISTEN` command in the SQL standard.

## See Also

[LISTEN](sql-listen.html "LISTEN"), [NOTIFY](sql-notify.html "NOTIFY")

***

|                                       |                                                       |                                   |
| :------------------------------------ | :---------------------------------------------------: | --------------------------------: |
| [Prev](sql-truncate.html "TRUNCATE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-update.html "UPDATE") |
| TRUNCATE                              | [Home](index.html "PostgreSQL 17devel Documentation") |                            UPDATE |
