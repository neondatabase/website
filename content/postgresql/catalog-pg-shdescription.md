## 53.49. `pg_shdescription` [#](#CATALOG-PG-SHDESCRIPTION)

The catalog `pg_shdescription` stores optional descriptions (comments) for shared database objects. Descriptions can be manipulated with the [`COMMENT`](sql-comment "COMMENT") command and viewed with psql's `\d` commands.

See also [`pg_description`](catalog-pg-description "53.19. pg_description"), which performs a similar function for descriptions involving objects within a single database.

Unlike most system catalogs, `pg_shdescription` is shared across all databases of a cluster: there is only one copy of `pg_shdescription` per cluster, not one per database.

**Table 53.49. `pg_shdescription` Columns**

| Column TypeDescription                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this description pertains to                                                  |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class "53.11. pg_class").`oid`)The OID of the system catalog this object appears in |
| `description` `text`Arbitrary text that serves as the description of this object                                                              |