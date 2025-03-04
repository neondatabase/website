---
title: Platform maintenance
enableTableOfContents: true
isDraft: false
updatedOn: '2025-03-04T10:48:53.512Z'
---

Neon must occasionally perform essential platform maintenance outside the [scheduled updates](/docs/manage/updates) performed on Neon computes. This means that you may experience brief unscheduled disruptions from time to time.

Platform maintenance operations may include any of the following:

- Neon infrastructure updates and upgrades (e.g., updates to Neon Kubernetes clusters or compute nodes)
- Resource management operations (e.g., rebalancing of compute nodes)
- Critical security patches (e.g., addressing a zero-day vulnerability)

We strive to avoid disruptions as much as possible, but certain updates, such as essential platform maintenance or critical security patches, may require compute restarts or result in temporary latency for operations like compute starts, queries, or API requests.

<Admonition type="note">
Whenever possible, we try to perform essential platform maintenance outside of normal business hours in affected regions to minimize disruption.
</Admonition>

## Handling disruptions and latency during platform maintenance

Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived interruptions. This means that most applications are able to transparently reconnect to a Neon database following a brief disruption.

However, if your application has strict availability requirements, you may want to ensure that your connection settings are configured to allow for connection retries. Check your driver's documentation for options like connection timeouts, retry intervals, and connection pooling strategies. Your retry configuration should account for occasional disruptions. For related information, see [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application).

If your application or integration uses the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) or [SDKs](https://neon.tech/docs/reference/sdk) that wrap the Neon API, we recommend building in the same type of retry logic.

<NeedHelp/>
