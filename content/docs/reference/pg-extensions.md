---
title: Supported PostgreSQL Extensions
enableTableOfContents: true
---

Neon supports the PostgreSQL extensions shown in the following table. For extension documentation, select the extension version.

Unless otherwise noted, supported extensions can be installed from the Neon SQL Editor using [CREATE EXTENSION](https://www.postgresql.org/docs/14/sql-createextension.html) syntax.

```sql
CREATE EXTENSION <extension_name>
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).

<a id="default-extensions/"></a>

| Extension                | Extension Version (PostgreSQL 14)                               | Extension Version (PostgreSQL 15)                                |Note                                                                                                                |
| :------------------------| --------------------------------------------------------------: | ----------------------------------------------------------------:| :------------------------------------------------------------------------------------------------------------------|
| address_standardizer     | [3.1.7](https://postgis.net/docs/Extras.html#Address_Standardizer)  | [3.1.7](https://postgis.net/docs/Extras.html#Address_Standardizer)  |                                                                                                             |
| address_standardizer_data_us     | [3.1.7](https://postgis.net/docs/Extras.html#Address_Standardizer)        | [3.1.7](https://postgis.net/docs/Extras.html#Address_Standardizer) |                                                                                                |
| bloom                    | [1.0](https://www.postgresql.org/docs/14/bloom.html)            | [1.0](https://www.postgresql.org/docs/15/bloom.html)             |                                                                                                                    |
| btree_gin                | [1.3](https://www.postgresql.org/docs/14/btree-gin.html)        | [1.3](https://www.postgresql.org/docs/15/btree-gin.html)         |                                                                                                                    |
| btree_gist               | [1.6](https://www.postgresql.org/docs/14/btree-gist.html)       | [1.7](https://www.postgresql.org/docs/15/btree-gist.html)        |                                                                                                                    |
| citext                   | [1.6](https://www.postgresql.org/docs/14/citext.html)           | [1.6](https://www.postgresql.org/docs/15/citext.html)            |                                                                                                                    |
| cube                     | [1.5](https://www.postgresql.org/docs/14/cube.html)             | [1.5](https://www.postgresql.org/docs/15/cube.html)              |                                                                                                                    |
| dict_int                 | [1.0](https://www.postgresql.org/docs/14/dict-int.html)         | [1.0](https://www.postgresql.org/docs/15/dict-int.html)          |                                                                                                                    |
| earthdistance            | [1.1](https://www.postgresql.org/docs/14/earthdistance.html)    | [1.1](https://www.postgresql.org/docs/15/earthdistance.html)     |                                                                                                                    |
| fuzzystrmatch            | [1.1](https://www.postgresql.org/docs/14/fuzzystrmatch.html)    | [1.1](https://www.postgresql.org/docs/15/fuzzystrmatch.html)     |                                                                                                                    |
| h3_pg                    | [4.0.1](https://github.com/zachasme/h3-pg/blob/main/docs/api.md)| [4.0.1](https://github.com/zachasme/h3-pg/blob/main/docs/api.md) |                                                                                                                    |
| hstore                   | [1.8](https://www.postgresql.org/docs/14/hstore.html)           | [1.8](https://www.postgresql.org/docs/15/hstore.html)            |                                                                                                                    |
| intagg                   | [1.1](https://www.postgresql.org/docs/14/intagg.html)           | [1.1](https://www.postgresql.org/docs/15/intagg.html)            |                                                                                                                    |
| intarray                 | [1.5](https://www.postgresql.org/docs/14/intarray.html)         | [1.5](https://www.postgresql.org/docs/15/intarray.html)          |                                                                                                                    |
| isn                      | [1.2](https://www.postgresql.org/docs/14/isn.html)              | [1.2](https://www.postgresql.org/docs/15/isn.html)               |                                                                                                                    |
| lo                       | [1.1](https://www.postgresql.org/docs/14/lo.html)               | [1.1](https://www.postgresql.org/docs/15/lo.html)                |                                                                                                                    |
| ltree                    | [1.2](https://www.postgresql.org/docs/14/ltree.html)            | [1.2](https://www.postgresql.org/docs/15/ltree.html)             |                                                                                                                    |
| pg_prewarm               | [1.2](https://www.postgresql.org/docs/14/pgprewarm.html)        | [1.2](https://www.postgresql.org/docs/15/pgprewarm.html)         |                                                                                                                    |
| pg_trgm                  | [1.6](https://www.postgresql.org/docs/14/pgtrgm.html)           | [1.6](https://www.postgresql.org/docs/15/pgtrgm.html)            |                                                                                                                    |
| pgcrypto                 | [1.3](https://www.postgresql.org/docs/14/pgcrypto.html)         | [1.3](https://www.postgresql.org/docs/15/pgcrypto.html)          |                                                                                                                    |
| pgrowlocks               | [1.2](https://www.postgresql.org/docs/14/pgrowlocks.html)       | [1.2](https://www.postgresql.org/docs/15/pgrowlocks.html)        |                                                                                                                    |
| pgstattuple              | [1.5](https://www.postgresql.org/docs/14/pgstattuple.html)      | [1.5](https://www.postgresql.org/docs/15/pgstattuple.html)       |                                                                                                                    |
| plpgsql                  | [1.0](https://www.postgresql.org/docs/14/plpgsql.html)          | [1.0](https://www.postgresql.org/docs/15/plpgsql.html)           | Pre-installed with PostgreSQL.                                                                                     |
| plv8                     | [3.1.4](https://plv8.github.io/)                                | [3.1.4](https://plv8.github.io/)                                 |                                                                                                                    |
| postgis                  | [3.3.0](https://postgis.net/)                                   | [3.3.1](https://postgis.net/)                                    |                                                                                                                    |
| postgis_raster           | [3.3.0](https://postgis.net/docs/RT_reference.html)             | [3.3.1](https://postgis.net/docs/RT_reference.html)              |                                                                                                                    |
| postgis_tiger_geocoder   | [3.3.0](https://postgis.net/docs/Extras.html#Tiger_Geocoder)    | [3.3.1](https://postgis.net/docs/Extras.html#Tiger_Geocoder)     | Cannot be installed using the Neon SQL Editor. Use your `psql` user credentials to install this extension.         |
| postgis_topology         | [3.3.0](https://www.postgis.net/docs/Topology.html)             | [3.3.1](https://www.postgis.net/docs/Topology.html)              |                                                                                                                    |
| postgis_sfcgal           | [1.3.10](https://oslandia.gitlab.io/SFCGAL/)                    | [1.3.10](https://oslandia.gitlab.io/SFCGAL/)                     |                                                                                                                    |
| seg                      | [1.4](https://www.postgresql.org/docs/14/seg.html)              | [1.4](https://www.postgresql.org/docs/15/seg.html)               |                                                                                                                    |
| tablefunc                | [1.0](https://www.postgresql.org/docs/14/tablefunc.html)        | [1.0](https://www.postgresql.org/docs/15/tablefunc.html)         |                                                                                                                    |
| tcn                      | [1.0](https://www.postgresql.org/docs/14/tcn.html)              | [1.0](https://www.postgresql.org/docs/15/tcn.html)               |                                                                                                                    |
| tsm_system_rows          | [1.0](https://www.postgresql.org/docs/14/tsm-system-rows.html)  | [1.0](https://www.postgresql.org/docs/15/tsm-system-rows.html)   |                                                                                                                    |
| tsm_system_time          | [1.0](https://www.postgresql.org/docs/14/tsm-system-time.html)  | [1.0](https://www.postgresql.org/docs/15/tsm-system-time.html)   |                                                                                                                    |
| unaccent                 | [1.1](https://www.postgresql.org/docs/14/unaccent.html)         | [1.1](https://www.postgresql.org/docs/15/unaccent.html)          |                                                                                                                    |
| unit                     | [7.7](https://github.com/df7cb/postgresql-unit)                 | [7.7](https://github.com/df7cb/postgresql-unit)                  |                                                                                                                    |
| uuid-ossp                | [1.1](https://www.postgresql.org/docs/14/uuid-ossp.html)        | [1.1](https://www.postgresql.org/docs/15/uuid-ossp.html)         | Double-quote the extension name when installing: `CREATE EXTENSION "uuid-ossp"`                                    |

| pgvector                 | [0.4.0](https://github.com/pgvector/pgvector)                 | [0.4.0](https://github.com/pgvector/pgvector)postgresql-unit)                  |
| plls                     | [3.1.4](https://github.com/plv8/plv8/)            | [3.1.4](https://github.com/plv8/plv8/postgresql-unit)                  |   
| plcoffee                 | [3.1.4](https://github.com/plv8/plv8/)            | [3.1.4](https://github.com/plv8/plv8/)                  |  

## Extension support notes

- Neon supports the `uuid-ossp` extension for generating UUIDs rather than the `uuid` extension.
- The `sslinfo` extension is not supported, as Neon handles connections via a proxy that checks SSL.
- The `pg_cron` extension is not supported. Neon scales to zero when it is not being used, which means that a scheduler that runs inside the database cannot be implemented. Consider using an scheduler that runs externally instead.
- The `file_fdw` extension is not supported. Files would not remain accessible when Neon scales to zero.

## Request extension support

To request support for additional extensions, please contact us at [support@neon.tech](mailto:support@neon.tech) or post your request to the [Neon community forum](https://community.neon.tech/).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
