---
title: Neon Migration Assistant
subtitle: Move your existing database to Neon using our guided tool
enableTableOfContents: true
updatedOn: '2024-11-22T19:06:16.922Z'
---

When you're ready to move your data to Neon, our Migration Assistant can help. You need only the connection string to your existing database to get started.

<FeatureBeta/>

## How it works

Enter your current database connection string, and the Assistant will:

1. Run some preliminary checks on your database. If necessary, you'll be prompted to make changes to your source database before proceeding. Note that these are information checks only; the Assistant does not make any changes to your source database.
1. Based on these initial checks, the Assistant tries to create a Neon project that best matches your environment, such as region and Postgres version.
1. The Migration Assistant provides `pg_dump` and `pg_restore` commands to transfer your data, pre-populated with the correct connection strings.

Future versions will add more automation to these steps, and also add support for **logical replication** to help minimize downtime during larger transfers.

## Before you start

You'll need the following to get started:

- A **Neon account**. Sign up at [Neon](https://neon.tech) if you don't have one.
- A **connection string** to your current database. Postgres connection strings use the format:

  `postgresql://username:password@host:port/database?sslmode=require&application_name=myapp`

- **Admin privileges** or appropriate Postgres privileges on your source databases to perform the migration tasks. Using a superuser or a user with the necessary `CREATE`, `SELECT`, `INSERT`, and `REPLICATION` privileges is recommended.

## Step 1 — Check compatibility

Enter the connection string from your source database.

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/import/migration_string.png" alt="paste connection string for source db" style={{ width: '80%', maxWidth: '600px', height: 'auto' }} />
</div>

Neon will check the availability and configuration of your source database to help make sure your migration will be successful:

- **Postgres version** — Verifies that your source database uses a version of Postgres that Neon supports (Postgres 14 to 17).
- **Region** — Checks the hosting region of your source database.
- **Supported Postgres extensions** — Identifies whether your extensions are supported by Neon. Unsupported extensions are listed, but you are not blocked from continuing the migration. Use your discretion.
- **Compatible Postgres extension versions** — Checks that your extension versions match Neon's current support. See [Supported Postgres extensions](/docs/extensions/pg-extensions) for a matrix of extensions to Postgres versions in Neon.

## Step 2 — Create a Neon project

<div style={{ display: 'flex', alignItems: 'top' }}>
  <div style={{ flex: '0 0 55%', paddingRight: '20px' }}>
    By default, we try to create your new project to match your source database:

    - Matching Postgres **version**
    - Matching **region**

      <Admonition type="note">
      This is an early feature and may not work for all regions or providers.
      </Admonition>

    You can modify any of these settings to suit the needs of your database, such as the host region, autoscaling range, and so on.

    See [Create a project](/docs/manage/projects#create-a-project) for more details about these options.

  </div>
  <div style={{ flex: '0 0 45%', margin: '-15px 0' }}>
    ![create Neon project](/docs/import/migration_create_project.png)
  </div>
</div>

## Step 3 — Move data to Neon

Next, we'll send you to the command line. We generate the `pg_dump` and `pg_store` commands, pre-populated with the correct connection strings and required parameters.

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/import/migration_move_data.png" alt="move data to Neon using pg_dump and pg_restore" style={{ width: '80%', maxWidth: '600px', height: 'auto' }} />
</div>

The `pg_dump` command is populated with your source database:

```bash shouldWrap
pg_dump -Fc -v -d "postgresql://<username>:<password>@<source_host>:<source_port>/<source_database>" -f database.bak
```

The `pg_restore` command uses the connection string for the database in your newly created project in Neon:

```bash shouldWrap
pg_restore -v -d "postgresql://<username>:<password>@<destination_host>:<destination_port>/<destination_database>" database.bak
```

For more detailed instructions about using these commands, see [Migrate data using pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Next Steps

1. **Verify data integrity** by running some queries and checking that tables and data are present as expected in Neon.
2. **Switch over your application** by updating your connection string to point to Neon. You can find your connection details on your project Dashboard. See [Connect from any application](/docs/connect/connect-from-any-app) for more information.

## It didn't work. What can I do?

If your database migration failed because of an incompatibility, a connection issue, or another problem, contact us for [migration assistance](https://neon.tech/migration-assistance). We're here to help you get up and running.
