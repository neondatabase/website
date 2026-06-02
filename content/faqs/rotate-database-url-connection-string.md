---
title: 'How do I rotate my database URL or connection string in Neon?'
subtitle: 'Two paths: reset the role password (fast), or create a new role and migrate consumers (zero-downtime).'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-22T12:41:06.646Z'
isDraft: false
redirectFrom: []
---

## Quick answer

In Neon, your `DATABASE_URL` is built from the role, password, hostname, and database name. To rotate the URL, you change the credential that backs it. There are two reasonable approaches:

1. **Reset the role password.** Fast, but every consumer needs the new password before its next reconnect, or it will fail to authenticate.
2. **Create a new role.** Slower setup, but lets you migrate consumers one by one and keep the old role active during the transition.

Pick the approach that matches your deployment situation.

## Option 1: Reset the role password

This is the right choice for most rotations: routine credential hygiene, suspected leaks, or planned key cycling. The whole flow takes a minute.

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech), select your project, then **Branches → branch → Roles & Databases**.
2. From the role's menu, click **Reset password**.
3. Copy the new password, then click **Connect** on the Project Dashboard to copy the new `DATABASE_URL`.
4. Push the value to your deployment platform.

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

If you have many consumers and want zero downtime, create a parallel role. Both connection strings keep working while you migrate, then you invalidate the old credentials at the end.

```sql
-- Create the new role (or use the Console UI under Roles & Databases)
CREATE ROLE app_v2 WITH LOGIN PASSWORD 'AbC123dEfGhIj';

-- Grant it the same access as the old role
GRANT neon_superuser TO app_v2;
-- Or grant just the specific privileges you want it to have:
-- GRANT CONNECT ON DATABASE neondb TO app_v2;
-- GRANT USAGE ON SCHEMA public TO app_v2;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_v2;
```

Create new roles in the Console (**Branches → branch → Roles & Databases → Add role**) to get automatic `neon_superuser` membership, or with [`neon roles create`](/docs/reference/cli-roles#create). See [Manage roles](/docs/manage/roles) for the differences between Console-created and SQL-created roles.

Then:

1. Build the new `DATABASE_URL` using `app_v2` and its password.
2. Roll it out to your deploy targets one service at a time.
3. Monitor connection counts to confirm nothing still uses the old role.
4. **Reset the old role's password** to invalidate the leaked credentials:

   ```sql
   ALTER USER old_role_name WITH PASSWORD 'a-strong-random-value-no-one-keeps';
   ```

   This is the step that actually closes the breach. You can also reset it from the Console under **Roles & Databases**. Do not skip this step, even if no service uses the old role anymore.

<Admonition type="important" title="Why you usually can't drop the old role">
In most projects, the original role owns the database, schemas, and tables. `DROP ROLE` fails if the role owns any objects, and during an incident is the wrong time to reassign ownership across your schema. Resetting the password is the realistic 99% path: the role stays as the owner of its objects, but the leaked credentials no longer authenticate.

If you do want to remove the role later (outside of incident pressure), you'll need to [reassign ownership](https://www.postgresql.org/docs/current/sql-reassign-owned.html) of every object it owns, then drop it. See [Delete a role](/docs/manage/roles#delete-a-role).
</Admonition>

**Note: The hostname doesn't change**
Even with rotation, the compute hostname stays the same unless you delete and recreate the compute. The `ep-xxx-yyy` portion of your URL is the compute ID. If you need to change the hostname too, you'll need to recreate the project or compute.
