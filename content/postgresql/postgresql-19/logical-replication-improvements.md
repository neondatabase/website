---
title: 'PostgreSQL 19 Logical Replication Improvements'
page_title: 'PostgreSQL 19 Logical Replication - Sequence Sync, EXCEPT TABLE, and More'
page_description: 'Learn about PostgreSQL 19 logical replication improvements including sequence synchronization, EXCEPT TABLE for publications, and dynamic WAL level configuration.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 REPACK Command'
  slug: 'postgresql-19/repack-command'
nextLink:
  title: 'PostgreSQL 19 JSON COPY TO'
  slug: 'postgresql-19/json-copy-to'
---

**Summary**: PostgreSQL 19 brings several improvements to logical replication, including sequence synchronization between publisher and subscriber, the ability to exclude specific tables from `FOR ALL TABLES` publications, and dynamic WAL level adjustment.

## Introduction

Logical replication has been improving steadily with each PostgreSQL release. [PostgreSQL 18](/postgresql/postgresql-18/logical-replication-improvements) added retain_dead_tuples conflict-resolution support and origin-aware filtering. PostgreSQL 19 continues this trend with changes that address common operational pain points: keeping sequences in sync across replicas, managing large publications more easily, and reducing the overhead of WAL configuration.

## Sequence Synchronization

One of the most requested features for logical replication has been sequence synchronization. In previous versions, logical replication handled table data but ignored sequences entirely. If you used serial columns or identity columns, the sequence values on the subscriber would not advance to match the publisher, causing conflicts if the subscriber was promoted to primary.

PostgreSQL 19 adds sequence synchronization to logical replication subscriptions. Subscribers can now periodically sync sequence values from the publisher.

This is the change that finally makes logical replication a sane way to do online major version upgrades. The standard pattern is to set up a logical replication stream from the old major version to a fresh PostgreSQL 19 cluster, let it catch up, then cut traffic over. Until 19, the missing piece was sequences: after the cutover the new primary would hand out sequence values that collided with rows already inserted on the old primary. With sequence synchronization, the new cluster comes up already aware of where the publisher's sequences had advanced to, and the cutover does not produce duplicate-key errors on the next insert.

```sql
-- On the publisher: create a publication that includes sequences
CREATE PUBLICATION my_pub FOR ALL TABLES, ALL SEQUENCES;
```

```sql
-- On the subscriber: create subscription
CREATE SUBSCRIPTION my_sub
    CONNECTION 'host=publisher dbname=mydb'
    PUBLICATION my_pub;
```

Sequence values are synchronized periodically based on the subscription's configuration. This means that after a failover, the new primary will have sequence values that are at least as high as the old primary's, preventing duplicate key errors.

<Admonition type="note">
Sequence synchronization sends the sequence's current value, not individual `nextval()` calls. There may be gaps in sequence values after synchronization, which is normal and expected behavior for PostgreSQL sequences.
</Admonition>

## EXCEPT TABLE in Publications

Publications using `FOR ALL TABLES` now support excluding specific tables with `EXCEPT TABLE`. This is a practical improvement for managing large databases where you want to replicate everything except a few tables (audit logs, temporary tables, staging data).

### Creating a Publication with Exclusions

Use `EXCEPT (TABLE ...)` after `FOR ALL TABLES` to keep specific tables out of the publication.

```sql
-- Replicate all tables except audit and temp tables
CREATE PUBLICATION production_pub FOR ALL TABLES
    EXCEPT (TABLE audit_log, temp_imports, debug_events);
```

### Modifying Exclusions

`ALTER PUBLICATION ... SET ALL TABLES` replaces the exclusion list, so you can add or remove tables without recreating the publication.

```sql
-- Update the exclusion list
ALTER PUBLICATION production_pub SET ALL TABLES
    EXCEPT (TABLE audit_log, temp_imports, staging_data);

-- Clear all exclusions
ALTER PUBLICATION production_pub SET ALL TABLES;
```

### Why This Matters

Before this feature, if you wanted to replicate all but a few tables, you had two options:

1. Explicitly list every table you wanted to include (painful with hundreds of tables, breaks when new tables are added)
2. Use `FOR ALL TABLES` and accept that unwanted tables would be replicated (wasting bandwidth and storage on the subscriber)

`EXCEPT TABLE` gives you the convenience of `FOR ALL TABLES` with the ability to skip the tables that should not be replicated.

## Dynamic WAL Level

PostgreSQL 19 introduces the `effective_wal_level` parameter, which adjusts automatically based on whether logical replication slots exist:

```sql
SHOW effective_wal_level;
```

This returns either `replica` or `logical` depending on the current state of replication slots. The system automatically adjusts the WAL level without requiring a configuration change or server restart.

Previously, you had to set `wal_level = logical` in `postgresql.conf` and restart the server before creating logical replication slots. If you later removed all logical replication slots, the WAL level would remain at `logical` (generating more WAL data than needed) until you manually changed the configuration and restarted.

With dynamic WAL level, PostgreSQL handles this automatically. When the first logical replication slot is created, the effective WAL level increases to `logical`. When the last logical replication slot is removed, it drops back to `replica`.

## COPY TO for Partitioned Tables

While not strictly a logical replication feature, this improvement is relevant to replication workflows. PostgreSQL 19 allows `COPY partitioned_table TO` directly, without the previous workaround of wrapping it in a subquery:

```sql
-- Before: required a subquery
COPY (SELECT * FROM partitioned_sales) TO '/tmp/sales.csv' WITH (FORMAT csv);

-- PostgreSQL 19: works directly
COPY partitioned_sales TO '/tmp/sales.csv' WITH (FORMAT csv);
```

This is about 7-8% faster than the subquery approach because it avoids the overhead of query processing.

## Practical Setup Example

Here is a complete example setting up logical replication with the new PostgreSQL 19 features:

### On the Publisher

Create the publication, applying exclusions for tables you don't want replicated, then verify what's actually in it.

```sql
-- Create a publication with table exclusions
CREATE PUBLICATION app_pub FOR ALL TABLES
    EXCEPT (TABLE debug_log, session_cache);

-- Verify what's included
SELECT * FROM pg_publication_tables WHERE pubname = 'app_pub';
```

### On the Subscriber

Subscribe to the publication and confirm the replication stream is flowing.

```sql
-- Create subscription
CREATE SUBSCRIPTION app_sub
    CONNECTION 'host=publisher-host dbname=appdb user=replicator'
    PUBLICATION app_pub;

-- Verify replication status
SELECT subname, received_lsn, latest_end_lsn, last_msg_send_time
FROM pg_stat_subscription;
```

### Monitoring

Once both sides are wired up, watch the WAL level and replication lag from the publisher.

```sql
-- Check effective WAL level
SHOW effective_wal_level;

-- Monitor replication lag
SELECT slot_name,
       pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn) AS lag_bytes
FROM pg_replication_slots
WHERE slot_type = 'logical';
```

## Summary

PostgreSQL 19's logical replication improvements address practical pain points that DBAs have been working around for years. Sequence synchronization removes a major gap in failover readiness. `EXCEPT TABLE` simplifies publication management for large databases. Dynamic WAL level eliminates the need to manually manage WAL configuration for logical replication. Together, these changes make logical replication more practical for production use.

## References

- [Commit `fd366065`: Allow table exclusions in publications via EXCEPT TABLE](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=fd366065)
- [Commit `67c20979`: Toggle logical decoding dynamically based on logical slot presence](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=67c20979)
- [PostgreSQL devel docs: CREATE PUBLICATION](https://www.postgresql.org/docs/devel/sql-createpublication.html)
