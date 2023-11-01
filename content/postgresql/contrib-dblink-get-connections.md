## dblink\_get\_connections

dblink\_get\_connections — returns the names of all open named dblink connections

## Synopsis

```

dblink_get_connections() returns text[]
```

## Description

`dblink_get_connections` returns an array of the names of all open named `dblink` connections.

## Return Value

Returns a text array of connection names, or NULL if none.

## Examples

```

SELECT dblink_get_connections();
```