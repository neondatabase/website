<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

| Appendix F. Additional Supplied Modules and Extensions |                                               |                       |                                                       |                                                                     |
| :----------------------------------------------------: | :-------------------------------------------- | :-------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
|    [Prev](release-prior.html "E.2. Prior Releases")    | [Up](appendixes.html "Part VIII. Appendixes") | Part VIII. Appendixes | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](adminpack.html "F.1. adminpack — pgAdmin support toolpack") |

***

## Appendix F. Additional Supplied Modules and Extensions

**Table of Contents**

*   *   [F.1. adminpack — pgAdmin support toolpack](adminpack.html)
    *   [F.2. amcheck — tools to verify table and index consistency](amcheck.html)

    <!---->

    *   *   [F.2.1. Functions](amcheck.html#AMCHECK-FUNCTIONS)
        *   [F.2.2. Optional *`heapallindexed`* Verification](amcheck.html#AMCHECK-OPTIONAL-HEAPALLINDEXED-VERIFICATION)
        *   [F.2.3. Using `amcheck` Effectively](amcheck.html#AMCHECK-USING-AMCHECK-EFFECTIVELY)
        *   [F.2.4. Repairing Corruption](amcheck.html#AMCHECK-REPAIRING-CORRUPTION)

*   [F.3. auth\_delay — pause on authentication failure](auth-delay.html)

    *   *   [F.3.1. Configuration Parameters](auth-delay.html#AUTH-DELAY-CONFIGURATION-PARAMETERS)
        *   [F.3.2. Author](auth-delay.html#AUTH-DELAY-AUTHOR)

*   [F.4. auto\_explain — log execution plans of slow queries](auto-explain.html)

    *   *   [F.4.1. Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
        *   [F.4.2. Example](auto-explain.html#AUTO-EXPLAIN-EXAMPLE)
        *   [F.4.3. Author](auto-explain.html#AUTO-EXPLAIN-AUTHOR)

*   [F.5. basebackup\_to\_shell — example "shell" pg\_basebackup module](basebackup-to-shell.html)

    *   *   [F.5.1. Configuration Parameters](basebackup-to-shell.html#BASEBACKUP-TO-SHELL-CONFIGURATION-PARAMETERS)
        *   [F.5.2. Author](basebackup-to-shell.html#BASEBACKUP-TO-SHELL-AUTHOR)

*   [F.6. basic\_archive — an example WAL archive module](basic-archive.html)

    *   *   [F.6.1. Configuration Parameters](basic-archive.html#BASIC-ARCHIVE-CONFIGURATION-PARAMETERS)
        *   [F.6.2. Notes](basic-archive.html#BASIC-ARCHIVE-NOTES)
        *   [F.6.3. Author](basic-archive.html#BASIC-ARCHIVE-AUTHOR)

*   [F.7. bloom — bloom filter index access method](bloom.html)

    *   *   [F.7.1. Parameters](bloom.html#BLOOM-PARAMETERS)
        *   [F.7.2. Examples](bloom.html#BLOOM-EXAMPLES)
        *   [F.7.3. Operator Class Interface](bloom.html#BLOOM-OPERATOR-CLASS-INTERFACE)
        *   [F.7.4. Limitations](bloom.html#BLOOM-LIMITATIONS)
        *   [F.7.5. Authors](bloom.html#BLOOM-AUTHORS)

*   [F.8. btree\_gin — GIN operator classes with B-tree behavior](btree-gin.html)

    *   *   [F.8.1. Example Usage](btree-gin.html#BTREE-GIN-EXAMPLE-USAGE)
        *   [F.8.2. Authors](btree-gin.html#BTREE-GIN-AUTHORS)

*   [F.9. btree\_gist — GiST operator classes with B-tree behavior](btree-gist.html)

    *   *   [F.9.1. Example Usage](btree-gist.html#BTREE-GIST-EXAMPLE-USAGE)
        *   [F.9.2. Authors](btree-gist.html#BTREE-GIST-AUTHORS)

*   [F.10. citext — a case-insensitive character string type](citext.html)

    *   *   [F.10.1. Rationale](citext.html#CITEXT-RATIONALE)
        *   [F.10.2. How to Use It](citext.html#CITEXT-HOW-TO-USE-IT)
        *   [F.10.3. String Comparison Behavior](citext.html#CITEXT-STRING-COMPARISON-BEHAVIOR)
        *   [F.10.4. Limitations](citext.html#CITEXT-LIMITATIONS)
        *   [F.10.5. Author](citext.html#CITEXT-AUTHOR)

*   [F.11. cube — a multi-dimensional cube data type](cube.html)

    *   *   [F.11.1. Syntax](cube.html#CUBE-SYNTAX)
        *   [F.11.2. Precision](cube.html#CUBE-PRECISION)
        *   [F.11.3. Usage](cube.html#CUBE-USAGE)
        *   [F.11.4. Defaults](cube.html#CUBE-DEFAULTS)
        *   [F.11.5. Notes](cube.html#CUBE-NOTES)
        *   [F.11.6. Credits](cube.html#CUBE-CREDITS)

*   [F.12. dblink — connect to other PostgreSQL databases](dblink.html)

    *   *   [dblink\_connect](contrib-dblink-connect.html) — opens a persistent connection to a remote database
        *   [dblink\_connect\_u](contrib-dblink-connect-u.html) — opens a persistent connection to a remote database, insecurely
        *   [dblink\_disconnect](contrib-dblink-disconnect.html) — closes a persistent connection to a remote database
        *   [dblink](contrib-dblink-function.html) — executes a query in a remote database
        *   [dblink\_exec](contrib-dblink-exec.html) — executes a command in a remote database
        *   [dblink\_open](contrib-dblink-open.html) — opens a cursor in a remote database
        *   [dblink\_fetch](contrib-dblink-fetch.html) — returns rows from an open cursor in a remote database
        *   [dblink\_close](contrib-dblink-close.html) — closes a cursor in a remote database
        *   [dblink\_get\_connections](contrib-dblink-get-connections.html) — returns the names of all open named dblink connections
        *   [dblink\_error\_message](contrib-dblink-error-message.html) — gets last error message on the named connection
        *   [dblink\_send\_query](contrib-dblink-send-query.html) — sends an async query to a remote database
        *   [dblink\_is\_busy](contrib-dblink-is-busy.html) — checks if connection is busy with an async query
        *   [dblink\_get\_notify](contrib-dblink-get-notify.html) — retrieve async notifications on a connection
        *   [dblink\_get\_result](contrib-dblink-get-result.html) — gets an async query result
        *   [dblink\_cancel\_query](contrib-dblink-cancel-query.html) — cancels any active query on the named connection
        *   [dblink\_get\_pkey](contrib-dblink-get-pkey.html) — returns the positions and field names of a relation's primary key fields
        *   [dblink\_build\_sql\_insert](contrib-dblink-build-sql-insert.html) — builds an INSERT statement using a local tuple, replacing the primary key field values with alternative supplied values
        *   [dblink\_build\_sql\_delete](contrib-dblink-build-sql-delete.html) — builds a DELETE statement using supplied values for primary key field values
        *   [dblink\_build\_sql\_update](contrib-dblink-build-sql-update.html) — builds an UPDATE statement using a local tuple, replacing the primary key field values with alternative supplied values

*   [F.13. dict\_int — example full-text search dictionary for integers](dict-int.html)

    *   *   [F.13.1. Configuration](dict-int.html#DICT-INT-CONFIG)
        *   [F.13.2. Usage](dict-int.html#DICT-INT-USAGE)

*   [F.14. dict\_xsyn — example synonym full-text search dictionary](dict-xsyn.html)

    *   *   [F.14.1. Configuration](dict-xsyn.html#DICT-XSYN-CONFIG)
        *   [F.14.2. Usage](dict-xsyn.html#DICT-XSYN-USAGE)

*   [F.15. earthdistance — calculate great-circle distances](earthdistance.html)

    *   *   [F.15.1. Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
        *   [F.15.2. Point-Based Earth Distances](earthdistance.html#EARTHDISTANCE-POINT-BASED)

*   *   [F.16. file\_fdw — access data files in the server's file system](file-fdw.html)
    *   [F.17. fuzzystrmatch — determine string similarities and distance](fuzzystrmatch.html)

    <!---->

    *   *   [F.17.1. Soundex](fuzzystrmatch.html#FUZZYSTRMATCH-SOUNDEX)
        *   [F.17.2. Daitch-Mokotoff Soundex](fuzzystrmatch.html#FUZZYSTRMATCH-DAITCH-MOKOTOFF)
        *   [F.17.3. Levenshtein](fuzzystrmatch.html#FUZZYSTRMATCH-LEVENSHTEIN)
        *   [F.17.4. Metaphone](fuzzystrmatch.html#FUZZYSTRMATCH-METAPHONE)
        *   [F.17.5. Double Metaphone](fuzzystrmatch.html#FUZZYSTRMATCH-DOUBLE-METAPHONE)

*   [F.18. hstore — hstore key/value datatype](hstore.html)

    *   *   [F.18.1. `hstore` External Representation](hstore.html#HSTORE-EXTERNAL-REP)
        *   [F.18.2. `hstore` Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
        *   [F.18.3. Indexes](hstore.html#HSTORE-INDEXES)
        *   [F.18.4. Examples](hstore.html#HSTORE-EXAMPLES)
        *   [F.18.5. Statistics](hstore.html#HSTORE-STATISTICS)
        *   [F.18.6. Compatibility](hstore.html#HSTORE-COMPATIBILITY)
        *   [F.18.7. Transforms](hstore.html#HSTORE-TRANSFORMS)
        *   [F.18.8. Authors](hstore.html#HSTORE-AUTHORS)

*   [F.19. intagg — integer aggregator and enumerator](intagg.html)

    *   *   [F.19.1. Functions](intagg.html#INTAGG-FUNCTIONS)
        *   [F.19.2. Sample Uses](intagg.html#INTAGG-SAMPLES)

*   [F.20. intarray — manipulate arrays of integers](intarray.html)

    *   *   [F.20.1. `intarray` Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
        *   [F.20.2. Index Support](intarray.html#INTARRAY-INDEX)
        *   [F.20.3. Example](intarray.html#INTARRAY-EXAMPLE)
        *   [F.20.4. Benchmark](intarray.html#INTARRAY-BENCHMARK)
        *   [F.20.5. Authors](intarray.html#INTARRAY-AUTHORS)

*   [F.21. isn — data types for international standard numbers (ISBN, EAN, UPC, etc.)](isn.html)

    *   *   [F.21.1. Data Types](isn.html#ISN-DATA-TYPES)
        *   [F.21.2. Casts](isn.html#ISN-CASTS)
        *   [F.21.3. Functions and Operators](isn.html#ISN-FUNCS-OPS)
        *   [F.21.4. Examples](isn.html#ISN-EXAMPLES)
        *   [F.21.5. Bibliography](isn.html#ISN-BIBLIOGRAPHY)
        *   [F.21.6. Author](isn.html#ISN-AUTHOR)

*   [F.22. lo — manage large objects](lo.html)

    *   *   [F.22.1. Rationale](lo.html#LO-RATIONALE)
        *   [F.22.2. How to Use It](lo.html#LO-HOW-TO-USE)
        *   [F.22.3. Limitations](lo.html#LO-LIMITATIONS)
        *   [F.22.4. Author](lo.html#LO-AUTHOR)

*   [F.23. ltree — hierarchical tree-like data type](ltree.html)

    *   *   [F.23.1. Definitions](ltree.html#LTREE-DEFINITIONS)
        *   [F.23.2. Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
        *   [F.23.3. Indexes](ltree.html#LTREE-INDEXES)
        *   [F.23.4. Example](ltree.html#LTREE-EXAMPLE)
        *   [F.23.5. Transforms](ltree.html#LTREE-TRANSFORMS)
        *   [F.23.6. Authors](ltree.html#LTREE-AUTHORS)

*   [F.24. pageinspect — low-level inspection of database pages](pageinspect.html)

    *   *   [F.24.1. General Functions](pageinspect.html#PAGEINSPECT-GENERAL-FUNCS)
        *   [F.24.2. Heap Functions](pageinspect.html#PAGEINSPECT-HEAP-FUNCS)
        *   [F.24.3. B-Tree Functions](pageinspect.html#PAGEINSPECT-B-TREE-FUNCS)
        *   [F.24.4. BRIN Functions](pageinspect.html#PAGEINSPECT-BRIN-FUNCS)
        *   [F.24.5. GIN Functions](pageinspect.html#PAGEINSPECT-GIN-FUNCS)
        *   [F.24.6. GiST Functions](pageinspect.html#PAGEINSPECT-GIST-FUNCS)
        *   [F.24.7. Hash Functions](pageinspect.html#PAGEINSPECT-HASH-FUNCS)

*   *   [F.25. passwordcheck — verify password strength](passwordcheck.html)
    *   [F.26. pg\_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache.html)

    <!---->

    *   *   [F.26.1. The `pg_buffercache` View](pgbuffercache.html#PGBUFFERCACHE-PG-BUFFERCACHE)
        *   [F.26.2. The `pg_buffercache_summary()` Function](pgbuffercache.html#PGBUFFERCACHE-SUMMARY)
        *   [F.26.3. The `pg_buffercache_usage_counts()` Function](pgbuffercache.html#PGBUFFERCACHE-USAGE-COUNTS)
        *   [F.26.4. Sample Output](pgbuffercache.html#PGBUFFERCACHE-SAMPLE-OUTPUT)
        *   [F.26.5. Authors](pgbuffercache.html#PGBUFFERCACHE-AUTHORS)

*   [F.27. pgcrypto — cryptographic functions](pgcrypto.html)

    *   *   [F.27.1. General Hashing Functions](pgcrypto.html#PGCRYPTO-GENERAL-HASHING-FUNCS)
        *   [F.27.2. Password Hashing Functions](pgcrypto.html#PGCRYPTO-PASSWORD-HASHING-FUNCS)
        *   [F.27.3. PGP Encryption Functions](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS)
        *   [F.27.4. Raw Encryption Functions](pgcrypto.html#PGCRYPTO-RAW-ENC-FUNCS)
        *   [F.27.5. Random-Data Functions](pgcrypto.html#PGCRYPTO-RANDOM-DATA-FUNCS)
        *   [F.27.6. Notes](pgcrypto.html#PGCRYPTO-NOTES)
        *   [F.27.7. Author](pgcrypto.html#PGCRYPTO-AUTHOR)

*   [F.28. pg\_freespacemap — examine the free space map](pgfreespacemap.html)

    *   *   [F.28.1. Functions](pgfreespacemap.html#PGFREESPACEMAP-FUNCS)
        *   [F.28.2. Sample Output](pgfreespacemap.html#PGFREESPACEMAP-SAMPLE-OUTPUT)
        *   [F.28.3. Author](pgfreespacemap.html#PGFREESPACEMAP-AUTHOR)

*   [F.29. pg\_prewarm — preload relation data into buffer caches](pgprewarm.html)

    *   *   [F.29.1. Functions](pgprewarm.html#PGPREWARM-FUNCS)
        *   [F.29.2. Configuration Parameters](pgprewarm.html#PGPREWARM-CONFIG-PARAMS)
        *   [F.29.3. Author](pgprewarm.html#PGPREWARM-AUTHOR)

*   [F.30. pgrowlocks — show a table's row locking information](pgrowlocks.html)

    *   *   [F.30.1. Overview](pgrowlocks.html#PGROWLOCKS-OVERVIEW)
        *   [F.30.2. Sample Output](pgrowlocks.html#PGROWLOCKS-SAMPLE-OUTPUT)
        *   [F.30.3. Author](pgrowlocks.html#PGROWLOCKS-AUTHOR)

*   [F.31. pg\_stat\_statements — track statistics of SQL planning and execution](pgstatstatements.html)

    *   *   [F.31.1. The `pg_stat_statements` View](pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS)
        *   [F.31.2. The `pg_stat_statements_info` View](pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS-INFO)
        *   [F.31.3. Functions](pgstatstatements.html#PGSTATSTATEMENTS-FUNCS)
        *   [F.31.4. Configuration Parameters](pgstatstatements.html#PGSTATSTATEMENTS-CONFIG-PARAMS)
        *   [F.31.5. Sample Output](pgstatstatements.html#PGSTATSTATEMENTS-SAMPLE-OUTPUT)
        *   [F.31.6. Authors](pgstatstatements.html#PGSTATSTATEMENTS-AUTHORS)

*   [F.32. pgstattuple — obtain tuple-level statistics](pgstattuple.html)

    *   *   [F.32.1. Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
        *   [F.32.2. Authors](pgstattuple.html#PGSTATTUPLE-AUTHORS)

*   [F.33. pg\_surgery — perform low-level surgery on relation data](pgsurgery.html)

    *   *   [F.33.1. Functions](pgsurgery.html#PGSURGERY-FUNCS)
        *   [F.33.2. Authors](pgsurgery.html#PGSURGERY-AUTHORS)

*   [F.34. pg\_trgm — support for similarity of text using trigram matching](pgtrgm.html)

    *   *   [F.34.1. Trigram (or Trigraph) Concepts](pgtrgm.html#PGTRGM-CONCEPTS)
        *   [F.34.2. Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
        *   [F.34.3. GUC Parameters](pgtrgm.html#PGTRGM-GUC)
        *   [F.34.4. Index Support](pgtrgm.html#PGTRGM-INDEX)
        *   [F.34.5. Text Search Integration](pgtrgm.html#PGTRGM-TEXT-SEARCH)
        *   [F.34.6. References](pgtrgm.html#PGTRGM-REFERENCES)
        *   [F.34.7. Authors](pgtrgm.html#PGTRGM-AUTHORS)

*   [F.35. pg\_visibility — visibility map information and utilities](pgvisibility.html)

    *   *   [F.35.1. Functions](pgvisibility.html#PGVISIBILITY-FUNCS)
        *   [F.35.2. Author](pgvisibility.html#PGVISIBILITY-AUTHOR)

*   [F.36. pg\_walinspect — low-level WAL inspection](pgwalinspect.html)

    *   *   [F.36.1. General Functions](pgwalinspect.html#PGWALINSPECT-FUNCS)
        *   [F.36.2. Author](pgwalinspect.html#PGWALINSPECT-AUTHOR)

*   [F.37. postgres\_fdw — access data stored in external PostgreSQL servers](postgres-fdw.html)

    *   *   [F.37.1. FDW Options of postgres\_fdw](postgres-fdw.html#POSTGRES-FDW-OPTIONS)
        *   [F.37.2. Functions](postgres-fdw.html#POSTGRES-FDW-FUNCTIONS)
        *   [F.37.3. Connection Management](postgres-fdw.html#POSTGRES-FDW-CONNECTION-MANAGEMENT)
        *   [F.37.4. Transaction Management](postgres-fdw.html#POSTGRES-FDW-TRANSACTION-MANAGEMENT)
        *   [F.37.5. Remote Query Optimization](postgres-fdw.html#POSTGRES-FDW-REMOTE-QUERY-OPTIMIZATION)
        *   [F.37.6. Remote Query Execution Environment](postgres-fdw.html#POSTGRES-FDW-REMOTE-QUERY-EXECUTION-ENVIRONMENT)
        *   [F.37.7. Cross-Version Compatibility](postgres-fdw.html#POSTGRES-FDW-CROSS-VERSION-COMPATIBILITY)
        *   [F.37.8. Wait Events](postgres-fdw.html#POSTGRES-FDW-WAIT-EVENTS)
        *   [F.37.9. Configuration Parameters](postgres-fdw.html#POSTGRES-FDW-CONFIGURATION-PARAMETERS)
        *   [F.37.10. Examples](postgres-fdw.html#POSTGRES-FDW-EXAMPLES)
        *   [F.37.11. Author](postgres-fdw.html#POSTGRES-FDW-AUTHOR)

*   [F.38. seg — a datatype for line segments or floating point intervals](seg.html)

    *   *   [F.38.1. Rationale](seg.html#SEG-RATIONALE)
        *   [F.38.2. Syntax](seg.html#SEG-SYNTAX)
        *   [F.38.3. Precision](seg.html#SEG-PRECISION)
        *   [F.38.4. Usage](seg.html#SEG-USAGE)
        *   [F.38.5. Notes](seg.html#SEG-NOTES)
        *   [F.38.6. Credits](seg.html#SEG-CREDITS)

*   [F.39. sepgsql — SELinux-, label-based mandatory access control (MAC) security module](sepgsql.html)

    *   *   [F.39.1. Overview](sepgsql.html#SEPGSQL-OVERVIEW)
        *   [F.39.2. Installation](sepgsql.html#SEPGSQL-INSTALLATION)
        *   [F.39.3. Regression Tests](sepgsql.html#SEPGSQL-REGRESSION)
        *   [F.39.4. GUC Parameters](sepgsql.html#SEPGSQL-PARAMETERS)
        *   [F.39.5. Features](sepgsql.html#SEPGSQL-FEATURES)
        *   [F.39.6. Sepgsql Functions](sepgsql.html#SEPGSQL-FUNCTIONS)
        *   [F.39.7. Limitations](sepgsql.html#SEPGSQL-LIMITATIONS)
        *   [F.39.8. External Resources](sepgsql.html#SEPGSQL-RESOURCES)
        *   [F.39.9. Author](sepgsql.html#SEPGSQL-AUTHOR)

*   [F.40. spi — Server Programming Interface features/examples](contrib-spi.html)

    *   *   [F.40.1. refint — Functions for Implementing Referential Integrity](contrib-spi.html#CONTRIB-SPI-REFINT)
        *   [F.40.2. autoinc — Functions for Autoincrementing Fields](contrib-spi.html#CONTRIB-SPI-AUTOINC)
        *   [F.40.3. insert\_username — Functions for Tracking Who Changed a Table](contrib-spi.html#CONTRIB-SPI-INSERT-USERNAME)
        *   [F.40.4. moddatetime — Functions for Tracking Last Modification Time](contrib-spi.html#CONTRIB-SPI-MODDATETIME)

*   [F.41. sslinfo — obtain client SSL information](sslinfo.html)

    *   *   [F.41.1. Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
        *   [F.41.2. Author](sslinfo.html#SSLINFO-AUTHOR)

*   [F.42. tablefunc — functions that return tables (`crosstab` and others)](tablefunc.html)

    *   *   [F.42.1. Functions Provided](tablefunc.html#TABLEFUNC-FUNCTIONS-SECT)
        *   [F.42.2. Author](tablefunc.html#TABLEFUNC-AUTHOR)

*   *   [F.43. tcn — a trigger function to notify listeners of changes to table content](tcn.html)
    *   [F.44. test\_decoding — SQL-based test/example module for WAL logical decoding](test-decoding.html)
    *   [F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE`](tsm-system-rows.html)

    <!---->

    *   [F.45.1. Examples](tsm-system-rows.html#TSM-SYSTEM-ROWS-EXAMPLES)

*   [F.46. tsm\_system\_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE`](tsm-system-time.html)

    *   [F.46.1. Examples](tsm-system-time.html#TSM-SYSTEM-TIME-EXAMPLES)

*   [F.47. unaccent — a text search dictionary which removes diacritics](unaccent.html)

    *   *   [F.47.1. Configuration](unaccent.html#UNACCENT-CONFIGURATION)
        *   [F.47.2. Usage](unaccent.html#UNACCENT-USAGE)
        *   [F.47.3. Functions](unaccent.html#UNACCENT-FUNCTIONS)

*   [F.48. uuid-ossp — a UUID generator](uuid-ossp.html)

    *   *   [F.48.1. `uuid-ossp` Functions](uuid-ossp.html#UUID-OSSP-FUNCTIONS-SECT)
        *   [F.48.2. Building `uuid-ossp`](uuid-ossp.html#UUID-OSSP-BUILDING)
        *   [F.48.3. Author](uuid-ossp.html#UUID-OSSP-AUTHOR)

*   [F.49. xml2 — XPath querying and XSLT functionality](xml2.html)

    *   *   [F.49.1. Deprecation Notice](xml2.html#XML2-DEPRECATION)
        *   [F.49.2. Description of Functions](xml2.html#XML2-FUNCTIONS)
        *   [F.49.3. `xpath_table`](xml2.html#XML2-XPATH-TABLE)
        *   [F.49.4. XSLT Functions](xml2.html#XML2-XSLT)
        *   [F.49.5. Author](xml2.html#XML2-AUTHOR)

This appendix and the next one contain information on the optional components found in the `contrib` directory of the PostgreSQL distribution. These include porting tools, analysis utilities, and plug-in features that are not part of the core PostgreSQL system. They are separate mainly because they address a limited audience or are too experimental to be part of the main source tree. This does not preclude their usefulness.

This appendix covers extensions and other server plug-in module libraries found in `contrib`. [Appendix G](contrib-prog.html "Appendix G. Additional Supplied Programs") covers utility programs.

When building from the source distribution, these optional components are not built automatically, unless you build the "world" target (see [Step 2](install-make.html#BUILD "Build")). You can build and install all of them by running:

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

Many components supply new user-defined functions, operators, or types, packaged as *extensions*. To make use of one of these extensions, after you have installed the code you need to register the new SQL objects in the database system. This is done by executing a [CREATE EXTENSION](sql-createextension.html "CREATE EXTENSION") command. In a fresh database, you can simply do

```

CREATE EXTENSION extension_name;
```

This command registers the new SQL objects in the current database only, so you need to run it in every database in which you want the extension's facilities to be available. Alternatively, run it in database `template1` so that the extension will be copied into subsequently-created databases by default.

For all extensions, the `CREATE EXTENSION` command must be run by a database superuser, unless the extension is considered “trusted”. Trusted extensions can be run by any user who has `CREATE` privilege on the current database. Extensions that are trusted are identified as such in the sections that follow. Generally, trusted extensions are ones that cannot provide access to outside-the-database functionality.

The following extensions are trusted in a default installation:

|                                                                                                |                                                                                                        |                                                                                                    |                                                                                                                     |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [btree\_gin](btree-gin.html "F.8. btree_gin — GIN operator classes with B-tree behavior")      | [fuzzystrmatch](fuzzystrmatch.html "F.17. fuzzystrmatch — determine string similarities and distance") | [ltree](ltree.html "F.23. ltree — hierarchical tree-like data type")                               | [tcn](tcn.html "F.43. tcn — a trigger function to notify listeners of changes to table content")                    |
| [btree\_gist](btree-gist.html "F.9. btree_gist — GiST operator classes with B-tree behavior")  | [hstore](hstore.html "F.18. hstore — hstore key/value datatype")                                       | [pgcrypto](pgcrypto.html "F.27. pgcrypto — cryptographic functions")                               | [tsm\_system\_rows](tsm-system-rows.html "F.45. tsm_system_rows — the SYSTEM_ROWS sampling method for TABLESAMPLE") |
| [citext](citext.html "F.10. citext — a case-insensitive character string type")                | [intarray](intarray.html "F.20. intarray — manipulate arrays of integers")                             | [pg\_trgm](pgtrgm.html "F.34. pg_trgm — support for similarity of text using trigram matching")    | [tsm\_system\_time](tsm-system-time.html "F.46. tsm_system_time — the SYSTEM_TIME sampling method for TABLESAMPLE") |
| [cube](cube.html "F.11. cube — a multi-dimensional cube data type")                            | [isn](isn.html "F.21. isn — data types for international standard numbers (ISBN, EAN, UPC, etc.)")     | [seg](seg.html "F.38. seg — a datatype for line segments or floating point intervals")             | [unaccent](unaccent.html "F.47. unaccent — a text search dictionary which removes diacritics")                      |
| [dict\_int](dict-int.html "F.13. dict_int — example full-text search dictionary for integers") | [lo](lo.html "F.22. lo — manage large objects")                                                        | [tablefunc](tablefunc.html "F.42. tablefunc — functions that return tables (crosstab and others)") | [uuid-ossp](uuid-ossp.html "F.48. uuid-ossp — a UUID generator")                                                    |

Many extensions allow you to install their objects in a schema of your choice. To do that, add `SCHEMA schema_name` to the `CREATE EXTENSION` command. By default, the objects will be placed in your current creation target schema, which in turn defaults to `public`.

Note, however, that some of these components are not “extensions” in this sense, but are loaded into the server in some other way, for instance by way of [shared\_preload\_libraries](runtime-config-client.html#GUC-SHARED-PRELOAD-LIBRARIES). See the documentation of each component for details.

***

|                                                   |                                                       |                                                                     |
| :------------------------------------------------ | :---------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](release-prior.html "E.2. Prior Releases")  |     [Up](appendixes.html "Part VIII. Appendixes")     |  [Next](adminpack.html "F.1. adminpack — pgAdmin support toolpack") |
| E.2. Prior Releases                               | [Home](index.html "PostgreSQL 17devel Documentation") |                           F.1. adminpack — pgAdmin support toolpack |
