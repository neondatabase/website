---
title: 'PostgreSQL 18 Asynchronous I/O'
page_title: 'PostgreSQL 18 Asynchronous I/O - Improve Read Performance'
page_description: 'In this tutorial, you will learn about PostgreSQL 18 asynchronous I/O and how to configure it to improve read performance for your database workloads.'
ogImage: ''
updatedOn: '2025-06-21T08:40:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 New Features'
  slug: 'postgresql-18-new-features'
nextLink:
  title: 'PostgreSQL 18 B-tree Skip Scan'
  slug: 'postgresql-18/skip-scan-btree'
---

**Summary**: In this tutorial, you will learn how to configure and use PostgreSQL 18's new asynchronous I/O features to improve database performance for read-heavy workloads.

<Admonition type="important">
 Postgres 18 on Neon will still be running with `io_method = 'sync'` for a while longer, and parts of our sequential scan and prefetch code aren’t yet optimized for Postgres 18. We’re actively working on an improved I/O backend that integrates with the new asynchronous I/O system in Postgres 18, but that will take more time to land.
</Admonition>

## Introduction to PostgreSQL 18 Asynchronous I/O

PostgreSQL 18 introduces asynchronous I/O (AIO) for read operations. This feature changes how PostgreSQL handles disk reads by allowing the database to initiate multiple read operations without waiting for each one to complete before starting the next.

In previous versions, PostgreSQL used synchronous I/O, where each read operation would block until the data was retrieved from disk. While this approach worked well for local storage, it creates bottlenecks when storage has higher latency, such as in cloud environments.

With asynchronous I/O, PostgreSQL can start multiple read operations and continue processing while waiting for the results. This can improve performance for queries that need to read large amounts of data from disk.

## Understanding the Three I/O Methods

PostgreSQL 18 introduces the `io_method` configuration parameter that controls how asynchronous I/O works. You can choose from three options:

### sync: Traditional Synchronous I/O

The `sync` method works the same way as PostgreSQL 17. Reads are synchronous and blocking, using `posix_fadvise()` to provide hints to the operating system about upcoming reads.

Use this method when you want to maintain the exact same behavior as previous PostgreSQL versions or when troubleshooting performance issues.

### worker: Background I/O Workers

The `worker` method uses dedicated background worker processes to handle I/O operations. When your query needs data from disk, PostgreSQL sends the I/O request to an available worker process instead of blocking the main query process.

The `io_workers` parameter controls how many worker processes are available, with a default of 3. The optimal number depends on your workload and hardware.

### io_uring: Modern Linux I/O Interface

The `io_uring` method uses Linux's io_uring interface, available in kernel version 5.1 and later. This method creates a shared ring buffer between PostgreSQL and the Linux kernel, reducing the overhead of system calls.

This method typically provides the best performance but requires a recent Linux kernel and PostgreSQL built with `--with-liburing` support.

## Setting Up Your Environment

Before configuring asynchronous I/O, verify that your PostgreSQL 18 installation includes the necessary features:

```sql
-- Check your PostgreSQL version
SELECT version();

-- Check available async I/O settings
SELECT name, setting, context, short_desc
FROM pg_settings
WHERE name LIKE '%io_%'
ORDER BY name;
```

You should see settings like `io_method`, `io_workers`, `effective_io_concurrency`, and `maintenance_io_concurrency`.

## Configuring Asynchronous I/O

The `io_method` parameter requires a server restart to take effect. First, check your current configuration:

```sql
-- Check current I/O settings
SHOW io_method;
SHOW io_workers;
SHOW effective_io_concurrency;
SHOW maintenance_io_concurrency;
```

Configure the I/O method you want to use:

```sql
-- For worker method (default in Beta 1)
ALTER SYSTEM SET io_method = 'worker';
ALTER SYSTEM SET io_workers = 4;

-- For io_uring method (Linux only, requires liburing)
ALTER SYSTEM SET io_method = 'io_uring';

-- For sync method (traditional behavior)
ALTER SYSTEM SET io_method = 'sync';

-- Adjust I/O concurrency settings
ALTER SYSTEM SET effective_io_concurrency = 16;
ALTER SYSTEM SET maintenance_io_concurrency = 16;
```

After changing `io_method`, restart PostgreSQL:

```sql
-- Check if restart is required
SELECT name, setting, pending_restart
FROM pg_settings
WHERE name = 'io_method';
```

If `pending_restart` shows `t`, restart your PostgreSQL server.

## Creating a Test Environment

To test asynchronous I/O performance, create a workload that requires substantial disk reads:

```sql
-- Install required extensions
CREATE EXTENSION IF NOT EXISTS pg_prewarm;

-- Create test table
CREATE TABLE async_io_test (
    id SERIAL PRIMARY KEY,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    random_num INTEGER,
    filler TEXT DEFAULT repeat('x', 100)
);

-- Insert test data
INSERT INTO async_io_test (data, random_num)
SELECT
    'Performance test data for async I/O - row ' || i,
    (random() * 1000000)::INTEGER
FROM generate_series(1, 500000) AS i;

-- Create indexes
CREATE INDEX idx_async_io_random ON async_io_test(random_num);
CREATE INDEX idx_async_io_created ON async_io_test(created_at);
CREATE INDEX idx_async_io_text ON async_io_test USING gin(to_tsvector('english', data));
```

This creates a table with approximately 75-100 MB of data plus indexes.

## Testing Performance

To test performance differences between I/O methods, you need to ensure you're reading data from disk rather than from PostgreSQL's buffer cache.

### Preparing Tests

```sql
-- Clear statistics
SELECT pg_stat_reset();

-- Clear buffer cache for the test table
SELECT pg_prewarm('async_io_test'::regclass, 'buffer', 'main', NULL, NULL);
```

### Running Tests

Enable timing and run test queries:

```sql
\timing on

-- Test 1: Sequential scan
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT COUNT(*)
FROM async_io_test
WHERE data LIKE '%500000%';

-- Test 2: Index range scan
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT id, data, random_num
FROM async_io_test
WHERE random_num BETWEEN 100000 AND 200000;

-- Test 3: Join operation
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT t1.id, COUNT(t2.id)
FROM async_io_test t1
LEFT JOIN async_io_test t2 ON t1.random_num = t2.random_num
WHERE t1.id < 10000
GROUP BY t1.id;

\timing off
```

Run these tests with different `io_method` settings, restarting PostgreSQL between configuration changes.

### Understanding Results

Look for these metrics in the output:

- **Execution Time**: Total query duration
- **Buffers**: Shared hits vs reads from disk
- **I/O Timing**: Time spent on I/O operations

Enable I/O timing for more detailed information:

```sql
ALTER SYSTEM SET track_io_timing = on;
SELECT pg_reload_conf();
```

## Monitoring Asynchronous I/O Operations

### Checking Background Workers

When using the `worker` method, monitor I/O worker processes:

```sql
-- View background processes
SELECT
    pid,
    application_name,
    backend_type,
    state,
    wait_event_type,
    wait_event
FROM pg_stat_activity
WHERE backend_type LIKE '%worker%'
   OR application_name LIKE '%io%'
ORDER BY backend_type, pid;
```

### System-Level Monitoring

If your PostgreSQL server is running on Linux, you can monitor I/O activity using system tools:

```bash
# Monitor I/O operations (Linux)
iostat -x 1

# Watch PostgreSQL processes
watch 'ps aux | grep postgres'
```

With `iostat`, you can see disk I/O statistics, including read/write operations and latency.

### Available Monitoring Views

PostgreSQL 18 includes new system views to help monitor asynchronous I/O operations. You can query these views to get insights into I/O performance:

```sql
-- Look for AIO-related system views
SELECT schemaname, viewname
FROM pg_views
WHERE viewname LIKE '%aio%'
   OR viewname LIKE '%async%'
   OR viewname LIKE '%io%';
```

Note that some monitoring features may not be available in Beta 1 or could change before the final release.

## Performance Tuning

The exact performance improvements from asynchronous I/O depend on your workload and hardware, but what you can usually do is:

### Adjusting I/O Workers

For the `worker` method, adjust the number of workers based on your system:

```sql
-- For systems with many CPU cores and high I/O latency
ALTER SYSTEM SET io_workers = 8;

-- For smaller systems or fast local storage
ALTER SYSTEM SET io_workers = 2;
```

Start with a worker count around half your CPU cores and adjust based on testing.

### Memory Settings

Configure memory settings to work well with async I/O:

```sql
-- Adjust shared buffers
ALTER SYSTEM SET shared_buffers = '1GB';

-- Increase work memory for large operations
ALTER SYSTEM SET work_mem = '16MB';

-- Enable huge pages if available
ALTER SYSTEM SET huge_pages = 'try';
```

### I/O Concurrency

Async I/O works better with higher concurrency settings:

```sql
-- Increase effective I/O concurrency
ALTER SYSTEM SET effective_io_concurrency = 32;

-- Increase maintenance I/O concurrency
ALTER SYSTEM SET maintenance_io_concurrency = 32;
```

## Troubleshooting

In case you encounter issues with asynchronous I/O, here are some common troubleshooting steps when using PostgreSQL 18's async I/O features:

### io_uring Not Available

If `io_uring` doesn't work, start with the `worker` method instead. Make sure your PostgreSQL is built with `liburing` support:

```sql
-- Test if io_uring is supported
ALTER SYSTEM SET io_method = 'io_uring';
SELECT pg_reload_conf();
```

### No Performance Improvement

If you don't see expected improvements:

1. **Verify cold reads**: Use `pg_prewarm` to clear buffers
2. **Check storage type**: Local NVMe SSDs may show smaller improvements
3. **Sufficient test data**: Dataset should be larger than `shared_buffers`
4. **Monitor actual I/O**: Use `iostat` to verify disk reads

## Performance Results

Asynchronous I/O provides the most benefit in specific scenarios:

- **Cloud storage**: Network-attached storage typically shows 2-3x improvement for cold reads
- **High-latency storage**: Larger improvements with higher base latency
- **Read-heavy workloads**: Sequential scans and large index range scans benefit most
- **Mixed workloads**: Benefits decrease with higher cache hit ratios

The `io_uring` method usually provides the best performance on compatible Linux systems, followed by the `worker` method.

## Current Limitations

As of the PostgreSQL 18 Beta 1 release, asynchronous I/O has some limitations that you should be aware of:

**Read operations only**: Write operations, including WAL writes, remain synchronous.

**Limited access methods**: Supports sequential scans, bitmap heap scans, and maintenance operations like VACUUM. Other access methods may gain support in future releases.

**Platform requirements**: `io_uring` requires Linux kernel 5.1+ and PostgreSQL built with `--with-liburing`.

**Beta status**: Some features may change before the final PostgreSQL 18 release.

## Best Practices

As a general guideline for using asynchronous I/O in PostgreSQL 18, consider the following best practices:

1. Start with the `worker` method as it works on all platforms
2. Test `io_uring` on Linux systems for better performance
3. Use `sync` method only for compatibility testing
4. Size test data larger than your buffer cache
5. Monitor both PostgreSQL and system metrics
6. Adjust worker counts based on your hardware
7. Plan for server restarts when changing `io_method`

## Summary

PostgreSQL 18's asynchronous I/O changes how the database handles disk operations by allowing I/O and computation to overlap. This can improve performance for read-heavy workloads, particularly in environments with higher storage latency.

The three I/O methods provide options for different environments and requirements. Test with your specific workloads to determine which method works best for your use case.

As PostgreSQL 18 moves toward final release, expect continued improvements in monitoring capabilities and potentially expanded async I/O support for additional operations.
