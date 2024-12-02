---
title: Logical replication tips
subtitle: Learn how to optimize for logical replication
enableTableOfContents: true
isDraft: false
updatedOn: '2024-11-30T11:53:56.061Z'
---

The following tips are based on actual customer data migrations to Neon using logical replication:

- Initial data copying during logical replication can significantly increase the load on both the publisher and subscriber. For large data migrations, consider increasing compute resources (CPU and RAM) for the initial copy. On Neon, you can do this by [enabling autoscaling](/docs/guides/autoscaling-guide) and selecting a larger maximum compute size. The publisher (source database instance) typically experiences higher load, as it serves other requests while the subscriber only receives replicated data.
- For large datasets, avoid creating indexes when setting up the schema on the destination database (subscriber) to reduce the initial data load time. Indexes can be added back after the data copy is complete.
- If you encounter replication timeout errors, consider increasing `wal_sender_timeout` on the publisher and `wal_receiver_timeout` on the subscriber to a higher value, such as 5 minutes (default is 1 minute). On Neon, adjusting these settings requires assistance from [Neon Support](/docs/introduction/support).
- To minimize storage consumption during data replication to Neon, reduce your [history retention](/docs/introduction/point-in-time-restore#history-retention) setting. For example, set it to 1 hour or 0 during the initial copy, and restore it to the desired value afterward.
- Ensure that any Postgres extensions that you depend on are also supported by Neon. For extensions and extension versions supported by Neon, see [Supported Postgres extensions](/docs/extensions/pg-extensions). If you find that support is missing for a particular extension or extension version that would prevent you from migrating your data to Neon, please reach out to [Neon Support](/docs/introduction/support).
- Avoid defining publications with `FOR ALL TABLES` if you want to add or drop tables from the publication later. It is not possible to add or drop tables from a publication defined with `FOR ALL TABLES`.

  ```sql
  ALTER PUBLICATION test_publication ADD TABLE users;
  ERROR:  publication "my_publication" is defined as FOR ALL TABLES
  DETAIL:  Tables cannot be added to or dropped from FOR ALL TABLES publications.

  ALTER PUBLICATION test_publication DROP TABLE products;
  ERROR:  publication "my_publication" is defined as FOR ALL TABLES
  DETAIL:  Tables cannot be added to or dropped from FOR ALL TABLES publications.
  ```

  Instead, you can create a publication for a specific table using the following syntax:

  ```sql shouldWrap
  CREATE PUBLICATION my_publication FOR TABLE users;
  ```

  To create a publication for multiple tables, specify a comma-separated list of tables:

  ```sql shouldWrap
  CREATE PUBLICATION my_publication FOR TABLE users, departments;
  ```

  For syntax details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.

If you have logical replication or data migration tips you would like to share, please let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
