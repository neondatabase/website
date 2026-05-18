---
title: 'How do I delete a database in Neon?'
subtitle: 'Use the Console, CLI, API, or SQL. Connect to a different database first if you go the SQL route.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Open your project in the [Neon Console](https://console.neon.tech), go to **Databases**, select the branch, and click the delete icon on the database row. You can also delete a database with the Neon CLI, the API, or SQL (`DROP DATABASE`). Deletion is permanent. All schemas, tables, indexes, and other objects in the database are dropped along with it. See [Delete a database](/docs/manage/databases#delete-a-database) for the full reference.

## Delete a database

<Tabs labels={["Console", "CLI", "API", "SQL"]}>

<TabItem>

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Databases** in the sidebar.
3. Select the branch containing the database.
4. For the database you want to delete, click the delete icon.
5. In the confirmation dialog, click **Delete**.

</TabItem>

<TabItem>

```bash
neon databases delete <database_name> --branch <branch_id_or_name>
```

If you omit `--branch`, the CLI assumes the project's default branch. See [Neon CLI command: databases](/docs/reference/cli-databases#delete).

</TabItem>

<TabItem>

```bash shouldWrap
curl -X DELETE \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/databases/$DATABASE_NAME" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

See [Delete a database with the API](/docs/manage/databases#delete-a-database-with-the-api).

</TabItem>

<TabItem>

Connect to a different database on the same branch (Postgres won't let you drop the database you're connected to), then run:

```sql
DROP DATABASE old_db_name;
```

If active connections are blocking the drop, terminate them first:

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'old_db_name'
  AND pid <> pg_backend_pid();
```

</TabItem>

</Tabs>

## What gets removed

Dropping a database removes all SQL objects inside it: schemas, tables, indexes, views, materialized views, functions, sequences, and any data. Roles aren't deleted; they live at the branch level and may own objects in other databases. The storage the database consumed stops counting against your project's storage usage once the drop completes.

The branch, compute, and any other databases on the branch aren't affected.

<Admonition type="warning" title="Deletion is permanent">
There's no undo on `DROP DATABASE`. If your project's [history window](/docs/introduction/history-window) still covers the moment before the drop, you can recover with [instant restore](/docs/introduction/branch-restore) on the root branch, which restores every database on that branch to the chosen point in time. Outside the history window (6 hours on Free, up to 7 or 30 days on paid plans), the only recovery path is your own backups.
</Admonition>

## Delete the whole project instead

If you want to remove everything (every database, branch, snapshot, and the project itself), go to **Project settings** > **General** > **Delete project**. That action is also permanent and stops all billing for the project. See [Manage projects](/docs/manage/projects).

<CTA title="See all database management workflows" description="Create, view, update, and delete databases from the Console, CLI, API, and SQL." buttonText="Manage databases" buttonUrl="/docs/manage/databases" />
