---
title: Replicate data from Postgres to Neon using pgcopydb
subtitle: Streamline your Postgres data migration to Neon using pgcopydb
enableTableOfContents: true
isDraft: false
updatedOn: '2025-03-27T00:00:00.000Z'
---

`pgcopydb` is an open-source tool designed to facilitate the copying of a Postgres database from one server to another. Its primary use case is for migrations to new Postgres systems, whether due to hardware upgrades, architectural changes, or major version updates.

`pgcopydb` simplifies and accelerates Postgres database migrations, offering significant advantages over traditional methods like `pg_dump` and `pg_restore`, especially for large databases and near-zero downtime migrations.

## Why use pgcopydb for data migration?

`pgcopydb` is specifically designed to automate and optimize Postgres database copying and replication, making it an excellent choice for migrating data to Neon. It builds upon standard Postgres tools and enhances them with features crucial for efficient and reliable migrations. Key benefits include:

- **Automated parallel migration**: `pgcopydb` excels at parallel processing, significantly speeding up several critical migration phases:
    - **Data transfer:**  It streams data in parallel from multiple tables and even splits large tables into chunks, maximizing throughput.
    - **Index creation:** Indexes are built concurrently after data is loaded, reducing the overall migration time.
    - **Constraint application:**  Constraints are applied efficiently in parallel, ensuring data integrity without becoming a bottleneck.
    This parallel approach is crucial for migrating large databases efficiently and minimizing downtime.

- **Intelligent dependency handling**: `pgcopydb` understands the dependencies between database objects and migrates them in the correct order. It ensures:
    - **Schema-first approach:** Schema objects (tables, functions, procedures) are created on Neon before data transfer begins.
    - **Table copying precedes indexes and constraints:** Data in tables is copied first, followed by the creation of indexes and application of constraints. This ordered approach maintains data integrity and avoids errors during migration.

- **Large table splitting for faster import**: For extremely large tables that can become migration bottlenecks, `pgcopydb` can automatically split them into smaller, manageable chunks for parallel import. This drastically reduces migration time for massive datasets and optimizes resource utilization by distributing the load.

- **Resumable operations**: `pgcopydb` provides the `--resume` option, allowing migration restarts from interruption points. This ensures resilience against network issues or unexpected failures, preventing the need to restart the entire migration from scratch.

*   **Built-in monitoring**: `pgcopydb` includes a sentinel table and associated commands (`pgcopydb stream sentinel`) for built-in monitoring. This allows you to:
    - **Track migration progress**: Monitor the status of data transfer, replication lag, and overall migration health.
    - **Manage replication stream**: Control aspects of the replication process, such as pausing or resuming change application, and managing cutover points.

This guide will walk you through using `pgcopydb` to perform an initial data migration to Neon which uses pgcopydb for logical decoding.

<Admonition type="note">
Logical replication with Neon currently doesn't work on Neon. We are working on a solution to enable logical replication on Neon. You can still use `pgcopydb` to migrate your data to Neon via logical decoding to do a one-time migration.
</Admonition>

## Prerequisites

Before you begin, ensure you have the following:

- **Source postgres database**: You need access to the Postgres database you intend to migrate. This can be a local instance, a cloud-hosted database (AWS RDS, GCP Cloud SQL, Azure Database for Postgres, or any other Postgres provider), or even a different Neon project.
- **Neon project**: You must have an active Neon project and a database ready to receive the migrated data. If you don't have a Neon project yet, see [Create a Neon project](/docs/manage/projects#create-a-project) to get started.
- **pgcopydb installation**:  `pgcopydb` must be installed on a machine that has network connectivity to both your source Postgres database and your Neon database. This machine should also have sufficient resources (CPU, memory, disk space) to handle the migration workload. Install `pgcopydb` by following the instructions in the [pgcopydb documentation](https://pgcopydb.readthedocs.io/en/latest/install.html).
- **Network connectivity**: Ensure that the machine running `pgcopydb` can connect to both your source Postgres server and your Neon Postgres endpoint. Check firewall rules and network configurations to allow traffic on the Postgres port.

<Steps>

## Setup environment variables

Before proceeding, set the following environment variables for your source and target Postgres databases where you will run `pgcopydb` commands:

```bash
export PGCOPYDB_SOURCE_PGURI="Postgres://source_user:source_password@source_host:source_port/source_db"
export PGCOPYDB_TARGET_PGURI="Postgres://neon_user:neon_password@neon_host:neon_port/neon_db"
```

You can replace the placeholders with your actual connection details. You can get Neon database connection details from the Neon console.

## Start data migration

Execute the `pgcopydb clone` command:

```bash
pgcopydb clone --no-owner
```

## Monitor the migration progress

Monitor progress in a separate terminal:

```bash
pgcopydb list progress --summary
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

## Reference

- [pgcopydb documentation](https://pgcopydb.readthedocs.io/)
- [pgcopydb GitHub repository](https://github.com/dimitri/pgcopydb)

<NeedHelp/>
