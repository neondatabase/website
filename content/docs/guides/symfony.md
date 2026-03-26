---
title: Connect from Symfony with Doctrine to Neon
subtitle: Set up a Neon project in seconds and connect from Symfony with Doctrine
summary: >-
  Step-by-step guide for connecting a Symfony application to a Neon project
  using Doctrine ORM, including project creation and configuration of the
  database connection settings.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/symfony
  - /docs/integrations/symfony
updatedOn: '2026-02-06T22:07:33.057Z'
---

<CopyPrompt src="/prompts/symfony-prompt.md" 
description="Pre-built prompt for connecting Symfony applications to Neon using Doctrine ORM."/>

Symfony is a free and open-source PHP web application framework. Symfony uses the Doctrine library for database access. Connecting to Neon from Symfony with Doctrine is the same as connecting to a standalone Postgres installation from Symfony with Doctrine. Only the connection details differ.

To connect to Neon from Symfony with Doctrine, choose **Connect with neon init** for a quick, guided setup or **Connect manually** for step-by-step instructions.

<Tabs labels={["Connect with neon init", "Connect manually"]}>

<TabItem>

To connect your Symfony app to Neon using AI-assisted setup:

<Steps>

## Create a Symfony project

1. Create a Symfony project if you do not have one. For instructions, see [Installing & Setting up the Symfony Framework](https://symfony.com/doc/current/setup.html), in the Symfony documentation.

2. Install the required dependencies:

   ```bash
   composer require doctrine/dbal doctrine/orm symfony/orm-pack
   ```

## Run neon init

1. From your Symfony project root, run [`neon init`](/docs/reference/cli-init):

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
- Configuring your Symfony app to connect to Neon
- Setting up [Neon Auth](/docs/auth/overview) for managed authentication, if your app needs it

</Steps>

<Admonition type="tip">
For details on what `neon init` creates and how to customize it, see the [CLI init reference](/docs/reference/cli-init).
</Admonition>

</TabItem>

<TabItem>

To connect to Neon from Symfony with Doctrine using manual setup:

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

## Add authentication (optional)

If your app requires user authentication, Neon provides [Neon Auth](/docs/auth/overview), a managed authentication service that branches with your database.

</Steps>

</TabItem>

</Tabs>

<NeedHelp/>
