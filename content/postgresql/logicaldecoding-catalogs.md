[#id](#LOGICALDECODING-CATALOGS)

## 49.5. System Catalogs Related to Logical Decoding [#](#LOGICALDECODING-CATALOGS)

The [`pg_replication_slots`](view-pg-replication-slots) view and the [`pg_stat_replication`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-VIEW) view provide information about the current state of replication slots and streaming replication connections respectively. These views apply to both physical and logical replication. The [`pg_stat_replication_slots`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW) view provides statistics information about the logical replication slots.
