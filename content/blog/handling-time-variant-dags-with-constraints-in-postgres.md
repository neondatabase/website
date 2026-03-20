---
title: Handling Time-Variant DAGs with Constraints in Postgres
description: Using Postgres to manage fleet relationships in real-time
excerpt: >-
  Managing dynamically changing directed acyclic graphs (DAGs) with constraints
  in Postgres enables robust tracking of relationships that evolve over time. At
  traconiq, this pattern is central to how we manage our vehicle fleet, where
  trucks and trailers attach and detach constantl...
date: '2025-10-20T16:34:49'
updatedOn: '2025-10-20T17:11:33'
category: postgres
categories:
  - postgres
  - community
authors:
  - thorsten-ries
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/handling-time-variant-dags-with-constraints-in-postgres/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Handling Time-Variant DAGs with Constraints in Postgres - Neon
  description: >-
    Learn how traconiq uses Postgres on Neon to manage real-time fleet
    relationships, prevent graph cycles, and resolve data conflicts with SQL.
  keywords: []
  noindex: false
  ogTitle: Handling Time-Variant DAGs with Constraints in Postgres - Neon
  ogDescription: >-
    Learn how traconiq uses Postgres on Neon to manage real-time fleet
    relationships, prevent graph cycles, and resolve data conflicts with SQL.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/handling-time-variant-dags-with-constraints-in-postgres/cover.jpg
source:
  wpId: 11287
  wpSlug: handling-time-variant-dags-with-constraints-in-postgres
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/handling-time-variant-dags-with-constraints-in-postgres/neon-handling-time-1024x576-a27f46d0.jpg)

Managing dynamically changing directed acyclic graphs (DAGs) with constraints in Postgres enables robust tracking of relationships that evolve over time. At [traconiq](https://traconiq.ch/de/traconiq-ihre-zentrale-plattform-fuer-den-gesamten-fuhrpark/), this pattern is central to how we manage our vehicle fleet, where trucks and trailers attach and detach constantly, and where data can come from multiple systems with different levels of authority.

We use [Neon](https://neon.com/) serverless Postgres as our operational database layer. Over time, we developed a schema and logic pattern that allows us to:

- Enforce DAG integrity (no cycles, single incoming edges)
- Handle time-variant relationships
- Resolve conflicting data from multiple sources automatically

In this post, we’ll share how we implemented this in Postgres. **The full code is available open source at [traconiq/dags-neon](https://github.com/traconiq/dags-neon).**

## The Use Case: Tracking Fleet Attachments

<Admonition type="info" title="traconiq and Neon">
traconiq manages large-scale fleet operations and real-time logistics data on Neon. Learn more about their use case (and why they picked Neon) [here](https://neon.com/blog/why-traconiq-migrated-from-aws-rds-to-neon).
</Admonition>

In our fleet-management platform, every vehicle acts as a node in a graph, and each attachment (where one vehicle pulls another) is represented as a directed edge from the pulling vehicle to the pulled vehicle. This setup enables us to analyze chains of vehicles, resolve conflicting attachment data, and maintain a time-aware history of all fleet configurations.

Our requirements are simple to describe but complex to enforce:

- **Multiple outgoing edges per vehicle:** a truck can pull several trailers at once.
- **Only one incoming edge per vehicle per time interval:** each trailer can only be attached to one pulling vehicle at a time.
- **No cycles anywhere in the graph:** a vehicle cannot (directly or indirectly) end up pulling itself.
- **Conflicting information must be resolved by priority:** data comes from different systems: manual input, GPS, or automated sensors. Each has a defined authority level.

Here’s how we model this in Postgres.

## Implementing Time-Variant DAGs in Postgres

### Schema design

To represent vehicle attachment history precisely, each edge in the graph stores not only its source and target nodes, but also its validity interval and a priority level used for conflict resolution.

The resulting table, `dags.temporal_edges`, captures the time-varying structure of the fleet and enforces basic data integrity directly at the database layer:

```sql
CREATE TABLE dags.temporal_edges (
    id          serial      PRIMARY KEY,
    source      text        NOT NULL,   -- pulling vehicle id
    target      text        NOT NULL,   -- pulled vehicle id
    valid_from  timestamptz NOT NULL,   -- start of attachment
    valid_to    timestamptz,            -- end of attachment, null = ongoing
    priority    int         NOT NULL,   -- source authority for conflict resolution
    constraint vehicle2vehicle_ck
        check (source <> target),
    constraint vehicle2vehicle_valid_ck
        check ((valid_from < valid_to) OR (valid_to IS NULL))
);
```

This schema leverages Postgres’s native temporal types and constraint system, allowing us to define evolving DAGs with minimal application-level logic.

The basic constraints prevent impossible states:

- a vehicle cannot attach to itself (`source <> target`), and
- validity intervals must make sense (`valid_from` must precede `valid_to`, or `valid_to` can be `NULL` for ongoing connections).

These guarantees ensure that every edge always represents a valid and logically consistent attachment.

For background reading on data types and constraints, see the [Postgres documentation on temporal types and constraints](https://www.postgresql.org/docs/current/datatype-datetime.html).

### Enforcing graph constraints with deferred triggers

To maintain consistency across the entire graph, two key conditions must always hold true:

1. **No cycles**: inserting or updating edges must never create circular dependencies.
2. **Only one incoming edge per node at any time:** a vehicle can only be pulled by one other vehicle during any overlapping time interval.

Both constraints are enforced using deferred constraint triggers. These triggers run automatically after each insert or update, but only at transaction commit, allowing multi-step updates or batch inserts to proceed safely before validation.

```sql
-- Trigger to detect and prevent cycles in the graph
CREATE CONSTRAINT TRIGGER trigger_detect_cycle
AFTER INSERT OR UPDATE ON temporal_edges
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE detect_cycle();

-- Trigger to enforce the single incoming edge per node constraint
CREATE CONSTRAINT TRIGGER trigger_check_single_incoming
AFTER INSERT OR UPDATE ON temporal_edges
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE check_single_incoming_edge();
```

These triggers call the corresponding PL/pgSQL functions, `detect_cycle()` and `check_single_incoming_edge()`, which raise exceptions if violations are detected. The deferred execution model ensures that even complex transactions involving multiple inserts or updates will only commit if all constraints remain valid.

This approach provides both data integrity and transactional flexibility. This is essential for managing evolving DAGs in a live fleet system, where many updates may happen in parallel or from different sources.

To simplify the process of adding new edges while respecting priorities and validity intervals, we provide a helper function:

```sql
add_edge(source varchar, target varchar, valid_from timestamptz, valid_to timestamptz, priority integer)
```

This function automatically adjusts existing intervals when overlaps occur, either truncating, splitting, or deleting edges as needed, depending on their assigned priorities.

[The full function implementations are available in the repo.](https://github.com/traconiq/dags-neon)

### Adding edges and resolving conflicts

Once the constraints and triggers are in place, we can safely insert new edges while relying on Postgres to enforce data consistency and authority rules. Let’s look at concrete examples of how the system resolves overlapping or conflicting attachments.

#### Example 1: Adding a higher-priority edge

Suppose our table currently contains one confirmed attachment:

| source | target | valid_from          | valid_to            | priority |
| ------ | ------ | ------------------- | ------------------- | -------- |
| V001   | V002   | 2025-10-06 08:00:00 | 2025-10-06 12:00:00 | 50       |

Now, we attempt to add a new edge with higher authority:

| source | target | valid_from          | valid_to            | priority |
| ------ | ------ | ------------------- | ------------------- | -------- |
| V003   | V002   | 2025-10-06 10:00:00 | 2025-10-06 13:00:00 | 70       |

- Conflict window: Between 10:00 and 12:00, both edges claim V002 as a target.
- Resolution: The new edge (priority 70) overrides the previous one (priority 50) for the overlapping period.

And the system adjusts the existing records automatically:

| source | target | valid_from          | valid_to            | priority |
| ------ | ------ | ------------------- | ------------------- | -------- |
| V001   | V002   | 2025-10-06 08:00:00 | 2025-10-06 10:00:00 | 50       |
| V003   | V002   | 2025-10-06 10:00:00 | 2025-10-06 13:00:00 | 70       |

<br />The `add_edge()` function truncated the earlier record, ensuring no overlap while preserving full temporal history.

#### Example 2: Adding a lower-priority edge

Now suppose a new edge arrives with lower authority:

| source | target | valid_from          | valid_to            | priority |
| ------ | ------ | ------------------- | ------------------- | -------- |
| V004   | V002   | 2025-10-06 11:00:00 | 2025-10-06 14:00:00 | 30       |

- Conflict window: Between 11:00 and 13:00, this overlaps with the higher-priority edge (V003 → V002)
- Resolution: The lower-priority edge is truncated, only taking effect after 13:00.

The final state ensures that the “one incoming edge per node” rule is always respected, with higher-priority data taking precedence:

| source | target | valid_from          | valid_to            | priority |
| ------ | ------ | ------------------- | ------------------- | -------- |
| V001   | V002   | 2025-10-06 08:00:00 | 2025-10-06 10:00:00 | 50       |
| V003   | V002   | 2025-10-06 10:00:00 | 2025-10-06 13:00:00 | 70       |
| V004   | V002   | 2025-10-06 13:00:00 | 2025-10-06 14:00:00 | 30       |

### Querying and traversing the graph

Once data integrity and conflict resolution are handled, querying the DAG becomes straightforward. Postgres’ SQL syntax and recursive CTEs make it possible to explore both current and historical attachment states directly within the database.

Below are a few example queries from our implementation:

#### Find current attachments at a given time

This query returns all active edges for the specified time window, giving a snapshot of the fleet’s structure at that moment:

```sql
SELECT source, target
FROM dags.temporal_edges
WHERE valid_from <= '2025-10-06 11:00:00+00'
  AND (valid_to IS NULL OR valid_to > '2025-10-06 11:00:00+00');
```

#### Find what a vehicle is pulling

To list all vehicles being pulled by a specific truck at a given time (e.g. for monitoring live operations):

```sql
SELECT target
FROM dags.temporal_edges
WHERE source = 'V004'
  AND valid_from <= '2025-10-06 11:30:00+00'
  AND (valid_to IS NULL OR valid_to > '2025-10-06 11:30:00+00');
```

#### Detect illegal multiple attachments

As a safety check, this query identifies any vehicles that erroneously have more than one incoming edge (which should never happen if the triggers are active):

```sql
SELECT target, COUNT(*)
FROM dags.temporal_edges
WHERE valid_from <= '2025-10-07 12:00:00+00'
  AND (valid_to IS NULL OR valid_to > '2025-10-07 12:00:00+00')
GROUP BY target
HAVING COUNT(*) > 1;
```

#### Recursively explore the fleet DAG

A recursive CTE can be used to traverse the entire DAG starting from a pulling vehicle. This query collects all downstream attachments, direct and indirect, active at a given time. It’s a great example of how SQL recursion and temporal filtering can combine to represent dynamic graphs in Postgres:

```sql
WITH RECURSIVE fleet_dag AS (
  -- Start with the given pulling vehicle at the reference time
  SELECT source, target
  FROM dags.temporal_edges
  WHERE source = 'V001'
    AND valid_from <= '2025-10-08 12:00:00+00'
    AND (valid_to IS NULL OR valid_to > '2025-10-08 12:00:00+00')

  UNION ALL

  -- Recursively find children attached to each target vehicle in the chain
  SELECT e.source, e.target
  FROM dags.temporal_edges e
         JOIN fleet_dag fd ON e.source = fd.target
  WHERE e.valid_from <= '2025-10-08 12:00:00+00'
    AND (e.valid_to IS NULL OR e.valid_to > '2025-10-08 12:00:00+00')
)
SELECT * FROM fleet_dag;
```

## Why This Works in Postgres (and Neon)

Modeling time-variant DAGs directly in Postgres provides a number of advantages for systems like ours:

- Temporal tracking allows complete historical and real-time visibility into vehicle relationships, enabling both live monitoring and retrospective analysis
- PL/pgSQL logic inside functions like `add_edge()` automates conflict resolution and interval updates while maintaining full transactional integrity
- Postgres’ built-in features like range types, recursive queries, and deferred constraints offer the tools needed to manage acyclic, time-varying graphs efficiently at scale
- [Neon’s architecture](https://neon.com/docs/get-started/why-neon) makes this practical in production: serverless compute scales down during idle periods and back up during bursts, while branching supports safe testing of constraint logic or schema evolution without impacting production data<br />

This combination of Postgres features and Neon’s infra provides a clean, reliable pattern for modeling evolving relationships, enforcing data consistency, and maintaining performance as datasets grow. **If you have a similar use case want to explore or adapt this implementation, the complete code example is available here: [https://github.com/traconiq/dags-neon](https://github.com/traconiq/dags-neon)**
