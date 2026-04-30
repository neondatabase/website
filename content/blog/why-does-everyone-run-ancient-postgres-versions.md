---
title: Why Does Everyone Run Ancient Postgres Versions?
description: 'Most Postgres users won’t upgrade to Postgres 17, but why?'
excerpt: "Postgres 17.0 has been out for a bit and it’s awesome, but here’s the reality: most Postgres users won’t upgrade right away. Most probably aren’t even on 16.4 or 16.anything \U0001F631—they’re probably still using Postgres 15 or an even older version. \U0001F62D With Postgres, it’s not like the..."
date: '2024-10-16T16:13:02'
updatedOn: '2024-10-16T16:13:06'
category: postgres
categories:
  - postgres
authors:
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-does-everyone-run-ancient-postgres-versions/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Why Does Everyone Run Ancient Postgres Versions? - Neon
  description: >-
    Many companies are running old Postgres versions and missing out on many
    improvements. The reasons: Postgres works and upgrades suck.
  keywords: []
  noindex: false
  ogTitle: Why Does Everyone Run Ancient Postgres Versions? - Neon
  ogDescription: >-
    Many companies are running old Postgres versions and missing out on many
    improvements. The reasons: Postgres works and upgrades suck.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-does-everyone-run-ancient-postgres-versions/social.jpg
source:
  wpId: 7272
  wpSlug: why-does-everyone-run-ancient-postgres-versions
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/why-does-everyone-run-ancient-postgres-versions/neon-ancient-postgres-1024x576-1e3b6e55.jpg)

[Postgres 17.0 has been out for a bit and it’s awesome](https://neon.tech/blog/postgres-17), but here’s the reality: most Postgres users won’t upgrade right away. Most probably aren’t even on 16.4 or _16.anything_ 😱—they’re probably still using Postgres 15 or an even older version. 😭 With Postgres, it’s not like the latest Call of Duty, where everyone wants the update the moment it’s available.

Why don’t more people upgrade?

There are many reasons for this, but it comes down to two core issues: Postgres works and upgrades suck.

## The foundational greatness of Postgres

We at Neon are embedded in the Postgres world. [Our team has worked on Postgres 17](https://neon.tech/blog/top-3-features-in-postgres-17) and we’re all excited about all the new features and optimizations. But the entire point of Neon is acknowledging that most developers aren’t like us—they aren’t all about the database. For an average developer, the database is just a tool.

And Postgres has been a great tool since many versions before 17. For what most developers need, older versions of Postgres are more than capable. The core functionality of Postgres has been there for many years. This foundational strength is what allows developers to build robust, scalable applications without worrying about the underlying database version.

**This doesn’t mean that Postgres hasn’t improved.** We’ll show you a tool later in this post that will allow you to see this much more clearly.

For example, let’s say you’re currently on version 12. Since then, Postgres performance alone has improved significantly:

- [Postgres 13](https://v/) improved performance for queries that use aggregates or partitioned tables
- [Postgres 14](https://www.postgresql.org/docs/release/14.0/) brought numerous performance improvements for parallel queries, heavily concurrent workloads, partitioned tables, logical replication, and vacuuming
- [Postgres 15](https://www.postgresql.org/docs/release/15.0/) offered performance enhancements, particularly for in-memory and on-disk sorting
- [Postgres 16](https://www.postgresql.org/docs/release/16.0/) improved the performance of vacuum freezing and logical replication from replicas

These under-the-hood improvements are critical for building better applications. [Tail latency dropped by half](https://rmarcus.info/blog/2024/04/12/pg-over-time.html) (over a second) between Postgres versions 8 and 16:

![Image](https://cdn.neonapi.io/public/images/pages/blog/why-does-everyone-run-ancient-postgres-versions/ad4nxchs45eqqd7frywbymtmrxuj5hvdf2bwxyrcacldpwvqlqsexerdt0hiyg5t6ecqdgajn4xz-sb8wfgdbiqvsw7y46debxjztmxfuglxfvz9fhmhpa1ewuk4le2pvhmhvu1ro8658nt714m4bntkyn2-0f48d631.png)

This is without counting the security improvements, bug fixes, and of course new features. The new versions have brought support for the SQL [MERGE](https://www.postgresql.org/docs/15/sql-merge.html) command, SQL/JSON constructors and identity functions, parallelized vacuuming of indexes…

But now, to look at the other side of the coin: Unless you either a) are really reaching the limits of Postgres performance and are looking for any possible improvements or b) particularly need some newly added functionality, Postgres 12 probably works _fine_ for you already.

## The cost of change

So that’s the first reason many Postgres users hesitate to upgrade: Postgres is already great as it is. But we’d be fooling ourselves if we didn’t also acknowledge how painful it can be to update major versions of Postgres, especially for large production databases.

Minor updates are fine, and they’re completely covered for you by many managed Postgres services like Neon—[you don’t even have to think about them](https://neon.tech/docs/postgresql/postgres-version-policy). But updating a major version is a different game. Major versions of Postgres might introduce changes that aren’t backward compatible (something that doesn’t happen with minor versions) meaning that it’s much harder for Postgres companies to simply upgrade you automatically.

This doesn’t mean that it’s impossible to simplify this process. At Neon, we’ve put a lot of thought into [making it easier for you to upgrade](https://neon.tech/docs/postgresql/postgres-upgrade)—for example, by supporting logical replication—and **we’re working on a one-click Postgres upgrade feature so you can upgrade with minimal downtime. Not only that, but with Neon you’ll upgrade within a branch to ensure things work, and then upgrade your production with the least amount of interruption as possible. (Keep an eye on 2025 roadmap).**

## Real upgrade stories

To put things into perspective, let’s look at two public stories of companies that performed Postgres upgrades, jumping multiple major versions while managing databases of considerable size in production: [Knock](https://knock.app/blog/zero-downtime-postgres-upgrades) (they upgraded from Postgres 11 to 15) and [Retool](https://retool.com/blog/how-we-upgraded-postgresql-database) (from Postgres 9 to 13). These are big leaps that need to be made strategically.

Here’s what these companies had to do:

1. **Assessment and planning.** They evaluated their database sizes and workloads (Retool had a 4 TB database; Knock managed multiple databases). Objectives like minimizing downtime and upgrading before end-of-life were set. They chose their target Postgres versions and crafted detailed project timelines and risk assessments.
2. **Set up replication.** New database instances running the target Postgres versions were spun up and logical replication from the old to the new databases was established. Retool used [Warp](https://www.citusdata.com/blog/2017/12/08/citus-warp-pain-free-migrations/) for parallel processing to expedite the initial dump and restore, while Knock created custom publications and subscriptions for incremental migration.
3. **Migrate data incrementally.** Tables were categorized based on size and update frequency. Small tables were added to replication and synchronized quickly. For large, append-only tables, they used separate publications with copy_data = false and then backfilled. Custom migration strategies were considered for large, frequently updated tables.
4. **Testing and verification.** Thorough testing was performed on the new database versions. They compared row counts and sample data between old and new databases, ran load tests to verify performance, and conducted multiple dry runs in staging environments.
5. **Application changes.** After testing, they modified their applications to support connections to both old and new databases. Mechanisms were implemented to switch traffic from the old to the new databases, such as using feature flags.
6. **cutover strategy.** The cutover was scheduled during low-traffic periods. Retool used a maintenance window aiming for about one hour, while Knock achieved near-zero downtime with a brief pause in new queries.
7. **Post-migration tasks.** Afterward, they verified data integrity and application functionality, optimized the new databases (e.g., reindexing, vacuuming), monitored performance in the following days, removed old replication setups, and decommissioned the old databases.

Yep. That’s a lot of work. There’s no way around that. Upgrading a production Postgres database that’s multiple versions behind requires a significant investment of time and resources. For many organizations, this level of effort can be daunting, so they often postpone upgrades until absolutely necessary.

## The case for upgrading

Despite all this, we still want to encourage you to _upgrade, upgrade, upgrade_! Don’t worry too much, **we’ll make this process so much easier!** (Remember the 2025 roadmap!)

[If the great new functionality in Postgres 17 isn’t enough to convince you](https://www.postgresql.org/about/news/postgresql-17-released-2936/), here are some other reasons:

- **You’ll eventually have to do it anyway.** Postgres versions have a lifecycle, and support for each version eventually ends (5 years after its initial release).
- **It’s more difficult to jump many versions at once.** The longer you wait to upgrade, the more versions you’ll have to leap over when you finally do. It’s best to jump as many versions as you can when you do upgrade but if you wait for 5 or more versions there will be many compatibility issues and breaking changes ahead.
- **Your app might fall behind.** Newer versions of Postgres come with performance optimizations and new functionalities that can enhance your applications. By sticking with an older version, you might be missing out on improvements that could make your system faster and more efficient.
- **Compatibility.** New frameworks, libraries, and tools might come out without compatibility for the older version of Postgres you might be working with. Updated APIs or extensions might not be backward compatible, preventing you from integrating certain tools or requiring complex workarounds.

## Check what you’re missing out on: Run pgversions.com

Part of the lack of inspiration around upgrading comes from the hassle of manually comparing release notes between versions and figuring out how many improvements you’re missing. To make this easier, we’ve built a tool: [https://pgversions.com/](https://pgversions.com/)

<video autoPlay loop controls width="1514" height="1030">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/why-does-everyone-run-ancient-postgres-versions/pgversions-e58d1631.mov" />
</video>

This tool helps you quickly identify the improvements you’re missing by running an older Postgres version. For example, if you’re running Postgres 16.1, a quick search using pgversions.com tells you that you’re missing:

- 4 security improvements
- 177 bug fixes
- 24 performance improvements
- 10 new features

If [pgversions](https://pgversions.com/) inspires you to finally upgrade, the `How to upgrade` section in the report will point you toward the right docs for different providers.

## Do it (before it’s too late)

If you’re running an older version of Postgres and thinking there’s plenty more time. We know it’s tempting to procrastinate, but don’t let technical debt haunt you. [Follow this guide to plan to upgrade your Neon database to Postgres 17](https://neon.tech/docs/postgresql/postgres-upgrade) and just cross it off your to-do list.

Are you running an older version of Postgres where they don’t offer the latest versions? A migration to Neon could mean upgrading and [switching to a better development environment](https://neon.tech/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora). Feel free to [reach out to us](https://neon.tech/migration-assistance) with any questions.

_If you’re new to Neon, you can get started with Postgres 17 right away_ [via our Free plan.](https://console.neon.tech/signup)
