---
title: The pg_uuidv7 extension
subtitle: Generate and manage time-ordered version 7 UUIDs in Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.754Z'
tag: new
---

The `pg_uuidv7` extension allows you to generate and work with version 7 Universally Unique Identifiers (UUIDs) in Postgres. UUIDv7 is a newer UUID format designed to be time-ordered and sortable, which offers significant benefits for database performance, especially when used as primary keys or in time-series data.

Unlike traditional random UUIDs (like Version 4), UUIDv7 embeds a Unix timestamp in its leading bits, followed by random bits. This structure ensures that newly generated UUIDs are roughly sequential, which is highly beneficial for database indexing (e.g., B-trees) and can improve data locality, leading to faster queries and insertions.

<CTA />

## Enable the `pg_uuidv7` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Core functions

The `pg_uuidv7` extension provides a concise set of functions for generating and manipulating version 7 UUIDs.

### `uuid_generate_v7()`

This is the primary function for generating new version 7 UUIDs. It creates a UUID incorporating the current Unix timestamp (with millisecond precision) in its most significant bits, followed by randomly generated bits for the remainder.

```sql
SELECT uuid_generate_v7();
-- 0196ce37-0758-736d-a33b-ad3f017359e3 (example output)
```

### `uuid_v7_to_timestamptz(uuid_v7 UUID)`

This function extracts the embedded timestamp from a version 7 UUID and returns it as a `TIMESTAMPTZ` (timestamp with time zone) value.

```sql
SELECT uuid_v7_to_timestamptz('0196ce37-0758-736d-a33b-ad3f017359e3');
-- 2025-05-14 09:53:55.032+00
```

### `uuid_timestamptz_to_v7(ts TIMESTAMPTZ, zero_random_bits BOOLEAN DEFAULT false)`

This function converts a given `TIMESTAMPTZ` value into a version 7 UUID. It takes two arguments:

1. `ts TIMESTAMPTZ`: The timestamp to embed in the UUID.
2. `zero_random_bits BOOLEAN` (optional, defaults to `false`):
   - If `false` (default), the random bits portion of the UUID will be filled with new random data. This is useful for creating a UUID tied to a specific past or future time but still unique.
   - If `true`, the random bits portion of the UUID will be set to all zeros. This is particularly useful for creating boundary UUIDs for time-range queries (e.g., the earliest possible UUID for a given timestamp).

#### Generating a UUID for a specific timestamp with random bits

```sql
SELECT uuid_timestamptz_to_v7('2025-05-14 10:53:55.032+00');
```

Example output (random part will vary):

```text
 uuid_timestamptz_to_v7
--------------------------------------
 0196ce6d-f5d8-7a89-8e7a-06b371fc5d70
(1 row)
```

#### Generating a boundary UUID for a specific timestamp (random bits zeroed)

```sql
SELECT uuid_timestamptz_to_v7('2025-05-14 10:53:55.032+00', true);
```

Example output (random part will be fixed):

```text
 uuid_timestamptz_to_v7
--------------------------------------
  0196ce6d-f5d8-7000-8000-000000000000
(1 row)
```

## Key advantages of UUIDv7

Using version 7 UUIDs in your database schema can provide several advantages over traditional UUIDs, especially in scenarios where time-based ordering is important. Here are some key benefits:

1.  **Improved Indexing performance:** Because UUIDv7s are time-ordered, new entries are typically inserted towards the end of an index (e.g., a B-tree index on a UUIDv7 primary key). This leads to better data locality, reduced page splits, and less index fragmentation compared to random UUIDs (like v4). This can significantly boost insert performance and make range scans more efficient.
2.  **Natural sortability:** UUIDv7s can be sorted chronologically by their value, which is useful for ordering records by creation time without needing a separate timestamp column for this purpose.
3.  **Distributed systems friendliness:** Like all UUIDs, v7 can be generated independently across multiple nodes without coordination, ensuring global uniqueness. The time-ordered property adds benefits for distributed databases that might later need to merge or sort data by generation time.

## Example usage

Let's explore some common use cases for `pg_uuidv7`.

### Using UUIDv7 as a primary key

UUIDv7 is an excellent candidate for primary keys, especially for tables where data is often queried or inserted based on time.

```sql
CREATE TABLE events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    event_type TEXT NOT NULL,
    event_data JSONB
);

INSERT INTO events (event_type, event_data) VALUES
    ('user_login', '{"user_id": 101, "ip": "192.168.1.10"}'),
    ('page_view', '{"user_id": 101, "url": "/products/awesome-widget"}'),
    ('purchase', '{"user_id": 205, "item_id": "XYZ123", "amount": 99.99}')
RETURNING event_id, event_type;
```

Example output:

```text
               event_id                              | event_type
--------------------------------------+------------
 0196e801-a0d6-7af7-a308-13057189ef3f | user_login
 0196e801-a0ec-7cf7-a4f2-2a4a73c58688 | page_view
 0196e801-a0ed-7fdb-9858-dcd601cadc26 | purchase
(3 rows)
```

Notice how the `event_id` values are largely sequential, reflecting their insertion order.

### Time-range queries

The ability to convert timestamps to UUIDv7s (especially with zeroed random bits) is very useful for performing efficient time-range queries directly on the UUIDv7 primary key.

Suppose we want to find all events that occurred between May 14, 2025, and May 24, 2025. We can use the `uuid_timestamptz_to_v7()` function to create boundary UUIDs for our query:

```sql
SELECT *
FROM events
WHERE
    event_id >= uuid_timestamptz_to_v7('2025-05-14', true) -- Start of May 14th
  AND
    event_id < uuid_timestamptz_to_v7('2025-05-24', true); -- Start of May 24th
```

This query can efficiently use an index on `event_id` to find matching records.

## Comparison with UUID4

UUIDv4 is purely random. While excellent for uniqueness, its randomness leads to poor index locality and fragmentation when used as a primary key for time-sensitive data. UUIDv7 directly addresses this by being time-ordered.

## Conclusion

The `pg_uuidv7` extension provides a robust and efficient way to work with version 7 UUIDs in Postgres. By embedding a timestamp, UUIDv7s offer the global uniqueness of traditional UUIDs while also being chronologically sortable. This makes them an excellent choice for primary keys and indexed columns in applications where time-ordering and query performance on time-based data are critical.

## Resources

- [fboulnois/pg_uuidv7 GitHub repository](https://github.com/fboulnois/pg_uuidv7)
- [UUID version 7](https://datatracker.ietf.org/doc/html/draft-ietf-uuidrev-rfc4122bis#name-uuid-version-7).
- [uuid-ossp](/docs/extensions/uuid-ossp)

<NeedHelp />
