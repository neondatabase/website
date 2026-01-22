---
title: Using DbVisualizer with Neon Postgres
subtitle: A comprehensive guide on how to manage your Postgres database using DbVisualizer.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-09-26T00:00:00.000Z'
updatedOn: '2025-09-26T00:00:00.000Z'
---

DbVisualizer is a universal SQL client and database‑management tool that provides an intuitive interface for connecting to, querying, visualizing, and managing data across more than 50 databases including PostgreSQL, Oracle, SQL Server, MySQL, and others. This guide walks you through setting up and using DbVisualizer with Neon Postgres.

## Table of Contents

- [Setting up DbVisualizer](#setting-up-dbvisualizer)
- [Connecting DbVisualizer to Neon Postgres](#connect-dbvisualizer-to-neon-postgres)
- [Basic operations in DbVisualizer](#basic-operations-in-dbvisualizer)

## Setting up DbVisualizer

1. **Download and Install DbVisualizer**: If you haven't already, download DbVisualizer from the [official website](https://www.dbvis.com/download/). Choose the version suitable for your operating system and follow the installation instructions.

2. **Launch DbVisualizer**: Open DbVisualizer from your applications menu and ensure it is running.

## Create a Neon Postgres Database

1. If you haven't already, create a new Neon project. You can use the [Neon Console](https://console.neon.tech/) or [pg.new](https://pg.new/).

2. Retrieve connection details for your Neon Postgres database:
   - Navigate to the **Dashboard** of your Neon project.
   - Click on the **Connect** button which opens a modal.
   - Select your database and branch.
   - Select **Parameters only** to view the connection details.
     ![Neon Connection Details](/docs/connect/connection_details_parameters_only.png)

   You will be provided with the following details:
   - `PGHOST`: The hostname of your Neon Postgres database.
   - `PGDATABASE`: The name of your database
   - `PGUSER`: Your database username.
   - `PGPASSWORD`: Your database password.

Save the connection details as you will need them in the next steps.

## Connect DbVisualizer to Neon Postgres

1. **Open DbVisualizer**: Open DbVisualizer and finish the setup if you haven't done so already.

2. **Create a New Database Connection**:
   - Click on the "+" icon in the top left corner to create a new database connection.
   - Search for "PostgreSQL" in the database type selection and select it.
     ![Select PostgreSQL in DbVisualizer](/docs/guides/select-postgresql-dbvisualizer.png)

3. **Enter Connection Details**:

   ![Enter Connection Details in DbVisualizer](/docs/guides/dbvisualizer-connection-details.png)

   Fill in the required fields based on your Neon connection string:
   - **Database Server**: The endpoint of your hosted Postgres database. Enter the value of `PGHOST` you saved earlier from Neon.
   - **Database Port**: The port number. Enter 5432 (default for Postgres).
   - **Database**: The database name. Enter the value of `PGDATABASE`.
   - **Database Userid**: Your database username. Enter the value of `PGUSER`.
   - **Database Password**: Your database password. Enter the value of `PGPASSWORD`.

4. **Test the Connection**:
   - Click the "Test Connection" button to verify the connection details.
     ![Test Connection in DbVisualizer](/docs/guides/dbvisualizer-test-connection.png)
   - Close the Test Connection dialog if the connection is successful and click **Connect** to establish the connection.

The sidebar will now display your connected Neon Postgres database. You can expand the database to view its schemas, tables, views, and other objects.

![Connected Neon Postgres Database in DbVisualizer](/docs/guides/dbvisualizer-connected-database.png)

## Basic Operations in DbVisualizer

### 1. Running SQL Queries

- **Open a new SQL Commander tab**  
  Click the **“+”** icon in the upper‑left corner, or press **⌘ + T** (Mac) / **Ctrl + T** (Windows / Linux).

- **Select the target database and schema**  
  Choose the desired **Database** and **Schema** from the dropdown menus at the top of the tab to ensure you’re querying the correct environment.

- **Write and run your query**  
  Type your SQL in the editor and hit the **Execute** button (▶️).

- **View results**  
  The query output appears in the results pane beneath the editor.

  ![Running SQL Queries in DbVisualizer](/docs/guides/dbvisualizer-sql-commander.png)

- **Save a query**  
  Click the **Save** icon (💾), give the query a name, and confirm by clicking **Save**.

- **Open a saved query**  
  Go to **Files → Bookmarks**, then select the query you want to load.

### 2. Managing Tables and Database

- Expand your database connection in the left sidebar, then navigate to "Databases" > "neondb" > "Schemas" > "public" > "Tables".
- Right-click on "Tables" to create a new table or manage existing ones (e.g., view, edit, or drop tables).
- Similarly, you can manage other database objects like databases, schemas, views, and procedures by right-clicking on them in the sidebar.

### 3. Importing and Exporting Data

- To import data:
  - Right-click on a table and select "Import Data".
  - Choose the source file (e.g., CSV) and follow the prompts to map the columns.
- To export data:
  - Right-click on a table and select "Export Data".
  - Choose the format (e.g., CSV, JSON) and follow the prompts to save the file.

## Conclusion

You have successfully connected DbVisualizer to your Neon Postgres database and learned how to perform basic operations such as running SQL queries, managing tables, and importing/exporting data. DbVisualizer's user-friendly interface makes it easy to interact with your database, whether you're a beginner or an experienced user.

Furthermore, DbVisualizer offers a rich, tab-based user interface that is highly customizable. The Pro version enhances this experience with advanced features like [Git integration](https://www.dbvis.com/docs/ug/working-with-git/) for version controlling your scripts and powerful [charting tools](https://www.dbvis.com/docs/ug/working-with-charts/) to visualize your data directly from query result sets. You can explore the official documentation for more advanced functionalities and tips to maximize your productivity with DbVisualizer. Check the resources section below for useful links.

## Resources

- [DbVisualizer Official Documentation](https://www.dbvis.com/docs/ug/)
- [Getting the Most Out of DbVisualizer GUI](https://www.dbvis.com/docs/25.2/getting-the-most-out-of-the-gui/)
- [Working with Tables in DbVisualizer](https://www.dbvis.com/docs/25.2/working-with-tables/)

<NeedHelp />
