---
title: What is a lakebase?
subtitle: The definition, the defining traits, and why AI agents need a new kind of database
summary: >-
  A lakebase is a serverless database that stores its data on low-cost
  cloud object storage (the lake) in open formats, with compute running
  independently on top. Because no compute node owns the data, databases can be
  created, branched, restored, scaled, and shut down in seconds, which lets AI
  agents run fleets of databases cheaply and safely. Because the data lives on
  the lake, it's also ready for analytics without pipelines. Lakebase Postgres,
  available on Neon and on Databricks, is built on the lakebase architecture.
author: neon-team
enableTableOfContents: true
createdAt: '2026-10-21T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What a lakebase is</p>
<p>The traits that make a database a lakebase</p>
<p>Why AI agents need a lakebase</p>
<p>How a lakebase compares to a lakehouse and a traditional database</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/architecture-overview">The lakebase architecture</a>
<a href="/docs/introduction/neon-and-lakebase">Neon and Lakebase</a>
<a href="/docs/introduction/branching">Branching</a>
<a href="/docs/introduction/scale-to-zero">Scale to zero</a>
</DocsList>
</InfoBlock>

A **lakebase** is a serverless database that stores its data on low-cost cloud object storage (the lake) in open formats, with compute running independently on top.

Moving the database onto the lake has three consequences. Compute owns no data, so it can wake in a few hundred milliseconds, scale with load, and shut down when no one's using it. Copies are pointers into shared storage, so you can branch a whole database in seconds and pay only for what changes. The data is on the lake, so analytics engines can read it without an ETL pipeline.

People and AI agents can create, branch, break, restore, and delete a database as easily as a Git branch, and run thousands of them without paying for idle servers.

![Anatomy of a lakebase. Apps, coding agents, agent tasks, and analysts sit at the top. A layer of stateless Postgres compute (a main branch, an agent branch, an idle branch scaled to zero, and a read replica) sits beside a layer of lakehouse analytics engines. Compute reaches one object storage layer, the lake, through safekeepers and pageservers, and analytics engines read from the same lake. The lake holds transactional row data with full change history alongside analytical column tables](/guides/images/what-is-a-lakebase/lakebase-anatomy.svg 'no-border')

## What makes a database a lakebase

Let's define a lakebase in terms of: how it's built, what that enables for agents, and what you get from keeping your app's data on the same storage as your analytics.

### How it's built

1. **Storage and compute are separate.** Compute is stateless. It runs the queries, caches hot data in memory and on local SSDs, and can be started, stopped, resized, or replaced without losing anything, because it doesn't own the durable copy.
2. **Object storage is the source of truth.** Durability doesn't depend on a disk attached to one machine. Commits are replicated across a quorum of storage nodes, and the full history lives in cloud object storage like Amazon S3. Object storage is cheap, durable, and effectively unlimited, and it keeps a full history of changes. A lakebase keeps object storage off the hot query path, so queries don't pay its latency.
3. **The data is open.** Data on the lake sits in open formats that other engines can read, so it isn't locked inside one vendor's black box.

### What it enables for agents

4. **Serverless by default.** Compute [autoscales](/docs/introduction/autoscaling) with load and [scales to zero](/docs/introduction/scale-to-zero) when idle, then wakes on the next query. There are no instances to size and nothing to babysit.
5. **Instant branching.** A [branch](/docs/introduction/branching) is a full, isolated, writable copy of the database, created in seconds no matter how large the database is. It's a copy-on-write pointer into shared history, so it uses no extra storage until it diverges.
6. **Instant restore.** History is already on the lake, so going back to any point in time is a metadata operation, not a backup copy. You can undo a bad migration or a dropped table in seconds.
7. **Fleet economics.** Creating a database costs almost nothing, and an idle one costs only its storage. That makes large fleets of small databases (one per user, per agent, or per pull request) practical where always-on servers would be too expensive.
8. **Operable by software.** Every operation (create, branch, restore, resize, delete) is an API call that completes in seconds, so an agent can manage the full lifecycle of a database, and a fleet of them, with no human in the loop.

### Analytics on the same data

9. **Rows for transactions, columns for analytics, on one lake.** Your app's data is stored in row format for fast reads and writes, and lands on the same lake in columnar, open table formats for analytics. Lakehouse engines query fresh app data directly, with no nightly exports or fragile sync jobs.


## Questions to ask any database

If you're evaluating a database for agents or for a fleet of apps, these questions separate a lakebase from a database that has only been moved to the cloud:

| Question                                                                          | What a lakebase does                                               |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Where does the durable copy of the data live?                                     | In cloud object storage, not on disks attached to database servers |
| What happens when the database isn't being used?                                  | Compute scales to zero, and you pay only for storage               |
| How long does it take to copy a large production database, and what does it cost? | Seconds, and nothing until the copy diverges                       |
| Can you restore to a point in time without restoring from a backup?               | Yes, in seconds, from history already on the lake                  |
| Can an agent create, branch, and delete databases through an API in seconds?      | Yes, every lifecycle operation is a fast API call                  |
| Can analytics engines read your app's data without an ETL pipeline?               | Yes, because the data lands on the lake in open formats            |
| Is the data in an open format, or locked inside the vendor's storage engine?      | Open                                                               |

## Why agents need a lakebase

Agents are already the biggest creators of databases on Neon: by 2025, [more than 80% of the databases created on Neon](/blog/neon-and-databricks) were created by AI agents, not people. They also use databases differently than people do. A coding agent might create a database for every task, branch it to try a migration, throw away the branch when the test fails, and do it all again a minute later. Agent and app-generation platforms create a database for every user or every project, and most of those databases sit idle most of the time.

Traditional databases tie each database to a provisioned server with its own disk. Copies mean copying data, idle databases still bill for compute, and every new database is a new piece of infrastructure to manage. At agent scale, that means paying for thousands of mostly idle servers.

![A fleet of 24 databases compared. On always-on instances, each database is a provisioned server with its own disk, and all 24 bill for compute around the clock. On a lakebase, idle databases scale to zero, only the 5 that are running queries use compute, and all 24 share one object storage layer](/guides/images/what-is-a-lakebase/lakebase-fleet.svg 'no-border')

A lakebase fits how agents work:

- **One database per task, per user, or per agent.** Creating a database is a fast, cheap API call, and an idle database costs only its storage.
- **A safe place to experiment.** An agent works on its own branch, isolated from production, and the branch is gone when the task is done.
- **An undo button for agent mistakes.** If an agent drops a table or runs a bad migration, [instant restore](/docs/postgres/backup-restore/branch-restore) takes the database back to the moment before it happened. [Protected branches](/docs/guides/protected-branches) and [snapshots](/docs/ai/ai-database-versioning) add guardrails on top.
- **Managed through an API.** Agents can drive the entire lifecycle through an API, an SDK, or an [MCP server](/docs/ai/neon-mcp-server), without opening a console.

![Branches are pointers into shared history. A main branch runs along a timeline, and any point on it can be restored. A preview branch and an agent task branch fork from main and continue independently, writing new storage only for the changes they make. A second agent task branch forks, finishes its work, and is deleted](/guides/images/what-is-a-lakebase/lakebase-branching.svg 'no-border')

## Lakebase vs. lakehouse vs. traditional database

The names are close, but a lakehouse and a lakebase serve opposite sides of the workload divide. A lakehouse brought analytics to open data on object storage. A lakebase brings the database behind your apps and agents to the same lake.

|                              | Traditional database                  | Lakehouse                        | Lakebase                                      |
| ---------------------------- | ------------------------------------- | -------------------------------- | --------------------------------------------- |
| **Workload**                 | Transactions (OLTP)                   | Analytics (OLAP)                 | Transactions, with analytics on the same data |
| **Query shape**              | Small, fast reads and writes          | Large scans and aggregations     | Small, fast reads and writes                  |
| **Where data lives**         | Disks attached to database servers    | Object storage, in open formats  | Object storage, in open formats               |
| **Compute**                  | Provisioned and always on             | Elastic, separate from storage   | Serverless, autoscaling, and scales to zero   |
| **Copying a database**       | Copies all the data, minutes to hours | Not applicable                   | Copy-on-write branch, in seconds              |
| **Point-in-time recovery**   | Restore a backup, then replay logs    | Table time travel                | Instant, from history on the lake             |
| **Cost of an idle database** | Full compute cost                     | Not applicable                   | Storage only                                  |
| **Built for**                | Applications, operated by people      | Analysts, data engineers, and ML | Applications and agents, at fleet scale       |

## Where the term comes from

Databricks [introduced the lakebase](https://www.databricks.com/blog/what-is-a-lakebase) in 2025, building on the architecture that Neon pioneered: separating Postgres compute from storage and making object storage the source of truth. The name follows the [lakehouse](https://www.databricks.com/glossary/data-lakehouse), which moved analytics onto open, low-cost object storage and decoupled query engines from the data. A lakebase makes the same move for the database behind your app.

Lowercase "lakebase" names the category and the architecture, the way "lakehouse" or "data warehouse" does. Any database built this way is a lakebase.

## Lakebase Postgres

Lakebase Postgres is a lakebase built on standard Postgres. To your application, it behaves like the Postgres you already know: the same SQL, drivers, ORMs, and extensions. Underneath, its storage layer is rebuilt for the lake. For how it works, from the write-ahead log to object storage, see [The lakebase architecture](/docs/introduction/architecture-overview). Its storage engine is [open source](https://github.com/neondatabase/neon).

Lakebase Postgres is one product with the same engine and core features, including branching, autoscaling, scale to zero, read replicas, and instant restore, wherever you run it:

- **On Neon**, the database at the center of Neon: a complete set of cloud backend primitives built around Lakebase Postgres, for developers, startups, and agent platforms, from Databricks. Lakebase Postgres runs alongside [Managed Better Auth](/docs/auth/overview), [Object Storage](/docs/storage/overview), [Functions](/docs/compute/functions/overview), and the [AI Gateway](/docs/ai-gateway/overview), and your backend services branch along with your data. Agent platforms that provision databases for their users can use the [Agent Plan](/docs/introduction/agent-plan).
- **On Databricks**, for enterprises, integrated with Unity Catalog governance and the lakehouse. Lakebase Postgres on Databricks can [sync lakehouse tables into Postgres](https://docs.databricks.com/aws/en/oltp/projects/quickstart-synced-tables) for low-latency reads and [store Postgres changes as Delta tables](https://docs.databricks.com/aws/en/oltp/projects/quickstart-lakebase-cdf) with full change history (Public Preview).

On Neon, you can stream changes to analytics systems with [logical replication](/docs/guides/logical-replication-guide). To decide where to run Lakebase Postgres, see [Neon and Lakebase](/docs/introduction/neon-and-lakebase).

## Try a lakebase

You can create a Lakebase Postgres database on Neon in seconds on the Free plan, then branch it, scale it to zero, and restore it to see the lakebase traits for yourself.

<DetailIconCards>
<a href="/docs/get-started/signing-up" description="Sign up and create your first project on Neon" icon="todo">Get started on Neon</a>
<a href="/docs/introduction/branching" description="Create an isolated copy of your database in seconds" icon="split-branch">Branching</a>
<a href="/docs/guides/ai-agent-integration" description="Provision and manage databases for your agents and users" icon="sparkle">Build for agents</a>
<a href="/docs/introduction/architecture-overview" description="See how compute, safekeepers, pageservers, and object storage fit together" icon="data">The lakebase architecture</a>
</DetailIconCards>
