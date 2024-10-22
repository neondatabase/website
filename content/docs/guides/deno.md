---
title: Use Neon with Deno Deploy
subtitle: Connect a Neon Postgres database to your Deno Deploy application
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.649Z'
---

[Deno Deploy](https://deno.com/deploy) is a scalable serverless platform for running JavaScript, TypeScript, and WebAssembly at the edge, designed by the creators of Deno. It simplifies the deployment process and offers automatic scaling, zero-downtime deployments, and global distribution.

This guide demonstrates how to connect to a Neon Postgres database from a simple Deno application that uses [deno-postgres](https://deno.land/x/postgres@ls) driver to interact with the database.

The guide covers two deployment options:

- [Deploying your application locally with Deno Runtime](#deploy-your-application-locally-with-deno-runtime)
- [Deploying your application with the Deno Deploy serverless platform](#deploy-your-application-with-deno-deploy)

## Prerequisites

To follow the instructions in this guide, you will need:

- A Neon project. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- To use the Deno Deploy serverless platform, you require a Deno Deploy account. Visit [Deno Deploy](https://deno.com/deploy) to sign up or log in.

## Retrieve your Neon database connection string

Retrieve your database connection string from the **Connection Details** widget in the Neon Console.

Your connection string should look something like this:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

You'll need the connection string a little later in the setup.

## Deploy your application locally with Deno Runtime

Deno Runtime is an open-source runtime for TypeScript and JavaScript. The following instructions describe how to deploy an example application locally using Deno Runtime.

### Install the Deno Runtime and deployctl

Follow the [Install Deno and deployctl](https://docs.deno.com/deploy/manual/#install-deno-and-deployctl) instructions in the Deno documentation to install the Deno runtime and `deployctl` command-line utility on your local machine.

### Create the example application

Next, create the `server.ts` script on your local machine.

```ts
// server.ts

import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

const databaseUrl = Deno.env.get('DATABASE_URL')!;

const pool = new postgres.Pool(databaseUrl, 3, true);

const connection = await pool.connect();
try {
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL
    );
  `;

  // Check if the table is empty by getting the count of rows
  const result = await connection.queryObject<{ count: number }>`
    SELECT COUNT(*) AS count FROM books;
  `;
  const bookCount = Number(result.rows[0].count);

  if (bookCount === 0) {
    // The table is empty, insert the book records
    await connection.queryObject`
      INSERT INTO books (title, author) VALUES
        ('The Hobbit', 'J. R. R. Tolkien'),
        ('Harry Potter and the Philosopher''s Stone', 'J. K. Rowling'),
        ('The Little Prince', 'Antoine de Saint-Exupéry');
    `;
  }
} finally {
  connection.release();
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname !== '/books') {
    return new Response('Not Found', { status: 404 });
  }

  const connection = await pool.connect();
  try {
    switch (req.method) {
      case 'GET': {
        const result = await connection.queryObject`SELECT * FROM books`;
        const body = JSON.stringify(result.rows, null, 2);
        return new Response(body, {
          headers: { 'content-type': 'application/json' },
        });
      }
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (err) {
    console.error(err);
    return new Response(`Internal Server Error\n\n${err.message} `, {
      status: 500,
    });
  } finally {
    connection.release();
  }
});
```

The script creates a table named `books` in the `neondb` database if it does not exist and inserts some data into it. It then starts a server that listens for requests on the `/books` endpoint. When a request is received, the script returns data from the `books` table.

### Run the script locally

To run the script locally, set the `DATABASE_URL` environment variable to the Neon connection string you copied earlier.

```bash
export DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

Then, run the command below to start the app server. The `--allow-env` flag allows the script to access the environment variables, and the `--allow-net` flag allows the script to make network requests. If the Deno runtime prompts you to allow these permissions, enter `y` to continue.

```bash
deno run --allow-env --allow-net server.ts
```

### Query the endpoint

You can request the `/books` endpoint with a `cURL` command to view the data returned by the script:

```bash
curl http://localhost:8000/books
```

The `cURL` command should return the following data:

```json
[
  {
    "id": 1,
    "title": "The Hobbit",
    "author": "J. R. R. Tolkien"
  },
  {
    "id": 2,
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J. K. Rowling"
  },
  {
    "id": 3,
    "title": "The Little Prince",
    "author": "Antoine de Saint-Exupéry"
  }
]%
```

## Deploy your application with Deno Deploy

Deno Deploy is a globally distributed platform for serverless JavaScript applications. Your code runs on managed servers geographically close to your users, enabling low latency and faster response times. Deno Deploy applications run on light-weight V8 isolates powered by the Deno runtime.

### Set up the project

1. If you have not done so already, install the `deployctl` command-line utility, as described [above](#install-the-deno-runtime-and-deployctl).
1. If you have not done so already, create the example `server.ts` application on your local machine, as described [above](#create-the-example-application).
1. Register or log in to [Deno](https://deno.com/) and navigate to the [Create a project](https://dash.deno.com/new) page, where you can select a project template for your preferred framework, link a code repo, or create an empty project.
1. The example application in this guide is a simple Deno script you've created locally, so let's select the **Create an empty project** option. Note the name of your Deno Deploy project. You will need it in a later step. Projects are given a generated Heroku-style name, which looks something like this: `cloudy-otter-57`.
1. Click the `Settings` button and add a `DATABASE_URL` environment variable. Set the value to your Neon connection string and click **Save**.
1. To authenticate `deployctl` from the terminal, you will need an access token for your Deno Deploy account. Navigate back to your [Deno dashboard](https://dash.deno.com/account#access-tokens) and create a new access token. Copy the token value and set the `DENO_DEPLOY_TOKEN` environment variable on your local machine by running this command from your terminal:

   ```bash
   export DENO_DEPLOY_TOKEN=YOUR_ACCESS_TOKEN
   ```

### Deploy using deployctl

To deploy the application, navigate to the directory of your `server.ts` application, and run the following command:

```bash
deployctl deploy --project=YOUR_DENO_DEPLOY_PROJECT_NAME --prod server.ts
```

The `--prod` flag specifies that the application should be deployed to the production environment.

The `deployctl` command deploys the application to the Deno Deploy serverless platform. Once the deployment is complete, you'll see a message similar to the following:

```bash
$ deployctl deploy --project=cloudy-otter-57 --prod server.ts
✔ Deploying to project cloudy-otter-57.
  ℹ The project does not have a deployment yet. Automatically pushing initial deployment to production (use --prod for further updates).
✔ Entrypoint: /home/ubuntu/neon-deno/server.ts
ℹ Uploading all files from the current dir (/home/ubuntu/neon-deno)
✔ Found 1 asset.
✔ Uploaded 1 new asset.
✔ Production deployment complete.
✔ Created config file 'deno.json'.

View at:
 - https://cloudy-otter-57-8csne31fymac.deno.dev
 - https://cloudy-otter-57.deno.dev
```

### Verifying the deployment

You can now access the application at the URL specified in the output. You can verify its connection to your Neon database by visiting the `/books` endpoint in your browser or using `cURL` to see if the data is returned as expected.

```bash
$ curl https://cloudy-otter-57.deno.dev/books
[
  {
    "id": 1,
    "title": "The Hobbit",
    "author": "J. R. R. Tolkien"
  },
  {
    "id": 2,
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J. K. Rowling"
  },
  {
    "id": 3,
    "title": "The Little Prince",
    "author": "Antoine de Saint-Exupéry"
  }
]
```

To check the health of the deployment or modify settings, navigate to the [Project Overview](https://dash.deno.com/account/projects) page and select your project from the **Projects** list.

### Deploying using GitHub

When deploying a more complex Deno application, with custom build steps, you can use Deno's GitHub integration. The integration lets you link a Deno Deploy project to a GitHub repository. For more information, see [Deploying with GitHub](https://docs.deno.com/deploy/manual/how-to-deploy).

## Removing the example application and Neon project

To delete the example application on Deno Deploy, follow these steps:

1. From the Deno Deploy [dashboard](https://dash.deno.com/account/projects), select your **Project**.
1. Select the **Settings** tab.
1. In the **Danger Zone** section, click **Delete** and follow the instructions.

To delete your Neon project, refer to [Delete a project](/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-deno" description="Connect a Neon Postgres database to your Deno Deploy application" icon="github">Use Neon with Deno Deploy</a>
</DetailIconCards>

## Resources

- [Deno Deploy](https://deno.com/deploy)
- [Deno Runtime Quickstart](https://docs.deno.com/runtime/manual)
- [Deno Deploy Quickstart](https://docs.deno.com/deploy/manual/)
- [deno-postgres driver](https://deno.land/x/postgres@ls)

<NeedHelp/>
