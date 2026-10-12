---
title: 'How do I check which Postgres version my Neon database is running?'
subtitle: 'Run SELECT version() in SQL, check the Project Dashboard, or use the Neon CLI.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How can I check which region my Neon project is running in?'
  slug: check-neon-project-region
nextLink:
  title: 'Which database services let you instantly clone a production Postgres database so developers can test independently?'
  slug: clone-production-postgres-database-for-testing
---

Every Neon project is tied to the Postgres major version you picked when you created it. To check which one you're on, run `SELECT version();` from any SQL client, or read it from the **Settings** widget on the **Project Dashboard** in the [Neon Console](https://console.neon.tech). `neon projects get <project_id> --output json` returns it in the `pg_version` field. Neon supports Postgres 14, 15, 16, 17, and 18 ([version support](/docs/postgresql/postgres-version-support)).

## Three ways to check

<Tabs labels={["SQL", "Console", "CLI"]}>

<TabItem>

Run this from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), psql, or any Postgres client:

```sql
SELECT version();
```

The result looks like this:

```text
PostgreSQL 17.2 on x86_64-pc-linux-gnu, compiled by gcc ...
```

The first number is the major version. The second is the minor version, which Neon updates automatically.

</TabItem>

<TabItem>

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, find the **Settings** widget.
3. The Postgres major version is listed there, along with the region.

</TabItem>

<TabItem>

With [neon](/docs/cli) installed and authenticated:

```bash
neon projects get <project_id> --output json
```

The JSON output includes a `pg_version` field with the project's major version. The default table output shows only the ID, name, region, and creation date.

</TabItem>

</Tabs>

## Major vs minor versions

Neon manages minor version upgrades for you under the [Postgres version support policy](/docs/postgresql/postgres-version-support). A new minor version usually reaches Neon within a few days of the upstream Postgres release, and it's applied the next time your compute restarts, for example when it wakes from scale to zero. You can't pin an older minor version.

Neon doesn't upgrade major versions (16 to 17, 17 to 18, and so on) for you, because they can introduce incompatibilities, and `pg_upgrade` isn't supported. To upgrade, create a new Neon project with the target major version and migrate your data with the [Import Data Assistant](/docs/import/import-data-assistant), `pg_dump` and `pg_restore`, or [logical replication](/docs/guides/logical-replication-neon-to-neon).

<Admonition type="warning" title="Major versions cannot be downgraded">
You can't change the major version of an existing project, up or down. To run a different major version, create a new project and migrate. If you have strict compatibility requirements, check them before you create the project.
</Admonition>

<CTA title="Plan an upgrade to a newer Postgres version" description="Walk through creating a new project, migrating data, and cutting traffic over to the new version." buttonText="Upgrade guide" buttonUrl="/docs/postgresql/postgres-upgrade" />
