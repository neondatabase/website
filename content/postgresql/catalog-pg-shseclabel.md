[#id](#CATALOG-PG-SHSECLABEL)

## 53.50. `pg_shseclabel` [#](#CATALOG-PG-SHSECLABEL)

The catalog `pg_shseclabel` stores security labels on shared database objects. Security labels can be manipulated with the [`SECURITY LABEL`](sql-security-label) command. For an easier way to view security labels, see [Section 54.22](view-pg-seclabels).

See also [`pg_seclabel`](catalog-pg-seclabel), which performs a similar function for security labels involving objects within a single database.

Unlike most system catalogs, `pg_shseclabel` is shared across all databases of a cluster: there is only one copy of `pg_shseclabel` per cluster, not one per database.

[#id](#id-1.10.4.52.6)

**Table 53.50. `pg_shseclabel` Columns**

| Column TypeDescription                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this security label pertains to                        |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The OID of the system catalog this object appears in |
| `provider` `text`The label provider associated with this label.                                                        |
| `label` `text`The security label applied to this object.                                                               |
