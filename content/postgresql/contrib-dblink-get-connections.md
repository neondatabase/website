<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              dblink\_get\_connections             |                                                                          |                                                      |                                                       |                                                                   |
| :-----------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](contrib-dblink-close.html "dblink_close")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-error-message.html "dblink_error_message") |

***

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

***

|                                                   |                                                                          |                                                                   |
| :------------------------------------------------ | :----------------------------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](contrib-dblink-close.html "dblink_close")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-error-message.html "dblink_error_message") |
| dblink\_close                                     |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                            dblink\_error\_message |
