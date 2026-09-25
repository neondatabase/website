---
title: 'How do I rename a database in my Neon project?'
subtitle: 'Connect to a different database on the same branch, then run ALTER DATABASE ... RENAME TO.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'What Postgres tools support creating a database for every preview deployment?'
  slug: postgres-tools-preview-deployments
nextLink:
  title: 'How do I reset or change my database password in Neon?'
  slug: reset-database-password
---

To rename a database on Neon, connect to a different database on the same branch (for example, the default `neondb`), close any open connections to the database you're renaming, then run `ALTER DATABASE <old_name> RENAME TO <new_name>;`. You can also rename it with the Neon API. Afterward, update every connection string that uses the old name. See [Rename a database with SQL](/docs/manage/databases#rename-a-database-with-sql).

## Rename with SQL

Postgres won't let you rename a database while you're connected to it, so connect to another database on the same branch first. If the branch has only one database, create a temporary one.

```sql
CREATE DATABASE rename_helper;
```

Connect to that database (`psql "...rename_helper"`, or pick it in the SQL Editor's database selector) and run the rename. The first statement closes any open connections to the database, which would otherwise block the rename.

```sql
-- Terminate any open connections to the database being renamed
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'old_db_name'
  AND pid <> pg_backend_pid();

-- Rename it
ALTER DATABASE old_db_name RENAME TO new_db_name;
```

The rename is instant. Data, schemas, tables, roles, and grants are unaffected.

If you created `rename_helper`, drop it after you're done:

```sql
DROP DATABASE rename_helper;
```

## Rename with the API

Use the [Update database](/docs/reference/api/branches/update-project-branch-database) endpoint, `PATCH /projects/{project_id}/branches/{branch_id}/databases/{database_name}`.

```bash shouldWrap
curl -X PATCH \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/databases/old_db_name" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ "database": { "name": "new_db_name" } }'
```

See [Update a database](/docs/manage/databases#update-a-database).

<Admonition type="warning" title="Update your connection strings">
The database name is part of every connection string for the database. After the rename, any application, script, or stored secret that still uses the old name fails to connect. Update them right after the rename.
</Admonition>

Neon generates the hostname in your connection string (`ep-cool-darkness-...neon.tech`) from the compute's endpoint ID, and you can't rename it. The only way to get a different hostname is to replace the branch's compute, since a new compute gets a new endpoint ID. See [Manage computes](/docs/manage/computes).

<CTA title="See all database management options" description="Console, CLI, API, and SQL workflows for creating, updating, and deleting databases." buttonText="Manage databases" buttonUrl="/docs/manage/databases" />
