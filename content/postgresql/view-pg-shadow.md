[#id](#VIEW-PG-SHADOW)

## 54.25. `pg_shadow` [#](#VIEW-PG-SHADOW)

The view `pg_shadow` exists for backwards compatibility: it emulates a catalog that existed in PostgreSQL before version 8.1. It shows properties of all roles that are marked as `rolcanlogin` in [`pg_authid`](catalog-pg-authid).

The name stems from the fact that this table should not be readable by the public since it contains passwords. [`pg_user`](view-pg-user) is a publicly readable view on `pg_shadow` that blanks out the password field.

[#id](#id-1.10.5.29.5)

**Table 54.25. `pg_shadow` Columns**

| Column TypeDescription                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `usename` `name` (references [`pg_authid`](catalog-pg-authid).`rolname`)User name                                                                   |
| `usesysid` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)ID of this user                                                                 |
| `usecreatedb` `bool`User can create databases                                                                                                       |
| `usesuper` `bool`User is a superuser                                                                                                                |
| `userepl` `bool`User can initiate streaming replication and put the system in and out of backup mode.                                               |
| `usebypassrls` `bool`User bypasses every row-level security policy, see [Section 5.8](ddl-rowsecurity) for more information.                        |
| `passwd` `text`Password (possibly encrypted); null if none. See [`pg_authid`](catalog-pg-authid) for details of how encrypted passwords are stored. |
| `valuntil` `timestamptz`Password expiry time (only used for password authentication)                                                                |
| `useconfig` `text[]`Session defaults for run-time configuration variables                                                                           |
