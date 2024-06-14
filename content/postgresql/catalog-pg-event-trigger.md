[#id](#CATALOG-PG-EVENT-TRIGGER)

## 53.21. `pg_event_trigger` [#](#CATALOG-PG-EVENT-TRIGGER)

The catalog `pg_event_trigger` stores event triggers. See [Chapter 40](event-triggers) for more information.

[#id](#id-1.10.4.23.4)

**Table 53.21. `pg_event_trigger` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                           |
| `evtname` `name`Trigger name (must be unique)                                                                                                                                                                                                                                                       |
| `evtevent` `name`Identifies the event for which this trigger fires                                                                                                                                                                                                                                  |
| `evtowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the event trigger                                                                                                                                                                                                      |
| `evtfoid` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)The function to be called                                                                                                                                                                                                            |
| `evtenabled` `char`Controls in which [session_replication_role](runtime-config-client#GUC-SESSION-REPLICATION-ROLE) modes the event trigger fires. `O` = trigger fires in “origin” and “local” modes, `D` = trigger is disabled, `R` = trigger fires in “replica” mode, `A` = trigger fires always. |
| `evttags` `text[]`Command tags for which this trigger will fire. If NULL, the firing of this trigger is not restricted on the basis of the command tag.                                                                                                                                             |
