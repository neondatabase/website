<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         54.33. `pg_user`                        |                                             |                          |                                                       |                                                               |
| :-------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](view-pg-timezone-names.html "54.32. pg_timezone_names")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-user-mappings.html "54.34. pg_user_mappings") |

***

## 54.33. `pg_user` [#](#VIEW-PG-USER)

The view `pg_user` provides access to information about database users. This is simply a publicly readable view of [`pg_shadow`](view-pg-shadow.html "54.25. pg_shadow") that blanks out the password field.

**Table 54.33. `pg_user` Columns**

| Column TypeDescription                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `usename` `name`User name                                                                                                                                      |
| `usesysid` `oid`ID of this user                                                                                                                                |
| `usecreatedb` `bool`User can create databases                                                                                                                  |
| `usesuper` `bool`User is a superuser                                                                                                                           |
| `userepl` `bool`User can initiate streaming replication and put the system in and out of backup mode.                                                          |
| `usebypassrls` `bool`User bypasses every row-level security policy, see [Section 5.8](ddl-rowsecurity.html "5.8. Row Security Policies") for more information. |
| `passwd` `text`Not the password (always reads as `********`)                                                                                                   |
| `valuntil` `timestamptz`Password expiry time (only used for password authentication)                                                                           |
| `useconfig` `text[]`Session defaults for run-time configuration variables                                                                                      |

***

|                                                                 |                                                       |                                                               |
| :-------------------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](view-pg-timezone-names.html "54.32. pg_timezone_names")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-user-mappings.html "54.34. pg_user_mappings") |
| 54.32. `pg_timezone_names`                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                                     54.34. `pg_user_mappings` |
