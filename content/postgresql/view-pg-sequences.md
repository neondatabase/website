<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 54.23. `pg_sequences`                 |                                             |                          |                                                       |                                                     |
| :---------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](view-pg-seclabels.html "54.22. pg_seclabels")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-settings.html "54.24. pg_settings") |

***

## 54.23. `pg_sequences` [#](#VIEW-PG-SEQUENCES)



The view `pg_sequences` provides access to useful information about each sequence in the database.

**Table 54.23. `pg_sequences` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`nspname`)Name of schema containing sequence                                                                                                                                                                         |
| `sequencename` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of sequence                                                                                                                                                                                                     |
| `sequenceowner` `name` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`rolname`)Name of sequence's owner                                                                                                                                                                                          |
| `data_type` `regtype` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)Data type of the sequence                                                                                                                                                                                                   |
| `start_value` `int8`Start value of the sequence                                                                                                                                                                                                                                                                        |
| `min_value` `int8`Minimum value of the sequence                                                                                                                                                                                                                                                                        |
| `max_value` `int8`Maximum value of the sequence                                                                                                                                                                                                                                                                        |
| `increment_by` `int8`Increment value of the sequence                                                                                                                                                                                                                                                                   |
| `cycle` `bool`Whether the sequence cycles                                                                                                                                                                                                                                                                              |
| `cache_size` `int8`Cache size of the sequence                                                                                                                                                                                                                                                                          |
| `last_value` `int8`The last sequence value written to disk. If caching is used, this value can be greater than the last value handed out from the sequence. Null if the sequence has not been read from yet. Also, if the current user does not have `USAGE` or `SELECT` privilege on the sequence, the value is null. |

***

|                                                       |                                                       |                                                     |
| :---------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](view-pg-seclabels.html "54.22. pg_seclabels")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-settings.html "54.24. pg_settings") |
| 54.22. `pg_seclabels`                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                54.24. `pg_settings` |
