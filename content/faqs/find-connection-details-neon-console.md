---
title: 'Where can I find my database connection details in the Neon Console?'
subtitle: 'Click Connect in the Neon Console to see every connection detail for a branch.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Why am I getting ''Error connecting to database: Failed to fetch'' in the Neon Console Tables view?'
  slug: failed-to-fetch-error-tables-view
nextLink:
  title: 'Where can I find my database connection string or URL in Neon?'
  slug: find-database-connection-string-url
---

Open your project in the [Neon Console](https://console.neon.tech) and click **Connect** in the Console nav. The **Connect to your branch** modal shows every connection detail for the branch, compute, database, and role you select, including the host, the password, and a ready-to-copy connection string. See [Connect from any app](/docs/connect/connect-from-any-app).

## Open the Connect modal

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Connect** in the Console nav.
3. Select a **Branch**, **Compute**, **Database**, and **Role**. The connection string updates to match.

## What the modal shows

| Field                         | What it is                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Branch**                    | The branch you're connecting to. Defaults to your project's default branch (`production` or `main`).                   |
| **Compute**                   | The compute serving the branch: its read-write compute, or a read replica if the branch has one.                       |
| **Database**                  | The Postgres database on that branch. Defaults to `neondb` if you didn't pick a custom name.                           |
| **Role**                      | The Postgres role you'll authenticate as. Defaults to the role created with the project (for example, `neondb_owner`). |
| **Connection string**         | The full `postgresql://...` URL with role, password, host, and database name.                                          |
| **Connection pooling** toggle | Adds `-pooler` to the hostname for connection pooling through PgBouncer.                                               |
| **Save in 1Password**         | Saves the connection details to 1Password if the browser extension is installed.                                       |

The pooled and direct hostnames differ only by the `-pooler` suffix. For example:

```text
Direct: ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech
Pooled: ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech
```

The compute ID (the `ep-...` segment) is the same in both. The modal shows the pooled string by default. See [Connection pooling](/docs/connect/connection-pooling) for when to use each.

## Individual fields for a `.env` file

If your app reads the parts separately, copy them from the modal into your `.env` file:

```text
PGHOST=ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech
PGDATABASE=dbname
PGUSER=alex
PGPASSWORD=AbC123dEf
PGPORT=5432
```

Neon uses the default Postgres port, `5432`.

<Admonition type="tip" title="Code snippets">
The **Connect to your branch** modal also shows [connection examples](/docs/connect/connect-from-any-app#connection-examples-in-the-console) for different languages and frameworks, built for the branch, database, and role you select.
</Admonition>

<CTA title="See the full Connect reference" description="Learn about pooled and direct connections, the Neon CLI, and connection examples by language." buttonText="Read the docs" buttonUrl="/docs/connect/connect-from-any-app" />
