

|             49.5. System Catalogs Related to Logical Decoding            |                                                           |                              |                                                       |                                                                                     |
| :----------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------------------: |
| [Prev](logicaldecoding-sql.html "49.4. Logical Decoding SQL Interface")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") | Chapter 49. Logical Decoding | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](logicaldecoding-output-plugin.html "49.6. Logical Decoding Output Plugins") |

***

## 49.5. System Catalogs Related to Logical Decoding [#](#LOGICALDECODING-CATALOGS)

The [`pg_replication_slots`](view-pg-replication-slots.html "54.19. pg_replication_slots") view and the [`pg_stat_replication`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW "28.2.4. pg_stat_replication") view provide information about the current state of replication slots and streaming replication connections respectively. These views apply to both physical and logical replication. The [`pg_stat_replication_slots`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW "28.2.5. pg_stat_replication_slots") view provides statistics information about the logical replication slots.

***

|                                                                          |                                                           |                                                                                     |
| :----------------------------------------------------------------------- | :-------------------------------------------------------: | ----------------------------------------------------------------------------------: |
| [Prev](logicaldecoding-sql.html "49.4. Logical Decoding SQL Interface")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") |  [Next](logicaldecoding-output-plugin.html "49.6. Logical Decoding Output Plugins") |
| 49.4. Logical Decoding SQL Interface                                     |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                               49.6. Logical Decoding Output Plugins |
