### Support for Postgres 16

Neon is pleased to announce support for Postgres 16. To use Postgres 16 with Neon, create a new Neon project and select **16** as the **Postgres version**.

![Postgres 16 Create project](/docs/relnotes/postgres_16.png)

Neon Pro plan users can migrate data to a Neon project created with Postgres 16 by following this procedure: [Import data from another Neon project](/docs/import/import-from-neon). The process involves migrating data from one Neon project to another through a dump and restore operation.

For Neon Free Tier users who are limited to a single Neon project, migrating data to Postgres 16 involves dumping data locally, removing the existing Neon project, creating a new Neon project with Postgres 16, and restoring data to the new Neon project. For instructions, see [Import data from Postgres](/docs/import/import-from-postgres).

As with any database migration, always test thoroughly before migrating production systems or applications. Also, before migrating, we recommend familiarizing yourself with the changes in Postgres 16, especially those affecting compatibility. For information about those changes, please refer to the official [Postgres Release 16 documentation](https://www.postgresql.org/docs/16/release-16.html).
