---
title: Compute lifecycle
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compute-lifecycle
updatedOn: '2024-12-13T20:52:57.586Z'
---

A compute in Neon is a stateless Postgres process due to the separation of storage and compute. It has two main states: `Idle` and `Active`.

Generally, an idle compute has been suspended by Neon's scale to zero feature due to inactivity, while an `Active` compute has been activated by a connection or operation, indicating that Postgres is currently running.

## Scale to zero

If there are no active queries for 5 minutes, which is the scale to zero setting in Neon, your compute is automatically placed into an idle state. If you are on a paid plan, you can disable the scale to zero behavior so that a compute always remains active. This behavior is controlled by your compute's **Scale to zero** setting.

![Scale to zero configuration dialog](/docs/introduction/autosuspend_config.png)

For information about configuring this setting, see [Edit a compute](/docs/manage/endpoints#edit-a-compute).

<Admonition type="note">
Neon's _Scale to Zero_ feature is conservative. It treats an "idle-in-transaction" connection as active to avoid breaking application logic that involves long-running transactions. Only the truly inactive connections are closed after the defined period of inactivity.
</Admonition>

## Compute activation

When you connect to an idle compute, Neon automatically activates it. Activation generally takes a few hundred milliseconds.

Considering this activation time, your first connection may have a slightly higher latency than subsequent connections to an already-active compute. Also, Postgres memory buffers are cold after a compute wakes up from the idle state, which means that initial queries may take longer until the memory buffers are warmed.

After a period of time in the idle state, Neon occasionally activates your compute to check for data availability. The time between checks gradually increases if the compute does not receive any client connections over an extended period.

In the **Branches** widget on your **Project Dashboard**, you can check if a compute is active or idle and watch as it transitions from one state to another.

![Compute state](/docs/introduction/compute_state.png)

## Session context considerations

When connections are closed due to a compute being suspended, anything that exists within a session context is forgotten and must be recreated before being used again. For example, Postgres parameters set for a specific session, in-memory statistics, temporary tables, prepared statements, advisory locks, and notifications and listeners defined using `NOTIFY/LISTEN` commands only exist for the duration of the current session and are lost when the session ends.

For more, see [Session context](/docs/reference/compatibility#session-context).
