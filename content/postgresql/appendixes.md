# Part VIII. Appendixes

**Table of Contents**

  * *   [A. PostgreSQL Error Codes](errcodes-appendix)
  * [B. Date/Time Support](datetime-appendix)

    

  * *   [B.1. Date/Time Input Interpretation](datetime-input-rules)
    * [B.2. Handling of Invalid or Ambiguous Timestamps](datetime-invalid-input)
    * [B.3. Date/Time Key Words](datetime-keywords)
    * [B.4. Date/Time Configuration Files](datetime-config-files)
    * [B.5. POSIX Time Zone Specifications](datetime-posix-timezone-specs)
    * [B.6. History of Units](datetime-units-history)
    * [B.7. Julian Dates](datetime-julian-dates)

  * *   [C. SQL Key Words](sql-keywords-appendix)
  * [D. SQL Conformance](features)

    

  * *   [D.1. Supported Features](features-sql-standard)
    * [D.2. Unsupported Features](unsupported-features-sql-standard)
    * [D.3. XML Limits and Conformance to SQL/XML](xml-limits-conformance)

* [E. Release Notes](release)

  * *   [E.1. Release 17](release-17)
    * [E.2. Prior Releases](release-prior)

* [F. Additional Supplied Modules and Extensions](contrib)

  * *   [F.1. adminpack — pgAdmin support toolpack](adminpack)
    * [F.2. amcheck — tools to verify table and index consistency](amcheck)
    * [F.3. auth\_delay — pause on authentication failure](auth-delay)
    * [F.4. auto\_explain — log execution plans of slow queries](auto-explain)
    * [F.5. basebackup\_to\_shell — example "shell" pg\_basebackup module](basebackup-to-shell)
    * [F.6. basic\_archive — an example WAL archive module](basic-archive)
    * [F.7. bloom — bloom filter index access method](bloom)
    * [F.8. btree\_gin — GIN operator classes with B-tree behavior](btree-gin)
    * [F.9. btree\_gist — GiST operator classes with B-tree behavior](btree-gist)
    * [F.10. citext — a case-insensitive character string type](citext)
    * [F.11. cube — a multi-dimensional cube data type](cube)
    * [F.12. dblink — connect to other PostgreSQL databases](dblink)
    * [F.13. dict\_int — example full-text search dictionary for integers](dict-int)
    * [F.14. dict\_xsyn — example synonym full-text search dictionary](dict-xsyn)
    * [F.15. earthdistance — calculate great-circle distances](earthdistance)
    * [F.16. file\_fdw — access data files in the server's file system](file-fdw)
    * [F.17. fuzzystrmatch — determine string similarities and distance](fuzzystrmatch)
    * [F.18. hstore — hstore key/value datatype](hstore)
    * [F.19. intagg — integer aggregator and enumerator](intagg)
    * [F.20. intarray — manipulate arrays of integers](intarray)
    * [F.21. isn — data types for international standard numbers (ISBN, EAN, UPC, etc.)](isn)
    * [F.22. lo — manage large objects](lo)
    * [F.23. ltree — hierarchical tree-like data type](ltree)
    * [F.24. pageinspect — low-level inspection of database pages](pageinspect)
    * [F.25. passwordcheck — verify password strength](passwordcheck)
    * [F.26. pg\_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache)
    * [F.27. pgcrypto — cryptographic functions](pgcrypto)
    * [F.28. pg\_freespacemap — examine the free space map](pgfreespacemap)
    * [F.29. pg\_prewarm — preload relation data into buffer caches](pgprewarm)
    * [F.30. pgrowlocks — show a table's row locking information](pgrowlocks)
    * [F.31. pg\_stat\_statements — track statistics of SQL planning and execution](pgstatstatements)
    * [F.32. pgstattuple — obtain tuple-level statistics](pgstattuple)
    * [F.33. pg\_surgery — perform low-level surgery on relation data](pgsurgery)
    * [F.34. pg\_trgm — support for similarity of text using trigram matching](pgtrgm)
    * [F.35. pg\_visibility — visibility map information and utilities](pgvisibility)
    * [F.36. pg\_walinspect — low-level WAL inspection](pgwalinspect)
    * [F.37. postgres\_fdw — access data stored in external PostgreSQL servers](postgres-fdw)
    * [F.38. seg — a datatype for line segments or floating point intervals](seg)
    * [F.39. sepgsql — SELinux-, label-based mandatory access control (MAC) security module](sepgsql)
    * [F.40. spi — Server Programming Interface features/examples](contrib-spi)
    * [F.41. sslinfo — obtain client SSL information](sslinfo)
    * [F.42. tablefunc — functions that return tables (`crosstab` and others)](tablefunc)
    * [F.43. tcn — a trigger function to notify listeners of changes to table content](tcn)
    * [F.44. test\_decoding — SQL-based test/example module for WAL logical decoding](test-decoding)
    * [F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE`](tsm-system-rows)
    * [F.46. tsm\_system\_time — the `SYSTEM_TIME` sampling method for `TABLESAMPLE`](tsm-system-time)
    * [F.47. unaccent — a text search dictionary which removes diacritics](unaccent)
    * [F.48. uuid-ossp — a UUID generator](uuid-ossp)
    * [F.49. xml2 — XPath querying and XSLT functionality](xml2)

* [G. Additional Supplied Programs](contrib-prog)

  * *   [G.1. Client Applications](contrib-prog-client)
    * [G.2. Server Applications](contrib-prog-server)

* [H. External Projects](external-projects)

  * *   [H.1. Client Interfaces](external-interfaces)
    * [H.2. Administration Tools](external-admin-tools)
    * [H.3. Procedural Languages](external-pl)
    * [H.4. Extensions](external-extensions)

* [I. The Source Code Repository](sourcerepo)

  * [I.1. Getting the Source via Git](git)

* [J. Documentation](docguide)

  * *   [J.1. DocBook](docguide-docbook)
    * [J.2. Tool Sets](docguide-toolsets)
    * [J.3. Building the Documentation with Make](docguide-build)
    * [J.4. Building the Documentation with Meson](docguide-build-meson)
    * [J.5. Documentation Authoring](docguide-authoring)
    * [J.6. Style Guide](docguide-style)

  * *   [K. PostgreSQL Limits](limits)
  * [L. Acronyms](acronyms)
  * [M. Glossary](glossary)
  * [N. Color Support](color)

    

  * *   [N.1. When Color is Used](color-when)
    * [N.2. Configuring the Colors](color-which)

  * *   [O. `syncfs()` Caveats](syncfs)
  * [P. Obsolete or Renamed Features](appendix-obsolete)

    

  * *   [P.1. `recovery.conf` file merged into `postgresql.conf`](recovery-config)
    * [P.2. Default Roles Renamed to Predefined Roles](default-roles)
    * [P.3. `pg_xlogdump` renamed to `pg_waldump`](pgxlogdump)
    * [P.4. `pg_resetxlog` renamed to `pg_resetwal`](app-pgresetxlog)
    * [P.5. `pg_receivexlog` renamed to `pg_receivewal`](app-pgreceivexlog)