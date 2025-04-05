---
title: Managing your data and schemas in the Neon Console
subtitle: 'Use the Tables page to easily view, edit, and manage your data and schemas'
enableTableOfContents: true
updatedOn: '2025-02-21T20:49:03.647Z'
---

The **Tables** page in the Neon Console offers a dynamic, visual interface for managing data and schemas. Fully interactive, this view lets you add, update, and delete records, filter data, modify columns, drop or truncate tables, export data in both .json and .csv formats, and manage schemas, tables, views, and enums.

<Admonition type="note">
The **Tables** page is powered by a Drizzle Studio integration. For tracking updates, see [Tables page enhancements and updates](#tables-page-enhancements-and-updates).
</Admonition>

## Edit records

Edit individual entries directly within the table interface. Click on a cell to modify its contents. You don't have to press `Enter` (though you can). Just move your cursor to the next cell you want to modify. Click `Save x changes` when you're done.

![edit table records](/docs/manage/edit_record_drizzle.png)

## Add records

Add new records to your tables using the **Add record** button.

![add record to table](/docs/manage/add_record_drizzle.png)

A couple of things to note:

- You need to hit `Enter` for your input to register. When editing existing fields, you don't have to do this. But for new fields, if you tab to the next cell, you'll lose your input.
- You can leave `DEFAULT` fields untouched and the cell will inherit the right value based on your schema definition. For example, defaults for boolean fields are automatically applied when you click `Save changes`.

## Toggle columns

You can simplify your view by hiding (or showing) individual columns in the table. You're not modifying content here; deselect a checked column to hide it, and re-select the column to show it again. Your selections are saved as a persistent filter.

![toggle columns in table view](/docs/manage/toggle_columns_drizzle.gif)

## Add filters

Filters let you store simplified views of your data that you can come back to later. You can use dropdown-filtering to select columns, conditions, and input text for the filter.

![add filter to table view](/docs/manage/filter_drizzle.gif)

Each new filter is added as a **View** under your list of Tables.

![view filter views under tables](/docs/manage/view_filters_drizzle.gif)

## Delete records

Use the checkboxes to mark any unwanted records for deletion, or use the select-all checkbox for bulk deletion. Click `Delete x records` to complete the process.

![delete record from table](/docs/manage/delete_record_drizzle.png)

## Export data

You can also use the checkboxes to mark records for export. Select the records you want to include in your export, then choose `Export selected...` from the export dropdown.

Or just choose `Export all..` to download the entire contents of the table.

You can export to either JSON or CSV.

![export data from table](/docs/manage/export_drizzle.png)

## Manage schemas

In addition to managing data, you can manage your database schema directly from the **Tables** page. Schema management options include:

- Creating, altering, and dropping schemas
- Creating and altering tables
- Creating and altering views
- Creating enums
- Refreshing the database schema

![Drizzle Studio Schema Management UI](/docs/relnotes/drizzle_schema_mgmt.png)

## Tables page updates

The **Tables** page in the Neon Console is powered by a Drizzle Studio integration. You can check the Drizzle Studio integration version in your browser by inspecting the Tables page. For example, in Chrome, right-click, select **Inspect**, and go to the **Console** tab to view the current `Tables version`. You can cross-reference this version with the [Neon Drizzle Studio Integration Changelog](https://github.com/neondatabase/neon-drizzle-studio-changelog/blob/main/CHANGELOG.md) to track updates.

## Reporting errors

If you see an **Unexpected error happened** message on the **Tables** page, follow the steps below:

![Unexpected error happened on Tables page](/docs/guides/tables_error.png)

1. Click **Download Error Context** to download the error context file.
2. [Open a support ticket](https://console.neon.tech/app/projects?modal=support) and provide a details description of what were doing when the error occurred. Please include any screen captures or files that will help us reproduce the issue. We'll work with our partners at Drizzle to investigate and resolve the issue.
3. If you're on the Free Plan, you can report the issue on [Discord](https://discord.gg/92vNTzKDGp).

If you encounter a **"Something went wrong"** error on the **Tables** page, try the following troubleshooting steps:

- **Refresh the page** — This can resolve temporary glitches.
- **Clear browser cache** — Cached files might cause issues, so clearing the cache could help.
- **Disable browser extensions** — Extensions may interfere with the page’s functionality.
- **Use a different browser or device** — Check if the issue occurs on another browser or device.
- **Try incognito mode** — Using an incognito window can help bypass issues related to cookies or extensions.
- **Use a VPN connection** — In some regions, Asia Pacific regions in particular, using the Neon Console over a VPN connection has resolved the issue.

If the issue persists, please reach out to [Neon support](https://console.neon.tech/app/projects?modal=support) or on [Discord](https://discord.gg/92vNTzKDGp), and we’ll investigate further.
