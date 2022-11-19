---
title: Connect from Laravel to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/laravel
  - /docs/integrations/laravel
---

Laravel is a web application framework with expressive, elegant syntax. Connecting to Neon from Laravel is the same as connecting to a standalone PostgreSQL installation from Laravel. Only the connection details differ.

To connect to Neon from Laravel:

1. [Create a Neon Project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, and click **Create Project**.
4. After creating a project, you are directed to the Neon **Dashboard** tab, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the **Dashboard** tab.

## Configure the connection

Open the `.env` file in your Laravel app, and replace all the database credentials.

```shell
DB_CONNECTION=pgsql
DB_HOST=<project_id>.cloud.neon.tech
DB_PORT=5432
DB_DATABASE=<dbname>
DB_USERNAME=<user>
DB_PASSWORD=<password>
```

where:

- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.
- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.
- `<dbname>` is the database name (the default Neon project database is `main`).
