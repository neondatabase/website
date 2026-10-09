---
title: 'How do I create a new database in my Neon project?'
subtitle: 'Add a database from the Console, the Neon CLI, or with a CREATE DATABASE statement.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I connect my application to my Neon database using the connection string?'
  slug: connect-application-using-connection-string
nextLink:
  title: 'How do I create a new project in Neon?'
  slug: create-new-neon-project
---

A Neon project starts with one database (`neondb` unless you name it) on its default branch. You can add more databases to that branch, or to any child branch, from the Console, with the Neon CLI, or with a standard `CREATE DATABASE` statement. Each branch can have up to 500 databases ([docs](/docs/manage/databases)).

## Create the database

<Tabs labels={["Console", "CLI", "SQL"]}>

<TabItem>

1. Open your project in the [Neon Console](https://console.neon.tech).
2. In the sidebar, pick the branch from the **BRANCH** selector.
3. Under **Postgres database**, select **Databases**.
4. Click **Add database**.
5. Enter a name and pick an owner role.
6. Click **Create**.

The role you pick becomes the database owner. See [Manage databases](/docs/manage/databases#create-a-database) for the other options.

</TabItem>

<TabItem>

Install the CLI with `npm i -g neon@latest` ([other install options](/docs/cli/install)) and authenticate with `neon login`. Then:

```bash
neon databases create \
  --name mydb \
  --owner-name neondb_owner \
  --project-id <your-project-id> \
  --branch <branch-id-or-name>
```

If you omit `--branch`, the CLI uses the project's default branch. If you've set a project with `neon set-context`, you can drop `--project-id`. See the [`databases` command reference](/docs/cli/databases).

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

Most standard [CREATE DATABASE parameters](https://www.postgresql.org/docs/current/sql-createdatabase.html) work in Lakebase Postgres. `TABLESPACE` doesn't, because it needs access to the local file system. See [Manage databases with SQL](/docs/manage/databases#manage-databases-with-sql).

</TabItem>

</Tabs>

## After it's created

- The new database lives on the branch you created it in. Child branches you create later get a copy of it, unless you branch from a point in time before the database existed.
- The owner role has `CREATE` on the database's `public` schema. On Postgres 15 and later, other roles need `GRANT CREATE ON SCHEMA public TO <role>;` before they can create objects there.
- You can't use the reserved names `postgres`, `template0`, or `template1`.
- To connect, click **Connect** in the Console and pick the new database in the **Connect to your branch** modal. The connection string updates to match.

<Admonition type="tip" title="One database per app, or many?">
A Neon project can hold many databases. A typical app uses one database and organizes data with schemas. For multi-tenant apps where each customer needs full isolation, use one project per tenant rather than one database per tenant. See [Multitenancy](/docs/guides/multitenancy).
</Admonition>

<CTA title="Manage databases end to end" description="Includes creating, renaming, deleting, transferring table ownership, and the API reference." buttonText="Read the docs" buttonUrl="/docs/manage/databases" />
