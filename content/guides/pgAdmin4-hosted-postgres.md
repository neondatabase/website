---
title: Using pgAdmin4 with a Hosted Postgres
subtitle: A comprehensive guide on how to manage your Postgres database using pgAdmin4.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-11-29T00:00:00.000Z'
updatedOn: '2024-11-29T00:00:00.000Z'
---

pgAdmin4 is a powerful web-based administration tool for managing PostgreSQL databases. This guide will walk you through the steps to set up and use pgAdmin4 with a hosted Postgres database, enabling you to perform various database operations efficiently.

## Table of Contents

- [Setting Up pgAdmin4](#setting-up-pgadmin4)
- [Connecting to Your Hosted Postgres Database](#connecting-to-your-hosted-postgres-database)
- [Basic Operations in pgAdmin4](#basic-operations-in-pgadmin4)
- [Conclusion](#conclusion)

## Setting Up pgAdmin4

1. **Download and Install pgAdmin4**: If you haven't already, download pgAdmin4 from the [official website](https://www.pgadmin.org/download/). Follow the installation instructions for your operating system.

2. **Launch pgAdmin4**: Open pgAdmin4 from your applications menu or web browser.

## Provisioning a Serverless Postgres

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and enter the name of your choice as the project name.

You will then be presented with a dialog that provides a connecting string of your database. Make sure to **uncheck** the **Pooled connection checkbox** on the top right of the dialog and the connecting string automatically updates in the box below it.

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
- `?sslmode=require` an optional query parameter that enforces the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode while connecting to the Postgres instance for better security.

You will be using these connecting string components further in the guide. Proceed further in this guide to connect pgAdmin4 to your Postgres.

## Connecting to Your Hosted Postgres Database

1. **Open pgAdmin4**: Once pgAdmin4 is running, you will see the dashboard.

2. **Create a New Server Connection**:
   - Right-click on "Servers" in the left sidebar and select "Create" > "Server...".
   - In the "Create - Server" dialog, enter a name for your server connection.

3. **Configure Connection Settings**:
   - Go to the "Connection" tab.
   - Enter the following details:
     - **Host**: The endpoint of your hosted Postgres database (e.g., `ep-...us-east-2.aws.neon.tech`).
     - **Port**: The port number (default is `5432`).
     - **Maintenance database**: Your database name.
     - **Username**: Your database username.
     - **Password**: Your database password (you can save the password if desired).

4. **Save the Connection**: Click "Save" to create the server connection. You should now see your server listed in the left sidebar.

![](/guides/images/pg-notify/pgAdmin4.png)

## Basic Operations in pgAdmin4

### 1. Running SQL Queries

- Click on your database in the left sidebar.
- Click on the "Query Tool" icon (or right-click the database and select "Query Tool").
- Enter your SQL queries in the editor and click the "Execute" button (play icon) to run them.

### 2. Managing Tables

- Expand your database in the left sidebar, then expand the "Schemas" > "public" > "Tables" section.
- Right-click on "Tables" to create a new table or manage existing ones.

### 3. Importing and Exporting Data

- To import data, right-click on a table and select "Import/Export".
- Follow the prompts to upload a CSV file or export data to a file.

## Conclusion

pgAdmin4 is an essential tool for managing your hosted Postgres database. With its user-friendly interface, you can easily perform various database operations, from creating databases and tables to running complex queries. By following this guide, you should be well-equipped to utilize pgAdmin4 effectively.

<NeedHelp />
