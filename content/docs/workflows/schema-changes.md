---
title: Manage schema changes
enableTableOfContents: true
subtitle: Learn how to manage schema changes between Neon database branches
---

This topic describes how to use a schema management application to manage schema changes between Neon database branches in scenarios where you alter a database schema on a development branch of your database and want to apply those changes back to your production database.

This example uses the [dbForge Schema Compare](https://www.devart.com/dbforge/postgresql/schemacompare/) application from Devart. dbForge Schema Compare is a tool for easy and effective comparison and synchronization of PostgreSQL database structure differences. It helps compare database schemas, gives comprehensive information on all differences, and generates clear and accurate SQL synchronization scripts to deploy database changes.

The are various schema management application alternatives, including open source options that you can also use to manage schema changes. Here are a few examples:

- Example A
- Exmaple B
- Example C

The following instructions will take you step-by-step through creating creating a schema on the primary branch of your Neon project, creating a development branching, altering the schema on the development branch, performing a schema comparison, and finally applying those changes back to your development branch.

## Prerequisites

- A Neon project. If you do not have one, see [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- You have installed [dbForge Schema Compare](https://www.devart.com/dbforge/postgresql/schemacompare/).

## Create a database schema

In this step, you will create a database schema on the primary branch of your Neon project. This branch will be considered your production branch. The schema is created in the default `neondb` database that is created with each Neon project.

1. Navigate to the [Neon console](https://console.neon.tech/).
2. Select your project.
3. Select **SQL Editor**.
4. Select the primary branch and the `neondb` database.
5. Enter a query into the editor and click **Run** to view the results.

![Neon SQL Editor](/docs/get-started-with-neon/sql_editor.png)

Create the following example schema:

```sql
CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 3) s(i);
SELECT * FROM playing_with_neon;
```

## Create a development branch

In this step you will create a development branch, which is a copy-on-write clone of the parent branch. It will include the databases and roles of the parent branch.

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch. For example, `main_dev`.
5. Select the primary branch (`main`) as the parent branch.
6. Accept the default setting for the other options. **Head** creates a branch with data up to to current point in time, and a compute endpoint is required to connect to the branch.
8. Click **Create Branch** to create the `main_dev` branch.

## Alter the schema on the development branch

In this step, you will alter your database schema on the development branch, modifying a column type and adding a new column.

1. Navigate to the [Neon console](https://console.neon.tech/).
2. Select your project.
3. Select **SQL Editor**.
4. Select the `main_dev` branch and the `neondb` database.
5. Run the following queries into the SQL Editor to change the `name` column type to from `TEXT` to `VARCHAR` and add an `email` column to the `playing_with_neon` table.

```sql
ALTER TABLE playing_with_neon
ALTER COLUMN name TYPE VARCHAR(255);

ALTER TABLE playing_with_neon
ADD COLUMN email VARCHAR(255);
```

Your development branch schema now differs from your production branch schema.  

## Retrieve the connection details for your primary and development branches

In this step you will retrieve the connection details for your production branch and development branch. You will need this information to perform a schema comparison using the the dbForge Schema Compare tool.

1. Navigate to the Neon Dashboard.
2. In the **Connection Details** widget, select the `main` branch, the role, and the `neondb` database. Copy the connection string.
![Connection details widget](/docs/guides/connection_details.png)
3. Do the same for your development database. In the **Connection Details** widget, select the `main_dev` branch, the role, and the `neondb` database. Copy the connection string.

Your connection strings will appear similar to the following:

```text
postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech/neondb

postgres://daniel:<password>@ep-aged-silence-344434.us-east-2.aws.neon.tech/neondb
```

Since the databases are owned by the same user, only the hostname differs.

## Configure database connections in dbForge

1. Open the dbForge Schema Compare tool.
2. Select **Database** > **New Connection** to create a connection for your production branch. Using the connection details you retrieved previously, enter the details in the **Database Connection Properties** dialog, as shown:
![dbForge connection main](/docs/guides/dbforge_connection_main.png).
3. Select **Security** tab and select **Use SSL protocol**.
4. Click **Connect**.
5. Now, perform the same steps to create a connection for your `main_dev` branch, and don't forget to select **Security** tab and select **Use SSL protocol**.

After you have established connections to both databases, you can now perform a schema comparison.

## Perform a schema comparison

1. Open the dbForge Schema Compare tool.
2. Select **New Schema Comparison**.
3. On the **New Schema Comparison**, specify a **Source** and **Target**.
    1. For the **Source**, choose your `main-dev` connection and select the `neondb` database. Your development branch is the source of the schema changes.
    1. For the **Target**, choose your `main` connection and select the `neondb` database. Your production branch database is defined as the target, since you will want to apply the schema changes back to your production database when your development work is completed.
4. Click **Compare**. The comparison is performed. The schema changes are shown and you are presented with a Schema Update Script.

## Apply schema change back to you production branch

Optionally, you can apply schema update script to your production database to bring the databases.

1. In the dbForge Schema Compare tool, select **Comparison** > **Synchronize**.
1. Select **Execute the script directly gainst the target database**, and check the **Refresh comparison after successful synchronization** option.
1. Click **Synchronize**.

The changes to the `main_dev` schema are applied to the '`main` schema, and the dbForge Schema Compare tool should now indicate the the two objects are identical.

## Verify the changes in Neon

To verify the changes in Neon:

1. Navigate to the Neon Console.
1. Select **SQL Editor** from the sidebar.
1. Select the `main` branch and the `neondb` database.
1. Run the following query to verify the changes:

```sql
select table_name, column_name, data_type from information_schema.columns where table_name = 'playing_with_neon'
```

## Conclusion