---
title: Using DBeaver with a Hosted Postgres
subtitle: A comprehensive guide on how to manage your Postgres database using DBeaver.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-21T00:00:00.000Z'
updatedOn: '2024-12-21T00:00:00.000Z'
---

DBeaver is a versatile database management tool that allows you to interact with a wide range of databases, including PostgreSQL. This guide will walk you through the steps to set up and use DBeaver with a hosted Postgres database, enabling you to perform various database operations efficiently.

## Table of Contents

- [Setting Up DBeaver](#setting-up-dbeaver)
- [Connecting to Your Hosted Postgres Database](#connecting-to-your-hosted-postgres-database)
- [Basic Operations in DBeaver](#basic-operations-in-dbeaver)

## Setting Up DBeaver

1. **Download and Install DBeaver**: If you haven't already, download DBeaver from the [official website](https://dbeaver.io/download/). Choose the version suitable for your operating system and follow the installation instructions.

2. **Launch DBeaver**: Open DBeaver from your applications menu and ensure it is running.

## Provisioning a Serverless Postgres

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project by entering a project name of your choice.

![](/guides/images/pg-notify/index.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host with neon.tech as the [TLD](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.
- `?sslmode=require` is an optional query parameter that enforces the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode while connecting to the Postgres instance for better security.

You will be using these connection string components in the following steps to connect DBeaver to your Postgres database.

## Connecting to Your Hosted Postgres Database

1. **Open DBeaver**: Ensure DBeaver is running. You will see the main dashboard.

2. **Create a New Database Connection**:

   - Click on the "New Database Connection" button (usually a plug icon or from the "Database" menu).
   - In the "Connect to Database" wizard, select "PostgreSQL" from the list of database types and click "Next".

3. **Enter Connection Details**:
   
   ![](/guides/images/dbeaver/conn-1.png)

   - Fill in the required fields based on your Neon connection string:
     - **Host**: The endpoint of your hosted Postgres database (e.g., `ep-...us-east-2.aws.neon.tech`).
     - **Port**: The port number (default is `5432`).
     - **Database**: The database name (e.g., `neondb`).
     - **Username**: Your database username.
     - **Password**: Your database password.
   - Enable "Show all databases" to ensure all databases in your Neon project are listed.
   
   ![](/guides/images/dbeaver/conn-2.png)
   
   - Click "Edit Driver Settings" if needed to ensure SSL is enabled. Under the "Driver Properties" tab, set `sslmode` to `require`.

4. **Test the Connection**:

   - Click the "Test Connection" button to verify the connection details.
   - If successful, click "Finish" to save the connection. Your new database connection will appear in the left sidebar.


## Basic Operations in DBeaver

### 1. Running SQL Queries

- Right-click on your database connection in the left sidebar and select "SQL Editor" > "New SQL Script".
- Enter your SQL queries in the editor and click the "Execute" button (play icon) to run them.
- View the results in the results pane below the editor.

### 2. Managing Tables

- Expand your database connection in the left sidebar, then navigate to "Databases" > "neondb" > "Schemas" > "public" > "Tables".
- Right-click on "Tables" to create a new table or manage existing ones (e.g., view, edit, or drop tables).

### 3. Importing and Exporting Data

- To import data:
  - Right-click on a table and select "Import Data".
  - Choose the source file (e.g., CSV) and follow the prompts to map the columns.
- To export data:
  - Right-click on a table and select "Export Data".
  - Choose the format (e.g., CSV, JSON) and follow the prompts to save the file.

## Conclusion

DBeaver is a powerful tool for managing your hosted Postgres database. With its intuitive interface and robust features, you can easily perform tasks such as creating tables, running queries, and visualizing data. By following this guide, you should be well-equipped to utilize DBeaver effectively for your database management needs.

<NeedHelp />
