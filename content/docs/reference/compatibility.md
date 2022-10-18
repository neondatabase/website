---
title: Neon Compatibility
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compatibility
---

Neon is protocol and application-compatible with PostgreSQL. However, when using the Neon cloud service, there are some limitations that you should be aware of.

## PostgreSQL versions

Neon cloud service is currently only compatible with PostgreSQL v14.

## Permissions

Neon cloud service does not currently provide users with access permissions other than those granted to standard database owners in PostgreSQL. Therefore, Neon users cannot access replication methods, create additional users or roles from a PostgreSQL connection, or install PostgreSQL extensions other than those permitted by Neon.

<a id="default-extensions/"></a>

## Available PostgreSQL extensions

During the Technical Preview, Neon permits installing the following PostgreSQL extensions:

| Extension                                                                     | Version | Note                                                                                                           |
| :---------------------------------------------------------------------------- | ------: | -------------------------------------------------------------------------------------------------------------- |
| [btree_gin](https://www.postgresql.org/docs/14/btree-gin.html)                |     1.3 |                                                                                                                |
| [btree_gist](https://www.postgresql.org/docs/14/btree-gist.html)              |     1.6 |                                                                                                                |
| [citext](https://www.postgresql.org/docs/14/citext.html)                      |     1.6 |                                                                                                                |
| [cube](https://www.postgresql.org/docs/14/cube.html)                          |     1.5 |                                                                                                                |
| [dict_int](https://www.postgresql.org/docs/14/dict-int.html)                  |     1.0 |                                                                                                                |
| [fuzzystrmatch](https://www.postgresql.org/docs/14/fuzzystrmatch.html)        |     1.1 |                                                                                                                |
| [h3_pg](https://github.com/zachasme/h3-pg/blob/main/docs/api.md)              |   4.0.1 |                                                                                                                |
| [hstore](https://www.postgresql.org/docs/14/hstore.html)                      |     1.8 |                                                                                                                |
| [intarray](https://www.postgresql.org/docs/14/intarray.html)                  |     1.5 |                                                                                                                |
| [isn](https://www.postgresql.org/docs/14/isn.html)                            |     1.2 |                                                                                                                |
| [lo](https://www.postgresql.org/docs/10/lo.html)                              |     1.1 |                                                                                                                |
| [ltree](https://www.postgresql.org/docs/14/ltree.html)                        |     1.2 |                                                                                                                |
| [pg_trgm](https://www.postgresql.org/docs/14/pgtrgm.html)                     |     1.6 |                                                                                                                |
| [pgcrypto](https://www.postgresql.org/docs/14/pgcrypto.html)                  |     1.3 |                                                                                                                |
| [plpgsql](https://www.postgresql.org/docs/14/plpgsql.html)                    |     1.0 | Pre-installed with PostgreSQL                                                                                  |
| [postgis](https://postgis.net/)                                               |   3.3.0 |                                                                                                                |
| [postgis_raster](https://postgis.net/docs/RT_reference.html)                  |   3.3.0 |                                                                                                                |
| [postgis_tiger_geocoder](https://postgis.net/docs/Extras.html#Tiger_Geocoder) |   3.3.0 | Cannot be installed using the Neon web UI. Use your `psql` user credentials to install this extension instead. |
| [postgis_topology](https://www.postgis.net/docs/Topology.html)                |   3.3.0 |                                                                                                                |
| [seg](https://www.postgresql.org/docs/14/seg.html)                            |     1.4 |                                                                                                                |
| [tablefunc](https://www.postgresql.org/docs/14/tablefunc.html)                |     1.0 |                                                                                                                |
| [tcn](https://www.postgresql.org/docs/14/tcn.html)                            |     1.0 |                                                                                                                |
| [tsm_system_rows](https://www.postgresql.org/docs/14/tsm-system-rows.html)    |     1.0 |                                                                                                                |
| [tsm_system_time](https://www.postgresql.org/docs/14/tsm-system-time.html)    |     1.0 |                                                                                                                |
| [unaccent](https://www.postgresql.org/docs/14/unaccent.html)                  |     1.1 |                                                                                                                |
| [uuid-ossp](https://www.postgresql.org/docs/14/uuid-ossp.html)                |     1.1 |                                                                                                                |

<a id="default-parameters/"></a>

## Neon PostgreSQL parameter settings

The following table lists Neon PostgreSQL parameter settings that may differ from the expected default.

| Parameter       | Value   | Note                                                                              |
| --------------- | ------- | --------------------------------------------------------------------------------- |
| fsync           | off     | Neon syncs data to the Neon Storage Engine to store your data safely and reliably |
| max_connections |         | The value depends on compute size. Set to 100 for the Technical Preview.          |
| shared_buffers  |         | The value depends on compute size                                                 |
| wal_level       | replica | Logical replication is currently not supported                                    |

**_Note_**: To increase the number of permitted connections, you can enable connection pooling. For more information, see [Connection pooling](/docs/get-started-with-neon/connection-pooling).

## Unlogged tables

Unlogged tables are maintained on Neon compute local storage. These tables do not survive compute restart (including when compute becomes idle). This is unlike a standalone PostgreSQL installation, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local storage size.

## Spill and index build handling

Certain queries in PostgreSQL can generate large datasets that do not fit in memory. In such cases, storage spills the data. In Neon, the size of compute local storage limits the ability to create large indexes or execute certain queries that generate large datasets.

## Temporary tables

Temporary tables, which are stored in compute local storage, are limited by compute local storage size.

## Session context

The Neon cloud service automatically closes idle connections after a period of inactivity, as described in [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). When connections are closed, anything defined within a session context is forgotten and must be recreated before being used again. For example, temporary tables, prepared statements, advisory locks, and notifications and listeners that were defined using the [NOTIFY](https://www.postgresql.org/docs/14/sql-notify.html)/[LISTEN](https://www.postgresql.org/docs/14/sql-listen.html) commands only exist for the duration of the current session and are lost when the session ends.

## Statistics collection

Statistics collected by the PostgreSQL [cumulative statistics system](https://www.postgresql.org/docs/14/monitoring-stats.html) are currently not saved when the Neon compute node is suspended due to inactivity or restarted. For information about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/).
