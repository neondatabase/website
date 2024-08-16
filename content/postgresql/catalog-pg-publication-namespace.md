[#id](#CATALOG-PG-PUBLICATION-NAMESPACE)

## 53.41. `pg_publication_namespace` [#](#CATALOG-PG-PUBLICATION-NAMESPACE)

The catalog `pg_publication_namespace` contains the mapping between schemas and publications in the database. This is a many-to-many mapping.

[#id](#id-1.10.4.43.4)

**Table 53.41. `pg_publication_namespace` Columns**

| Column TypeDescription                                                                                |
| ----------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                             |
| `pnpubid` `oid` (references [`pg_publication`](catalog-pg-publication).`oid`)Reference to publication |
| `pnnspid` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)Reference to schema          |
