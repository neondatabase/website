---
title: Logical replication tips
subtitle: Learn how to optimize for logical replication
enableTableOfContents: true
isDraft: false
updatedOn: '2024-09-04T18:53:01.155Z'
---

The following tips are based on actual customer data migrations to Neon using logical replication:

- If you are replicating a large dataset to Neon, check whether the data exceeds 20 GB in size. To estimate the total size of your dataset, including tables and indexes, run the following query on the source database:

  ```sql shouldWrap
  SELECT pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS total_index_size FROM pg_stat_user_indexes;
  ```

  If the dataset exceeds 20 GB, contact [Neon Support](/docs/introduction/support) to request an increase in the disk size for your Neon compute. This helps prevent `no space left on device` errors, which occur when the fixed 20 GB disk size is exceeded. Neon Support may also make additional modifications to your Neon compute to prepare for replicating a large dataset.

- Initial data copying during logical replication can significantly increase the load on both the publisher and subscriber. For large data migrations, consider increasing compute resources (CPU and RAM) for the initial copy. On Neon, you can do this by [enabling autoscaling](/docs/introduction/autoscaling) and selecting a larger maximum compute size. The publisher (source database instance) typically experiences higher load, as it serves other requests while the subscriber only receives replicated data.
- For large datasets, avoid creating indexes when setting up the schema on the destination database (subscriber) to reduce the initial data load time. Indexes can be added back after the data copy is complete.
- If you encounter replication timeout errors, consider increasing `wal_sender_timeout` on the publisher and `wal_receiver_timeout` on the subscriber to a higher value, such as 5 minutes (default is 1 minute). On Neon, adjusting these settings requires support assistance.
- To minimize storage consumption during data replication to Neon, reduce your [history retention](/docs/introduction/point-in-time-restore#history-retention) setting. For example, set it to 1 hour or 0 during the initial copy, and restore it to the desired value afterward.

If you have tips you would like to share, please let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
