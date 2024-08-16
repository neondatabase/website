[#id](#VIEW-PG-PUBLICATION-TABLES)

## 54.17. `pg_publication_tables` [#](#VIEW-PG-PUBLICATION-TABLES)

The view `pg_publication_tables` provides information about the mapping between publications and information of tables they contain. Unlike the underlying catalog [`pg_publication_rel`](catalog-pg-publication-rel), this view expands publications defined as [`FOR ALL TABLES`](sql-createpublication#SQL-CREATEPUBLICATION-FOR-ALL-TABLES) and [`FOR TABLES IN SCHEMA`](sql-createpublication#SQL-CREATEPUBLICATION-FOR-TABLES-IN-SCHEMA), so for such publications there will be a row for each eligible table.

[#id](#id-1.10.5.21.4)

**Table 54.17. `pg_publication_tables` Columns**

| Column TypeDescription                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pubname` `name` (references [`pg_publication`](catalog-pg-publication).`pubname`)Name of publication                                                                                                                                       |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing table                                                                                                                            |
| `tablename` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of table                                                                                                                                                       |
| `attnames` `name[]` (references [`pg_attribute`](catalog-pg-attribute).`attname`)Names of table columns included in the publication. This contains all the columns of the table when the user didn't specify the column list for the table. |
| `rowfilter` `text`Expression for the table's publication qualifying condition                                                                                                                                                               |
