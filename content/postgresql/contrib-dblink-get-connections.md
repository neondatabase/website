[#id](#CONTRIB-DBLINK-GET-CONNECTIONS)

## dblink_get_connections

dblink_get_connections — returns the names of all open named dblink connections

## Synopsis

```

dblink_get_connections() returns text[]
```

[#id](#id-1.11.7.22.13.5)

## Description

`dblink_get_connections` returns an array of the names of all open named `dblink` connections.

[#id](#id-1.11.7.22.13.6)

## Return Value

Returns a text array of connection names, or NULL if none.

[#id](#id-1.11.7.22.13.7)

## Examples

```

SELECT dblink_get_connections();
```
