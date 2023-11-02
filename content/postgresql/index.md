# PostgreSQL 17devel Documentation

### The PostgreSQL Global Development Group

Copyright © 1996–2023 The PostgreSQL Global Development Group

[Legal Notice](legalnotice)

---

**Table of Contents**

- [Preface](preface)

  - [1. What Is PostgreSQL?](intro-whatis)
  - [2. A Brief History of PostgreSQL](history)
  - [3. Conventions](notation)
  - [4. Further Information](resources)
  - [5. Bug Reporting Guidelines](bug-reporting)

- [I. Tutorial](tutorial)

  - [1. Getting Started](tutorial-start)
  - [2. The SQL Language](tutorial-sql)
  - [3. Advanced Features](tutorial-advanced)

- [II. The SQL Language](sql)

  - [4. SQL Syntax](sql-syntax)
  - [5. Data Definition](ddl)
  - [6. Data Manipulation](dml)
  - [7. Queries](queries)
  - [8. Data Types](datatype)
  - [9. Functions and Operators](functions)
  - [10. Type Conversion](typeconv)
  - [11. Indexes](indexes)
  - [12. Full Text Search](textsearch)
  - [13. Concurrency Control](mvcc)
  - [14. Performance Tips](performance-tips)
  - [15. Parallel Query](parallel-query)

- [III. Server Administration](admin)

  - [16. Installation from Binaries](install-binaries)
  - [17. Installation from Source Code](installation)
  - [18. Installation from Source Code on Windows](install-windows)
  - [19. Server Setup and Operation](runtime)
  - [20. Server Configuration](runtime-config)
  - [21. Client Authentication](client-authentication)
  - [22. Database Roles](user-manag)
  - [23. Managing Databases](managing-databases)
  - [24. Localization](charset)
  - [25. Routine Database Maintenance Tasks](maintenance)
  - [26. Backup and Restore](backup)
  - [27. High Availability, Load Balancing, and Replication](high-availability)
  - [28. Monitoring Database Activity](monitoring)
  - [29. Monitoring Disk Usage](diskusage)
  - [30. Reliability and the Write-Ahead Log](wal)
  - [31. Logical Replication](logical-replication)
  - [32. Just-in-Time Compilation (JIT)](jit)
  - [33. Regression Tests](regress)

- [IV. Client Interfaces](client-interfaces)

  - [34. libpq — C Library](libpq)
  - [35. Large Objects](largeobjects)
  - [36. ECPG — Embedded SQL in C](ecpg)
  - [37. The Information Schema](information-schema)

- [V. Server Programming](server-programming)

  - [38. Extending SQL](extend)
  - [39. Triggers](triggers)
  - [40. Event Triggers](event-triggers)
  - [41. The Rule System](rules)
  - [42. Procedural Languages](xplang)
  - [43. PL/pgSQL — SQL Procedural Language](plpgsql)
  - [44. PL/Tcl — Tcl Procedural Language](pltcl)
  - [45. PL/Perl — Perl Procedural Language](plperl)
  - [46. PL/Python — Python Procedural Language](plpython)
  - [47. Server Programming Interface](spi)
  - [48. Background Worker Processes](bgworker)
  - [49. Logical Decoding](logicaldecoding)
  - [50. Replication Progress Tracking](replication-origins)
  - [51. Archive Modules](archive-modules)

- [VI. Reference](reference)

  - [I. SQL Commands](sql-commands)
  - [II. PostgreSQL Client Applications](reference-client)
  - [III. PostgreSQL Server Applications](reference-server)

- [VII. Internals](internals)

  - [52. Overview of PostgreSQL Internals](overview)
  - [53. System Catalogs](catalogs)
  - [54. System Views](views)
  - [55. Frontend/Backend Protocol](protocol)
  - [56. PostgreSQL Coding Conventions](source)
  - [57. Native Language Support](nls)
  - [58. Writing a Procedural Language Handler](plhandler)
  - [59. Writing a Foreign Data Wrapper](fdwhandler)
  - [60. Writing a Table Sampling Method](tablesample-method)
  - [61. Writing a Custom Scan Provider](custom-scan)
  - [62. Genetic Query Optimizer](geqo)
  - [63. Table Access Method Interface Definition](tableam)
  - [64. Index Access Method Interface Definition](indexam)
  - [65. Generic WAL Records](generic-wal)
  - [66. Custom WAL Resource Managers](custom-rmgr)
  - [67. B-Tree Indexes](btree)
  - [68. GiST Indexes](gist)
  - [69. SP-GiST Indexes](spgist)
  - [70. GIN Indexes](gin)
  - [71. BRIN Indexes](brin)
  - [72. Hash Indexes](hash-index)
  - [73. Database Physical Storage](storage)
  - [74. Transaction Processing](transactions)
  - [75. System Catalog Declarations and Initial Contents](bki)
  - [76. How the Planner Uses Statistics](planner-stats-details)
  - [77. Backup Manifest Format](backup-manifest-format)

- [VIII. Appendixes](appendixes)

  - [A. PostgreSQL Error Codes](errcodes-appendix)
  - [B. Date/Time Support](datetime-appendix)
  - [C. SQL Key Words](sql-keywords-appendix)
  - [D. SQL Conformance](features)
  - [E. Release Notes](release)
  - [F. Additional Supplied Modules and Extensions](contrib)
  - [G. Additional Supplied Programs](contrib-prog)
  - [H. External Projects](external-projects)
  - [I. The Source Code Repository](sourcerepo)
  - [J. Documentation](docguide)
  - [K. PostgreSQL Limits](limits)
  - [L. Acronyms](acronyms)
  - [M. Glossary](glossary)
  - [N. Color Support](color)
  - [O. `syncfs()` Caveats](syncfs)
  - [P. Obsolete or Renamed Features](appendix-obsolete)

- [Bibliography](biblio)
- [Index](bookindex)
