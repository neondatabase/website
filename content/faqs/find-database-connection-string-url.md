---
title: 'Where can I find my database connection string or URL in Neon?'
subtitle: 'The Connect widget builds it for you. The URL is fixed per role and branch, but you can reset the password.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Click **Connect** on your **Project Dashboard** in the [Neon Console](https://console.neon.tech). The **Connect to your database** modal builds the full Postgres URL for the branch, compute, database, and role you select. The hostname and username come from your compute endpoint and the chosen role, so you can't edit them freely. You can rotate the role's password (which changes the URL) and switch the branch, compute, or database the URL points to.

## Copy the URL from the Console

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, click **Connect**.
3. Pick a **Branch**, **Compute**, **Database**, and **Role**.
4. Copy the URL. Toggle **Connection pooling** off if you need the direct URL (no `-pooler` in the hostname).

Neon URLs follow this shape:

```text
postgresql://<role>:<password>@<endpoint-id>[-pooler].<region>.aws.neon.tech/<database>?sslmode=require&channel_binding=require
```

Real example:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Paste this directly into `psql` to test the connection:

```bash
psql "postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

See [Connect from any app](/docs/connect/connect-from-any-app) for full details on each segment.

## What you can and can't change in the URL

| Part of the URL                             | Can you change it?                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| Role (`alex`)                               | Yes, pick a different role in the Connect modal, or create a new role                   |
| Password                                    | Yes, [reset it](/docs/manage/roles#reset-a-password) from the Console, API, or SQL      |
| Endpoint host (`ep-cool-darkness-...`)      | No, it's the compute's ID. To change it, create a new compute or use a different branch |
| `-pooler` suffix                            | Yes, toggle **Connection pooling** in the modal                                         |
| Region                                      | No, it's set when the project is created                                                |
| Database                                    | Yes, select a different database, or [create a new one](/docs/manage/databases)         |
| Query params (`sslmode`, `channel_binding`) | Yes, these are client-side options you can adjust per connection                        |

<Admonition type="tip" title="Rotate, don't edit">
If you want a "new" connection string, the practical way to get one is to [reset the role's password](/docs/manage/roles#reset-a-password) or create a new role. Editing the hostname by hand will break the connection.
</Admonition>

<CTA title="Try the URL in psql" description="Walk through connecting to Neon with the psql client, including SNI workarounds for older versions." buttonText="psql guide" buttonUrl="/docs/connect/query-with-psql-editor" />
