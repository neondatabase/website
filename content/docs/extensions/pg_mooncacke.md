---
title: The pg_mooncake Extension
subtitle: Columnstore tables with DuckDB execution for Postgres
enableTableOfContents: true
updatedOn: '2024-10-30'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What is `pg_mooncake`?</p>
<p>How to install `pg_mooncacke` on Neon</p>
<p>How to create and use columnstore tables</p>

</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="https://neon.tech/docs/extensions/pgvector">The pgvector extension</a>
  <a href="https://youtu.be/QDNsxw_3ris?feature=shared&t=2048">YouTube: `pg_mooncake` video demonstration</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://github.com/mooncakelabs/pg_mooncake">`pg_mooncake` GitHub repository</a>
</DocsList>
</InfoBlock>


The `pg_mooncake` extension introduces native columnstore tables to Postgres, enabling high-performance analytics through DuckDB execution. Columnstore tables are stored as Iceberg or Delta Lake tables in object storage, providing a simple and powerful way to handle analytic workloads directly in Postgres.

The extension is maintained by Mooncake Labs and is available for Neon Postgres users.

<CTA />

This guide covers:

- [Key Features](#key-features)
- [Enable the Extension](#enable-the-extension)
- [Usage Examples](#usage-examples)
- [Resources](#resources)

<Admonition type="note">
`pg_mooncake` is an open-source extension available under the permissive MIT license. Mooncake Labs is committed to keeping it free and open, with community contributions welcomed.
</Admonition>

## Key features

- **Native Columnstore Tables**: Supports transactional and batch operations, including inserts, updates, and deletes.
- **DuckDB Execution**: Enables up to 1,000x faster analytic queries compared to standard Postgres tables.
- **Open Table Formats**: Stores data as Iceberg or Delta Lake tables, allowing external engines to query data directly.

## Enable the extension

To enable the `pg_mooncake` extension on Neon, first allow experimental extensions:

```sql
SET neon.allow_unstable_extensions='true';
```

Then, create the extension:

```sql
CREATE EXTENSION pg_mooncake;
```

## Usage Examples

### Create a columnstore table

```sql
CREATE TABLE user_activity (
    user_id BIGINT,
    activity_type TEXT,
    activity_timestamp TIMESTAMP,
    duration INT
) USING columnstore;
```

### Insert Data into a columnstore table

```sql
INSERT INTO user_activity VALUES
    (1, 'login', '2024-01-01 08:00:00', 120),
    (2, 'page_view', '2024-01-01 08:05:00', 30);
```

### Run analytics on columnstore tables

Run aggregates and groupbys:

```sql
SELECT
    activity_type,
    SUM(duration) AS total_duration,
    COUNT(*) AS activity_count
FROM
    user_activity
GROUP BY
    activity_type;
```

### Update and delete rows

**Update rows:**

```sql
UPDATE user_activity
SET duration = 150
WHERE user_id = 1 AND activity_type = 'login';
```

***Delete rows:**

```sql
DELETE FROM user_activity
WHERE activity_type = 'error';
```

### Join with regular tables

```sql
CREATE TABLE users (
    user_id BIGINT,
    username TEXT
);

INSERT INTO users VALUES
    (1, 'alice'),
    (2, 'bob');

SELECT u.username, a.activity_type, a.duration
FROM users u
JOIN user_activity a ON u.user_id = a.user_id;
```

## Resources

- [pg_mooncake GitHub Repository](https://github.com/mooncakelabs/pg_mooncake)
- [Iceberg Table Format Documentation](https://iceberg.apache.org/)
- [Delta Lake Table Format Documentation](https://delta.io/)
