[#id](#CONTRIB-DBLINK-GET-NOTIFY)

## dblink_get_notify

dblink_get_notify — retrieve async notifications on a connection

## Synopsis

```

dblink_get_notify() returns setof (notify_name text, be_pid int, extra text)
dblink_get_notify(text connname) returns setof (notify_name text, be_pid int, extra text)
```

[#id](#id-1.11.7.22.17.5)

## Description

`dblink_get_notify` retrieves notifications on either the unnamed connection, or on a named connection if specified. To receive notifications via dblink, `LISTEN` must first be issued, using `dblink_exec`. For details see [LISTEN](sql-listen) and [NOTIFY](sql-notify).

[#id](#id-1.11.7.22.17.6)

## Arguments

- _`connname`_

  The name of a named connection to get notifications on.

[#id](#id-1.11.7.22.17.7)

## Return Value

Returns `setof (notify_name text, be_pid int, extra text)`, or an empty set if none.

[#id](#id-1.11.7.22.17.8)

## Examples

```

SELECT dblink_exec('LISTEN virtual');
 dblink_exec
-------------
 LISTEN
(1 row)

SELECT * FROM dblink_get_notify();
 notify_name | be_pid | extra
-------------+--------+-------
(0 rows)

NOTIFY virtual;
NOTIFY

SELECT * FROM dblink_get_notify();
 notify_name | be_pid | extra
-------------+--------+-------
 virtual     |   1229 |
(1 row)
```
