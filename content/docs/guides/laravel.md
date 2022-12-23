---
title: Connect from Laravel to Neon
enableTableOfContents: true
---

Laravel is a web application framework with expressive, elegant syntax. Connecting to Neon from Laravel is the same as connecting to a standalone PostgreSQL installation from Laravel. Only the connection details differ.

To connect to Neon from Laravel:

1. [Create a Neon Project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

## Configure the connection

Open the `.env` file in your Laravel app, and replace all the database credentials.

```shell
DB_CONNECTION=pgsql
DB_HOST=<endpoint_hostname>
DB_PORT=5432
DB_DATABASE=<dbname>
DB_USERNAME=<user>
DB_PASSWORD=<password>
```

where:

- `<endpoint_hostname>` the hostname of the branch endpoint. The endpoint hostname has an `ep-` prefix and appears similar to this: `ep-tight-salad-272396.us-east-2.aws.neon.tech`.
- `<dbname>` is the database name. The default database is `neondb`.
- `<user>` is the database user.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

You can find all of the connection details listed above, except for your password,  in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](../../connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](../../manage/users/#reset-a-password).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
