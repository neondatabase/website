---
title: 'PostgreSQL 18 Logical Replication of Generated Columns'
page_title: 'PostgreSQL 18 Logical Replication of Generated Columns'
page_description: 'Learn about PostgreSQL 18 logical replication improvements including support for replicating stored generated columns, improved conflict logging with pg_stat_subscription_stats, and improved streaming configuration options.'
ogImage: ''
updatedOn: '2025-08-09T08:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Array and Bytea Function Improvements'
  slug: 'postgresql-18/array-bytea-improvements'
nextLink:
  title: 'PostgreSQL 18 OAuth Support'
  slug: 'postgresql-18/oauth-authentication'
---

**Summary**: In this tutorial, you will learn about PostgreSQL 18's logical replication improvements, including the ability to replicate stored generated columns, better conflict monitoring, and improved streaming defaults that make replication more reliable for production use.

## Introduction to Logical Replication Improvements

PostgreSQL 18 introduces three major improvements to logical replication that address common production challenges:

- **[Generated column replication](https://www.postgresql.org/docs/18/logical-replication-gencols.html)**: You can now replicate stored generated columns, which was impossible in previous versions
- **[Better conflict monitoring](https://www.postgresql.org/docs/18/logical-replication-conflicts.html)**: New statistics and logging help you identify and resolve replication issues faster
- **Improved streaming defaults**: Better performance out of the box with smarter default settings

These changes make logical replication more useful for complex scenarios like cross-database migration and data distribution to different systems.

## Replicating Stored Generated Columns

Before PostgreSQL 18, generated columns were completely ignored during logical replication. This created problems when replicating to databases that don't support generated columns or when you needed the calculated values on the subscriber side.

### The Problem with Previous Versions

In PostgreSQL 17 and earlier, if you had a table with generated columns, those columns would be skipped during replication. This meant:

- Subscribers couldn't get calculated values from the publisher
- Replication to non-PostgreSQL databases was difficult
- You had to recreate calculations on each subscriber

### New Publication Controls

PostgreSQL 18 adds a new `publish_generated_columns` parameter to publications:

```sql
-- Include generated columns in replication
CREATE PUBLICATION my_pub FOR TABLE products
WITH (publish_generated_columns = stored);
```

This parameter has two options:

- `none`: Skip generated columns (default)
- `stored`: Include stored generated columns in replication

The `publish_generated_columns` defaults to `none`. On subscribers older than 18, initial table sync will not copy generated columns even if the publisher enables this option.

When determining which table columns will be published, a column list will take precedence, which means it will override the effect of the `publish_generated_columns` parameter.

### How It Works

When you enable generated column replication, the publisher sends the calculated values to subscribers. The subscriber can then:

- Store them as regular columns (useful for non-PostgreSQL databases)
- If the subscriber also defines the column as `GENERATED`, an error will occur if the publisher sends generated column values, because the subscriber cannot receive published generated column values.

**Important**: When publishing stored generated columns with `publish_generated_columns = stored`, the subscriber must receive them into regular columns. If both the publisher publishes generated columns AND the subscriber column is also defined as GENERATED, the apply process will error.

This is particularly helpful when migrating between different database systems that handle calculations differently.

## Improved Conflict Monitoring

PostgreSQL 18 significantly improves how you monitor and troubleshoot logical replication conflicts through better logging and a new statistics view.

**Note**: To use the conflict monitoring features, enable `track_commit_timestamp = on` on the subscriber to detect `*_origin_differs` conflicts and to include origin and commit timestamp details in conflict logs.

### New Statistics View

The new `pg_stat_subscription_stats` view gives you detailed information about subscription health:

```sql
SELECT
  subname,
  apply_error_count,
  sync_error_count,
  confl_insert_exists,
  confl_update_origin_differs,
  confl_update_exists,
  confl_update_missing,
  confl_delete_origin_differs,
  confl_delete_missing,
  confl_multiple_unique_conflicts
FROM pg_stat_subscription_stats;
```

This view tracks:

- How many errors occurred during apply and sync phases (`apply_error_count`, `sync_error_count`)
- Different conflict types:
  - `confl_insert_exists`: Insert conflicts when row already exists
  - `confl_update_origin_differs`: Update conflicts due to different origins
  - `confl_update_exists`: Update conflicts where row exists unexpectedly
  - `confl_update_missing`: Update conflicts where row is missing
  - `confl_delete_origin_differs`: Delete conflicts due to different origins
  - `confl_delete_missing`: Delete conflicts where row is missing
  - `confl_multiple_unique_conflicts`: Multiple unique constraint conflicts
- When statistics were last reset (`stats_reset`)

**Important**: The `*_origin_differs` counters only increment when `track_commit_timestamp` is enabled on the subscriber. Other conflict counters work without this setting.

### Better Error Messages

When conflicts occur, PostgreSQL 18 provides more detailed error messages that include:

- The exact constraint that was violated
- Which replication origin caused the issue
- The transaction ID and location for reference
- The specific table and operation involved

This makes it much easier to identify what went wrong and how to fix it.

### Resolving Conflicts

When conflicts happen, you have several options:

- Use `ALTER SUBSCRIPTION ... SKIP` to skip over the conflicting change and continue replication.
- Manually correct the conflicting data on the subscriber and let replication continue.
- Change replication settings to prevent similar conflicts in the future.

## Improved Streaming Configuration

PostgreSQL 18 changes the default streaming behavior to provide better performance for most workloads.

### New Default: Parallel Streaming

PostgreSQL 18 changes the `CREATE SUBSCRIPTION` streaming default from `off` to `parallel`. In PostgreSQL 17 and earlier, the default was `off`, which meant large transactions were fully processed before being sent to subscribers. This could cause memory issues and delays.

With the new `parallel` default:

- Large transactions start replicating before they finish
- Multiple workers can apply changes simultaneously
- Memory usage is more predictable
- Replication lag is reduced

New subscriptions default to `streaming = parallel`; existing subscriptions keep their previous setting. You can still set `streaming = off` if you need the old behavior.

### Benefits of the New Default

The parallel streaming default provides several advantages:

- Better Performance: Changes start applying faster, reducing replication lag.
- Lower Memory Usage: You don't need to buffer entire large transactions in memory.
- More Reliable: The system handles large transactions more gracefully.

If you need the old behavior for compatibility, you can still set `streaming = off` when creating subscriptions.

### Better Two-Phase Commit Support

PostgreSQL 18 also allows you to change two-phase commit settings on existing subscriptions without recreating them:

```sql
-- Enable two-phase commit on existing subscription
ALTER SUBSCRIPTION my_sub SET (two_phase = true);
```

This makes it easier to gradually migrate to two-phase commit or adjust settings based on changing requirements.

## Limitations

There are a few things to keep in mind:

- Only stored generated columns can be replicated (not virtual ones)
- Generated column replication increases network traffic
- Column lists in publications take precedence over the generated column setting
- On subscribers older than 18, initial table synchronization won't copy generated columns; for full support use PG 18 on the subscriber
- `track_commit_timestamp = on` is needed on the subscriber to detect `*_origin_differs` conflicts
