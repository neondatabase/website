---
title: Use Neon with Cloudflare Workers
subtitle: Connect a Neon Postgres database to your Cloudflare Workers application
summary: >-
  How to connect a Neon Postgres database to a Cloudflare Workers application
  using Hyperdrive for optimized connection pooling or the Neon serverless
  driver for low-latency access.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.939Z'
---

[Cloudflare Workers](https://workers.cloudflare.com/) is a serverless platform allowing you to deploy your applications globally across Cloudflare's network. It supports running JavaScript, TypeScript, and WebAssembly, making it a great choice for high-performance, low-latency web applications.

This guide demonstrates how to connect to a Neon Postgres database from your Cloudflare Workers application using two approaches:

- **[Hyperdrive](https://developers.cloudflare.com/hyperdrive/)** (recommended): Cloudflare's connection pooling service that provides the lowest possible latencies by performing database connection setup and connection pooling across Cloudflare's network. Hyperdrive is included in all Workers plans and supports native PostgreSQL drivers like [node-postgres](https://node-postgres.com/).
- **[Neon serverless driver](/docs/serverless/serverless-driver)**: A low-latency Postgres driver designed for serverless environments that connects over HTTP or WebSockets.

<Admonition type="note">
Hyperdrive is the recommended approach as it provides optimized connection pooling and fast query routing by connecting directly to your database. When using Hyperdrive with Neon, use native PostgreSQL drivers like node-postgres or Postgres.js instead of the Neon serverless driver.
</Admonition>

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Cloudflare account. If you do not have one, sign up at [Cloudflare](https://dash.cloudflare.com/) to get started.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and deploy the Workers application.

## Setting up your Neon database

### Initialize a new project

Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

1. Click the **New Project** button to create a new project.

2. From the Neon **Dashboard**, navigate to the **SQL Editor** from the sidebar, and run the following SQL command to create a new table in your database:

   ```sql
   CREATE TABLE books_to_read (
       id SERIAL PRIMARY KEY,
       title TEXT,
       author TEXT
   );
   ```

   Next, insert some sample data into the `books_to_read` table so that you can query it later:

   ```sql
   INSERT INTO books_to_read (title, author)
   VALUES
       ('The Way of Kings', 'Brandon Sanderson'),
       ('The Name of the Wind', 'Patrick Rothfuss'),
       ('Coders at Work', 'Peter Seibel'),
       ('1984', 'George Orwell');
   ```

## Setting up your Cloudflare Workers project

<Tabs labels={["Hyperdrive (recommended)", "Neon serverless driver"]}>

<TabItem>

### Create a Hyperdrive user in Neon

To use Hyperdrive with Neon, you'll need to create a dedicated database role for Hyperdrive to use:

1. In the Neon Console, navigate to your project.
2. Select **Branches** from the sidebar, then select the branch you want to use.
3. Navigate to the **Roles & Databases** section.
4. Click **New Role** and enter `hyperdrive-user` as the name (or your preferred name).
5. **Copy the password** that is generated. You'll use this password in the connection string in the next step.

### Get your Neon connection string for Hyperdrive

1. In the Neon Console, select **Dashboard** from the sidebar.
2. Go to the **Connection Details** pane.
3. Select the **branch**, **database**, and **role** (for example, `hyperdrive-user`) that Hyperdrive will connect through.
4. Select **Connection String** from the dropdown menu.
5. **Important**: Uncheck the **Pooled connection** checkbox. Hyperdrive manages connection pooling, so you need the direct connection string.
6. Copy the connection string, which should look like this:

   ```bash
   postgres://hyperdrive-user:PASSWORD@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

### Create a new Worker project

Run the following command in a terminal window to set up a new Cloudflare Workers project:

```bash
npm create cloudflare@latest
```

This initiates an interactive CLI prompt to generate a new project. To follow along with this guide, you can use the following settings:

```bash
├ In which directory do you want to create your application?
│ type my-neon-worker
│
├ What would you like to start with?
│ select "Hello World example"
│
├ Which template would you like to use?
│ select "Worker only"
│
├ Which language do you want to use?
│ select "TypeScript"
│
├ Do you want to use git for version control?
│ select "Yes"
│
├ Do you want to deploy your application?
│ select "No"
```

For the purpose of demonstration, we will use the **Worker only** template and will deploy the application later.

Navigate to your project directory:

```bash
cd my-neon-worker
```

### Create a Hyperdrive configuration

If you are not already authenticated with your Cloudflare account, use the following command:

```bash
npx wrangler login
```

This command will open a browser window and prompt you to log into your Cloudflare account. After logging in, you can close the browser window and return to your terminal.

Now, create a Hyperdrive configuration with your Neon connection string:

```bash
npx wrangler hyperdrive create my-neon-hyperdrive --connection-string="postgres://USERNAME:PASSWORD@HOSTNAME:PORT/DATABASE"
```

Replace the placeholder values with your actual connection details from the previous step. You will then be prompted with "Would you like Wrangler to add it on your behalf?". Enter **Y**, and continue with the default name. This will add the required Hyperdrive configuration (bindings) to your project.

### Install the node-postgres driver

For Hyperdrive, we'll use the native PostgreSQL driver [node-postgres](https://node-postgres.com/):

```bash
npm install pg
npm install -D @types/pg
```

### Create types

To generate the types for your Hyperdrive binding, use the following command:

```bash
npm run cf-typegen
```

### Configure wrangler.jsonc

Update your `wrangler.jsonc` to add the **compatibility_flags** binding. We will also update the Hyperdrive binding and add the **localConnectionString**. This will allow our locally running application to connect to the Neon database via Hyperdrive. The complete `wrangler.jsonc` file should be as follows:

```json shouldWrap
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-neon-worker",
  "main": "src/index.ts",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "compatibility_date": "2025-09-27",
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<your-hyperdrive-id-here>",
      "localConnectionString": "postgres://USERNAME:PASSWORD@HOSTNAME:PORT/DATABASE"
    }
  ]
}
```

Replace the following placeholders:

- `localConnectionString` with your Neon connection string (the same one you used to create the Hyperdrive configuration). This is required for local development with `wrangler dev`.

### Implement the Worker script

Update the `src/index.ts` file in your project directory with the following code:

```ts
import { Client } from 'pg';

export default {
  async fetch(request, env, ctx) {
    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString
    });

    await client.connect();
    const result = await client.query('SELECT * FROM books_to_read;');

    // Clean up the client connection in the background
    ctx.waitUntil(client.end());

    return Response.json(result.rows);
  },
} satisfies ExportedHandler<Env>;
```

The `fetch` handler uses the Hyperdrive binding to connect to your Neon database through Cloudflare's optimized connection pooling service.

<Admonition type="important">
When using Hyperdrive with Neon, always use native PostgreSQL drivers like node-postgres (pg) or Postgres.js instead of the Neon serverless driver. Hyperdrive already provides optimized connection pooling and query routing for Workers.
</Admonition>

### Test the worker application locally

To test the worker application locally, run:

```bash
npm run dev
```

This command starts a local server and simulates the Cloudflare Workers environment.

```bash
❯ npm run dev

> my-neon-worker@0.0.0 dev
> wrangler dev


 ⛅️ wrangler 4.61.0
───────────────────
Your Worker has access to the following bindings:
Binding                                                Resource               Mode
env.HYPERDRIVE (YOUR_HYPERDRIVE_ID)      Hyperdrive Config      local

❓ Your types might be out of date. Re-run `wrangler types` to ensure your types are correct.
╭──────────────────────────────────────────────────────────────────────╮
│  [b] open a browser [d] open devtools [c] clear console [x] to exit  │
╰──────────────────────────────────────────────────────────────────────╯
⎔ Starting local server...
[wrangler:info] Ready on http://localhost:8787
```

Visit `http://localhost:8787` in your browser to test the worker application. It should return a JSON response with the list of books from the `books_to_read` table.

</TabItem>

<TabItem>

### Retrieve your Neon database connection string

Navigate to your **Project Dashboard** in the Neon Console and click **Connect** to open the **Connect to your database** modal to find your database connection string. Enable the **Connection pooling** toggle to add the `-pooler` option to your connection string. A pooled connection is recommended for serverless environments. For more information, see [Connection pooling](/docs/connect/connection-pooling).

Your pooled connection string should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Keep your connection string handy for later use.

### Create a new Worker project

Run the following command in a terminal window to set up a new Cloudflare Workers project:

```bash
npm create cloudflare@latest
```

This initiates an interactive CLI prompt to generate a new project. To follow along with this guide, you can use the following settings:

```bash
├ In which directory do you want to create your application?
│ type my-neon-worker
│
├ What would you like to start with?
│ select "Hello World example"
│
├ Which template would you like to use?
│ select "Worker only"
│
├ Which language do you want to use?
│ select "TypeScript"
│
├ Do you want to use git for version control?
│ select "Yes"
│
├ Do you want to deploy your application?
│ select "No"
```

We'll develop and test the application locally before deploying it to Cloudflare.

The `create-cloudflare` CLI installs the `Wrangler` CLI to manage the full workflow of testing and managing your Worker applications.

### Implement the Worker script

We'll use the [Neon serverless driver](/docs/serverless/serverless-driver) to connect to the Neon database, so you need to install it as a dependency:

```bash
npm install @neondatabase/serverless
```

Now, you can update the `src/index.ts` file in the project directory with the following code:

```ts
import { Client } from '@neondatabase/serverless';

export default {
  async fetch(request, env, ctx) {
    const client = new Client(env.DATABASE_URL);
    await client.connect();
    const { rows } = await client.query('SELECT * FROM books_to_read;');
    return new Response(JSON.stringify(rows));
  },
} satisfies ExportedHandler<Env>;
```

The `fetch` handler defined above gets called when the worker receives an HTTP request. It will query the Neon database to fetch the full list of books in our to-read list.

### Test the worker application locally

You first need to configure the `DATABASE_URL` environment variable to point to our Neon database. You can do this by creating a `.dev.vars` file at the root of the project directory with the following content:

```text
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

Now, to test the worker application locally, you can use the `wrangler` CLI which comes with the Cloudflare project setup.

```bash
npm run dev
```

This command starts a local server and simulates the Cloudflare Workers environment.

```bash
❯ npm run dev
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

```
[{"id":1,"title":"The Way of Kings","author":"Brandon Sanderson"},{"id":2,"title":"The Name of the Wind","author":"Patrick Rothfuss"},{"id":3,"title":"Coders at Work","author":"Peter Seibel"},{"id":4,"title":"1984","author":"George Orwell"}]
```

</TabItem>

</Tabs>

## Deploying your application with Cloudflare Workers

### Authenticate Wrangler with your Cloudflare account

If you aren't authenticated, run the following command to link the Wrangler tool to your Cloudflare account:

```bash
npx wrangler login
```

This command will open a browser window and prompt you to log into your Cloudflare account. After logging in and approving, you can close the browser window and return to your terminal.

### Configure secrets

<Admonition type="note">
If you're using **Hyperdrive**, your connection is already configured in the `wrangler.jsonc` file, so you can skip this step and proceed directly to publishing your Worker.

If you're using the **Neon serverless driver**, you need to add your connection string as a secret.
</Admonition>

For the Neon serverless driver approach, use Wrangler to add your Neon database connection string as a secret to your Worker:

```bash
npx wrangler secret put DATABASE_URL
```

When prompted, paste your pooled Neon connection string.

### Publish your Worker application

Now, you can deploy your application to Cloudflare Workers by running the following command:

```bash
npm run deploy
```

The Wrangler CLI will output the URL of your Worker hosted on the Cloudflare platform. Visit this URL in your browser or use `curl` to verify the deployment works as expected.

```text
❯ npm run deploy
 ⛅️ wrangler 3.28.1
-------------------
Total Upload: 189.98 KiB / gzip: 49.94 KiB
Uploaded my-neon-worker (4.03 sec)
Published my-neon-worker (5.99 sec)
  https://my-neon-worker.anandishan2.workers.dev
Current Deployment ID: de8841dd-46e4-436d-b2c4-569e91f54c72
```

## Removing the example application and Neon project

To delete your Worker, you can use the Cloudflare dashboard or run `wrangler delete` from your project directory, specifying your project name. Refer to the [Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/commands/#delete-3) for more details.

If you used Hyperdrive, you should also delete the Hyperdrive configuration:

```bash
npx wrangler hyperdrive delete my-neon-hyperdrive
```

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-cloudflare-workers" description="Connect a Neon Postgres database to your Cloudflare Workers application" icon="github">Use Neon with Cloudflare Workers</a>
</DetailIconCards>

## Resources

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [node-postgres](https://node-postgres.com/)
- [Neon serverless driver](/docs/serverless/serverless-driver)
- [Neon](https://neon.tech)

<NeedHelp/>
