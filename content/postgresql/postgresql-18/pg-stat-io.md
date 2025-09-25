---
title: 'PostgreSQL 18 pg_stat_io Guide: Better I/O Monitoring'
page_title: 'PostgreSQL 18 pg_stat_io Guide: Better I/O Monitoring'
page_description: 'Learn about PostgreSQL 18 better pg_stat_io view with byte-level statistics, WAL I/O tracking, per-backend functions, and comprehensive I/O monitoring capabilities.'
ogImage: ''
updatedOn: '2025-08-16T14:20:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Wire Protocol 3.2 and TLS Improvements'
  slug: 'postgresql-18/security-improvements'
nextLink:
  title: 'PostgreSQL 18 psql Improvements'
  slug: 'postgresql-18/psql-improvements'
---

**Summary**: In this tutorial, you will learn about PostgreSQL 18's better [`pg_stat_io` view](https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW), including new byte-level I/O statistics, WAL tracking, per-backend monitoring functions, and comprehensive buffer analysis for better database performance tuning.

## Introduction to pg_stat_io

The `pg_stat_io` view, first introduced in PostgreSQL 16, provides detailed insights into I/O operations across your PostgreSQL cluster. PostgreSQL 18 significantly improves this view with byte-level statistics, WAL I/O tracking, and per-backend monitoring capabilities.

This view is great for understanding database performance because it breaks down I/O activity by backend type, I/O object, and context. It is handy when troubleshooting slow queries, optimizing buffer cache settings, or analyzing system-wide I/O patterns as `pg_stat_io` provides the detailed metrics you need.

## What's New in PostgreSQL 18

PostgreSQL 18 introduces several major improvements to I/O monitoring that make the `pg_stat_io` view more powerful and comprehensive.

### Byte-Level Statistics

PostgreSQL 18 adds three new columns that track I/O volume in bytes rather than just operation counts:

- **`read_bytes`**: Total bytes read across all read operations
- **`write_bytes`**: Total bytes written across all write operations
- **`extend_bytes`**: Total bytes used to extend data files

The previous `op_bytes` column has been removed since operations can now vary in size, particularly with features like `io_combine_limit` that allow larger I/O operations.

### WAL I/O Tracking

For the first time, WAL (Write-Ahead Log) I/O operations are now tracked in `pg_stat_io`. This includes WAL writes from various backend types and provides insights into WAL-related I/O pressure.

### Per-Backend I/O Functions

Two new functions allow you to monitor I/O activity for specific database connections:

- **`pg_stat_get_backend_io(pid)`**: Returns I/O statistics for a specific backend process
- **`pg_stat_get_backend_wal(pid)`**: Returns WAL statistics for a specific backend process

## Understanding pg_stat_io Structure

The `pg_stat_io` view organizes I/O statistics using three key dimensions that help categorize different types of database activity.

### Backend Types

PostgreSQL tracks I/O separately for different process types:

- **`client backend`**: Regular database connections from applications
- **`autovacuum worker`**: Automatic vacuum and analyze processes
- **`autovacuum launcher`**: The coordinator for autovacuum workers
- **`background writer`**: Process that writes dirty pages to disk
- **`checkpointer`**: Process that performs database checkpoints
- **`walwriter`**: Process that writes WAL data to disk
- **`background worker`**: Custom background processes

### I/O Objects

The view tracks I/O on different types of database objects:

- **`relation`**: Tables, indexes, and other relation data
- **`temp relation`**: Temporary tables and indexes (local buffers)
- **`wal`**: Write-Ahead Log data (new in PostgreSQL 18)

### I/O Contexts

Different operational contexts affect how I/O is performed:

- **`normal`**: Standard database operations
- **`bulkread`**: Bulk read operations (sequential scans, COPY)
- **`bulkwrite`**: Bulk write operations (COPY, CREATE TABLE AS)
- **`vacuum`**: Vacuum and analyze operations
- **`init`**: Database initialization operations (new for WAL tracking)

## Basic Usage and Queries

Let's explore how to use `pg_stat_io` to monitor your database's I/O performance.

### Viewing Overall I/O Activity

Start by looking at the basic structure of the view:

```sql
-- See what's in pg_stat_io
SELECT backend_type, object, context, reads, writes
FROM pg_stat_io
WHERE reads > 0 OR writes > 0
LIMIT 10;
```

This quick peek helps you confirm which backends and objects are currently active before diving deeper into analysis.

Next, look at which areas have the most activity:

```sql
-- Find busiest backend types
SELECT backend_type, SUM(reads + writes) AS total_operations
FROM pg_stat_io
GROUP BY backend_type
ORDER BY total_operations DESC;
```

This aggregates activity across backend types, so you can immediately spot which processes are generating the heaviest load.

### Analyzing Buffer Cache Efficiency

Check how well your buffer cache is working:

```sql
-- Simple cache hit ratio check
SELECT
    backend_type,
    reads,
    hits,
    (hits * 100 / (reads + hits)) AS hit_percent
FROM pg_stat_io
WHERE object = 'relation' AND reads + hits > 0
ORDER BY hit_percent;
```

This ratio gives you a quick sense of how effective your shared buffers are. A low number hints at cache pressure or large scans.

A hit percentage below 90% suggests you might need more `shared_buffers` or have queries doing large scans.

### Monitoring WAL I/O Activity

See which processes are writing the most WAL data:

```sql
-- Check WAL activity (PostgreSQL 18+)
SELECT
    backend_type,
    writes,
    pg_size_pretty(write_bytes) AS wal_volume
FROM pg_stat_io
WHERE object = 'wal' AND writes > 0
ORDER BY write_bytes DESC;
```

This query makes WAL writers visible, showing where the bulk of log traffic is coming from. It helps identify if your WAL generation is excessive, which can impact performance and disk space.

## Per-Backend I/O Monitoring

PostgreSQL 18's new per-backend functions let you see which specific connections are using the most I/O.

### Finding High I/O Sessions

First, find your current process ID:

```sql
SELECT pg_backend_pid();
```

Then check its I/O activity:

```sql
-- Check I/O for your current session
SELECT object, context, reads, writes, pg_size_pretty(read_bytes + write_bytes) AS total_io
FROM pg_stat_get_backend_io(pg_backend_pid())
WHERE reads > 0 OR writes > 0;
```

Running this in your own session gives an immediate breakdown of the I/O you personally generate.

To see all active sessions with I/O:

```sql
-- Find sessions doing I/O
SELECT
    a.pid,
    a.usename,
    a.application_name,
    SUM(i.reads + i.writes) AS operations
FROM pg_stat_activity a,
     pg_stat_get_backend_io(a.pid) i
WHERE i.reads > 0 OR i.writes > 0
GROUP BY a.pid, a.usename, a.application_name
ORDER BY operations DESC;
```

You can experiment with this query and add more filters to focus on specific users or applications.

### WAL Activity by Session

Check which sessions are generating WAL:

```sql
-- See WAL generation per session
SELECT
    a.pid,
    a.usename,
    w.wal_records,
    pg_size_pretty(w.wal_bytes) AS wal_size
FROM pg_stat_activity a,
     pg_stat_get_backend_wal(a.pid) w
WHERE w.wal_records > 0
ORDER BY w.wal_bytes DESC;
```

Here you see exactly which connections are responsible for churning out WAL, a common culprit in replication lag and disk usage spikes.

## Configuration and Timing

To get detailed timing information from `pg_stat_io`, you need to enable timing collection.

### Enabling I/O Timing

Before you can see how much time queries spend waiting on I/O, you need to turn on timing collection. PostgreSQL exposes this through two configuration parameters (`track_io_timing` and `track_wal_io_timing`), which you can check and enable as follows:

```sql
-- Check if timing is enabled
SHOW track_io_timing;
SHOW track_wal_io_timing;

-- Enable timing (requires superuser)
SET track_io_timing = on;
SET track_wal_io_timing = on;
```

Test the timing overhead first:

```bash
# Command line tool to test timing overhead
pg_test_timing
```

With timing enabled, you can see time spent on I/O:

```sql
-- View timing information
SELECT
    backend_type,
    reads,
    read_time,
    writes,
    write_time
FROM pg_stat_io
WHERE reads > 0 OR writes > 0
ORDER BY (read_time + write_time) DESC;
```

This query shows how much time is spent on I/O operations, helping you identify slow queries or processes.

### Resetting Statistics

Whenever needed, you can reset the I/O statistics to start fresh:

```sql
-- Reset all I/O statistics
SELECT pg_stat_reset_shared('io');

-- Or reset for a specific backend (replace 12345 with actual PID)
SELECT pg_stat_reset_backend_stats(12345);
```

This is useful after making configuration changes or when establishing new performance baselines.
