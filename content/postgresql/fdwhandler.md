[#id](#FDWHANDLER)

## Chapter 59. Writing a Foreign Data Wrapper

**Table of Contents**

- [59.1. Foreign Data Wrapper Functions](fdw-functions)
- [59.2. Foreign Data Wrapper Callback Routines](fdw-callbacks)

  - [59.2.1. FDW Routines for Scanning Foreign Tables](fdw-callbacks#FDW-CALLBACKS-SCAN)
  - [59.2.2. FDW Routines for Scanning Foreign Joins](fdw-callbacks#FDW-CALLBACKS-JOIN-SCAN)
  - [59.2.3. FDW Routines for Planning Post-Scan/Join Processing](fdw-callbacks#FDW-CALLBACKS-UPPER-PLANNING)
  - [59.2.4. FDW Routines for Updating Foreign Tables](fdw-callbacks#FDW-CALLBACKS-UPDATE)
  - [59.2.5. FDW Routines for `TRUNCATE`](fdw-callbacks#FDW-CALLBACKS-TRUNCATE)
  - [59.2.6. FDW Routines for Row Locking](fdw-callbacks#FDW-CALLBACKS-ROW-LOCKING)
  - [59.2.7. FDW Routines for `EXPLAIN`](fdw-callbacks#FDW-CALLBACKS-EXPLAIN)
  - [59.2.8. FDW Routines for `ANALYZE`](fdw-callbacks#FDW-CALLBACKS-ANALYZE)
  - [59.2.9. FDW Routines for `IMPORT FOREIGN SCHEMA`](fdw-callbacks#FDW-CALLBACKS-IMPORT)
  - [59.2.10. FDW Routines for Parallel Execution](fdw-callbacks#FDW-CALLBACKS-PARALLEL)
  - [59.2.11. FDW Routines for Asynchronous Execution](fdw-callbacks#FDW-CALLBACKS-ASYNC)
  - [59.2.12. FDW Routines for Reparameterization of Paths](fdw-callbacks#FDW-CALLBACKS-REPARAMETERIZE-PATHS)

- [59.3. Foreign Data Wrapper Helper Functions](fdw-helpers)
- [59.4. Foreign Data Wrapper Query Planning](fdw-planning)
- [59.5. Row Locking in Foreign Data Wrappers](fdw-row-locking)

All operations on a foreign table are handled through its foreign data wrapper, which consists of a set of functions that the core server calls. The foreign data wrapper is responsible for fetching data from the remote data source and returning it to the PostgreSQL executor. If updating foreign tables is to be supported, the wrapper must handle that, too. This chapter outlines how to write a new foreign data wrapper.

The foreign data wrappers included in the standard distribution are good references when trying to write your own. Look into the `contrib` subdirectory of the source tree. The [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper) reference page also has some useful details.

### Note

The SQL standard specifies an interface for writing foreign data wrappers. However, PostgreSQL does not implement that API, because the effort to accommodate it into PostgreSQL would be large, and the standard API hasn't gained wide adoption anyway.
