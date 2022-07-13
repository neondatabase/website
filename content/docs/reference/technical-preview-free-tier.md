---
title: Technical Preview Free Tier
---

Neon cloud service is available for free during the [Limited and the Technical Preview](../roadmap).

Technical Preview Free Tier users can only create three Projects in Neon. Projects created under Technical Preview Free Tier are subject to additional limits:

- Data size in the Project is limited to 10GB;
- PITR time window is limited to 7 days of _reasonable usage_;
- Compute node can use up to 1vCPU/256 MB.

_Note: We intend to keep a Free Tier and will shape the limits over the course of this year. Technical Preview Free Tier limits are subject to change over the course of [Technical Preview](../roadmap)._

## Data Size

Neon separates storage and compute and stores data in its own internal format.
Data Size limit applies to the logical size of the Project. The logical size is the sum of all relation sizes in the Project.

If you are familiar with PostgreSQL, the logical size is roughly equal to

```sql
select pg_size_pretty(sum(pg_database_size(datname)))
from pg_database;
```

To check the logical size run the following query:

```sql
select pg_size_pretty(neon.pg_cluster_size());
```

When the limit is reached, you will see the PostgreSQL error message:

```text
could not extend file because cluster size limit (10240 MB)
has been exceeded
```

## Point in Time Reset

Neon storage consumes extra space in order to support Point in Time Reset (PITR) and the ability to reset a branch to a historical state. The historical data is stored in log based format.

Neon has limits on the amount of modification history stored for the [Technical Preview Free Tier](#free-tier) customers.

## Compute Config

During the Technical Preview, Neon only supports modification to session level configuration parameters. Parameters are reset when the session is terminated (e.g. when compute is suspended).

See [Default Parameters](../compatibility#default-parameters).

See [https://www.postgresql.org/docs/14/runtime-config.html](https://www.postgresql.org/docs/14/runtime-config.html) for details.
