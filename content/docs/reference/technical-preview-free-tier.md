---
title: Technical Preview Free Tier
enableTableOfContents: true
---

The Neon cloud service is available for free during the Technical Preview. For information about how the Technical Preview fits within Neon's release plans, please refer to the [Neon roadmap](/docs/reference/roadmap).

Technical Preview Free Tier users can create up to three projects in Neon. Projects created using the Technical Preview Free Tier are subject to the following limits:

- Project data size is limited to 10GB
- The Point in Time Reset (PITR) window is limited to 7 days of _reasonable usage_
- The compute node is limited to 1 vCPU and 256MB of RAM

**_Note:_**: Neon intends to offer a Free Tier beyond the Technical Preview period. The limits associated with that tier will be defined in the coming months. Technical Preview Free Tier limits are subject to change over the course of the Technical Preview.

## Data Size

Neon separates storage and compute and stores data in its own internal format.
The 10GB data size limit applies to the logical size of a Neon project. The logical size is the sum of all relation sizes in the project.

To check the logical size of the relations in your Neon project, run the following query:

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

<!--
To check the logical size of your Neon project, run the following query:

```sql
SELECT pg_size_pretty(neon.pg_cluster_size());
```
-->

When the data size limit is reached, the following PostgreSQL error message is reported:

```text
could not extend file because cluster size limit (10240 MB)
has been exceeded
```

<a id="#point-in-time-reset/"></a>

## Point in Time Reset

Neon storage consumes extra space in order to support Point in Time Reset (PITR) and the ability to reset a branch to a historical state. Historical data is stored in log-based format.

Neon limits the amount of modification history that is stored in the Technical Preview Free Tier.
