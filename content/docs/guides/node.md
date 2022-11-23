---
title: Connect a Node.js application to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/node
  - /docs/integrations/node
---

This guide describes how to create a Neon project and connect to it from a Node.js application. You can find the below code sample on [GitHub](https://github.com/neondatabase/examples/tree/main/with-nodejs).

<Admonition type="note">
The same configuration steps can be used for Express and Next.js applications.
</Admonition>

To connect to Neon from a Node.js application:

1. [Create a Neon Project](#create-a-neon-project)
2. [Create a NodeJS project and add dependencies](#create-a-nodejs-project-and-add-dependencies)
3. [Store your Neon credentials](#store-your-neon-credentials)
4. [Configure the app.js file](#configure-the-appjs-file)
5. [Run app.js](#run-appjs)

## Create a Neon project

When creating a Neon project, take note of the endpoint hostname, database name, user, and password. This information is required when configuring connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

For additional information about creating projects, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

## Create a NodeJS project and add dependencies

1. Create a NodeJS project and change to the newly created directory.

   ```shell
   mkdir neon-nodejs-example
   cd neon-nodejs-example
   npm init -y
   ```

2. Add project dependencies using the following command:

   ```shell
   npm install postgres dotenv
   ```

## Store your Neon credentials

Store your Neon credentials in your `.env` file.

```shell
PGHOST='<endpoint_hostname>:<port>'
PGDATABASE='<dbname>'
PGUSER='<username>'
PGPASSWORD='<password>'
ENDPOINT_ID='<endpoint_id>'
```

where:

- `<endpoint_hostname>` the hostname of the branch endpoint, which is found on the Neon **Dashboard**, under **Connection Settings**.
- `<dbname>` is the name of the database in your Neon project. `main` is the default database created with each Neon project.
- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project.
- `<endpoint_id>` is the ID of the branch endpoint that you are connecting to, which can be found on the Neon **Dashboard**, under **Connection Settings**. The `<endpoint_id>` starts with an `ep-` prefix, as in this example: `ep-steep-forest-654321`.

<Admonition type="important">
To ensure the security of your data, never expose your Neon credentials to the browser.
</Admonition>

## Configure the app.js file

To connect to the database using the PostgreSQL client and your Neon credentials, add the following code to the `app.js` file:

```javascript
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPostgresVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPostgresVersion();
```

## Run app.js

Run `node app.js` to view the result.

```shell
node app.js

Result(1) [
  {
    version: 'PostgreSQL 15.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
  }
]
```
