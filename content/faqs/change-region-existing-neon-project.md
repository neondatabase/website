---
title: 'How do I migrate an existing Neon project to a different AWS region?'
subtitle: 'Create a new project in the target region, copy data over with pg_dump and pg_restore, then cut over.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Can I change the region of my existing Neon project after creation?'
  slug: change-project-region
nextLink:
  title: 'What are the cheapest ways to run a Postgres database for a project that gets very little traffic?'
  slug: cheapest-ways-run-postgres-database-low-traffic
---

You can't move an existing Neon project to a new region in place ([Regions](/docs/introduction/regions)). Create a new project in the target AWS region, copy the schema and data with `pg_dump` and `pg_restore` (or logical replication when you can't afford a long cutover window), update your connection strings, then delete the old project. New projects can only be created in AWS regions; Neon's Azure regions are deprecated.

## Step-by-step migration

### 1. Create the new project in the target region

In the [Neon Console](https://console.neon.tech), click **New Project**, then set the AWS region and Postgres version. Use the same Postgres major version as the source project to avoid version compatibility issues.

From the CLI:

```bash
neon projects create --name myproject-us-east-1 --region-id aws-us-east-1
```

If you omit `--region-id`, the CLI defaults to `aws-us-east-2`. The [Regions](/docs/introduction/regions) page lists every region ID, and the [`neon projects create`](/docs/cli/projects#create) reference covers the other flags.

### 2. Dump the source database

Use unpooled connection strings for both the dump and the restore. Neon recommends against running `pg_dump` or `pg_restore` over a pooled (PgBouncer) connection ([docs](/docs/import/migrate-neon-to-another-region)).

```bash shouldWrap
pg_dump -Fc -v -d "postgresql://[user]:[password]@[old-host]/[dbname]" -f neon_dump.bak
```

For large databases, `-Z 1` gives light compression, and `pg_restore -j <njobs>` restores tables in parallel from a custom-format archive. Parallel dumps (`pg_dump -j`) require the directory format (`-Fd`) instead of `-Fc` ([pg_dump docs](https://www.postgresql.org/docs/current/app-pgdump.html)). See [Advanced pg_dump and pg_restore options](/docs/import/migrate-from-postgres#advanced-pg_dump-and-pg_restore-options).

### 3. Restore into the new project

```bash shouldWrap
pg_restore -v --no-owner -d "postgresql://[user]:[password]@[new-host]/[dbname]" neon_dump.bak
```

The `--no-owner` flag avoids errors from `ALTER OWNER` statements, which `neon_superuser` cannot execute. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

### 4. Switch your applications over

Copy the new connection string from the **Connect** button on the new project's dashboard and update the environment variables where your app is deployed. Confirm the application works on the new database before you delete anything.

### 5. Delete the old project

Once the cutover is done, open the old project, select **Settings**, then **Delete**. The old project bills for storage until you delete it. You can [recover a deleted project](/docs/manage/projects#recover-a-deleted-project) within 7 days.

<Admonition type="important" title="Plan around the migration window">
Writes to the source database during the dump and restore won't appear in the new project. Either stop writes for the cutover, or use [logical replication](/docs/guides/logical-replication-neon-to-neon) to keep the target current until you switch traffic. For databases under 10 GB, the [Import Data Assistant](/docs/import/import-data-assistant) runs the import from the Console. [Migrate to another Neon region](/docs/import/migrate-neon-to-another-region) compares all three methods.
</Admonition>

## Data transfer costs

Data you read out of the source project, whether through `pg_dump` or logical replication, counts as [public network transfer](/docs/introduction/plans#public-network-transfer) on that project. The Free plan includes 5 GB per project per month, which covers a Free plan database (0.5 GB storage cap) several times over. The Launch and Scale plans include 500 GB per project per month, then $0.10/GB.

<CTA title="Compare migration paths" description="The region migration guide compares the Import Data Assistant, dump and restore, and logical replication." buttonText="Region migration guide" buttonUrl="https://neon.com/docs/import/migrate-neon-to-another-region" />
