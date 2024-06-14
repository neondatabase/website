[#id](#CATALOG-PG-PUBLICATION-REL)

## 53.42. `pg_publication_rel` [#](#CATALOG-PG-PUBLICATION-REL)

The catalog `pg_publication_rel` contains the mapping between relations and publications in the database. This is a many-to-many mapping. See also [Section 54.17](view-pg-publication-tables) for a more user-friendly view of this information.

[#id](#id-1.10.4.44.4)

**Table 53.42. `pg_publication_rel` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                                                               |
| `prpubid` `oid` (references [`pg_publication`](catalog-pg-publication).`oid`)Reference to publication                                                                                                                                                                                                                                   |
| `prrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)Reference to relation                                                                                                                                                                                                                                                  |
| `prqual` `pg_node_tree`Expression tree (in `nodeToString()` representation) for the relation's publication qualifying condition. Null if there is no publication qualifying condition.                                                                                                                                                  |
| `prattrs` `int2vector` (references [`pg_attribute`](catalog-pg-attribute).`attnum`)This is an array of values that indicates which table columns are part of the publication. For example, a value of `1 3` would mean that the first and the third table columns are published. A null value indicates that all columns are published. |
