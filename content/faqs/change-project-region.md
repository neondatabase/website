---
title: 'Can I change the region of my existing Neon project after creation?'
subtitle: 'No. Region is fixed at project creation. Migrate to a new project to change regions.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'What are the best ways to give every developer on a team their own separate Postgres database for development?'
  slug: best-ways-separate-postgres-database-development
nextLink:
  title: 'How do I migrate an existing Neon project to a different AWS region?'
  slug: change-region-existing-neon-project
---

No. A Neon project is created in a single region, and you can't change the region after creation ([Regions](/docs/introduction/regions)). To move your data to a different region, create a new project in the target region and migrate the data into it. All branches in a project share the project's region, so creating a branch won't move your data.

## Where the region shows up

Your database runs in the project's region, and the hostname in your connection string includes it (for example, `ep-cool-darkness-123456.us-east-2.aws.neon.tech`). A move to another region means a new project with a new hostname, so plan to update every connection string.

For a flowchart of migration paths, see [Region migration](/docs/import/region-migration).

## How to migrate to a different region

1. **Create a new Neon project** in the target region. In the [Neon Console](https://console.neon.tech), click **New Project** and pick an AWS region. Use the same Postgres major version as the source.
2. **Dump from the old project** with `pg_dump`:

   ```bash shouldWrap
   pg_dump -Fc -v -d "$OLD_PROJECT_CONNECTION_STRING" -f neon_dump.bak
   ```

3. **Restore into the new project**:

   ```bash shouldWrap
   pg_restore -v -d "$NEW_PROJECT_CONNECTION_STRING" neon_dump.bak
   ```

4. **Update your applications** to use the new connection string.
5. **Delete the old project** once you've confirmed the new one is working. The old project keeps billing for storage until you delete it.

Use [unpooled](/docs/reference/glossary#unpooled-connection-string) connection strings for both `pg_dump` and `pg_restore`, not pooled ones. If objects in the source are owned by other roles, add `--no-owner` to `pg_restore` to skip the `ALTER OWNER` statements, which Neon roles can't run. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres) for the full command reference, ownership notes, and options for large databases.

<Admonition type="tip" title="For larger datasets or minimal downtime">
If a dump and restore would mean more downtime than you can accept, use [logical replication](/docs/guides/logical-replication-neon-to-neon) to stream changes from the old project to the new one and cut over when it catches up. For databases under 10 GB, the [Import Data Assistant](/docs/import/import-data-assistant) runs the import from the Console with just a connection string. See [Migrate to another Neon region](/docs/import/migrate-neon-to-another-region) to compare the options.
</Admonition>

## Branches in another region

Branches inherit the project's region, and so do [read replicas](/docs/introduction/read-replicas#cross-region-support). If you need data in two regions for latency reasons, run a project in each region and replicate between them with [logical replication](/docs/guides/logical-replication-neon-to-neon).

## Azure regions

All [Neon Azure regions are deprecated](/docs/introduction/regions#azure-regions), and new projects run on AWS. If you need to keep Postgres in Azure for residency or colocation, Databricks Lakebase Postgres supports Azure regions. See [Migrate Neon to Lakebase](/docs/guides/migrate-neon-to-lakebase).

<CTA title="Plan your region migration" description="The region migration overview covers each supported path and helps you pick one." buttonText="Region migration guide" buttonUrl="https://neon.com/docs/import/region-migration" />
