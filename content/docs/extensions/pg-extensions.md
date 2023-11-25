---
title: Postgres extensions
enableTableOfContents: true
redirectFrom:
  - /docs/reference/pg-extensions
updatedOn: '2023-11-24T11:25:06.746Z'
---

Neon supports the Postgres extensions shown in the following table. The supported version of the extension sometimes differs by Postgres version.

<a id="default-extensions/"></a>

| Extension                | PG14                               | PG15  | PG16                              |Notes                                                                                                                |
| :------------------------| --------------------------------------------------------------: | ----------------------------------------------------------------:| ----------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------|
| [address_standardizer](https://postgis.net/docs/Extras.html#Address_Standardizer)     | 3.3.3  | 3.3.3  |    3.3.3  |                                                                                                          |
| [address_standardizer_data_us](https://postgis.net/docs/Extras.html#Address_Standardizer)      | 3.3.3        | 3.3.3 | 3.3.3 |                                                                                                 |
| [autoinc (spi)](https://www.postgresql.org/docs/current/contrib-spi.html)             | 1.0 | 1.0  |   1.0  |                                                                                                                 |
| [bloom](https://www.postgresql.org/docs/15/bloom.html)                     | 1.0            | 1.0             |   1.0             |                                                                                                                  |
| [btree_gin](https://www.postgresql.org/docs/15/btree-gin.html)                | 1.3        | 1.3         |      1.3         |                                                                                                              |
| [btree_gist](https://www.postgresql.org/docs/15/btree-gist.html)               | 1.6       | 1.7        |    1.7        |                                                                                                                  |
| [citext](https://www.postgresql.org/docs/15/citext.html)                   | 1.6           | 1.6            |    1.6            |                                                                                                                  |
| [cube](https://www.postgresql.org/docs/15/cube.html)                    | 1.5             | 1.5              |    1.5              |                                                                                                                 |
| [dict_int](https://www.postgresql.org/docs/15/dict-int.html)                 | 1.0         | 1.0          |     1.0          |                                                                                                                 |
| [earthdistance](https://www.postgresql.org/docs/15/earthdistance.html)            | 1.1    | 1.1     |  1.1     |                                                                                                                   |
| [fuzzystrmatch](https://www.postgresql.org/docs/15/fuzzystrmatch.html)            | 1.1    | 1.1     |   1.1     |                                                                                                                 |
| [h3](https://github.com/zachasme/h3-pg/blob/main/docs/api.md)                       | 4.1.3| 4.1.3 | 4.1.3 | Some components have been split out into the `h3_postgis` extension. Install both the `h3` and `h3_postgis` extensions.                                                                                                                   |
| [h3_postgis](https://github.com/zachasme/h3-pg/blob/main/docs/api.md)               | 4.1.2| 4.1.3 |  4.1.2 | Install with `CREATE EXTENSION h3_postgis CASCADE;` (requires `postgis` and `postgis_raster`)                                                                 |
| [hll](https://github.com/citusdata/postgresql-hll)                      | 2.18             | 2.18              |  2.18              |                                                                                                                   |
| [hstore](https://www.postgresql.org/docs/15/hstore.html)                   | 1.8           | 1.8            | 1.8            |                                                                                                                   |
| [hypopg](https://hypopg.readthedocs.io/en/rel1_stable/)                   | 1.4.0          | 1.4.0           |  1.4.0           |                                                                                                                  |
| [insert_username (spi)](https://www.postgresql.org/docs/current/contrib-spi.html)    | 1.0 | 1.0  |   1.0  |                                                                                                                 |
| [intagg](https://www.postgresql.org/docs/15/intagg.html)                   | 1.1           | 1.1           |  1.1           |                                                                                                                   |
| [intarray](https://www.postgresql.org/docs/15/intarray.html)               | 1.5         | 1.5         |  1.5         |                                                                                                                   |
| [ip4r](https://github.com/RhodiumToad/ip4r)                     | 2.4.2                    | 2.4.2                    |   2.4.2                    |                                                                                                                   |
| [isn](https://www.postgresql.org/docs/15/isn.html)                      | 1.2              | 1.2              |   1.2              |                                                                                                                   |
| [lo](https://www.postgresql.org/docs/15/lo.html)                       | 1.1               | 1.1               |  1.1               |                                                                                                                     |
| [ltree](https://www.postgresql.org/docs/15/ltree.html)                    | 1.2            | 1.2           |   1.2           |                                                                                                                  |
| [moddattime (spi)](https://www.postgresql.org/docs/current/contrib-spi.html)         | 1.0 | 1.0  |   1.0  |                                                                                                                  |
| [neon_utils](/docs/extensions/neon-utils)               | 1.0                              | 1.0                               |     1.0              |                                                                                                                   |
| [pg_graphql](https://github.com/supabase/pg_graphql)               | 1.4.0                 | 1.4.0                  |  1.4.0                  |                                                                                                                   |
| [pg_hashids](https://github.com/iCyberon/pg_hashids)                | 1.2.1                | 1.2.1                  |  1.2.1                  |                                                                                                                  |
| [pg_hint_plan](https://github.com/ossc-db/pg_hint_plan)             | 1.4.1                  | 1.5.0                  |  1.6.0                  |                                                                                                                   |
| [pg_jsonschema](https://github.com/supabase/pg_jsonschema)            | 0.2.0              | 0.2.0               | 0.2.0               |                                                                                                                  |
| [pg_prewarm](https://www.postgresql.org/docs/15/pgprewarm.html)              | 1.2        | 1.2         |   1.2         |                                                                                                                  |
| [pg_roaringbitmap](https://github.com/ChenHuajun/pg_roaringbitmap)          | 0.5          | 0.5         |  0.5         |                                                                                                                  | Install with `CREATE EXTENSION roaringbitmap;`
| [pg_stat_statements](https://www.postgresql.org/docs/15/pgstatstatements.html)       | 1.10 | 1.10 | 1.10 |
| [pg_tiktoken](https://github.com/kelvich/pg_tiktoken)              | 0.0.1                 | 0.0.1                  |  0.0.1                  |                                                                                                                  |
| [pg_trgm](https://www.postgresql.org/docs/15/pgtrgm.html)                 | 1.6           | 1.6            |     1.6            |                                                                                                                 |
| [pg_uuidv7](https://github.com/fboulnois/pg_uuidv7)                | 1.0                   | 1.0                  |    1.0                  |                                                                                                                  |
| [pgcrypto](https://www.postgresql.org/docs/15/pgcrypto.html)                 | 1.3         | 1.3          |    1.3          |                                                                                                                   |
| [pgjwt](https://github.com/michelp/pgjwt)                    | 0.2.0                       | 0.2.0                       |   0.2.0                       |                                                                                                                   |
| [pgrouting](https://docs.pgrouting.org/3.4/en/index.html)                 | 3.4.2          | 3.4.2            | 3.4.2            | The PostGIS extension must be installed first.
| [pgrowlocks](https://www.postgresql.org/docs/15/pgrowlocks.html)               | 1.2       | 1.2        |   1.2        |                                                                                                                 |
| [pgstattuple](https://www.postgresql.org/docs/15/pgstattuple.html)              | 1.5      | 1.5       |  1.5       |                                                                                                                  |
| [pgtap](https://pgtap.org/documentation.html)                    | 1.2.0                   | 1.2.0       |   1.2.0       |                                                                                                                    |
| [pgvector](https://github.com/pgvector/pgvector)                 | 0.5.0                   | 0.5.0  | 0.5.0                  | Install with `CREATE EXTENSION vector;`                                                                                                                    |
| [pgx_ulid](https://github.com/pksunkara/pgx_ulid)                 | 0.1.3                   | 0.1.3  | 0.1.3                                 | Install with `CREATE EXTENSION ulid;`                                                                                                                    |
| [plcoffee](https://github.com/plv8/plv8/)                 | 3.1.5                          | 3.1.5  | 3.1.8                         |                                                                                                                    |
| [plls](https://github.com/plv8/plv8/)                     | 3.1.5                          | 3.1.5 | 3.1.8                          |                                                                                                                    |  
| [plpgsql](https://www.postgresql.org/docs/15/plpgsql.html)                  | 1.0          | 1.0   | 1.0        | Pre-installed with Postgres.                                                                                     |
| [plpgsql_check](https://pgxn.org/dist/plpgsql_check/)            | 2.5.3                   | 2.5.3  | 2.5.3                      |                                                                                      |
| [plv8](https://plv8.github.io/)                  | 3.1.5                                | 3.1.5  | 3.1.8                                |                                                                                                                    |
| [postgis](https://postgis.net/)                  | 3.3.3                                   | 3.3.3     | 3.3.3                                |                                                                                                                    |
| [postgis_raster](https://postgis.net/docs/RT_reference.html)           | 3.3.3             | 3.3.3  | 3.3.3              |                                                                                                                    |
| [postgis_sfcgal](https://oslandia.gitlab.io/SFCGAL/)           | 3.3.3                    | 3.3.3  | 3.3.3                    |                                                                                                                    |
| [postgis_tiger_geocoder](https://postgis.net/docs/Extras.html#Tiger_Geocoder)   | 3.3.3    | 3.3.3 | 3.3.3    | Cannot be installed using the Neon SQL Editor. Use your `psql` user credentials to install this extension.         |
| [postgis_topology](https://www.postgis.net/docs/Topology.html)          | 3.3.3            | 3.3.3   | 3.3.3            |                                                                                                                    |
| [prefix](https://github.com/dimitri/prefix)                   | 1.2.0                     | 1.2.0   | 1.2.0                      |                                                                                                                    |
| [rdkit](https://github.com/rdkit/rdkit)                    | 4.3.0                           | 4.3.0  | 4.3.0  |                                                                                                                   |
| [refint (spi)](https://www.postgresql.org/docs/current/contrib-spi.html)             | 1.0 | 1.0  |  1.0  |                                                                                                                  |
| [roaringbitmap](https://github.com/ChenHuajun/pg_roaringbitmap)             | 0.5 | 0.5  |  0.5  |
| [rum](https://github.com/postgrespro/rum)                      | 1.3          | 1.3           |   1.3           |                                                                                                                  |
| [seg](https://www.postgresql.org/docs/15/seg.html)                      | 1.4              | 1.4               |   1.4               |                                                                                                                   |
| [tablefunc](https://www.postgresql.org/docs/15/tablefunc.html)                | 1.0        | 1.0         |     1.0         |                                                                                                                 |
| [tcn](https://www.postgresql.org/docs/15/tcn.html)                      | 1.0              | 1.0               |  1.0               |                                                                                                                  |
| [timescaledb](https://docs.timescale.com/about/latest/timescaledb-editions/)              | 2.10.1              | 2.10.1               | -               | Only Apache-2 licensed features are supported. Compression is not supported.                                                                                                                 |
| [tsm_system_rows](https://www.postgresql.org/docs/15/tsm-system-rows.html)          | 1.0  | 1.0   |  1.0   |                                                                                                                   |
| [tsm_system_time](https://www.postgresql.org/docs/15/tsm-system-time.html)          | 1.0  | 1.0   |   1.0   |                                                                                                                  |
| [unaccent](https://www.postgresql.org/docs/15/unaccent.html)                 | 1.1         | 1.1          |  1.1          |                                                                                                                    |
| [unit](https://github.com/df7cb/postgresql-unit)                     | 7                 | 7                  |   7                  |                                                                                                                   |
| [uuid-ossp](https://www.postgresql.org/docs/15/uuid-ossp.html)                | 1.1        | 1.1         | 1.1         | Double-quote the extension name when installing: `CREATE EXTENSION "uuid-ossp"`                                    |
| [xml2](https://www.postgresql.org/docs/current/xml2.html)                      | 1.1       | 1.1         |  1.1         |                                                                                                                 |

## Install an extension

Unless otherwise noted, supported extensions can be installed using [CREATE EXTENSION](https://www.postgresql.org/docs/15/sql-createextension.html) syntax.

```sql
CREATE EXTENSION <extension_name>
```

You can install extensions from the Neon SQL Editor or from a client such as `psql` that permits running SQL queries. For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Update an extension version

Neon updates supported extensions as new versions become available. Version updates are communicated in the [Release notes](/docs/release-notes). To check the current version of extensions you have installed, query the `pg_extension` table:

```bash
SELECT * FROM pg_extension;
```

You can update an extension to the latest version using `ALTER EXTENSION <extension_name> UPDATE TO <new_version>` syntax. For example:

  ```sql
  ALTER EXTENSION postgis_topology UPDATE TO '3.3.2';
  ```

## Extension support notes

- Neon supports the `uuid-ossp` extension for generating UUIDs instead of the `uuid` extension.
- The `sslinfo` extension is not supported. Neon handles connections via a proxy that checks SSL.
- The `pg_cron` extension is not supported. Neon scales to zero when it is not being used, which means that a scheduler that runs inside the database cannot be implemented. Consider using an scheduler that runs externally instead.
- The `file_fdw` extension is not supported. Files would not remain accessible when Neon scales to zero.

## Request extension support

To request support for a Postgres extension, please post your request to the [Neon community forum](https://community.neon.tech/). [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).

### Custom-built extensions

Neon supports custom-built Postgres extensions for exclusive use with your Neon account. If you developed your own Postgres extension and want to use it with Neon, please post your request to the [Neon community forum](https://community.neon.tech/). [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support). Please include the following information in your request:

- A repository link or archive file containing the source code for your extension
- A description of what the extension does, instructions for compiling it, and any prerequisites
- Whether an NDA or licensing agreement is necessary for Neon to provide support for your extension

Please keep in mind that certain restrictions may apply with respect to Postgres privileges and local file system access. Neon features such as Autoscaling and Auto-suspend may limit the types of extensions we can support.

Depending on the nature of your extension, Neon may also request a liability waiver.

<NeedHelp/>
