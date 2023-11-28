---
description: Read about the latest fixes and improvements in Neon Serverless Postgres.
---

### Fixes & improvements

- Compute: Creating a database with the `neon_superuser` role using `CREATE DATABASE dbname WITH OWNER neon_superuser` syntax is no longer permitted. The `neon_superuser` role is a `NOLOGIN` role used by Neon to grant prvileges to PostgreSQL roles created via the Neon Console, CLI, or API, and cannot be used directly. For more information about this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

