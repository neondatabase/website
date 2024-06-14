[#id](#VIEW-PG-SECLABELS)

## 54.22. `pg_seclabels` [#](#VIEW-PG-SECLABELS)

The view `pg_seclabels` provides information about security labels. It as an easier-to-query version of the [`pg_seclabel`](catalog-pg-seclabel) catalog.

[#id](#id-1.10.5.26.4)

**Table 54.22. `pg_seclabels` Columns**

| Column TypeDescription                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this security label pertains to                                                                                              |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The OID of the system catalog this object appears in                                                                       |
| `objsubid` `int4`For a security label on a table column, this is the column number (the `objoid` and `classoid` refer to the table itself). For all other object types, this column is zero. |
| `objtype` `text`The type of object to which this label applies, as text.                                                                                                                     |
| `objnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace for this object, if applicable; otherwise NULL.                                       |
| `objname` `text`The name of the object to which this label applies, as text.                                                                                                                 |
| `provider` `text` (references [`pg_seclabel`](catalog-pg-seclabel).`provider`)The label provider associated with this label.                                                                 |
| `label` `text` (references [`pg_seclabel`](catalog-pg-seclabel).`label`)The security label applied to this object.                                                                           |
