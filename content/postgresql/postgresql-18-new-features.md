---
title: 'PostgreSQL 18 New Features'
page_title: "PostgreSQL 18 New Features: What's New and Why It Matters"
page_description: 'In this tutorial, you will learn about PostgreSQL 18 new features, including asynchronous I/O, UUIDv7 support, virtual generated columns, and more. Discover how these changes will impact performance, development, and operations.'
ogImage: ''
updatedOn: '2025-07-05T07:20:00+00:00'
enableTableOfContents: true
nextLink:
  title: 'PostgreSQL 18 Asynchronous I/O'
  slug: 'postgresql-18/asynchronous-io'
---

**Summary**: PostgreSQL 18 introduces many new features including asynchronous I/O providing significant I/O performance improvements, virtual generated columns, UUIDv7 support, temporal constraints, and enhanced security. This overview covers the major features that impact developers and DBAs.

<CTA title="Postgres 18 is available on Neon [Preview]" description="" buttonText="Deploy it for free" buttonUrl="https://console.neon.tech/app/projects" />

## Introduction

PostgreSQL 18 was officially released on September 25, 2025, marking one of the most significant releases in recent years. This version introduces fundamental changes to how PostgreSQL handles I/O operations, along with numerous developer-friendly features and security enhancements.

The release focuses on three core areas:

- **Performance**: Revolutionary asynchronous I/O and query optimizations
- **Developer Experience**: New features like UUIDv7 and virtual generated columns
- **Operations**: Better upgrades, enhanced monitoring, and improved security

Let's explore what makes PostgreSQL 18 a landmark release.

## Major Performance Improvements

With PostgreSQL 18, we see a major shift in how the database handles I/O operations, particularly for read-heavy workloads. The introduction of asynchronous I/O (AIO) provides up to 2-3x performance improvements in many scenarios.

<Admonition type="comingSoon" title="Support coming soon">
On Neon, PostgreSQL 18 currently runs with `io_method = 'sync'` for stability during the preview period. Full async I/O support is coming soon.
</Admonition>

### [Asynchronous I/O](/postgresql/postgresql-18/asynchronous-io)

PostgreSQL 18 introduces an asynchronous I/O (AIO) subsystem that fundamentally changes how the database handles I/O operations. This represents a major architectural shift from PostgreSQL's traditional synchronous I/O model.

**Key benefits:**

- Up to 2-3x performance improvements for read-heavy workloads
- Reduced I/O latency, especially in cloud environments
- Support for both Linux io_uring and cross-platform worker implementations

```sql
-- New configuration options
SHOW io_method;        -- 'worker', 'sync', or 'io_uring'
SHOW io_workers;       -- Number of I/O worker processes
```

The new `pg_aios` system view allows you to monitor asynchronous I/O operations in real-time.

### [B-tree Skip Scan Support](/postgresql/postgresql-18/skip-scan-btree)

PostgreSQL 18 adds "skip scan" capability to B-tree indexes, enabling faster queries that don't specify all leading index columns.

```sql
-- With index on (region, category, date)
-- This query can now use skip scan:
SELECT * FROM sales WHERE category = 'Electronics' AND date > '2024-01-01';
-- No need to specify 'region' anymore!
```

### Query Optimization Enhancements

- **Smarter OR/IN processing**: Automatic conversion to ANY(array) operations
- **Improved hash joins**: Better performance for table joins
- **Parallel GIN index builds**: Faster creation of indexes for JSON and full-text search
- **Enhanced partitioned table support**: Better pruning and join optimizations

## Developer Experience Improvements

With PostgreSQL 18, developers gain access to several new features that simplify schema design and improve application performance.

### [Virtual Generated Columns](/postgresql/postgresql-18/virtual-generated-columns) (Default)

PostgreSQL 18 makes virtual generated columns the default, computing values on-demand rather than storing them.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    subtotal DECIMAL(10,2),
    tax_rate DECIMAL(5,4) DEFAULT 0.0875,

    -- Virtual by default - computed when read
    total DECIMAL(10,2) GENERATED ALWAYS AS (subtotal * (1 + tax_rate)),

    -- Explicitly stored if needed
    audit_info TEXT GENERATED ALWAYS AS (...) STORED
);
```

**Benefits:**

- Reduced storage requirements
- Faster INSERT/UPDATE operations
- Always up-to-date calculated values
- Stored generated columns can now be logically replicated

### [UUIDv7: Timestamp-Ordered UUIDs](/postgresql/postgresql-18/uuidv7-support)

Native support for UUIDv7 brings the best of both worlds: global uniqueness and database-friendly ordering.

```sql
-- Generate timestamp-ordered UUIDs
SELECT uuidv7();
-- Result: 01980de8-ad3d-715c-b739-faf2bb1a7aad

-- Extract timestamp information
SELECT uuid_extract_timestamp(uuidv7());
-- Result: 2025-06-21 10:20:28.549+01
```

**Why UUIDv7 matters:**

- Better B-tree index performance than random UUIDs
- Natural chronological ordering
- Reduced page splits and improved caching
- Ideal for distributed systems requiring sortable IDs

It is worth noting that `uuidv4()` in this release is now an alias for `gen_rand_uuid`.

### [Enhanced RETURNING Clause](/postgresql/postgresql-18/enhanced-returning)

With PostgreSQL 18, the `RETURNING` clause has been enhanced to allow more flexible access to both old and new values in DML operations.

You can now access both the old and new values in a single `RETURNING` clause, making it easier to track changes.

```sql
-- Get both old and new values in UPDATE
UPDATE users
SET email = 'new@example.com'
WHERE id = 1
RETURNING
    OLD.email as previous_email,
    NEW.email as current_email;
```

### [Temporal Constraints WITHOUT OVERLAPS](/postgresql/postgresql-18/temporal-constraints)

Support for time-based constraints using the WITHOUT OVERLAPS clause.

```sql
-- Prevent overlapping time periods
CREATE TABLE room_bookings (
    room_id INT,
    booking_period tstzrange,
    PRIMARY KEY (room_id, booking_period WITHOUT OVERLAPS)
);
```

## Enhanced Security Features

In addition to performance and developer experience improvements, PostgreSQL 18 introduces several security enhancements for better authentication and data integrity.

### [OAuth Authentication](/postgresql/postgresql-18/oauth-authentication)

PostgreSQL 18 introduces OAuth 2.0 authentication support, allowing integration with modern identity providers.

You configure it in `pg_hba.conf` like other auth methods, and load token validators using the new `oauth_validator_libraries` setting. This adds an extensible option for integrating with identity providers.

### MD5 Deprecation Warning

MD5 password authentication is now deprecated in favor of the more secure SCRAM-SHA-256 method. The MD5 method will still work, but you will be removed in the next major release.

### Enhanced TLS Support

New `ssl_tls13_ciphers` parameter allows fine-grained control over TLS 1.3 cipher suites.

## Operational Improvements

In addition to performance and developer features, PostgreSQL 18 introduces several operational enhancements that simplify management and improve upgrade processes.

### Smoother Major Version Upgrades

PostgreSQL 18 significantly improves the upgrade experience:

**Statistics preservation**: Keep planner statistics during upgrades, eliminating the need for lengthy post-upgrade `ANALYZE` operations which were required in previous versions.

**Enhanced `pg_upgrade`**:

- `--jobs` flag for parallel processing
- `--swap` flag for faster directory operations
- Better handling of large installations

### [Enhanced Query Analysis with EXPLAIN](/postgresql/postgresql-18/enhanced-explain)

PostgreSQL 18 expands the capabilities of the `EXPLAIN` utility, making it easier to understand and optimize query performance.

```sql
-- Now includes buffer usage by default
EXPLAIN ANALYZE SELECT * FROM large_table WHERE id > 1000;

-- Get detailed metrics including CPU, WAL, and read stats
EXPLAIN (ANALYZE, VERBOSE) SELECT * FROM large_table WHERE id > 1000;
```

These improvements help identify costly operations by showing how many shared buffers were accessed, how many index lookups occurred, and how much I/O, CPU, and WAL activity each plan node generated.

PostgreSQL 18 also adds vacuum and analyze timing directly in `pg_stat_all_tables`, plus per-backend statistics for I/O and WAL usage. Logical replication now logs write conflicts and surfaces them in `pg_stat_subscription_stats`, making it easier to diagnose replication issues in real time.

### Improved Monitoring

Some notable monitoring enhancements included in PostgreSQL 18 are:

- Enhanced `pg_stat_io` with byte-level statistics
- Per-backend I/O and WAL statistics
- Better logical replication conflict reporting
- Vacuum and analyze timing in `pg_stat_all_tables`

### Data Checksums by Default

New PostgreSQL 18 clusters enable data checksums by default, providing better data integrity validation.

```bash
# Disable if needed during initialization
initdb --no-data-checksums
```

This change helps catch data corruption issues early, especially in cloud environments where storage reliability can vary.

## Schema Management Enhancements

### [NOT NULL Constraints as NOT VALID](/postgresql/postgresql-18/not-null-as-not-valid)

Add NOT NULL constraints without immediate table scans:

```sql
-- Add constraint without full table scan
ALTER TABLE large_table
ADD CONSTRAINT users_email_not_null
CHECK (email IS NOT NULL) NOT VALID;

-- Validate later with minimal locking
ALTER TABLE large_table
VALIDATE CONSTRAINT users_email_not_null;
```

This is especially useful in production environments where downtime must be minimized. By deferring validation, you can add the constraint instantly and then validate it during off-peak hours with minimal impact on live traffic.

### Enhanced Constraint Features

- Constraints can be marked as NOT ENFORCED
- Better inheritance behavior for NOT NULL constraints
- Support for NOT VALID and NO INHERIT clauses

## Wire Protocol Updates

PostgreSQL 18 introduces wire protocol version 3.2 - the first update since PostgreSQL 7.4 in 2003. While libpq continues to use version 3.0 by default, this enables future client improvements.

## Getting Started with PostgreSQL 18

PostgreSQL 18 is now officially available for preview on Neon. It's an excellent time to:

- Test your applications for compatibility
- Benchmark the new asynchronous I/O features
- Experiment with UUIDv7 and virtual generated columns
- Validate upgrade procedures

Neon supports PostgreSQL 18 as a preview release. While fully functional, we recommend waiting until it exits preview status before upgrading production databases. For current limitations and preview status details, see our [PostgreSQL Version Support Policy](/docs/postgresql/postgres-version-policy#postgres-18-support).

If you want to try it out locally right now, you can spin up a PostgreSQL 18 container using Docker:

```bash
docker run --name pg18 \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:18
```

This will give you a PostgreSQL 18 instance running locally for testing purposes. You can then connect using your favorite PostgreSQL client or `psql`.

## Looking Ahead

PostgreSQL 18 represents a major release that modernizes the database for cloud-native workloads but also maintaining backward compatibility. The asynchronous I/O system alone makes this a compelling upgrade.

Neon will remove the preview designation once the current limitations are addressed, just as we did with PostgreSQL 17.
