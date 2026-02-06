---
title: Platform maintenance
summary: >-
  Covers the process of Neon platform maintenance, detailing potential
  disruptions, types of updates performed, and how to monitor for maintenance
  notifications while ensuring applications handle brief interruptions
  effectively.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-02-06T22:07:33.120Z'
---

Neon occasionally performs essential **platform maintenance** outside of [scheduled updates](/docs/manage/updates) performed on Neon computes. This means that you may experience brief disruptions from time to time for these important updates.

Platform maintenance may include any of the following:

- Neon infrastructure updates and upgrades (e.g., updates to Neon Kubernetes clusters or compute nodes)
- Resource management updates (e.g., rebalancing of compute nodes)
- Critical security patches (e.g., addressing a zero-day vulnerability)

We strive to avoid disruptions as much as possible, but certain updates may require compute restarts or result in temporary latency for operations like compute starts, queries, or API requests.

<Admonition type="note">
Whenever possible, we perform platform maintenance outside of normal business hours in affected regions to minimize disruption.
</Admonition>

## Where to check for maintenance

For notification of planned platform maintenance, you can monitor or subscribe to the [Neon Status page](https://neonstatus.com/) for your region. To learn more, see [Neon Status](/docs/introduction/status).

If there is ongoing maintenance, you'll see a **Maintenance** indicator at the top of the Neon Console. Clicking on the indicator takes you to the Neon Status page where you can read the maintenance notification.

![Maintenance indicator](/docs/manage/maintenance_indicator.png)

## Handling disruptions and latency during platform maintenance

Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived interruptions, so most applications reconnect to a Neon database automatically after a brief disruption.

If your application has strict SLOs (Service Level Objectives) or availability requirements, verify that retries are enabled and that you have tuned connection timeouts, retry intervals, and pooling strategies to tolerate occasional disruptions. For detailed guidance, see:

- [Building resilient applications with Postgres](/guides/building-resilient-applications-with-postgres)
- [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application)

If you use the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) or [SDKs](/docs/reference/sdk) that wrap it, apply the same retry logic to those calls.

<NeedHelp/>
