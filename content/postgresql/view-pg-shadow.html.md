<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  54.25. `pg_shadow`                 |                                             |                          |                                                       |                                                                       |
| :-------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](view-pg-settings.html "54.24. pg_settings")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-shmem-allocations.html "54.26. pg_shmem_allocations") |

***

## 54.25. `pg_shadow` [#](#VIEW-PG-SHADOW)

[]()

The view `pg_shadow` exists for backwards compatibility: it emulates a catalog that existed in PostgreSQL before version 8.1. It shows properties of all roles that are marked as `rolcanlogin` in [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").

The name stems from the fact that this table should not be readable by the public since it contains passwords. [`pg_user`](view-pg-user.html "54.33. pg_user") is a publicly readable view on `pg_shadow` that blanks out the password field.

**Table 54.25. `pg_shadow` Columns**

| Column TypeDescription                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `usename` `name` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`rolname`)User name                                                                   |
| `usesysid` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)ID of this user                                                                 |
| `usecreatedb` `bool`User can create databases                                                                                                                              |
| `usesuper` `bool`User is a superuser                                                                                                                                       |
| `userepl` `bool`User can initiate streaming replication and put the system in and out of backup mode.                                                                      |
| `usebypassrls` `bool`User bypasses every row-level security policy, see [Section 5.8](ddl-rowsecurity.html "5.8. Row Security Policies") for more information.             |
| `passwd` `text`Password (possibly encrypted); null if none. See [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid") for details of how encrypted passwords are stored. |
| `valuntil` `timestamptz`Password expiry time (only used for password authentication)                                                                                       |
| `useconfig` `text[]`Session defaults for run-time configuration variables                                                                                                  |

***

|                                                     |                                                       |                                                                       |
| :-------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](view-pg-settings.html "54.24. pg_settings")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-shmem-allocations.html "54.26. pg_shmem_allocations") |
| 54.24. `pg_settings`                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                         54.26. `pg_shmem_allocations` |
