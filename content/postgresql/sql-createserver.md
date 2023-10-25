<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    CREATE SERVER                   |                                        |              |                                                       |                                                        |
| :------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](sql-createsequence.html "CREATE SEQUENCE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createstatistics.html "CREATE STATISTICS") |

***

[]()

## CREATE SERVER

CREATE SERVER — define a new foreign server

## Synopsis

```

CREATE SERVER [ IF NOT EXISTS ] server_name [ TYPE 'server_type' ] [ VERSION 'server_version' ]
    FOREIGN DATA WRAPPER fdw_name
    [ OPTIONS ( option 'value' [, ... ] ) ]
```

## Description

`CREATE SERVER` defines a new foreign server. The user who defines the server becomes its owner.

A foreign server typically encapsulates connection information that a foreign-data wrapper uses to access an external data resource. Additional user-specific connection information may be specified by means of user mappings.

The server name must be unique within the database.

Creating a server requires `USAGE` privilege on the foreign-data wrapper being used.

## Parameters

*   `IF NOT EXISTS`

    Do not throw an error if a server with the same name already exists. A notice is issued in this case. Note that there is no guarantee that the existing server is anything like the one that would have been created.

*   *`server_name`*

    The name of the foreign server to be created.

*   *`server_type`*

    Optional server type, potentially useful to foreign-data wrappers.

*   *`server_version`*

    Optional server version, potentially useful to foreign-data wrappers.

*   *`fdw_name`*

    The name of the foreign-data wrapper that manages the server.

*   `OPTIONS ( option 'value' [, ... ] )`

    This clause specifies the options for the server. The options typically define the connection details of the server, but the actual names and values are dependent on the server's foreign-data wrapper.

## Notes

When using the [dblink](dblink.html "F.12. dblink — connect to other PostgreSQL databases") module, a foreign server's name can be used as an argument of the [dblink\_connect](contrib-dblink-connect.html "dblink_connect") function to indicate the connection parameters. It is necessary to have the `USAGE` privilege on the foreign server to be able to use it in this way.

If the foreign server supports sort pushdown, it is necessary for it to have the same sort ordering as the local server.

## Examples

Create a server `myserver` that uses the foreign-data wrapper `postgres_fdw`:

```

CREATE SERVER myserver FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'foo', dbname 'foodb', port '5432');
```

See [postgres\_fdw](postgres-fdw.html "F.37. postgres_fdw — access data stored in external PostgreSQL servers") for more details.

## Compatibility

`CREATE SERVER` conforms to ISO/IEC 9075-9 (SQL/MED).

## See Also

[ALTER SERVER](sql-alterserver.html "ALTER SERVER"), [DROP SERVER](sql-dropserver.html "DROP SERVER"), [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper.html "CREATE FOREIGN DATA WRAPPER"), [CREATE FOREIGN TABLE](sql-createforeigntable.html "CREATE FOREIGN TABLE"), [CREATE USER MAPPING](sql-createusermapping.html "CREATE USER MAPPING")

***

|                                                    |                                                       |                                                        |
| :------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------: |
| [Prev](sql-createsequence.html "CREATE SEQUENCE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createstatistics.html "CREATE STATISTICS") |
| CREATE SEQUENCE                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                      CREATE STATISTICS |
