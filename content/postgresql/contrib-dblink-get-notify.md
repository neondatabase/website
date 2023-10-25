<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  dblink\_get\_notify                  |                                                                          |                                                      |                                                       |                                                             |
| :---------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](contrib-dblink-is-busy.html "dblink_is_busy")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-get-result.html "dblink_get_result") |

***

[]()

## dblink\_get\_notify

dblink\_get\_notify — retrieve async notifications on a connection

## Synopsis

```

dblink_get_notify() returns setof (notify_name text, be_pid int, extra text)
dblink_get_notify(text connname) returns setof (notify_name text, be_pid int, extra text)
```

## Description

`dblink_get_notify` retrieves notifications on either the unnamed connection, or on a named connection if specified. To receive notifications via dblink, `LISTEN` must first be issued, using `dblink_exec`. For details see [LISTEN](sql-listen.html "LISTEN") and [NOTIFY](sql-notify.html "NOTIFY").

## Arguments

*   *`connname`*

    The name of a named connection to get notifications on.

## Return Value

Returns `setof (notify_name text, be_pid int, extra text)`, or an empty set if none.

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

***

|                                                       |                                                                          |                                                             |
| :---------------------------------------------------- | :----------------------------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](contrib-dblink-is-busy.html "dblink_is_busy")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-get-result.html "dblink_get_result") |
| dblink\_is\_busy                                      |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                         dblink\_get\_result |
