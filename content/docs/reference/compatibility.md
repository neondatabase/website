---
title: Neon Compatibility
redirectFrom:
  - /docs/conceptual-guides/compatibility
---

Neon is protocol and application-compatible with PostgreSQL. However, when using Neon, there are some limitations that you should be aware of.

## PostgreSQL Versions

Neon cloud service is currently only compatible with PostgreSQL v14.

## Permissions

Neon cloud service does not currently provide users with access permissions other than those granted to standard database owners in PostgreSQL. Therefore, Neon cloud service users cannot access replication methods, create additional users or roles from a PostgreSQL connection, or install PostgreSQL extensions other than those permitted by Neon.

<a id="default-extensions/"></a>

## Available PostgreSQL Extensions

During the technical preview, Neon restricts the installation of PostgreSQL extensions.

Installation is permitted for the following PostgreSQL extensions:

| Extension               | Version | Note |
|:------------------------|--------:|------|
| [btree_gin](https://www.postgresql.org/docs/14/btree-gin.html)               |     1.3 |      |
| [btree_gist](https://www.postgresql.org/docs/14/btree-gist.html)              |     1.6 |      |
| [citext](https://www.postgresql.org/docs/14/citext.html)                  |     1.6 |      |
| [cube](https://www.postgresql.org/docs/14/cube.html)                    |     1.5 |      |
| [dict_int](https://www.postgresql.org/docs/14/dict-int.html)                |     1.0 |      |
| [fuzzystrmatch](https://www.postgresql.org/docs/14/fuzzystrmatch.html)           |     1.1 |      |
| [hstore](https://www.postgresql.org/docs/14/hstore.html)                  |     1.8 |      |
| [intarray](https://www.postgresql.org/docs/14/intarray.html)                |     1.5 |      |
| [isn](https://www.postgresql.org/docs/14/isn.html)                     |     1.2 |      |
| [lo](https://www.postgresql.org/docs/10/lo.html)                      |     1.1 |      |
| [ltree](https://www.postgresql.org/docs/14/ltree.html)                   |     1.2 |      |
| [pg_trgm](https://www.postgresql.org/docs/14/pgtrgm.html)                 |     1.6 |      |
| [pgcrypto](https://www.postgresql.org/docs/14/pgcrypto.html)                |     1.3 |      |
| [plpgsql](https://www.postgresql.org/docs/current/plpgsql.html)                 |     1.0 | Pre-installed with PostgreSQL |
| [postgis](https://postgis.net/)                 |   3.3.0 |      |
| [postgis_raster](https://postgis.net/docs/raster.html)          |   3.3.0 |      |
| [postgis_tiger_geocoder](http://postgis.net/docs/Geocode.html)  |   3.3.0 | Cannot be installed using the Neon web UI. Use your `psql` user credentials to install this extension instead. |
| [postgis_topology](http://postgis.net/docs/manual-dev/Topology.html)        |   3.3.0 |      |
| [seg](https://www.postgresql.org/docs/current/seg.html)                     |     1.4 |      |
| [tablefunc](https://www.postgresql.org/docs/current/tablefunc.html)               |     1.0 |      |
| [tcn](https://www.postgresql.org/docs/current/tcn.html)                     |     1.0 |      |
| [tsm_system_rows](https://www.postgresql.org/docs/current/tsm-system-rows.html)         |     1.0 |      |
| [tsm_system_time](https://www.postgresql.org/docs/current/tsm-system-time.html)         |     1.0 |      |
| [unaccent](https://www.postgresql.org/docs/current/unaccent.html)                |     1.1 |      |
| [uuid-ossp](https://www.postgresql.org/docs/current/uuid-ossp.html)               |     1.1 |      |

<a id="default-parameters/"></a>

## Default Parameters

The following table lists configuration parameters that Neon uses by default.

To check settings that differ from PostgreSQL defaults, run this query:

```plsql
SELECT * FROM pg_settings WHERE SOURCE <> 'default';
```

| Parameter            | Value   | Note                                                                                      |
| -------------------- | ------- | ----------------------------------------------------------------------------------------- |
| shared_buffers       | 512MB   |                                                                                           |
| fsync                | off     | Don’t be surprised. Neon syncs data to Neon Storage Engine and stores your data reliably. |
| wal_level            | replica |                                                                                           |
| max_connections      |         |                                                                                           |
| autovacuum_work_mem  |         |                                                                                           |
| work_mem             |         |                                                                                           |
| maintenance_work_mem |         |                                                                                           |

## Unlogged Tables

Unlogged tables are maintained on Neon compute local storage. These tables do not survive compute restart (including when compute becomes idle). This is unlike vanilla PostgreSQL, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local storage size.

## Spill and Index Build Handling

Certain queries in PostgreSQL can generate large datasets that do not fit in memory. In such cases, storage spills the data. In Neon, the size of compute local storage limits the ability to create large indexes or execute certain queries that generate large datasets.

## Temporary Tables

Temporary tables, which are stored in compute local storage,  are limited by compute local storage size.
