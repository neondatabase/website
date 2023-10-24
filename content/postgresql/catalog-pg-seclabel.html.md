<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 53.46. `pg_seclabel`                 |                                                   |                             |                                                       |                                                        |
| :--------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](catalog-pg-rewrite.html "53.45. pg_rewrite")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-sequence.html "53.47. pg_sequence") |

***

## 53.46. `pg_seclabel` [#](#CATALOG-PG-SECLABEL)

[]()

The catalog `pg_seclabel` stores security labels on database objects. Security labels can be manipulated with the [`SECURITY LABEL`](sql-security-label.html "SECURITY LABEL") command. For an easier way to view security labels, see [Section 54.22](view-pg-seclabels.html "54.22. pg_seclabels").

See also [`pg_shseclabel`](catalog-pg-shseclabel.html "53.50. pg_shseclabel"), which performs a similar function for security labels of database objects that are shared across a database cluster.

**Table 53.46. `pg_seclabel` Columns**

| Column TypeDescription                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this security label pertains to                                                                                              |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the system catalog this object appears in                                                |
| `objsubid` `int4`For a security label on a table column, this is the column number (the `objoid` and `classoid` refer to the table itself). For all other object types, this column is zero. |
| `provider` `text`The label provider associated with this label.                                                                                                                              |
| `label` `text`The security label applied to this object.                                                                                                                                     |

***

|                                                      |                                                       |                                                        |
| :--------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------: |
| [Prev](catalog-pg-rewrite.html "53.45. pg_rewrite")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-sequence.html "53.47. pg_sequence") |
| 53.45. `pg_rewrite`                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                   53.47. `pg_sequence` |
