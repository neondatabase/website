<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   dblink\_connect\_u                  |                                                                          |                                                      |                                                       |                                                             |
| :---------------------------------------------------: | :----------------------------------------------------------------------- | :--------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](contrib-dblink-connect.html "dblink_connect")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") | F.12. dblink — connect to other PostgreSQL databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-disconnect.html "dblink_disconnect") |

***

## dblink\_connect\_u

dblink\_connect\_u — opens a persistent connection to a remote database, insecurely

## Synopsis

```

dblink_connect_u(text connstr) returns text
dblink_connect_u(text connname, text connstr) returns text
```

## Description

`dblink_connect_u()` is identical to `dblink_connect()`, except that it will allow non-superusers to connect using any authentication method.

If the remote server selects an authentication method that does not involve a password, then impersonation and subsequent escalation of privileges can occur, because the session will appear to have originated from the user as which the local PostgreSQL server runs. Also, even if the remote server does demand a password, it is possible for the password to be supplied from the server environment, such as a `~/.pgpass` file belonging to the server's user. This opens not only a risk of impersonation, but the possibility of exposing a password to an untrustworthy remote server. Therefore, `dblink_connect_u()` is initially installed with all privileges revoked from `PUBLIC`, making it un-callable except by superusers. In some situations it may be appropriate to grant `EXECUTE` permission for `dblink_connect_u()` to specific users who are considered trustworthy, but this should be done with care. It is also recommended that any `~/.pgpass` file belonging to the server's user *not* contain any records specifying a wildcard host name.

For further details see `dblink_connect()`.

***

|                                                       |                                                                          |                                                             |
| :---------------------------------------------------- | :----------------------------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](contrib-dblink-connect.html "dblink_connect")  | [Up](dblink.html "F.12. dblink — connect to other PostgreSQL databases") |  [Next](contrib-dblink-disconnect.html "dblink_disconnect") |
| dblink\_connect                                       |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                          dblink\_disconnect |
