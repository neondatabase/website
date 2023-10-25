<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 54.10. `pg_ident_file_mappings`                |                                             |                          |                                                       |                                                   |
| :------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](view-pg-hba-file-rules.html "54.9. pg_hba_file_rules")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-indexes.html "54.11. pg_indexes") |

***

## 54.10. `pg_ident_file_mappings` [#](#VIEW-PG-IDENT-FILE-MAPPINGS)

[]()

The view `pg_ident_file_mappings` provides a summary of the contents of the client user name mapping configuration file, [`pg_ident.conf`](auth-username-maps.html "21.2. User Name Maps"). A row appears in this view for each non-empty, non-comment line in the file, with annotations indicating whether the map could be applied successfully.

This view can be helpful for checking whether planned changes in the authentication configuration file will work, or for diagnosing a previous failure. Note that this view reports on the *current* contents of the file, not on what was last loaded by the server.

By default, the `pg_ident_file_mappings` view can be read only by superusers.

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

\


Usually, a row reflecting an incorrect entry will have values for only the `line_number` and `error` fields.

See [Chapter 21](client-authentication.html "Chapter 21. Client Authentication") for more information about client authentication configuration.

***

|                                                                |                                                       |                                                   |
| :------------------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------: |
| [Prev](view-pg-hba-file-rules.html "54.9. pg_hba_file_rules")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-indexes.html "54.11. pg_indexes") |
| 54.9. `pg_hba_file_rules`                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                               54.11. `pg_indexes` |
