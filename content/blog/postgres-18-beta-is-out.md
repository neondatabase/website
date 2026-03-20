---
title: 'Postgres 18 Beta Is Out: 7 Features You Should Know About'
description: With top-requested improvements in performance and migrations
excerpt: >-
  Postgres 18 Beta 1 just shipped. As with previous major releases, this beta
  includes previews of all features planned for general availability. Read the
  release notes for the full list of updates, but we’re gonna go through some
  highlights on this post. New in Postgres 18 Asynchr...
date: '2025-05-08T21:17:13'
updatedOn: '2025-05-08T21:24:39'
category: postgres
categories:
  - postgres
authors:
  - heikki-linnakangas
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-18-beta-is-out/cover.png
  alt: null
isFeatured: true
seo:
  title: 'Postgres 18 Beta Is Out: 7 Features You Should Know About - Neon'
  description: >-
    Postgres 18 Beta 1 just shipped, and it comes with top-requested
    improvements in performance, migrations, observability, and usability.
  keywords: []
  noindex: false
  ogTitle: 'Postgres 18 Beta Is Out: 7 Features You Should Know About - Neon'
  ogDescription: >-
    Postgres 18 Beta 1 just shipped, and it comes with top-requested
    improvements in performance, migrations, observability, and usability.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-18-beta-is-out/cover.png
source:
  wpId: 9556
  wpSlug: postgres-18-beta-is-out
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-18-beta-is-out/screenshot-2025-05-08-at-21148percente2percent80percentafpm-1024x573-c847530e.png)

<Admonition type="info" title="editor's note">
We’re Postgres contributors in Neon. Postgres 18 includes commits from Heikki Linnakangas (author) and Matthias van de Meent. Thank you to all the Postgres community for making these releases possible.
</Admonition>

[Postgres 18 Beta 1](https://www.postgresql.org/about/news/postgresql-18-beta-1-released-3070/) just shipped. As with previous major releases, this beta includes previews of all features planned for general availability. Read the [release notes](https://www.postgresql.org/docs/18/release-18.html) for the full list of updates, but we’re gonna go through some highlights on this post.

## New in Postgres 18

### Asynchronous I/O

One of the most exciting things about Postgres 18 is the introduction of a new asynchronous I/O subsystem. Until now, all I/O in Postgres has been synchronous: each read blocks query execution until the data arrives. With async I/O, Postgres can issue multiple reads in parallel and continue executing while waiting for the results. This helps reduce CPU wait time and improves throughput.

In Postgres 18, there’ll be three I/O methods you can now choose from via the new io_method setting:

- sync, which keeps the old behavior
- worker, which uses background I/O workers (this is the default)
- io_uring, which bypasses I/O workers and uses a shared ring buffer with the Linux kernel for even lower overhead (Linux-only)

Early benchmarks show 2–3x improvements on read-heavy queries, especially with io_uring. A new view, pg_aios, will let you inspect I/O operations in flight when using async methods.

### Improvements for major version upgrades

This is another impactful change in Postgres 18 for operational teams: pg_upgrade can now retain planner statistics from the old cluster. In previous versions, upgrading meant starting from zero, so query plans would often be suboptimal until a full ANALYZE was run post-upgrade.

Now, unless disabled with –no-statistics, pg_upgrade copies over relation- and column-level statistics so that the planner can make informed decisions right away. Extended statistics aren’t preserved yet, but this change helps avoid degraded performance immediately after an upgrade.

Two new pg_upgrade options will also help reduce downtime in large environments:

- –jobs will allow parallel execution of upgrade checks. This doesn’t affect the data copy phase, but it speeds up preflight validation when there are many objects.
- –swap will change the upgrade mode to swap data directories rather than copying or linking them. This avoids creating duplicates, but modifies the source cluster in place, which may not be suitable in all setups.

### More detailed EXPLAIN output

Postgres 18 also comes with very practical observability features. EXPLAIN ANALYZE includes new runtime details:

- Buffer and I/O usage is shown by default
- Index scan nodes now report how many index lookups were performed
- In VERBOSE mode, you’ll see WAL writes, CPU time, and average read timing

### New stats for vacuum and analyze

Continuing with the observability improvements, here’s another useful one: pg_stat_all_tables in Postgres 18 now reports how much total time has been spent on vacuuming and analyzing each table, including automatic runs. You’ll see these as total_vacuum_time, total_autovacuum_time, and similar columns.

If you enable track_cost_delay_timing, you also get more precise logging of delays in pg_stat_progress_vacuum, pg_stat_progress_analyze, and autovacuum logs.

### UUIDv7 generation

There’s also a new uuidv7() function to generate timestamp-sortable UUIDs. These are useful for ordered inserts or caching layers that benefit from chronological keys. Postgres also added uuidv4() as an alias for gen_random_uuid() for clarity.

### Performance improvements

With each major version, Postgres gets new performance improvements. For this release, a few highlights are parallelizable GIN index builds, which help speed up building your full-text search, JSON or array indexes; the newly added skip scan support in btree indexes; and the transformation of IN(VALUES) and repeated OR filters into ANY(array) operations.

### OAuth support

One last highlight: Postgres 18 also adds a new oauth authentication method. This allows clients to authenticate using OAuth 2.0 tokens, with validation handled via a plugin interface. You configure it in pg_hba.conf like other auth methods, and load token validators using the new oauth_validator_libraries setting. This adds an extensible option for integrating with identity providers.

## Postgres 18 will be available on Neon as soon as it’s stable

As always, we plan to make Postgres 18 available on Neon as soon as the final release is out. When Postgres 17 shipped, [we had support ready within a few hours.](https://neon.tech/blog/postgres-17) We expect to do the same this time.

But as always, the Postgres community encourages testing against real workloads. You can spin up a local Postgres 18 beta instance and try it out. Read the [official release notes](https://www.postgresql.org/docs/18/release-18.html), and if you hit issues, [file a bug](https://www.postgresql.org/account/submitbug/). You’ll be helping make Postgres better.

---

[Neon](https://neon.tech/home) _is a serverless Postgres platform with instant provisioning, branching, and autoscaling._ [Get started on our free plan](https://console.neon.tech/signup) _and spin up a fully-confured Postgres instance in seconds._
