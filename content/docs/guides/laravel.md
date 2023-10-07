---
title: Connect from Laravel to Neon
subtitle: Set up a Neon project in seconds and connect from a Laravel application
enableTableOfContents: true
updatedOn: '2023-10-07T08:16:00.569Z'
---

Laravel is a web application framework with expressive, elegant syntax. Connecting to Neon from Laravel is the same as connecting to a standalone Postgres installation from Laravel. Only the connection details differ.

To connect to Neon from Laravel:

1. [Create a Neon Project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Configure the connection

Open the `.env` file in your Laravel app, and replace all the database credentials.

```shell
DB_CONNECTION=pgsql
DB_HOST=[neon_hostname]
DB_PORT=5432
DB_DATABASE=[dbname]
DB_USERNAME=[user]
DB_PASSWORD=[password]
DB_SSLMODE=require
```

You can find all of the connection details listed above in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Need help?

To get help from our support team, open a ticket from the console. Look for the **Support** link in the left sidebar. For more detail, see [Getting Support](/docs/introduction/support). You can also join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon.
