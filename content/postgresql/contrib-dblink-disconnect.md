[#id](#CONTRIB-DBLINK-DISCONNECT)

## dblink_disconnect

dblink_disconnect — closes a persistent connection to a remote database

## Synopsis

```

dblink_disconnect() returns text
dblink_disconnect(text connname) returns text
```

[#id](#id-1.11.7.22.7.5)

## Description

`dblink_disconnect()` closes a connection previously opened by `dblink_connect()`. The form with no arguments closes an unnamed connection.

[#id](#id-1.11.7.22.7.6)

## Arguments

- _`connname`_

  The name of a named connection to be closed.

[#id](#id-1.11.7.22.7.7)

## Return Value

Returns status, which is always `OK` (since any error causes the function to throw an error instead of returning).

[#id](#id-1.11.7.22.7.8)

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
