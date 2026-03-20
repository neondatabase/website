---
title: Zero-ETL lakehouses for Postgres people
description: From monolithic OLTP to a wide stack
excerpt: >-
  Neon is made by Postgres people. Since Neon became part of Databricks, we
  Postgres people also find ourselves part of a larger organisation of
  enterprise data people. This post is about what I’ve learned as a result. It
  aims to explain ‘data lakehouses’ and related enterprise-dat...
date: '2026-01-12T18:43:54'
updatedOn: '2026-01-16T17:05:56'
category: postgres
categories:
  - postgres
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/zero-etl-lakehouses-for-postgres-people/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Zero-ETL lakehouses for Postgres people - Neon
  description: >-
    A Postgres engineer’s guide to understanding lakehouses, OLAP tooling, and
    the shift from monolithic databases to layered stacks.
  keywords: []
  noindex: false
  ogTitle: Zero-ETL lakehouses for Postgres people - Neon
  ogDescription: >-
    A Postgres engineer’s guide to understanding lakehouses, OLAP tooling, and
    the shift from monolithic databases to layered stacks.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/zero-etl-lakehouses-for-postgres-people/social.jpg
source:
  wpId: 12177
  wpSlug: zero-etl-lakehouses-for-postgres-people
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Neon is made by Postgres people. Since Neon became [part of Databricks](https://neon.com/blog/neon-and-databricks), we Postgres people also find ourselves part of a larger organisation of enterprise data people.

This post is about what I’ve learned as a result. It aims to explain ‘data lakehouses’ and related enterprise-data tooling in terms that make sense if your mental model starts with Postgres.

The TL;DR is:

- There’s a wide and fast-moving world of data analysis tools adapted for cheap and performant (but usually still ACID) processing of large data sets (OLAP).
- Unlike Postgres, these tools are not monolithic. Different tools can be slotted together to form a wide range of stacks.
- You can call such a stack a ‘data lakehouse’. The idea is that it provides the high utility of a ‘data warehouse’ for the low cost and effort of a ‘data lake’.
- There’s a growing range of tools to bridge Postgres and data lakehouses. These tools can copy (ETL) data between these systems, or do combined analysis across them.

For the longer version: read on.

## T is for transactions, A is for analysis

In enterprise data speak, OLTP and OLAP are contrasting models of data processing. It’s fair to say that these are not my favourite initialisms. The repeated letters O, L and P are mostly filler, and you can safely bin them (for the record, they stand for OnLine and Processing).

What you’re left with is the letters T and A, representing Transactions vs Analysis. This is a distinction you’ve probably been making for years, even if you didn’t use those 8 letters to make it. I once collected app data for a research project in a Postgres database, fed by a Ruby API, all running on a $30/month VPS. It turns out this was, on a small scale, OLTP.

When it came to analyse the data, I installed Postgres on a cheap Linux box under my desk, set a much higher `work_mem` than the default, and toyed with the idea of disabling `fsync`. Then I restored a snapshot from a pg_dump backup and got to work joining some big administrative and spatial data sets. It turns out this was, on a small scale, OLAP.

For transactions (OLTP), you want a system that’s real-time, reliable and robust (ACID). Traditional relational databases like Postgres are great at that: it’s why they exist. For analysis (OLAP) ACID is also becoming a must-have, but the number one ask is the ability to handle a lot of data all at once. And traditional relational databases like Postgres may do fine at that, up to a point, as we saw above.

In fact, doing data analysis with ordinary relational database software has an initialism of its own: ROLAP (= Relational OLAP). A key advantage of ROLAP is that you’re using the same technology for transactions and analysis and, since it’s a technology you and your organisation already understand, you don’t need to develop a completely new area of expertise.

But, in general, systems designed specifically for OLAP can handle more data, and handle it quicker and cheaper. And, in general, they do that by grouping related data together. First, they’re usually column- instead of row-oriented: they’ll store a bunch of values from a table’s first column together, then a bunch of values from the second column, and so on. That means they can read and aggregate particular columns (or sets of columns) quicker, with less reading from and seeking across the underlying storage.

Second, they’re typically also time-oriented. So rather than store **all** values of the first column, and then **all** values of the second column, and so on, the data get organised in a series of chunks corresponding to time periods. For example, data in an OLAP system might be stored in chunks each corresponding to a day, week, month or quarter, and then use a column-oriented data layout within each chunk.

This sort of time-orientation is well suited to the ways an enterprise’s datasets tend to get both into and out of the system. On the way in, a nightly batch job that takes OLTP datasets and extracts, transforms and loads them into an OLAP system naturally gives rise to day-sized chunks, for example. And on the way out, many queries to an OLAP system will relate to specific time periods (e.g. sales this month vs sales for the corresponding month last year). So having the underlying data chunked by time periods helps performance and lowers costs by again minimising reads and seeks.

Third, it’s commonly also possible to explicitly partition data sets based on how you expect them to be accessed. For example, if you know that most queries will relate to individual users, you can explicitly spread your data across 10 or 100 partitions, keeping each individual user’s data together on one partition. Any query filtering by a specific user ID can then safely ignore 90 or 99% of the data in the system.

## H is for having our cake and eating it?

Is it possible to combine the strengths of transactional and analytical data systems into a single system? It’s an obvious enough idea to spawn yet another name/initialism: Hybrid Transactional/Analytical Processing or HTAP. But if we accept the general premise that OLTP is naturally row-oriented while OLAP performs better with column-oriented data, a system that’s best-in-class at both things is going to be hard to pull off.

Unless, of course, the problem is solved by the trick of exposing a single user-visible interface on top of what are basically separate OLTP and OLAP systems behind the scenes, and duplicating your data between the two. A few vendors have marketed HTAP systems that seem to work in essentially that way, but these systems [are not conquering the market](https://www.mooncake.dev/blog/htap-is-dead).

Perhaps that’s because it is, thankfully, rare to use the same system to both commit new transactions _and_ do meaningful data analysis. After all, running big data analysis jobs on your production database risks (a) turning into a denial-of-service attack and (b) having a fat-fingered DROP or UPDATE destroy production data. And once it’s established that transactions and analysis need separate systems, the benefits of being able to use the same software or service for both might well be outweighed by the cost (e.g. in data duplication) of having each system support a use-case you don’t need.

So rather than HTAP, momentum seems to be with two other things that, in combination, provide pretty similar benefits.

The first is ‘zero ETL’. ETL means Extract, Transform and Load. This represents the process of exporting data from one system and importing it into another. Since OLAP systems commonly work on data generated by OLTP systems, ETL jobs usually move data in that direction, from OLTP to OLAP (while ‘reverse ETL’ tends to mean the same thing, but with data flowing the other way, from OLAP back into OLTP).

The idea of zero ETL is that, if you still need ETL at all, it should be ETL that happens without manual intervention, effortlessly and in real-time. It’s automatic data sync from one system to another. Zero ETL between OLTP and OLAP effectively gives you an HTAP system — just one that explicitly separates its OLTP and OLAP elements and (at least for now) copies the data between them.

The second thing with some momentum behind it is the category of ‘data lakehouses’.

## Lakes and warehouses

Where large-scale data analysis in enterprises is concerned, you’ve probably heard about ‘data warehouses’ and ‘data lakes’.

A data warehouse is simply an OLAP-capable database that contains information you want to analyse: probably some or all of your organisation’s OLTP data, plus maybe some data from other sources too. A data warehouse is a highly structured and curated thing, subject to strict access controls, constantly updated with new data fed in from the contributing transactional and other systems via ETL jobs. Think: highly-paid DBAs administering highly-priced enterprise database systems for the use of highly-prized Business Intelligence (BI) experts.

A data lake, by contrast, is … a place where you put old data. On the plus side, that could be flexible and cheap. But you might fairly worry that data lakes are the outcome of hundreds of conversations that end with the words “OK, dump it in S3 and move on”.

So the archetypal data warehouse is high-effort, high-cost and (hopefully) high-utility: a place where your former OLTP data is hard at work producing business insights. The archetypal data lake is low-effort, low-cost and (likely) low-utility: a place where your former OLTP and other data remains just about accessible, in its original format, just in case some future decision-maker has a desperate urge to see it fished out and resurrected.

Can we have our cake and eat it this time? Well, I’m glad you asked. Because that’s the premise and the promise of the [data lakehouse](https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf). It’s the idea that you can have most of the high utility of a data warehouse — structured data ready to generate insights at the drop of a SQL query — at not much more than the low cost of a data lake. (And yes, as has been [said on HN](https://news.ycombinator.com/item?id=38812891), a data lakehouse “sounds like where upper class data goes in the summer to take their data-boats data-fishing”. But isn’t that so much more aspirational than a warehouse? And with no new initialisms in sight).

How is this [cakeist](https://en.wiktionary.org/wiki/cakeist) magic achieved? Primarily via tools that can run a fast SQL query — and even offer niceties like schema evolution, point-in-time snapshots, and ACID guarantees — all while sitting atop little more than raw data files, in a mix of formats, in an object store like S3.

These tools promise that investing just a little bit of structure, curation and thought in your data lake can pay you back a complete, OLAP-ready, virtual data warehouse. So how do these tools work?

## Lakehouse technology stacks

As a Postgres wonk, you’re probably used to the data side of your tech stack not taking an unreasonably large amount of thought. Just Use Postgres? Check.

But the data lakehouse architecture unbundles an OLAP database into a somewhat bewildering stack of data formats, software and services. There’s a good reason for this unbundling. It’s the same good reason that makes Neon such an innovative and attractive option (if we do say so ourselves) for OLTP. And that is: separation of storage and compute, in the context of cloud services.

On the compute side, separation of compute from its storage means your database can have as much compute power as you want when you’re actually crunching numbers with it, and then avoid paying for any compute power at all when you’re not.

On the storage side, separation of storage from its compute means your database can make use of object storage on somebody else’s systems: unlimited, reliable, durable, pay-as-you-go, and relatively inexpensive. Note that a key constraint of these object storage systems is that they don’t provide the same kind of random-access as a hard drive: you generally have to write whole objects (files) at a time. And this constraint drives design choices throughout the rest of the stack.

Storage and compute are only two layers of the lakehouse stack, however. They’re the hardware or service layers. In between these are three further layers, each solving a different set of problems and providing a different set of features. And then on top of it all we find another layer representing the query engine(s), such as Spark or DuckDB, that all this exists to support.

That’s six layers, if you’re keeping count. I’ve done my best to summarise them all in the figure below.

![Image](https://cdn.neonapi.io/public/images/pages/blog/zero-etl-lakehouses-for-postgres-people/scheme-3-1024x729-f7849fec.jpg)

Of the three layers that sit between storage and compute, the bottom one consists of formats for **raw data**. These systems usually support multiple raw data formats, including simple text formats like JSON or CSV. But for decent performance on large volumes of data we’ll choose column-oriented, compressed binary formats such as Parquet.

The next layer up tracks how these many raw data files combine to form database **tables**, complete with indexes, point-in-time snapshots, and so on. The main contenders here are Iceberg and Delta Lake. Like the raw data layer, the table layer simply comprises files in object storage. In the case of Iceberg, these are known as manifest and metadata files.

Moving up the stack again, the next layer is the **catalog**, which tracks what tables are available, how they’re grouped, where they come from, who can access them, who _has_ accessed them, and anything else we might need to know about them.

Effectively the catalog is a large database in its own right: a database of metadata. It may even be powered by an OLTP database such as Postgres (that’s the case for DuckLake, for example, which can be powered by Postgres, SQLite or MySQL). There’s substantial variety at this layer, and different providers have their own solutions. In the case of Databricks, for example, you get the Unity Catalog (also [available as open source](https://www.unitycatalog.io/)).

My former colleague David Gomes has written a slightly longer [intro to these layers](https://davidgomes.com/understanding-parquet-iceberg-and-data-lakehouses-at-broad/).

In summary, lakehouses present a lot of choices: you have options at each of the six layers, the options have interdependencies across layers, and in some of the layers you can pick several options at once. Moreover, the landscape of options at each level isn’t stable. This is a maturing but still relatively early-stage market in which there are big corporate budgets to be fought over. That means plenty of money from big tech and VCs, which in turn means organisations large and small coding lots of new options and doing their best to generate hype around them.

On the other hand, increasingly it seems there are clear favourites in some of these layers, such as Parquet for raw data and Iceberg for tables. And there are also a few front-runners emerging amongst the various open-source projects that bring Postgres and data lakehouse stacks together.

These projects could provide a useful on-ramp for users with existing data and expertise in Postgres. Some of them have dropped quickly into obscurity, but there are three extensions I think are worth highlighting, and all of them are Postgres extensions. They are: [pg_duckdb](https://github.com/duckdb/pg_duckdb), [pg_lake](https://github.com/Snowflake-Labs/pg_lake) and [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake). Look out for a future post that explores and compares these.

## To summarize

Ending the same way we began:

- There’s a wide and fast-moving world of data analysis tools adapted for cheap and performant (but usually still ACID) processing of large data sets (OLAP).
- Unlike Postgres, these tools are not monolithic. Different tools can be slotted together to form a wide range of stacks.
- You can call such a stack a ‘data lakehouse’. The idea is that it provides the high utility of a ‘data warehouse’ for the low cost and effort of a ‘data lake’.
- There’s a growing range of tools to bridge Postgres and data lakehouses. These tools can copy (ETL) data between these systems, or do combined analysis across them.
