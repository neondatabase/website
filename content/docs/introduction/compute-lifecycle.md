---
title: Compute lifecycle
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compute-lifecycle
updatedOn: '2023-11-23T13:58:00.341Z'
---

A compute node in Neon is a stateless Postgres process due to the separation of storage and compute. It has two main states: `Active` and `Idle`.

`Active` means that Postgres is currently running. If there are no active queries for 5 minutes, your compute node is automatically placed into an `Idle` state to save on energy and resources. [Neon Pro Plan](/docs/introduction/pro-plan) users can disable this auto-suspension behavior so that a compute always remains active, or they can increase or decrease the amount of time after which a compute is placed into an `Idle` state. Auto-suspension behavior is controlled by an **Suspend compute after a period of inactivity** setting. For information about configuring this setting, see [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint).

The _Auto-suspend_ feature is conservative. It treats an "idle-in-transaction" connection as active to avoid breaking application logic that involves long-running transactions. Only connections that are truly inactive are closed after the defined period of inactivity.

When you connect to an idle compute, Neon automatically activates it. Activation can take anywhere from 500 ms to a few seconds, meaning that the first connection may have a higher latency than subsequent connections. Cold-start times are fastest in the `US East (Ohio) — aws-us-east-2` region, which hosts the Neon Control Plane. The Neon Control plane will be deployed regionally in future Neon releases, bringing the same millesecond cold-start times to all supported regions.

Also, Postgres shared memory buffers are cold after a compute wakes up from the `Idle` state, which means that initial queries may take longer until the shared memory buffers are warmed.

After a period of time in the `Idle` state, Neon occasionally activates your compute to check for data availability. The time between checks gradually increases if the compute does not receive any client connections over an extended period of time.

You can check if a compute is `Active` or `Idle` and watch as a compute transitions from one state to another in the **Branches** widget on the Neon **Dashboard** or on the **Branches** page.

## Compute configuration

Neon only supports modifying session-level configuration parameters. Parameters are reset when the session terminates, such as when the compute suspends due to inactivity.

For information about Neon's Postgres server configuration, see [Neon Postgres parameter settings](/docs/reference/compatibility#neon-postgres-parameter-settings).

For information about Postgres server configuration, see [Server Configuration](https://www.postgresql.org/docs/14/runtime-config.html), in the _PostgreSQL documentation_.
