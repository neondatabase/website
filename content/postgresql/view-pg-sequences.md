[#id](#VIEW-PG-SEQUENCES)

## 54.23. `pg_sequences` [#](#VIEW-PG-SEQUENCES)

The view `pg_sequences` provides access to useful information about each sequence in the database.

[#id](#id-1.10.5.27.4)

**Table 54.23. `pg_sequences` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing sequence                                                                                                                                                                                                    |
| `sequencename` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of sequence                                                                                                                                                                                                                            |
| `sequenceowner` `name` (references [`pg_authid`](catalog-pg-authid).`rolname`)Name of sequence's owner                                                                                                                                                                                                                 |
| `data_type` `regtype` (references [`pg_type`](catalog-pg-type).`oid`)Data type of the sequence                                                                                                                                                                                                                         |
| `start_value` `int8`Start value of the sequence                                                                                                                                                                                                                                                                        |
| `min_value` `int8`Minimum value of the sequence                                                                                                                                                                                                                                                                        |
| `max_value` `int8`Maximum value of the sequence                                                                                                                                                                                                                                                                        |
| `increment_by` `int8`Increment value of the sequence                                                                                                                                                                                                                                                                   |
| `cycle` `bool`Whether the sequence cycles                                                                                                                                                                                                                                                                              |
| `cache_size` `int8`Cache size of the sequence                                                                                                                                                                                                                                                                          |
| `last_value` `int8`The last sequence value written to disk. If caching is used, this value can be greater than the last value handed out from the sequence. Null if the sequence has not been read from yet. Also, if the current user does not have `USAGE` or `SELECT` privilege on the sequence, the value is null. |
