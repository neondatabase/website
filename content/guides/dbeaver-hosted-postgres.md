---
title: Using DBeaver with hosted Postgres
subtitle: A guide on how to manage your Postgres database using DBeaver.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-21T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

DBeaver is a database management tool that works with many databases, including Postgres. This guide shows you how to set up DBeaver, connect it to a Postgres database on Neon, and run common database operations.

## Table of contents

- [Set up DBeaver](#set-up-dbeaver)
- [Provision a Postgres database on Neon](#provision-a-postgres-database-on-neon)
- [Connect to your hosted Postgres database](#connect-to-your-hosted-postgres-database)
- [Basic operations in DBeaver](#basic-operations-in-dbeaver)

## Set up DBeaver

1. **Download and install DBeaver**: If you haven't already, download DBeaver from the [official website](https://dbeaver.io/download/). Choose the version suitable for your operating system and follow the installation instructions.

2. **Launch DBeaver**: Open DBeaver from your applications menu.

## Provision a Postgres database on Neon

1. To get started, go to the [Neon Console](https://console.neon.tech/) and create a new project by entering a project name of your choice.

2. Retrieve connection details for your database:
   - Click the **Connect** button in the Console nav to open the **Connect to your branch** modal.
   - Select your branch, database, and role.
   - Select **Parameters only** to view the connection details.
     ![Neon Connection Details](/docs/connect/connection_details_parameters_only.png)

   You will be provided with the following details:
   - `PGHOST`: The hostname of your database.
   - `PGDATABASE`: The name of your database
   - `PGUSER`: Your database username.
   - `PGPASSWORD`: Your database password.

Save the connection details. You'll need them in the next steps.

## Connect to your hosted Postgres database

1. **Open DBeaver**: Make sure DBeaver is running. You'll see the main dashboard.

2. **Create a new database connection**:
   - Click the "New Database Connection" button (usually a plug icon or from the "Database" menu).
   - In the "Connect to Database" wizard, select "PostgreSQL" from the list of database types and click "Next".

3. **Enter connection details**:

   ![Connection Details in DBeaver](/guides/images/dbeaver/conn-1.png)
   - Fill in the required fields based on your Neon connection string:
     - **Host**: The endpoint of your hosted Postgres database. Enter the value of `PGHOST` you saved earlier from Neon.
     - **Port**: The port number. Enter 5432 (default for Postgres).
     - **Database**: The database name. Enter the value of `PGDATABASE`.
     - **Username**: Your database username. Enter the value of `PGUSER`.
     - **Password**: Your database password. Enter the value of `PGPASSWORD`.
   - Enable "Show all databases" to list all databases in your Neon project.

   ![](/guides/images/dbeaver/conn-2.png)
   - Click "Edit Driver Settings" if needed to enable SSL. Under the "Driver Properties" tab, set `sslmode` to `require`.

4. **Test the connection**:
   - Click the "Test Connection" button to verify the connection details.
   - If successful, click "Finish" to save the connection. Your new database connection will appear in the left sidebar.

<Admonition type="tip">
To prevent Neon's scale-to-zero feature from interrupting an idle connection, configure a keepalive ping in DBeaver. Right-click your connection, select **Edit Connection**, go to **Connection Settings** > **Initialization**, and set **Keep-Alive (seconds)** to `60`. This sends a periodic ping to keep the connection active.
</Admonition>

## Basic operations in DBeaver

### 1. Run SQL queries

- Right-click on your database connection in the left sidebar and select "SQL Editor" > "New SQL Script".
- Enter your SQL queries in the editor and click the "Execute" button (play icon) to run them.
- View the results in the results pane below the editor.

### 2. Manage tables

- Expand your database connection in the left sidebar, then navigate to "Databases" > "neondb" > "Schemas" > "public" > "Tables".
- Right-click on "Tables" to create a new table or manage existing ones (e.g., view, edit, or drop tables).

### 3. Import and export data

- To import data:
  - Right-click on a table and select "Import Data".
  - Choose the source file (e.g., CSV) and follow the prompts to map the columns.
- To export data:
  - Right-click on a table and select "Export Data".
  - Choose the format (e.g., CSV, JSON) and follow the prompts to save the file.

## Conclusion

You've connected DBeaver to a Postgres database on Neon and used it to run queries, manage tables, and move data in and out. For settings for other GUI tools, see [Connect a GUI application](/docs/connect/connect-postgres-gui).

<NeedHelp />
