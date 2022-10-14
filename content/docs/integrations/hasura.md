---
title: Run a Hasura App
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/hasura
---

Hasura Cloud is an open source GraphQL engine that provides a scalable, highly available, globally distributed, secure GraphQL API for your data sources.

The following instructions describe how to connect a Hasura Cloud project to a new or existing Neon database.

## Connecting to a new Neon database

Use the following instructions to connect to a new Neon database. This connection method authenticates you from Hasura Cloud.

<video autoplay playsinline muted loop width="800" height="600">
<source type="video/mp4" src="https://user-images.githubusercontent.com/13738772/195619191-6de246e2-a47a-4ab3-a68f-c5d793cd5bb0.mp4" />
</video>

1. Navigate to [Hasura Cloud](https://cloud.hasura.io/projects) and sign up or log in.
1. On the Hasura Cloud dashboard, create a Hasura project.
1. After the project is initialized, click **Launch Console** to open the Hasura Console.
1. On the Hasura Console, navigate to **DATA** > **Manage** > **Connect Database** > **Create New Database**.
1. Click **Connect Neon Database**.
1. When prompted to login or sign up for Neon, we recommend selecting **Continue with Hasura** for seamless authentication.

After authenticating, a new Neon PostgreSQL database is created and connected to your Hasura project, and the Neon project connection string is associated with the `PG_DATABASE_URL` environment variable.

To start exploring Hasura's GraphQL API with data stored in Neon, see [Load a template in Hasura](#load-a-template-in-hasura-optional).

## Connecting to an existing Neon database

Use the following instructions to connect to an existing Neon database from Hasura Cloud. The connection is configured manually using a connection string.

### Prerequisites

- An existing Neon account. If you do not have one, see [Signing up](/docs/get-started-with-neon/signing-up).
- An existing Neon project. If you do not have a Neon project, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).
- A connection string for the Neon project that includes your password. For example:

  ```sh
  `postgres://<user>:<password>@<project_id>.cloud.neon.tech:5432/main`
  ```
  
  Your project's connection string can be found on the **Dashboard** tab in the Neon Console. If you have misplaced your password, you can either reset it or create a new user. Users are managed on the **Settings** tab in the Neon Console.

### Add the Neon project as a data source

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

If you are migrating to Neon from Hasura with Heroku PostgreSQL, refer to the [Migrate from Heroku](/docs/how-to-guides/hasura-heroku-migration) guide for data migration instructions. For general data import instructions, see [Importing a database](/docs/how-to-guides/import-an-extsing-database).