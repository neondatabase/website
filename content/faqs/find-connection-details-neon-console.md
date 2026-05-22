---
title: 'Where can I find my database connection details in the Neon Console?'
subtitle: 'Everything you need lives in the Connect widget on the Project Dashboard.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Open your project in the [Neon Console](https://console.neon.tech) and click **Connect** on the **Project Dashboard**. The **Connect to your database** modal lists every detail you need to connect: branch, compute, database, role, host, password, and a constructed connection string. They all live in this one widget rather than being scattered across the Console.

## Open the Connect widget

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, click **Connect**.

The modal opens with everything wired up for the branch and role you select.

## What you'll see in the widget

| Field                             | What it is                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Branch**                        | The branch you're connecting to. Defaults to your project's root branch (`main` or `production`).                      |
| **Compute**                       | The compute endpoint serving the branch. Each branch has at least one read-write compute.                              |
| **Database**                      | The Postgres database on that branch. Defaults to `neondb` if you didn't pick a custom name.                           |
| **Role**                          | The Postgres role you'll authenticate as. Defaults to the role created with the project (for example, `neondb_owner`). |
| **Connection string**             | The full `postgresql://...` URL with role, password, host, and database name.                                          |
| **Connection pooling** toggle     | Adds `-pooler` to the hostname for connection pooling through PgBouncer.                                               |
| **Reset password** (in role menu) | Generates a new password for the selected role.                                                                        |
| **Save in 1Password**             | Saves the connection details to 1Password if the browser extension is installed.                                       |

The pooled and direct hostnames differ only by the `-pooler` suffix. For example:

```text
Direct: ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech
Pooled: ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech
```

The compute ID (the `ep-...` segment) is the same in both. See [Connection pooling](/docs/connect/connection-pooling) for when to use each.

## Individual fields for a `.env` file

If your app needs the components separately, copy them from the modal into your `.env`:

```text
PGHOST=ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech
PGDATABASE=dbname
PGUSER=alex
PGPASSWORD=AbC123dEf
PGPORT=5432
```

Neon uses the default Postgres port, `5432`. See [Connect from any app](/docs/connect/connect-from-any-app#get-a-connection-string-from-the-neon-console) for more.

<Admonition type="tip" title="Looking for code snippets?">
The Connect modal also shows ready-to-paste examples for Node.js, Python, Go, Java, Rust, and other languages, with the connection string baked in. Switch the **Connection examples** dropdown to your language of choice.
</Admonition>

<CTA title="See the full Connect reference" description="Learn about pooled vs direct connections, SNI workarounds, and language-specific notes." buttonText="Read the docs" buttonUrl="/docs/connect/connect-from-any-app" />
