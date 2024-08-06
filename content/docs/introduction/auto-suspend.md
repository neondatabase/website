---
title: Autosuspend
subtitle: Scale computes to zero when not in use
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.952Z'
---

Neon's _Autosuspend_ feature controls when a Neon compute transitions to an `Idle` state (scales to zero) due to inactivity.

By default, a Neon compute scales to zero after 300 seconds (5 minutes) of inactivity. For [Neon Free Plan](/docs/introduction/plans#free-plan) users, this setting is fixed. Users on paid plans can increase, decrease, or disable the autosuspend setting, controlling when or if a compute scales to zero.

Reasons for adjusting the autosuspend setting might include:

- **Avoiding cold starts**. Restarting a compute from an `Idle` state can take anywhere from 500 ms to a few seconds (see [Compute lifecycle](/docs/introduction/compute-lifecycle)). You can turn off the _Autosuspend_ feature to avoid cold starts.
- **Reducing the frequency of cold starts**. You can configure autosuspend to occur less frequently, keeping your compute active during busier hours while ensuring that it suspends when usage drops off.
- **Suspending a compute more quickly to reduce compute usage**. Compute startup times can be as low as 500 ms, which may be sufficient for your purposes. In this case, you can suspend computes more frequently reduce compute usage.

You can configure the autosuspend setting in an existing project by editing a compute. You can also configure it when you first create a Neon project, which sets the autosuspend default for the project. For instructions, refer to [Configuring autosuspend for Neon computes](/docs/guides/auto-suspend-guide).
