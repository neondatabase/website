---
title: Connect from Laravel to Neon
subtitle: Set up a Neon project in seconds and connect from a Laravel application
summary: >-
  Step-by-step guide for creating a Neon project and configuring a Laravel
  application to connect to Neon Postgres, including troubleshooting connection
  issues with older Postgres clients.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.000Z'
---

<CopyPrompt src="/prompts/laravel-prompt.md" 
description="Pre-built prompt for connecting Laravel to Neon Postgres"/>

Laravel is a web application framework with expressive, elegant syntax. Connecting to Neon from Laravel is the same as connecting to a standalone Postgres installation from Laravel. Only the connection details differ.

To connect to Neon from Laravel, choose **Connect with neon init** for a quick, guided setup or **Connect manually** for step-by-step instructions.

<Tabs labels={["Connect with neon init", "Connect manually"]}>

<TabItem>

To connect your Laravel app to Neon using AI-assisted setup:

<Steps>

## Create a Laravel project

Create a Laravel project if you do not have one. For instructions, see [Installation](https://laravel.com/docs/installation), in the Laravel documentation.

## Run neon init

1. From your Laravel project root, run [`neon init`](/docs/reference/cli-init):

   ```bash
   npx neonctl@latest init
   ```

2. Follow the interactive prompts to sign up for Neon (or log in) and select your editor(s). This installs the AI development tooling for your coding environment:
   - MCP server
   - Agent skills
   - IDE extensions
   - Plugins

3. **Restart your editor** to pick up the new tooling.

## Ask your AI assistant to get started

Open your AI assistant's chat and type:

> Get started with Neon

Your AI assistant will walk you through:

- Creating a database branch in a new or existing Neon project
- Storing the connection string in your project's `.env` file
- Installing the appropriate client libraries
- Configuring your Laravel app to connect to Neon
- Setting up [Neon Auth](/docs/auth/overview) for managed authentication, if your app needs it

</Steps>

<Admonition type="tip">
For details on what `neon init` creates and how to customize it, see the [CLI init reference](/docs/reference/cli-init).
</Admonition>

</TabItem>

<TabItem>

To connect to Neon from Laravel using manual setup:

<Steps>

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

You can find your database connection details by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Add authentication (optional)

If your app requires user authentication, Neon provides [Neon Auth](/docs/auth/overview), a managed authentication service that branches with your database.

</Steps>

</TabItem>

</Tabs>

## Connection issues

With older Postgres clients/drivers, including older PDO_PGSQL drivers, you may receive the following error when attempting to connect to Neon:

```txt shouldWrap
ERROR: The endpoint ID is not specified. Either upgrade the Postgres client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=endpoint%3D'. See [https://neon.com/sni](/sni) for more information.
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
