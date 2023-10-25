<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       54.8. `pg_group`                       |                                             |                          |                                                       |                                                                |
| :----------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](view-pg-file-settings.html "54.7. pg_file_settings")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-hba-file-rules.html "54.9. pg_hba_file_rules") |

***

## 54.8. `pg_group` [#](#VIEW-PG-GROUP)



The view `pg_group` exists for backwards compatibility: it emulates a catalog that existed in PostgreSQL before version 8.1. It shows the names and members of all roles that are marked as not `rolcanlogin`, which is an approximation to the set of roles that are being used as groups.

**Table 54.8. `pg_group` Columns**

| Column TypeDescription                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `groname` `name` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`rolname`)Name of the group                                   |
| `grosysid` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)ID of this group                                        |
| `grolist` `oid[]` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)An array containing the IDs of the roles in this group |

***

|                                                              |                                                       |                                                                |
| :----------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](view-pg-file-settings.html "54.7. pg_file_settings")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-hba-file-rules.html "54.9. pg_hba_file_rules") |
| 54.7. `pg_file_settings`                                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                      54.9. `pg_hba_file_rules` |
