---
title: 'How do I rotate my database password in Neon after a security incident?'
subtitle: 'Reset a role password from the Neon Console, API, or SQL to invalidate the leaked credential.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I rotate all my Neon database credentials and connection strings after a security breach?'
  slug: rotate-database-credentials-after-breach
nextLink:
  title: 'How do I rotate my database URL or connection string in Neon?'
  slug: rotate-database-url-connection-string
---

To rotate a password on Neon, reset the password of the affected Postgres role. You can do it from the **Roles** page in the Neon Console, with the Neon API, or with an SQL `ALTER ROLE` statement. A Console or API reset generates a new password and takes effect immediately, so any new connection with the old password fails. Copy the updated connection string from the **Connect** modal.

## Reset the password

Each method gives you a new password and a new connection string.

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and select your project.
2. In the sidebar, select the branch where the role lives (usually `production` or `main`) from the **BRANCH** selector.
3. Under **Postgres database**, select **Roles**, open the role's menu, and choose **Reset password**.
4. Click **Reset**. A modal shows the new password. Copy it.
5. Click **Connect** in the Console nav to copy the updated connection string.

See [Reset a password](/docs/manage/roles#reset-a-password).

</TabItem>

<TabItem>

The Neon CLI has no password reset command, so call the API directly. Replace the IDs and role name with yours.

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq
```

The response includes the new password under `role.password`. See the [Reset role password API reference](/docs/reference/api/branches/reset-project-branch-role-password).

</TabItem>

<TabItem>

To set a specific password (for example, one already stored in a secret manager), connect with `psql` or the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) and run `ALTER ROLE`.

```sql
ALTER ROLE neondb_owner WITH PASSWORD 'AbC123dEfGhIj';
```

Passwords must have at least 60 bits of entropy, which in practice means 12 or more mixed characters. Don't reuse the example value. See [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql) for the rules.

</TabItem>

</Tabs>

## Update your applications

A new password means a new connection string. Any process still using the old `DATABASE_URL` fails to authenticate on its next connection. Update the connection string everywhere it's stored:

- Environment variables on Vercel, Render, Fly.io, Railway, or other deploy targets
- GitHub Actions or CI secrets
- Local `.env` files
- Secret managers (AWS Secrets Manager, Doppler, 1Password, etc.)
- Long-running workers, cron jobs, and background services

<Admonition type="warning" title="Open sessions survive a reset">
Postgres checks the password only when a connection opens, so sessions that were already open stay connected after the reset. Every new connection, including reconnects, needs the new password. After a leak, [restart the compute](/docs/manage/computes#restart-a-compute) to close any session opened with the old password.
</Admonition>

If the leak might have exposed more than one role, see [How do I rotate all my Neon database credentials after a breach?](/faqs/rotate-database-credentials-after-breach).
