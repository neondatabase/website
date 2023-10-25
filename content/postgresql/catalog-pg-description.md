<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               53.19. `pg_description`              |                                                   |                             |                                                       |                                                |
| :------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-depend.html "53.18. pg_depend")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-enum.html "53.20. pg_enum") |

***

## 53.19. `pg_description` [#](#CATALOG-PG-DESCRIPTION)

The catalog `pg_description` stores optional descriptions (comments) for each database object. Descriptions can be manipulated with the [`COMMENT`](sql-comment.html "COMMENT") command and viewed with psql's `\d` commands. Descriptions of many built-in system objects are provided in the initial contents of `pg_description`.

See also [`pg_shdescription`](catalog-pg-shdescription.html "53.49. pg_shdescription"), which performs a similar function for descriptions involving objects that are shared across a database cluster.

**Table 53.19. `pg_description` Columns**

| Column TypeDescription                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this description pertains to                                                                                          |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the system catalog this object appears in                                         |
| `objsubid` `int4`For a comment on a table column, this is the column number (the `objoid` and `classoid` refer to the table itself). For all other object types, this column is zero. |
| `description` `text`Arbitrary text that serves as the description of this object                                                                                                      |

***

|                                                    |                                                       |                                                |
| :------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-depend.html "53.18. pg_depend")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-enum.html "53.20. pg_enum") |
| 53.18. `pg_depend`                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                               53.20. `pg_enum` |
