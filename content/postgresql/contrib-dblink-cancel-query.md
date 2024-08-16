[#id](#CONTRIB-DBLINK-CANCEL-QUERY)

## dblink_cancel_query

dblink_cancel_query — cancels any active query on the named connection

## Synopsis

```

dblink_cancel_query(text connname) returns text
```

[#id](#id-1.11.7.22.19.5)

## Description

`dblink_cancel_query` attempts to cancel any query that is in progress on the named connection. Note that this is not certain to succeed (since, for example, the remote query might already have finished). A cancel request simply improves the odds that the query will fail soon. You must still complete the normal query protocol, for example by calling `dblink_get_result`.

[#id](#id-1.11.7.22.19.6)

## Arguments

- _`connname`_

  Name of the connection to use.

[#id](#id-1.11.7.22.19.7)

## Return Value

Returns `OK` if the cancel request has been sent, or the text of an error message on failure.

[#id](#id-1.11.7.22.19.8)

## Examples

```

SELECT dblink_cancel_query('dtest1');
```
