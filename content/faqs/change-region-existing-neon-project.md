---
title: 'How do I migrate an existing Neon project to a different AWS region?'
subtitle: 'Create a new project in the target region, copy data over with pg_dump and pg_restore, then cut over.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

## Quick answer

You can't move an existing Neon project to a new region in place. Instead, create a new project in the target region, copy the schema and data using `pg_dump` and `pg_restore` (or logical replication for larger datasets), update your connection strings, then delete the old project. The whole process takes minutes for small databases and is the same workflow for AWS-to-AWS as for AWS-to-Azure.

## Step-by-step migration

### 1. Create the new project in the target region

In the [Neon Console](https://console.neon.tech), click **New Project**, then set the cloud provider, region, and Postgres version. Use the same Postgres major version as the source project to avoid version compatibility issues.

From the CLI:

```bash
neon projects create --name myproject-us-east-1 --region-id aws-us-east-1
```

For the full list of supported region IDs (AWS and Azure), see [Regions](/docs/introduction/regions). Pass the ID with `--region-id`, for example `aws-us-east-1`. Full command reference: [`neon projects create`](/docs/reference/cli-projects#create).

### 2. Dump the source database

Use an unpooled connection string for `pg_dump`. Pooled connections through PgBouncer don't support dump operations.

```bash shouldWrap
pg_dump -Fc -v -d "postgresql://[user]:[password]@[old-host]/[dbname]" -f neon_dump.bak
```

For large databases, add `-j 4` to parallelize, and `-Z 1` for light compression. See [Advanced pg_dump options](/docs/import/migrate-from-postgres#advanced-pg_dump-and-pg_restore-options).

### 3. Restore into the new project

```bash shouldWrap
pg_restore -v --no-owner -d "postgresql://[user]:[password]@[new-host]/[dbname]" neon_dump.bak
```

The `--no-owner` flag avoids errors from `ALTER OWNER` statements, which `neon_superuser` cannot execute. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

### 4. Switch your applications over

Copy the new connection string from the **Connect** button on the new project's dashboard and update environment variables in your deployment platform. Verify the application is healthy on the new database before going to the next step.

### 5. Delete the old project

Once you've confirmed the cutover, delete the old project from **Project Settings → Delete** to stop accruing storage costs.

<Admonition type="important" title="Plan around the migration window">
Writes to the source database during the dump and restore won't appear in the new project. Either accept a brief read-only window for the cutover, or use logical replication to keep the target current until you switch traffic. See the [Import Data Assistant](/docs/import/import-data-assistant) for databases under 10 GB and [Migrate to another Neon region](/docs/import/migrate-neon-to-another-region) for larger datasets.
</Admonition>

## What about data transfer costs?

Egress between Neon regions counts as public network transfer. Check the [Pricing page](/pricing) for the current per-GB rate. The Free plan includes 5 GB per project per month, which is usually enough for a one-off migration.

<CTA title="Compare migration paths" description="The region migration guide compares the Import Data Assistant, dump and restore, and logical replication." buttonText="Region migration guide" buttonUrl="https://neon.com/docs/import/migrate-neon-to-another-region" />
