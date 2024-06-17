[#id](#MONITORING)

## Chapter 28. Monitoring Database Activity

**Table of Contents**

- [28.1. Standard Unix Tools](monitoring-ps)
- [28.2. The Cumulative Statistics System](monitoring-stats)

  - [28.2.1. Statistics Collection Configuration](monitoring-stats#MONITORING-STATS-SETUP)
  - [28.2.2. Viewing Statistics](monitoring-stats#MONITORING-STATS-VIEWS)
  - [28.2.3. `pg_stat_activity`](monitoring-stats#MONITORING-PG-STAT-ACTIVITY-VIEW)
  - [28.2.4. `pg_stat_replication`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-VIEW)
  - [28.2.5. `pg_stat_replication_slots`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)
  - [28.2.6. `pg_stat_wal_receiver`](monitoring-stats#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)
  - [28.2.7. `pg_stat_recovery_prefetch`](monitoring-stats#MONITORING-PG-STAT-RECOVERY-PREFETCH)
  - [28.2.8. `pg_stat_subscription`](monitoring-stats#MONITORING-PG-STAT-SUBSCRIPTION)
  - [28.2.9. `pg_stat_subscription_stats`](monitoring-stats#MONITORING-PG-STAT-SUBSCRIPTION-STATS)
  - [28.2.10. `pg_stat_ssl`](monitoring-stats#MONITORING-PG-STAT-SSL-VIEW)
  - [28.2.11. `pg_stat_gssapi`](monitoring-stats#MONITORING-PG-STAT-GSSAPI-VIEW)
  - [28.2.12. `pg_stat_archiver`](monitoring-stats#MONITORING-PG-STAT-ARCHIVER-VIEW)
  - [28.2.13. `pg_stat_io`](monitoring-stats#MONITORING-PG-STAT-IO-VIEW)
  - [28.2.14. `pg_stat_bgwriter`](monitoring-stats#MONITORING-PG-STAT-BGWRITER-VIEW)
  - [28.2.15. `pg_stat_wal`](monitoring-stats#MONITORING-PG-STAT-WAL-VIEW)
  - [28.2.16. `pg_stat_database`](monitoring-stats#MONITORING-PG-STAT-DATABASE-VIEW)
  - [28.2.17. `pg_stat_database_conflicts`](monitoring-stats#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)
  - [28.2.18. `pg_stat_all_tables`](monitoring-stats#MONITORING-PG-STAT-ALL-TABLES-VIEW)
  - [28.2.19. `pg_stat_all_indexes`](monitoring-stats#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
  - [28.2.20. `pg_statio_all_tables`](monitoring-stats#MONITORING-PG-STATIO-ALL-TABLES-VIEW)
  - [28.2.21. `pg_statio_all_indexes`](monitoring-stats#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)
  - [28.2.22. `pg_statio_all_sequences`](monitoring-stats#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)
  - [28.2.23. `pg_stat_user_functions`](monitoring-stats#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)
  - [28.2.24. `pg_stat_slru`](monitoring-stats#MONITORING-PG-STAT-SLRU-VIEW)
  - [28.2.25. Statistics Functions](monitoring-stats#MONITORING-STATS-FUNCTIONS)

- [28.3. Viewing Locks](monitoring-locks)
- [28.4. Progress Reporting](progress-reporting)

  - [28.4.1. ANALYZE Progress Reporting](progress-reporting#ANALYZE-PROGRESS-REPORTING)
  - [28.4.2. CLUSTER Progress Reporting](progress-reporting#CLUSTER-PROGRESS-REPORTING)
  - [28.4.3. COPY Progress Reporting](progress-reporting#COPY-PROGRESS-REPORTING)
  - [28.4.4. CREATE INDEX Progress Reporting](progress-reporting#CREATE-INDEX-PROGRESS-REPORTING)
  - [28.4.5. VACUUM Progress Reporting](progress-reporting#VACUUM-PROGRESS-REPORTING)
  - [28.4.6. Base Backup Progress Reporting](progress-reporting#BASEBACKUP-PROGRESS-REPORTING)

- [28.5. Dynamic Tracing](dynamic-trace)

  - [28.5.1. Compiling for Dynamic Tracing](dynamic-trace#COMPILING-FOR-TRACE)
  - [28.5.2. Built-in Probes](dynamic-trace#TRACE-POINTS)
  - [28.5.3. Using Probes](dynamic-trace#USING-TRACE-POINTS)
  - [28.5.4. Defining New Probes](dynamic-trace#DEFINING-TRACE-POINTS)

A database administrator frequently wonders, “What is the system doing right now?” This chapter discusses how to find that out.

Several tools are available for monitoring database activity and analyzing performance. Most of this chapter is devoted to describing PostgreSQL's cumulative statistics system, but one should not neglect regular Unix monitoring programs such as `ps`, `top`, `iostat`, and `vmstat`. Also, once one has identified a poorly-performing query, further investigation might be needed using PostgreSQL's [`EXPLAIN`](sql-explain) command. [Section 14.1](using-explain) discusses `EXPLAIN` and other methods for understanding the behavior of an individual query.
