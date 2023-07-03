---
title: Compute lifecycle
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compute-lifecycle
---

A compute node in Neon is a stateless PostgresSQL process due to the separation of storage and compute. It has two main states: `Active` and `Idle`.

Active means that PostgreSQL is currently running. If there are no active queries for 5 minutes, by default, the activity monitor gracefully places the compute node into the `Idle` state to save energy and resources. Neon [Pro plan](/docs/introduction/pro-plan) users can configure the period of inactivity after which a compute is placed into an `Idle` state by modifying the **Auto-suspend delay** setting. To learn more about this feature, see [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint).

The activity monitor is conservative. It treats "idle in transaction" connections as active to avoid breaking application logic that relies on long-lasting transactions. However, the activity monitor closes idle connections after the defined period of "complete" inactivity.

When you connect to an idle compute, Neon automatically activates it. Activation typically happens within a few seconds, meaning that the first connection has a higher latency than subsequent connections. Also, the PostgresSQL shared memory buffers are cold after waking up from the `Idle` state, which means that your usual queries may take longer, initially.

After a period of time in the `Idle` state, Neon occasionally activates your compute to check for data availability. The time between checks gradually increases if the compute does not receive any client connections.

You can view compute state transitions in the **Branches** widget on the Neon **Dashboard**.

## Compute configuration

Neon only supports modifying session-level configuration parameters. Parameters are reset when the session terminates, such as when the compute suspends due to inactivity.

For information about Neon's PostgreSQL server configuration, see [Neon PostgreSQL parameter settings](/docs/reference/compatibility#neon-postgresql-parameter-settings).

For information about PostgreSQL server configuration, see [Server Configuration](https://www.postgresql.org/docs/14/runtime-config.html), in the PostgreSQL documentation.
