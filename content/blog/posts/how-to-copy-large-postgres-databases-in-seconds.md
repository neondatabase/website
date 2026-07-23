---
title: How to copy large Postgres databases in seconds
description: You can copy a 1TB database in 1 second (literally) with Neon branching
excerpt: >-
  If you’re running Postgres in production, you’ll most likely be handling
  database copies not only as backups but also for creating development and
  testing environments that replicate production settings. Database copies also
  play a key role in preparing for migrations and upgrade...
date: '2024-03-04T17:24:38'
updatedOn: '2024-03-04T17:35:20'
category: postgres
categories:
  - postgres
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-copy-large-postgres-databases-in-seconds/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to copy large Postgres databases in seconds - Neon
  description: >-
    Copying large Postgres databases in the TB range can be a time-consuming and
    expensive process. Neon has an alternative: database branches.
  keywords: []
  noindex: false
  ogTitle: How to copy large Postgres databases in seconds - Neon
  ogDescription: >-
    Copying large Postgres databases in the TB range can be a time-consuming and
    expensive process. Neon has an alternative: database branches.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-copy-large-postgres-databases-in-seconds/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/how-to-copy-large-postgres-databases-in-seconds/neon-copy-databases-1024x576-a552e4d1.jpg)

If you’re running Postgres in production, you’ll most likely be handling database copies not only as backups but also for creating development and testing environments that replicate production settings. Database copies also play a key role in preparing for migrations and upgrades, allowing for risk-free testing of changes.

## Copying large Postgres databases: your options (they’re not great)

Traditionally, copying Postgres databases, especially large ones, involves methods that can be both time-consuming and resource-intensive. These methods include:

- **Physical file copy**. This involves copying the data directory of the database. While it can be fast for smaller databases, it becomes impractical for large databases due to the sheer volume of data and the downtime required to ensure data consistency.
- **Logical backup and restore**. Tools like pg_dump and pg_restore allow for logical backups and restorations of databases, but for large datasets, this process takes a significant amount of time, leading to prolonged downtime or reduced performance during the operation. Once the database gets close to the TB range, this becomes an unfeasible method.
- **Logical replication**. Logical replication is a great method for some use cases, like change data capture or for migrating databases between different providers or regions with minimal downtime. But logical replication is more suited for continuous data syncing rather than quick copies.
- **Database forking.** Some managed Postgres providers offer database forking, which allows users to create a fork (copy) of a full database instance. While forking can be less hands-on than manual copying methods, it typically involves copying the entire data set, making it a time-consuming process for large databases. Additionally, because you’re creating a full copy of the database instance, this often doubles the billing, as you end up paying for two full instances until the fork is no longer needed.

## Database branching: a blazing-fast way to copy large Postgres databases

Neon introduces an alternative to the previous methods: database branching. At its core, database branching utilizes the copy-on-write technique to create instant copies. Only when the secondary branch diverges from the primary does the system allocate additional storage.

This technique makes it immediate and resource-efficient to create Postgres copies, no matter how large the database. It is also very affordable, since it optimizes storage utilization.

Just as code branches allow developers to work on isolated versions of a codebase without affecting the main line of development, database branches enable the creation of separate database instances for testing, development, staging, point-in-time restores, and more.

## See it in action

In this video, we show you how to copy a Postgres database over 1TB in size in just one second via branching:

<YoutubeIframe embedId="a1ZEY3W7sOI" isDocPost={false} />

For a database this large, using something like pg_dump/restore would be prohibitively slow and resource-intensive. Neon branching transforms this process entirely. By simply creating a new branch of the database with the Neon CLI, a copy is instantly available. This new branch is immediately usable with all the data and schema of the original database intact.

The newly created branch allows for isolated changes without affecting the parent database. Developers can work with real data in development or preview environments, create isolated environments for each pull request, or run tests in short-lived branches. If no changes are made to a branched database, it needs no additional storage.

## Try it yourself

If you’re interested in exploring database branching, [sign up to Neon](https://console.neon.tech/signup). You can start experimenting with our free tier; once you’re ready to load a large dataset, [request an Enterprise trial](https://neon.tech/enterprise#request-trial) to gain full access to the platform for 30 days.
