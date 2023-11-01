## 53.40. `pg_publication` [#](#CATALOG-PG-PUBLICATION)

The catalog `pg_publication` contains all publications created in the database. For more on publications see [Section 31.1](logical-replication-publication.html "31.1. Publication").

**Table 53.40. `pg_publication` Columns**

| Column TypeDescription                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                    |
| `pubname` `name`Name of the publication                                                                                                                                                      |
| `pubowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the publication                                                                          |
| `puballtables` `bool`If true, this publication automatically includes all tables in the database, including any that will be created in the future.                                          |
| `pubinsert` `bool`If true, [INSERT](sql-insert.html "INSERT") operations are replicated for tables in the publication.                                                                       |
| `pubupdate` `bool`If true, [UPDATE](sql-update.html "UPDATE") operations are replicated for tables in the publication.                                                                       |
| `pubdelete` `bool`If true, [DELETE](sql-delete.html "DELETE") operations are replicated for tables in the publication.                                                                       |
| `pubtruncate` `bool`If true, [TRUNCATE](sql-truncate.html "TRUNCATE") operations are replicated for tables in the publication.                                                               |
| `pubviaroot` `bool`If true, operations on a leaf partition are replicated using the identity and schema of its topmost partitioned ancestor mentioned in the publication instead of its own. |