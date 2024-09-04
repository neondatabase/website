---
title: Logical replication tips
subtitle: Learn how to optimize for logical replication
enableTableOfContents: true
isDraft: false
updatedOn: '2024-09-04T18:53:01.155Z'
---

The following tips are based on actual customer data migrations to Neon using logical replication:

- Initial data copying during logical replication can significantly increase the load on both the publisher and subscriber. For large data migrations, consider increasing compute resources (CPU and RAM) for the initial copy. On Neon, you can do this by [enabling autoscaling](/docs/introduction/autoscaling) and selecting a larger maximum compute size. The publisher (source database instance) typically experiences higher load, as it serves other requests while the subscriber only receives replicated data.
- For large datasets, avoid creating indexes when setting up the schema on the destination database (subscriber) to reduce the initial data load time. Indexes can be added back after the data copy is complete.
- If you encounter replication timeout errors, consider increasing `wal_sender_timeout` on the publisher and `wal_receiver_timeout` on the subscriber to a higher value, such as 5 minutes (default is 1 minute). On Neon, adjusting these settings requires support assistance.
- To minimize storage consumption during data replication to Neon, reduce your [history retention](/docs/introduction/point-in-time-restore#history-retention) setting. For example, set it to 1 hour or 0 during the initial copy, and restore it to the desired value afterward.

If you have tips you would like to share, please let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
