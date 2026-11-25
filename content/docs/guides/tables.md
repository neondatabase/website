---
title: Managing your data and schemas in the Neon Console
subtitle: 'Use the Tables page to browse, edit, and export data and manage your database schema'
summary: >-
  The Tables page in the Neon Console is a visual editor for Postgres data and
  schemas. Browse databases, schemas, tables, views, and enums; filter, sort,
  edit, insert, duplicate, and delete rows; export loaded rows as JSON, CSV, or
  SQL; and create or alter tables, columns, constraints, indexes, views, enums,
  and RLS policies without writing SQL. Choose this page over the SQL Editor
  when you want point-and-click record editing or schema changes.
enableTableOfContents: true
updatedOn: '2026-11-25T23:16:01.302Z'
---

The **Tables** page in the Neon Console is a visual editor for the data and schema of a branch. You can browse your database objects, filter and sort rows, edit data in place, export what you've loaded, and create or change tables, views, and enums without writing SQL.

To open it, select **Postgres database** > **Tables** in the sidebar. The page opens on the branch you have selected.

![Tables page in the Neon Console](/docs/guides/tables-overview.png)

## Browse database objects

The sidebar lists the databases on your branch. Each database expands into its schemas, and each schema lists its tables, views, and enums. Partitioned tables list their partitions underneath. Drag the sidebar's edge to resize it.

- **Find object…** filters the tree by name.
- The filter icon sets which object types the tree shows: **Tables**, **Views**, **Partitions**, and **Enums**.
- The **+** (**Create**) button adds a database, schema, table, view, or enum. See [Create database objects](#create-database-objects).
- Each database, schema, table, view, and enum has its own actions menu. For example, a database's menu has **Query**, which opens it in the SQL Editor, and a schema's menu has **Rename**, **Schema diff**, and **Delete**.

Tables with row-level security policies show an **RLS** badge.

The page URL includes the schema and table you're viewing. Reloading the page or sharing the link opens the same table.

## View data

Select a table or view to open it. The grid loads rows as you scroll. To reload the rows and the sidebar, click the refresh icon next to the **Tables** heading.

Use the **Data** and **Structure** tabs in the toolbar to switch between the rows and the column definitions. **Structure** lists each column's name, data type, nullability, default, and whether it's part of the primary key. Each table opens on **Data**, and **Show / hide columns** and **Export** are only available there.

### Sort rows

Hover a column header and click its sort icon to sort by that column. Each click moves between ascending, descending, and unsorted. You can sort by one column at a time. Some data types, such as `json`, can't be sorted.

### Filter rows

Hover a column header and click its filter icon to add a filter for that column. The operators you can choose depend on the column's data type. For example, text columns offer **Contains** and **Starts with**, number columns offer **Greater than** and **Between**, and boolean columns offer **Is true** and **Is false**.

![Filtering rows on the Tables page](/docs/guides/tables-filter.png)

- Use **Add OR condition** to match more than one value in the same column. Filters on different columns must all match.
- Active filters appear as chips above the grid. Use a chip to edit, turn off, or remove its filter, or use **Clear all filters** to remove them all.
- To filter by a value you can see, right-click the cell and select **Filter by value**.

Filters run in the database, so they apply to the whole table, not just the rows you've loaded. Each table keeps its filters while you move to other tables and pages, but reloading the page clears them.

### Show, hide, and resize columns

- **Show / hide columns** in the toolbar sets which columns appear in the grid. Hiding a column doesn't change your data.
- Drag the edge of a column header to resize it. Double-click the edge to fit the column to its contents.
- Hover a column header and click the copy icon to copy the column name.

The editor remembers your column widths and hidden columns for each table in this browser.

### Reorder columns with a view

Dragging a column header to a new position creates a Postgres view named `<table>_ordered_1` with your columns in the new order, then opens it. The table itself doesn't change. If you're already viewing the view, reordering updates that view instead of creating another. The view is a real object in your database, so delete it from the sidebar if you don't need it.

## Edit data

To edit or delete existing rows, the table needs a primary key. You can add rows to any table. Views are read-only, and you can't edit generated columns, identity columns defined as `GENERATED ALWAYS`, or `json` and `bytea` columns. Editing cells isn't available on partitioned tables.

### Edit cells

1. Double-click a cell, or select it and press `Enter` or `F2`.
2. Type the new value. For nullable columns, select the **NULL** checkbox to set the value to `NULL`.
3. Press `Enter`, or move to another cell, to stage the change. Staged cells are highlighted, and the toolbar shows how many cells you've changed.
4. Click **Submit** to save your changes, or **Cancel** to discard them.

Each staged cell is saved separately, so if one fails, the rest can still be saved. A cell fails with a conflict if someone else changed its value after you loaded it. The cells that didn't save stay staged so you can fix and resubmit them.

`jsonb` cells open in a code editor instead. Edit the JSON, then press `Cmd/Ctrl + Enter` or click outside the editor to stage it, or press `Escape` to cancel. Nullable columns also have a **Set NULL** button. If the JSON isn't valid, the editor stays open and shows the error.

### Add rows

1. Select **Insert** > **Row** in the toolbar. A draft row appears at the top of the grid.
2. Fill in the fields. For each field, you can use the column default, set `NULL`, or enter a value.
3. Click **Insert another** (or press `Enter`) to add more draft rows.
4. Click **Submit changes** (or press `Cmd/Ctrl + Enter`) to insert the rows, or **Cancel** to discard them.

All draft rows are inserted in a single statement. If the database rejects one, none are inserted, and your drafts stay open so you can fix them.

### Select, copy, duplicate, and delete rows

Click a row to select it. `Cmd/Ctrl`-click adds or removes single rows, `Shift`-click selects a range, and you can drag across rows to select them. Press `Escape` to clear the selection.

Right-click a row to open the row menu. If the row isn't already selected, right-clicking selects it first.

- **Copy rows as…** copies the selected rows as JSON or CSV, using the columns that are visible.
- **Copy cell** (or **Copy cells**, when you've selected a range of cells) copies the cell values.
- **Filter by value** filters the column by the cell you clicked.
- **Duplicate rows** (for example, **Duplicate 3 rows**) opens draft copies of the selected rows for you to edit and submit.
- **Delete rows** deletes the selected rows after you confirm.

![Row menu on the Tables page](/docs/guides/tables-row-menu.png)

You can only delete rows from tables that have a primary key. If some rows can't be deleted, for example because a trigger or a row-level security policy protects them, a message reports how many rows were deleted, and the rest stay selected.

## Export data

Click the **Export** icon in the toolbar, choose **JSON**, **CSV**, or **SQL**, and click **Download**. SQL exports are `INSERT` statements, and they can't include generated or other non-writable columns. Hide those columns first, or export as JSON or CSV.

An export includes the rows you've loaded and the columns that are visible, in the current filter and sort order. Rows you haven't scrolled to and unsaved edits aren't included, so an export isn't a full-table backup. Exports are limited to 10,000 rows, 1,000 columns, and 16 MiB per file.

To back up a whole table or database, use `pg_dump`. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Manage your schema

Schema changes on the **Tables** page run SQL on your branch. Most dialogs show a **SQL preview** of the statements before you apply them.

### Create database objects

Click the **+** (**Create**) button in the sidebar, then choose what to create:

- **Database**: creates a database on the branch. See [Manage databases](/docs/manage/databases).
- **Schema**: creates a schema in the selected database.
- **Table**: opens a draft table in the grid. Set the **Name**, **Schema**, and **Primary key**, add columns, and optionally add constraints, indexes, and RLS policies from **Manage**. Click **Create table** to create it.
- **View**: creates a view from columns you pick in an existing table.
- **Enum**: creates an enum type with the values you list.

### Change a table

With a table open, use the toolbar and the column headers:

- **Table settings** (the gear icon) renames the table or moves it to another schema.
- **Insert** > **Column** adds a column. Choose its name and data type, and whether it's **Not null**, **Primary key**, or **Unique**.
- Each column header's menu has **Rename column**, **Change data type**, **Manage constraints**, and **Delete**. **Manage constraints** sets **Not null**, **Primary key**, and **Unique**. Some data types also offer **Auto increment**, or a **Default value** chosen from a list. Changing a column's data type converts its existing values and clears the column's default.
- **Manage** > **Constraints** adds check and foreign key constraints, including multi-column keys.
- **Manage** > **Indexes** adds indexes. Indexes use B-tree by default, and only B-tree indexes can be unique.

### Add RLS policies

Click **Add RLS policy** in the toolbar to define row-level security policies for the table. Start from a template, such as **Enable users to view their own data only**, or write your own `USING` and `WITH CHECK` expressions. Set the command, whether the policy is permissive or restrictive, and the roles it applies to.

Templates that match rows to the current user use the `auth.user_id()` function, which is available after you enable the Data API on the branch. See [Data API access control](/docs/data-api/access-control).

If row-level security isn't enabled on the table yet, adding a policy enables it.

To learn how RLS policies work with Neon, see [Row-Level Security with Neon](/docs/guides/row-level-security). The **Tables** page doesn't create Postgres roles. To create them, see [Manage roles](/docs/manage/roles).

### Truncate or delete tables, views, and enums

Open an object's actions menu in the sidebar:

- **Tables**: **Truncate** removes every row. To also truncate tables that reference it with foreign keys, select **Also truncate tables that reference this table with foreign keys**. **Delete** drops the table.
- **Views**: **Alter** renames the view or changes its columns, and **Delete** drops it. You can also click **Alter view** in the toolbar.
- **Enums**: **Edit** opens the enum in the [SQL Editor](/docs/get-started/query-with-neon-sql-editor). If the SQL Editor already has a draft, you're asked to confirm before it's replaced. **Delete** drops the enum.

Deleting a table or view doesn't cascade to objects that depend on it. If the database reports a dependency, remove the dependent objects first.

To delete a schema, select **Delete** from its actions menu. By default, the schema must be empty. To drop everything in it as well, select **Also delete all objects in this schema, such as tables, views, and functions, and any objects in other schemas that depend on them**.

### Compare schemas with the parent branch

On a child branch, select **Schema diff** from a schema's actions menu to compare it with the parent branch. See [Schema diff](/docs/guides/schema-diff).

## Troubleshooting

When the **Tables** page can't load a table or the object list, it shows the error in place with a **Retry** button. Errors from Postgres include the database's own message, plus its detail and hint when it sends them.

If the page reports that it can't reach your database, the cause is often a suspended compute that's starting up, a browser extension blocking the request, or an IP Allow list that doesn't include your address. See [Tables page connection errors](/docs/connect/connection-errors#tables-page-cant-reach-the-database) for these and other causes.

If the issue continues and you're on a paid plan, [open a support ticket](https://console.neon.tech/app/projects?modal=support). Describe what you were doing when the error occurred, and include screenshots if you can. If you're on the Free plan, report the issue on [Discord](https://neon.com/discord).
