<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             54.22. `pg_seclabels`             |                                             |                          |                                                       |                                                       |
| :-------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](view-pg-rules.html "54.21. pg_rules")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-sequences.html "54.23. pg_sequences") |

***

## 54.22. `pg_seclabels` [#](#VIEW-PG-SECLABELS)



The view `pg_seclabels` provides information about security labels. It as an easier-to-query version of the [`pg_seclabel`](catalog-pg-seclabel.html "53.46. pg_seclabel") catalog.

**Table 54.22. `pg_seclabels` Columns**

| Column TypeDescription                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `objoid` `oid` (references any OID column)The OID of the object this security label pertains to                                                                                              |
| `classoid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the system catalog this object appears in                                                |
| `objsubid` `int4`For a security label on a table column, this is the column number (the `objoid` and `classoid` refer to the table itself). For all other object types, this column is zero. |
| `objtype` `text`The type of object to which this label applies, as text.                                                                                                                     |
| `objnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace for this object, if applicable; otherwise NULL.            |
| `objname` `text`The name of the object to which this label applies, as text.                                                                                                                 |
| `provider` `text` (references [`pg_seclabel`](catalog-pg-seclabel.html "53.46. pg_seclabel").`provider`)The label provider associated with this label.                                       |
| `label` `text` (references [`pg_seclabel`](catalog-pg-seclabel.html "53.46. pg_seclabel").`label`)The security label applied to this object.                                                 |

***

|                                               |                                                       |                                                       |
| :-------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](view-pg-rules.html "54.21. pg_rules")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-sequences.html "54.23. pg_sequences") |
| 54.21. `pg_rules`                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                 54.23. `pg_sequences` |
