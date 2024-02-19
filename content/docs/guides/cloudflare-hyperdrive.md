---
title: Use Neon with Cloudflare Hyperdrive
subtitle: Connect Cloudflare Hyperdrive to your Neon Postgres database for faster queries
enableTableOfContents: true
updatedOn: '2024-02-12T00:00:00.000Z'
---

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) is a serverless application that proxies queries to Postgres databases, and accelerates them. It works by maintaining a globally distributed pool of connections to your database, and routing queries to the closest available connection. 

This is specifically useful for serverless applications which can't maintain a persistent database connection and need to establish a new connection for each request. Hyperdrive can significantly reduce the latency of these queries and improve latency for your users.

This guide demonstrates how to configure a `Hyperdrive` service to connect to your Neon Postgres database. We then implement a regular `Workers` application that connects to the `Hyperdrive` service rather than the `Neon` databse directly, and benefit from the performance improvements that Hyperdrive provides. 

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.

- A Cloudflare account. If you do not have one, sign up for [Cloudflare Workers](https://workers.cloudflare.com/) to get started. 

    **NOTE**: You need to be on Cloudflare Workers' paid subscription plan to use Hyperdrive.

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and deploy our Workers application. 

## Setting up your Neon database

### Initialize a new project

Log in to the Neon console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

- Click the `New Project` button to create a new project.

- From your project dashboard, navigate to the `SQL Editor` from the sidebar, and run the following SQL command to create a new table in your database:

    ```sql
    CREATE TABLE books_to_read (
        id SERIAL PRIMARY KEY,
        title TEXT,
        author TEXT
    );
    ```

    Next, we insert some sample data into the `books_to_read` table, so we can query it later:

    ```sql
    INSERT INTO books_to_read (title, author)
    VALUES
        ('The Way of Kings', 'Brandon Sanderson'),
        ('The Name of the Wind', 'Patrick Rothfuss'),
        ('Coders at Work', 'Peter Seibel'),
        ('1984', 'George Orwell');
    ```

### Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Setting up your Hyperdrive service


## Setting up your Cloudflare Workers application

### Create a new Worker project

Run the following command in a terminal window to set up a new Cloudflare Workers project:

```bash
npm create cloudflare@latest
```

This initiates an interactive CLI prompt to generate a new project. To follow along with this guide, you can use the following settings:
```bash
├ In which directory do you want to create your application?
│ dir ./my-neon-worker
│
├ What type of application do you want to create?
│ type "Hello World" Worker
│
├ Do you want to use TypeScript?
│ no typescript
```

When asked if you want to deploy your application, select `no`. We'll develop and test the application locally before deploying it to Cloudflare Workers platform.

The `create-cloudflare` CLI also installs the `Wrangler` tool to manage the full workflow of testing and managing your Worker applications. 

### Implement the Worker script

We'll use the `node-postgres` library to connect to the Postgres database (directly to Neon first, later we will connect to the Hyperdrive service), so you need to install it as a dependency:

```bash
npm install pg
```

Now, you can update the `src/index.js` file in the project directory with the following code:

```javascript
import pkg from 'pg';

const { Client } = pkg;
const client = new Client({ connectionString: env.DATABASE_URL });
await client.connect();

export default {
  async fetch(request, env, ctx) {
    const { rows } = await client.query('SELECT * FROM books_to_read;');
    return new Response(JSON.stringify(rows));
  }
}
```

The `fetch` handler defined above gets called when the worker receives an HTTP request. It will query the Neon database to fetch the full list of books in our to-read list. 

### Test the worker application locally

You first need to configure the `DATABASE_URL` environment variable to point to our Neon database. You can do this by creating a `.dev.vars` file at the root of the project directory with the following content:

```text
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

Now, to test the worker application locally, you can use the `wrangler` CLI which comes with the Cloudflare project setup.

```bash
npx wrangler dev
```

This command starts a local server and simulates the Cloudflare Workers environment.

```bash
❯ npx wrangler dev
 ⛅️ wrangler 3.28.1
-------------------
Using vars defined in .dev.vars
Your worker has access to the following bindings:
- Vars:
  - DATABASE_URL: "(hidden)"
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

You can visit `http://localhost:8787` in your browser to test the worker application. It should return a JSON response with the list of books from the `books_to_read` table. 

## Setting up Cloudflare Hyperdrive

<!-- TODO: https://developers.cloudflare.com/hyperdrive/get-started/ -->

With our Workers apllication able to query the Neon database, we will now set up Cloudflare Hyperdrive to connect to Neon and accelerate the database queries. 

### Create a new Hyperdrive service

You can use the `Wrangler` CLI to create a new Hyperdrive service, using your Neon database connection string from earlier:

```bash
npx wrangler hyperdrive create neon_example --connection-string=$NEON_DATABASE_CONNECTION_STRING
```

This command creates a new Hyperdrive service named `neon_example`, and outputs its configuration details. Copy the `id` field from the output, which we will use next. 

### Bind the Worker project to Hyperdrive

Cloudflare workers uses `Bindings` to interact with other resources on the Cloudflare platform. We will update the `wrangler.toml` file in the project directory to bind our Worker project to the Hyperdrive service. Add the following lines to the `wrangler.toml` file:

```toml
node_compat=true

[[hyperdrive]]
binding = "HYPERDRIVE"
id = $id-from-previous-step
```

This lets us access the Hyperdrive service from our Worker application using the `HYPERDRIVE` binding. 

### Update the Worker script to use Hyperdrive

Now, you can update the `src/index.js` file in the project directory to use the Hyperdrive service to connect to the Neon database:

```javascript
import pkg from 'pg';

const { Client } = pkg;
const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
await client.connect();

export default {
  async fetch(request, env, ctx) {
    const { rows } = await client.query('SELECT * FROM books_to_read;');
    return new Response(JSON.stringify(rows));
  }
}
```

### Deploy the updated Worker 

Now that we have updated the Worker script to use the Hyperdrive service, we can deploy the updated Worker to the Cloudflare Workers platform:

```bash
npx wrangler deploy
```

## Removing the example application and Neon project

To delete your Worker, you can use the Cloudflare dashboard or run `wrangler delete` from your project directory, specifying your project name. Refer to the [Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/commands/#delete-3) for more details.

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Resources

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Neon](https://neon.tech)

<NeedHelp/>
