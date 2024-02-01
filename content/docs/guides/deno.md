---
title: Use Neon with Deno Deploy
subtitle: Connect a Neon Postgres database to your Deno Deploy application
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.385Z'
---

[Deno Deploy](https://deno.com/deploy) is a scalable serverless platform for running JavaScript, TypeScript, and WebAssembly at the edge, designed by the creators of Deno. It simplifies the deployment process and offers automatic scaling, zero-downtime deployments, and global distribution.

This guide demonstrates how to connect a Neon Postgres database with an application deployed on Deno Deploy. To follow the instructions in this guide, you will need:

- A Deno Deploy account to deploy your application. Visit [Deno Deploy](https://deno.com/deploy) to sign up or log in.
- A Neon account to deploy your Postgres database. If you do not have one, sign up at [Neon](https://neon.tech). 

The example application in this guide is a simple Deno application that uses the `postgres` module to interact with the database. 

## Create a Neon project

1. Navigate to the [Neon Console](https://console.neon.tech/).
1. Select **Create a project**.
1. Enter a name for the project (`neon-deno`, for example), and select a Postgres version and region.
1. Click **Create project**.

After the project is created, the project dashboard will contain a section specifying your Neon connection string, which appears similar to the following:

```bash
postgres://[user]:[password]@[neon_hostname]/[dbname]
```

Store this value in a safe place. It is required later. The connection string specifies `neondb` as the database. This is the ready-to-use database created with each Neon project. You will use this database with the example application.  

## Install Deno and test the application locally

Follow the instructions on the [Deno website](https://docs.deno.com/deploy/manual/#install-deno-and-deployctl) to install the Deno runtime (to run Deno scripts locally) and `deployctl`(CLI to deploy projects to Deno Deploy) on your local machine. 

Next, we write a simple script `server.ts` that connects to the Neon database and returns the data from the `neondb` database. 

```ts
// server.ts

import { serve } from "https://deno.land/std@0.214.0/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const databaseUrl = Deno.env.get("DATABASE_URL")!;

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

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname !== "/books") {
    return new Response("Not Found", { status: 404 });
  }

  const connection = await pool.connect();

  try {
    switch (req.method) {
      case "GET": {
        const result = await connection.queryObject`SELECT * FROM books`;
        const body = JSON.stringify(result.rows, null, 2);
        return new Response(body, {
          headers: { "content-type": "application/json" },
        });
      }
      default:
        return new Response("Method Not Allowed", { status: 405 });
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

The script creates a table named `books` in the `neondb` database and inserts some data into it. It then starts a server that listens for requests on the `/books` endpoint. When a request is received, the script returns the data from the `books` table.

To run the script locally, set the `DATABASE_URL` environment variable to the Neon connection string you copied earlier. 
    
```bash
export DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

Then, run the command below to start the app server. The `--allow-env` flag allows the script to access the environment variables, and the `--allow-net` flag allows the script to make network requests. If the Deno runtime prompts you to allow these permissions, enter `y` to continue. 

```bash
deno run --allow-env --allow-net server.ts
```

You can curl the `/books` endpoint to see the data returned by the script:

```bash
curl http://localhost:8000/books
```

## Deploy your application with Deno Deploy

### Set up the project
1. Register/log in to your Deno Deploy dashboard, and navigate to the [New Project](https://dash.deno.com/new) page. 
1. Our application is a simple Deno script, so we select the `Create an empty project` option. 
1. Click on the `Settings` button and add the following environment variable:

    ```bash
    DATABASE_URL=YOUR_NEON_CONNECTION_STRING
    ```
1. To authenticate `deployctl` from the terminal, we will need an access token to our Deno Deploy account. Navigate back to the [dashboard](https://dash.deno.com/account#access-tokens) and create a new access token. Copy the token value and set the following environment variable in the terminal:

    ```bash
    export DENO_DEPLOY_TOKEN=YOUR_ACCESS_TOKEN
    ```

### Deploy using deployctl

To deploy this application, navigate to the directory with `server.ts` and run the following command:

```bash
deployctl deploy --project=YOUR_DENO_DEPLOY_PROJECT_NAME --prod server.ts
```

Make sure the `DENO_DEPLOY_TOKEN` environment variable is correctly set. The `--prod` flag specifies that the application should be deployed to the production environment. 

The `deployctl` command will deploy the application to the Deno Deploy platform. Once the deployment is complete, you will see a message similar to the following:

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

### Verifying the Deployment

The application can now be accessed at the URL specified in the output. You can verify its connection to the Neon database by visiting the `/books` endpoint in the browser, or using a tool like `curl` to see if the data is returned as expected. 

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

To check the health of the deployment and modify any settings, navigate to the [dashboard page](https://dash.deno.com/account/projects) for the project. 

### Deploying using Github

When deploying a more complex Deno application, with custom build steps, you should use the Github integeration to deploy your application. For more information, see [Deploying with GitHub](https://docs.deno.com/deploy/manual/ci_github).

## Removing the example application and Neon project

To delete the example application on Deno Deploy to avoid incurring any charges, follow these steps:

1. From the Deno Deploy [dashboard](https://dash.deno.com/account/projects), navigate to the **Project** to delete.
1. On the **Settings** tab, select **Danger Zone** and click **Delete**.

To delete your Neon project, refer to [Delete a project](/docs/manage/projects#delete-a-project).
