---
title: 'How do I reset or change my database password in Neon?'
subtitle: 'Reset a role password from the Console, the Neon API, or with ALTER ROLE in SQL.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T14:42:53.313Z'
isDraft: false
redirectFrom: []
---

Neon stores a password per Postgres role per branch. You can reset it from the **Roles & Databases** tab in the Console, with the Neon API, or by running `ALTER ROLE ... WITH PASSWORD '...'` from any SQL client. The reset is immediate: the old password stops working, and the connection string for that role updates with the new password.

## Reset the password

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

1. Open your project in the [Neon Console](https://console.neon.tech).
2. Select **Branches** in the sidebar, then click the branch that owns the role.
3. Open the **Roles & Databases** tab.
4. From the role's menu, choose **Reset password**.
5. Click **Reset**. Neon shows the new generated password once. Copy it into your secret manager.

You can also trigger a reset from the **Connect** widget on the **Project Dashboard** by clicking the role's menu inside the modal. See [Reset a password](/docs/manage/roles#reset-a-password) for screenshots.

</TabItem>

<TabItem>

```bash
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json"
```

The response body contains the new password under `role.password`. See the [Reset role password](/docs/manage/roles#reset-a-password-with-the-api) reference.

</TabItem>

<TabItem>

To set the password to a value you choose, connect with the [SQL Editor](/docs/get-started/query-with-neon-sql-editor), [psql](/docs/connect/query-with-psql-editor), or any SQL client, then run:

```sql
ALTER ROLE alex WITH PASSWORD 'YourNewPassword123!';
```

Passwords need at least 60 bits of entropy: 12+ characters mixing lower, upper, digit, and symbol. See the [password guidelines](/docs/manage/roles#manage-roles-with-sql).

</TabItem>

</Tabs>

## After the reset

- Any application still using the old password gets an authentication error on its next connection attempt. Update your environment variables, `.env` files, and secret stores right away.
- The hostname and database name in the connection string don't change. Only the password segment is new.
- If the role belongs to a parent branch, the reset applies to that branch only. Child branches keep their existing password unless you reset them separately.

<Admonition type="important" title="Console resets generate a password for you">
The Console **Reset password** action always generates a new random password. To set a password to a specific value (for example, to match a secret you already store elsewhere), use the SQL `ALTER ROLE` approach instead.
</Admonition>

<CTA title="Manage roles end to end" description="See the full role management guide, including the API reference and the neon_superuser role." buttonText="Read the docs" buttonUrl="/docs/manage/roles" />
