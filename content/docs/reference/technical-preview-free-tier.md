---
title: Technical Preview Free Tier
enableTableOfContents: true
---

The Neon cloud service is available for free during the Technical Preview. For information about how the Technical Preview fits within Neon's release plans, please refer to the [Neon roadmap](/docs/reference/roadmap).

The Technical Preview Free Tier has the following limits:

- Each Neon user account can create one Neon project
- Each Neon project can have up to 10 branches
- Each branch permits up to 3GB of data
- Each project supports up to three compute nodes (endpoints) running simultaneously
- Each compute node is limited to 1 vCPU and 256MB of RAM
- The Point in Time Reset (PITR) window for data is limited to 7 days of _reasonable usage_

<Admonition type="note">
Neon intends to offer a Free Tier beyond the Technical Preview period. The limits associated with that tier will be defined in the coming months. Technical Preview Free Tier limits are subject to change over the course of the Technical Preview.
</Admonition>

## Data Size

Neon stores data in its own internal format. The 10GB data size limit in the Technical Preview free tier applies to the logical size of your Neon project. The logical size is the sum of all database sizes in the branches of your project. For information about checking the data size of your Neon project, see [../../manage/projects](Projects).

<a id="#point-in-time-reset/"></a>

## Point in Time Reset

Neon storage consumes extra space in order to support Point in Time Reset (PITR) and the ability to reset a branch to a historical state. Historical data is stored in log-based format.

Neon limits the amount of modification history that is stored in the Technical Preview Free Tier, as described above.
