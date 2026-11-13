---
title: Reduce your storage
subtitle: Free up Postgres storage on Neon, including when you've hit the Free plan limit
summary: >-
  How to reduce Postgres storage on Neon. Lists which SQL and branch operations
  increase or decrease your data size, which operations still work when a Free
  plan branch reaches its 1 GB limit, and how to recover from the "could not
  extend file because project size limit has been exceeded" error. TRUNCATE,
  DROP TABLE, DROP INDEX, and VACUUM FULL free space immediately. DELETE alone
  doesn't.
enableTableOfContents: true
---

Your data size is the logical size of all the databases on a branch: tables, indexes, TOAST data, and the dead rows that updates and deletes leave behind. On the Free plan, writes fail once a branch reaches 1 GB. On paid plans there's no limit, but you pay for the storage you use, so the same techniques lower your bill.

This page explains what increases and decreases your data size, and how to free space when you're already at the limit.

## Check your data size

To see the data size of a branch, check the **Storage** column on the **Branches** page in the Neon Console, or run this query on the branch:

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

The total includes every database on the branch, not just the one you're connected to. The `postgres`, `template0`, and `template1` databases take up about 8 MB each.

To find the tables that take up the most space in the current database:

```sql
SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
       n_live_tup AS live_rows,
       n_dead_tup AS dead_rows
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

`total_size` includes the table's indexes and TOAST data. A high `dead_rows` count means the table has space you can reclaim with `VACUUM` or `VACUUM FULL`.

### Branch data size vs. the project storage figure

The 1 GB Free plan limit applies to each branch's data size. The project storage figure in the Console and in storage limit emails is a different number: your root branch's data size plus the data written on each child branch since it was created. It also includes branches you deleted during the current billing period, until the period ends.

Because of this, the Console can show a project over 1 GB, or warn that you've reached your limit, while every branch is under 1 GB and still accepts writes. You might also get a "You're out of storage" email. Connections and queries keep working, and writes only fail when the branch you're writing to reaches 1 GB. To check whether you're blocked, check the data size of the branch you're writing to.

## When a Free plan branch reaches the limit

When a branch on the Free plan reaches 1 GB, statements that need to allocate more space fail with this error:

```text
ERROR:  could not extend file because project size limit (1024 MB) has been exceeded
HINT:  This limit is defined externally by the project size limit, and internally by neon.max_cluster_size GUC
```

You can still connect, run queries, and run statements that remove data. This table shows what works at the limit:

| Operation                                   | Works at the limit? | Notes                                                                                       |
| ------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `SELECT`                                    | Yes                 |                                                                                             |
| `INSERT`, `UPDATE`                          | No                  | Even an `UPDATE` of a few rows can fail, because Postgres writes a new version of each row. |
| `CREATE INDEX`, `CREATE DATABASE`           | No                  |                                                                                             |
| `CREATE TABLE`                              | Sometimes           | Can fail because it adds rows to the system catalogs.                                       |
| `DELETE`                                    | Yes                 | Doesn't free space on its own. Run `VACUUM` or `VACUUM FULL` afterward.                     |
| `TRUNCATE`                                  | Yes                 | Frees the table's space immediately.                                                        |
| `DROP TABLE`, `DROP INDEX`, `DROP DATABASE` | Yes                 | Frees the space immediately.                                                                |
| `VACUUM`                                    | Yes                 | Makes space from deleted rows reusable.                                                     |
| `VACUUM FULL`                               | Yes                 | Rewrites the table without dead rows and returns the space.                                 |
| Reset a child branch from its parent        | Yes                 | The child's data size goes back to the parent's.                                            |
| Delete a branch                             | Yes                 |                                                                                             |

The limit check uses a size measurement that refreshes periodically, so a branch can go a little over 1 GB before writes start to fail. Once you free space, writes work again right away. You don't need to restart your compute.

## Free up space

Pick the approach that fits your data. Steps 1 and 2 free the most space with the least effort.

<Steps>

## Remove whole tables or indexes you don't need

If a table holds test data, logs, or anything else you can throw away, empty it or drop it. Both free the space immediately and write very little to your history.

```sql
TRUNCATE TABLE old_events;   -- keeps the table, removes all rows
DROP TABLE old_events;       -- removes the table
```

Unused indexes can be large too. Dropping one frees its space right away:

```sql
DROP INDEX idx_events_payload;
```

To list indexes that haven't been scanned since statistics were last reset, largest first:

```sql
SELECT relname AS table_name,
       indexrelname AS index_name,
       pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

Neon resets these statistics when your compute [scales to zero](/docs/introduction/scale-to-zero), so an index can show zero scans even if your app uses it. Check your queries before you drop an index, and don't drop indexes that back a primary key or unique constraint unless you mean to remove the constraint.

## Delete rows, then vacuum

If you need to keep some rows, `DELETE` the ones you don't need. `DELETE` works at the limit, but on its own it doesn't reduce your data size. Postgres only marks the deleted rows as dead.

```sql
DELETE FROM events WHERE created_at < now() - interval '90 days';
```

Then run `VACUUM` to make that space reusable. Run it as a separate statement, because `VACUUM` can't run inside a transaction block:

```sql
VACUUM events;
```

After `VACUUM`, new rows in that table fill the freed space instead of growing the table. `VACUUM` only shrinks the table file when the freed space is at the end of the table, so your data size may not drop much.

To return the space and shrink the table, run `VACUUM FULL`:

```sql
VACUUM FULL events;
```

`VACUUM FULL` rewrites the table and its indexes into new files without the dead rows, so the data size drops once it finishes. It works on a Free plan branch that's at the limit. While it runs, it locks the table against reads and writes, so run it when your app can tolerate that.

## Clean up branches

Each branch has its own data size, and writes fail when the branch you're writing to reaches the limit. If a child branch is full:

- [Reset it from its parent](/docs/manage/branches#reset-a-branch-from-parent) to discard its changes and return it to the parent's data size.
- [Delete it](/docs/manage/branches#delete-a-branch) if you no longer need it.

Both work while the branch is at the limit. A deleted branch still counts toward the [project storage figure](#branch-data-size-vs-the-project-storage-figure) in the Console until the current billing period ends.

## Upgrade if you need more space

If your data is bigger than 1 GB, [upgrade to a paid plan](/docs/introduction/manage-billing#change-your-plan). Storage is unlimited on Launch and Scale, and you pay only for what you use.

</Steps>

## What increases and decreases your data size

| Action                                                                     | Effect on data size                                                                                               |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `INSERT`, `COPY`, `CREATE TABLE AS`                                        | Increases it.                                                                                                     |
| `UPDATE`                                                                   | Increases it. Each update writes a new row version and leaves the old one as a dead row until vacuum.             |
| `CREATE INDEX`                                                             | Increases it by the size of the index.                                                                            |
| `DELETE`                                                                   | No immediate change. The rows become dead rows.                                                                   |
| `VACUUM`                                                                   | Usually no change. Dead row space becomes reusable. Space at the end of a table is returned.                      |
| `VACUUM FULL`                                                              | Decreases it by the amount of dead row space in the table.                                                        |
| `TRUNCATE`                                                                 | Decreases it by the size of the table and its indexes.                                                            |
| `DROP TABLE`, `DROP INDEX`, `DROP DATABASE`                                | Decreases it by the size of the object.                                                                           |
| Create a branch                                                            | The new branch starts at its parent's data size. It doesn't add to the parent's data size.                        |
| Reset a child branch from its parent                                       | The child's data size returns to the parent's.                                                                    |
| Delete a branch                                                            | Removes that branch's data. The project storage figure in the Console doesn't drop until the billing period ends. |
| Shorten the [history window](/docs/postgres/backup-restore/history-window) | No change. History is tracked separately from data size.                                                          |

## Storage costs on paid plans

On Launch and Scale, the same actions lower your bill, but billing has more parts than data size alone:

- **Root branches** are billed on data size.
- **Child branches** are billed on the smaller of the changes made on the branch or its data size. Deleting or resetting child branches you don't need lowers this charge.
- **Instant restore history** is billed separately. Every write, including `DELETE`, `UPDATE`, and `VACUUM FULL`, adds history on root branches until it ages out of your history window. For bulk removal, `TRUNCATE` and `DROP` write much less history than `DELETE`. A shorter history window reduces this charge.

See [Cost optimization](/docs/introduction/cost-optimization) for more ways to lower your bill, and [Plans](/docs/introduction/plans#storage) for storage pricing.

<NeedHelp/>
