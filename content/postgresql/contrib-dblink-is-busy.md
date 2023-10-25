

|                       dblink\_is\_busy                      |                                                                          |                                                      |                                                       |                                                             |
| :---------------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](contrib-dblink-send-query.html "dblink_send_query")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-get-notify.html "dblink_get_notify") |

***

## dblink\_is\_busy

dblink\_is\_busy — checks if connection is busy with an async query

## Synopsis

```

dblink_is_busy(text connname) returns int
```

## Description

`dblink_is_busy` tests whether an async query is in progress.

## Arguments

* *`connname`*

    Name of the connection to check.

## Return Value

Returns 1 if connection is busy, 0 if it is not busy. If this function returns 0, it is guaranteed that `dblink_get_result` will not block.

## Examples

```

SELECT dblink_is_busy('dtest1');
```

***

|                                                             |                                                                          |                                                             |
| :---------------------------------------------------------- | :----------------------------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](contrib-dblink-send-query.html "dblink_send_query")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-get-notify.html "dblink_get_notify") |
| dblink\_send\_query                                         |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                         dblink\_get\_notify |
