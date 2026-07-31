---
title: I Dropped a Table in Production—Now What?
description: Learn how to use Neon’s instant PITR to quickly recover
excerpt: >-
  Imagine you’re running a multi-terabyte production database in Neon when you
  accidentally drop a critical table. Ouch. You notice the mistake a few minutes
  later, during which your high-ingestion workload continues pumping new data
  into the database. How can you recover that drop...
date: '2025-02-18T17:03:38'
updatedOn: '2025-02-23T23:43:32'
category: postgres
categories:
  - postgres
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/recover-production-database/cover.jpg
  alt: null
isFeatured: true
seo:
  title: I Dropped a Table in Production—Now What? - Neon
  description: >-
    When running a multi-TB production Postgres database, how do you recover
    from a mistake without losing post-incident data?
  keywords: []
  noindex: false
  ogTitle: I Dropped a Table in Production—Now What? - Neon
  ogDescription: >-
    When running a multi-TB production Postgres database, how do you recover
    from a mistake without losing post-incident data?
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/recover-production-database/social.jpg
---

<p><img src="https://cdn.neonapi.io/public/images/pages/blog/recover-production-database/neon-drop-table-1024x576-c53cf264.jpg" alt="Post image" width="1024" height="576" /></p>

Imagine you’re running a multi-terabyte production database in Neon when you accidentally drop a critical table. Ouch.

You notice the mistake a few minutes later, during which your high-ingestion workload continues pumping new data into the database.

**How can you recover that dropped table without losing all the fresh data that’s arrived post-incident?**

## Neon’s superpower: Instant PITR

Enter Neon’s superpower: [Instant Point-in-Time Recovery (PITR)](https://neon.tech/docs/guides/branch-restore). With Neon, you can use branches to restore your database to the moment just before the table disappeared; this is instant, no matter how large the database.

When you restore your database to just before the table disappeared, you’re actually creating a new branch rather than overwriting your current production branch. This means:

- **Production stays online.** Your existing “main” branch—the one missing the table—continues running unaltered. New data can keep flowing in, so there’s no disruption to ongoing workloads.
- **You get a fully independent environment.** The restored branch has its own dedicated compute resources. It’s equivalent to the concept of restoring to a new database instance, but much, much faster.
- **It takes 1 second—even for huge databases.** Neon uses [copy-on-write storage](https://neon.tech/blog/get-page-at-lsn). Instead of cloning terabytes of data, the new branch references the same underlying storage until you modify something. This is what makes the recovery process nearly instantaneous, taking about one second regardless of database size.

**How to use this PITR feature to restore the missing table in production?** Below, we’ll outline two recovery routes you can follow, also highlighting why this process is so much faster and more efficient—especially at large scales—than the conventional restore process in RDS and other managed Postgres.

## Two recovery routes

### Route 1: Keep production as is & copy the missing table from a PITR branch

**This is our recommended approach if you need the data that arrived after the drop.** However, if you don’t need that data (e.g. if you are working with curated historical data where new writes are not critical) then the second approach below may be a better fit.

To recover production as quickly as possible, follow these steps:

1. **Identify the time of the “bad event”.** Estimate the timestamp just before the table was dropped. If you’re unsure when this happened, you can use Neon’s [Time Travel](https://neon.tech/docs/guides/time-travel-assist) feature: in the production branch, you can run queries against past timestamps to pinpoint _exactly_ when the table disappeared.
2. **Create a branch from before the drop.** [Create a new branch](https://neon.tech/docs/manage/branches#create-a-branch) at the exact point in time before the table was dropped. This _recovered branch_ is instantly available and contains your dropped table in its pre-drop state. Your production branch remains untouched and continues running as usual.
3. **Dump/copy the dropped table from the recovered branch.** Connect to the new branch and export the schema and data of the missing table (e.g., using pg_dump).
4. **Restore the table into your production branch.** Import the table into your _current production branch_, which has continued ingesting data since the drop.
5. **Validate & confirm.** Verify that the table is restored and that all data is consistent. Your ongoing data ingestion (the inserts/updates that happened after the table drop) remains intact because you never rewound or replaced the production branch.

This method ensures there is zero downtime on production, and prioritizes availability of the data written after the bad event over the data that is being recovered. Since the PITR process is instantaneous, you don’t need to wait for the WAL to replay to get access to dropped data, and this significantly speeds up recovery.

_Scroll down for a more detailed comparison of Neon’s approach versus traditional restore methods in AWS RDS and other managed Postgres services._

### Route 2: Switch production to the recovered branch

**This approach is recommended if you don’t need the data that was ingested after the drop.** It allows you to fully “rewind” your database to its pre-drop state, effectively undoing the mistake as if it never happened, and it’s _very fast_ to do it in Neon: it can be done in a couple seconds and without a hassle of updating your application to pick up the new database connection string.

To switch production to the recovered branch, follow these steps:

1. Just like in Route 1, find the timestamp from just before the table was dropped.
2. **Run PITR to the time just before the drop.** [Branch Restore](https://neon.tech/docs/guides/branch-restore) will create a new branch at the exact point in time before the table was dropped. This _recovered branch_ is instantly available and contains your dropped table in its pre-drop state. Neon will also update the connection string and switch it to the newly created branch with recovered data. This means your production app already points to the recovered branch without changing DB connection URLs or restarting the application. The switch is seamless.
3. **Decide what to do with the post-drop data.** If you don’t need the data that was written after the drop, you’re done—your database has been fully restored to its pre-drop state. If you do need the post-drop data, you’ll need to manually copy it into the recovered branch.

**This approach is best suited for scenarios where you want to fully revert to a known good state and discard any post-drop changes.** This may be the case for applications and datasets that don’t get continuous updates by the human end users, and are updated by scripts that can easily re-run (think of the geospatial datasets, ETL transformers, or applications building prognosis on datasets). The key advantage is that Neon enables an instant transition, allowing you to simply swap branches seamlessly under the same database endpoint.

## Why Neon shines at restores at scale

Let’s recap Neon’s unique advantages for recovery:

### Instant PITR at any scale

With Neon, spinning up a new restored branch is immediate—even for massive databases. Whether your database is 10 GB or 100 TB, the recovery time remains the same: about one second.

This is made possible by Neon’s copy-on-write storage model; instead of duplicating data, it simply references existing storage pages until changes are made. Traditional restore methods require [creating a separate instance, recovering data from snapshots, and replaying WAL](https://neon.tech/blog/recover-large-postgres-databases). This process is not necessary in Neon—you’re saving all that time.

### Recover from an exact time, which you can verify using Time Travel

[Neon retains a complete history of your database](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal), allowing you to restore to an exact moment—whether it’s “10 minutes before a bad migration” or just before an accidental table drop. If you’re unsure of the precise recovery point, you can use [Time Travel queries](https://neon.tech/docs/guides/time-travel-assist) to inspect past database states and pinpoint when the data was lost. Your restored branch is created at the optimal moment, minimizing data loss and recovery time.

### Point production to a restored branch without updating the database connection string in your app

For cases where you want to revert to a pre-drop state entirely, Neon [swaps branches under an existing database endpoint.](https://neon.tech/docs/manage/endpoints?utm_source=chatgpt.com) This instantly points your application to the recovered branch without changing connection URLs and restarting your app, a process that would often require updating configuration files and redeploying your app.

## Comparison vs. AWS RDS and other managed Postgres

| AWS RDS Postgres                                                                                                  | Neon                                                                                   |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Restores the database to a separate instance by loading data from snapshots and replaying WAL                     | Creates a restored branch at a specified point in time using a copy-on-write mechanism |
| Restores take hours for multi-TB databases                                                                        | Restores are instant (≈ 1 second) at any scale                                         |
| Must wait for the full restore and WAL replay to complete before accessing the recovered instance (≈ hours)<br /> | Restored branch available immediately                                                  |

For small databases, the difference between Neon and RDS is not _drastic_. Both support PITR and restoring from a pre-drop state, and for databases just a few gigabytes in size, RDS’s process is relatively fast. But **as database size grows to TBs, RDS’s PITR becomes significantly slower, while Neon’s approach remains just as fast.**

<Admonition type="tip" title="Try it">
Experience Neon's PITR speed by yourself: [run this demo.](https://neon-demos-branching.vercel.app)
</Admonition>

<video autoPlay muted width="1740" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/recover-production-database/pitr-demo-2ab3fea8.mp4" />
</video>

### The AWS RDS restore process: Why it’s slower

[AWS RDS relies on automated snapshots and WAL replays for PITR.](https://neon.tech/blog/recover-large-postgres-databases) If your last snapshot was taken hours ago, RDS must:

1. Restore the full snapshot (which takes time, especially for large instances).
2. Replay all WAL logs from that snapshot to the desired recovery point.

For large, busy databases, this process can take hours before you can even begin extracting the dropped table.

### Neon’s key advantage: Instant PITR

Neon eliminates these bottlenecks because:

- Neon **creates a new branch at the required recovery point in seconds** using copy-on-write branching, no matter how large the database is (it takes 1 second for 10 GB and for 100 TB).
- As soon as the branch is created, you can **immediately export the missing table** and import it back into production.

## Wrap up

**Neon is trusted in production by thousands of teams, with over 18k databases created daily.** If you’re not yet a Neon user, [sign up today](https://console.neon.tech/signup) to see why so many teams are making the switch—or [reach out to us](https://neon.tech/contact-sales) if you’d like more information or a live demo.
