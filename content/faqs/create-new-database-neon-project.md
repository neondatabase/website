---
title: 'How do I create a new database in my Neon project?'
subtitle: 'Add a database from the Console, the Neon CLI, or with a CREATE DATABASE statement.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

A Neon project starts with one database (`neondb` by default) on its root branch. You can add more databases to that branch (or any child branch) from the **Roles & Databases** tab in the Console, with the Neon CLI, or with a standard `CREATE DATABASE` statement. Each branch supports up to 500 databases.

## Create the database

<Tabs labels={["Console", "CLI", "SQL"]}>

<TabItem>

1. Open your project in the [Neon Console](https://console.neon.tech).
2. Select **Branches** in the sidebar.
3. Click the branch where the database should live.
4. Open the **Roles & Databases** tab.
5. Click **Add database**.
6. Enter a name and pick an owner role.
7. Click **Create**.

The owner role you pick becomes the database owner and has full privileges on it. See [Manage databases](/docs/manage/databases#create-a-database) for screenshots.

</TabItem>

<TabItem>

Install the CLI with `npm i -g neonctl` and authenticate with `neon auth`. Then:

```bash
neon databases create \
  --name mydb \
  --owner-name neondb_owner \
  --project-id <your-project-id> \
  --branch <branch-id-or-name>
```

If you've set a default project with `neon set-context`, you can drop `--project-id`. See the [`databases` command reference](/docs/reference/cli-databases).

</TabItem>

<TabItem>

Connect via the [SQL Editor](/docs/get-started/query-with-neon-sql-editor), [psql](/docs/connect/query-with-psql-editor), or any SQL client, then run:

```sql
CREATE DATABASE mydb;
```

The role that runs the statement becomes the owner. To create with a different owner:

```sql
CREATE DATABASE mydb OWNER alex;
```

Most standard [CREATE DATABASE parameters](https://www.postgresql.org/docs/current/sql-createdatabase.html) work in Neon, with the exception of `TABLESPACE` (the local filesystem isn't accessible). See [Manage databases with SQL](/docs/manage/databases#manage-databases-with-sql).

</TabItem>

</Tabs>

## After it's created

- The new database lives on the branch you created it in. If you create a child branch later, this database is copied to the child too.
- The role you picked owns the database and has `CREATE` on its `public` schema. Other roles need an explicit `GRANT CREATE ON SCHEMA public TO <role>;` to create objects there (Postgres 15 and up).
- Reserved names (`postgres`, `template0`, `template1`) aren't permitted.
- Connect to it by clicking **Connect** on the **Project Dashboard** and picking the new database in the **Connection Details** modal. The connection string updates automatically.

<Admonition type="tip" title="One database per app, or many?">
A single Neon project can hold many databases, but in most apps you'll have one database per logical app and use schemas to organize data inside it. For multi-tenant patterns where each customer needs full isolation, consider one project (not just one database) per tenant. See [Multitenancy](/docs/guides/multitenancy).
</Admonition>

<CTA title="Manage databases end to end" description="Includes creating, renaming, deleting, transferring table ownership, and the API reference." buttonText="Read the docs" buttonUrl="/docs/manage/databases" />
