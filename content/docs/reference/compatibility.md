---
title: Neon Compatibility
redirectFrom:
  - /docs/conceptual-guides/compatibility
---

Neon is protocol- and application-compatible with PostgreSQL. However, when you connect to our cloud offering, there are some limitations that you need to take into account.

## PostgreSQL versions

Neon cloud service is currently only compatible with PostgreSQL v14.

## Permissions

Neon cloud service does not currently provide the user with access permissions other than those given to a standard database owner in PostgreSQL. Therefore, users of Neon cloud service cannot access either replication method, nor can they install extensions, nor are they allowed to create more users or roles from their PostgreSQL connection.

<a id="default-extensions/"></a>

## Available PostgreSQL Extensions

During the technical preview, Neon restricts the installation of PostgreSQL extensions.

The following PostgreSQL extensions can be installed by the user:

| Extension               | Version | Note |
|:------------------------|--------:|------|
| btree_gin               |     1.3 |      |
| btree_gist              |     1.6 |      |
| citext                  |     1.6 |      |
| cube                    |     1.5 |      |
| dict_int                |     1.0 |      |
| fuzzystrmatch           |     1.1 |      |
| hstore                  |     1.8 |      |
| intarray                |     1.5 |      |
| isn                     |     1.2 |      |
| lo                      |     1.1 |      |
| ltree                   |     1.2 |      |
| pg_trgm                 |     1.6 |      |
| pgcrypto                |     1.3 |      |
| plpgsql                 |     1.0 | Pre-installed with PostgreSQL |
| postgis                 |   3.3.0 |      |
| postgis_raster          |   3.3.0 |      |
| postgis_tiger_geocoder  |   3.3.0 | Cannot be installed using the Neon web UI. Use your `psql` user credentials to install this extension instead. |
| postgis_topology        |   3.3.0 |      |
| seg                     |     1.4 |      |
| tablefunc               |     1.0 |      |
| tcn                     |     1.0 |      |
| tsm_system_rows         |     1.0 |      |
| tsm_system_time         |     1.0 |      |
| unaccent                |     1.1 |      |
| uuid-ossp               |     1.1 |      |

<a id="default-parameters/"></a>

## Default Parameters

List of configuration parameters Neon uses by default:

To check settings that differ from PostgreSQL defaults, run this query:

```plsql
select * from pg_settings where source <> 'default';
```

| Name                 | Value   | Note                                                                                      |
| -------------------- | ------- | ----------------------------------------------------------------------------------------- |
| shared_buffers       | 512MB   |                                                                                           |
| fsync                | off     | Don’t be surprised. Neon syncs data to Neon Storage Engine and stores your data reliably. |
| wal_level            | replica |                                                                                           |
| max_connections      |         |                                                                                           |
| autovacuum_work_mem  |         |                                                                                           |
| work_mem             |         |                                                                                           |
| maintenance_work_mem |         |                                                                                           |

## Unlogged tables

Unlogged tables are maintained on local storage of Neon Compute. Such tables do not survive compute restart (incl. when compute becomes idle). Unlike vanilla PostgreSQL where unlogged relations are truncated in case of abnormal process termination (e.g. crash) only. Additionally, unlogged tables are limited in by the local storage on compute.

## Spill/Index build handling

Certain queries in PostgreSQL could generate a dataset which doesn’t fit in memory. In such cases, storage is used to spill the data. In Neon, local storage is limited on the compute which could limit ability to create large indexes or execute certain queries

## Temp Tables

Temp tables are limited in size by the Compute local storage. Temporary tables are stored locally on Compute.
