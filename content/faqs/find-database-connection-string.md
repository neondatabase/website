---
title: 'Where can I find my database connection string in Neon?'
subtitle: 'Copy it from the Connect widget on your Project Dashboard, with options for pooled or direct.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Open your project in the [Neon Console](https://console.neon.tech), then click **Connect** on the **Project Dashboard**. The **Connect to your database** widget opens with a ready-made connection string for the branch, compute, database, and role you select. Toggle **Connection pooling** to switch between a pooled and a direct connection string. See [Connect from any app](/docs/connect/connect-from-any-app) for the full reference.

## Get the connection string from the Console

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, click **Connect**.
3. In the **Connect to your database** modal, choose a **Branch**, **Compute**, **Database**, and **Role**.
4. Copy the constructed connection string. Neon shows the pooled connection string by default. Turn **Connection pooling** off to get the direct connection string instead.

A Neon connection string includes the role, password, hostname, and database name:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The pooled hostname has a `-pooler` suffix. Use pooled for serverless and high-concurrency clients (Neon's pooler supports up to 10,000 concurrent connections per compute). Use direct for migrations, `pg_dump`, and `LISTEN/NOTIFY`. See [Connection pooling](/docs/connect/connection-pooling) for the full breakdown.

## Reset or regenerate the credentials in the string

The connection string itself is fixed for a given branch, role, and database. The part you can rotate is the role's password. Resetting the password invalidates the old password immediately and produces a new connection string.

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

1. In the **Connect to your database** modal, click the role selector and choose **Reset password**, or go to **Branches** > your branch > **Roles & Databases** > role menu > **Reset password**.
2. Confirm. Neon generates a new password and shows it once. Update any stored connection strings or secrets right away.

</TabItem>

<TabItem>

```bash
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json"
```

The response includes the new password. See [Reset a password with the API](/docs/manage/roles#reset-a-password-with-the-api).

</TabItem>

<TabItem>

To set a password value of your choosing, connect via the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) or psql and run:

```sql
ALTER USER alex WITH PASSWORD 'new_password_value';
```

Passwords need a minimum entropy of 60 bits. See [password guidelines](/docs/manage/roles#manage-roles-with-sql).

</TabItem>

</Tabs>

<Admonition type="warning" title="Rotate the password if it leaked">
If a connection string was committed to source control or shared in a chat, reset the role's password right away. The previous password stops working as soon as the reset completes, and any application still using the old string will fail to connect until it picks up the new password.
</Admonition>

<CTA title="See all the connect options" description="Walk through the full Connect modal, language examples, and pooled vs direct guidance." buttonText="Read the docs" buttonUrl="/docs/connect/connect-from-any-app" />
