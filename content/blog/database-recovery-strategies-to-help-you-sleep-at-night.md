---
title: Database recovery strategies to help you sleep at night
description: 'We hope you never need this, but Neon has instant PITR'
excerpt: >-
  As you’re building your architecture, much thought goes into making database
  systems resilient to failures. But shhh… stuff happens; misconfigurations,
  human errors, or accidentally signing up little Bobby Tables to your
  service—sometimes, databases fall over. If you don’t have a...
date: '2024-06-24T19:32:13'
updatedOn: '2024-06-24T19:34:38'
category: workflows
categories:
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-recovery-strategies-to-help-you-sleep-at-night/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Database recovery strategies to help you sleep at night - Neon
  description: >-
    We hope you never need this, but it's important to have a data recovery
    strategy in place in case your database fails.
  keywords: []
  noindex: false
  ogTitle: Database recovery strategies to help you sleep at night - Neon
  ogDescription: >-
    We hope you never need this, but it's important to have a data recovery
    strategy in place in case your database fails.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-recovery-strategies-to-help-you-sleep-at-night/cover.jpg
source:
  wpId: 6311
  wpSlug: database-recovery-strategies-to-help-you-sleep-at-night
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/database-recovery-strategies-to-help-you-sleep-at-night/neon-database-recovery-1-1024x576-31fd7c17.jpg)

As you’re building your architecture, much thought goes into making database systems resilient to failures. But shhh… stuff happens; misconfigurations, human errors, or accidentally signing up [little Bobby Tables](https://xkcd.com/327/) to your service—sometimes, databases fall over.

![Image](https://cdn.neonapi.io/public/images/pages/blog/database-recovery-strategies-to-help-you-sleep-at-night/exploitsofamom2x-1024x316-49e26700.png)

If you don’t have a data recovery strategy in place, this will be a huge problem.

## Backups are not enough: you have to _recover_ from backups

We’ll talk about backups in this post (_of course_) but first, there’s something you need to hear: [backups are not backups unless you have tested restoring from them.](https://www.reddit.com/r/sysadmin/comments/5rlcz1/backups_are_not_backups_unless_you_have_tested/)

Backups are essential for data protection and disaster recovery. They act as a safety net, ensuring that your valuable data is not lost in case of failures. But simply having backups is not sufficient. The true value of a backup lies in its ability to be restored successfully when needed.

**The illusion of safety**

It’s easy to fall into the trap of complacency once you have a backup system in place. But without regular testing of these backups, this sense of security can be dangerously misleading. A backup that has never been tested in a recovery scenario might as well not exist because there’s no guarantee that it can be restored effectively.

**The critical factor: time to restore from backups**

When you’re getting to production, not only is it essential to verify the integrity and functionality of your backups, but it’s also crucial to consider how much time it will take to restore from a backup if the worst happens. The time to restore (TTR) is a vital metric in any disaster recovery plan, as it directly impacts your system’s downtime and, consequently, your business operations.

This is important, so it’s worth elaborating. In the context of Postgres, restoring a large database can be a time-consuming process. Several factors influence the restoration time, including:

- Database size: larger databases naturally take longer to restore.
- the volume of data changes since the last backup (you’ll have to replay WAL).
- The method used for backup (e.g. pg_dump vs pg_basebackup).
- CPU, memory, and I/O resources available during the process.
- Network speed.

**Real-world example**

Imagine your primary Postgres server hosting a mission-critical application crashes. The database size is 1TB, and you have been using pg_basebackup for nightly backups stored on a remote server. Something goes terribly wrong and you have to restore. The process will look more or less like this:

1. First, you download the latest backup.
2. Once you have the backup, you copy the files to the Postgres data directory.
3. After copying the files, you replay the WAL files to cover the data changes since the last backup.
4. Lastly, you verify the integrity and consistency of the restored data.

This process takes you at least a few hours, assuming no issues arise during the restoration process. Yikes.

## What can you do to protect yourself: database recovery strategies

### Strategy #1 – Use a managed database

The previous section pretty much summarizes why so many developers choose managed databases. Managed database services handle most of the heavy lifting for you, usually offering automated backups, point-in-time recovery, and other tools to ensure your data is safe and quickly recoverable. Unless you’re experienced in running databases in production (and you’re open to investing significant resources into managing the DB), a managed Postgres will be a wise choice.

### Strategy #2 – Take your own nightly backups via Github actions

Needless to say, [Neon](https://neon.tech/home) is one of those managed Postgres options you can choose for your workload. As such, we take care of your data; [Neon keeps a copy of your data in highly durable object storage](https://neon.tech/blog/architecture-decisions-in-neon), so you definitely don’t have to take your own backups.

That said, sometimes you want to be extra sure. We get it. If you want to also run your own nightly backups, **not as your recovery path in case something goes wrong** but as a safety net, [this article walks you through how to schedule nightly backups in Neon via a GitHub Action and store them to S3.](https://thenewstack.io/how-to-schedule-postgresql-backups-with-github-actions/)

### Strategy #3 – If you’re not using Neon, set up a standby/HA replica

As we said earlier, having backups doesn’t necessarily mean you can recover from them in a timely manner. Managed database or not, you have to consider what happens when your database fails, not only in terms of data loss but also availability. How long will your system be down if production fails?

If you’re using “traditional” databases like RDS, setting up a standby replica is a common way to protect yourself against the long periods of downtime you might experience while waiting for recovery from a backup to finish. This setup involves creating a replica that continuously receives updates from the primary database. In case of a production failure, your system can automatically switch to the replica, which becomes the primary while the original instance is being repaired.

Standby replicas can save you in case of disaster, and they’re a recommended practice in production. However, be aware that while they minimize downtime, they also effectively **double your database costs** since you are running an additional instance at all times.

### Strategy #4 – Chose Neon for instant PITR via branching

If you’re using Neon, you have some special tools 🛠️ for database recovery, derived from the unique architecture of Neon. First, [Neon’s storage is inherently durable](https://neon.tech/blog/get-page-at-lsn), since it implements an architecture that uses a combination of safekeepers and pageservers running in high-performance SSDs with cloud object storage to ensure data durability.

Second, Neon offers a different approach to recovery: [you can run instant PITR via database branching.](https://neon.tech/blog/announcing-point-in-time-restore) Since Neon’s storage is [brancheable](https://neon.tech/docs/guides/branch-restore), instead of relying on a slow recovery-from-backup process or on expensive standby replicas, you simply create a [database branch](https://neon.tech/docs/guides/branch-restore) from any time in the past within the project’s [history retention window](https://neon.tech/docs/manage/projects#configure-history-retention).

Running this PITR in Neon doesn’t incur additional costs, and **it’s an extremely fast process regardless of how large your dataset is**. [You can even run queries before restoring to a precise point in the past, to make sure you’re restoring to the right timestamp.](https://neon.tech/docs/guides/time-travel-assist) If this has picked your curiosity, watch this demo to see it in action:

<YoutubeIframe embedId="ZnxLCOkb_R0" isDocPost={false} />

## From nightmares to sweet dreams

When you’re getting your project to production, knowing you have a quick data recovery plan in case something goes wrong will help you sleep at night. In Neon, that’s instant PITR – we hope you never have to use it though 🙂

If you’re concerned about a particular scenario, [don’t hesitate to reach out to us at the Neon team](https://discord.gg/92vNTzKDGp).
