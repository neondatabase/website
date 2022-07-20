---
title: Compute Lifecycle
---

A Compute node in Neon is a stateless Postgres process due to the separation of storage and compute. It has two main states: Active and Idle.

Active means that Postgres is running currently. If there are no active queries for 5 minutes, the activity monitor will gracefully put the corresponding compute node into the Idle state to save energy and resources. The activity monitor is conservative, and it treats 'idle in transaction' connections as some activities to avoid breaking an application logic that relies on long-lasting transactions. Yet, it closes all 'idle' connections after 5 minutes of complete inactivity.

You can connect to your compute at any time if it is Idle. Neon will automatically activate it. Activation usually happens within a few seconds, so the first connection in the Idle state will have higher latency. Also, the Postgres page cache (shared buffers) will be cold after waking up from Idle state, and your usual queries may take longer.

After some period in the Idle state, Neon will start occasionally activating your Compute to check data availability. The checks period will gradually increase up to several days if the Compute does not receive any client connections.

You can check all Compute state transitions in the Operations List widget on the Project dashboard.

## Compute Config

During the Technical Preview, Neon only supports modification to session level configuration parameters. Parameters are reset when the session is terminated (e.g. when compute is suspended).

See [Default Parameters](../../reference/compatibility#default-parameters).

See [https://www.postgresql.org/docs/14/runtime-config.html](https://www.postgresql.org/docs/14/runtime-config.html) for details.
