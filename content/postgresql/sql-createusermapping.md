[#id](#SQL-CREATEUSERMAPPING)

## CREATE USER MAPPING

CREATE USER MAPPING — define a new mapping of a user to a foreign server

## Synopsis

```
CREATE USER MAPPING [ IF NOT EXISTS ] FOR { user_name | USER | CURRENT_ROLE | CURRENT_USER | PUBLIC }
    SERVER server_name
    [ OPTIONS ( option 'value' [ , ... ] ) ]
```

[#id](#id-1.9.3.96.5)

## Description

`CREATE USER MAPPING` defines a mapping of a user to a foreign server. A user mapping typically encapsulates connection information that a foreign-data wrapper uses together with the information encapsulated by a foreign server to access an external data resource.

The owner of a foreign server can create user mappings for that server for any user. Also, a user can create a user mapping for their own user name if `USAGE` privilege on the server has been granted to the user.

[#id](#id-1.9.3.96.6)

## Parameters

- `IF NOT EXISTS`

  Do not throw an error if a mapping of the given user to the given foreign server already exists. A notice is issued in this case. Note that there is no guarantee that the existing user mapping is anything like the one that would have been created.

- _`user_name`_

  The name of an existing user that is mapped to foreign server. `CURRENT_ROLE`, `CURRENT_USER`, and `USER` match the name of the current user. When `PUBLIC` is specified, a so-called public mapping is created that is used when no user-specific mapping is applicable.

- _`server_name`_

  The name of an existing server for which the user mapping is to be created.

- `OPTIONS ( option 'value' [, ... ] )`

  This clause specifies the options of the user mapping. The options typically define the actual user name and password of the mapping. Option names must be unique. The allowed option names and values are specific to the server's foreign-data wrapper.

[#id](#id-1.9.3.96.7)

## Examples

Create a user mapping for user `bob`, server `foo`:

```
CREATE USER MAPPING FOR bob SERVER foo OPTIONS (user 'bob', password 'secret');
```

[#id](#id-1.9.3.96.8)

## Compatibility

`CREATE USER MAPPING` conforms to ISO/IEC 9075-9 (SQL/MED).

[#id](#id-1.9.3.96.9)

## See Also

[ALTER USER MAPPING](sql-alterusermapping), [DROP USER MAPPING](sql-dropusermapping), [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper), [CREATE SERVER](sql-createserver)
