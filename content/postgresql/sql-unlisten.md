[#id](#SQL-UNLISTEN)

## UNLISTEN

UNLISTEN — stop listening for a notification

## Synopsis

```
UNLISTEN { channel | * }
```

[#id](#id-1.9.3.182.5)

## Description

`UNLISTEN` is used to remove an existing registration for `NOTIFY` events. `UNLISTEN` cancels any existing registration of the current PostgreSQL session as a listener on the notification channel named _`channel`_. The special wildcard `*` cancels all listener registrations for the current session.

[NOTIFY](sql-notify) contains a more extensive discussion of the use of `LISTEN` and `NOTIFY`.

[#id](#id-1.9.3.182.6)

## Parameters

- _`channel`_

  Name of a notification channel (any identifier).

- `*`

  All current listen registrations for this session are cleared.

[#id](#id-1.9.3.182.7)

## Notes

You can unlisten something you were not listening for; no warning or error will appear.

At the end of each session, `UNLISTEN *` is automatically executed.

A transaction that has executed `UNLISTEN` cannot be prepared for two-phase commit.

[#id](#id-1.9.3.182.8)

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

[#id](#id-1.9.3.182.9)

## Compatibility

There is no `UNLISTEN` command in the SQL standard.

[#id](#id-1.9.3.182.10)

## See Also

[LISTEN](sql-listen), [NOTIFY](sql-notify)
