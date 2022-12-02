---
title: Technical Preview Free Tier
enableTableOfContents: true
redirectFrom:
  - /docs/reference/technical-preview-free-tier
---

The Neon cloud service is available for free during the Technical Preview. For information about how the Technical Preview fits within Neon's release plans, please refer to the [Neon roadmap](/docs/reference/roadmap).

The Technical Preview Free Tier has the following limits:

- 1 Neon project
- 10 branches, with a limit of 3GB of data
- 3 compute nodes (endpoints), each with 1 vCPU and up to 4GB of RAM (with 512MB of RAM allocated to PostgreSQL shared buffers)
- A point-in-rime reset (PITR) window of 7 days of _reasonable usage_

<Admonition type="note">
Neon intends to offer a Free Tier beyond the Technical Preview period. The limits associated with that tier will be defined in the coming months. Technical Preview Free Tier limits are subject to change over the course of the Technical Preview.
</Admonition>

## Data Size

Neon stores data in its own internal format. The data size limit in the Technical Preview free tier applies to the logical size of your branch. The logical size is the sum of all database sizes in the branch of your project.

<a id="#point-in-time-reset/"></a>

## Point in Time Reset

Neon storage consumes extra space in order to support Point in Time Reset (PITR) and the ability to reset a branch to a historical state. Historical data is stored in log-based format.

Neon limits the amount of modification history that is stored in the Technical Preview Free Tier.
