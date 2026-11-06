---
title: 'Where can I find my database connection string or URL in Neon?'
subtitle: 'The Connect modal builds it for you. The URL is fixed per role and branch, but you can reset the password.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Where can I find my database connection details in the Neon Console?'
  slug: find-connection-details-neon-console
nextLink:
  title: 'Where can I find my database connection string in Neon?'
  slug: find-database-connection-string
---

In the [Neon Console](https://console.neon.tech), click **Connect** in the Console nav. The **Connect to your branch** modal builds the full Postgres URL for the branch, compute, database, and role you select. Neon generates the hostname from the compute's ID, so you can't pick your own. You can point the URL at a different branch, compute, database, or role, and you can reset the role's password, which changes the password in the URL.

## Copy the URL from the Console

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Connect** in the Console nav.
3. Pick a **Branch**, **Compute**, **Database**, and **Role**.
4. Copy the URL. The modal shows the pooled URL by default. Turn **Connection pooling** off if you need the direct URL (no `-pooler` in the hostname).

Neon URLs follow this shape:

```text
postgresql://<role>:<password>@<endpoint-id>[-pooler].<region>.aws.neon.tech/<database>?sslmode=require&channel_binding=require
```

For example:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

To test it, pass the URL to `psql`:

```bash
psql "postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

See [Connect from any app](/docs/connect/connect-from-any-app) for a breakdown of each part.

## What you can and can't change in the URL

| Part of the URL                             | Can you change it?                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Role (`alex`)                               | Yes, pick a different role in the Connect modal, or create a new role                          |
| Password                                    | Yes, [reset it](/docs/manage/roles#reset-a-password) in the Console or API, or set it with SQL |
| Endpoint host (`ep-cool-darkness-...`)      | No, it's the compute's ID. A different compute or branch has a different host                  |
| `-pooler` suffix                            | Yes, toggle **Connection pooling** in the modal                                                |
| Region                                      | No, it's fixed when you create the project. For another region, create a new project           |
| Database                                    | Yes, select a different database, or [create a new one](/docs/manage/databases)                |
| Query params (`sslmode`, `channel_binding`) | Yes, they're client-side options. Neon requires SSL, so keep `sslmode=require` or stricter     |

<Admonition type="tip" title="Rotate, don't edit">
To get a new connection string, [reset the role's password](/docs/manage/roles#reset-a-password) or create a new role. If you edit the hostname by hand, the connection fails.
</Admonition>

<CTA title="Try the URL in psql" description="Walk through connecting to Neon with the psql client, including SNI workarounds for older versions." buttonText="psql guide" buttonUrl="/docs/connect/query-with-psql-editor" />
