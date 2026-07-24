---
title: The Dangers of Testing in SQLite as a Postgres User
description: Use Neon instead for running lightweight Postgres tests
excerpt: >-
  SQLite is genuinely an incredible piece of technology. Instead of having a
  list of which companies used the database, the SQLite site simply tells you
  its on every Android phone, every iPhone, in every browser, in every Mac, in
  every Windows machine. “Billions and billions of cop...
date: '2025-02-17T18:46:05'
updatedOn: '2025-02-20T02:50:53'
category: postgres
categories:
  - postgres
authors:
  - brian-holt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/testing-sqlite-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The Dangers of Testing in SQLite as a Postgres User - Neon
  description: >-
    SQLite is simple and lightweight, so it's tempting to use it for testing—but
    if you're actually running Postgres, this is not the best idea.
  keywords: []
  noindex: false
  ogTitle: The Dangers of Testing in SQLite as a Postgres User - Neon
  ogDescription: >-
    SQLite is simple and lightweight, so it's tempting to use it for testing—but
    if you're actually running Postgres, this is not the best idea.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/testing-sqlite-postgres/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/testing-sqlite-postgres/neon-dangers-sqlite-1-1024x576-2fc2bb7f.jpg)

SQLite is genuinely an incredible piece of technology. Instead of having a list of which companies used the database, the [SQLite site](https://www.sqlite.org/mostdeployed.html) simply tells you its on every Android phone, every iPhone, in every browser, in every Mac, in every Windows machine. _“Billions and billions of copies of SQLite exist in the wild.”_

Why? Because it’s simple and lightweight. The library comes in at just 750KiB with no server processes. You are running it in-memory and just writing to regular on-disk files.

These are the reasons it’s so commonly used in testing. You can spin up an entirely new database for each test, run your queries in complete isolation, and tear it down afterward without worrying about cleanup or state persistence. There’s no need to manage connection pools, configure users, or deal with network latency–everything happens right there in your application’s process.

But, this convenience comes with hidden costs for Postgres users. While SQLite is an excellent database, its differences from Postgres can lead to false confidence in your tests. SQL isn’t the same across all implementations, and the in-memory vs client-server models in SQLite and Postgres have performance implications.

Here, we want to lay out some of these gotchas and a way to run lightweight Postgres-native tests.

## The dialect differences between SQLite and Postgres

When you just call it “Postgres” all the time, it can be easy to forget that _PostgreSQL_ is a specific flavor of SQL. PostgreSQL, MySQL, SQL Server, SQLite–they are all variations on the SQL theme. Thus, each one has its own dialect of SQL, with unique features, syntax variations, and behavioral quirks. These differences might seem minor during development but can lead to serious issues in production.

Here are a few places you’ll find SQLite and Postgres diverge.

### Data types and constraints

Let’s say you have a table with an integer column:

```sql
CREATE TABLE test (
    id INTEGER PRIMARY KEY,
    num INTEGER
);
```

You write some code that inserts floating-point numbers into this table:

```python
def insert_number(db, value):
    db.execute("INSERT INTO test (num) VALUES (?)", [value])
```

During testing with SQLite, everything seems fine:

```python
def test_insert():
    # This test passes with SQLite!
    db.execute("INSERT INTO test (num) VALUES (?)", [3.14])
    row = db.fetch_one("SELECT num FROM test")
    assert row [0] == 3.14  # SQLite preserves the float

# Output

"""
collected 2 items / 1 deselected / 1 selected                                                                                                            
test_db.py::test_postgres_rejects_float_as_int PASSED                                                                                              [100%]
============================================================ 1 passed, 1 deselected in 0.50s =============================================================
"""
```

SQLite happily stores the float value 3.14 in your INTEGER column, treating it just like any other number. The test passes, suggesting your code works correctly.

But you’re in for a surprise in production with Postgres. Given the exact same code:

```python
cur.execute("INSERT INTO test (num) VALUES (%s)", [3.14])

# Output
# ERROR:  integer out of range
```

Postgres will raise an error when you try to store a float in an integer column.

Your tests passed because SQLite is forgiving about data types and stores whatever you give it. But Postgres enforces strict type constraints–if you declare a column as INTEGER, it must contain integers.

This is an example of [type affinity](https://www.sqlite.org/datatype3.html) in SQLite. SQLite’s type affinity system automatically converts values between compatible types, prioritizing the declared column type while still accepting a wide range of inputs. This behavior is fundamentally different from Postgres’ strict type checking, which requires exact type matches or explicit type casts. When SQLite encounters a value that doesn’t match the column’s declared type, it attempts to coerce the value rather than rejecting it outright.

### JSON handling

Postgres has rich JSON support with operators like ->> and @>, while SQLite treats JSON as plain text:

```sql
-- Works in PostgreSQL, fails in SQLite
SELECT data->>'name' FROM users WHERE data @> '{"age": 25}';

-- SQLite requires manual JSON parsing
SELECT json_extract(data, '$.name') FROM users;
```

Postgres implements true [JSON types](https://www.postgresql.org/docs/current/datatype-json.html) (json and jsonb) with native parsing and indexing capabilities, while SQLite stores JSON as TEXT and requires explicit parsing functions. The jsonb type in Postgres also enables binary storage and advanced querying features like containment and existence operators, making it significantly more efficient for complex JSON operations.

### Array support

Postgres has native array types, while SQLite doesn’t:

```sql
-- Works in PostgreSQL, fails in SQLite
CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    tags TEXT []
);
INSERT INTO posts VALUES (1, ARRAY ['postgresql', 'database']);
```

SQLite will create the table and pretend it’s an array, but the insert won’t work. In SQLite, you’d typically need to serialize arrays into a delimited string or separate JSON structure, then implement custom logic to handle array operations. This impacts performance and makes it impossible to use Postgres’ array operators like ANY() or ALL() in SQLite tests.

Postgres also has more extensive support for advanced elements in SQL, such as:

- **Window functions**: Postgres offers sophisticated window functions with features like EXCLUDE and GROUPS clauses, frame exclusion options, and custom window frame specifications that aren’t available in SQLite.
- **Materialized views**: Postgres supports materialized views that can persist computed results and be refreshed asynchronously, providing significant performance benefits for complex queries that SQLite cannot match.
- **Full-text search**: While SQLite has basic FTS capabilities, Postgres’ full-text search includes advanced features like text search configurations, custom dictionaries, and ranking functions that make it much more powerful for production search implementations.

## You can’t test performance with SQLite

SQLite is an embedded database that runs in-process with your application. This means there is virtually no startup cost or inter-process communication delay for queries. Conversely, Postgres is a client-server DBMS–even on a local machine, your application must connect via a socket/port, and there’s a separate server process handling queries.

In a test environment, this difference can make SQLite noticeably faster for small operations. A Stack Overflow questioner reported a [test case run 18× faster on SQLite than on Postgres](https://stackoverflow.com/questions/20531494/when-should-sqlite-not-be-used-for-testing-in-django-if-a-different-rdbmse-g-p) (0.5 seconds vs 9.4 seconds).

SQLite’s overhead per query/transaction is lower, which can dramatically speed up test suites. It excels at quick, simple queries on small-to-moderate data sizes. Its lightweight engine is optimized for efficiency with minimal layers. For many read-heavy or simple write operations, SQLite can be faster than Postgres because it avoids network round-trips and uses a lean approach. In fact, SQLite tends to [shine with many small queries](https://sqlite.org/forum/info/28e48ddbb3b3c18988c723fcce59ab6566f9af45514b45d112ad74475271d3b9#:~:text=I%20have%20extensively%20tested%20,similar%20cache%20sizes%20and%20such), often outperforming heavier servers in that scenario.

But as workload complexity grows, Postgres catches up and often surpasses SQLite. Postgres’ query planner and optimizer are far more sophisticated–for complex JOINs, large datasets, or heavy aggregation, Postgres can utilize advanced indexes and parallelism that SQLite lacks. SQLite is swift for _simple_ operations, but PostgreSQL handles _complex_ and large-scale operations more efficiently.

Two other key factors are:

### Transaction and concurrency behavior

SQLite uses a simpler concurrency model with database-level locking, while Postgres provides row-level locking and MVCC. This means code that works fine in SQLite might deadlock in Postgres:

```sql
-- This transaction pattern might work in SQLite but deadlock in PostgreSQL
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- Long operation here
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

While SQLite’s database-level locking is simpler to reason about, it severely limits concurrent access patterns that are common in production environments. SQLite uses file locking and allows only one writer at a time (multiple readers are permitted, but they will be blocked during a write). It doesn’t support true parallel writes; every write transaction locks the entire database file. This greatly simplifies SQLite’s design and reduces overhead, but it means SQLite doesn’t scale with many simultaneous transactions.

The benefit of this single-writer design is low overhead:

<blockquote>
<p><em>The performance characteristics will be very different in most cases. Often faster. It’s typically good for testing because the SQLite engine does not need to take into account multiple client access. SQLite only allowed one thread to access it at once. This greatly reduces a lot of the overhead and complexity compared to other RDBMSs.</em> (<a href="https://stackoverflow.com/a/20531857">Matt Williamson</a>)</p>
</blockquote>

Postgres uses MVCC (Multi-Version Concurrency Control) and can handle many concurrent readers and writers–transactions operate in parallel, row-level locks are used for conflicts, etc. In a test environment, you might not hit SQLite’s concurrency limits if tests run mostly sequentially or with a single thread. But if your test suite runs scenarios with concurrent access or if you run tests in parallel threads/processes, SQLite could become a bottleneck (e.g. “database is locked” errors when two writes collide).

Postgres’ support for concurrency comes at a cost–it spawns processes for connections and allocates more memory. PostgreSQL can use [~10MB of RAM](https://hevodata.com/learn/sqlite-vs-postgresql) per connection just to handle concurrency and caching. In contrast, SQLite has a tiny footprint (the library is under 1MB, and memory usage scales primarily with data size and queries).

### Disk I/O and memory

By default, SQLite writes data to a single disk file. For faster tests, SQLite can even run completely in-memory (if you use the:memory: database or a temp file on a RAM disk)–this eliminates disk I/O, making tests extremely fast. Postgres uses the filesystem and WAL ([write-ahead log](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal)) for durability, which involves more I/O per transaction.

In a typical test (small data sets, frequent setup/teardown of tables), SQLite’s minimal I/O can significantly outperform Postgres’ fsync and logging overhead. But Postgres can be tuned for tests (for example, using unlogged tables or [disabling fsync in a test-only config](https://stackoverflow.com/questions/12934426/postgresql-turn-off-durabilty)) to narrow this gap.

## Neon for performant, Postgres-native testing

So are you stuck with testing either high-performance but low-robustness SQLite or slower-but-correct regular Postgres? Nope, we have good news: you can use [Neon](https://neon.tech/home).

Neon is cloud-native Postgres that combines the developer experience of SQLite’s simplicity with the correctness and power of a real Postgres engine. You don’t have to choose between lightning-fast tests and real-world fidelity. Instead, you can [spin up ephemeral Postgres databases in seconds](https://www.instagres.com), run your tests against the same engine used in production, and tear them down just as quickly.

What you get with Neon:

- **Ephemeral branching for each test**. Neon’s [unique storage layer](https://neon.tech/blog/get-page-at-lsn) lets you create isolated [branches](https://neon.tech/docs/introduction/branching) of your main Postgres database. Think of branching like a lightweight Git checkout: you can instantly clone the state of your database at a particular point in time, run your test suite, and then drop the branch. Because each branch is writable, it’s perfect for test isolation–no conflicts, no leftover state. It also means you can run parallel test suites without stepping on each other’s data.
- **Serverless and on-demand**. With Neon’s [serverless architecture](https://neon.tech/docs/introduction/serverless), you only pay for what you use. The database scales automatically, spinning down when idle and waking up when needed. This translates to a near-zero overhead model for continuous integration or ephemeral environments. You don’t have to maintain idle Postgres instances or worry about licensing costs–Neon handles the provisioning, so you can focus on shipping features.
- **Real Postgres, real performance**. Unlike SQLite, which can mask type constraints or concurrency pitfalls, Neon’s serverless instances run true Postgres under the hood. You get the full suite of Postgres features: strict type checking, JSONB support, arrays, window functions, materialized views, and more. Additionally, you can measure actual Postgres performance characteristics without the in-memory shortcuts of SQLite. Neon even offers high-performance storage and caching layers for production-scale workloads, so your test environment matches the throughput you’ll see in reality.
- **Easy setup, easy teardown**. [Integration with popular CI/CD pipelines is straightforward](https://neon.tech/docs/guides/branching-github-actions). Use Neon’s API or UI to generate a new branch, run your migration scripts, seed your data, and execute your tests. When you’re done, drop the branch to cleanly reclaim resources. No more hacking around local servers, ephemeral Docker containers, or the unpredictability of an embedded database. You keep the convenience of a throwaway test DB, but it’s still Postgres through and through.

Neon offers a sweet spot for developers who want fast feedback loops without sacrificing production fidelity. By combining serverless architecture, instant branching, and genuine Postgres, it lets you test your code the way you actually run it in production—no more surprises when you deploy. Sign up to our Free Plan [here](https://console.neon.tech/signup).
