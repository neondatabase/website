

|                           54.20. `pg_roles`                           |                                             |                          |                                                       |                                               |
| :-------------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](view-pg-replication-slots.html "54.19. pg_replication_slots")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-rules.html "54.21. pg_rules") |

***

## 54.20. `pg_roles` [#](#VIEW-PG-ROLES)

The view `pg_roles` provides access to information about database roles. This is simply a publicly readable view of [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid") that blanks out the password field.

**Table 54.20. `pg_roles` Columns**

| Column TypeDescription                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rolname` `name`Role name                                                                                                                                      |
| `rolsuper` `bool`Role has superuser privileges                                                                                                                 |
| `rolinherit` `bool`Role automatically inherits privileges of roles it is a member of                                                                           |
| `rolcreaterole` `bool`Role can create more roles                                                                                                               |
| `rolcreatedb` `bool`Role can create databases                                                                                                                  |
| `rolcanlogin` `bool`Role can log in. That is, this role can be given as the initial session authorization identifier                                           |
| `rolreplication` `bool`Role is a replication role. A replication role can initiate replication connections and create and drop replication slots.              |
| `rolconnlimit` `int4`For roles that can log in, this sets maximum number of concurrent connections this role can make. -1 means no limit.                      |
| `rolpassword` `text`Not the password (always reads as `********`)                                                                                              |
| `rolvaliduntil` `timestamptz`Password expiry time (only used for password authentication); null if no expiration                                               |
| `rolbypassrls` `bool`Role bypasses every row-level security policy, see [Section 5.8](ddl-rowsecurity.html "5.8. Row Security Policies") for more information. |
| `rolconfig` `text[]`Role-specific defaults for run-time configuration variables                                                                                |
| `oid` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)ID of role                                                               |

***

|                                                                       |                                                       |                                               |
| :-------------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------: |
| [Prev](view-pg-replication-slots.html "54.19. pg_replication_slots")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-rules.html "54.21. pg_rules") |
| 54.19. `pg_replication_slots`                                         | [Home](index.html "PostgreSQL 17devel Documentation") |                             54.21. `pg_rules` |
