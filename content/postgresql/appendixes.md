

|                               Part VIII. Appendixes                               |                                                     |                                  |                                                       |                                                                      |
| :-------------------------------------------------------------------------------: | :-------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](backup-manifest-wal-ranges.html "77.3. Backup Manifest WAL Range Object")  | [Up](index.html "PostgreSQL 17devel Documentation") | PostgreSQL 17devel Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](errcodes-appendix.html "Appendix A. PostgreSQL Error Codes") |

***

# Part VIII. Appendixes

**Table of Contents**

  * *   [A. PostgreSQL Error Codes](errcodes-appendix.html)
  * [B. Date/Time Support](datetime-appendix.html)

    

  * *   [B.1. Date/Time Input Interpretation](datetime-input-rules.html)
    * [B.2. Handling of Invalid or Ambiguous Timestamps](datetime-invalid-input.html)
    * [B.3. Date/Time Key Words](datetime-keywords.html)
    * [B.4. Date/Time Configuration Files](datetime-config-files.html)
    * [B.5. POSIX Time Zone Specifications](datetime-posix-timezone-specs.html)
    * [B.6. History of Units](datetime-units-history.html)
    * [B.7. Julian Dates](datetime-julian-dates.html)

  * *   [C. SQL Key Words](sql-keywords-appendix.html)
  * [D. SQL Conformance](features.html)

    

  * *   [D.1. Supported Features](features-sql-standard.html)
    * [D.2. Unsupported Features](unsupported-features-sql-standard.html)
    * [D.3. XML Limits and Conformance to SQL/XML](xml-limits-conformance.html)

* [E. Release Notes](release.html)

  * *   [E.1. Release 17](release-17.html)
    * [E.2. Prior Releases](release-prior.html)

* [F. Additional Supplied Modules and Extensions](contrib.html)

  * *   [F.1. adminpack — pgAdmin support toolpack](adminpack.html)
    * [F.2. amcheck — tools to verify table and index consistency](amcheck.html)
    * [F.3. auth\_delay — pause on authentication failure](auth-delay.html)
    * [F.4. auto\_explain — log execution plans of slow queries](auto-explain.html)
    * [F.5. basebackup\_to\_shell — example "shell" pg\_basebackup module](basebackup-to-shell.html)
    * [F.6. basic\_archive — an example WAL archive module](basic-archive.html)
    * [F.7. bloom — bloom filter index access method](bloom.html)
    * [F.8. btree\_gin — GIN operator classes with B-tree behavior](btree-gin.html)
    * [F.9. btree\_gist — GiST operator classes with B-tree behavior](btree-gist.html)
    * [F.10. citext — a case-insensitive character string type](citext.html)
    * [F.11. cube — a multi-dimensional cube data type](cube.html)
    * [F.12. dblink — connect to other PostgreSQL databases](dblink.html)
    * [F.13. dict\_int — example full-text search dictionary for integers](dict-int.html)
    * [F.14. dict\_xsyn — example synonym full-text search dictionary](dict-xsyn.html)
    * [F.15. earthdistance — calculate great-circle distances](earthdistance.html)
    * [F.16. file\_fdw — access data files in the server's file system](file-fdw.html)
    * [F.17. fuzzystrmatch — determine string similarities and distance](fuzzystrmatch.html)
    * [F.18. hstore — hstore key/value datatype](hstore.html)
    * [F.19. intagg — integer aggregator and enumerator](intagg.html)
    * [F.20. intarray — manipulate arrays of integers](intarray.html)
    * [F.21. isn — data types for international standard numbers (ISBN, EAN, UPC, etc.)](isn.html)
    * [F.22. lo — manage large objects](lo.html)
    * [F.23. ltree — hierarchical tree-like data type](ltree.html)
    * [F.24. pageinspect — low-level inspection of database pages](pageinspect.html)
    * [F.25. passwordcheck — verify password strength](passwordcheck.html)
    * [F.26. pg\_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache.html)
    * [F.27. pgcrypto — cryptographic functions](pgcrypto.html)
    * [F.28. pg\_freespacemap — examine the free space map](pgfreespacemap.html)
    * [F.29. pg\_prewarm — preload relation data into buffer caches](pgprewarm.html)
    * [F.30. pgrowlocks — show a table's row locking information](pgrowlocks.html)
    * [F.31. pg\_stat\_statements — track statistics of SQL planning and execution](pgstatstatements.html)
    * [F.32. pgstattuple — obtain tuple-level statistics](pgstattuple.html)
    * [F.33. pg\_surgery — perform low-level surgery on relation data](pgsurgery.html)
    * [F.34. pg\_trgm — support for similarity of text using trigram matching](pgtrgm.html)
    * [F.35. pg\_visibility — visibility map information and utilities](pgvisibility.html)
    * [F.36. pg\_walinspect — low-level WAL inspection](pgwalinspect.html)
    * [F.37. postgres\_fdw — access data stored in external PostgreSQL servers](postgres-fdw.html)
    * [F.38. seg — a datatype for line segments or floating point intervals](seg.html)
    * [F.39. sepgsql — SELinux-, label-based mandatory access control (MAC) security module](sepgsql.html)
    * [F.40. spi — Server Programming Interface features/examples](contrib-spi.html)
    * [F.41. sslinfo — obtain client SSL information](sslinfo.html)
    * [F.42. tablefunc — functions that return tables (`crosstab` and others)](tablefunc.html)
    * [F.43. tcn — a trigger function to notify listeners of changes to table content](tcn.html)
    * [F.44. test\_decoding — SQL-based test/example module for WAL logical decoding](test-decoding.html)
    * [F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE`](tsm-system-rows.html)
    * [F.46. tsm\_system\_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE`](tsm-system-time.html)
    * [F.47. unaccent — a text search dictionary which removes diacritics](unaccent.html)
    * [F.48. uuid-ossp — a UUID generator](uuid-ossp.html)
    * [F.49. xml2 — XPath querying and XSLT functionality](xml2.html)

* [G. Additional Supplied Programs](contrib-prog.html)

  * *   [G.1. Client Applications](contrib-prog-client.html)
    * [G.2. Server Applications](contrib-prog-server.html)

* [H. External Projects](external-projects.html)

  * *   [H.1. Client Interfaces](external-interfaces.html)
    * [H.2. Administration Tools](external-admin-tools.html)
    * [H.3. Procedural Languages](external-pl.html)
    * [H.4. Extensions](external-extensions.html)

* [I. The Source Code Repository](sourcerepo.html)

  * [I.1. Getting the Source via Git](git.html)

* [J. Documentation](docguide.html)

  * *   [J.1. DocBook](docguide-docbook.html)
    * [J.2. Tool Sets](docguide-toolsets.html)
    * [J.3. Building the Documentation with Make](docguide-build.html)
    * [J.4. Building the Documentation with Meson](docguide-build-meson.html)
    * [J.5. Documentation Authoring](docguide-authoring.html)
    * [J.6. Style Guide](docguide-style.html)

  * *   [K. PostgreSQL Limits](limits.html)
  * [L. Acronyms](acronyms.html)
  * [M. Glossary](glossary.html)
  * [N. Color Support](color.html)

    

  * *   [N.1. When Color is Used](color-when.html)
    * [N.2. Configuring the Colors](color-which.html)

  * *   [O. `syncfs()` Caveats](syncfs.html)
  * [P. Obsolete or Renamed Features](appendix-obsolete.html)

    

  * *   [P.1. `recovery.conf` file merged into `postgresql.conf`](recovery-config.html)
    * [P.2. Default Roles Renamed to Predefined Roles](default-roles.html)
    * [P.3. `pg_xlogdump` renamed to `pg_waldump`](pgxlogdump.html)
    * [P.4. `pg_resetxlog` renamed to `pg_resetwal`](app-pgresetxlog.html)
    * [P.5. `pg_receivexlog` renamed to `pg_receivewal`](app-pgreceivexlog.html)

***

|                                                                                   |                                                       |                                                                      |
| :-------------------------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](backup-manifest-wal-ranges.html "77.3. Backup Manifest WAL Range Object")  |  [Up](index.html "PostgreSQL 17devel Documentation")  |  [Next](errcodes-appendix.html "Appendix A. PostgreSQL Error Codes") |
| 77.3. Backup Manifest WAL Range Object                                            | [Home](index.html "PostgreSQL 17devel Documentation") |                                   Appendix A. PostgreSQL Error Codes |
