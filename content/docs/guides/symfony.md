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
updatedOn: '2026-08-04T05:18:26.469Z'
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

## Configure the connection

In your `.env` file, set the `DATABASE_URL` to the Neon project connection string that you copied in the previous step.

```shell
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?charset=utf8&sslmode=require&channel_binding=require"
```

You can find the connection string for your database by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

## Next steps

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
