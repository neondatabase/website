[#id](#VIEW-PG-GROUP)

## 54.8. `pg_group` [#](#VIEW-PG-GROUP)

The view `pg_group` exists for backwards compatibility: it emulates a catalog that existed in PostgreSQL before version 8.1. It shows the names and members of all roles that are marked as not `rolcanlogin`, which is an approximation to the set of roles that are being used as groups.

[#id](#id-1.10.5.12.4)

**Table 54.8. `pg_group` Columns**

| Column TypeDescription                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------- |
| `groname` `name` (references [`pg_authid`](catalog-pg-authid).`rolname`)Name of the group                                   |
| `grosysid` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)ID of this group                                        |
| `grolist` `oid[]` (references [`pg_authid`](catalog-pg-authid).`oid`)An array containing the IDs of the roles in this group |
