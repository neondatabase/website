---
title: Migrate data to Neon Postgres using pgcopydb
subtitle: Streamline your Postgres data migration to Neon using pgcopydb
enableTableOfContents: true
isDraft: false
updatedOn: '2025-03-27T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="Repo" theme="repo">
  <a href="https://github.com/dimitri/pgcopydb">pgcopydb GitHub repository</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="https://pgcopydb.readthedocs.io/">pgcopydb documentation</a>
</DocsList>

</InfoBlock>

`pgcopydb` is an open-source tool for copying Postgres databases from one server to another. It's a practical option for migrating larger Postgres databases into Neon.

## Why use pgcopydb for data migration?

`pgcopydb` builds on standard `pg_dump` and `pg_restore` but with extra features to make migrations both faster and more reliable:

- **Parallel migration**: `pgcopydb` processes multiple migration phases concurrently:

  - **Data transfer:** Streams data in parallel from multiple tables and splits large tables into chunks
  - **Index creation:** Builds indexes concurrently after data loading
  - **Constraint application:** Applies constraints in parallel while maintaining data integrity
    This parallel processing reduces migration time and minimizes downtime.

- **Dependency handling**: `pgcopydb` manages database object dependencies and migrates them in the correct order:

  - **Schema-first approach:** Creates schema objects (tables, functions, procedures) before data transfer begins
  - **Table copying precedes indexes and constraints:** Copies table data first, then creates indexes and applies constraints

  This ordered approach maintains data integrity and avoids errors during migration.

- **Large table splitting**: For tables that could become bottlenecks, `pgcopydb` splits them into smaller chunks for parallel import. This distributes the load and reduces migration time for large datasets.

- **Resumable operations**: The `--resume` option lets you restart migrations from interruption points, handling network issues or failures without restarting from the beginning. Requires that your source database supports snapshots, which may not be available on some hosted database services.

- **Built-in monitoring**: `pgcopydb` includes a sentinel table and associated commands (`pgcopydb stream sentinel`) for monitoring. This allows you to track migration progress and overall health.

This guide walks you through using `pgcopydb` to migrate data to Neon.

<Admonition type="note">
Logical replication with `pgcopydb clone --follow` is not supported on Neon. You can still use `pgcopydb` for a one-time data migration to Neon.
</Admonition>

## Prerequisites

Before you begin, ensure you have the following:

- **Source postgres database**: You need access to the Postgres database you intend to migrate. This can be a local instance, a cloud-hosted database (AWS RDS, GCP Cloud SQL, Azure Database for Postgres, or any other Postgres provider), or even a different Neon project.
- **Neon project**: You must have an active Neon project and a database ready to receive the migrated data. If you don't have a Neon project yet, see [Create a Neon project](/docs/manage/projects#create-a-project) to get started. Note that storage beyond your plan's included amount will incur additional charges.
- **pgcopydb installation**: `pgcopydb` must be installed on a machine that has network connectivity to both your source Postgres database and your Neon database. This machine should also have sufficient resources (CPU, memory, disk space) to handle the migration workload. Install `pgcopydb` by following the instructions in the [pgcopydb documentation](https://pgcopydb.readthedocs.io/en/latest/install.html).
- **Network connectivity**: Ensure that the machine running `pgcopydb` can connect to both your source Postgres server and your Neon Postgres endpoint. Check firewall rules and network configurations to allow traffic on the Postgres port.

<Steps>

## Setup environment variables

Before proceeding, set the following environment variables for your source and target Postgres databases where you will run `pgcopydb` commands:

```bash
export PGCOPYDB_SOURCE_PGURI="postgresql://source_user:source_password@source_host:source_port/source_db"
export PGCOPYDB_TARGET_PGURI="postgresql://neon_user:neon_user_password@xxxx.neon.tech/neondb?sslmode=require"
```

You can replace the placeholders with your actual connection details. You can get Neon database connection details from the Neon console. `pgcopydb` will automatically use these environment variables for the migration.

## Start data migration

Run the `pgcopydb clone` command with the `--no-owner` flag to skip ownership changes:

```bash
pgcopydb clone --no-owner
```

## Monitor the migration progress

Monitor progress in a separate terminal (you'll need to either set the environment variables again or use the `--source` flag):

```bash
pgcopydb list progress --source "your-source-connection-string" --summary
```

After successful completion, you will see a summary of the migration steps and their durations, similar to the following:

```text
                                               Step   Connection    Duration    Transfer   Concurrency
 --------------------------------------------------   ----------  ----------  ----------  ------------
   Catalog Queries (table ordering, filtering, etc)       source       3s775                         1
                                        Dump Schema       source       432ms                         1
                                     Prepare Schema       target         26s                         1
      COPY, INDEX, CONSTRAINTS, VACUUM (wall clock)         both         31s                        12
                                  COPY (cumulative)         both         23s       73 MB             4
                          CREATE INDEX (cumulative)       target       533ms                         4
                           CONSTRAINTS (cumulative)       target       244ms                         4
                                VACUUM (cumulative)       target       3s009                         4
                                    Reset Sequences         both       2s223                         1
                         Large Objects (cumulative)       (null)         0ms                         0
                                    Finalize Schema         both         18s                         4
 --------------------------------------------------   ----------  ----------  ----------  ------------
                          Total Wall Clock Duration         both       1m17s                        20
```

## Switch over your application to Neon

Switch your application to Neon and validate the migration after `pgcopydb clone` completes.

1.  **Stop writes to source database**: Halt write operations to your source database.
2.  **Validate migration**: Use `pgcopydb compare schema` and `pgcopydb compare data` for validation.
3. **Update application connection string**: Point your application to your Neon database.

</Steps>


## Advanced usage

`pgcopydb` offers several advanced options to optimize and customize your migration. Here are some key considerations:

### Boosting migration speed with parallelism

`--table-jobs <integer>` & `--index-jobs <integer>`: These options control the number of concurrent jobs for copying tables and creating indexes, respectively. For large databases, increasing these values is crucial for reducing migration time.

### Handling large tables efficiently

`--split-tables-larger-than <bytes>`: Automatically splits tables exceeding the specified size into smaller chunks for parallel import, dramatically accelerating migration of large datasets. Start with `1GB` or `500MB` and adjust based on your table sizes.

**Example:**

```bash
pgcopydb clone --table-jobs 8 --index-jobs 12 --split-tables-larger-than 500MB
```

This command will run the migration with **8** concurrent table jobs, **12** concurrent index jobs, and split tables larger than **500** MB into smaller chunks for parallel import.

For more detail, see [Same-table Concurrency](https://pgcopydb.readthedocs.io/en/latest/concurrency.html#same-table-concurrency) in the `pgcopydb` docs.

### Filtering and selective migration

`--filters <filename>`: Sometimes you only need to migrate a subset of your database. `--filters` allows you to precisely control which tables, indexes, or schemas are included in the migration. This is useful for selective migrations or excluding unnecessary data. For filter configuration and examples, see the [pgcopydb filtering documentation](https://pgcopydb.readthedocs.io/en/latest/ref/pgcopydb_config.html#filtering).

## Reference

- [pgcopydb documentation](https://pgcopydb.readthedocs.io/)
- [pgcopydb GitHub repository](https://github.com/dimitri/pgcopydb)

<NeedHelp/>
