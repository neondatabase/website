---
title: 'How do I reset or change my database password in Neon?'
subtitle: 'Reset a role password from the Console, the Neon API, or with ALTER ROLE in SQL.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I rename a database in my Neon project?'
  slug: rename-database-neon-project
nextLink:
  title: 'How do I rotate my Neon database connection string for security purposes?'
  slug: rotate-database-connection-string-security
---

Postgres roles on Neon are branch-scoped, so each branch keeps its own password for a role. You can reset a password from the **Roles** page in the Console, with the Neon API, or by running `ALTER ROLE ... WITH PASSWORD '...'` from any SQL client. The reset takes effect immediately. The old password stops working on the next connection, so copy the updated connection string from the **Connect** modal. There's no Neon CLI command for this ([Reset a password](/docs/manage/roles#reset-a-password)).

## Reset the password

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

1. Open your project in the [Neon Console](https://console.neon.tech).
2. In the sidebar, select your branch from the **BRANCH** selector.
3. Under **Postgres database**, select **Roles**.
4. From the role's menu, choose **Reset password**.
5. Click **Reset**. A modal shows the new generated password. Copy it into your secret manager.

See [Reset a password](/docs/manage/roles#reset-a-password).

</TabItem>

<TabItem>

```bash
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json"
```

The response body contains the new password under `role.password`. See the [Reset role password](/docs/reference/api/branches/reset-project-branch-role-password) API reference.

</TabItem>

<TabItem>

The Console and API always generate a random password. To set a value you choose (for example, one already stored in your secret manager), connect with the [SQL Editor](/docs/get-started/query-with-neon-sql-editor), [psql](/docs/connect/query-with-psql-editor), or any SQL client, and run `ALTER ROLE`.

```sql
ALTER ROLE alex WITH PASSWORD 'new_password';
```

Passwords need at least 60 bits of entropy. In practice, that means 12 or more characters that mix lowercase, uppercase, digits, and symbols, with no dictionary words or sequences. See the [password guidelines](/docs/manage/roles#manage-roles-with-sql).

</TabItem>

</Tabs>

## After the reset

- Any application still using the old password gets an authentication error on its next connection attempt. Update your environment variables, `.env` files, and secret stores right away.
- The hostname and database name in the connection string don't change. Only the password segment is new.
- The reset applies only to the branch you ran it on. Child branches keep the old password until you reset the role on each of them.

<CTA title="Manage roles end to end" description="See the full role management guide, including the API reference and the neon_superuser role." buttonText="Read the docs" buttonUrl="/docs/manage/roles" />
