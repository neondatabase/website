---
title: Monitor Neon with pgAdmin
subtitle: Monitor your Neon Postgres database with pgAdmin
summary: >-
  Covers the setup and monitoring of a Neon Postgres database using pgAdmin,
  detailing installation, connection procedures, and performance metrics
  tracking.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.091Z'
---

pgAdmin is a database management tool for Postgres designed to facilitate various database tasks, including monitoring performance metrics.

![PgAdmin monitoring dashboard](/docs/introduction/pgadmin_monitor.png)

With pgAdmin, you can monitor real-time activity for a variety of metrics including:

- Active sessions (Total, Active, and Idle)
- Transactions per second (Transactions, Commits, Rollbacks)
- Tuples in (Inserts, Updates, Deletes)
- Tuples out (Fetched, Returned)
- Block I/O for shared buffers (see [Cache your data](/docs/postgresql/query-performance#cache-your-data) for information about Neon's Local File Cache)
- Database activity (Sessions, Locks, Prepared Transactions)

<Admonition type="note" title="Notes">
Neon currently does not support the `system_stats` extension required to use the **System Statistics** tab in pgAdmin. It's also important to note that pgAdmin, while active, polls your database for statistics, which does not allow your compute to suspend as it normally would when there is no other database activity.
</Admonition>

## How to install pgAdmin

Pre-compiled and configured installation packages for pgAdmin 4 are available for different desktop environments. For installation instructions, refer to the [pgAdmin deployment documentation](https://www.pgadmin.org/docs/pgadmin4/latest/deployment.html). Downloads can be found on the [PgAdmin Downloads](https://www.pgadmin.org/download/) page.

## How to connect to your database from pgAdmin

Find the connection string for your database by clicking the **Connect** button on your **Project Dashboard**.

![Connection details modal](/docs/connect/connection_details.png)

Enter your connection details as shown [here](/docs/connect/connect-postgres-gui#connect-to-the-database).

Neon uses the default Postgres port: `5432`

<NeedHelp/>
