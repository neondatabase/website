---
title: Connect from Hasura Cloud to Neon
subtitle: Learn how to connect a Hasura Cloud project to a new or existing Neon database
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/hasura
  - /docs/integrations/hasura
updatedOn: '2023-10-19T23:10:12.829Z'
---

Hasura Cloud is an open source GraphQL engine that provides a scalable, highly available, globally distributed, secure GraphQL API for your data sources.

## Connecting to a new Neon database

Use the following instructions to connect to a new Neon database. This connection method authenticates you from Hasura Cloud.

<video autoPlay playsInline muted loop width="800" height="600">
  <source type="video/mp4" src="https://user-images.githubusercontent.com/48465000/200608247-a050bdc0-3f38-447f-a5a0-75835d7a0238.mp4"/>
  <source type="video/webm" src="https://user-images.githubusercontent.com/48465000/200608356-d4bb7f27-d9d5-49c9-b923-13e82c4cfc44.webm"/>
</video>

1. Navigate to [Hasura Cloud](https://cloud.hasura.io/projects) and sign up or log in.
1. On the Hasura Cloud dashboard, create a Hasura project.
1. After the project is initialized, click **Launch Console** to open the Hasura Console.
1. On the Hasura Console, navigate to **DATA** > **Manage** > **Connect Database** > **Create New Database**.
1. Click **Connect Neon Database**.
1. When prompted to login or sign up for Neon, we recommend selecting **Continue with Hasura** for seamless authentication.

After authenticating, a new Neon Postgres database is created and connected to your Hasura project, and the Neon project connection string is associated with the `PG_DATABASE_URL` environment variable.

To start exploring Hasura's GraphQL API with data stored in Neon, see [Load a template in Hasura](#load-a-template-in-hasura-optional).

## Connecting to an existing Neon database

Use the following instructions to connect to an existing Neon database from Hasura Cloud. The connection is configured manually using a connection string.

### Prerequisites

- An existing Neon account. If you do not have one, see [Sign up](/docs/get-started-with-neon/signing-up).
- An existing Neon project. If you do not have a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- A connection string for a branch in your Neon project:

  ```text
  postgres://[user]:[password]@[neon_hostname]/[dbname]
  ```

  Your project's connection string can be found on the Neon **Dashboard**, under **Connection Details**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

### Add Neon as a data source

The following steps describe how to navigate to Hasura Cloud and connect to your Neon project.

1. Navigate to [Hasura Cloud](https://cloud.hasura.io/projects) and sign up or log in.
1. Click **Create Project** to create a Hasura Cloud project or click **Launch Console** to open an existing project.
1. Select **DATA** from the top navigation bar.
1. On the **Connect Existing Database** tab, paste your connection string into the **Database URL** field.
1. Enter a display name for your database in the **Database Display Name** field, and click **Connect Database**.

Hasura Cloud connects to your Neon project and automatically discovers the default `public` schema.

To start exploring Hasura's GraphQL API with data stored in Neon, see [Load a template in Hasura](#load-a-template-in-hasura-optional).

## Load a template in Hasura (optional)

Optionally, after connecting from your Hasura project to Neon, you can explore Hasura's GraphQL API by loading a template from Hasura's template gallery. Follow these steps to load the `Welcome to Hasura` template, which creates `customer` and `order` tables and populates them with sample data.

1. In the Hasura Console, select **DATA**.
1. Under **Data Manager**, select your database.
1. From the **Template Gallery**, select **Welcome to Hasura** to install the template.

To view the newly created tables from the Neon Console:

1. In the Hasura Console, select **DATA** > **Manage your Neon databases** to open the Neon Console.
2. In the Neon Console, select your project.
3. Select the **Tables** tab. The newly created `customer` and `order` tables should appear under the **Tables** heading in the sidebar.

## Import existing data to Neon

If you are migrating from Hasura with Heroku Postgres to Neon, refer to the [Import data from Heroku](/docs/import/import-from-heroku) guide for data import instructions. For general data import instructions, see [Import data from Postgres](/docs/import/import-from-postgres).

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
