---
title: Connect from Laravel to Neon
subtitle: Set up a Neon project in seconds and connect from a Laravel application
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.061Z'
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
```

You can find all of the connection details listed above in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Connection issues

With older Postgres clients/drivers, including older PDO_PGSQL drivers, you may receive the following error when attempting to connect to Neon:

```txt shouldWrap
ERROR: The endpoint ID is not specified. Either upgrade the Postgres client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=endpoint%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

If you run into this error, please see the following documentation for an explanation of the issue and workarounds: [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

- If using a connection string to connect to your database, try [Workaround A. Pass the endpoint ID as an option](/docs/connect/connection-errors#a-pass-the-endpoint-id-as-an-option). For example:

  ```text
  postgresql://[user]:[password]@[neon_hostname]/[dbname]?options=endpoint%3D[endpoint-id]
  ```

  Replace `[endpoint_id]` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-cool-darkness-123456`.

- If using database connection parameters, as shown above, try [Workaround D. Specify the endpoint ID in the password field](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field). For example:

  ```text
  DB_PASSWORD=endpoint=<endpoint_id>$<password>
  ```

## Schema migration with Laravel

For schema migration with Laravel, see our guide:

<DetailIconCards>

<a href="/docs/guides/laravel-migrations" description="Schema migration with Neon Postgres and Laravel" icon="app-store" icon="app-store">Laravel Migrations</a>

</DetailIconCards>

<NeedHelp/>
