<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            53.21. `pg_event_trigger`           |                                                   |                             |                                                       |                                                          |
| :--------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](catalog-pg-enum.html "53.20. pg_enum")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-extension.html "53.22. pg_extension") |

***

## 53.21. `pg_event_trigger` [#](#CATALOG-PG-EVENT-TRIGGER)

The catalog `pg_event_trigger` stores event triggers. See [Chapter 40](event-triggers.html "Chapter 40. Event Triggers") for more information.

**Table 53.21. `pg_event_trigger` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                                  |
| `evtname` `name`Trigger name (must be unique)                                                                                                                                                                                                                                                              |
| `evtevent` `name`Identifies the event for which this trigger fires                                                                                                                                                                                                                                         |
| `evtowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the event trigger                                                                                                                                                                                      |
| `evtfoid` `oid` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)The function to be called                                                                                                                                                                                             |
| `evtenabled` `char`Controls in which [session\_replication\_role](runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE) modes the event trigger fires. `O` = trigger fires in “origin” and “local” modes, `D` = trigger is disabled, `R` = trigger fires in “replica” mode, `A` = trigger fires always. |
| `evttags` `text[]`Command tags for which this trigger will fire. If NULL, the firing of this trigger is not restricted on the basis of the command tag.                                                                                                                                                    |

***

|                                                |                                                       |                                                          |
| :--------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------: |
| [Prev](catalog-pg-enum.html "53.20. pg_enum")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-extension.html "53.22. pg_extension") |
| 53.20. `pg_enum`                               | [Home](index.html "PostgreSQL 17devel Documentation") |                                    53.22. `pg_extension` |
