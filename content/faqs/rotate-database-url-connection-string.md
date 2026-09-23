---
title: 'How do I rotate my database URL or connection string in Neon?'
subtitle: 'Two paths: reset the role password (fast), or create a new role and migrate consumers (zero-downtime).'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I rotate my database password in Neon after a security incident?'
  slug: rotate-database-password-after-leak
nextLink:
  title: 'How do I rotate my Neon API keys after they''ve been exposed?'
  slug: rotate-neon-api-keys
---

A Neon `DATABASE_URL` is built from the role, password, hostname, and database name. To rotate it, you change the credential behind it, in one of two ways:

1. **Reset the role password.** Every consumer switches at once, and any consumer still on the old password fails on its next connection.
2. **Create a new role.** You move consumers over one at a time while the old role keeps working, then cut off the old role at the end.

See [Rotate credentials](/docs/security/security-overview#rotate-credentials) for both approaches.

## Option 1: Reset the role password

Use this for routine rotation or a suspected leak, when you can update every consumer right away.

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech), select your project, and pick your branch from the **BRANCH** selector in the sidebar.
2. Under **Postgres database**, select **Roles**. From the role's menu, choose **Reset password**, then click **Reset**.
3. Click **Connect** in the Console nav to copy the new `DATABASE_URL`.
4. Update the value on your deploy targets.

</TabItem>

<TabItem>

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq -r '.role.password'
```

</TabItem>

</Tabs>

See [Reset a password](/docs/manage/roles#reset-a-password) for details.

## Option 2: Create a new role and migrate consumers

If you have many consumers and can't update them all at once, create a parallel role. Both connection strings work while you migrate, and you invalidate the old credentials at the end.

The simplest way is to create the role in the Console (**Roles → Add role**), with [`neon roles create`](/docs/cli/roles#create), or with the API. Roles created that way are members of `neon_superuser`, like the default role. A role created in SQL starts with only basic `public` schema privileges, so grant what it needs:

```sql
CREATE ROLE app_v2 WITH LOGIN PASSWORD 'AbC123dEfGhIj';

GRANT CONNECT ON DATABASE neondb TO app_v2;
GRANT USAGE ON SCHEMA public TO app_v2;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_v2;
```

See [Manage roles](/docs/manage/roles#the-neonsuperuser-role) for the differences between the two.

Then:

1. Build the new `DATABASE_URL` using `app_v2` and its password.
2. Roll it out to your deploy targets one service at a time.
3. Confirm nothing still connects as the old role, for example with `SELECT count(*) FROM pg_stat_activity WHERE usename = 'old_role_name';` over a few days.
4. **Reset the old role's password** to invalidate the leaked credentials:

   ```sql
   ALTER ROLE old_role_name WITH PASSWORD 'a-strong-random-value-no-one-keeps';
   ```

   This step is what invalidates the leaked credentials, so don't skip it even when no service uses the old role anymore. You can also reset the password from the Console **Roles** page.

<Admonition type="important" title="Why you usually can't drop the old role">
In most projects, the original role owns the database, schemas, and tables, and `DROP ROLE` fails while a role owns objects. Resetting the password leaves the role as the owner but stops the leaked credentials from authenticating.

To remove the role later, when you're not in the middle of an incident, [reassign ownership](https://www.postgresql.org/docs/current/sql-reassign-owned.html) of every object it owns, then drop it. See [Delete a role](/docs/manage/roles#delete-a-role).
</Admonition>

Rotation doesn't change the hostname. The `ep-xxx` part of your URL is the compute's endpoint ID, so the only way to get a new hostname is to replace the branch's compute (or create a new project). See [Manage computes](/docs/manage/computes).
