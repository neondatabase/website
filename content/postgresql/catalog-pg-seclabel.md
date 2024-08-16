[#id](#CATALOG-PG-SECLABEL)

## 53.46. `pg_seclabel` [#](#CATALOG-PG-SECLABEL)

The catalog `pg_seclabel` stores security labels on database objects. Security labels can be manipulated with the [`SECURITY LABEL`](sql-security-label) command. For an easier way to view security labels, see [Section 54.22](view-pg-seclabels).

See also [`pg_shseclabel`](catalog-pg-shseclabel), which performs a similar function for security labels of database objects that are shared across a database cluster.

[#id](#id-1.10.4.48.5)

**Table 53.46. `pg_seclabel` Columns**

| Column TypeDescription                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this security label pertains to                                                                                              |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The OID of the system catalog this object appears in                                                                       |
| `objsubid` `int4`For a security label on a table column, this is the column number (the `objoid` and `classoid` refer to the table itself). For all other object types, this column is zero. |
| `provider` `text`The label provider associated with this label.                                                                                                                              |
| `label` `text`The security label applied to this object.                                                                                                                                     |
