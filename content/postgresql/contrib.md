[#id](#CONTRIB)

## Appendix F. Additional Supplied Modules and Extensions

**Table of Contents**

- [F.1. adminpack — pgAdmin support toolpack](adminpack)
- [F.2. amcheck — tools to verify table and index consistency](amcheck)

  - [F.2.1. Functions](amcheck#AMCHECK-FUNCTIONS)
  - [F.2.2. Optional _`heapallindexed`_ Verification](amcheck#AMCHECK-OPTIONAL-HEAPALLINDEXED-VERIFICATION)
  - [F.2.3. Using `amcheck` Effectively](amcheck#AMCHECK-USING-AMCHECK-EFFECTIVELY)
  - [F.2.4. Repairing Corruption](amcheck#AMCHECK-REPAIRING-CORRUPTION)

- [F.3. auth_delay — pause on authentication failure](auth-delay)

  - [F.3.1. Configuration Parameters](auth-delay#AUTH-DELAY-CONFIGURATION-PARAMETERS)
  - [F.3.2. Author](auth-delay#AUTH-DELAY-AUTHOR)

- [F.4. auto_explain — log execution plans of slow queries](auto-explain)

  - [F.4.1. Configuration Parameters](auto-explain#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  - [F.4.2. Example](auto-explain#AUTO-EXPLAIN-EXAMPLE)
  - [F.4.3. Author](auto-explain#AUTO-EXPLAIN-AUTHOR)

- [F.5. basebackup_to_shell — example "shell" pg_basebackup module](basebackup-to-shell)

  - [F.5.1. Configuration Parameters](basebackup-to-shell#BASEBACKUP-TO-SHELL-CONFIGURATION-PARAMETERS)
  - [F.5.2. Author](basebackup-to-shell#BASEBACKUP-TO-SHELL-AUTHOR)

- [F.6. basic_archive — an example WAL archive module](basic-archive)

  - [F.6.1. Configuration Parameters](basic-archive#BASIC-ARCHIVE-CONFIGURATION-PARAMETERS)
  - [F.6.2. Notes](basic-archive#BASIC-ARCHIVE-NOTES)
  - [F.6.3. Author](basic-archive#BASIC-ARCHIVE-AUTHOR)

- [F.7. bloom — bloom filter index access method](bloom)

  - [F.7.1. Parameters](bloom#BLOOM-PARAMETERS)
  - [F.7.2. Examples](bloom#BLOOM-EXAMPLES)
  - [F.7.3. Operator Class Interface](bloom#BLOOM-OPERATOR-CLASS-INTERFACE)
  - [F.7.4. Limitations](bloom#BLOOM-LIMITATIONS)
  - [F.7.5. Authors](bloom#BLOOM-AUTHORS)

- [F.8. btree_gin — GIN operator classes with B-tree behavior](btree-gin)

  - [F.8.1. Example Usage](btree-gin#BTREE-GIN-EXAMPLE-USAGE)
  - [F.8.2. Authors](btree-gin#BTREE-GIN-AUTHORS)

- [F.9. btree_gist — GiST operator classes with B-tree behavior](btree-gist)

  - [F.9.1. Example Usage](btree-gist#BTREE-GIST-EXAMPLE-USAGE)
  - [F.9.2. Authors](btree-gist#BTREE-GIST-AUTHORS)

- [F.10. citext — a case-insensitive character string type](citext)

  - [F.10.1. Rationale](citext#CITEXT-RATIONALE)
  - [F.10.2. How to Use It](citext#CITEXT-HOW-TO-USE-IT)
  - [F.10.3. String Comparison Behavior](citext#CITEXT-STRING-COMPARISON-BEHAVIOR)
  - [F.10.4. Limitations](citext#CITEXT-LIMITATIONS)
  - [F.10.5. Author](citext#CITEXT-AUTHOR)

- [F.11. cube — a multi-dimensional cube data type](cube)

  - [F.11.1. Syntax](cube#CUBE-SYNTAX)
  - [F.11.2. Precision](cube#CUBE-PRECISION)
  - [F.11.3. Usage](cube#CUBE-USAGE)
  - [F.11.4. Defaults](cube#CUBE-DEFAULTS)
  - [F.11.5. Notes](cube#CUBE-NOTES)
  - [F.11.6. Credits](cube#CUBE-CREDITS)

- [F.12. dblink — connect to other PostgreSQL databases](dblink)

  - [dblink_connect](contrib-dblink-connect) — opens a persistent connection to a remote database
  - [dblink_connect_u](contrib-dblink-connect-u) — opens a persistent connection to a remote database, insecurely
  - [dblink_disconnect](contrib-dblink-disconnect) — closes a persistent connection to a remote database
  - [dblink](contrib-dblink-function) — executes a query in a remote database
  - [dblink_exec](contrib-dblink-exec) — executes a command in a remote database
  - [dblink_open](contrib-dblink-open) — opens a cursor in a remote database
  - [dblink_fetch](contrib-dblink-fetch) — returns rows from an open cursor in a remote database
  - [dblink_close](contrib-dblink-close) — closes a cursor in a remote database
  - [dblink_get_connections](contrib-dblink-get-connections) — returns the names of all open named dblink connections
  - [dblink_error_message](contrib-dblink-error-message) — gets last error message on the named connection
  - [dblink_send_query](contrib-dblink-send-query) — sends an async query to a remote database
  - [dblink_is_busy](contrib-dblink-is-busy) — checks if connection is busy with an async query
  - [dblink_get_notify](contrib-dblink-get-notify) — retrieve async notifications on a connection
  - [dblink_get_result](contrib-dblink-get-result) — gets an async query result
  - [dblink_cancel_query](contrib-dblink-cancel-query) — cancels any active query on the named connection
  - [dblink_get_pkey](contrib-dblink-get-pkey) — returns the positions and field names of a relation's primary key fields
  - [dblink_build_sql_insert](contrib-dblink-build-sql-insert) — builds an INSERT statement using a local tuple, replacing the primary key field values with alternative supplied values
  - [dblink_build_sql_delete](contrib-dblink-build-sql-delete) — builds a DELETE statement using supplied values for primary key field values
  - [dblink_build_sql_update](contrib-dblink-build-sql-update) — builds an UPDATE statement using a local tuple, replacing the primary key field values with alternative supplied values

- [F.13. dict_int — example full-text search dictionary for integers](dict-int)

  - [F.13.1. Configuration](dict-int#DICT-INT-CONFIG)
  - [F.13.2. Usage](dict-int#DICT-INT-USAGE)

- [F.14. dict_xsyn — example synonym full-text search dictionary](dict-xsyn)

  - [F.14.1. Configuration](dict-xsyn#DICT-XSYN-CONFIG)
  - [F.14.2. Usage](dict-xsyn#DICT-XSYN-USAGE)

- [F.15. earthdistance — calculate great-circle distances](earthdistance)

  - [F.15.1. Cube-Based Earth Distances](earthdistance#EARTHDISTANCE-CUBE-BASED)
  - [F.15.2. Point-Based Earth Distances](earthdistance#EARTHDISTANCE-POINT-BASED)

  - [F.16. file_fdw — access data files in the server's file system](file-fdw)
  - [F.17. fuzzystrmatch — determine string similarities and distance](fuzzystrmatch)

    - [F.17.1. Soundex](fuzzystrmatch#FUZZYSTRMATCH-SOUNDEX)
    - [F.17.2. Daitch-Mokotoff Soundex](fuzzystrmatch#FUZZYSTRMATCH-DAITCH-MOKOTOFF)
    - [F.17.3. Levenshtein](fuzzystrmatch#FUZZYSTRMATCH-LEVENSHTEIN)
    - [F.17.4. Metaphone](fuzzystrmatch#FUZZYSTRMATCH-METAPHONE)
    - [F.17.5. Double Metaphone](fuzzystrmatch#FUZZYSTRMATCH-DOUBLE-METAPHONE)

- [F.18. hstore — hstore key/value datatype](hstore)

  - [F.18.1. `hstore` External Representation](hstore#HSTORE-EXTERNAL-REP)
  - [F.18.2. `hstore` Operators and Functions](hstore#HSTORE-OPS-FUNCS)
  - [F.18.3. Indexes](hstore#HSTORE-INDEXES)
  - [F.18.4. Examples](hstore#HSTORE-EXAMPLES)
  - [F.18.5. Statistics](hstore#HSTORE-STATISTICS)
  - [F.18.6. Compatibility](hstore#HSTORE-COMPATIBILITY)
  - [F.18.7. Transforms](hstore#HSTORE-TRANSFORMS)
  - [F.18.8. Authors](hstore#HSTORE-AUTHORS)

- [F.19. intagg — integer aggregator and enumerator](intagg)

  - [F.19.1. Functions](intagg#INTAGG-FUNCTIONS)
  - [F.19.2. Sample Uses](intagg#INTAGG-SAMPLES)

- [F.20. intarray — manipulate arrays of integers](intarray)

  - [F.20.1. `intarray` Functions and Operators](intarray#INTARRAY-FUNCS-OPS)
  - [F.20.2. Index Support](intarray#INTARRAY-INDEX)
  - [F.20.3. Example](intarray#INTARRAY-EXAMPLE)
  - [F.20.4. Benchmark](intarray#INTARRAY-BENCHMARK)
  - [F.20.5. Authors](intarray#INTARRAY-AUTHORS)

- [F.21. isn — data types for international standard numbers (ISBN, EAN, UPC, etc.)](isn)

  - [F.21.1. Data Types](isn#ISN-DATA-TYPES)
  - [F.21.2. Casts](isn#ISN-CASTS)
  - [F.21.3. Functions and Operators](isn#ISN-FUNCS-OPS)
  - [F.21.4. Examples](isn#ISN-EXAMPLES)
  - [F.21.5. Bibliography](isn#ISN-BIBLIOGRAPHY)
  - [F.21.6. Author](isn#ISN-AUTHOR)

- [F.22. lo — manage large objects](lo)

  - [F.22.1. Rationale](lo#LO-RATIONALE)
  - [F.22.2. How to Use It](lo#LO-HOW-TO-USE)
  - [F.22.3. Limitations](lo#LO-LIMITATIONS)
  - [F.22.4. Author](lo#LO-AUTHOR)

- [F.23. ltree — hierarchical tree-like data type](ltree)

  - [F.23.1. Definitions](ltree#LTREE-DEFINITIONS)
  - [F.23.2. Operators and Functions](ltree#LTREE-OPS-FUNCS)
  - [F.23.3. Indexes](ltree#LTREE-INDEXES)
  - [F.23.4. Example](ltree#LTREE-EXAMPLE)
  - [F.23.5. Transforms](ltree#LTREE-TRANSFORMS)
  - [F.23.6. Authors](ltree#LTREE-AUTHORS)

- [F.24. old_snapshot — inspect `old_snapshot_threshold` state](oldsnapshot)

  - [F.24.1. Functions](oldsnapshot#OLDSNAPSHOT-FUNCTIONS)

- [F.25. pageinspect — low-level inspection of database pages](pageinspect)

  - [F.25.1. General Functions](pageinspect#PAGEINSPECT-GENERAL-FUNCS)
  - [F.25.2. Heap Functions](pageinspect#PAGEINSPECT-HEAP-FUNCS)
  - [F.25.3. B-Tree Functions](pageinspect#PAGEINSPECT-B-TREE-FUNCS)
  - [F.25.4. BRIN Functions](pageinspect#PAGEINSPECT-BRIN-FUNCS)
  - [F.25.5. GIN Functions](pageinspect#PAGEINSPECT-GIN-FUNCS)
  - [F.25.6. GiST Functions](pageinspect#PAGEINSPECT-GIST-FUNCS)
  - [F.25.7. Hash Functions](pageinspect#PAGEINSPECT-HASH-FUNCS)

  - [F.26. passwordcheck — verify password strength](passwordcheck)
  - [F.27. pg_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache)

    - [F.27.1. The `pg_buffercache` View](pgbuffercache#PGBUFFERCACHE-PG-BUFFERCACHE)
    - [F.27.2. The `pg_buffercache_summary()` Function](pgbuffercache#PGBUFFERCACHE-SUMMARY)
    - [F.27.3. The `pg_buffercache_usage_counts()` Function](pgbuffercache#PGBUFFERCACHE-USAGE-COUNTS)
    - [F.27.4. Sample Output](pgbuffercache#PGBUFFERCACHE-SAMPLE-OUTPUT)
    - [F.27.5. Authors](pgbuffercache#PGBUFFERCACHE-AUTHORS)

- [F.28. pgcrypto — cryptographic functions](pgcrypto)

  - [F.28.1. General Hashing Functions](pgcrypto#PGCRYPTO-GENERAL-HASHING-FUNCS)
  - [F.28.2. Password Hashing Functions](pgcrypto#PGCRYPTO-PASSWORD-HASHING-FUNCS)
  - [F.28.3. PGP Encryption Functions](pgcrypto#PGCRYPTO-PGP-ENC-FUNCS)
  - [F.28.4. Raw Encryption Functions](pgcrypto#PGCRYPTO-RAW-ENC-FUNCS)
  - [F.28.5. Random-Data Functions](pgcrypto#PGCRYPTO-RANDOM-DATA-FUNCS)
  - [F.28.6. Notes](pgcrypto#PGCRYPTO-NOTES)
  - [F.28.7. Author](pgcrypto#PGCRYPTO-AUTHOR)

- [F.29. pg_freespacemap — examine the free space map](pgfreespacemap)

  - [F.29.1. Functions](pgfreespacemap#PGFREESPACEMAP-FUNCS)
  - [F.29.2. Sample Output](pgfreespacemap#PGFREESPACEMAP-SAMPLE-OUTPUT)
  - [F.29.3. Author](pgfreespacemap#PGFREESPACEMAP-AUTHOR)

- [F.30. pg_prewarm — preload relation data into buffer caches](pgprewarm)

  - [F.30.1. Functions](pgprewarm#PGPREWARM-FUNCS)
  - [F.30.2. Configuration Parameters](pgprewarm#PGPREWARM-CONFIG-PARAMS)
  - [F.30.3. Author](pgprewarm#PGPREWARM-AUTHOR)

- [F.31. pgrowlocks — show a table's row locking information](pgrowlocks)

  - [F.31.1. Overview](pgrowlocks#PGROWLOCKS-OVERVIEW)
  - [F.31.2. Sample Output](pgrowlocks#PGROWLOCKS-SAMPLE-OUTPUT)
  - [F.31.3. Author](pgrowlocks#PGROWLOCKS-AUTHOR)

- [F.32. pg_stat_statements — track statistics of SQL planning and execution](pgstatstatements)

  - [F.32.1. The `pg_stat_statements` View](pgstatstatements#PGSTATSTATEMENTS-PG-STAT-STATEMENTS)
  - [F.32.2. The `pg_stat_statements_info` View](pgstatstatements#PGSTATSTATEMENTS-PG-STAT-STATEMENTS-INFO)
  - [F.32.3. Functions](pgstatstatements#PGSTATSTATEMENTS-FUNCS)
  - [F.32.4. Configuration Parameters](pgstatstatements#PGSTATSTATEMENTS-CONFIG-PARAMS)
  - [F.32.5. Sample Output](pgstatstatements#PGSTATSTATEMENTS-SAMPLE-OUTPUT)
  - [F.32.6. Authors](pgstatstatements#PGSTATSTATEMENTS-AUTHORS)

- [F.33. pgstattuple — obtain tuple-level statistics](pgstattuple)

  - [F.33.1. Functions](pgstattuple#PGSTATTUPLE-FUNCS)
  - [F.33.2. Authors](pgstattuple#PGSTATTUPLE-AUTHORS)

- [F.34. pg_surgery — perform low-level surgery on relation data](pgsurgery)

  - [F.34.1. Functions](pgsurgery#PGSURGERY-FUNCS)
  - [F.34.2. Authors](pgsurgery#PGSURGERY-AUTHORS)

- [F.35. pg_trgm — support for similarity of text using trigram matching](pgtrgm)

  - [F.35.1. Trigram (or Trigraph) Concepts](pgtrgm#PGTRGM-CONCEPTS)
  - [F.35.2. Functions and Operators](pgtrgm#PGTRGM-FUNCS-OPS)
  - [F.35.3. GUC Parameters](pgtrgm#PGTRGM-GUC)
  - [F.35.4. Index Support](pgtrgm#PGTRGM-INDEX)
  - [F.35.5. Text Search Integration](pgtrgm#PGTRGM-TEXT-SEARCH)
  - [F.35.6. References](pgtrgm#PGTRGM-REFERENCES)
  - [F.35.7. Authors](pgtrgm#PGTRGM-AUTHORS)

- [F.36. pg_visibility — visibility map information and utilities](pgvisibility)

  - [F.36.1. Functions](pgvisibility#PGVISIBILITY-FUNCS)
  - [F.36.2. Author](pgvisibility#PGVISIBILITY-AUTHOR)

- [F.37. pg_walinspect — low-level WAL inspection](pgwalinspect)

  - [F.37.1. General Functions](pgwalinspect#PGWALINSPECT-FUNCS)
  - [F.37.2. Author](pgwalinspect#PGWALINSPECT-AUTHOR)

- [F.38. postgres_fdw — access data stored in external PostgreSQL servers](postgres-fdw)

  - [F.38.1. FDW Options of postgres_fdw](postgres-fdw#POSTGRES-FDW-OPTIONS)
  - [F.38.2. Functions](postgres-fdw#POSTGRES-FDW-FUNCTIONS)
  - [F.38.3. Connection Management](postgres-fdw#POSTGRES-FDW-CONNECTION-MANAGEMENT)
  - [F.38.4. Transaction Management](postgres-fdw#POSTGRES-FDW-TRANSACTION-MANAGEMENT)
  - [F.38.5. Remote Query Optimization](postgres-fdw#POSTGRES-FDW-REMOTE-QUERY-OPTIMIZATION)
  - [F.38.6. Remote Query Execution Environment](postgres-fdw#POSTGRES-FDW-REMOTE-QUERY-EXECUTION-ENVIRONMENT)
  - [F.38.7. Cross-Version Compatibility](postgres-fdw#POSTGRES-FDW-CROSS-VERSION-COMPATIBILITY)
  - [F.38.8. Configuration Parameters](postgres-fdw#POSTGRES-FDW-CONFIGURATION-PARAMETERS)
  - [F.38.9. Examples](postgres-fdw#POSTGRES-FDW-EXAMPLES)
  - [F.38.10. Author](postgres-fdw#POSTGRES-FDW-AUTHOR)

- [F.39. seg — a datatype for line segments or floating point intervals](seg)

  - [F.39.1. Rationale](seg#SEG-RATIONALE)
  - [F.39.2. Syntax](seg#SEG-SYNTAX)
  - [F.39.3. Precision](seg#SEG-PRECISION)
  - [F.39.4. Usage](seg#SEG-USAGE)
  - [F.39.5. Notes](seg#SEG-NOTES)
  - [F.39.6. Credits](seg#SEG-CREDITS)

- [F.40. sepgsql — SELinux-, label-based mandatory access control (MAC) security module](sepgsql)

  - [F.40.1. Overview](sepgsql#SEPGSQL-OVERVIEW)
  - [F.40.2. Installation](sepgsql#SEPGSQL-INSTALLATION)
  - [F.40.3. Regression Tests](sepgsql#SEPGSQL-REGRESSION)
  - [F.40.4. GUC Parameters](sepgsql#SEPGSQL-PARAMETERS)
  - [F.40.5. Features](sepgsql#SEPGSQL-FEATURES)
  - [F.40.6. Sepgsql Functions](sepgsql#SEPGSQL-FUNCTIONS)
  - [F.40.7. Limitations](sepgsql#SEPGSQL-LIMITATIONS)
  - [F.40.8. External Resources](sepgsql#SEPGSQL-RESOURCES)
  - [F.40.9. Author](sepgsql#SEPGSQL-AUTHOR)

- [F.41. spi — Server Programming Interface features/examples](contrib-spi)

  - [F.41.1. refint — Functions for Implementing Referential Integrity](contrib-spi#CONTRIB-SPI-REFINT)
  - [F.41.2. autoinc — Functions for Autoincrementing Fields](contrib-spi#CONTRIB-SPI-AUTOINC)
  - [F.41.3. insert_username — Functions for Tracking Who Changed a Table](contrib-spi#CONTRIB-SPI-INSERT-USERNAME)
  - [F.41.4. moddatetime — Functions for Tracking Last Modification Time](contrib-spi#CONTRIB-SPI-MODDATETIME)

- [F.42. sslinfo — obtain client SSL information](sslinfo)

  - [F.42.1. Functions Provided](sslinfo#SSLINFO-FUNCTIONS)
  - [F.42.2. Author](sslinfo#SSLINFO-AUTHOR)

- [F.43. tablefunc — functions that return tables (`crosstab` and others)](tablefunc)

  - [F.43.1. Functions Provided](tablefunc#TABLEFUNC-FUNCTIONS-SECT)
  - [F.43.2. Author](tablefunc#TABLEFUNC-AUTHOR)

  - [F.44. tcn — a trigger function to notify listeners of changes to table content](tcn)
  - [F.45. test_decoding — SQL-based test/example module for WAL logical decoding](test-decoding)
  - [F.46. tsm_system_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE`](tsm-system-rows)

  * [F.46.1. Examples](tsm-system-rows#TSM-SYSTEM-ROWS-EXAMPLES)

- [F.47. tsm_system_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE`](tsm-system-time)

  - [F.47.1. Examples](tsm-system-time#TSM-SYSTEM-TIME-EXAMPLES)

- [F.48. unaccent — a text search dictionary which removes diacritics](unaccent)

  - [F.48.1. Configuration](unaccent#UNACCENT-CONFIGURATION)
  - [F.48.2. Usage](unaccent#UNACCENT-USAGE)
  - [F.48.3. Functions](unaccent#UNACCENT-FUNCTIONS)

- [F.49. uuid-ossp — a UUID generator](uuid-ossp)

  - [F.49.1. `uuid-ossp` Functions](uuid-ossp#UUID-OSSP-FUNCTIONS-SECT)
  - [F.49.2. Building `uuid-ossp`](uuid-ossp#UUID-OSSP-BUILDING)
  - [F.49.3. Author](uuid-ossp#UUID-OSSP-AUTHOR)

- [F.50. xml2 — XPath querying and XSLT functionality](xml2)

  - [F.50.1. Deprecation Notice](xml2#XML2-DEPRECATION)
  - [F.50.2. Description of Functions](xml2#XML2-FUNCTIONS)
  - [F.50.3. `xpath_table`](xml2#XML2-XPATH-TABLE)
  - [F.50.4. XSLT Functions](xml2#XML2-XSLT)
  - [F.50.5. Author](xml2#XML2-AUTHOR)

This appendix and the next one contain information on the optional components found in the `contrib` directory of the PostgreSQL distribution. These include porting tools, analysis utilities, and plug-in features that are not part of the core PostgreSQL system. They are separate mainly because they address a limited audience or are too experimental to be part of the main source tree. This does not preclude their usefulness.

This appendix covers extensions and other server plug-in module libraries found in `contrib`. [Appendix G](contrib-prog) covers utility programs.

When building from the source distribution, these optional components are not built automatically, unless you build the "world" target (see [Step 2](install-make#BUILD)). You can build and install all of them by running:

```

make
make install
```

in the `contrib` directory of a configured source tree; or to build and install just one selected module, do the same in that module's subdirectory. Many of the modules have regression tests, which can be executed by running:

```

make check
```

before installation or

```

make installcheck
```

once you have a PostgreSQL server running.

If you are using a pre-packaged version of PostgreSQL, these components are typically made available as a separate subpackage, such as `postgresql-contrib`.

Many components supply new user-defined functions, operators, or types, packaged as _extensions_. To make use of one of these extensions, after you have installed the code you need to register the new SQL objects in the database system. This is done by executing a [CREATE EXTENSION](sql-createextension) command. In a fresh database, you can simply do

```

CREATE EXTENSION extension_name;
```

This command registers the new SQL objects in the current database only, so you need to run it in every database in which you want the extension's facilities to be available. Alternatively, run it in database `template1` so that the extension will be copied into subsequently-created databases by default.

For all extensions, the `CREATE EXTENSION` command must be run by a database superuser, unless the extension is considered “trusted”. Trusted extensions can be run by any user who has `CREATE` privilege on the current database. Extensions that are trusted are identified as such in the sections that follow. Generally, trusted extensions are ones that cannot provide access to outside-the-database functionality.

The following extensions are trusted in a default installation:

|                          |                                |                        |                                    |
| ------------------------ | ------------------------------ | ---------------------- | ---------------------------------- |
| [btree_gin](btree-gin)   | [fuzzystrmatch](fuzzystrmatch) | [ltree](ltree)         | [tcn](tcn)                         |
| [btree_gist](btree-gist) | [hstore](hstore)               | [pgcrypto](pgcrypto)   | [tsm_system_rows](tsm-system-rows) |
| [citext](citext)         | [intarray](intarray)           | [pg_trgm](pgtrgm)      | [tsm_system_time](tsm-system-time) |
| [cube](cube)             | [isn](isn)                     | [seg](seg)             | [unaccent](unaccent)               |
| [dict_int](dict-int)     | [lo](lo)                       | [tablefunc](tablefunc) | [uuid-ossp](uuid-ossp)             |

Many extensions allow you to install their objects in a schema of your choice. To do that, add `SCHEMA schema_name` to the `CREATE EXTENSION` command. By default, the objects will be placed in your current creation target schema, which in turn defaults to `public`.

Note, however, that some of these components are not “extensions” in this sense, but are loaded into the server in some other way, for instance by way of [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES). See the documentation of each component for details.
