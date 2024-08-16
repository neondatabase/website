[#id](#CATALOG-PG-SUBSCRIPTION-REL)

## 53.55. `pg_subscription_rel` [#](#CATALOG-PG-SUBSCRIPTION-REL)

The catalog `pg_subscription_rel` contains the state for each replicated relation in each subscription. This is a many-to-many mapping.

This catalog only contains tables known to the subscription after running either [`CREATE SUBSCRIPTION`](sql-createsubscription) or [`ALTER SUBSCRIPTION ... REFRESH PUBLICATION`](sql-altersubscription).

[#id](#id-1.10.4.57.5)

**Table 53.55. `pg_subscription_rel` Columns**

| Column TypeDescription                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `srsubid` `oid` (references [`pg_subscription`](catalog-pg-subscription).`oid`)Reference to subscription                                                     |
| `srrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)Reference to relation                                                                       |
| `srsubstate` `char`State code: `i` = initialize, `d` = data is being copied, `f` = finished table copy, `s` = synchronized, `r` = ready (normal replication) |
| `srsublsn` `pg_lsn`Remote LSN of the state change used for synchronization coordination when in `s` or `r` states, otherwise null                            |
