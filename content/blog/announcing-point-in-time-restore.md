---
title: Announcing Point-in-Time Restore
description: >-
  Restore your database to a previous point in time using Neon's Restore with
  Time Travel Assist
excerpt: >-
  Neon’s unique architecture separates storage and compute for Postgres. This
  enables us to provide features such as serverless and autoscaling for your
  Postgres instances. Another benefit of Neon’s architecture is that it enables
  us to retain the history of changes, including data...
date: '2024-02-20T20:19:47'
updatedOn: '2024-03-27T11:53:05'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-point-in-time-restore/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Announcing Point-in-Time Restore - Neon
  description: >-
    Restore your database to a previous point in time using Neon's Restore with
    Time Travel Assist
  keywords: []
  noindex: false
  ogTitle: Announcing Point-in-Time Restore - Neon
  ogDescription: >-
    Restore your database to a previous point in time using Neon's Restore with
    Time Travel Assist
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-point-in-time-restore/social.jpg
source:
  wpId: 4749
  wpSlug: announcing-point-in-time-restore
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-point-in-time-restore/neon-backup-restore-1-1024x576-f839da8d.jpg)

Neon’s [unique architecture](https://neon.tech/blog/architecture-decisions-in-neon) separates storage and compute for Postgres. This enables us to provide features such as serverless and autoscaling for your Postgres instances. Another benefit of Neon’s architecture is that it enables us to retain the history of changes, including data [Data Definition (DDL)](https://www.postgresql.org/docs/current/ddl.html) changes, for all database branches. This enables Neon to provide instantaneous [point-in-time restore (PITR)](https://en.wikipedia.org/wiki/Point-in-time_recovery) operations.

Point-In-Time Restore allows you to restore your database to its previous state if an operation you perform has unintended consequences. This feature gives you peace of mind and confidence in shipping your product with minimal risk of unintended consequences.

We’re excited to announce that our powerful Branch Restore feature is now available in the [Neon Console](https://console.neon.tech/). Branch Restore enables you to [restore a branch from history](https://neon.tech/docs/guides/branch-restore#how-to-use-branch-restore) with [time-travel assistance](https://neon.tech/docs/guides/branch-restore#time-travel-assist). This streamlines the previously [manual process](https://neon.tech/blog/point-in-time-recovery#restore-the-branch-to-a-previous-state-while-keeping-the-same-compute-endpoint) of performing a PITR operation.

## Restore a Branch from History

Neon projects support a configurable [retention value](https://neon.tech/docs/introduction/point-in-time-restore#history-retention) that allows up to 30 days of history to be retained. Increasing the retention value will increase your project’s storage usage but provide greater flexibility when performing point-in-time restore operations.

The new Branch Restore functionality can restore your database branch to a specific [log sequence number (LSN)](https://www.postgresql.org/docs/current/datatype-pg-lsn.html) from the [write-ahead log (WAL)](https://www.postgresql.org/docs/current/wal-internals.html) within your project’s configured history retention window. If you don’t have a specific LSN, you can select a timestamp instead, and Neon will determine the LSN associated with your chosen timestamp behind the scenes.

To test the Restore feature, open up the [Neon Console](https://console.neon.tech/) and create a new project. Select the **SQL Editor** and run the following queries to create a table named `playing_with_neon` and seed it with 20 rows of data:

```sql
CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);

INSERT INTO playing_with_neon(name, value) SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 20) s(i);
```

Take note of the time. Wait a minute or two, then insert 10 more rows of data into the database:

```sql
INSERT INTO playing_with_neon(name, value) SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
```

Confirm that the table contains 30 rows using the `SELECT count(*) from playing_with_neon;` query.

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-point-in-time-restore/screenshot-2024-02-20-at-120645-1024x514-08cf0a4a.png)

Navigate from the **SQL Editor** to the **Restore** screen in the Neon Console and:

- Confirm that the **Branch to restore** is set to **main** (or the branch you’re using to test).
- Set the **Timestamp** value to the time you took note of earlier.
- Click the **Next** button.
- Confirm you want to proceed by clicking **Restore** in the popup that appears.

In the screenshot above, you can see that the second INSERT operation occurred at 12:06 PM. Setting the **Timestamp** field to 12:05 PM is sufficient to restore the database branch to the point before the second INSERT operation. You can specify second and millisecond accuracy if necessary. Before clicking **Next**, you can also use the **Time travel assist** feature to verify the data at your chosen timestamp.

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-point-in-time-restore/screenshot-2024-02-20-at-120936-1024x516-44d99d29.png)

The restore operation typically takes just a couple of seconds to complete. During this period, applications connected to the compute endpoint experience a brief loss of connectivity to the database. However, they can reconnect once the compute has restarted, similar to a cold start.

## Time Travel Assist

Validating you have chosen the correct LSN or timestamp is critical to confidently using the Restore functionality. You can use Time Travel Assist to issue a query against your database as it was at the timestamp or LSN and branch you selected in the Neon console’s Restore section before performing the restore operation.

<br />Let’s try it out using the same project and `playing_with_neon table` as before. Select the **SQL Editor** and run the following query against the `main` branch:

```sql
DELETE from playing_with_neon;
```

Uh oh! The DELETE query without a WHERE clause deleted everything from the database. In a real-world scenario, you could have a situation like this occur when you push new code to an application that contains a bug. Your application logs might not reveal precisely when the delete operation was performed. In this case, you can use Time Travel Assistant to narrow down when the data loss occurred.

Select the **Restore** section in the Neon console, select the main branch from the dropdown, and enter the current time in the timestamp field. Enter `SELECT count(*) from playing_with_neon;` click the **Query at timestamp** button in the query editor. Zero rows should be returned since you’re effectively querying the current version of the `main` branch that has suffered data loss.

Set the timestamp further in the past until the query returns the expected non-zero number of rows. At this point you’ve found the timestamp required to perform the Restore operation, so go ahead and click **Next** then proceed with the restoration.

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-point-in-time-restore/screenshot-2024-02-20-at-120839-1024x517-25cc5084.png)

Return to the **SQL Editor** and issue a `SELECT* from playing_with_neon;` query against the main branch. A non-zero number of rows will be returned. This is because you successfully restored the branch to a point before the erroneous `DELETE` query was performed.

## Neon’s Point-in-Time Restore vs. Roll-your-own Restore

Postgres is a mature enterprise-ready database and includes tools such as [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), [pg_dumpall](https://www.postgresql.org/docs/current/app-pg-dumpall.html), [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html), [pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html), and WAL archival capabilities out-of-the-box. Outside of the core tooling, projects such as pgBackRest, WAL-G, and Barman exist to provide complete backup and restore solutions for Postgres that can create redundant backups by sending archives to object storage and simplifying PITR. If you’re running Postgres in a virtual or cloud environment, creating a snapshot of the mounted disk volume where your data is stored is possible.

Of the core tools, pg_dump is the most straightforward to use. It creates a logical backup that can be used to restore your schema(s) and data to your existing Postgres version or migrate to a newer version. The downside of pg_dump is that it doesn’t support incremental or point-in-time restore since it creates a full copy of your database’s data and schema exactly as they were at the time pg_dump was run. If someone accidentally runs an erroneous DELETE you could restore data using a recent pg_dump, but you’d have lost any data created between when the pg_dump was performed and when the delete was performed.

A backup and restore strategy that only utilizes pg_dump will result in a Recovery Point Objective (RPO) that could lead to unacceptable levels of data loss. Organizations running production workloads on Postgres must minimize their RPO and Recovery Time Objective (RTO) by defining a strategy that uses pg_basebackup combined with WAL archival or tools such as Barman and pgBackRest.

## Conclusion

Neon’s PITR restore capability offers up to 30 days of retention with LSN-level granularity and takes just seconds to perform. This means your RPO and RTO can be minimized without implementing and maintaining complex backup infrastructure. Depending on your organization’s data retention strategy, you may still want to create occasional [backups of your Neon data using pg_dump](https://neon.tech/docs/import/import-from-postgres#export-data-with-pgdump). If you’re looking for a Postgres database, [sign up and try Neon](https://neon.tech/blog/python-django-and-neons-serverless-postgres#:~:text=sign%20up%20and%20try%20Neon) for free. Join us in our [Discord server](https://neon.tech/discord) to share your experiences, suggestions, and challenges.
