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