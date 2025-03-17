---
title: Platform maintenance
enableTableOfContents: true
isDraft: false
tag: new
updatedOn: '2025-03-06T17:12:06.387Z'
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

Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived interruptions. This means that most applications are able to transparently reconnect to a Neon database following a brief disruption.

However, if your application has strict availability requirements, you may want to ensure that your connection settings are configured to allow for connection retries. Check your driver's documentation for options like connection timeouts, retry intervals, and connection pooling strategies. Your configuration should account for occasional disruptions. For related information, see [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application).

If your application or integration uses the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) or [SDKs](https://neon.tech/docs/reference/sdk) that wrap the Neon API, we recommend building in the same type of retry logic.

<NeedHelp/>
