<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                           31.8. Monitoring                          |                                                                  |                                 |                                                       |                                                             |
| :-----------------------------------------------------------------: | :--------------------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](logical-replication-architecture.html "31.7. Architecture")  | [Up](logical-replication.html "Chapter 31. Logical Replication") | Chapter 31. Logical Replication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](logical-replication-security.html "31.9. Security") |

***

## 31.8. Monitoring [#](#LOGICAL-REPLICATION-MONITORING)

Because logical replication is based on a similar architecture as [physical streaming replication](warm-standby.html#STREAMING-REPLICATION "27.2.5. Streaming Replication"), the monitoring on a publication node is similar to monitoring of a physical replication primary (see [Section 27.2.5.2](warm-standby.html#STREAMING-REPLICATION-MONITORING "27.2.5.2. Monitoring")).

The monitoring information about subscription is visible in [`pg_stat_subscription`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION "28.2.8. pg_stat_subscription"). This view contains one row for every subscription worker. A subscription can have zero or more active subscription workers depending on its state.

Normally, there is a single apply process running for an enabled subscription. A disabled subscription or a crashed subscription will have zero rows in this view. If the initial data synchronization of any table is in progress, there will be additional workers for the tables being synchronized. Moreover, if the [`streaming`](sql-createsubscription.html#SQL-CREATESUBSCRIPTION-WITH-STREAMING) transaction is applied in parallel, there may be additional parallel apply workers.

***

|                                                                     |                                                                  |                                                             |
| :------------------------------------------------------------------ | :--------------------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](logical-replication-architecture.html "31.7. Architecture")  | [Up](logical-replication.html "Chapter 31. Logical Replication") |  [Next](logical-replication-security.html "31.9. Security") |
| 31.7. Architecture                                                  |       [Home](index.html "PostgreSQL 17devel Documentation")      |                                              31.9. Security |
