---
title: Scale to zero
subtitle: Scale computes to zero when not in use
redirectFrom:
  - /docs/introduction/scale-to-zero
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.952Z'
---

Neon's _Scale to zero_ feature controls when a Neon compute transitions to an idle state due to inactivity.

By default, a Neon compute scales to zero after 300 seconds (5 minutes) of inactivity. For [Neon Free Plan](/docs/introduction/plans#free-plan) users, this setting is fixed. Users on paid plans can increase, decrease, or disable the scale to zero setting, controlling if and when a compute is transitioned to an idle state.

Reasons for adjusting the scale to zero setting might include:

- **Avoiding cold starts**. Restarting a compute from an idle state general takes just a few hundred milliseconds (see [Compute lifecycle](/docs/introduction/compute-lifecycle)) — often referred to as a "cold start". You can turn off the _Scale to zero_ feature to avoid cold starts entirely.
- **Reducing the frequency of cold starts**. You can configure scale to zero to occur less frequently, keeping your compute active during busier hours while ensuring that it suspends when usage drops off.
- **Suspending a compute more quickly to reduce compute usage**. Compute startup times can be as low as a few hundred milliseconds, which may be sufficient for your purposes. In this case, you can suspend computes more frequently reduce compute usage.

You can configure the scale to zero setting in an existing project by editing a compute. For instructions, refer to [Configuring scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).
