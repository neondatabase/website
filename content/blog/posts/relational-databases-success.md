---
title: The crushing success of relational databases
description: What's all this hype about Postgres?
excerpt: >-
  Every once in a while, a revolutionary product comes along and changes
  everything. And today, we’re talking about three of these phenomenal products.
  The first one is a document store. The second is a vector database. And the
  third is a graph database. So, three things: document...
date: '2024-08-13T20:27:05'
updatedOn: '2024-08-13T20:27:08'
category: postgres
categories:
  - postgres
authors:
  - andy-hattemer
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/relational-databases-success/cover.jpg
  alt: Post image
isFeatured: false
seo:
  title: The crushing success of relational databases - Neon
  description: >-
    Learn why "Postgres is Enough" and how it's adapting to new challenges,
    potentially simplifying the entire data management stack.
  keywords: []
  noindex: false
  ogTitle: The crushing success of relational databases - Neon
  ogDescription: >-
    Learn why "Postgres is Enough" and how it's adapting to new challenges,
    potentially simplifying the entire data management stack.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/relational-databases-success/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/relational-databases-success/neon-relational-databases-1-1-12ea01fc.jpg)

Every once in a while, a revolutionary product comes along and changes everything.

And today, we’re talking about _three_ of these phenomenal products. The first one is a document store. The second is a vector database. And the third is a graph database.

So, three things: document storage, vector operations, and graph relationships. Documents. Vectors. Graphs. Are you getting it? These are not three separate systems. This is one system, and we are calling it: The Relational Database Management System.

_Wild applause from the SIGMOD audience_

Of course, **the relational database is way cooler than the iPhone**. After all, without the relational model, the iPhone would just be a shiny brick. Relational databases run _everything_ of note in technology: social media platforms, e-commerce giants, financial institutions, to-do app tutorials, everything.

Or, if they don’t, they will. Every few years, a new competitor to relational databases emerges, and every few years, RDBMSes subsume the features of these “Postgres killers” and just get stronger, like an ACID-compliant [Mega-Man](https://en.wikipedia.org/wiki/Mega_Man).

Why? Why does the chorus call of [Postgres is Enough](https://gist.github.com/cpursley/c8fb81fe8a7e5df038158bdfe0f06dbb) ring out every few years?

## Why the relational model (RM) won

> _We predict that what goes around with databases will continue to come around in upcoming decades. Another wave of developers will claim that SQL and the RM are insufficient for emerging application domains. People will then propose new query languages and data models to overcome these problems… [W]e do not expect these new data models to supplant the RM._
>
> (_[Source](https://db.cs.cmu.edu/papers/2024/whatgoesaround-sigmodrec2024.pdf)_)

Back in June 2024, two professors, [Andy Pavlo](https://www.cs.cmu.edu/~pavlo/) from Carnegie Mellon (and [OtterTune](https://ottertune.com/) fame) and [Micheal Stonebraker](https://www.eecs.mit.edu/people/michael-stonebraker/) from MIT (and [VoltDB](https://www.voltactivedata.com/) fame), wrote a paper for SIGMOD Record titled “_What Goes Around Comes Around… And Around…_”

Their argument? The relational model is an all-conquering king. Pretenders may claim the crown, but RM always wins. Part of the motivation for writing this paper was deja vu. Back in 2005, Stonebraker wrote a previous paper, “[What Goes Around Comes Around](https://people.cs.umass.edu/~yanlei/courses/CS691LL-f06/papers/SH05.pdf),” on, you guessed it, how RM will win the database wars. The 20 years between the two papers have seen several new data models and query languages launched that were set to replace, or at least significantly challenge, RDBMSes:

- **MapReduce**: MapReduce was Google’s framework for processing large-scale data, which spawned systems like Hadoop. However, it died about a decade ago due to its limitations, leaving a legacy of HDFS clusters and companies trying to monetize them.
- **Key-value Stores**: Key-value stores provide a simple binary relation of (key, value) pairs. While they offer quick “out-of-the-box” data storage, they are problematic for complex applications, and many have either matured into relational-model systems or are only used for specific problems.
- **Document Databases**: Document databases store collections of semi-structured data like JSON. Despite initial claims of superiority, most have added SQL interfaces and ACID transactions, converging with relational databases.
- **Column Family**: Column-family (or wide-column) databases are a reduction of the document model supporting one level of nesting. However, they face the same criticisms as document databases, and many have deprecated their proprietary APIs in favor of SQL-like languages.
- **Text Search Engines**: Text search engines build full-text indexes on tokenized documents. While specialized systems exist, all leading RDBMSs now support full-text search indexes, generally on par with special-purpose systems.
- **Array Databases**: Array databases manage multi-dimensional data and are popular in scientific computing. Despite their niche market, SQL has incorporated array support, and columnar RDBMSs now dominate many use cases previously targeted by array databases.
- **Vector Databases**: Vector databases often store and query high-dimensional embeddings in AI applications. However, they are essentially array databases with specialized approximate nearest neighbor (ANN) indexes, a feature many RDBMSs have quickly incorporated.
- **Graph Databases**: Graph databases represent and query graph-structured data. While specialized graph databases exist, RDBMSs can simulate graphs using tables, and recent SQL extensions (SQL/PGQ) narrow the functionality gap between RDBMSs and native graph databases.

Stonebraker and Pavlo summarize it thus:

<blockquote>
<p><em>We contend that most systems that deviated from SQL or the RM have not dominated the DBMS landscape and often only serve niche markets. Many systems that started out rejecting the RM with much fanfare (think NoSQL) now expose a SQL-like interface for RM databases. Such systems are now on a path to convergence with RDBMSs. Meanwhile, SQL incorporated the best query language ideas to expand its support for modern applications and remain relevant. </em></p>
<cite><em>(</em><a href="https://db.cs.cmu.edu/papers/2024/whatgoesaround-sigmodrec2024.pdf"><em>Source</em></a><em>)</em></cite>
</blockquote>

This is the core argument for RDBMS: **adaptability**. This adaptability is evident in JSON support for document-like data structures and the introduction of [SQL/PGQ](https://www.postgresql.org/message-id/a855795d-e697-4fa5-8698-d20122126567%40eisentraut.org) for graph queries. The relational model’s ability to expand its capabilities while maintaining its core principles has allowed it to address various data management needs across multiple domains.

Vector indexes are another example. With the release of [pgvector](https://github.com/pgvector/pgvector), Postgres demonstrated once again the adaptability of relational databases to emerging trends. pgvector allows Postgres to efficiently store and query vector embeddings, a crucial feature for AI and machine learning applications. This shows how quickly relational databases can incorporate new capabilities initially touted as advantages of specialized systems.

It also showcases another critical feature: **community**. pgvector is an open-source project that shows how the relational model benefits from a vast and active community of developers, researchers, and users. This extensive ecosystem provides a wealth of tools and extensions that enhance the capabilities of relational databases. This goes beyond extensions to the core of these systems–Postgres is an open-source tool built by the [community](https://www.postgresql.org/developer/core/).

Let’s quickly highlight two other key reasons RDBMSes win. First, **simplicity**. While alternative models often introduce complex structures or APIs, relational databases maintain a straightforward approach based on tables and relationships. The relational model’s tabular structure and SQL’s declarative nature provide a clear and understandable framework for data management.

It’s not always perfect. One of the guiding principles of NoSQL is a better “first five minutes” for developers. NoSQL’s schema-later approach means developers can just add stuff to their database without design. Of course, this leads to more complexity down the line, but the DX of SQL is definitely something that could be improved.

Second, **performance**. One of MapReduce’s killers was when [data warehouses were shown to perform markedly better than Hadoop](https://www.cs.cmu.edu/~pavlo/papers/benchmarks-sigmod09.pdf). More recently, [DuckDB was shown to outperform a leading graph DBMS by up to 10X](https://www.cidrdb.org/cidr2023/papers/p66-wolde.pdf).

Relational databases can compete with and often surpass specialized systems in their domains. Advances in query optimization, indexing techniques, and hardware utilization have allowed relational databases to handle increasingly complex workloads efficiently. This is why [Postgres is used by over 50% of professional developers](https://survey.stackoverflow.co/2024/technology#most-popular-technologies-database-prof).

## Collapsing the stack

There’s a clear “stack” that you’ll set up for a new application. Forget the frontend for a second; on the backend, you’ll have your core database (Postgres and Neon, hopefully), a caching mechanism (Redis, Memcached), and probably some sort of analytics store (ClickHouse or Snowflake). Depending on your use case, you might fold in Algolia for search, Kafka for events, or Pinecone for AI.

This is the way. Why? Because each of these options past Postgres solves a specific problem:

- Caching stores need fast read/write operations for temporary data storage using in-memory data structures.
- Analytics databases need to handle large-scale data processing and complex queries efficiently.
- Events databases must manage high-volume, time-ordered data streams with low-latency ingestion and retrieval.
- Vector stores must index and search high-dimensional vectors, enabling fast similarity search.

However, because of its adaptability and community, Postgres now solves these specific problems. Postgres is Enough.

In some cases, Postgres is literally enough, with the solutions from other data models being absorbed into the system:

- Track events with [NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html).
- Store documents with [json and jsonb](https://www.postgresql.org/docs/current/datatype-json.html).
- Build graph queries with [PGQ](https://www.postgresql.org/message-id/a855795d-e697-4fa5-8698-d20122126567%40eisentraut.org).

But in most cases, it is developers coming up with their solutions that have allowed Postgres to win:

- Vector databases through pgvector.
- Time series databases through [timescaledb](https://www.timescale.com/).
- Columnar analytics through [Hydra](https://github.com/hydradatabase/hydra).
- Caching through [Readyset](https://readyset.io/).
- Message queues through [pgmq](https://github.com/tembo-io/pgmq).
- Superior scaling and performance through [Neon](https://github.com/neondatabase/neon).

Check out [Postgres is Enough](https://gist.github.com/cpursley/c8fb81fe8a7e5df038158bdfe0f06dbb) to see all the current possibilities with Postgres. Choosing Postgres will allow you to build your applications on a single “[data management framework](https://medium.com/@fengruohang/postgres-is-eating-the-database-world-157c204dcfc4)” you already implicitly understand.
