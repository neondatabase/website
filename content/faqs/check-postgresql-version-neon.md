---
title: 'How do I check which PostgreSQL version my Neon database is running?'
subtitle: 'Run SELECT version() in SQL, check the Project Dashboard, or use the Neon CLI.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Every Neon project is tied to a specific Postgres major version that you picked at project creation. To check which one you're on, run `SELECT version();` from any SQL client, or read it from the **Settings** widget on the **Project Dashboard** in the [Neon Console](https://console.neon.tech). The CLI command `neon projects get` shows the same value. Neon supports Postgres 14, 15, 16, 17, and 18. See [Upgrading your Postgres version](/docs/postgresql/postgres-upgrade) for details.

## Three ways to check

<Tabs labels={["SQL", "Console", "CLI"]}>

<TabItem>

Run this from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), psql, or any Postgres client:

```sql
SELECT version();
```

You'll get a string like:

```text
PostgreSQL 17.2 on x86_64-pc-linux-gnu, compiled by gcc ...
```

The first number is the major version. The second is the minor version, which Neon upgrades automatically.

</TabItem>

<TabItem>

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, find the **Settings** widget.
3. The Postgres version is listed there alongside region and creation date.

</TabItem>

<TabItem>

With [neonctl](/docs/reference/neon-cli) installed and authenticated:

```bash
neon projects get <project_id>
```

The output includes a `pg_version` field with the major version your project is running.

</TabItem>

</Tabs>

## Major vs minor versions

Neon manages **minor** version upgrades for you under the [Postgres version support policy](/docs/postgresql/postgres-version-policy). Minor versions are deployed soon after release and typically don't require any action on your part.

**Major** versions (16 to 17, 17 to 18, and so on) are not upgraded automatically because they can introduce incompatibilities. You upgrade by creating a new Neon project with the target major version and migrating your data with the [Import Data Assistant](/docs/import/import-data-assistant), `pg_dump` / `pg_restore`, or [logical replication](/docs/guides/logical-replication-neon-to-neon).

<Admonition type="warning" title="Major versions cannot be downgraded">
Once a Neon project is created with a given major version, you cannot move it backward. You also can't change the major version on an existing project. To run a different major version, create a new project and migrate. Pick carefully if you have strict compatibility requirements.
</Admonition>

<CTA title="Plan an upgrade to a newer Postgres version" description="Walk through creating a new project, migrating data, and cutting traffic over to the new version." buttonText="Upgrade guide" buttonUrl="/docs/postgresql/postgres-upgrade" />
