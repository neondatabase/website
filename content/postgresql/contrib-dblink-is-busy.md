[#id](#CONTRIB-DBLINK-IS-BUSY)

## dblink_is_busy

dblink_is_busy — checks if connection is busy with an async query

## Synopsis

```

dblink_is_busy(text connname) returns int
```

[#id](#id-1.11.7.22.16.5)

## Description

`dblink_is_busy` tests whether an async query is in progress.

[#id](#id-1.11.7.22.16.6)

## Arguments

- _`connname`_

  Name of the connection to check.

[#id](#id-1.11.7.22.16.7)

## Return Value

Returns 1 if connection is busy, 0 if it is not busy. If this function returns 0, it is guaranteed that `dblink_get_result` will not block.

[#id](#id-1.11.7.22.16.8)

## Examples

```

SELECT dblink_is_busy('dtest1');
```
