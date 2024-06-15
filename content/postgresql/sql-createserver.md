[#id](#SQL-CREATESERVER)

## CREATE SERVER

CREATE SERVER — define a new foreign server

## Synopsis

```
CREATE SERVER [ IF NOT EXISTS ] server_name [ TYPE 'server_type' ] [ VERSION 'server_version' ]
    FOREIGN DATA WRAPPER fdw_name
    [ OPTIONS ( option 'value' [, ... ] ) ]
```

[#id](#id-1.9.3.82.5)

## Description

`CREATE SERVER` defines a new foreign server. The user who defines the server becomes its owner.

A foreign server typically encapsulates connection information that a foreign-data wrapper uses to access an external data resource. Additional user-specific connection information may be specified by means of user mappings.

The server name must be unique within the database.

Creating a server requires `USAGE` privilege on the foreign-data wrapper being used.

[#id](#id-1.9.3.82.6)

## Parameters

- `IF NOT EXISTS`

  Do not throw an error if a server with the same name already exists. A notice is issued in this case. Note that there is no guarantee that the existing server is anything like the one that would have been created.

- _`server_name`_

  The name of the foreign server to be created.

- _`server_type`_

  Optional server type, potentially useful to foreign-data wrappers.

- _`server_version`_

  Optional server version, potentially useful to foreign-data wrappers.

- _`fdw_name`_

  The name of the foreign-data wrapper that manages the server.

- `OPTIONS ( option 'value' [, ... ] )`

  This clause specifies the options for the server. The options typically define the connection details of the server, but the actual names and values are dependent on the server's foreign-data wrapper.

[#id](#id-1.9.3.82.7)

## Notes

When using the [dblink](dblink) module, a foreign server's name can be used as an argument of the [dblink_connect](contrib-dblink-connect) function to indicate the connection parameters. It is necessary to have the `USAGE` privilege on the foreign server to be able to use it in this way.

[#id](#id-1.9.3.82.8)

## Examples

Create a server `myserver` that uses the foreign-data wrapper `postgres_fdw`:

```
CREATE SERVER myserver FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'foo', dbname 'foodb', port '5432');
```

See [postgres_fdw](postgres-fdw) for more details.

[#id](#id-1.9.3.82.9)

## Compatibility

`CREATE SERVER` conforms to ISO/IEC 9075-9 (SQL/MED).

[#id](#id-1.9.3.82.10)

## See Also

[ALTER SERVER](sql-alterserver), [DROP SERVER](sql-dropserver), [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper), [CREATE FOREIGN TABLE](sql-createforeigntable), [CREATE USER MAPPING](sql-createusermapping)
