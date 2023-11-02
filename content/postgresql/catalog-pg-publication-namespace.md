## 53.41. `pg_publication_namespace` [#](#CATALOG-PG-PUBLICATION-NAMESPACE)

The catalog `pg_publication_namespace` contains the mapping between schemas and publications in the database. This is a many-to-many mapping.

**Table 53.41. `pg_publication_namespace` Columns**

| Column TypeDescription                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                          |
| `pnpubid` `oid` (references [`pg_publication`](catalog-pg-publication "53.40. pg_publication").`oid`)Reference to publication |
| `pnnspid` `oid` (references [`pg_namespace`](catalog-pg-namespace "53.32. pg_namespace").`oid`)Reference to schema            |