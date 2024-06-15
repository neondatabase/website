[#id](#PERFORMANCE-TIPS)

## Chapter 14. Performance Tips

**Table of Contents**

- [14.1. Using `EXPLAIN`](using-explain)

  - [14.1.1. `EXPLAIN` Basics](using-explain#USING-EXPLAIN-BASICS)
  - [14.1.2. `EXPLAIN ANALYZE`](using-explain#USING-EXPLAIN-ANALYZE)
  - [14.1.3. Caveats](using-explain#USING-EXPLAIN-CAVEATS)

- [14.2. Statistics Used by the Planner](planner-stats)

  - [14.2.1. Single-Column Statistics](planner-stats#PLANNER-STATS-SINGLE-COLUMN)
  - [14.2.2. Extended Statistics](planner-stats#PLANNER-STATS-EXTENDED)

  - [14.3. Controlling the Planner with Explicit `JOIN` Clauses](explicit-joins)
  - [14.4. Populating a Database](populate)

    - [14.4.1. Disable Autocommit](populate#DISABLE-AUTOCOMMIT)
    - [14.4.2. Use `COPY`](populate#POPULATE-COPY-FROM)
    - [14.4.3. Remove Indexes](populate#POPULATE-RM-INDEXES)
    - [14.4.4. Remove Foreign Key Constraints](populate#POPULATE-RM-FKEYS)
    - [14.4.5. Increase `maintenance_work_mem`](populate#POPULATE-WORK-MEM)
    - [14.4.6. Increase `max_wal_size`](populate#POPULATE-MAX-WAL-SIZE)
    - [14.4.7. Disable WAL Archival and Streaming Replication](populate#POPULATE-PITR)
    - [14.4.8. Run `ANALYZE` Afterwards](populate#POPULATE-ANALYZE)
    - [14.4.9. Some Notes about pg_dump](populate#POPULATE-PG-DUMP)

- [14.5. Non-Durable Settings](non-durability)

Query performance can be affected by many things. Some of these can be controlled by the user, while others are fundamental to the underlying design of the system. This chapter provides some hints about understanding and tuning PostgreSQL performance.
