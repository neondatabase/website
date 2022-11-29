---
title: Connect from Symfony with Doctrine to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/symfony
  - /docs/integrations/symfony
---

Symfony is a free and open-source PHP web application framework. Symfony uses the Doctrine library for database access. Connecting to Neon from Symfony with Doctrine is the same as connecting to a standalone PostgreSQL installation from Symfony with Doctrine. Only the connection details differ.

To connect to Neon from Symfony with Doctrine:

1. [Create a Neon Project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.
4. After creating a project, you are directed to the Neon **Dashboard**, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the Neon Console or refresh the browser page. Copy the connection string. It is required to configure the connection from Symfony.

## Configure the connection

In your `.env` file, set the `DATABASE_URL` to the Neon project connection string that you copied in the previous step.

```shell
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>:5432/<dbname>?charset=utf8"
```

where:

- `<user>` is the database user, which is found on the Neon **Dashboard**, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.
- `<endpoint_hostname>` the hostname of the branch endpoint, which is found on the Neon Dashboard, under **Connection Settings**.
- `<dbname>` is the database name (the default Neon project database is `main`).
