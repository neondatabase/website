---
title: 'PostgreSQL 19 ON CONFLICT DO SELECT'
page_title: 'PostgreSQL 19 ON CONFLICT DO SELECT - Atomic Get-or-Create'
page_description: 'Learn how to use PostgreSQL 19 ON CONFLICT DO SELECT for atomic get-or-create operations without dead rows, extra queries, or CTE workarounds.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 SQL/PGQ Graph Queries'
  slug: 'postgresql-19/sql-pgq-graph-queries'
nextLink:
  title: 'PostgreSQL 19 Temporal Data Operations'
  slug: 'postgresql-19/temporal-data-operations'
---

**Summary**: PostgreSQL 19 adds `ON CONFLICT DO SELECT` to the `INSERT` statement, giving you an atomic get-or-create operation that returns existing rows on conflict without generating dead tuples or requiring CTE workarounds.

## Introduction to ON CONFLICT DO SELECT

Since PostgreSQL 9.5, `INSERT ... ON CONFLICT` has supported two actions: `DO NOTHING` (silently skip the insert) and `DO UPDATE` (modify the existing row). Both have a gap when it comes to a common pattern: insert a row and get back its generated columns, or if the row already exists, get the existing row instead.

`DO NOTHING` swallows the conflict silently - the `RETURNING` clause gives you nothing back for conflicting rows. `DO UPDATE` lets you return the row, but forces a write even when nothing changed, generating dead tuples that VACUUM must clean up.

PostgreSQL 19 closes this gap with `ON CONFLICT DO SELECT`. When a conflict is detected, the existing row is returned through the `RETURNING` clause without any modification. No dead tuples, no extra queries, no CTE gymnastics.

## Sample Database Setup

Let's create a table to demonstrate the feature:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, name) VALUES
    ('alice@example.com', 'Alice Johnson'),
    ('bob@example.com', 'Bob Smith');
```

## Basic Usage

The simplest form inserts a new row or returns the existing one:

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice Johnson')
ON CONFLICT (email) DO SELECT
RETURNING *;
```

Since Alice already exists, the output returns her existing row:

```
 id |       email        |     name      |         created_at
----+--------------------+---------------+----------------------------
  1 | alice@example.com  | Alice Johnson | 2026-04-14 10:00:00.000000
```

If you insert a new user, the row is created and returned as usual:

```sql
INSERT INTO users (email, name)
VALUES ('charlie@example.com', 'Charlie Brown')
ON CONFLICT (email) DO SELECT
RETURNING *;
```

```
 id |        email         |     name      |         created_at
----+----------------------+---------------+----------------------------
  3 | charlie@example.com  | Charlie Brown | 2026-04-14 10:05:00.000000
```

One statement handles both cases. The caller always gets a row back.

## Why Not Just Use DO UPDATE?

The most common workaround before `DO SELECT` was a no-op `DO UPDATE`:

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice Johnson')
ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
RETURNING *;
```

This works, but every conflict generates a dead tuple. PostgreSQL creates a new row version, updates indexes (unless it qualifies for a HOT update), and writes WAL - all for data that did not change. On tables with high conflict rates, this causes measurable bloat and unnecessary I/O.

Benchmarks from the PostgreSQL mailing list show the performance difference:

| Approach | Transactions/sec |
|---|---|
| PL/pgSQL function | 45,092 |
| `ON CONFLICT DO SELECT` | 35,788 |
| `DO NOTHING` + CTE workaround | 28,929 |
| `DO UPDATE` (no-op) | 9,222 |

`DO SELECT` is nearly 4x faster than the no-op `DO UPDATE` approach, and about 24% faster than the CTE workaround.

## The CTE Workaround DO SELECT Replaces

The other common workaround was a CTE that tries the insert and falls back to a select:

```sql
WITH ins AS (
    INSERT INTO users (email, name)
    VALUES ('alice@example.com', 'Alice Johnson')
    ON CONFLICT (email) DO NOTHING
    RETURNING *
)
SELECT * FROM ins
UNION ALL
SELECT * FROM users
WHERE email = 'alice@example.com'
AND NOT EXISTS (SELECT 1 FROM ins);
```

This is verbose, error-prone, and has subtle concurrency windows. `DO SELECT` replaces it with a single, atomic statement.

## Locking Conflicting Rows

If you need to modify the existing row later in the same transaction, you can lock it during the select:

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice Johnson')
ON CONFLICT (email) DO SELECT FOR UPDATE
RETURNING *;
```

All four lock modes are supported: `FOR UPDATE`, `FOR NO KEY UPDATE`, `FOR SHARE`, and `FOR KEY SHARE`.

Without a lock clause, the row is returned without any lock held. This is the right choice for read-and-commit patterns like idempotent API endpoints where you do not need to modify the row afterward.

<Admonition type="note">
Using `FOR UPDATE` or `FOR SHARE` in `DO SELECT` requires `UPDATE` privilege on at least one column in addition to `SELECT` privilege.
</Admonition>

## Filtering with WHERE

You can add a WHERE clause to control which conflicting rows get returned:

```sql
INSERT INTO users AS u (email, name)
VALUES ('alice@example.com', 'Alice Updated')
ON CONFLICT (email) DO SELECT
WHERE u.name != EXCLUDED.name
RETURNING *;
```

Here `EXCLUDED` refers to the row that would have been inserted, and `u` is the alias for the existing table row. If the WHERE condition does not match, `RETURNING` produces no rows for that conflict.

This is useful when you want to detect whether the existing data differs from what you tried to insert.

## Multi-Row Inserts

`DO SELECT` works with multi-value inserts. Each row resolves independently:

```sql
INSERT INTO users (email, name)
VALUES
    ('alice@example.com', 'Alice Johnson'),
    ('dave@example.com', 'Dave Wilson'),
    ('bob@example.com', 'Bob Smith')
ON CONFLICT (email) DO SELECT
RETURNING *;
```

```
 id |       email        |     name      |         created_at
----+--------------------+---------------+----------------------------
  1 | alice@example.com  | Alice Johnson | 2026-04-14 10:00:00.000000
  4 | dave@example.com   | Dave Wilson   | 2026-04-14 10:10:00.000000
  2 | bob@example.com    | Bob Smith     | 2026-04-14 10:00:00.000000
```

You always get back exactly as many rows as you tried to insert. Alice and Bob were existing rows (returned via select), Dave was new (inserted).

## How It Works Under the Hood

`DO SELECT` uses the same speculative insertion mechanism that powers `DO NOTHING` and `DO UPDATE`. PostgreSQL optimistically attempts the insert, checks for arbiter index violations, and if a conflict is found, aborts the speculative tuple and looks up the existing row instead.

The existing row is then fed through the `RETURNING` clause. No separate query runs, and no additional index scan happens beyond what the conflict detection already performed.

This is why `RETURNING` is mandatory with `DO SELECT`. Without it, the operation would be identical to `DO NOTHING` - there is no point selecting a row you are not going to return.

<Admonition type="note">
A plain `RETURNING *` returns the existing row's columns as-is on the select path. Since no modification takes place, there is no difference between "old" and "new" values. The [`OLD` / `NEW` aliases on `RETURNING`](/postgresql/postgresql-18/enhanced-returning) introduced in PostgreSQL 18 still work, but for `DO SELECT` you do not need them.
</Admonition>

## Practical use cases

`ON CONFLICT DO SELECT` is a good fit anywhere you previously wrote a two-step "INSERT then SELECT" or relied on a CTE trick to return the pre-existing row. A few patterns where it tightens the code:

### Idempotent API endpoints

An API that creates a resource but needs to handle retries gracefully:

```sql
INSERT INTO api_keys (user_id, key_hash, label)
VALUES ($1, $2, $3)
ON CONFLICT (key_hash) DO SELECT
RETURNING id, user_id, label, created_at;
```

Client retries get back the same response. No duplicate rows, no error handling needed.

### Tag and Category Resolution

When importing data, you often need to resolve names to IDs:

```sql
INSERT INTO tags (name)
VALUES ('postgresql')
ON CONFLICT (name) DO SELECT
RETURNING id;
```

Previously this required either a lookup-then-insert pattern (with race conditions) or the CTE workaround. Now it is one atomic statement.

### Event Processing with Exactly-Once Semantics

Message processors that need to create entities idempotently:

```sql
INSERT INTO entities (external_id, source, data)
VALUES ($1, $2, $3)
ON CONFLICT (external_id, source) DO SELECT FOR UPDATE
RETURNING *;
```

The `FOR UPDATE` lock means you can safely check and modify the returned row in the same transaction, regardless of whether it was just created or already existed.

## Rules and Constraints

A few things to keep in mind when using `DO SELECT`:

- **RETURNING is required.** `DO SELECT` without `RETURNING` is a syntax error.
- **You must specify a conflict target.** Unlike `DO NOTHING` where the conflict target is optional, `DO SELECT` needs to know which unique constraint or index to use as the arbiter.
- **Only non-deferrable unique indexes work** as conflict arbiters. Same rule as `DO UPDATE`.
- **The RETURNING list is the select list.** You do not get a separate `SELECT` clause. Whatever you put in `RETURNING` is what you get back for both the insert and select paths.

## When to Use Each ON CONFLICT Action

| Action | Use When |
|---|---|
| `DO NOTHING` | You do not need the conflicting row back. Fire-and-forget inserts, bulk loads where duplicates should be silently skipped. |
| `DO SELECT` | You need the row back (inserted or existing) but do not want to modify existing data. Get-or-create patterns, idempotent operations. |
| `DO UPDATE` | You want to change the existing row's data on conflict. True upsert semantics where newer data should overwrite older data. |

## Summary

`ON CONFLICT DO SELECT` fills a gap that has existed since `ON CONFLICT` was introduced in PostgreSQL 9.5. It gives you atomic get-or-create semantics in a single statement, without the dead tuple overhead of `DO UPDATE` or the complexity of CTE workarounds.

## References

- [Commit `88327092`: Add support for INSERT ... ON CONFLICT DO SELECT](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=88327092)
- [PostgreSQL devel docs: INSERT](https://www.postgresql.org/docs/devel/sql-insert.html)
