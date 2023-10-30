## dblink\_disconnect

dblink\_disconnect — closes a persistent connection to a remote database

## Synopsis

```

dblink_disconnect() returns text
dblink_disconnect(text connname) returns text
```

## Description

`dblink_disconnect()` closes a connection previously opened by `dblink_connect()`. The form with no arguments closes an unnamed connection.

## Arguments

* *`connname`*

    The name of a named connection to be closed.

## Return Value

Returns status, which is always `OK` (since any error causes the function to throw an error instead of returning).

## Examples

```

SELECT dblink_disconnect();
 dblink_disconnect
-------------------
 OK
(1 row)

SELECT dblink_disconnect('myconn');
 dblink_disconnect
-------------------
 OK
(1 row)
```