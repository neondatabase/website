[#id](#VIEW-PG-IDENT-FILE-MAPPINGS)

## 54.10. `pg_ident_file_mappings` [#](#VIEW-PG-IDENT-FILE-MAPPINGS)

The view `pg_ident_file_mappings` provides a summary of the contents of the client user name mapping configuration file, [`pg_ident.conf`](auth-username-maps). A row appears in this view for each non-empty, non-comment line in the file, with annotations indicating whether the map could be applied successfully.

This view can be helpful for checking whether planned changes in the authentication configuration file will work, or for diagnosing a previous failure. Note that this view reports on the _current_ contents of the file, not on what was last loaded by the server.

By default, the `pg_ident_file_mappings` view can be read only by superusers.

[#id](#id-1.10.5.14.6)

**Table 54.10. `pg_ident_file_mappings` Columns**

| Column TypeDescription                                                                        |
| --------------------------------------------------------------------------------------------- |
| `map_number` `int4`Number of this map, in priority order, if valid, otherwise `NULL`          |
| `file_name` `text`Name of the file containing this map                                        |
| `line_number` `int4`Line number of this map in `file_name`                                    |
| `map_name` `text`Name of the map                                                              |
| `sys_name` `text`Detected user name of the client                                             |
| `pg_username` `text`Requested PostgreSQL user name                                            |
| `error` `text`If not `NULL`, an error message indicating why this line could not be processed |

Usually, a row reflecting an incorrect entry will have values for only the `line_number` and `error` fields.

See [Chapter 21](client-authentication) for more information about client authentication configuration.
