<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    dblink\_cancel\_query                    |                                                                          |                                                      |                                                       |                                                         |
| :---------------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](contrib-dblink-get-result.html "dblink_get_result")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-get-pkey.html "dblink_get_pkey") |

***



## dblink\_cancel\_query

dblink\_cancel\_query — cancels any active query on the named connection

## Synopsis

```

dblink_cancel_query(text connname) returns text
```

## Description

`dblink_cancel_query` attempts to cancel any query that is in progress on the named connection. Note that this is not certain to succeed (since, for example, the remote query might already have finished). A cancel request simply improves the odds that the query will fail soon. You must still complete the normal query protocol, for example by calling `dblink_get_result`.

## Arguments

*   *`connname`*

    Name of the connection to use.

## Return Value

Returns `OK` if the cancel request has been sent, or the text of an error message on failure.

## Examples

```

SELECT dblink_cancel_query('dtest1');
```

***

|                                                             |                                                                          |                                                         |
| :---------------------------------------------------------- | :----------------------------------------------------------------------: | ------------------------------------------------------: |
| [Prev](contrib-dblink-get-result.html "dblink_get_result")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-get-pkey.html "dblink_get_pkey") |
| dblink\_get\_result                                         |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                       dblink\_get\_pkey |
