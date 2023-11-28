---
description: Neon metrics collection and new usage guidelines for the neon_superuser role
---

### Fixes & improvements

- Compute: Neon now creates a `neon` extension in the `neon` schema in the `postgres` database. This extension contains functions and views for collecting Neon-specific metrics for the purpose of improving our service. The views are fully accessible. You can access them by connecting to the `postgres` database via `psql` and running a `\dv neon.*` command, as shown below. Currently, the extension includes two views for collecting local file cache metrics. Additional views may be added in future releases.

    ```bash
    psql 'postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/postgres?sslmode=require'

    postgres=> \dv neon.*
                List of relations
    Schema |      Name      | Type |    Owner    
    --------+----------------+------+-------------
    neon   | local_cache    | view | cloud_admin
    neon   | neon_lfc_stats | view | cloud_admin
    (2 rows)
    ```

- Compute: Creating a database with the `neon_superuser` role using `CREATE DATABASE dbname WITH OWNER neon_superuser` syntax is no longer permitted. The `neon_superuser` role is a `NOLOGIN` role used by Neon to grant prvileges to PostgreSQL roles created via the Neon Console, CLI, or API, and should not be used directly or modified. For more information about this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

