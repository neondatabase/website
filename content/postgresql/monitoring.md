<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|    Chapter 28. Monitoring Database Activity   |                                                    |                                 |                                                       |                                                         |
| :-------------------------------------------: | :------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](hot-standby.html "27.4. Hot Standby")  | [Up](admin.html "Part III. Server Administration") | Part III. Server Administration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](monitoring-ps.html "28.1. Standard Unix Tools") |

***

## Chapter 28. Monitoring Database Activity

**Table of Contents**

*   *   [28.1. Standard Unix Tools](monitoring-ps.html)
    *   [28.2. The Cumulative Statistics System](monitoring-stats.html)

    <!---->

    *   *   [28.2.1. Statistics Collection Configuration](monitoring-stats.html#MONITORING-STATS-SETUP)
        *   [28.2.2. Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
        *   [28.2.3. `pg_stat_activity`](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)
        *   [28.2.4. `pg_stat_replication`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW)
        *   [28.2.5. `pg_stat_replication_slots`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)
        *   [28.2.6. `pg_stat_wal_receiver`](monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)
        *   [28.2.7. `pg_stat_recovery_prefetch`](monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH)
        *   [28.2.8. `pg_stat_subscription`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION)
        *   [28.2.9. `pg_stat_subscription_stats`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS)
        *   [28.2.10. `pg_stat_ssl`](monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW)
        *   [28.2.11. `pg_stat_gssapi`](monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW)
        *   [28.2.12. `pg_stat_archiver`](monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW)
        *   [28.2.13. `pg_stat_io`](monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW)
        *   [28.2.14. `pg_stat_bgwriter`](monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW)
        *   [28.2.15. `pg_stat_wal`](monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW)
        *   [28.2.16. `pg_stat_database`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW)
        *   [28.2.17. `pg_stat_database_conflicts`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)
        *   [28.2.18. `pg_stat_all_tables`](monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)
        *   [28.2.19. `pg_stat_all_indexes`](monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
        *   [28.2.20. `pg_statio_all_tables`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)
        *   [28.2.21. `pg_statio_all_indexes`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)
        *   [28.2.22. `pg_statio_all_sequences`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)
        *   [28.2.23. `pg_stat_user_functions`](monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)
        *   [28.2.24. `pg_stat_slru`](monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW)
        *   [28.2.25. Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)

*   *   [28.3. Viewing Locks](monitoring-locks.html)
    *   [28.4. Progress Reporting](progress-reporting.html)

    <!---->

    *   *   [28.4.1. ANALYZE Progress Reporting](progress-reporting.html#ANALYZE-PROGRESS-REPORTING)
        *   [28.4.2. CLUSTER Progress Reporting](progress-reporting.html#CLUSTER-PROGRESS-REPORTING)
        *   [28.4.3. COPY Progress Reporting](progress-reporting.html#COPY-PROGRESS-REPORTING)
        *   [28.4.4. CREATE INDEX Progress Reporting](progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)
        *   [28.4.5. VACUUM Progress Reporting](progress-reporting.html#VACUUM-PROGRESS-REPORTING)
        *   [28.4.6. Base Backup Progress Reporting](progress-reporting.html#BASEBACKUP-PROGRESS-REPORTING)

*   [28.5. Dynamic Tracing](dynamic-trace.html)

    *   *   [28.5.1. Compiling for Dynamic Tracing](dynamic-trace.html#COMPILING-FOR-TRACE)
        *   [28.5.2. Built-in Probes](dynamic-trace.html#TRACE-POINTS)
        *   [28.5.3. Using Probes](dynamic-trace.html#USING-TRACE-POINTS)
        *   [28.5.4. Defining New Probes](dynamic-trace.html#DEFINING-TRACE-POINTS)

[]()[]()

A database administrator frequently wonders, “What is the system doing right now?” This chapter discusses how to find that out.

Several tools are available for monitoring database activity and analyzing performance. Most of this chapter is devoted to describing PostgreSQL's cumulative statistics system, but one should not neglect regular Unix monitoring programs such as `ps`, `top`, `iostat`, and `vmstat`. Also, once one has identified a poorly-performing query, further investigation might be needed using PostgreSQL's [`EXPLAIN`](sql-explain.html "EXPLAIN") command. [Section 14.1](using-explain.html "14.1. Using EXPLAIN") discusses `EXPLAIN` and other methods for understanding the behavior of an individual query.

***

|                                               |                                                       |                                                         |
| :-------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------: |
| [Prev](hot-standby.html "27.4. Hot Standby")  |   [Up](admin.html "Part III. Server Administration")  |  [Next](monitoring-ps.html "28.1. Standard Unix Tools") |
| 27.4. Hot Standby                             | [Home](index.html "PostgreSQL 17devel Documentation") |                               28.1. Standard Unix Tools |
