---
title: Import Data Assistant
subtitle: Import a database under 10 GB to Neon using our automated import tool
summary: >-
  How to use the Import Data Assistant to import an existing Postgres database
  under 10 GB to Neon using a connection string, or to migrate data between
  Neon projects.
enableTableOfContents: true
tag: beta
updatedOn: '2026-04-01T18:00:00.000Z'
redirectFrom:
  - /docs/import/migration-assistant
---

The **Import Data Assistant** can help you automatically import your existing database. The assistant supports databases **smaller than 10 GB**; you only need a connection string to get started.

<FeatureBetaProps feature_name="Import Data Assistant"/>

<Admonition type="tip" title="Migrate between Neon projects">
In additiion to migrating from other Postgres platforms, you can use the **Import Data Assistant** to migrate data between Neon projects. Use it to upgrade to a newer Postgres version (for example, from Postgres 16 to 17) or move your database to a different region. The assistant steps you through creating a new Neon project.
</Admonition>

## Before you start

You'll need:

- A **Neon account**. Sign up at [Neon](https://neon.tech) if you don't have one.
- A **connection string** to your current database in this format:

  ```
  postgresql://username:password@host:port/database?sslmode=require&channel_binding=require
  ```

  If you are migrating a database from one Neon project to another, you need the connection string for the source database, which you can access from the **Connect** modal on the project dashboard.

- **Admin privileges** on your source database. We recommend using a superuser if migrating from another platform, or a user with the necessary `CREATE`, `SELECT`, `INSERT`, and `REPLICATION` privileges.
- A database **smaller than 10 GB** in size for automated import. For larger databases, use [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).
- Unless you are intentionally migrating to a different region, we recommend migrating to a Neon project created in the same region as your current database for a faster import. There is a 1-hour time limit on import operations.
- For other constraints that apply to this flow, see [Known limitations](#known-limitations).

<Steps>

## Launch the assistant

Launch the assistant from the **Projects** page:

![Import Data Assistant from Projects page](/docs/import/import_data_assistant_project.png)

## Check compatibility

Enter your database connection string and click **Run Checks**.

![Import Data Assistant run checks](/docs/import/import_data_assistant_run_checks.png)

We'll verify the following:

- Database size is within the 10 GB limit
- Postgres version compatibility (Postgres 14 to 17)
- Extension compatibility
- Region availability

## Create a new Neon project

Click the **Create new Neon project** button, specify your project settings including the **Postgres version** and **region**, and click **Create**.

![Import Data Assistant create project](/docs/import/import_data_assistant_create_project.png)

## Start import process

Back in the assistant, click the **Start import process** button.

<Admonition type="note">
During import, your source database remains untouched. We only read from it to create a copy in Neon.
</Admonition>

</Steps>

### Known limitations

- Supabase and Heroku databases are not supported due to unsupported Postgres extensions.
- Databases running on **IPv6 are not supported**.
- AWS RDS is generally supported, though some incompatibilities may exist. Support for other providers may vary.

## Next steps

After a successful import:

1. Run some test queries to ensure everything imported correctly.
2. If you've migrated from another Neon project, remove your old project if it's no longer needed.
3. Switch the connection string in your app to point to your new Neon database.

<NeedHelp/>
