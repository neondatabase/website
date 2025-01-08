---
title: Managing your data and schemas in the Neon Console
subtitle: 'Use the Tables page to easily view, edit, and manage your data and schemas'
enableTableOfContents: true
updatedOn: '2024-10-07T15:22:34.955Z'
---

The **Tables** page in the Neon Console offers a dynamic, visual interface for managing data and schemas. Fully interactive, this view lets you add, update, and delete records, filter data, modify columns, drop or truncate tables, export data in both .json and .csv formats, and manage schemas, tables, views, and enums.

<Admonition type="note">
The **Tables** page is powered by Drizzle Studio. For new features and updates, please refer to the [Neon Drizzle Studio Changelog](https://github.com/neondatabase/neon-drizzle-studio-changelog/blob/main/CHANGELOG.md).
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

## Limitations

The Drizzle Studio integration that powers the **Tables** page currently does not support partitioned tables. Partitioned tables are not displayed on the **Tables** page.
