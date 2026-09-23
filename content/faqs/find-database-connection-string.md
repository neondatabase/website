---
title: 'Where can I find my database connection string in Neon?'
subtitle: 'Copy it from the Connect modal in the Neon Console, pooled or direct.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Where can I find my database connection string or URL in Neon?'
  slug: find-database-connection-string-url
nextLink:
  title: 'Where can I find my DATABASE_URL in Neon?'
  slug: find-database-url-neon
---

Open your project in the [Neon Console](https://console.neon.tech), then click **Connect** in the Console nav. The **Connect to your branch** modal builds a connection string for the branch, compute, database, and role you select. Turn **Connection pooling** on or off to switch between a pooled and a direct connection string. See [Connect from any app](/docs/connect/connect-from-any-app) for the full reference.

## Get the connection string from the Console

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Connect** in the Console nav.
3. In the **Connect to your branch** modal, choose a **Branch**, **Compute**, **Database**, and **Role**.
4. Copy the connection string. The modal shows the pooled connection string by default. Turn **Connection pooling** off to get the direct connection string instead.

A Neon connection string includes the role, password, hostname, and database name:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The pooled hostname has a `-pooler` suffix. Use the pooled string for serverless and high-concurrency clients, since Neon's pooler accepts up to 10,000 client connections per compute. Use the direct string for migrations, `pg_dump`, and `LISTEN`/`NOTIFY`. See [Connection pooling](/docs/connect/connection-pooling) for the full breakdown.

## Reset or regenerate the credentials in the string

For a given branch, compute, database, and role, the only part of the connection string you can change is the password. Resetting the password invalidates the old one and gives you a new connection string.

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

1. In the Console sidebar, select your branch from the **BRANCH** selector.
2. Under **Postgres database**, select **Roles**.
3. Select **Reset password** from the role menu, then click **Reset**. Neon generates a new password and displays it.
4. Update any stored connection strings or secrets right away.

</TabItem>

<TabItem>

```bash
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json"
```

The response includes the new password. See [Reset a password](/docs/manage/roles#reset-a-password).

</TabItem>

<TabItem>

To set a password of your choosing, connect with the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) or `psql` and run:

```sql
ALTER USER alex WITH PASSWORD 'new_password_value';
```

Passwords need a minimum entropy of 60 bits. As a guideline, use at least 12 characters with a mix of character types. See [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

</TabItem>

</Tabs>

<Admonition type="warning" title="Rotate the password if it leaked">
If a connection string was committed to source control or shared in a chat, reset the role's password right away. The old password stops working when the reset completes, so any app still using the old string can't connect until you update it.
</Admonition>

<CTA title="See all the connect options" description="Walk through the full Connect modal, language examples, and pooled vs direct guidance." buttonText="Read the docs" buttonUrl="/docs/connect/connect-from-any-app" />
