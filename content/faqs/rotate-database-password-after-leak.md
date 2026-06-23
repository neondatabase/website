---
title: 'How do I rotate my database password in Neon after a security incident?'
subtitle: 'Reset a role password from the Neon Console, CLI, or SQL to invalidate the leaked credential.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-22T12:41:06.646Z'
isDraft: false
redirectFrom: []
---

## Quick answer

In Neon, "rotating a password" means resetting the password for the affected Postgres role. You can do this from the Neon Console (**Branches → branch → Roles & Databases → Reset password**), through the Neon API, or with an SQL `ALTER USER` statement. Neon generates a new password immediately and returns the updated connection string. Any new connection attempt using the old password will fail to authenticate.

## Reset the password

Pick the interface that matches your workflow. The result is the same: a new password and a new connection string. Any client trying to reconnect with the old credential will fail to authenticate.

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and select your project.
2. Go to **Branches** and select the branch where the role lives (usually `production` or `main`).
3. On the **Roles & Databases** tab, open the role menu and choose **Reset password**.
4. Confirm. Neon shows the new password once. Copy it.
5. Click **Connect** on the Project Dashboard to copy the updated connection string.

See [Reset a password](/docs/manage/roles#reset-a-password) for screenshots.

</TabItem>

<TabItem>

The Neon CLI doesn't have a dedicated `reset-password` subcommand, so call the API directly. Replace the IDs and role name with yours.

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq
```

The response includes the new `password` for the role. See the [Reset role password API reference](https://api-docs.neon.tech/reference/resetprojectbranchrolepassword).

</TabItem>

<TabItem>

If you need to set a specific password (for example, to match a value stored in a secret manager), connect with `psql` or the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) and run:

```sql
ALTER USER neondb_owner WITH PASSWORD 'AbC123dEfGhIj';
```

Passwords must have at least 60 bits of entropy. See [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql) for the password rules.

</TabItem>

</Tabs>

## Update your applications

A new password produces a new connection string. Any process still using the old `DATABASE_URL` will fail to authenticate on its next connection attempt.

Update the connection string everywhere it's stored:

- Vercel, Render, Fly, Railway, or other deploy targets: project **Environment Variables**
- GitHub Actions or CI secrets
- Local `.env` files
- Secret managers (AWS Secrets Manager, Doppler, 1Password, etc.)
- Long-running workers, cron jobs, and background services

<Admonition type="warning" title="Reconnects use the new password">
Existing open sessions stay connected, but every new connection (or reconnect) must use the new password. Roll out the new value to your deployment platform first if you want to avoid authentication failures during the cutover.
</Admonition>

If the leak might have exposed more than one role, see [How do I rotate all my Neon database credentials after a breach?](/faqs/rotate-database-credentials-after-breach).
