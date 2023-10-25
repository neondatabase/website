

|          54.34. `pg_user_mappings`          |                                             |                          |                                                       |                                               |
| :-----------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](view-pg-user.html "54.33. pg_user")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-views.html "54.35. pg_views") |

***

## 54.34. `pg_user_mappings` [#](#VIEW-PG-USER-MAPPINGS)

The view `pg_user_mappings` provides access to information about user mappings. This is essentially a publicly readable view of [`pg_user_mapping`](catalog-pg-user-mapping.html "53.65. pg_user_mapping") that leaves out the options field if the user has no rights to use it.

**Table 54.34. `pg_user_mappings` Columns**

| Column TypeDescription                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `umid` `oid` (references [`pg_user_mapping`](catalog-pg-user-mapping.html "53.65. pg_user_mapping").`oid`)OID of the user mapping                                         |
| `srvid` `oid` (references [`pg_foreign_server`](catalog-pg-foreign-server.html "53.24. pg_foreign_server").`oid`)The OID of the foreign server that contains this mapping |
| `srvname` `name` (references [`pg_foreign_server`](catalog-pg-foreign-server.html "53.24. pg_foreign_server").`srvname`)Name of the foreign server                        |
| `umuser` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)OID of the local role being mapped, or zero if the user mapping is public        |
| `usename` `name`Name of the local user to be mapped                                                                                                                       |
| `umoptions` `text[]`User mapping specific options, as “keyword=value” strings                                                                                             |

\

To protect password information stored as a user mapping option, the `umoptions` column will read as null unless one of the following applies:

* current user is the user being mapped, and owns the server or holds `USAGE` privilege on it
* current user is the server owner and mapping is for `PUBLIC`
* current user is a superuser

***

|                                             |                                                       |                                               |
| :------------------------------------------ | :---------------------------------------------------: | --------------------------------------------: |
| [Prev](view-pg-user.html "54.33. pg_user")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-views.html "54.35. pg_views") |
| 54.33. `pg_user`                            | [Home](index.html "PostgreSQL 17devel Documentation") |                             54.35. `pg_views` |
