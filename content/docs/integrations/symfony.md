---
title: Run a Symfony app
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/symfony
---

Symfony is a free and open-source PHP web application framework. Symfony uses the Doctrine library for database access. Connecting to Neon from Symfony with Doctrine is the same as connecting to vanilla PostgreSQL from Symfony with Doctrine. Only the connection details differ.

This topic describes how to create a Neon project and connect to it from Symfony with Doctrine.

To connect to Neon from Symfony with Doctrine:

1. [Create a Neon Project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Enter a name for your project and click **Create Project**.
4. After creating a project, you are directed to the Neon **Dashboard** tab, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the **Dashboard** tab. Copy the connection string. It is required to configure the connection from Symfony.

## Configure the connection

In your `.env` file, set the `DATABASE_URL` to the Neon project connection string that you copied in the previous step.

```shell
DATABASE_URL="postgresql://<user>:<password>@<project_id>.cloud.neon.tech:5432/<dbname>?charset=utf8"
```

- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**
- `<password>` is the database user's password, which is provided to you when you create a Neon project
- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**
- `<dbname>` is the database name (the default Neon project database is `main`)