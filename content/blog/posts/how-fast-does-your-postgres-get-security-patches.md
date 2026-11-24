---
title: 'How fast does your Postgres get security patches?'
description: "Neon computes don't store your data, so Postgres minor upgrades apply automatically on the next restart"
excerpt: >-
  Last November 12, the Postgres community released 18.7, 17.12, 16.16, 15.20,
  and 14.25, with fixes for 52 CVEs. The first Neon and Lakebase customers were
  running the new minor versions within 30 minutes of the announcement. The
  rollout reached every region by the end of the day...
date: '2026-11-24T09:00:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: 'How fast does your Postgres get security patches? - Neon'
  description: "Neon computes don't store your data, so Postgres minor upgrades apply automatically on the next restart"
  keywords: []
  noindex: false
  ogTitle: 'How fast does your Postgres get security patches? - Neon'
  ogDescription: "Neon computes don't store your data, so Postgres minor upgrades apply automatically on the next restart"
  image: null
---

Last November 12, the Postgres community released [18.7, 17.12, 16.16, 15.20, and 14.25](https://neon.com/docs/postgresql/postgres-version-support#recent-minor-version-rollouts), with fixes for 52 CVEs. The first Neon and [Lakebase](https://www.databricks.com/product/lakebase) customers were running the new minor versions within 30 minutes of the announcement. The rollout reached every region by the end of the day.

<EmbedTweet url="https://twitter.com/neondatabase/status/2121080839555449204?ref_src=twsrc%5Etfw" />

## Time to patch matters more than ever

Once a CVE is public, attackers and defenders are working from the same information. The time between the community releasing a patch and your database running it is your exposure window. If you use a managed Postgres service, your provider controls most of that window.

That window matters more as AI tools get better at finding vulnerabilities. The Postgres security team and committers [have been handling a recent influx of AI-discovered exploits,](https://neon.com/blog/postgres-19-is-late-and-its-ais-fault) and the November release fixed 52 CVEs at once.

When security releases get bigger and more frequent, every day a provider takes to ship them adds to the time your database is exposed.

## In monolithic managed Postgres, patches might take days to reach your database (and cause downtime)

But a security fix goes through two delays before it protects your database, even if it's managed:

1. First, your provider has to make the new minor version available (e.g. Amazon RDS commits to shipping minor versions [within 7 days of the community release](https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-release-calendar.html))
2. Then, the upgrade has to be applied to your database. This is usually the slower step of the two.

A Postgres minor release doesn't change your data or its on-disk format, so the upgrade itself is small. But in a traditional, monolithic Postgres setup, the binary and the data sit on the same server, so upgrading the binary means restarting Postgres on the server that holds your data.

Providers schedule that restart carefully. [On Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.Minor.html), for example,

- Automatic minor upgrades are opt-in and run during a [weekly 30-minute maintenance window](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html)
- They target a version RDS designates after reviewing fleet stability (which isn't necessarily the newest release)
- On Multi-AZ instances, the primary and standby upgrade at the same time, **with downtime until the upgrade completes, which grows with the size of the instance**

Together, all these steps might mean a security fix can be available for weeks before it actually reaches your database.

## Why upgrades are faster on Neon

Part of the speed comes from our Postgres team. We aim to make every new minor version available on Neon [at the same time as the community release](https://neon.com/docs/postgresql/postgres-version-policy#minor-releases) (last November, that took [under 30 minutes](https://x.com/neondatabase/status/2121080839555449204)).

But shipping a release fast only helps if it then reaches your database fast - and without getting in your way. We can deliver on this due to the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview).

### Monolith vs. lakebase

A traditional Postgres server is a monolith: the Postgres process, its write-ahead log, and its data files all live on one machine, and that machine is the database. Restarting it is the risky event that maintenance windows and failovers exist to manage.

[Lakebase Postgres](https://neon.com/lakebase) (the Neon database) splits the monolith in two. Computes run Postgres but hold no durable state; they stream the write-ahead log to a separate storage layer, which keeps your data replicated across safekeepers and object storage. So a minor upgrade happens entirely on the compute: Neon publishes a new compute image, the compute restarts on it, and it reattaches to the same storage.

That makes an upgrade much less risky:

- On a monolith, patching means taking down the machine that holds your data
- On the lakebase architecture, your data stays in the storage layer the whole time, and only the compute running on top of it is replaced

### How a patch reaches your compute

The "upgrade schedule" on Neon is simple: each compute picks up a new minor version the next time it restarts. For example, after the November release was available,

- New projects started on the new version immediately
- Computes that scale to zero, which suspend after 5 minutes of inactivity by default, ran the new version the next time they woke up
- Computes that stay active pick it up at their next restart. You can manually restart one at any time, or Neon can also apply your updates during [a day or an hour of your choice](https://neon.com/docs/manage/updates)

### What it means for you

- **Patches reach your database fast:** a new version is live on Neon right after the community release and your compute picks it up the next time it restarts. For computes that scale to zero, that's simply the next time they wake up.
- **No maintenance window to plan around:** restarts are routine on Neon in a way they aren't on a monolith. Every time a compute scales to zero and wakes up on the next query, it restarts anyway, and that restart picks up the new version.
- **No noticeable downtime, whatever the size of your database:** on a monolith, the upgrade takes the database down for as long as the server needs to come back, and on RDS that "varies based on the size of your DB instance" (= bad news for large instances). On Neon, the upgrade rides on a normal compute restart, which never takes more than a few seconds. This is always true no matter how large your database. A 10 GB database and a 10 TB database restart the same way.
- **No performance dip afterward:** [Neon prewarms the cache during the restart](https://neon.com/docs/manage/updates), so frequently used data is already in memory when your workload continues.
- **Nothing to configure or approve:** the patch reaches your database as part of normal operation.

## Get it on Neon

Shipping a Postgres release quickly is the provider's job; the architecture plays a big role on actually getting it into your database quickly. On Lakebase Postgres on Neon, computes hold no data, so a patch is just the next restart, and restarts happen all the time.

[Start on the Free plan](https://console.neon.tech/signup) and see for yourself. You can [create a Postgres 19 project today](https://neon.com/blog/postgres-19-is-out-try-it-on-neon) and every future security release will reach it on its next restart.
