[#id](#CATALOG-PG-TRIGGER)

## 53.58. `pg_trigger` [#](#CATALOG-PG-TRIGGER)

The catalog `pg_trigger` stores triggers on tables and views. See [CREATE TRIGGER](sql-createtrigger) for more information.

[#id](#id-1.10.4.60.4)

**Table 53.58. `pg_trigger` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                    |
| `tgrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The table this trigger is on                                                                                                                                                                                                |
| `tgparentid` `oid` (references [`pg_trigger`](catalog-pg-trigger).`oid`)Parent trigger that this trigger is cloned from (this happens when partitions are created or attached to a partitioned table); zero if not a clone                                                                   |
| `tgname` `name`Trigger name (must be unique among triggers of same table)                                                                                                                                                                                                                    |
| `tgfoid` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)The function to be called                                                                                                                                                                                                      |
| `tgtype` `int2`Bit mask identifying trigger firing conditions                                                                                                                                                                                                                                |
| `tgenabled` `char`Controls in which [session_replication_role](runtime-config-client#GUC-SESSION-REPLICATION-ROLE) modes the trigger fires. `O` = trigger fires in “origin” and “local” modes, `D` = trigger is disabled, `R` = trigger fires in “replica” mode, `A` = trigger fires always. |
| `tgisinternal` `bool`True if trigger is internally generated (usually, to enforce the constraint identified by `tgconstraint`)                                                                                                                                                               |
| `tgconstrrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The table referenced by a referential integrity constraint (zero if trigger is not for a referential integrity constraint)                                                                                            |
| `tgconstrindid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The index supporting a unique, primary key, referential integrity, or exclusion constraint (zero if trigger is not for one of these types of constraint)                                                              |
| `tgconstraint` `oid` (references [`pg_constraint`](catalog-pg-constraint).`oid`)The [`pg_constraint`](catalog-pg-constraint) entry associated with the trigger (zero if trigger is not for a constraint)                                                                                     |
| `tgdeferrable` `bool`True if constraint trigger is deferrable                                                                                                                                                                                                                                |
| `tginitdeferred` `bool`True if constraint trigger is initially deferred                                                                                                                                                                                                                      |
| `tgnargs` `int2`Number of argument strings passed to trigger function                                                                                                                                                                                                                        |
| `tgattr` `int2vector` (references [`pg_attribute`](catalog-pg-attribute).`attnum`)Column numbers, if trigger is column-specific; otherwise an empty array                                                                                                                                    |
| `tgargs` `bytea`Argument strings to pass to trigger, each NULL-terminated                                                                                                                                                                                                                    |
| `tgqual` `pg_node_tree`Expression tree (in `nodeToString()` representation) for the trigger's `WHEN` condition, or null if none                                                                                                                                                              |
| `tgoldtable` `name``REFERENCING` clause name for `OLD TABLE`, or null if none                                                                                                                                                                                                                |
| `tgnewtable` `name``REFERENCING` clause name for `NEW TABLE`, or null if none                                                                                                                                                                                                                |

Currently, column-specific triggering is supported only for `UPDATE` events, and so `tgattr` is relevant only for that event type. `tgtype` might contain bits for other event types as well, but those are presumed to be table-wide regardless of what is in `tgattr`.

### Note

When `tgconstraint` is nonzero, `tgconstrrelid`, `tgconstrindid`, `tgdeferrable`, and `tginitdeferred` are largely redundant with the referenced [`pg_constraint`](catalog-pg-constraint) entry. However, it is possible for a non-deferrable trigger to be associated with a deferrable constraint: foreign key constraints can have some deferrable and some non-deferrable triggers.

### Note

`pg_class.relhastriggers` must be true if a relation has any triggers in this catalog.
