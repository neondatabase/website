<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                Chapter 14. Performance Tips               |                                            |                           |                                                       |                                                   |
| :-------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](locking-indexes.html "13.7. Locking and Indexes")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](using-explain.html "14.1. Using EXPLAIN") |

***

## Chapter 14. Performance Tips

**Table of Contents**

*   [14.1. Using `EXPLAIN`](using-explain.html)

    *   *   [14.1.1. `EXPLAIN` Basics](using-explain.html#USING-EXPLAIN-BASICS)
        *   [14.1.2. `EXPLAIN ANALYZE`](using-explain.html#USING-EXPLAIN-ANALYZE)
        *   [14.1.3. Caveats](using-explain.html#USING-EXPLAIN-CAVEATS)

*   [14.2. Statistics Used by the Planner](planner-stats.html)

    *   *   [14.2.1. Single-Column Statistics](planner-stats.html#PLANNER-STATS-SINGLE-COLUMN)
        *   [14.2.2. Extended Statistics](planner-stats.html#PLANNER-STATS-EXTENDED)

*   *   [14.3. Controlling the Planner with Explicit `JOIN` Clauses](explicit-joins.html)
    *   [14.4. Populating a Database](populate.html)

    <!---->

    *   *   [14.4.1. Disable Autocommit](populate.html#DISABLE-AUTOCOMMIT)
        *   [14.4.2. Use `COPY`](populate.html#POPULATE-COPY-FROM)
        *   [14.4.3. Remove Indexes](populate.html#POPULATE-RM-INDEXES)
        *   [14.4.4. Remove Foreign Key Constraints](populate.html#POPULATE-RM-FKEYS)
        *   [14.4.5. Increase `maintenance_work_mem`](populate.html#POPULATE-WORK-MEM)
        *   [14.4.6. Increase `max_wal_size`](populate.html#POPULATE-MAX-WAL-SIZE)
        *   [14.4.7. Disable WAL Archival and Streaming Replication](populate.html#POPULATE-PITR)
        *   [14.4.8. Run `ANALYZE` Afterwards](populate.html#POPULATE-ANALYZE)
        *   [14.4.9. Some Notes about pg\_dump](populate.html#POPULATE-PG-DUMP)

*   [14.5. Non-Durable Settings](non-durability.html)

[]()

Query performance can be affected by many things. Some of these can be controlled by the user, while others are fundamental to the underlying design of the system. This chapter provides some hints about understanding and tuning PostgreSQL performance.

***

|                                                           |                                                       |                                                   |
| :-------------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------: |
| [Prev](locking-indexes.html "13.7. Locking and Indexes")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](using-explain.html "14.1. Using EXPLAIN") |
| 13.7. Locking and Indexes                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                             14.1. Using `EXPLAIN` |
