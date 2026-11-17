---
title: Connect from Symfony with Doctrine to Neon
subtitle: Set up a project on Neon in seconds and connect from Symfony with Doctrine
summary: >-
  Connecting Symfony to Lakebase Postgres via Doctrine ORM requires only setting the
  DATABASE_URL in your .env file to a Lakebase Postgres connection string with sslmode=require
  and channel_binding=require. Choose this page when adding a serverless Postgres
  backend to a Symfony project using Doctrine for database access.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/symfony
  - /docs/integrations/symfony
updatedOn: '2026-09-16T19:45:35.340Z'
---

<CopyPrompt src="/prompts/symfony-prompt.md" 
description="Pre-built prompt for connecting Symfony applications to Lakebase Postgres using Doctrine ORM."/>

Symfony is a free and open-source PHP web application framework. Symfony uses the Doctrine library for database access. Connecting to a Lakebase Postgres database from Symfony with Doctrine is the same as connecting to a standalone Postgres installation from Symfony with Doctrine. Only the connection details differ.

To connect to a Lakebase Postgres database from Symfony with Doctrine:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Install Doctrine

If your Symfony project doesn't use Doctrine yet, install the ORM pack. Your PHP installation also needs the `pdo_pgsql` and `pgsql` extensions. Check for them with `php -m | grep pgsql`.

```shell
composer require symfony/orm-pack
```

## Configure the connection

Symfony reads the default `DATABASE_URL` from `.env`, which points to a local PostgreSQL server. Add the Neon project connection string that you copied in the first step to `.env.local`. Symfony loads that file on top of `.env`, and the default `.gitignore` excludes it, so your password stays out of version control.

```text filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?charset=utf8&sslmode=require&channel_binding=require"
```

You can find the connection string for your database by clicking the **Connect** button in the Console nav. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Test the connection

Run a query with the Doctrine console command. The output shows the Postgres version of your Neon database.

```shell
php bin/console dbal:run-sql "SELECT version()"
```

</Steps>

## Next steps

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
