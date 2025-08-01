---
title: Migrating from Tembo.io to Neon Postgres
subtitle: 'Learn how to migrate your data and applications from Tembo.io to Neon Postgres'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-08T00:00:00.000Z'
updatedOn: '2025-05-08T00:00:00.000Z'
---

[Tembo.io](https://legacy.tembo.io/cloud) recently announced that it's sunsetting its managed Postgres service. If you've decided to migrate your serviced from Tembio.io to Neon, follow the steps in this guide.

<Admonition type="warning" title="Tembo Shutdown Timeline">
Please be aware of Tembo's [official shutdown timeline](https://tembo-io.notion.site/Tembo-Cloud-Migration-Guide-1de7c9367d6a80349570e7469ba7f17b)

| Date          | Action                           |
| ------------- | -------------------------------- |
| May 5, 2025   | Instance creation disabled       |
| May 30, 2025  | Free instance migration deadline |
| June 27, 2025 | Paid instance migration deadline |

Plan your migration accordingly to avoid any disruption to your services.
</Admonition>

## Tembo—Neon feature comparison

While both Tembo and Neon provide managed Postgres, Neon's architecture offers some advantages. Here’s a quick comparison of key features:

| Feature                   | Tembo                                | Neon Postgres                                                                    |
| ------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| **Compute**               | Manual scaling                       | Autoscaling, scale-to-zero                                                       |
| **Branching**             | NA                                   | Instant data branching for dev, test, and CI/CD workflows ("branch per feature") |
| **Storage**               | Manual scaling of storage            | Auto-scaling storage                                                             |
| **Point-in-Time Restore** | Standard backup/restore capabilities | Instant PITR to any point within your history retention window                   |

## Migration options overview

There are several ways to migrate your Tembo Postgres database to Neon. The best option depends on your database size, acceptable downtime, and technical comfort.

1.  Neon Import Data Assistant (easiest, for smaller databases \<10GB)
2.  `pg_dump` and `pg_restore`
3.  Logical replication (Near-zero downtime, for live production databases)

## Pre-migration preparation (common steps)

Before you begin any migration method, complete these essential preparation steps:

1.  **Assess your Tembo database:**
    - **Database size:** Determine the total size of your database. This will help you choose the right migration method.
    - **Postgres extensions:** Identify all custom Postgres extensions used in your Tembo instance. Run the following query on your Tembo database:
      ```sql
      SELECT e.extname AS "Name", e.extversion AS "Version", n.nspname AS "Schema", c.description AS "Description"
      FROM pg_catalog.pg_extension e
      LEFT JOIN pg_catalog.pg_namespace n ON n.oid = e.extnamespace
      LEFT JOIN pg_catalog.pg_description c ON c.objoid = e.oid AND c.classoid = 'pg_catalog.pg_extension'::pg_catalog.regclass
      ORDER BY "Name";
      ```
      This provides a list of your installed extensions, their versions, and descriptions. Compare this list to Neon's supported extensions. Neon supports many common extensions, and the full list is available here: [Neon supported extensions list](/docs/extensions/pg-extensions). For any unsupported extensions, consider finding alternatives or modifying your application.

2.  **Set up your Neon project:** If you don't have one, [create a Neon account and project](/docs/get-started/signing-up#sign-up).

## Option 1: Using Neon's Import Data Assistant

Neon's Import Data Assistant automates moving your existing database to Neon. It creates a new branch in your Neon project for your imported data.

Before you start with the assistant, You'll need:

- **Tembo connection string:** You'll need a direct connection string to your Tembo database in the format:
  `postgresql://username:password@host:port/database?sslmode=require&channel_binding=require`
- **Admin privileges:** Ensure the user in the connection string has `SUPERUSER` or sufficient privileges (`CREATE`, `SELECT`, `INSERT`, `REPLICATION`) on the source Tembo database.
- **Database size:** Your Tembo database must be **smaller than 10GB**.
- **Region:** The feature is currently supported only for Neon projects in AWS regions.

### Steps to import using the assistant:

1.  **Launch the assistant:**
    - **From the Projects page:** Click "Import database" to create a new project and import data.
      ![Import Data Assistant from Projects page](/docs/import/import_data_assistant_project.png)
    - **From within an existing project:** Use the Getting Started widget on a project dashboard.
      ![Import Data Assistant from Quick Start widget](/docs/import/import_data_assistant_quickstart_widget.png)
2.  **Check compatibility:** Enter your Tembo database connection string. Neon will verify:
    - Database size (within 10GB limit).
    - Postgres version compatibility (Neon supports Postgres 14-17).
    - Extension compatibility.
    - Region availability.
3.  **Import your data:** Once checks pass, Neon will:
    - Create a new branch for your imported data.
    - Copy your data automatically using `pg_dump` and `pg_restore`.
    - Verify the import.

    <Admonition type="note">
    During import, your source Tembo database remains untouched; Neon only reads from it.
    </Admonition>

4.  **Access your imported data:**
    - Navigate to the **Branches** page of your Neon project. Your newly imported database branch will be listed there, typically named with a timestamp (e.g., `import-2025-xx-xx`).
      ![Branches page showing imported branch](/docs/import/import_data_assistant_branch.png)
    - Click on the three dots next to the branch name and select **Set as default** to make it your default branch.
    - **Optional cleanup:**
      - Delete the old branches (`production` and `development`) if they are no longer needed.
      - Rename the new branch to `production` for clarity and consistency.

## Option 2: `pg_dump` and `pg_restore`

This is the traditional method for Postgres migrations and offers full control. It involves taking a full dump of your Tembo database and restoring it to Neon.

### Prerequisites:

- `psql`, `pg_dump`, and `pg_restore` client utilities installed locally. Use versions compatible with your Tembo Postgres version and Neon (Postgres 14-17). It's generally recommended to use the latest client versions.
- Connection string or parameters for your source Tembo database.
- Connection string for your target Neon database: You can find the connection string by clicking the **Connect** button on your Project Dashboard. It will look something like this:
  ```bash
  postgresql://[user]:[password]@[neon_hostname]/[dbname]
  ```

### Export data from Tembo using `pg_dump`

Use the following command to create a dump of your Tembo database. Use a direct, unpooled connection.

```bash
pg_dump -Fc -v -d "postgresql://user:pass@tembo_host:port/source_db" -f your_tembo_dump.dump
```

> Replace the connection string with your actual Tembo database connection string.

The command options used are:

- `-Fc`: Custom format (compressed, suitable for `pg_restore`).
- `-v`: Verbose mode.
- `-d`: Source database connection string or name.
- `-f`: Output file name.

### Restore data to Neon using `pg_restore`

- The role performing the `pg_restore` operation in Neon becomes the owner of restored objects by default.
- Roles created in the Neon Console are members of `neon_superuser`. This role can create objects but is not a full PostgreSQL `SUPERUSER` and cannot run `ALTER OWNER` for objects it doesn't own.
- If your Tembo database uses multiple roles for object ownership, your dump file will contain `ALTER OWNER` commands. These may cause non-fatal errors during restore to Neon.
- To avoid ownership errors, you can use the `--no-owner` option with `pg_restore`. All objects will then be owned by the Neon role executing the restore.

Run the following command to restore the dump to your Neon database:

```bash
pg_restore -v --no-owner -d "postgresql://neon_user:neon_pass@neon_host:port/target_db" your_tembo_dump.dump
```

> Replace the connection string with your actual Neon database connection string.

The command options used are:

- `-v`: Verbose mode.
- `--no-owner`: Ignores original ownership, objects owned by `neon_user`.
- `-d`: Target Neon database connection string.

For more detailed usage, refer to [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Option 3: Logical replication

Logical replication allows for near-zero downtime migration by continuously streaming data changes from your Tembo database (publisher) to your Neon database (subscriber).

### Prepare Tembo (source publisher)

- **Enable logical replication:** Refer to Tembo's documentation for enabling [logical replication](https://legacy.tembo.io/docs/getting-started/postgres_guides/postgres-wal-configuration/)

- **Create publication:** Define a publication on Tembo for the tables you want to replicate.

  ```sql
  CREATE PUBLICATION neon_migration_pub FOR TABLE table1, table2;
  ```

- Allow Connections from Neon to Tembo (IP Allow List):

  If you are having IP allow list restrictions on your Tembo database, you need to allow connections from Neon to Tembo. This is necessary for the logical replication process to work correctly.
  1.  **Obtain Neon NAT Gateway IP Addresses:**
      Refer to Neon's [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) to find the list of IP addresses for your Neon project's region. You will need to add these specific IP addresses to your Tembo project's allow list.

  2.  **Configure IP Allow List in Tembo.io:**
      - Log in to your Tembo.io dashboard.
      - Navigate to **Settings > Network Settings**.
      - Locate the **IP Allow List** section.
      - For each Neon NAT Gateway IP address obtained in the previous step, click **Add New**.
      - Enter each Neon IP address in the provided field.
        ![Tembo IP Allow List](/docs/guides/tembo-ip-allowlist.webp)
      - After adding all necessary Neon IP addresses, click **Save Changes** to apply the new network restrictions.

### Prepare Neon (target subscriber)

**Create schema:** Copy the schema from Tembo to Neon. You can use `pg_dump` to export the schema and `psql` to import it into Neon.

- Dumping schema from Tembo:
  ```bash
  pg_dump --schema-only \
      --no-privileges \
      "postgresql://user:pass@tembo_host:port/source_db" \
      > schema.sql
  ```
- Restoring schema to Neon:

  ```bash
  psql \
      "postgresql://neon_user:neon_pass@neon_host:port/target_db" \
      < schema.sql
  ```

  > Replace the connection strings with your actual Tembo and Neon database connection strings.

### Create subscription on Neon

Connect to your Neon database and create a subscription.

    ```sql
    CREATE SUBSCRIPTION tembo_to_neon_sub
    CONNECTION 'postgresql://app:PASSWORD@hostname.data-1.use1.tembo.io/app'
    PUBLICATION neon_migration_pub;
    ```

    > Replace connection string with your Tembo database connection string.

- Initial data synchronization will begin. This can take time for large databases.
- Data changes on Tembo will be replicated to Neon.

### Monitor replication

To confirm your Neon database is synchronized with Tembo, monitor the Write-Ahead Log (WAL).

**On Tembo (Publisher):**
You can check the current WAL log sequence number (LSN) using:

```sql
SELECT pg_current_wal_lsn();
```

**On Neon (Subscriber):**
The subscriber is up-to-date when its `received_lsn` (last log sequence number received) and `latest_end_lsn` (last log sequence number applied) are identical. Check this using:

```sql
SELECT subname, received_lsn, latest_end_lsn
FROM pg_catalog.pg_stat_subscription
WHERE subname = 'tembo_to_neon_sub';
```

If `received_lsn` and `latest_end_lsn` are the same for your subscription, Neon has processed all the data it has received from Tembo. For complete synchronization, this `latest_end_lsn` on Neon should also align with the current LSN on the Tembo publisher.

### Perform the cutover (switch applications)

Once Neon is fully synchronized and replication lag is minimal:

- Briefly stop application writes to the Tembo database (maintenance mode).
- Wait for any final changes to replicate to Neon.
- Update your application's connection string to point to the Neon database.
- Resume application traffic, now directed at Neon.
- Thoroughly test your application.

## Post-migration (common steps)

1.  **Verify data:**
    - Run checksums or row counts on key tables in both Tembo and Neon to ensure data integrity.
    - Perform functional testing of your application against Neon.

2.  **Update application connection strings:** Ensure all parts of your application and any related services are now using the Neon database connection string.

3.  **Cleanup for logical replication:**
    If you used logical replication, you can drop the subscription from Neon once you're satisfied with the migration.
    ```sql
    DROP SUBSCRIPTION tembo_to_neon_sub;
    ```

## Resources

- [Tembo Cloud Migration Guide](https://tembo-io.notion.site/Tembo-Cloud-Migration-Guide-1de7c9367d6a80349570e7469ba7f17b)
- Neon Docs:
  - [Import Data Assistant](/docs/import/import-data-assistant)
  - [Migrate data from Postgres with `pg_dump` and `pg_restore`](/docs/import/migrate-from-postgres)
  - [Replicate data from Postgres to Neon (Logical replication)](/docs/guides/logical-replication-postgres-to-neon)
  - [Connect to Neon](/docs/connect/connect-from-any-app)
  - [Supported Postgres extensions in Neon](/docs/extensions/pg-extensions)
- PostgreSQL Documentation:
  - [`pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html)
  - [`pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html)
  - [Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)

<NeedHelp />
