[#id](#VIEW-PG-HBA-FILE-RULES)

## 54.9. `pg_hba_file_rules` [#](#VIEW-PG-HBA-FILE-RULES)

The view `pg_hba_file_rules` provides a summary of the contents of the client authentication configuration file, [`pg_hba.conf`](auth-pg-hba-conf). A row appears in this view for each non-empty, non-comment line in the file, with annotations indicating whether the rule could be applied successfully.

This view can be helpful for checking whether planned changes in the authentication configuration file will work, or for diagnosing a previous failure. Note that this view reports on the _current_ contents of the file, not on what was last loaded by the server.

By default, the `pg_hba_file_rules` view can be read only by superusers.

[#id](#id-1.10.5.13.6)

**Table 54.9. `pg_hba_file_rules` Columns**

| Column TypeDescription                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rule_number` `int4`Number of this rule, if valid, otherwise `NULL`. This indicates the order in which each rule is considered until a match is found during authentication. |
| `file_name` `text`Name of the file containing this rule                                                                                                                      |
| `line_number` `int4`Line number of this rule in `file_name`                                                                                                                  |
| `type` `text`Type of connection                                                                                                                                              |
| `database` `text[]`List of database name(s) to which this rule applies                                                                                                       |
| `user_name` `text[]`List of user and group name(s) to which this rule applies                                                                                                |
| `address` `text`Host name or IP address, or one of `all`, `samehost`, or `samenet`, or null for local connections                                                            |
| `netmask` `text`IP address mask, or null if not applicable                                                                                                                   |
| `auth_method` `text`Authentication method                                                                                                                                    |
| `options` `text[]`Options specified for authentication method, if any                                                                                                        |
| `error` `text`If not null, an error message indicating why this line could not be processed                                                                                  |

Usually, a row reflecting an incorrect entry will have values for only the `line_number` and `error` fields.

See [Chapter 21](client-authentication) for more information about client authentication configuration.
