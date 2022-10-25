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

During the Technical Preview, Neon permits installing the PostgreSQL extensions shown in the following table. For extension documentation, select the extension version.

Unless otherwise noted, supported extensions can be installed from the Neon SQL Editor using [CREATE EXTENSION](https://www.postgresql.org/docs/14/sql-createextension.html) syntax.

```sql
CREATE EXTENSION <extension_name>
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](../../get-started-with-neon/query-with-neon-sql-editor).

| Extension                | Extension Version (PostgreSQL 14)                               | Extension Version (PostgreSQL 15)                                |Note                                                                                                                |
| :------------------------| --------------------------------------------------------------: | ----------------------------------------------------------------:| :------------------------------------------------------------------------------------------------------------------|
| btree_gin                | [1.3](https://www.postgresql.org/docs/14/btree-gin.html)        | [1.3](https://www.postgresql.org/docs/15/btree-gin.html)         |                                                                                                                    |
| btree_gist               | [1.6](https://www.postgresql.org/docs/14/btree-gist.html)       | [1.7](https://www.postgresql.org/docs/15/btree-gist.html)        |                                                                                                                    |
| citext                   | [1.6](https://www.postgresql.org/docs/14/citext.html)           | [1.6](https://www.postgresql.org/docs/15/citext.html)            |                                                                                                                    |
| cube                     | [1.5](https://www.postgresql.org/docs/14/cube.html)             | [1.5](https://www.postgresql.org/docs/15/cube.html)              |                                                                                                                    |
| dict_int                 | [1.0](https://www.postgresql.org/docs/14/dict-int.html)         | [1.0](https://www.postgresql.org/docs/15/dict-int.html)          |                                                                                                                    |
| fuzzystrmatch            | [1.1](https://www.postgresql.org/docs/14/fuzzystrmatch.html)    | [1.1](https://www.postgresql.org/docs/15/fuzzystrmatch.html)     |                                                                                                                    |
| h3_pg                    | [4.0.1](https://github.com/zachasme/h3-pg/blob/main/docs/api.md)| [4.0.1](https://github.com/zachasme/h3-pg/blob/main/docs/api.md) |                                                                                                                    |
| hstore                   | [1.8](https://www.postgresql.org/docs/14/hstore.html)           | [1.8](https://www.postgresql.org/docs/15/hstore.html)            |                                                                                                                    |
| intarray                 | [1.5](https://www.postgresql.org/docs/14/intarray.html)         | [1.5](https://www.postgresql.org/docs/15/intarray.html)          |                                                                                                                    |
| isn                      | [1.2](https://www.postgresql.org/docs/14/isn.html)              | [1.2](https://www.postgresql.org/docs/15/isn.html)               |                                                                                                                    |
| lo                       | [1.1](https://www.postgresql.org/docs/10/lo.html)               | [1.1](https://www.postgresql.org/docs/10/lo.html)                |                                                                                                                    |
| ltree                    | [1.2](https://www.postgresql.org/docs/14/ltree.html)            | [1.2](https://www.postgresql.org/docs/15/ltree.html)             |                                                                                                                    |
| pg_trgm                  | [1.6](https://www.postgresql.org/docs/14/pgtrgm.html)           | [1.6](https://www.postgresql.org/docs/15/pgtrgm.html)            |                                                                                                                    |
| pgcrypto                 | [1.3](https://www.postgresql.org/docs/14/pgcrypto.html)         | [1.3](https://www.postgresql.org/docs/15/pgcrypto.html)          |                                                                                                                    |
| plpgsql                  | [1.0](https://www.postgresql.org/docs/14/plpgsql.html)          | [1.0](https://www.postgresql.org/docs/15/plpgsql.html)           | Pre-installed with PostgreSQL.                                                                                     |
| plv8                     | [3.1.4](https://plv8.github.io/)                                | [3.1.4](https://plv8.github.io/)                                 |                                                                                                                    |
| postgis                  | [3.3.0](https://postgis.net/)                                   | [3.3.1](https://postgis.net/)                                    |                                                                                                                    |
| postgis_raster           | [3.3.0](https://postgis.net/docs/RT_reference.html)             | [3.3.1](https://postgis.net/docs/RT_reference.html)              |                                                                                                                    |
| postgis_tiger_geocoder   | [3.3.0](https://postgis.net/docs/Extras.html#Tiger_Geocoder)    | [3.3.1](https://postgis.net/docs/Extras.html#Tiger_Geocoder)     | Cannot be installed using the Neon SQL Editor. Use your `psql` user credentials to install this extension instead. |
| postgis_topology         | [3.3.0](https://www.postgis.net/docs/Topology.html)             | [3.3.1](https://www.postgis.net/docs/Topology.html)              |                                                                                                                    |
| seg                      | [1.4](https://www.postgresql.org/docs/14/seg.html)              | [1.4](https://www.postgresql.org/docs/15/seg.html)               |                                                                                                                    |
| tablefunc                | [1.0](https://www.postgresql.org/docs/14/tablefunc.html)        | [1.0](https://www.postgresql.org/docs/15/tablefunc.html)         |                                                                                                                    |
| tcn                      | [1.0](https://www.postgresql.org/docs/14/tcn.html)              | [1.0](https://www.postgresql.org/docs/15/tcn.html)               |                                                                                                                    |
| tsm_system_rows          | [1.0](https://www.postgresql.org/docs/14/tsm-system-rows.html)  | [1.0](https://www.postgresql.org/docs/15/tsm-system-rows.html)   |                                                                                                                    |
| tsm_system_time          | [1.0](https://www.postgresql.org/docs/14/tsm-system-time.html)  | [1.0](https://www.postgresql.org/docs/15/tsm-system-time.html)   |                                                                                                                    |
| unaccent                 | [1.1](https://www.postgresql.org/docs/14/unaccent.html)         | [1.1](https://www.postgresql.org/docs/15/unaccent.html)          |                                                                                                                    |
| uuid-ossp                | [1.1](https://www.postgresql.org/docs/14/uuid-ossp.html)        | [1.1](https://www.postgresql.org/docs/15/uuid-ossp.html)         |                                                                                                                    |

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
