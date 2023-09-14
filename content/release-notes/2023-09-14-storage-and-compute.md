### Postgres 16!

Neon is pleased to announce support for Postgres 16. To use Postgres 16 with Neon, create a Neon project and select **16** as the **Postgres version**.

![Postgres 16 Create project](/docs/relnotes/postgres_16.png)

If you are a Neon Pro plan user, you can migrate a database from an existing Neon project created with an earlier Postgres version to Postgres 16 following this procedure: [Import data from another Neon project](/docs/import/import-from-neon). The process involves creating a new Neon project with Postgres 16 and performing a direct dump and restore between projects.

For Neon Free Tier users who are limited to a single Neon project, migrating to Postgres 16 involves dumping your database locally, removing your existing Neon project, creating a new Neon project with Postgres 16, and restoring your database to the new Neon project. For dump and restore instructions, see [Import data from Postgres](/docs/import/import-from-postgres).

For information about changes in Postgres 16, refer to the official [Postgres Release 16 documentation](https://www.postgresql.org/docs/16/release-16.html).
