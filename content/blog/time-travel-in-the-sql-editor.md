---
title: Time Travel in the SQL Editor
description: Diagnosing issues using Neon's Time Travel Queries
excerpt: >-
  Increasing the velocity at which teams can develop, test, and deploy is a key
  goal for us at Neon. Our branchable Postgres enables teams to create
  development and preview environments instantaneously, and autoscaling gives
  you the confidence that your production environments can...
date: '2024-04-17T14:58:32'
updatedOn: '2024-04-17T20:55:30'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/time-travel-in-the-sql-editor/cover.jpg
  alt: Cover image without text for "Time Travel in the SQL Editor" article.
isFeatured: false
seo:
  title: Time Travel in the SQL Editor - Neon
  description: Diagnosing issues using Neon's Time Travel Queries
  keywords: []
  noindex: false
  ogTitle: Time Travel in the SQL Editor - Neon
  ogDescription: >-
    Increasing the velocity at which teams can develop, test, and deploy is a
    key goal for us at Neon. Our branchable Postgres enables teams to create
    development and preview environments instantaneously, and autoscaling gives
    you the confidence that your production environments can scale up to meet
    demand when you make it big. Diagnosing and debugging […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/time-travel-in-the-sql-editor/social.png
source:
  wpId: 5780
  wpSlug: time-travel-in-the-sql-editor
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Cover image showing a clock, for the Time Travel in the SQL Editor article.](https://cdn.neonapi.io/public/images/pages/blog/time-travel-in-the-sql-editor/neon-time-travel-1024x576-9339e497.jpg)

Increasing the velocity at which teams can develop, test, and deploy is a key goal for us at Neon. Our branchable Postgres enables teams to create development and preview environments instantaneously, and autoscaling gives you the confidence that your production environments can scale up to meet demand when you make it big.

Diagnosing and debugging complex issues is a harsh reality of developing and shipping software. Doing so can involve working backwards from the current state of your system, and sifting through logs to get a complete picture of the series of events leading up to your current situation.

If the ability to query your database at any time in the recent past sounds like a superpower, consider yourself a superhero because we’re introducing [Time Travel Queries in the Neon SQL Editor](https://neon.tech/docs/guides/time-travel-assist).

This article is going to provide you with an introduction to this feature, and a brief overview of how it works, plus a teaser of what’s coming next.

## Time Travel Queries for Postgres

### Getting Started with Time Travel

As of today, the Time Travel feature is available in the SQL Editor on [console.neon.tech](https://console.neon.tech/). You can enable it using the Time Travel toggle shown in the following screenshot.

![Image](https://lh7-us.googleusercontent.com/y5MVAWN--Ml6V1jnAE7z5xHZKHZ-jgnzFmj0rIMS9eoeV8Wjn3YU9WHcFynwH_SXm2eyUFUekrJgJw-nilrjhXI0ZxyJNdWNyhGixV1QRDkyjKpbyaK8IAk3KXuFfIGwsHzb0wSN0vEgWytk-wNwwac)

After enabling **Time Travel,** you can use the timestamp selector to query your database at any time within your configured [history retention window](https://neon.tech/docs/introduction/point-in-time-restore#history-retention).

### Diagnosing an Issue using Time Travel Queries

Let’s explore a hypothetical scenario where **Time Travel** could help us out.

Sign up for Neon, and follow the steps in our documentation to [import the chinook sample database](https://neon.tech/docs/import/import-sample-data#chinook-database). It contains data such as artists, albums, invoices, and employees.

Imagine a scenario where an application error causes data to be deleted from this database. Specifically, line items for the invoice with the ID of `360`. This could manifest as a customer seeing their order summary but not the detailed line-by-line breakdown of their order in an e-commerce application.

You can simulate this by running the following SQL statement against the chinook database in the **SQL Editor** with **Time Travel** disabled.

```sql
DELETE from "InvoiceLine" WHERE "InvoiceId" = '360'
```

Next, issue a query to obtain the invoice with the ID of `360`.

```sql
SELECT "InvoiceId", "Total"
FROM "Invoice" WHERE "CustomerId" = '58' AND "InvoiceId" = '360'
```

This invoice has a total value of $5.94, as shown in the following screenshot.

![Image](https://lh7-us.googleusercontent.com/Rzbj-fUbo2lTmDKQChEHYM6Md1CIeLRBrdhPn3o40MKFH3efTyeYFx_3lC4JFYywJ7_S1om2tK6NR_i6ctWxkwKcPXTFi1QYmMMBa-Shfcyj3z4Uyb3SxBre8jDCTd_AthZVXNP1RcXqbHBcrp0DmuE)

Issue the following query to confirm that the line items associated with the invoice are missing. Zero rows should be returned since you deleted them previously. This means we’ve lost the line-by-line breakdown of the invoice for $5.94!

```sql
SELECT * FROM "InvoiceLine" WHERE "InvoiceId" = '360'
```

Next, enable **Time Travel** and set the timestamp to a minute before you ran the `DELETE` query. Issue the previous SELECT query again; you should see the missing line items!

![Image](https://lh7-us.googleusercontent.com/xlxsA27P7uMtxu3aV2tkdTwCZUqj55OZAGjqFJHLPJZpDQo6u-tlOK4_IKcIEf7AoSZFU6G-bYdkxOkG3mWdhUryySzq9qzEIMAAhvfLbAAFm77lbbsH6nMqTSiLuaOz9i5QdbnlYocE85pbUOmGJJE)

In reality, you would probably [perform a bisect](https://neon.tech/blog/time-travel-with-postgres) that starts at the point in time when the invoice was created and moves forward from there to find the point in time when the data loss occurred. From there you can take steps to restore the data.

## Ephemeral Branches: Behind the Scenes

You might be aware that [Neon’s architecture seprates storage and compute](https://neon.tech/blog/point-in-time-recovery-in-postgres). Storage is primarily handled by two components: the Pageserver and Safekeepers.

Safekeepers are responsible for persistence. They process the [Write-Ahead Log (WAL)](https://www.postgresql.org/docs/current/wal-intro.html) and ensure it is replicated for redundancy using the Paxos consensus algorithm. The Pageservers respond to read requests by [reconstructing a given page](https://neon.tech/blog/get-page-at-lsn) (identified by LSN) from the last image of that page plus any subsequent WAL records.

Compute instances (Postgres VMs) can request the database state at a given point in time, identified by LSN. This has some interesting implications.

![Image](https://lh7-us.googleusercontent.com/BULbelREmftw6e0vPkvezF7atrLzgkt3ihtLu2xmoMQDcgWYQzBPwiDdUp4CBpNMxIwKTVb8PVraBw2YAxmn2CEuoj6v0I9JdYimtXhMm5onqEyxkTbu680Bw9crk_kUtZtS7hPOIDT4JTtKCmWXffA)

Since Neon’s Postgres computes can request the database at a specific point in the database’s history, we can provide near [instantaneous point-in-time recovery](https://neon.tech/blog/point-in-time-recovery-in-postgres), and our **Time Travel** queries.

## Conclusion

Using the SQL Editor to perform time travel queries is cool, but what’s coming in the future is even more incredible. We’re going to make it possible to specify a timestamp or LSN in your connection string to connect to ephemeral branches using your favorite tools.

Need to create a dump of your database from a previous point in time using `pg_dump`? No problem, simply specify the point in time in your connection string. Similarly, you’ll be able to easily connect to a prior version of your database from a previous version of your application. Check out the old codebase, and provide it with a time travel connection string.

Another great thing about ephemeral branches is that they disappear when you’re finished using them, limiting the impact on your compute and storage spend.

Join us in [Discord](https://neon.tech/discord), follow us on [X](https://x.com/neondatabase), and let us know what observability tools you’d like us to integrate with so you can scale your applications to millions of users.
