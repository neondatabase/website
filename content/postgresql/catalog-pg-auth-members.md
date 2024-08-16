[#id](#CATALOG-PG-AUTH-MEMBERS)

## 53.9. `pg_auth_members` [#](#CATALOG-PG-AUTH-MEMBERS)

The catalog `pg_auth_members` shows the membership relations between roles. Any non-circular set of relationships is allowed.

Because user identities are cluster-wide, `pg_auth_members` is shared across all databases of a cluster: there is only one copy of `pg_auth_members` per cluster, not one per database.

[#id](#id-1.10.4.11.5)

**Table 53.9. `pg_auth_members` Columns**

| Column TypeDescription                                                                                         |
| -------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                      |
| `roleid` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)ID of a role that has a member               |
| `member` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)ID of a role that is a member of `roleid`    |
| `grantor` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)ID of the role that granted this membership |
| `admin_option` `bool`True if `member` can grant membership in `roleid` to others                               |
| `inherit_option` `bool`True if the member automatically inherits the privileges of the granted role            |
| `set_option` `bool`True if the member can [`SET ROLE`](sql-set-role) to the granted role                       |
