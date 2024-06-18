[#id](#SQL-DROPUSERMAPPING)

## DROP USER MAPPING

DROP USER MAPPING — remove a user mapping for a foreign server

## Synopsis

```
DROP USER MAPPING [ IF EXISTS ] FOR { user_name | USER | CURRENT_ROLE | CURRENT_USER | PUBLIC } SERVER server_name
```

[#id](#id-1.9.3.144.5)

## Description

`DROP USER MAPPING` removes an existing user mapping from foreign server.

The owner of a foreign server can drop user mappings for that server for any user. Also, a user can drop a user mapping for their own user name if `USAGE` privilege on the server has been granted to the user.

[#id](#id-1.9.3.144.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the user mapping does not exist. A notice is issued in this case.

- _`user_name`_

  User name of the mapping. `CURRENT_ROLE`, `CURRENT_USER`, and `USER` match the name of the current user. `PUBLIC` is used to match all present and future user names in the system.

- _`server_name`_

  Server name of the user mapping.

[#id](#id-1.9.3.144.7)

## Examples

Drop a user mapping `bob`, server `foo` if it exists:

```
DROP USER MAPPING IF EXISTS FOR bob SERVER foo;
```

[#id](#id-1.9.3.144.8)

## Compatibility

`DROP USER MAPPING` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a PostgreSQL extension.

[#id](#id-1.9.3.144.9)

## See Also

[CREATE USER MAPPING](sql-createusermapping), [ALTER USER MAPPING](sql-alterusermapping)
