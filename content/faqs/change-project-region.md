---
title: 'Can I change the region of my existing Neon project after creation?'
subtitle: 'No. Region is fixed at project creation. Migrate to a new project to change regions.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T14:42:53.313Z'
isDraft: false
redirectFrom: []
---

## Quick answer

No. A Neon project is created in a single region, and the region cannot be changed after creation. To move your data to a different region, create a new project in the target region and migrate the data over. All branches in a project share the project's region, so branching alone won't help.

## Why region is fixed

A Neon project's storage, compute, and proxy infrastructure all live in the chosen region. The hostname in your connection string encodes that region (for example, `us-east-2.aws.neon.tech`). Moving the project would mean moving every byte of stored data and tearing down compute, which Neon handles as a migration to a new project rather than an in-place change.

For the full reasoning and a flowchart of migration options, see [Region migration](/docs/import/region-migration).

## How to migrate to a different region

The high-level steps:

1. **Create a new Neon project** in the target region. From the [Neon Console](https://console.neon.tech), click **New Project** and pick the cloud provider and region you want.
2. **Dump from the old project** with `pg_dump`:

   ```bash shouldWrap
   pg_dump -Fc -v -d "$OLD_PROJECT_CONNECTION_STRING" -f neon_dump.bak
   ```

3. **Restore into the new project**:

   ```bash shouldWrap
   pg_restore -v -d "$NEW_PROJECT_CONNECTION_STRING" neon_dump.bak
   ```

4. **Update your applications** to use the new connection string.
5. **Delete the old project** once you've confirmed the new one is working.

Use the [unpooled](/docs/reference/glossary#unpooled-connection-string) connection string for `pg_dump`. Pooled connections don't work for dump operations. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres) for the full command reference, ownership notes, and large-database considerations.

<Admonition type="tip" title="For larger datasets or zero downtime">
If `pg_dump` plus `pg_restore` would mean more downtime than you can accept, use logical replication to stream changes from the old project to the new one and cut over at the end. Neon's [Import Data Assistant](/docs/import/import-data-assistant) automates this for databases under 10 GB. See [Migrate to another Neon region](/docs/import/migrate-neon-to-another-region) for the full set of options.
</Admonition>

## What about branches in another region?

Branches inherit the project's region. You cannot create a branch in a different region than the project. If you need data in two regions for latency reasons, run two separate projects and use logical replication between them, or run a read replica in the same region.

## What about Azure?

Some [Azure regions are deprecated](/docs/introduction/regions#azure-regions). If you need to keep Postgres on Azure for residency reasons, look at [Databricks Lakebase](/docs/guides/migrate-neon-to-lakebase), which supports Azure regions.

<CTA title="Plan your region migration" description="The region migration overview walks through every supported path and helps you pick one." buttonText="Region migration guide" buttonUrl="https://neon.com/docs/import/region-migration" />
