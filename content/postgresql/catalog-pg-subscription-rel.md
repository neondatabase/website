

|                  53.55. `pg_subscription_rel`                  |                                                   |                             |                                                       |                                                            |
| :------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](catalog-pg-subscription.html "53.54. pg_subscription")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-tablespace.html "53.56. pg_tablespace") |

***

## 53.55. `pg_subscription_rel` [#](#CATALOG-PG-SUBSCRIPTION-REL)

The catalog `pg_subscription_rel` contains the state for each replicated relation in each subscription. This is a many-to-many mapping.

This catalog only contains tables known to the subscription after running either [`CREATE SUBSCRIPTION`](sql-createsubscription.html "CREATE SUBSCRIPTION") or [`ALTER SUBSCRIPTION ... REFRESH PUBLICATION`](sql-altersubscription.html "ALTER SUBSCRIPTION").

**Table 53.55. `pg_subscription_rel` Columns**

| Column TypeDescription                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `srsubid` `oid` (references [`pg_subscription`](catalog-pg-subscription.html "53.54. pg_subscription").`oid`)Reference to subscription                       |
| `srrelid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)Reference to relation                                                |
| `srsubstate` `char`State code: `i` = initialize, `d` = data is being copied, `f` = finished table copy, `s` = synchronized, `r` = ready (normal replication) |
| `srsublsn` `pg_lsn`Remote LSN of the state change used for synchronization coordination when in `s` or `r` states, otherwise null                            |

***

|                                                                |                                                       |                                                            |
| :------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](catalog-pg-subscription.html "53.54. pg_subscription")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-tablespace.html "53.56. pg_tablespace") |
| 53.54. `pg_subscription`                                       | [Home](index.html "PostgreSQL 17devel Documentation") |                                     53.56. `pg_tablespace` |
