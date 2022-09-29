---
title: Run a Hasura App
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/hasura
---

Hasura Cloud is an open source GraphQL engine that provides a scalable, highly available, globally distributed, secure GraphQL API for your data sources.

The following instructions describe how to connect to a new or existing Neon database from Hasura Cloud.

## Connecting to a new Neon database

Use the following instructions to connect to a new Neon database that is created for you when connecting a Hasura Cloud project to Neon. This connection method authenticates you with Neon from Hasura Cloud. If you do not have a Neon account, one is created for you.

1. Navigate to [Hasura Cloud](https://cloud.hasura.io/signup/?pg=docs&plcmt=body&cta=navigate-to-hasura-cloud&tech=default) and sign up or log in.
1. Create a Hasura Cloud project.
    1. On the Hasura Cloud dashboard, select **New Project**.
    1. After the project is initialized successfully, click **Launch Console** to open the Hasura Console.
    1. Select **DATA** from the top navigation bar.
    1. Select the **Create New Database** tab.
    1. Click **Connect Neon Database**. If you are not logged in to Neon already, you are directed to a Neon authorization dialog.
    1. Select an authentication option.  
    1. In the Neon authorization dialog, click **Authorize**.

       A message appears at the top right of the Hasura Console indicating that a data source is being added. A subsequent message indicates that the data source was added successfully and provides a **View Database** button, which directs you to the *Data Manager* dialog in the Hasura Console, opened to the default `public` schema your Neon database.

To start using your Neon database from the Hasura Console, see [Next steps](#next-steps).

You can also access your new database from the [Neon Console](https://console.neon.tech/app/projects).
  
## Connecting to an existing Neon database

Use the following instructions to connect to an existing Neon database from Hasura Cloud. The connection is configured manually using a Neon project connection string.

### Prerequisites

- An existing Neon account. If you do not have one, see [Signing up](../get-started-with-neon/signing-up).
- An existing Neon project. If you do not have a Neon project, see [Setting up a project](../get-started-with-neon/setting-up-a-project.md).
- A connection string for the Neon project that includes your password. For example:  `postgres://<user>:<password>@<project_id>.cloud.neon.tech:5432/main`. Your project's connection string can be found on the **Dashboard** tab in the Neon Console. If you have misplaced your password, you can either reset it or create a new user.

### Add the Neon project as a data source

In this section, you navigate to Hasura Cloud, where you configure a connection to your Neon project.

1. Navigate to [Hasura Cloud](https://cloud.hasura.io/signup/?pg=docs&plcmt=body&cta=navigate-to-hasura-cloud&tech=default) and sign up or log in.
1. Click **Create Project** to create a Hasura Cloud project or click **Launch Console** to open an existing project.
1. Select **DATA** from the top navigation bar. 
1. On the **Connect Existing Database** tab, paste your connection string into the **Database URL** field.
1. Enter a display name for your database in the **Database Display Name** field, and click **Connect Database**.

Hasura Cloud connects to your Neon project and automatically discovers the default `public` schema.

To start using your Neon database from the Hasura Console, see [Next steps](#next-steps).

## Next steps

Optionally, follow the instructions in this section create a table in your Neon database from the Hasura Console, create an endpoint, and run a `cURL` command using your new endpoint.

### Create a table

After your Neon database is connected to Hasura, you can create a table from the Hasura Console.

1. In Hasura, select **DATA** from the navigation bar and click **Create Table**.
1. On the **Add a New Table** dialog, enter a table name (`t`), a column name (`text`), and select a column type (`Text`).
1. Select the `text` column as the **Primary Key**.
1. Click **Add Table**.
1. Add rows to the table using the **Insert Row** tab.

### Create an API endpoint

1. Navigate to the **API** tab. On the **GraphiQL** tab, query the table with GraphQL, for example:

    ```graphql
    query MyQuery {
      t {
        text
      }
    }
    ```

2. Save the GraphQL query as an HTTP API endpoint by clicking the **REST** tab. Call the endpoint `query_t` and save it as a `GET` method.

### Run a cURL command

From a terminal, use the endpoint with cURL to query the table contents:

Your terminal should appear similar to the following:

```bash
$ curl -H 'x-hasura-admin-secret: {admin_secret}' https://<hasura_project_name>.hasura.app/api/rest/query_t
{"t":[{"text":"test"}]}
 ```