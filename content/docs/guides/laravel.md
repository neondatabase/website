---
title: Connect from Laravel to Neon
subtitle: Set up a Neon project in seconds and connect from a Laravel application
summary: >-
  Connect a Laravel application to Lakebase Postgres by setting the DB_CONNECTION,
  DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, and DB_PASSWORD variables in
  your .env file. Also covers the "endpoint ID is not specified" SNI error
  that affects older PDO_PGSQL or libpq drivers, with workarounds for passing
  the endpoint ID as a URL option or in the password field.
enableTableOfContents: true
updatedOn: '2026-09-16T19:45:35.340Z'
---

<CopyPrompt src="/prompts/laravel-prompt.md" 
description="Pre-built prompt for connecting Laravel to Lakebase Postgres"/>

[Laravel](https://laravel.com/) is a PHP web application framework. Connecting to Neon from Laravel is the same as connecting to any Postgres database from Laravel. Only the connection details differ.

To connect to Neon from Laravel:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Configure the connection

Open the `.env` file in your Laravel app and replace the database settings. New Laravel projects use `DB_CONNECTION=sqlite` with the other `DB_*` lines commented out; replace them with the following:

```shell
DB_CONNECTION=pgsql
DB_HOST=[neon_hostname]
DB_PORT=5432
DB_DATABASE=[dbname]
DB_USERNAME=[user]
DB_PASSWORD=[password]
DB_SSLMODE=require
```

If you have a connection string (`postgresql://[user]:[password]@[neon_hostname]/[dbname]`), copy its parts into the matching variables. The pooled hostname (with `-pooler`) works with these settings.

You can find your database connection details by clicking the **Connect** button in the Console nav. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Test the connection

Run Laravel's default migrations against your Neon database, then show the connection details:

```shell
php artisan migrate
php artisan db:show
```

`db:show` lists the Postgres version, your Neon host, and the tables the migrations created.

</Steps>

## Connection issues

With older Postgres clients/drivers, including older PDO_PGSQL drivers, you may receive the following error when attempting to connect to Neon:

```txt shouldWrap
ERROR: The endpoint ID is not specified. Either upgrade the Postgres client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=endpoint%3D'. See [https://neon.com/sni](/sni) for more information.
```

If you run into this error, see the following for an explanation of the issue and workarounds: [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

- If using a connection string to connect to your database, try [Workaround A. Pass the endpoint ID as an option](/docs/connect/connection-errors#a-pass-the-endpoint-id-as-an-option). For example:

  ```text
  postgresql://[user]:[password]@[neon_hostname]/[dbname]?options=endpoint%3D[endpoint_id]
  ```

  Replace `[endpoint_id]` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-cool-darkness-123456`.

- If using database connection parameters, as shown above, try [Workaround D. Specify the endpoint ID in the password field](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field). For example:

  ```text
  DB_PASSWORD=endpoint=<endpoint_id>$<password>
  ```

## Schema migration with Laravel

For schema migration with Laravel, see:

<DetailIconCards>

<a href="/docs/guides/laravel-migrations" description="Schema migration with Lakebase Postgres and Laravel" icon="app-store">Laravel Migrations</a>

</DetailIconCards>

## Next steps

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
