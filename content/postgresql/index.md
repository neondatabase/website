<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

| PostgreSQL 17devel Documentation |    |     |    |                                 |
| :------------------------------: | :- | :-: | -: | ------------------------------: |
|                                  |    |     |    |  [Next](preface.html "Preface") |

***

# PostgreSQL 17devel Documentation

### The PostgreSQL Global Development Group

Copyright © 1996–2023 The PostgreSQL Global Development Group

[Legal Notice](legalnotice.html)

***

**Table of Contents**

*   [Preface](preface.html)

    *   *   [1. What Is PostgreSQL?](intro-whatis.html)
        *   [2. A Brief History of PostgreSQL](history.html)
        *   [3. Conventions](notation.html)
        *   [4. Further Information](resources.html)
        *   [5. Bug Reporting Guidelines](bug-reporting.html)

*   [I. Tutorial](tutorial.html)

    *   *   [1. Getting Started](tutorial-start.html)
        *   [2. The SQL Language](tutorial-sql.html)
        *   [3. Advanced Features](tutorial-advanced.html)

*   [II. The SQL Language](sql.html)

    *   *   [4. SQL Syntax](sql-syntax.html)
        *   [5. Data Definition](ddl.html)
        *   [6. Data Manipulation](dml.html)
        *   [7. Queries](queries.html)
        *   [8. Data Types](datatype.html)
        *   [9. Functions and Operators](functions.html)
        *   [10. Type Conversion](typeconv.html)
        *   [11. Indexes](indexes.html)
        *   [12. Full Text Search](textsearch.html)
        *   [13. Concurrency Control](mvcc.html)
        *   [14. Performance Tips](performance-tips.html)
        *   [15. Parallel Query](parallel-query.html)

*   [III. Server Administration](admin.html)

    *   *   [16. Installation from Binaries](install-binaries.html)
        *   [17. Installation from Source Code](installation.html)
        *   [18. Installation from Source Code on Windows](install-windows.html)
        *   [19. Server Setup and Operation](runtime.html)
        *   [20. Server Configuration](runtime-config.html)
        *   [21. Client Authentication](client-authentication.html)
        *   [22. Database Roles](user-manag.html)
        *   [23. Managing Databases](managing-databases.html)
        *   [24. Localization](charset.html)
        *   [25. Routine Database Maintenance Tasks](maintenance.html)
        *   [26. Backup and Restore](backup.html)
        *   [27. High Availability, Load Balancing, and Replication](high-availability.html)
        *   [28. Monitoring Database Activity](monitoring.html)
        *   [29. Monitoring Disk Usage](diskusage.html)
        *   [30. Reliability and the Write-Ahead Log](wal.html)
        *   [31. Logical Replication](logical-replication.html)
        *   [32. Just-in-Time Compilation (JIT)](jit.html)
        *   [33. Regression Tests](regress.html)

*   [IV. Client Interfaces](client-interfaces.html)

    *   *   [34. libpq — C Library](libpq.html)
        *   [35. Large Objects](largeobjects.html)
        *   [36. ECPG — Embedded SQL in C](ecpg.html)
        *   [37. The Information Schema](information-schema.html)

*   [V. Server Programming](server-programming.html)

    *   *   [38. Extending SQL](extend.html)
        *   [39. Triggers](triggers.html)
        *   [40. Event Triggers](event-triggers.html)
        *   [41. The Rule System](rules.html)
        *   [42. Procedural Languages](xplang.html)
        *   [43. PL/pgSQL — SQL Procedural Language](plpgsql.html)
        *   [44. PL/Tcl — Tcl Procedural Language](pltcl.html)
        *   [45. PL/Perl — Perl Procedural Language](plperl.html)
        *   [46. PL/Python — Python Procedural Language](plpython.html)
        *   [47. Server Programming Interface](spi.html)
        *   [48. Background Worker Processes](bgworker.html)
        *   [49. Logical Decoding](logicaldecoding.html)
        *   [50. Replication Progress Tracking](replication-origins.html)
        *   [51. Archive Modules](archive-modules.html)

*   [VI. Reference](reference.html)

    *   *   [I. SQL Commands](sql-commands.html)
        *   [II. PostgreSQL Client Applications](reference-client.html)
        *   [III. PostgreSQL Server Applications](reference-server.html)

*   [VII. Internals](internals.html)

    *   *   [52. Overview of PostgreSQL Internals](overview.html)
        *   [53. System Catalogs](catalogs.html)
        *   [54. System Views](views.html)
        *   [55. Frontend/Backend Protocol](protocol.html)
        *   [56. PostgreSQL Coding Conventions](source.html)
        *   [57. Native Language Support](nls.html)
        *   [58. Writing a Procedural Language Handler](plhandler.html)
        *   [59. Writing a Foreign Data Wrapper](fdwhandler.html)
        *   [60. Writing a Table Sampling Method](tablesample-method.html)
        *   [61. Writing a Custom Scan Provider](custom-scan.html)
        *   [62. Genetic Query Optimizer](geqo.html)
        *   [63. Table Access Method Interface Definition](tableam.html)
        *   [64. Index Access Method Interface Definition](indexam.html)
        *   [65. Generic WAL Records](generic-wal.html)
        *   [66. Custom WAL Resource Managers](custom-rmgr.html)
        *   [67. B-Tree Indexes](btree.html)
        *   [68. GiST Indexes](gist.html)
        *   [69. SP-GiST Indexes](spgist.html)
        *   [70. GIN Indexes](gin.html)
        *   [71. BRIN Indexes](brin.html)
        *   [72. Hash Indexes](hash-index.html)
        *   [73. Database Physical Storage](storage.html)
        *   [74. Transaction Processing](transactions.html)
        *   [75. System Catalog Declarations and Initial Contents](bki.html)
        *   [76. How the Planner Uses Statistics](planner-stats-details.html)
        *   [77. Backup Manifest Format](backup-manifest-format.html)

*   [VIII. Appendixes](appendixes.html)

    *   *   [A. PostgreSQL Error Codes](errcodes-appendix.html)
        *   [B. Date/Time Support](datetime-appendix.html)
        *   [C. SQL Key Words](sql-keywords-appendix.html)
        *   [D. SQL Conformance](features.html)
        *   [E. Release Notes](release.html)
        *   [F. Additional Supplied Modules and Extensions](contrib.html)
        *   [G. Additional Supplied Programs](contrib-prog.html)
        *   [H. External Projects](external-projects.html)
        *   [I. The Source Code Repository](sourcerepo.html)
        *   [J. Documentation](docguide.html)
        *   [K. PostgreSQL Limits](limits.html)
        *   [L. Acronyms](acronyms.html)
        *   [M. Glossary](glossary.html)
        *   [N. Color Support](color.html)
        *   [O. `syncfs()` Caveats](syncfs.html)
        *   [P. Obsolete or Renamed Features](appendix-obsolete.html)

*   *   [Bibliography](biblio.html)
    *   [Index](bookindex.html)

***

|    |     |                                 |
| :- | :-: | ------------------------------: |
|    |     |  [Next](preface.html "Preface") |
|    |     |                         Preface |
