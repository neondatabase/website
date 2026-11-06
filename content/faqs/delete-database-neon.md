---
title: 'How do I delete a database in Neon?'
subtitle: 'Use the Console, CLI, API, or SQL. Connect to a different database first if you go the SQL route.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'What tools are used to debug production database issues safely?'
  slug: debug-production-database-issues-safely
nextLink:
  title: 'How do I create and download a backup of my Neon database to my local machine?'
  slug: download-database-backup-locally
---

Open your project in the [Neon Console](https://console.neon.tech), select the branch, go to **Databases**, and click the delete icon on the database row. You can also delete a database with the Neon CLI, the API, or SQL (`DROP DATABASE`). Deletion is permanent, and every schema, table, index, and other object in the database goes with it. See [Delete a database](/docs/manage/databases#delete-a-database) for the full reference.

## Delete a database

<Tabs labels={["Console", "CLI", "API", "SQL"]}>

<TabItem>

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. In the sidebar, select the branch that contains the database from the **BRANCH** selector.
3. Under **Postgres database**, select **Databases**.
4. For the database you want to delete, click the delete icon.
5. In the confirmation dialog, click **Delete**.

</TabItem>

<TabItem>

```bash
neon databases delete <database_name> --branch <branch_id_or_name>
```

If you omit `--branch`, the command targets the project's default branch. See [Neon CLI command: databases](/docs/cli/databases#delete).

</TabItem>

<TabItem>

```bash shouldWrap
curl -X DELETE \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/databases/$DATABASE_NAME" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

See the API tab under [Delete a database](/docs/manage/databases#delete-a-database).

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

Dropping a database removes every SQL object inside it (schemas, tables, indexes, views, materialized views, functions, sequences) and all of its data. Postgres roles aren't dropped with it, because roles belong to the branch and can own objects in other databases. The dropped data no longer counts toward your branch's current data size, but the change history that records it stays in your [history window](/docs/postgres/backup-restore/history-window) until it ages out.

The branch, compute, and any other databases on the branch aren't affected.

<Admonition type="warning" title="Deletion is permanent">
There's no undo on `DROP DATABASE`. If your project's [history window](/docs/postgres/backup-restore/history-window) still covers the moment before the drop, you can recover with [instant restore](/docs/postgres/backup-restore/branch-restore) on the root branch. Instant restore rolls every database on that branch back to the point you choose. Once the drop falls outside the history window (up to 6 hours on the Free plan, 7 days on the Launch plan, or 30 days on the Scale plan), the only way to recover is from your own backups.
</Admonition>

## Delete the whole project instead

To remove everything (the project with all of its computes, branches, databases, and roles), open the project, select **Settings**, and select **Delete**. You can [recover a deleted project](/docs/manage/projects#recover-a-deleted-project) within 7 days with the CLI or API. After that, deletion is permanent. On a paid plan, deleting projects doesn't stop the monthly plan billing; you also need to downgrade to the Free plan. See [Delete a project](/docs/manage/projects#delete-a-project).

<CTA title="See all database management workflows" description="Create, view, update, and delete databases from the Console, CLI, API, and SQL." buttonText="Manage databases" buttonUrl="/docs/manage/databases" />
